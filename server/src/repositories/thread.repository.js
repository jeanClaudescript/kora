const { seedThreads } = require('../data/seed');

function sortThreadsDesc(items) {
  return [...items].sort((a, b) => {
    const tb = new Date(b.updatedAt || 0).getTime();
    const ta = new Date(a.updatedAt || 0).getTime();
    if (tb !== ta) return tb - ta;
    return String(b.id || '').localeCompare(String(a.id || ''));
  });
}

async function getThreads(db) {
  if (!db) return sortThreadsDesc(seedThreads);
  const items = await db.collection('threads').find({}).toArray();
  return sortThreadsDesc(items);
}

module.exports = { getThreads };
