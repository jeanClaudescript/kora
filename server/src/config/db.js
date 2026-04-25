const { MongoClient } = require('mongodb');
const { env } = require('./env');
const { seedListings, seedThreads, seedBookings } = require('../data/seed');

let cachedDb = null;
let degradedMode = false;

async function connectDb() {
  if (cachedDb) return cachedDb;
  if (!env.mongoUri) {
    degradedMode = true;
    return null;
  }

  try {
    const client = new MongoClient(env.mongoUri);
    await client.connect();
    cachedDb = client.db(env.mongoDb);
    await ensureSeed(cachedDb);
    return cachedDb;
  } catch (_error) {
    degradedMode = true;
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

module.exports = { connectDb, isDegraded };
