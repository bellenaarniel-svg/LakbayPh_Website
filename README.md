# LakbayPH Travel & Tours — Van Rental & Booking

A full-stack van rental website with instant price estimates, online booking,
a Facebook Messenger chat widget, and an admin dashboard (calendar, notifications,
monthly overview, and price management).

## Tech stack
- **Backend:** Node.js + Express
- **Database:** SQLite (`better-sqlite3`)
- **Frontend:** vanilla HTML / CSS / JavaScript (in `public/`)

## Run locally

```bash
npm install
npm start
```

Then open **http://localhost:3000**.

- Public site: booking, quotes, fleet, routes, Messenger chat
- Admin dashboard: click **Admin Login** — default demo credentials `admin` / `admin123`

## Configuration

| What | Where |
|------|-------|
| Facebook page handle (Messenger chat) | `FB_PAGE` at the top of `public/app.js` |
| Admin username / password | `ADMIN_USER` / `ADMIN_PASS` env vars (default `admin` / `admin123`) in `server.js` |
| Vans, routes & prices | seeded in `db.js`; editable live from the admin dashboard |
| Email alerts (new + confirmed bookings) | `RESEND_API_KEY`, `MAIL_TO`, `MAIL_FROM` env vars (see below) |

## Email notifications (optional)

Get an email whenever a customer **submits a new booking** and whenever a booking is
**marked Confirmed** in the dashboard. Powered by [Resend](https://resend.com) (free tier).

Set these environment variables (leave unset to disable — the site still works):

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx        # from resend.com → API Keys
MAIL_TO=you@gmail.com,partner@gmail.com   # who gets alerted (comma-separated)
MAIL_FROM=LakbayPH <onboarding@resend.dev> # sender; use resend.dev to test, or your verified domain
```

1. Sign up at **resend.com** → **API Keys → Create API Key** → copy it.
2. In Render → your service → **Environment**, add the three variables above.
3. Save → Render redeploys. Done — alerts start immediately.

To send from your own address (e.g. `bookings@yourdomain.com`) instead of the test
sender, verify your domain in Resend → **Domains**, then set `MAIL_FROM` to it.

Set a secure admin password in production:

```bash
ADMIN_USER=youradmin ADMIN_PASS='a-strong-password' npm start
```

## Important: hosting

This app needs a host that runs **Node.js** (e.g. Render, Railway, Fly.io, a VPS).
**GitHub Pages serves static files only** and cannot run the server or database, so
booking and the admin dashboard will not work there. Use GitHub for the source code,
and deploy the running app to a Node host. See notes in the project chat.

## Project structure

```
.
├── server.js            # Express server + API + admin auth
├── db.js                # SQLite schema + seed data (vans, routes)
├── package.json
└── public/
    ├── index.html       # Single-page site + admin dashboard
    ├── styles.css
    ├── app.js           # Frontend logic (FB_PAGE config at top)
    └── img/             # Logo + background
```
