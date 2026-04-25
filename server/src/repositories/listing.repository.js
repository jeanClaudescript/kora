const { seedListings } = require('../data/seed');

function filterListings(items, q, category, city) {
  const query = (q || '').trim().toLowerCase();
  const c = category || 'all';
  const town = (city || '').trim().toLowerCase();

  return items.filter((item) => {
    const inQuery =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.tagline.toLowerCase().includes(query) ||
      item.area.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);
    const inCategory = c === 'all' || !c || item.category === c;
    const inCity = !town || item.city.toLowerCase().includes(town);
    return inQuery && inCategory && inCity;
  });
}

async function getAllListings(db) {
  if (!db) return seedListings;
  return db.collection('listings').find({}).toArray();
}

async function searchListings(db, params) {
  const all = await getAllListings(db);
  return filterListings(all, params.q, params.category, params.city);
}

async function getListingBySlug(db, slug) {
  const all = await getAllListings(db);
  return all.find((item) => item.slug === slug);
}

module.exports = { getAllListings, searchListings, getListingBySlug };
