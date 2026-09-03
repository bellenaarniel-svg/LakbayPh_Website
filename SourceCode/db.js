'use strict';

const path = require('path');
const Database = require('better-sqlite3');

// Use a persistent data dir if present (e.g. Render disk mounted at ./data),
// otherwise fall back to the project root for local development.
const fs = require('fs');
const dataDir = path.join(__dirname, 'data');
const dbDir = fs.existsSync(dataDir) ? dataDir : __dirname;
const db = new Database(path.join(dbDir, 'vanrental.db'));
db.pragma('journal_mode = WAL');

// ---------- Schema ----------
db.exec(`
CREATE TABLE IF NOT EXISTS vans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  multiplier REAL NOT NULL DEFAULT 1.0,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS routes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  region TEXT,
  base_price REAL NOT NULL,
  distance_km INTEGER,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  van_id INTEGER NOT NULL,
  route_id INTEGER NOT NULL,
  trip_date TEXT NOT NULL,
  trip_time TEXT NOT NULL,
  trip_type TEXT NOT NULL DEFAULT 'one-way',
  days INTEGER NOT NULL DEFAULT 1,
  passengers INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  price REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (van_id) REFERENCES vans(id),
  FOREIGN KEY (route_id) REFERENCES routes(id)
);
`);

// ---------- Lightweight migrations (for older DBs) ----------
const bookingCols = db.prepare(`PRAGMA table_info(bookings)`).all().map(c => c.name);
if (!bookingCols.includes('days')) {
  db.exec(`ALTER TABLE bookings ADD COLUMN days INTEGER NOT NULL DEFAULT 1`);
}
const routeCols = db.prepare(`PRAGMA table_info(routes)`).all().map(c => c.name);
if (!routeCols.includes('region')) {
  db.exec(`ALTER TABLE routes ADD COLUMN region TEXT`);
}

// ---------- Seed / refresh VANS ----------
// Requested fleet with real PH seat capacities:
//  - Nissan Urvan Standard        -> 15 seats
//  - Nissan Urvan Premium High Roof -> 18 seats
//  - Toyota Grandia GL            -> 12 seats
const VAN_SEED = [
  ['Nissan Urvan Standard', 15, 1.0],
  ['Nissan Urvan Premium (High Roof)', 18, 1.25],
  ['Toyota Grandia GL', 12, 1.15]
];

const currentVans = db.prepare('SELECT name FROM vans').all().map(v => v.name);
const wantVanNames = VAN_SEED.map(v => v[0]);
const vansMatch = currentVans.length === wantVanNames.length &&
  wantVanNames.every(n => currentVans.includes(n));

if (!vansMatch) {
  // reset fleet to requested vans
  db.exec('DELETE FROM vans');
  db.exec(`DELETE FROM sqlite_sequence WHERE name='vans'`);
  const insertVan = db.prepare('INSERT INTO vans (name, capacity, multiplier) VALUES (?, ?, ?)');
  const tx = db.transaction(rows => rows.forEach(r => insertVan.run(...r)));
  tx(VAN_SEED);
}

// ---------- Seed ROUTES: destinations across the Philippines ----------
// Pickup hub = Metro Manila. Prices are MOCK estimates (standard van, one-way, day 1).
const ROUTE_SEED = [
  // region, destination, base_price, distance_km
  // ---- Metro Manila / nearby ----
  ['Metro Manila', 'NAIA Airport Transfer', 2500, 20],
  ['Metro Manila', 'Makati / BGC', 2200, 15],
  ['Metro Manila', 'Quezon City', 2000, 15],
  // ---- CALABARZON ----
  ['CALABARZON', 'Tagaytay', 4500, 60],
  ['CALABARZON', 'Batangas Pier', 5500, 110],
  ['CALABARZON', 'Nasugbu / Calatagan', 6000, 120],
  ['CALABARZON', 'Laiya, San Juan', 6500, 150],
  ['CALABARZON', 'Lucena / Quezon', 6000, 135],
  ['CALABARZON', 'Pagsanjan Falls', 5000, 95],
  ['CALABARZON', 'Antipolo / Rizal', 2800, 30],
  // ---- Central Luzon ----
  ['Central Luzon', 'Subic / Olongapo', 6000, 130],
  ['Central Luzon', 'Clark / Angeles, Pampanga', 5500, 100],
  ['Central Luzon', 'Bataan (Balanga / Morong)', 6000, 140],
  ['Central Luzon', 'Zambales (Iba / San Antonio)', 7000, 200],
  ['Central Luzon', 'Tarlac City', 5500, 125],
  ['Central Luzon', 'Nueva Ecija (Cabanatuan)', 6500, 155],
  ['Central Luzon', 'Aurora (Baler)', 9500, 230],
  // ---- Cordillera (CAR) ----
  ['Cordillera (CAR)', 'Baguio City', 9500, 250],
  ['Cordillera (CAR)', 'Sagada', 14000, 400],
  ['Cordillera (CAR)', 'Banaue Rice Terraces', 14000, 350],
  // ---- Ilocos Region ----
  ['Ilocos Region', 'La Union (San Juan)', 10500, 270],
  ['Ilocos Region', 'Pangasinan (Hundred Islands)', 9000, 250],
  ['Ilocos Region', 'Vigan, Ilocos Sur', 16000, 400],
  ['Ilocos Region', 'Laoag, Ilocos Norte', 18000, 490],
  ['Ilocos Region', 'Pagudpud', 19000, 560],
  // ---- Cagayan Valley ----
  ['Cagayan Valley', 'Tuguegarao, Cagayan', 18000, 480],
  ['Cagayan Valley', 'Isabela (Ilagan / Santiago)', 15000, 400],
  // ---- Bicol Region ----
  ['Bicol Region', 'Naga City', 15000, 450],
  ['Bicol Region', 'Legazpi / Mayon, Albay', 17000, 520],
  ['Bicol Region', 'Donsol, Sorsogon', 19000, 580],
  ['Bicol Region', 'Caramoan', 20000, 560],
  // ---- Visayas (van + RoRo / for road-accessible legs) ----
  ['Western Visayas', 'Iloilo City', 32000, 950],
  ['Western Visayas', 'Boracay (Caticlan)', 30000, 700],
  ['Western Visayas', 'Bacolod City', 34000, 1000],
  ['Central Visayas', 'Cebu City', 40000, 1100],
  ['Central Visayas', 'Bohol (Tagbilaran)', 42000, 1150],
  ['Eastern Visayas', 'Tacloban City', 30000, 900],
  // ---- Palawan ----
  ['MIMAROPA', 'Puerto Princesa, Palawan', 45000, 1200],
  ['MIMAROPA', 'El Nido, Palawan', 50000, 1450],
  ['MIMAROPA', 'Puerto Galera, Oriental Mindoro', 8000, 150],
  // ---- Mindanao ----
  ['Northern Mindanao', 'Cagayan de Oro', 48000, 1500],
  ['Davao Region', 'Davao City', 52000, 1600],
  ['Zamboanga Peninsula', 'Zamboanga City', 55000, 1700],
  ['SOCCSKSARGEN', 'General Santos City', 54000, 1650],
  // ---- Custom / flexible ----
  ['Nationwide', 'Other destination (custom quote)', 5000, null]
];

const routeCount = db.prepare('SELECT COUNT(*) AS c FROM routes').get().c;
const distinctDest = db.prepare('SELECT COUNT(DISTINCT destination) AS c FROM routes').get().c;
// Reseed routes if empty OR still holding the small original set (< 20 destinations)
if (routeCount === 0 || distinctDest < 20) {
  db.exec('DELETE FROM routes');
  db.exec(`DELETE FROM sqlite_sequence WHERE name='routes'`);
  const insertRoute = db.prepare(
    'INSERT INTO routes (origin, destination, region, base_price, distance_km) VALUES (?, ?, ?, ?, ?)'
  );
  const tx = db.transaction(rows => rows.forEach(
    r => insertRoute.run('Metro Manila', r[1], r[0], r[2], r[3])
  ));
  tx(ROUTE_SEED);
}

module.exports = db;
