const { degradedInfo } = require('../config/db');
const { ok } = require('../utils/http');

function getHealth(_req, res) {
  const info = degradedInfo();
  return ok(res, {
    ok: true,
    service: 'rbooking-server',
    db: info.degraded ? 'degraded' : 'ready',
    dbReason: info.degraded ? info.reason : undefined,
    timestamp: new Date().toISOString(),
  });
}

module.exports = { getHealth };
