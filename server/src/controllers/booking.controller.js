const {
  createBooking,
  getBookingsByUser,
  listRecentBusinessBookings,
  getBookingById,
  updateBookingStatus,
  canTransition,
} = require('../repositories/booking.repository');
const { created, fail, ok } = require('../utils/http');

async function create(req, res) {
  const payload = req.body || {};
  const listingSlug = String(payload.listingSlug || '').trim();
  const serviceName = String(payload.serviceName || '').trim();
  const slotLabel = String(payload.slotLabel || '').trim();
  const guestName = String(payload.guestName || '').trim();
  const phone = String(payload.phone || '').trim();
  if (!listingSlug || !serviceName || !slotLabel || !guestName || !phone) {
    return fail(
      res,
      400,
      'listingSlug, serviceName, slotLabel, guestName, and phone are required',
    );
  }
  if (guestName.length < 2) return fail(res, 400, 'guestName is too short');
  if (phone.replace(/[^\d]/g, '').length < 8) return fail(res, 400, 'phone is invalid');

  const normalized = {
    ...payload,
    listingSlug,
    serviceName,
    slotLabel,
    guestName,
    phone,
    userId: String(payload.userId || 'guest').trim(),
    channel: String(payload.channel || 'app').trim(),
    notes: String(payload.notes || '').trim(),
  };

  const db = req.app.locals.db || null;
  if (!db) {
    return fail(res, 503, 'Database unavailable. Real bookings require database connection.');
  }

  const saved = await createBooking(db, normalized);
  if (saved?.conflict) {
    return fail(res, 409, 'Selected slot is no longer available. Choose another time.');
  }
  return created(res, saved);
}

async function byUser(req, res) {
  const userId = req.query.userId || 'guest';
  const db = req.app.locals.db || null;
  const items = await getBookingsByUser(db, userId);
  return ok(res, { items });
}

async function businessList(req, res) {
  const db = req.app.locals.db || null;
  if (!db) {
    return fail(res, 503, 'Database unavailable. Real booking list requires database connection.');
  }
  const limit = Math.min(Number(req.query.limit || 50), 200);
  const source = await listRecentBusinessBookings(db, limit);
  const items = source.map((item, idx) => ({
    ...item,
    bookingId: String(item._id || item.bookingId || `${item.guestName}-${item.slotLabel}-${idx}`),
  }));
  return ok(res, { items });
}

async function updateStatus(req, res) {
  const bookingId = String(req.params.bookingId || '').trim();
  const status = String(req.body?.status || '').trim().toLowerCase();
  const allowed = new Set(['requested', 'pending', 'confirmed', 'in-salon', 'done', 'no-show', 'cancelled']);
  if (!bookingId || !allowed.has(status)) {
    return fail(res, 400, 'Valid bookingId and status are required');
  }

  const db = req.app.locals.db || null;
  if (!db) {
    return fail(res, 503, 'Database unavailable. Real booking updates require database connection.');
  }

  const current = await getBookingById(db, bookingId);
  if (!current) return fail(res, 404, 'Booking not found');
  if (!canTransition(current.status, status)) {
    return fail(res, 409, `Cannot move booking from ${current.status} to ${status}`);
  }

  const updated = await updateBookingStatus(db, bookingId, status);
  if (!updated) return fail(res, 404, 'Booking not found');
  return ok(res, { item: { ...updated, bookingId: String(updated._id || bookingId) } });
}

module.exports = { create, byUser, businessList, updateStatus };
