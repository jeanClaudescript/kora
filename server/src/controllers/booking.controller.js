const {
  createBooking,
  getBookingsByUser,
  listRecentBusinessBookings,
  updateBookingStatus,
} = require('../repositories/booking.repository');
const { seedBookings } = require('../data/seed');
const { created, fail, ok } = require('../utils/http');

async function create(req, res) {
  const payload = req.body || {};
  if (!payload.listingSlug || !payload.serviceName || !payload.slotLabel) {
    return fail(res, 400, 'listingSlug, serviceName, and slotLabel are required');
  }

  const db = req.app.locals.db || null;
  const saved = await createBooking(db, payload);
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
  const limit = Math.min(Number(req.query.limit || 50), 200);
  const source = db ? await listRecentBusinessBookings(db, limit) : seedBookings;
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
  if (db) {
    const updated = await updateBookingStatus(db, bookingId, status);
    if (!updated) return fail(res, 404, 'Booking not found');
    return ok(res, { item: { ...updated, bookingId: String(updated._id || bookingId) } });
  }

  const idx = seedBookings.findIndex((b, i) => `${b.guestName}-${b.slotLabel}-${i}` === bookingId);
  if (idx < 0) return fail(res, 404, 'Booking not found');
  seedBookings[idx] = { ...seedBookings[idx], status, updatedAt: new Date().toISOString() };
  return ok(res, { item: { ...seedBookings[idx], bookingId } });
}

module.exports = { create, byUser, businessList, updateStatus };
