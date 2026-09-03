'use strict';

const path = require('path');
const crypto = require('crypto');
const express = require('express');
const db = require('./db');
const { notifyNewBooking, notifyConfirmedBooking, emailEnabled } = require('./mailer');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Config ----------
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
const ROUND_TRIP_MULTIPLIER = 1.8; // round trip = 1.8x one-way
const EXTRA_DAY_RATE = 0.5;        // each additional day adds 50% of the route base fare

// In-memory session tokens (fine for a single-server first version)
const sessions = new Set();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Helpers ----------
function genRef() {
  return 'VR-' + Date.now().toString(36).toUpperCase() + '-' +
    crypto.randomBytes(2).toString('hex').toUpperCase();
}

function computePrice(route, van, tripType, days) {
  const d = Math.max(1, parseInt(days, 10) || 1);
  // Day 1 = full fare; each extra day adds EXTRA_DAY_RATE of the base fare.
  let price = route.base_price * (1 + (d - 1) * EXTRA_DAY_RATE);
  price *= van.multiplier;
  if (tripType === 'round-trip') price *= ROUND_TRIP_MULTIPLIER;
  return Math.round(price);
}

function requireAdmin(req, res, next) {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (token && sessions.has(token)) return next();
  return res.status(401).json({ error: 'Unauthorized. Please log in as admin.' });
}

// ---------- Public API ----------

// Vans + routes for the booking form
app.get('/api/vans', (req, res) => {
  const vans = db.prepare('SELECT id, name, capacity, multiplier FROM vans WHERE active = 1 ORDER BY capacity').all();
  res.json(vans);
});

app.get('/api/routes', (req, res) => {
  const routes = db.prepare('SELECT id, origin, destination, region, base_price, distance_km FROM routes WHERE active = 1 ORDER BY region, destination').all();
  res.json(routes);
});

// Price quote (no booking)
app.post('/api/quote', (req, res) => {
  const { route_id, van_id, trip_type, days } = req.body || {};
  const route = db.prepare('SELECT * FROM routes WHERE id = ? AND active = 1').get(route_id);
  const van = db.prepare('SELECT * FROM vans WHERE id = ? AND active = 1').get(van_id);
  if (!route || !van) return res.status(400).json({ error: 'Invalid van or route selected.' });
  const price = computePrice(route, van, trip_type === 'round-trip' ? 'round-trip' : 'one-way', days);
  res.json({ price });
});

// Create a booking
app.post('/api/bookings', (req, res) => {
  const {
    customer_name, customer_phone, customer_email,
    van_id, route_id, trip_date, trip_time,
    trip_type, days, passengers, notes
  } = req.body || {};

  if (!customer_name || !customer_phone || !van_id || !route_id || !trip_date || !trip_time) {
    return res.status(400).json({ error: 'Please fill in all required fields.' });
  }

  const route = db.prepare('SELECT * FROM routes WHERE id = ? AND active = 1').get(route_id);
  const van = db.prepare('SELECT * FROM vans WHERE id = ? AND active = 1').get(van_id);
  if (!route || !van) return res.status(400).json({ error: 'Invalid van or route selected.' });

  const type = trip_type === 'round-trip' ? 'round-trip' : 'one-way';
  const numDays = Math.max(1, parseInt(days, 10) || 1);
  const pax = Math.max(1, parseInt(passengers, 10) || 1);
  if (pax > van.capacity) {
    return res.status(400).json({ error: `That van seats ${van.capacity}. Please reduce passengers or pick a bigger van.` });
  }

  const price = computePrice(route, van, type, numDays);
  const reference = genRef();

  const info = db.prepare(`
    INSERT INTO bookings
      (reference, customer_name, customer_phone, customer_email, van_id, route_id,
       trip_date, trip_time, trip_type, days, passengers, notes, price, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `).run(reference, customer_name, customer_phone, customer_email || null,
    van_id, route_id, trip_date, trip_time, type, numDays, pax, notes || null, price);

  // Email alert: new booking (fire-and-forget, never blocks the response)
  notifyNewBooking({
    reference, customer_name, customer_phone, customer_email,
    origin: route.origin, destination: route.destination,
    van_name: van.name, trip_date, trip_time, trip_type: type,
    days: numDays, passengers: pax, notes, price
  });

  res.json({
    ok: true,
    reference,
    id: info.lastInsertRowid,
    price,
    days: numDays,
    van: van.name,
    route: `${route.origin} → ${route.destination}`,
    trip_type: type
  });
});

// ---------- Admin API ----------

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = crypto.randomBytes(24).toString('hex');
    sessions.add(token);
    return res.json({ ok: true, token });
  }
  return res.status(401).json({ error: 'Invalid username or password.' });
});

app.post('/api/admin/logout', requireAdmin, (req, res) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  sessions.delete(token);
  res.json({ ok: true });
});

// All bookings (with joins)
app.get('/api/admin/bookings', requireAdmin, (req, res) => {
  const rows = db.prepare(`
    SELECT b.*, v.name AS van_name, v.capacity AS van_capacity,
           r.origin, r.destination
    FROM bookings b
    JOIN vans v ON v.id = b.van_id
    JOIN routes r ON r.id = b.route_id
    ORDER BY b.trip_date ASC, b.trip_time ASC
  `).all();
  res.json(rows);
});

// Update booking status
app.patch('/api/admin/bookings/:id', requireAdmin, (req, res) => {
  const { status } = req.body || {};
  const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status.' });

  const prev = db.prepare('SELECT status FROM bookings WHERE id = ?').get(req.params.id);
  db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, req.params.id);

  // Email alert: only when a booking BECOMES confirmed (not on repeat saves)
  if (status === 'confirmed' && (!prev || prev.status !== 'confirmed')) {
    const b = db.prepare(`
      SELECT b.*, v.name AS van_name, r.origin, r.destination
      FROM bookings b JOIN vans v ON v.id = b.van_id JOIN routes r ON r.id = b.route_id
      WHERE b.id = ?
    `).get(req.params.id);
    if (b) notifyConfirmedBooking(b);
  }

  res.json({ ok: true });
});

app.delete('/api/admin/bookings/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM bookings WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ---------- Price management (price hikes) ----------

// Update a single route's base price
app.patch('/api/admin/routes/:id', requireAdmin, (req, res) => {
  const price = Number(req.body?.base_price);
  if (!Number.isFinite(price) || price < 0) {
    return res.status(400).json({ error: 'Invalid price.' });
  }
  db.prepare('UPDATE routes SET base_price = ? WHERE id = ?').run(Math.round(price), req.params.id);
  res.json({ ok: true });
});

// Update a single van's price multiplier
app.patch('/api/admin/vans/:id', requireAdmin, (req, res) => {
  const mult = Number(req.body?.multiplier);
  if (!Number.isFinite(mult) || mult <= 0) {
    return res.status(400).json({ error: 'Invalid multiplier.' });
  }
  db.prepare('UPDATE vans SET multiplier = ? WHERE id = ?').run(mult, req.params.id);
  res.json({ ok: true });
});

// Bulk price hike: increase (or decrease) ALL route base fares by a percentage
app.post('/api/admin/price-adjust', requireAdmin, (req, res) => {
  const pct = Number(req.body?.percent);
  if (!Number.isFinite(pct) || pct <= -100) {
    return res.status(400).json({ error: 'Enter a valid percentage (e.g. 10 for +10%).' });
  }
  const factor = 1 + pct / 100;
  const info = db.prepare('UPDATE routes SET base_price = CAST(ROUND(base_price * ?) AS INTEGER) WHERE active = 1').run(factor);
  res.json({ ok: true, updated: info.changes, percent: pct });
});

// Admin: full route + van lists (with all fields) for the pricing panel
app.get('/api/admin/pricing', requireAdmin, (req, res) => {
  const routes = db.prepare('SELECT id, origin, destination, region, base_price, distance_km FROM routes WHERE active = 1 ORDER BY region, destination').all();
  const vans = db.prepare('SELECT id, name, capacity, multiplier FROM vans WHERE active = 1 ORDER BY capacity').all();
  res.json({ routes, vans });
});

// Monthly summary for a given year
app.get('/api/admin/summary', requireAdmin, (req, res) => {
  const year = String(req.query.year || new Date().getFullYear());
  const rows = db.prepare(`
    SELECT
      CAST(strftime('%m', trip_date) AS INTEGER) AS month,
      COUNT(*) AS bookings,
      SUM(CASE WHEN status != 'cancelled' THEN price ELSE 0 END) AS revenue,
      SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) AS confirmed,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled
    FROM bookings
    WHERE strftime('%Y', trip_date) = ?
    GROUP BY month
    ORDER BY month
  `).all(year);

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1, bookings: 0, revenue: 0,
    confirmed: 0, pending: 0, completed: 0, cancelled: 0
  }));
  for (const r of rows) months[r.month - 1] = { ...months[r.month - 1], ...r };

  const years = db.prepare(`SELECT DISTINCT strftime('%Y', trip_date) AS y FROM bookings ORDER BY y DESC`).all().map(r => r.y);
  res.json({ year, months, years });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Van rental server running on http://0.0.0.0:${PORT}`);
});
