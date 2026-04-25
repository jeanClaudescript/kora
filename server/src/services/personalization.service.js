const { getVerticalPack } = require('../data/businessVerticals');
const {
  buildCustomerBookingPeace,
  buildBusinessFloorReality,
  buildBusinessWorkforceReality,
} = require('./booking-reality.service');

function hashUserId(userId) {
  let h = 0;
  const s = String(userId || 'guest');
  for (let i = 0; i < s.length; i += 1) {
    h = Math.imul(31, h) + s.charCodeAt(i);
  }
  return Math.abs(h);
}

function scoreListing(listing, profile, userHash) {
  let score = 50;
  if (profile.preferredCity && listing.city === profile.preferredCity) score += 14;
  if (profile.interests?.includes(listing.category)) score += 20;
  if (listing.rating >= 4.8) score += 8;
  if (listing.instantConfirm) score += 4;
  if (!listing.busyNow) score += 3;
  if (profile.lat && profile.lng && listing.city === profile.preferredCity) score += 2;
  score += (userHash % 7) * 0.15;
  return score;
}

function mapsSearchQuery(area, city) {
  return encodeURIComponent(`${area}, ${city}`.trim());
}

function discoveryRhythm() {
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return 'morning_fresh';
  if (h >= 16 && h < 22) return 'evening_reset';
  if (h >= 22 || h < 5) return 'night_wind_down';
  return 'dayflow';
}

function buildCustomerMindset(profile, userHash, rhythm, topPick) {
  const city = profile.preferredCity || 'Kigali';
  const interests = profile.interests?.join(', ') || 'Salon, Spa, Barber';
  const intents = [
    `You lean toward ${topPick?.category || 'trusted'} experiences with clear pricing in ${city}.`,
    `Based on your taste signals, ${city} venues that respect your time surface first.`,
    `You value honest busy states, reviews, and straight paths from browse to booked in ${city}.`,
  ];
  const joys = [
    'Calm confirmations and zero surprises when you arrive.',
    'Short hops from where you already are — less zig-zag.',
    'Places that feel proud of their craft and your time.',
  ];
  const needs = [
    'Fewer taps from discovery to a confirmed slot.',
    'Transparent “from” pricing before you emotionally commit.',
    'One thread that remembers your last visit and preferences.',
  ];
  return {
    preferredCity: city,
    likelyIntent: intents[userHash % intents.length],
    engagementStyle: joys[(userHash >> 1) % joys.length],
    affinitySummary: `Signals (demo): liked categories (${interests}), city (${city}), rhythm (${rhythm.replace(/_/g, ' ')}).`,
    needSummary: needs[(userHash >> 2) % needs.length],
    rhythmLabel: rhythm,
    joyHook: joys[userHash % joys.length],
  };
}

function personalWhy(listing, profile, idx, userHash) {
  const city = profile.preferredCity || 'your area';
  const reasons = [
    `Matches your ${city} focus and a high trust bar on reviews.`,
    `${listing.instantConfirm ? 'Instant confirm' : 'WhatsApp confirm'} fits how you like to lock things in.`,
    `${listing.busyNow ? 'Popular window — great if you like energy.' : 'Quieter pace — easier to decompress.'}`,
    `${Number(listing.reviews || 0).toLocaleString()} guest voices from people booking nearby.`,
  ];
  return reasons[(idx + userHash) % reasons.length];
}

function buildContentCards(scored, profile, userHash, rhythm) {
  const city = profile.preferredCity || 'Kigali';
  const top = scored[0];
  const second = scored[1];
  const third = scored[2];
  const rotate = userHash % 2;
  const style = profile.visitStyle || 'balanced';
  const tasteLine =
    style === 'quick'
      ? 'You skew toward quick slots and instant confirm.'
      : style === 'relax'
        ? 'You may enjoy slower rituals and spa-style pacing.'
        : `A balanced mix across ${profile.interests?.slice(0, 2).join(' & ') || 'care & grooming'}.`;

  return [
    {
      id: 'c1',
      kind: 'location',
      title: 'Where you land next',
      subtitle: top
        ? `Strong match: ${top.name} · ${top.area}, ${top.city}`
        : `Curated picks across ${city} and beyond.`,
      accent: 'from-fuchsia-500 via-rose-500 to-amber-400',
      slug: top?.slug,
    },
    {
      id: 'c2',
      kind: 'taste',
      title: rotate ? 'What you lean toward' : 'What we noticed',
      subtitle: tasteLine,
      accent: 'from-violet-600 via-purple-600 to-pink-500',
    },
    {
      id: 'c3',
      kind: 'rhythm',
      title: rhythm === 'evening_reset' ? 'Tonight-friendly picks' : 'Your day, smoother',
      subtitle:
        rhythm === 'morning_fresh'
          ? 'Early openings and bright energy near you.'
          : rhythm === 'evening_reset'
            ? 'After-work windows that still feel premium.'
            : 'Crowd-aware timing — less waiting, more “you’re expected”.',
      accent: 'from-sky-500 via-blue-600 to-indigo-700',
      slug: second?.slug,
    },
    {
      id: 'c4',
      kind: 'social',
      title: 'Community-loved',
      subtitle: third
        ? `${third.name} resonates with guests who book like you.`
        : 'New partners join weekly — Rwanda today, guests everywhere tomorrow.',
      accent: 'from-emerald-500 via-teal-500 to-cyan-400',
      slug: third?.slug,
    },
  ];
}

function buildCustomerDashboard(listings, profile, options = {}) {
  const userHash = hashUserId(profile.userId || 'guest');
  const rhythm = discoveryRhythm();
  const scored = listings
    .map((item) => ({
      ...item,
      score: scoreListing(item, profile, userHash),
    }))
    .sort((a, b) => b.score - a.score);

  const withWhy = scored.map((item, idx) => ({
    ...item,
    personalWhy: personalWhy(item, profile, idx, userHash),
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${mapsSearchQuery(item.area, item.city)}`,
    visitLabel: `${item.area}, ${item.city}`,
  }));

  const topPick = withWhy[0];
  const mindset = buildCustomerMindset(profile, userHash, rhythm, topPick);
  const city = profile.preferredCity || 'Kigali';
  const uniqHoods = neighborhoodSignals(listings)
    .slice(0, 6)
    .map((n) => n.area);

  const locationPulse = {
    city,
    neighborhoods: uniqHoods,
    geoEnabled: Boolean(profile.lat && profile.lng),
    exploreLabel: `Explore ${city} on map`,
    mapExploreUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(city)}`,
  };

  let recentVisits = options.recentVisits || [];
  if (!recentVisits.length) {
    recentVisits = withWhy.slice(0, 2).map((l, i) => ({
      id: `suggest-${l.slug}-${i}`,
      serviceName: i === 0 ? 'Suggested first visit' : 'Saved for later',
      slotLabel: 'Flexible',
      status: 'suggested',
      venueName: l.name,
      area: l.area,
      city: l.city,
      mapUrl: l.mapUrl,
    }));
  }

  const layoutVariant = ['calm_grid', 'story_first', 'explorer'][userHash % 3];

  return {
    userId: profile.userId,
    layoutVariant,
    mindset,
    recommendations: withWhy.slice(0, 12),
    categories: [...new Set(withWhy.map((x) => x.category))].slice(0, 8),
    locationPulse,
    contentCards: buildContentCards(withWhy, profile, userHash, rhythm),
    recentVisits,
    bookingPeace: buildCustomerBookingPeace(options.userBookings || []),
    discoveryHints: [
      `Rhythm · ${rhythm.replace(/_/g, ' ')}`,
      profile.lat && profile.lng ? 'Location on — nearer picks float up' : 'Optional: share location later for tighter matches',
      `Pace · ${profile.visitStyle || 'balanced'}`,
    ],
  };
}

function neighborhoodSignals(listings) {
  const byArea = new Map();
  for (const item of listings) {
    const key = item.area || item.city || 'Downtown';
    const bucket = byArea.get(key) ?? { area: key, count: 0, ratingSum: 0 };
    bucket.count += 1;
    bucket.ratingSum += Number(item.rating || 0);
    byArea.set(key, bucket);
  }
  return [...byArea.values()]
    .map((b) => ({
      area: b.area,
      venues: b.count,
      avgRating: b.count ? Number((b.ratingSum / b.count).toFixed(2)) : 0,
    }))
    .sort((a, b) => b.venues - a.venues || b.avgRating - a.avgRating);
}

function buildBusinessDashboard(listings, query = {}, options = {}) {
  const radiusKm = Math.min(Math.max(Number(query.radiusKm || 5), 1), 25);
  const hasGeo = query.lat && query.lng;
  const hotspots = neighborhoodSignals(listings);
  const primaryCity = listings[0]?.city || 'Kigali';
  const topSpot = hotspots[0];
  const vertical = getVerticalPack(query.vertical);

  const baseChecklist = [
    { id: 'c1', label: 'Confirm pending requests', done: false, priority: 'high' },
    { id: 'c2', label: 'Review no-show risk (next 2h)', done: false, priority: 'medium' },
    { id: 'c3', label: 'Post today’s “open seats” story', done: true, priority: 'low' },
  ];

  const mergedChecklist = [...(vertical.tradeChecklist || []), ...baseChecklist].slice(0, 6);

  const baseFeed = [
    {
      id: 'feed-1',
      event: 'New booking request',
      detail: vertical.smartFeedHints?.[0] || 'Aline requested Wash & blow-dry for 10:30',
      channel: 'WhatsApp bridge',
      ago: 'Just now',
    },
    {
      id: 'feed-2',
      event: 'Slot auto-filled',
      detail: vertical.smartFeedHints?.[1] || '11:40 gap filled with walk-in fade',
      channel: 'Smart availability',
      ago: '2 min ago',
    },
    {
      id: 'feed-3',
      event: 'Retention trigger sent',
      detail: '21-day comeback campaign sent to 18 users',
      channel: 'Automation',
      ago: '5 min ago',
    },
  ];

  return {
    reputation: {
      responseRate: '98%',
      repeatRate: '61%',
      confirmationSpeed: '< 3 min',
      badge: 'Trusted Booking Partner',
    },
    localDiscovery: {
      city: primaryCity,
      radiusKm,
      geoEnabled: Boolean(hasGeo),
      headline: hasGeo
        ? `Near-me demand is heating up within ~${radiusKm} km`
        : `Turn on location to rank “near me” demand for ${primaryCity}`,
      hotspots: hotspots.slice(0, 4),
      actions: [
        { id: 'maps', label: 'Pin exact map location', impact: '+discovery' },
        { id: 'hours', label: 'Show live open hours', impact: '+trust' },
        { id: 'photos', label: 'Add 6 story-style photos', impact: '+conversion' },
      ],
    },
    channels: {
      whatsapp: { medianReply: '42s', templatesReady: 6, bridgeHealth: 'Healthy' },
      inApp: { unreadThreads: 3, autoReplies: 4 },
      walkIns: { suggestedBuffer: '12 min', promo: 'Flash 15% for 4–6pm gaps' },
    },
    operations: {
      checklist: mergedChecklist,
      queueHealth: topSpot
        ? `${topSpot.area} is the busiest pocket today`
        : 'Add more listings to unlock neighborhood demand',
    },
    growthStudio: [
      {
        id: 'g1',
        title: 'Story-style promo',
        body: '60s reel + limited slots — feels native, not spammy.',
        cta: 'Draft campaign',
      },
      {
        id: 'g2',
        title: 'VIP pass for repeats',
        body: 'Auto-tag guests after 2 visits; unlock express booking.',
        cta: 'Enable pass',
      },
      {
        id: 'g3',
        title: 'Near-me boost',
        body: `Boost visibility in ${primaryCity} when demand spikes after work.`,
        cta: 'Schedule boost',
      },
    ],
    feed: baseFeed,
    verticalProfile: {
      id: vertical.id,
      label: vertical.label,
      headline: vertical.headline,
      accent: vertical.accent,
      guestNotificationPlaybook: vertical.guestNotificationPlaybook || [],
    },
    automations: [
      { id: 'a1', name: 'Appointment reminder · 2h before', enabled: true },
      { id: 'a2', name: 'No-show rescue message · 15m after', enabled: true },
      { id: 'a3', name: 'Come-back campaign · 21 days', enabled: true },
      { id: 'a4', name: 'Birthday offer · monthly', enabled: true },
    ],
    floorReality: buildBusinessFloorReality(listings, options.bookings || []),
    workforceReality: buildBusinessWorkforceReality(
      options.bookings || [],
      Number(options.workerCount || 8),
    ),
  };
}

module.exports = { buildCustomerDashboard, buildBusinessDashboard };
