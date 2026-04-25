const { MongoClient } = require('mongodb');
const { env } = require('./env');
const { seedListings, seedThreads, seedBookings } = require('../data/seed');

let cachedDb = null;
let degradedMode = false;
let degradedReason = null;

async function connectDb() {
  if (cachedDb) return cachedDb;
  if (!env.mongoUri) {
    degradedMode = true;
    degradedReason = 'MONGODB_URI missing';
    return null;
  }

  try {
    const client = new MongoClient(env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    await client.connect();
    cachedDb = client.db(env.mongoDb);
    await ensureSeed(cachedDb);
    return cachedDb;
  } catch (error) {
    degradedMode = true;
    degradedReason = error?.message || 'Mongo connection failed';
    // Keep backend online even without DB (seed/demo mode).
    console.warn('[db] Running in degraded mode:', degradedReason);
    return null;
  }
}

async function ensureSeed(db) {
  const listings = db.collection('listings');
  const count = await listings.countDocuments();
  if (count === 0) await listings.insertMany(seedListings);

  const threads = db.collection('threads');
  const tCount = await threads.countDocuments();
  if (tCount === 0) await threads.insertMany(seedThreads);

  const bookings = db.collection('bookings');
  const bCount = await bookings.countDocuments();
  if (bCount === 0) await bookings.insertMany(seedBookings);
}

function isDegraded() {
  return degradedMode;
}

function degradedInfo() {
  return { degraded: degradedMode, reason: degradedReason };
}

module.exports = { connectDb, isDegraded, degradedInfo };
