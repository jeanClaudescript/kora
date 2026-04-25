const { getThreads } = require('../repositories/thread.repository');
const { ok } = require('../utils/http');

async function listThreads(req, res) {
  const db = req.app.locals.db || null;
  const items = await getThreads(db);
  return ok(res, { items });
}

module.exports = { listThreads };
