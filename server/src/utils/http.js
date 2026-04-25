function ok(res, data) {
  return res.status(200).json(data);
}

function created(res, data) {
  return res.status(201).json(data);
}

function fail(res, code, message) {
  return res.status(code).json({ error: message });
}

module.exports = { ok, created, fail };
