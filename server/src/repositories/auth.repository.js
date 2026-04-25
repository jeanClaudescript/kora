const { ObjectId } = require('mongodb');

async function findUserByEmail(db, email) {
  if (!db) return null;
  return db.collection('users').findOne({ email: String(email || '').toLowerCase() });
}

async function createUser(db, payload) {
  if (!db) return { ...payload, _id: `local-${Date.now()}` };
  const doc = {
    ...payload,
    email: String(payload.email || '').toLowerCase(),
    createdAt: new Date().toISOString(),
  };
  const result = await db.collection('users').insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

async function ensureUserIndex(db) {
  if (!db) return;
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
}

function toAuthUser(doc) {
  if (!doc) return null;
  return {
    id: String(doc._id || doc.id || new ObjectId()),
    name: doc.name,
    email: doc.email,
    role: doc.role,
    businessCategory: doc.businessCategory,
    businessWorkerCount: doc.businessWorkerCount,
    preferredCity: doc.preferredCity,
    interestCategories: doc.interestCategories,
  };
}

module.exports = { findUserByEmail, createUser, ensureUserIndex, toAuthUser };
