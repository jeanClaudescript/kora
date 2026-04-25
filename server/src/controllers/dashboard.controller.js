const { seedBookings } = require('../data/seed');
const { getAllListings, getListingBySlug } = require('../repositories/listing.repository');
const { getBookingsByUser, listRecentBusinessBookings } = require('../repositories/booking.repository');
const { buildCustomerDashboard, buildBusinessDashboard } = require('../services/personalization.service');
const { ok } = require('../utils/http');

function mapsUrl(area, city) {
  const q = encodeURIComponent(`${area || ''}, ${city || 'Kigali'}`.replace(/^,\s*/, ''));
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

async function customerDashboard(req, res) {
  const db = req.app.locals.db || null;
  const listings = await getAllListings(db);
  const userId = req.query.userId || 'guest';
  const profile = {
    userId,
    preferredCity: req.query.city || req.query.preferredCity || 'Kigali',
    interests: (req.query.interests || 'Salon,Spa,Barber').split(',').map((v) => v.trim()),
    lat: req.query.lat ? Number(req.query.lat) : undefined,
    lng: req.query.lng ? Number(req.query.lng) : undefined,
    visitStyle: (req.query.visitStyle || 'balanced').toLowerCase(),
  };

  let recentVisits = [];
  let userBookings = [];
  if (db && userId !== 'guest') {
    userBookings = await getBookingsByUser(db, userId);
    recentVisits = await Promise.all(
      userBookings.slice(0, 8).map(async (b) => {
        const listing = b.listingSlug ? await getListingBySlug(db, b.listingSlug) : null;
        const area = listing?.area;
        const city = listing?.city || profile.preferredCity;
        return {
          id: String(b._id ?? b.createdAt ?? Math.random()),
          serviceName: b.serviceName,
          slotLabel: b.slotLabel,
          status: b.status,
          venueName: listing?.name ?? b.listingSlug ?? 'Venue',
          area,
          city,
          mapUrl: area ? mapsUrl(area, city) : mapsUrl('', city),
        };
      }),
    );
  }

  return ok(res, buildCustomerDashboard(listings, profile, { recentVisits, userBookings }));
}

async function businessDashboard(req, res) {
  const db = req.app.locals.db || null;
  const listings = await getAllListings(db);
  const bookings = db ? await listRecentBusinessBookings(db, 80) : seedBookings;
  return ok(
    res,
    buildBusinessDashboard(listings, req.query, {
      bookings,
      workerCount: Number(req.query.workerCount || 8),
    }),
  );
}

module.exports = { customerDashboard, businessDashboard };
