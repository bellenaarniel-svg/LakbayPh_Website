'use strict';

// ============================================================
//  FACEBOOK MESSENGER CONFIG
//  👉 Change ONLY this to your real Facebook Page username/handle
//     (the part after facebook.com/). No "@", no full URL needed.
//     Example: if your page is facebook.com/LakbayPHTravel,
//     set FB_PAGE = 'LakbayPHTravel'.
// ============================================================
const FB_PAGE = 'LakbayPHTravelandToursInc';

// Bundled fallback catalog (used only if the live API is unreachable, e.g. sandboxed preview)
const FALLBACK_VANS = [{"id": 3, "name": "Toyota Grandia GL", "capacity": 12, "multiplier": 1.15}, {"id": 1, "name": "Nissan Urvan Standard", "capacity": 15, "multiplier": 1}, {"id": 2, "name": "Nissan Urvan Premium (High Roof)", "capacity": 18, "multiplier": 1.25}];
const FALLBACK_ROUTES = [{"id": 31, "origin": "Metro Manila", "destination": "Caramoan", "region": "Bicol Region", "base_price": 20000, "distance_km": 560}, {"id": 30, "origin": "Metro Manila", "destination": "Donsol, Sorsogon", "region": "Bicol Region", "base_price": 19000, "distance_km": 580}, {"id": 29, "origin": "Metro Manila", "destination": "Legazpi / Mayon, Albay", "region": "Bicol Region", "base_price": 17000, "distance_km": 520}, {"id": 28, "origin": "Metro Manila", "destination": "Naga City", "region": "Bicol Region", "base_price": 15000, "distance_km": 450}, {"id": 10, "origin": "Metro Manila", "destination": "Antipolo / Rizal", "region": "CALABARZON", "base_price": 2800, "distance_km": 30}, {"id": 5, "origin": "Metro Manila", "destination": "Batangas Pier", "region": "CALABARZON", "base_price": 5500, "distance_km": 110}, {"id": 7, "origin": "Metro Manila", "destination": "Laiya, San Juan", "region": "CALABARZON", "base_price": 6500, "distance_km": 150}, {"id": 8, "origin": "Metro Manila", "destination": "Lucena / Quezon", "region": "CALABARZON", "base_price": 6000, "distance_km": 135}, {"id": 6, "origin": "Metro Manila", "destination": "Nasugbu / Calatagan", "region": "CALABARZON", "base_price": 6000, "distance_km": 120}, {"id": 9, "origin": "Metro Manila", "destination": "Pagsanjan Falls", "region": "CALABARZON", "base_price": 5000, "distance_km": 95}, {"id": 4, "origin": "Metro Manila", "destination": "Tagaytay", "region": "CALABARZON", "base_price": 4500, "distance_km": 60}, {"id": 27, "origin": "Metro Manila", "destination": "Isabela (Ilagan / Santiago)", "region": "Cagayan Valley", "base_price": 15000, "distance_km": 400}, {"id": 26, "origin": "Metro Manila", "destination": "Tuguegarao, Cagayan", "region": "Cagayan Valley", "base_price": 18000, "distance_km": 480}, {"id": 17, "origin": "Metro Manila", "destination": "Aurora (Baler)", "region": "Central Luzon", "base_price": 9500, "distance_km": 230}, {"id": 13, "origin": "Metro Manila", "destination": "Bataan (Balanga / Morong)", "region": "Central Luzon", "base_price": 6000, "distance_km": 140}, {"id": 12, "origin": "Metro Manila", "destination": "Clark / Angeles, Pampanga", "region": "Central Luzon", "base_price": 5500, "distance_km": 100}, {"id": 16, "origin": "Metro Manila", "destination": "Nueva Ecija (Cabanatuan)", "region": "Central Luzon", "base_price": 6500, "distance_km": 155}, {"id": 11, "origin": "Metro Manila", "destination": "Subic / Olongapo", "region": "Central Luzon", "base_price": 6000, "distance_km": 130}, {"id": 15, "origin": "Metro Manila", "destination": "Tarlac City", "region": "Central Luzon", "base_price": 5500, "distance_km": 125}, {"id": 14, "origin": "Metro Manila", "destination": "Zambales (Iba / San Antonio)", "region": "Central Luzon", "base_price": 7000, "distance_km": 200}, {"id": 36, "origin": "Metro Manila", "destination": "Bohol (Tagbilaran)", "region": "Central Visayas", "base_price": 42000, "distance_km": 1150}, {"id": 35, "origin": "Metro Manila", "destination": "Cebu City", "region": "Central Visayas", "base_price": 40000, "distance_km": 1100}, {"id": 18, "origin": "Metro Manila", "destination": "Baguio City", "region": "Cordillera (CAR)", "base_price": 9500, "distance_km": 250}, {"id": 20, "origin": "Metro Manila", "destination": "Banaue Rice Terraces", "region": "Cordillera (CAR)", "base_price": 14000, "distance_km": 350}, {"id": 19, "origin": "Metro Manila", "destination": "Sagada", "region": "Cordillera (CAR)", "base_price": 14000, "distance_km": 400}, {"id": 42, "origin": "Metro Manila", "destination": "Davao City", "region": "Davao Region", "base_price": 52000, "distance_km": 1600}, {"id": 37, "origin": "Metro Manila", "destination": "Tacloban City", "region": "Eastern Visayas", "base_price": 30000, "distance_km": 900}, {"id": 21, "origin": "Metro Manila", "destination": "La Union (San Juan)", "region": "Ilocos Region", "base_price": 10500, "distance_km": 270}, {"id": 24, "origin": "Metro Manila", "destination": "Laoag, Ilocos Norte", "region": "Ilocos Region", "base_price": 18000, "distance_km": 490}, {"id": 25, "origin": "Metro Manila", "destination": "Pagudpud", "region": "Ilocos Region", "base_price": 19000, "distance_km": 560}, {"id": 22, "origin": "Metro Manila", "destination": "Pangasinan (Hundred Islands)", "region": "Ilocos Region", "base_price": 9000, "distance_km": 250}, {"id": 23, "origin": "Metro Manila", "destination": "Vigan, Ilocos Sur", "region": "Ilocos Region", "base_price": 16000, "distance_km": 400}, {"id": 39, "origin": "Metro Manila", "destination": "El Nido, Palawan", "region": "MIMAROPA", "base_price": 50000, "distance_km": 1450}, {"id": 40, "origin": "Metro Manila", "destination": "Puerto Galera, Oriental Mindoro", "region": "MIMAROPA", "base_price": 8000, "distance_km": 150}, {"id": 38, "origin": "Metro Manila", "destination": "Puerto Princesa, Palawan", "region": "MIMAROPA", "base_price": 45000, "distance_km": 1200}, {"id": 2, "origin": "Metro Manila", "destination": "Makati / BGC", "region": "Metro Manila", "base_price": 2200, "distance_km": 15}, {"id": 1, "origin": "Metro Manila", "destination": "NAIA Airport Transfer", "region": "Metro Manila", "base_price": 2500, "distance_km": 20}, {"id": 3, "origin": "Metro Manila", "destination": "Quezon City", "region": "Metro Manila", "base_price": 2000, "distance_km": 15}, {"id": 45, "origin": "Metro Manila", "destination": "Other destination (custom quote)", "region": "Nationwide", "base_price": 5000, "distance_km": null}, {"id": 41, "origin": "Metro Manila", "destination": "Cagayan de Oro", "region": "Northern Mindanao", "base_price": 48000, "distance_km": 1500}, {"id": 44, "origin": "Metro Manila", "destination": "General Santos City", "region": "SOCCSKSARGEN", "base_price": 54000, "distance_km": 1650}, {"id": 34, "origin": "Metro Manila", "destination": "Bacolod City", "region": "Western Visayas", "base_price": 34000, "distance_km": 1000}, {"id": 33, "origin": "Metro Manila", "destination": "Boracay (Caticlan)", "region": "Western Visayas", "base_price": 30000, "distance_km": 700}, {"id": 32, "origin": "Metro Manila", "destination": "Iloilo City", "region": "Western Visayas", "base_price": 32000, "distance_km": 950}, {"id": 43, "origin": "Metro Manila", "destination": "Zamboanga City", "region": "Zamboanga Peninsula", "base_price": 55000, "distance_km": 1700}];


// ---------- State ----------
let VANS = [];
let ROUTES = [];
let TOKEN = localStorage.getItem('vr_token') || null;
let OFFLINE = localStorage.getItem('vr_offline') === '1';
let ALL_BOOKINGS = [];

// Calendar state
let CAL_YEAR = new Date().getFullYear();
let CAL_MONTH = new Date().getMonth(); // 0-11

// Notifications: ids the admin has already seen (persisted)
let SEEN_IDS = JSON.parse(localStorage.getItem('vr_seen_ids') || '[]');

// Default admin credentials (used for the local/offline fallback check only).
const DEFAULT_ADMIN = { user: 'admin', pass: 'admin123' };

const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH');
const $ = (id) => document.getElementById(id);
const vanEmoji = (cap) => cap >= 15 ? '🚌' : (cap >= 12 ? '🚐' : '🚙');

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', async () => {
  $('year').textContent = new Date().getFullYear();
  // min booking date = today
  const today = new Date().toISOString().split('T')[0];
  $('bookDate').min = today;

  initChatWidget();

  await loadCatalog();
  wireForms();

  // If a token exists, reopen the dashboard
  if (TOKEN) openDashboard();
});

async function loadCatalog() {
  // 1) Fill the DAY dropdowns first — this needs no network, so it always works.
  fillDayOptions();

  // 2) Try to load live catalog; fall back to a bundled snapshot if the
  //    network is unavailable (e.g. sandboxed preview) so dropdowns never end up empty.
  try {
    const [vans, routes] = await Promise.all([
      fetch('/api/vans').then(r => { if (!r.ok) throw new Error('vans'); return r.json(); }),
      fetch('/api/routes').then(r => { if (!r.ok) throw new Error('routes'); return r.json(); })
    ]);
    VANS = vans;
    ROUTES = routes;
  } catch (err) {
    console.warn('Live catalog unavailable, using bundled fallback:', err);
    VANS = FALLBACK_VANS;
    ROUTES = FALLBACK_ROUTES;
  }

  populateCatalog();
}

function fillDayOptions() {
  const dayOpts = Array.from({ length: 30 }, (_, i) => {
    const d = i + 1;
    return `<option value="${d}">${d} day${d > 1 ? 's' : ''}</option>`;
  }).join('');
  $('qqDays').innerHTML = dayOpts;
  $('bookDays').innerHTML = dayOpts;
}

function populateCatalog() {
  $('statVans').textContent = VANS.length;
  $('statRoutes').textContent = ROUTES.length;

  const routeOpts = buildRouteOptions();
  const vanOpts = VANS.map(v => `<option value="${v.id}">${v.name} (${v.capacity} seats)</option>`).join('');
  $('qqRoute').innerHTML = routeOpts;
  $('bookRoute').innerHTML = routeOpts;
  $('qqVan').innerHTML = vanOpts;
  $('bookVan').innerHTML = vanOpts;

  renderFleet();
  renderRoutes();
  updateQuickQuote();
  updateBookingPrice();
}

// Group routes by region into <optgroup> for the dropdowns
function buildRouteOptions() {
  const groups = {};
  for (const r of ROUTES) {
    const key = r.region || 'Other';
    (groups[key] = groups[key] || []).push(r);
  }
  return Object.keys(groups).map(region => {
    const opts = groups[region]
      .map(r => `<option value="${r.id}">${r.destination}</option>`).join('');
    return `<optgroup label="${region}">${opts}</optgroup>`;
  }).join('');
}

function renderFleet() {
  $('fleetGrid').innerHTML = VANS.map(v => `
    <div class="van-card">
      <div class="van-emoji">${vanEmoji(v.capacity)}</div>
      <h3>${v.name}</h3>
      <div class="van-cap">${v.capacity} passengers</div>
      <div class="van-badge">${v.multiplier === 1 ? 'Standard rate' : '×' + v.multiplier + ' rate'}</div>
    </div>
  `).join('');
}

function renderRoutes() {
  $('routesBody').innerHTML = ROUTES.map(r => `
    <tr>
      <td>${r.region || '—'}</td>
      <td>${r.destination}</td>
      <td>${r.distance_km ? '~' + r.distance_km + ' km' : 'Custom'}</td>
      <td><b>${peso(r.base_price)}</b></td>
    </tr>
  `).join('');
}

// ---------- Pricing (client-side estimate, server is source of truth) ----------
const EXTRA_DAY_RATE = 0.5; // must match server

function estimate(routeId, vanId, tripType, days) {
  const route = ROUTES.find(r => r.id == routeId);
  const van = VANS.find(v => v.id == vanId);
  if (!route || !van) return 0;
  const d = Math.max(1, parseInt(days, 10) || 1);
  let p = route.base_price * (1 + (d - 1) * EXTRA_DAY_RATE);
  p *= van.multiplier;
  if (tripType === 'round-trip') p *= 1.8;
  return Math.round(p);
}

function updateQuickQuote() {
  const p = estimate($('qqRoute').value, $('qqVan').value, $('qqType').value, $('qqDays').value);
  $('qqPrice').textContent = peso(p);
}

function updateBookingPrice() {
  const days = $('bookDays').value;
  const type = $('bookType').value;
  const p = estimate($('bookRoute').value, $('bookVan').value, type, days);
  $('bookPrice').textContent = peso(p);
  const parts = [`${days} day${days > 1 ? 's' : ''}`, type];
  $('priceBreakdown').textContent = '(' + parts.join(' • ') + ')';
}

// ---------- Wiring ----------
function wireForms() {
  ['qqRoute', 'qqVan', 'qqType', 'qqDays'].forEach(id => $(id).addEventListener('change', updateQuickQuote));
  ['bookRoute', 'bookVan', 'bookType', 'bookDays'].forEach(id => $(id).addEventListener('change', updateBookingPrice));

  // Quick quote -> copy selection into booking form
  $('qqBookBtn').addEventListener('click', () => {
    $('bookRoute').value = $('qqRoute').value;
    $('bookVan').value = $('qqVan').value;
    $('bookType').value = $('qqType').value;
    $('bookDays').value = $('qqDays').value;
    updateBookingPrice();
  });

  $('bookForm').addEventListener('submit', submitBooking);
  $('loginForm').addEventListener('submit', doLogin);
  $('adminLink').addEventListener('click', (e) => { e.preventDefault(); openModal('loginModal'); });
  $('logoutBtn').addEventListener('click', doLogout);
  const yearSelEl = $('yearSelect');
  if (yearSelEl) yearSelEl.addEventListener('change', () => loadSummary(yearSelEl.value));
  $('searchInput').addEventListener('input', renderBookings);
  $('statusFilter').addEventListener('change', renderBookings);
  $('applyHikeBtn').addEventListener('click', applyPriceHike);

  // Calendar controls
  $('calPrev').addEventListener('click', () => calShift(-1));
  $('calNext').addEventListener('click', () => calShift(1));
  $('calToday').addEventListener('click', calToday);

  // Notification bell
  $('bellBtn').addEventListener('click', (e) => { e.stopPropagation(); toggleBell(); });
  $('bellMarkRead').addEventListener('click', markAllRead);
  document.addEventListener('click', (e) => {
    const wrap = document.querySelector('.bell-wrap');
    if (wrap && !wrap.contains(e.target)) $('bellPanel').classList.remove('show');
  });

  // Pricing tabs (route fares / van rates)
  document.querySelectorAll('.ptab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const isRoutes = tab.dataset.tab === 'routes';
      $('panelRoutes').style.display = isRoutes ? '' : 'none';
      $('panelVans').style.display = isRoutes ? 'none' : '';
    });
  });

  // close modal on backdrop click
  document.querySelectorAll('.modal-backdrop').forEach(m => {
    m.addEventListener('click', (e) => { if (e.target === m) m.classList.remove('show'); });
  });
}

// ---------- Booking ----------
async function submitBooking(e) {
  e.preventDefault();
  const msg = $('bookMsg');
  msg.className = 'form-msg';
  msg.textContent = 'Submitting…';
  $('submitBtn').disabled = true;

  const fd = new FormData(e.target);
  const payload = Object.fromEntries(fd.entries());

  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Booking failed.');

    // Success modal
    $('successRef').textContent = data.reference;
    $('successDetails').innerHTML = `
      <div><span>Route</span><b>${data.route}</b></div>
      <div><span>Van</span><b>${data.van}</b></div>
      <div><span>Trip type</span><b>${data.trip_type}</b></div>
      <div><span>Duration</span><b>${data.days} day${data.days > 1 ? 's' : ''}</b></div>
      <div><span>Total cost</span><b>${peso(data.price)}</b></div>
    `;
    openModal('successModal');
    e.target.reset();
    $('bookDate').min = new Date().toISOString().split('T')[0];
    updateBookingPrice();
    msg.textContent = '';
  } catch (err) {
    msg.className = 'form-msg err';
    msg.textContent = err.message;
  } finally {
    $('submitBtn').disabled = false;
  }
}

// ---------- Admin auth ----------
async function doLogin(e) {
  e.preventDefault();
  const msg = $('loginMsg');
  msg.className = 'form-msg';
  msg.textContent = 'Checking…';
  const fd = new FormData(e.target);
  const creds = Object.fromEntries(fd.entries());
  const username = (creds.username || '').trim();
  const password = (creds.password || '').trim();

  try {
    let ok = false;
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        // Server reachable but rejected the credentials -> show its message.
        throw new Error(data.error || 'Invalid username or password.');
      }
      TOKEN = data.token;
      OFFLINE = false;
      ok = true;
    } catch (netErr) {
      // If the SERVER answered with a rejection, surface that (don't fall back).
      if (netErr.message && /password|username|invalid/i.test(netErr.message)) throw netErr;

      // Otherwise the network is unreachable (e.g. sandboxed file preview).
      // Fall back to local check against the default admin credentials.
      if (username === DEFAULT_ADMIN.user && password === DEFAULT_ADMIN.pass) {
        TOKEN = 'offline-' + Date.now();
        OFFLINE = true;
        ok = true;
      } else {
        throw new Error('Invalid username or password.');
      }
    }

    if (!ok) throw new Error('Invalid username or password.');
    localStorage.setItem('vr_token', TOKEN);
    localStorage.setItem('vr_offline', OFFLINE ? '1' : '0');
    closeModal('loginModal');
    e.target.reset();
    msg.textContent = '';
    openDashboard();
  } catch (err) {
    msg.className = 'form-msg err';
    msg.textContent = err.message;
  }
}

async function doLogout() {
  try {
    await fetch('/api/admin/logout', { method: 'POST', headers: authHeaders() });
  } catch (_) {}
  TOKEN = null;
  localStorage.removeItem('vr_token');
  $('dashboard').classList.remove('show');
  document.body.style.overflow = '';
}

function authHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN };
}

// ---------- Dashboard ----------
async function openDashboard() {
  $('dashboard').classList.add('show');
  document.body.style.overflow = 'hidden';

  if (OFFLINE) {
    // Sandboxed preview with no network: show pricing from the bundled catalog
    // (READ-ONLY) so the admin panel is still explorable. Editing needs the server.
    renderPriceRoutes(ROUTES.length ? ROUTES : FALLBACK_ROUTES);
    renderPriceVans(VANS.length ? VANS : FALLBACK_VANS);
    showOfflinePriceNotice();
    $('bookingsBody').innerHTML = `<tr><td colspan="11" class="empty">Offline demo mode — open the live website preview (or run the server) to view and manage real bookings.</td></tr>`;
    $('kpiRow').innerHTML = '';
    $('monthChart').innerHTML = '';
    ALL_BOOKINGS = [];
    renderCalendar();
    renderNotifications();
    return;
  }
  hideOfflinePriceNotice();

  // Load each section independently so one failure can't blank out the others.
  try { await loadBookings(); } catch (e) { console.error('loadBookings failed:', e); }
  try { await loadSummary(new Date().getFullYear()); } catch (e) { console.error('loadSummary failed:', e); }
  try { await loadPricing(); } catch (e) { console.error('loadPricing failed:', e); }
}

// ---------- Price management ----------
async function loadPricing() {
  const res = await fetch('/api/admin/pricing', { headers: authHeaders() });
  if (res.status === 401) return doLogout();
  const data = await res.json();
  renderPriceRoutes(data.routes);
  renderPriceVans(data.vans);
}

function renderPriceRoutes(routes) {
  const dis = OFFLINE ? 'disabled' : '';
  $('priceRoutesBody').innerHTML = routes.map(r => `
    <tr>
      <td>${r.region || '—'}</td>
      <td>${r.destination}</td>
      <td><input class="price-edit" type="number" min="0" step="100" value="${r.base_price}" id="rp-${r.id}" ${dis}></td>
      <td><button class="save-price" onclick="saveRoutePrice(${r.id}, this)" ${dis}>Save</button></td>
    </tr>
  `).join('');
}

function renderPriceVans(vans) {
  const dis = OFFLINE ? 'disabled' : '';
  $('priceVansBody').innerHTML = vans.map(v => `
    <tr>
      <td>${v.name}</td>
      <td>${v.capacity}</td>
      <td><input class="price-edit" type="number" min="0.1" step="0.05" value="${v.multiplier}" id="vp-${v.id}" ${dis}></td>
      <td><button class="save-price" onclick="saveVanMultiplier(${v.id}, this)" ${dis}>Save</button></td>
    </tr>
  `).join('');
}

function showOfflinePriceNotice() {
  if ($('offlinePriceNotice')) return;
  const panel = $('panelRoutes');
  if (!panel) return;
  const note = document.createElement('div');
  note.id = 'offlinePriceNotice';
  note.className = 'offline-notice';
  note.innerHTML = '⚠️ <b>Read-only preview.</b> Price editing is disabled because the app can’t reach the server right now. Open the <b>live website preview</b> (or run the server) and log in there to edit and save custom prices.';
  panel.parentNode.insertBefore(note, panel);
}

function hideOfflinePriceNotice() {
  const n = $('offlinePriceNotice');
  if (n) n.remove();
}

async function saveRoutePrice(id, btn) {
  btn = btn || (typeof event !== 'undefined' && event.target);
  const val = Number($('rp-' + id).value);
  try {
    const res = await fetch('/api/admin/routes/' + id, {
      method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ base_price: val })
    });
    if (!res.ok) throw new Error('Server rejected the update.');
    if (btn) flashSaved(btn);
    await refreshCatalogFromServer();
  } catch (err) {
    if (btn) flashError(btn);
  }
}

async function saveVanMultiplier(id, btn) {
  btn = btn || (typeof event !== 'undefined' && event.target);
  const val = Number($('vp-' + id).value);
  try {
    const res = await fetch('/api/admin/vans/' + id, {
      method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ multiplier: val })
    });
    if (!res.ok) throw new Error('Server rejected the update.');
    if (btn) flashSaved(btn);
    await refreshCatalogFromServer();
  } catch (err) {
    if (btn) flashError(btn);
  }
}

function flashError(btn) {
  const orig = btn.textContent;
  btn.textContent = '✕ Failed';
  btn.classList.add('failed');
  setTimeout(() => { btn.textContent = orig; btn.classList.remove('failed'); }, 2500);
}

function flashSaved(btn) {
  const orig = btn.textContent;
  btn.textContent = '✓ Saved';
  btn.classList.add('saved');
  setTimeout(() => { btn.textContent = orig; btn.classList.remove('saved'); }, 1500);
}

async function applyPriceHike() {
  const pct = Number($('hikePercent').value);
  const msg = $('hikeMsg');
  if (!Number.isFinite(pct) || pct === 0) {
    msg.className = 'hike-msg err';
    msg.textContent = 'Enter a percentage (e.g. 10).';
    return;
  }
  if (!confirm(`Apply a ${pct > 0 ? '+' : ''}${pct}% change to ALL route fares? This cannot be undone automatically.`)) return;
  const res = await fetch('/api/admin/price-adjust', {
    method: 'POST', headers: authHeaders(), body: JSON.stringify({ percent: pct })
  });
  const data = await res.json();
  if (!res.ok) {
    msg.className = 'hike-msg err';
    msg.textContent = data.error || 'Failed.';
    return;
  }
  msg.className = 'hike-msg ok';
  msg.textContent = `✓ ${pct > 0 ? '+' : ''}${pct}% applied to ${data.updated} routes.`;
  $('hikePercent').value = '';
  await loadPricing();
  await refreshCatalogFromServer();
}

// Refresh the public booking dropdowns so new prices reflect immediately
async function refreshCatalogFromServer() {
  try {
    const [vans, routes] = await Promise.all([
      fetch('/api/vans').then(r => r.json()),
      fetch('/api/routes').then(r => r.json())
    ]);
    VANS = vans; ROUTES = routes;
    populateCatalog();
  } catch (_) {}
}

async function loadBookings() {
  const res = await fetch('/api/admin/bookings', { headers: authHeaders() });
  if (res.status === 401) return doLogout();
  ALL_BOOKINGS = await res.json();
  renderBookings();
  renderCalendar();
  renderNotifications();
}

function renderBookings() {
  const q = $('searchInput').value.toLowerCase();
  const sf = $('statusFilter').value;
  let rows = ALL_BOOKINGS;
  if (sf) rows = rows.filter(b => b.status === sf);
  if (q) rows = rows.filter(b =>
    (b.customer_name + b.reference + b.origin + b.destination + b.van_name).toLowerCase().includes(q)
  );

  if (!rows.length) {
    $('bookingsBody').innerHTML = `<tr><td colspan="11" class="empty">No bookings found.</td></tr>`;
    return;
  }

  const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  $('bookingsBody').innerHTML = rows.map(b => `
    <tr>
      <td><b>${b.reference}</b></td>
      <td>${b.trip_date}<br><span class="muted">${b.trip_time}</span></td>
      <td>${b.customer_name}<br><span class="muted">${b.customer_phone}</span></td>
      <td>${b.origin} → ${b.destination}</td>
      <td>${b.van_name}</td>
      <td>${b.passengers}</td>
      <td>${b.trip_type}</td>
      <td>${b.days || 1}</td>
      <td><b>${peso(b.price)}</b></td>
      <td>
        <select class="status-select" onchange="updateStatus(${b.id}, this.value)">
          ${statuses.map(s => `<option value="${s}" ${s === b.status ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </td>
      <td><button class="del-btn" title="Delete" onclick="deleteBooking(${b.id})">🗑</button></td>
    </tr>
  `).join('');
}

async function updateStatus(id, status) {
  await fetch('/api/admin/bookings/' + id, {
    method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ status })
  });
  await loadBookings();
  await loadSummary(currentYear());
}

function currentYear() {
  const el = $('yearSelect');
  return (el && el.value) || new Date().getFullYear();
}

async function deleteBooking(id) {
  if (!confirm('Delete this booking permanently?')) return;
  await fetch('/api/admin/bookings/' + id, { method: 'DELETE', headers: authHeaders() });
  await loadBookings();
  await loadSummary(currentYear());
}

async function loadSummary(year) {
  const res = await fetch('/api/admin/summary?year=' + year, { headers: authHeaders() });
  if (res.status === 401) return doLogout();
  const data = await res.json();

  // Year dropdown (only if present — it was replaced by the notification bell)
  const yearSel = $('yearSelect');
  if (yearSel) {
    const yearsSet = new Set(data.years);
    yearsSet.add(String(new Date().getFullYear()));
    yearsSet.add(String(data.year));
    const years = [...yearsSet].sort((a, b) => b - a);
    yearSel.innerHTML = years.map(y => `<option value="${y}" ${y == data.year ? 'selected' : ''}>${y}</option>`).join('');
  }
  const chartYearEl = $('chartYear');
  if (chartYearEl) chartYearEl.textContent = data.year;

  renderKpis(data.months);
  renderChart(data.months);
}

function renderKpis(months) {
  const total = months.reduce((a, m) => a + m.bookings, 0);
  const revenue = months.reduce((a, m) => a + (m.revenue || 0), 0);
  const confirmed = months.reduce((a, m) => a + m.confirmed, 0);
  const pending = months.reduce((a, m) => a + m.pending, 0);
  $('kpiRow').innerHTML = `
    <div class="kpi blue"><b>${total}</b><span>Total bookings (year)</span></div>
    <div class="kpi"><b>${peso(revenue)}</b><span>Projected revenue</span></div>
    <div class="kpi green"><b>${confirmed}</b><span>Confirmed trips</span></div>
    <div class="kpi amber"><b>${pending}</b><span>Pending approval</span></div>
  `;
}

function renderChart(months) {
  const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const maxB = Math.max(1, ...months.map(m => m.bookings));
  const maxR = Math.max(1, ...months.map(m => m.revenue || 0));
  $('monthChart').innerHTML = months.map((m, i) => {
    const hB = Math.round((m.bookings / maxB) * 100);
    const hR = Math.round(((m.revenue || 0) / maxR) * 100);
    return `
      <div class="bar-col">
        <div class="bars">
          <div class="bar b-bookings" style="height:${hB}%" data-tip="${m.bookings} bookings"></div>
          <div class="bar b-revenue" style="height:${hR}%" data-tip="${peso(m.revenue)}"></div>
        </div>
        <div class="bar-label">${names[i]}</div>
      </div>`;
  }).join('');
}

// ---------- Booking Calendar ----------
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function renderCalendar() {
  const title = $('calTitle');
  if (title) title.textContent = `${MONTH_NAMES[CAL_MONTH]} ${CAL_YEAR}`;

  const grid = $('calendarGrid');
  if (!grid) return;

  // Group this month's bookings by day-of-month
  const byDay = {};
  for (const b of ALL_BOOKINGS) {
    if (!b.trip_date) continue;
    const [y, m, d] = b.trip_date.split('-').map(Number);
    if (y === CAL_YEAR && (m - 1) === CAL_MONTH) {
      (byDay[d] = byDay[d] || []).push(b);
    }
  }

  const firstDow = new Date(CAL_YEAR, CAL_MONTH, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(CAL_YEAR, CAL_MONTH + 1, 0).getDate();
  const now = new Date();
  const isThisMonth = now.getFullYear() === CAL_YEAR && now.getMonth() === CAL_MONTH;

  let cells = '';
  // leading blanks
  for (let i = 0; i < firstDow; i++) cells += `<div class="cal-cell empty"></div>`;

  for (let d = 1; d <= daysInMonth; d++) {
    const list = byDay[d] || [];
    const has = list.length > 0;
    const today = isThisMonth && now.getDate() === d;
    // status dots (max 6 shown)
    const dots = list.slice(0, 6).map(b => `<i class="${b.status}"></i>`).join('');
    cells += `
      <div class="cal-cell${has ? ' has-bookings' : ''}${today ? ' today' : ''}"
           ${has ? `onclick="showDayBookings(${d})"` : ''}>
        <span class="cal-date">${d}</span>
        <div class="cal-dots">${dots}</div>
        ${has ? `<span class="cal-count">${list.length} booking${list.length > 1 ? 's' : ''}</span>` : ''}
      </div>`;
  }
  grid.innerHTML = cells;
}

function calShift(delta) {
  CAL_MONTH += delta;
  if (CAL_MONTH < 0) { CAL_MONTH = 11; CAL_YEAR--; }
  if (CAL_MONTH > 11) { CAL_MONTH = 0; CAL_YEAR++; }
  renderCalendar();
}

function calToday() {
  const n = new Date();
  CAL_YEAR = n.getFullYear();
  CAL_MONTH = n.getMonth();
  renderCalendar();
}

function showDayBookings(day) {
  const dateStr = `${CAL_YEAR}-${String(CAL_MONTH + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const list = ALL_BOOKINGS.filter(b => b.trip_date === dateStr)
    .sort((a, b) => (a.trip_time || '').localeCompare(b.trip_time || ''));
  $('dayModalTitle').textContent = `Bookings on ${MONTH_NAMES[CAL_MONTH]} ${day}, ${CAL_YEAR}`;
  $('dayModalList').innerHTML = list.map(b => `
    <div class="day-item">
      <div class="di-top">
        <span class="di-ref">${b.reference}</span>
        <span class="status ${b.status}">${b.status}</span>
      </div>
      <div class="di-row">🕒 <b>${b.trip_time}</b> &nbsp;•&nbsp; ${b.trip_type} &nbsp;•&nbsp; ${b.days || 1} day${(b.days || 1) > 1 ? 's' : ''}</div>
      <div class="di-row">👤 <b>${b.customer_name}</b> &nbsp;•&nbsp; ${b.customer_phone}</div>
      <div class="di-row">📍 ${b.origin} → <b>${b.destination}</b></div>
      <div class="di-row">🚐 ${b.van_name} &nbsp;•&nbsp; ${b.passengers} pax &nbsp;•&nbsp; <b>${peso(b.price)}</b></div>
    </div>
  `).join('');
  openModal('dayModal');
}

// ---------- Notifications (bell) ----------
function renderNotifications() {
  const list = $('bellList');
  if (!list) return;

  // Newest bookings first (by created_at, fallback to id)
  const items = [...ALL_BOOKINGS].sort((a, b) =>
    (b.created_at || '').localeCompare(a.created_at || '') || b.id - a.id
  ).slice(0, 20);

  const unread = items.filter(b => !SEEN_IDS.includes(b.id));
  const badge = $('bellBadge');
  if (unread.length > 0) {
    badge.textContent = unread.length;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }

  if (!items.length) {
    list.innerHTML = `<div class="bell-empty">No booking notifications yet.</div>`;
    return;
  }

  list.innerHTML = items.map(b => {
    const isUnread = !SEEN_IDS.includes(b.id);
    return `
      <div class="bell-item${isUnread ? ' unread' : ''}" onclick="gotoBookingDate('${b.trip_date}')">
        <span class="bi-icon">${isUnread ? '🆕' : '🚐'}</span>
        <div class="bi-body">
          <div class="bi-title">${b.customer_name} — ${b.destination}</div>
          <div class="bi-sub">${b.trip_date} at ${b.trip_time} • ${peso(b.price)} • <span style="text-transform:capitalize">${b.status}</span></div>
        </div>
      </div>`;
  }).join('');
}

function toggleBell() {
  $('bellPanel').classList.toggle('show');
}

function markAllRead() {
  SEEN_IDS = ALL_BOOKINGS.map(b => b.id);
  localStorage.setItem('vr_seen_ids', JSON.stringify(SEEN_IDS));
  renderNotifications();
}

function gotoBookingDate(dateStr) {
  if (!dateStr) return;
  const [y, m] = dateStr.split('-').map(Number);
  CAL_YEAR = y;
  CAL_MONTH = m - 1;
  renderCalendar();
  $('bellPanel').classList.remove('show');
  document.getElementById('calendarGrid').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ---------- Facebook Messenger chat widget ----------
function messengerLink(prefillText) {
  // m.me deep link opens a direct Messenger chat with the page.
  // ?text= pre-fills the visitor's first message (supported by Messenger).
  const base = 'https://m.me/' + encodeURIComponent(FB_PAGE);
  return prefillText ? base + '?text=' + encodeURIComponent(prefillText) : base;
}

function initChatWidget() {
  const widget = $('chatWidget');
  if (!widget) return;

  const panel = $('chatPanel');
  const launcher = $('chatLauncher');
  const launcherIcon = $('chatLauncherIcon');
  const badge = $('chatLauncherBadge');
  const msgrBtn = $('chatMessengerBtn');

  // Default "Continue on Messenger" link
  msgrBtn.href = messengerLink('Hi LakbayPH! I have a question about van rental. 🚐');

  const setOpen = (open) => {
    panel.classList.toggle('open', open);
    launcherIcon.textContent = open ? '✕' : '💬';
    if (open) badge.style.display = 'none';
    localStorage.setItem('vr_chat_seen', '1');
  };

  // Hide the "1" badge if the user has opened chat before
  if (localStorage.getItem('vr_chat_seen') === '1') badge.style.display = 'none';

  launcher.addEventListener('click', () => setOpen(!panel.classList.contains('open')));
  $('chatClose').addEventListener('click', () => setOpen(false));

  // Quick-reply chips: echo the choice, then update the Messenger link to pre-fill it
  $('chatQuick').addEventListener('click', (e) => {
    const chip = e.target.closest('.chat-chip');
    if (!chip) return;
    const text = chip.dataset.msg;

    // Show the user's choice as a chat bubble
    const body = $('chatBody');
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg user';
    userMsg.innerHTML = `<span class="chat-bubble">${chip.textContent.trim()}</span>`;
    body.appendChild(userMsg);

    // Bot reply nudging them to Messenger
    const botMsg = document.createElement('div');
    botMsg.className = 'chat-msg bot';
    botMsg.innerHTML = `<span class="chat-bubble">Great! Tap <b>Continue on Messenger</b> below and we'll assist you right away. 😊</span>`;
    body.appendChild(botMsg);
    body.scrollTop = body.scrollHeight;

    // Pre-fill the Messenger message with their intent
    msgrBtn.href = messengerLink(text);
    msgrBtn.classList.add('pulse');
  });
}

// ---------- Modal helpers ----------
function openModal(id) { $(id).classList.add('show'); }
function closeModal(id) { $(id).classList.remove('show'); }
