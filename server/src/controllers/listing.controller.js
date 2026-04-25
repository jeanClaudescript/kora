const { searchListings, getAllListings, getListingBySlug } = require('../repositories/listing.repository');
const { fail, ok } = require('../utils/http');

async function listListings(req, res) {
  const db = req.app.locals.db || null;
  const items = await getAllListings(db);
  return ok(res, { items });
}

async function search(req, res) {
  const db = req.app.locals.db || null;
  const items = await searchListings(db, req.query);
  return ok(res, { items });
}

async function getBySlug(req, res) {
  const db = req.app.locals.db || null;
  const item = await getListingBySlug(db, req.params.slug);
  if (!item) return fail(res, 404, 'Listing not found');
  return ok(res, item);
}

module.exports = { listListings, search, getBySlug };
