'use strict';

// ============================================================
//  EMAIL NOTIFICATIONS (via Resend API)
//  Set these environment variables (e.g. in Render → Environment):
//    RESEND_API_KEY   your Resend API key (starts with "re_")
//    MAIL_TO          recipient email(s), comma-separated
//    MAIL_FROM        verified sender, e.g. "LakbayPH <bookings@yourdomain.com>"
//                     (defaults to Resend's test sender if unset)
//  If RESEND_API_KEY or MAIL_TO is missing, emails are skipped
//  (the site keeps working normally — it just logs a note).
// ============================================================

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const MAIL_TO = process.env.MAIL_TO || '';
const MAIL_FROM = process.env.MAIL_FROM || 'LakbayPH Bookings <onboarding@resend.dev>';

const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH');

function emailEnabled() {
  return Boolean(RESEND_API_KEY && MAIL_TO);
}

// Build a clean HTML summary of a booking row (as stored/joined in the DB).
function bookingHtml(b, headline, accent) {
  const rows = [
    ['Reference', b.reference],
    ['Status', String(b.status || '').toUpperCase()],
    ['Customer', b.customer_name],
    ['Phone', b.customer_phone],
    ['Email', b.customer_email || '—'],
    ['Route', `${b.origin || ''} → ${b.destination || ''}`],
    ['Van', b.van_name || b.van || ''],
    ['Date / Time', `${b.trip_date} at ${b.trip_time}`],
    ['Trip type', b.trip_type],
    ['Days', b.days || 1],
    ['Passengers', b.passengers],
    ['Total price', peso(b.price)]
  ];
  const trs = rows.map(([k, v]) => `
    <tr>
      <td style="padding:8px 12px;color:#64748b;font-size:13px;border-bottom:1px solid #eef2f7;white-space:nowrap">${k}</td>
      <td style="padding:8px 12px;color:#0f172a;font-size:14px;font-weight:600;border-bottom:1px solid #eef2f7">${v}</td>
    </tr>`).join('');

  return `
  <div style="font-family:Segoe UI,Arial,sans-serif;background:#f1f5f9;padding:24px">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 8px 24px rgba(2,6,23,.08)">
      <div style="background:${accent};color:#fff;padding:20px 24px">
        <div style="font-size:13px;opacity:.9">LakbayPH Travel &amp; Tours Inc.</div>
        <div style="font-size:20px;font-weight:800;margin-top:2px">${headline}</div>
      </div>
      <table style="width:100%;border-collapse:collapse">${trs}</table>
      ${b.notes ? `<div style="padding:12px 24px;color:#475569;font-size:13px"><b>Notes:</b> ${b.notes}</div>` : ''}
      <div style="padding:16px 24px;color:#94a3b8;font-size:12px;border-top:1px solid #eef2f7">
        Automated notification from your LakbayPH booking system.
      </div>
    </div>
  </div>`;
}

async function sendBookingEmail(subject, html) {
  if (!emailEnabled()) {
    console.log('[mailer] Email skipped (RESEND_API_KEY / MAIL_TO not set).');
    return { skipped: true };
  }
  const to = MAIL_TO.split(',').map(s => s.trim()).filter(Boolean);
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from: MAIL_FROM, to, subject, html })
    });
    if (!res.ok) {
      const txt = await res.text();
      console.error('[mailer] Resend error:', res.status, txt);
      return { ok: false, error: txt };
    }
    console.log('[mailer] Sent:', subject, '->', to.join(', '));
    return { ok: true };
  } catch (err) {
    console.error('[mailer] Send failed:', err.message);
    return { ok: false, error: err.message };
  }
}

// Fire-and-forget helpers (never block or crash the API response)
function notifyNewBooking(b) {
  const html = bookingHtml({ ...b, status: 'pending' },
    '🆕 New Booking Received', '#0ea5e9');
  sendBookingEmail(`New booking ${b.reference} — ${b.destination || ''}`, html)
    .catch(e => console.error('[mailer]', e));
}

function notifyConfirmedBooking(b) {
  const html = bookingHtml({ ...b, status: 'confirmed' },
    '✅ Booking Confirmed', '#16a34a');
  sendBookingEmail(`Booking CONFIRMED ${b.reference} — ${b.destination || ''}`, html)
    .catch(e => console.error('[mailer]', e));
}

module.exports = { notifyNewBooking, notifyConfirmedBooking, emailEnabled };
