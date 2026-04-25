const { ObjectId } = require('mongodb');

const ACTIVE_BOOKING_STATUSES = new Set(['requested', 'pending', 'confirmed', 'in-salon']);

function normalizePhone(phone) {
  return String(phone || '').replace(/[^\d+]/g, '').trim();
}

function normalizeStatus(status) {
  return String(status || '').trim().toLowerCase();
}

const ALLOWED_STATUS_TRANSITIONS = {
  requested: new Set(['pending', 'confirmed', 'cancelled', 'no-show']),
  pending: new Set(['confirmed', 'cancelled', 'no-show']),
  confirmed: new Set(['in-salon', 'cancelled', 'no-show']),
  'in-salon': new Set(['done', 'cancelled', 'no-show']),
  done: new Set([]),
  'no-show': new Set([]),
  cancelled: new Set([]),
};

function canTransition(fromStatus, toStatus) {
  const from = normalizeStatus(fromStatus);
  const to = normalizeStatus(toStatus);
  if (from === to) return true;
  const allowed = ALLOWED_STATUS_TRANSITIONS[from];
  return Boolean(allowed?.has(to));
}

function makeBookingQueryById(bookingId) {
  return ObjectId.isValid(bookingId) ? { _id: new ObjectId(bookingId) } : { _id: bookingId };
}

async function createBooking(db, payload) {
  if (!db) return null;

  const now = new Date().toISOString();
  const booking = {
    listingSlug: String(payload.listingSlug || '').trim(),
    serviceName: String(payload.serviceName || '').trim(),
    slotLabel: String(payload.slotLabel || '').trim(),
    guestName: String(payload.guestName || '').trim(),
    phone: normalizePhone(payload.phone),
    notes: String(payload.notes || '').trim(),
    userId: String(payload.userId || 'guest').trim(),
    channel: String(payload.channel || 'app').trim(),
    status: 'requested',
    createdAt: now,
    updatedAt: now,
  };

  const existing = await db.collection('bookings').findOne({
    listingSlug: booking.listingSlug,
    slotLabel: booking.slotLabel,
    status: { $in: [...ACTIVE_BOOKING_STATUSES] },
  });
  if (existing) {
    return { conflict: true, existing };
  }

  const result = await db.collection('bookings').insertOne(booking);
  return { ...booking, _id: result.insertedId };
}

async function getBookingsByUser(db, userId) {
  if (!db) return [];
  return db.collection('bookings').find({ userId }).sort({ createdAt: -1 }).toArray();
}

async function listRecentBusinessBookings(db, limit = 50) {
  if (!db) return [];
  return db.collection('bookings').find({}).sort({ createdAt: -1 }).limit(limit).toArray();
}

async function getBookingById(db, bookingId) {
  if (!db) return null;
  return db.collection('bookings').findOne(makeBookingQueryById(bookingId));
}

async function updateBookingStatus(db, bookingId, status) {
  if (!db) return null;
  const query = makeBookingQueryById(bookingId);
  await db.collection('bookings').updateOne(query, {
    $set: { status: normalizeStatus(status), updatedAt: new Date().toISOString() },
  });
  return db.collection('bookings').findOne(query);
}

module.exports = {
  createBooking,
  getBookingsByUser,
  listRecentBusinessBookings,
  getBookingById,
  updateBookingStatus,
  canTransition,
};
