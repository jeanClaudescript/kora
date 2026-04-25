const { isDegraded } = require('../config/db');
const { ok } = require('../utils/http');

function getHealth(_req, res) {
  return ok(res, {
    ok: true,
    service: 'rbooking-server',
    db: isDegraded() ? 'degraded' : 'ready',
    timestamp: new Date().toISOString(),
  });
}

module.exports = { getHealth };
