const { ObjectId } = require('mongodb');

async function createBooking(db, payload) {
  const booking = {
    ...payload,
    status: 'requested',
    createdAt: new Date().toISOString(),
  };

  if (!db) return { ...booking, _id: `local-${Date.now()}` };
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

async function updateBookingStatus(db, bookingId, status) {
  if (!db) return null;
  const query = ObjectId.isValid(bookingId) ? { _id: new ObjectId(bookingId) } : { _id: bookingId };
  await db.collection('bookings').updateOne(query, {
    $set: { status, updatedAt: new Date().toISOString() },
  });
  return db.collection('bookings').findOne(query);
}

module.exports = { createBooking, getBookingsByUser, listRecentBusinessBookings, updateBookingStatus };
