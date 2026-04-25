/** Presets for multi-vertical operators — merged into /api/dashboard/business */

const IDS = new Set([
  'Salon',
  'Barber',
  'Spa',
  'Nails',
  'Courier',
  'Logistics',
  'MotorbikeRide',
  'BicycleTransport',
  'Recruitment',
  'JobSearch',
])

function normalizeVertical(id) {
  const s = String(id || '').trim()
  return IDS.has(s) ? s : 'Salon'
}

function getVerticalPack(verticalId) {
  const id = normalizeVertical(verticalId)
  const packs = {
    Salon: {
      id: 'Salon',
      label: 'Salon & beauty chair',
      headline: 'Chair time, color slots, and retail add-ons — tuned for beauty teams.',
      accent: 'from-fuchsia-500 via-rose-500 to-amber-400',
      tradeChecklist: [
        { id: 'v1', label: 'Color processing timers & rinse queue', done: false, priority: 'high' },
        { id: 'v2', label: 'Retail bundle attach rate goal', done: false, priority: 'medium' },
        { id: 'v3', label: 'Evening “last chair” promo', done: true, priority: 'low' },
      ],
      smartFeedHints: ['New color consult · patch test', 'Blow-dry express lane opened'],
      guestNotificationPlaybook: ['Slot confirmed + prep tips', 'Running 10m late? one-tap notify'],
    },
    Barber: {
      id: 'Barber',
      label: 'Barber & fades',
      headline: 'Walk-ins, fades, and razor work — fast lane for short appointments.',
      accent: 'from-slate-700 via-zinc-800 to-amber-500',
      tradeChecklist: [
        { id: 'v1', label: 'Fade queue vs beard detail blocks', done: false, priority: 'high' },
        { id: 'v2', label: 'Walk-in buffer policy', done: true, priority: 'medium' },
        { id: 'v3', label: 'Kids cuts express lane', done: false, priority: 'low' },
      ],
      smartFeedHints: ['Walk-in surge · open 2 slots', 'Beard oil upsell campaign'],
      guestNotificationPlaybook: ['“You’re next” buzz', 'Tip-free checkout reminder'],
    },
    Spa: {
      id: 'Spa',
      label: 'Spa & wellness',
      headline: 'Quiet rooms, therapist load, and recovery journeys.',
      accent: 'from-emerald-600 via-teal-600 to-cyan-400',
      tradeChecklist: [
        { id: 'v1', label: 'Room turnover & linen refresh', done: false, priority: 'high' },
        { id: 'v2', label: 'Couples suite sync', done: false, priority: 'medium' },
        { id: 'v3', label: 'Post-massage hydration offer', done: true, priority: 'low' },
      ],
      smartFeedHints: ['Hot stone kit cooldown', 'Member monthly visit due'],
      guestNotificationPlaybook: ['Arrive 15m early for intake', 'Aftercare voice note'],
    },
    Nails: {
      id: 'Nails',
      label: 'Nails studio',
      headline: 'Dry time, art layers, and group bookings.',
      accent: 'from-pink-500 via-fuchsia-600 to-violet-600',
      tradeChecklist: [
        { id: 'v1', label: 'Dry station throughput', done: false, priority: 'high' },
        { id: 'v2', label: 'Nail art SLA per tier', done: false, priority: 'medium' },
        { id: 'v3', label: 'Group of 4 table merge', done: false, priority: 'low' },
      ],
      smartFeedHints: ['Gel cure cycle batching', 'Birthday party slot hold'],
      guestNotificationPlaybook: ['Pick design board link', 'Dry time countdown'],
    },
    Courier: {
      id: 'Courier',
      label: 'Courier & delivery',
      headline: 'Proof of delivery, SLA windows, and route batches.',
      accent: 'from-orange-500 via-amber-500 to-yellow-400',
      tradeChecklist: [
        { id: 'v1', label: 'Batch pickups · max 12 parcels', done: false, priority: 'high' },
        { id: 'v2', label: 'Failed attempt auto-retry rule', done: false, priority: 'medium' },
        { id: 'v3', label: 'COD reconciliation', done: true, priority: 'low' },
      ],
      smartFeedHints: ['Rain delay · ETA +8m average', 'Cold chain bag check'],
      guestNotificationPlaybook: ['Live map + photo POD', 'Reschedule drop window'],
    },
    Logistics: {
      id: 'Logistics',
      label: 'Logistics & warehouse',
      headline: 'Dock slots, manifests, and cross-dock handoffs.',
      accent: 'from-slate-600 via-blue-800 to-indigo-900',
      tradeChecklist: [
        { id: 'v1', label: 'Dock door 3 congestion', done: false, priority: 'high' },
        { id: 'v2', label: 'Manifest mismatch scan', done: false, priority: 'medium' },
        { id: 'v3', label: 'Night shift handoff note', done: true, priority: 'low' },
      ],
      smartFeedHints: ['Inbound truck delayed 22m', 'Cross-dock to courier lane'],
      guestNotificationPlaybook: ['Shipment exception codes plain language', 'Warehouse photo proof'],
    },
    MotorbikeRide: {
      id: 'MotorbikeRide',
      label: 'Moto rides',
      headline: 'Rider safety, helmet policy, and surge pockets.',
      accent: 'from-red-600 via-orange-500 to-amber-400',
      tradeChecklist: [
        { id: 'v1', label: 'Helmet inventory check', done: true, priority: 'high' },
        { id: 'v2', label: 'Night ride paired dispatch', done: false, priority: 'medium' },
        { id: 'v3', label: 'Rain gear add-on attach', done: false, priority: 'low' },
      ],
      smartFeedHints: ['Surge near CBD · 14 riders waiting', 'Safety micro-training prompt'],
      guestNotificationPlaybook: ['Rider photo + plate match', 'Share trip with contact'],
    },
    BicycleTransport: {
      id: 'BicycleTransport',
      label: 'Bike logistics',
      headline: 'Eco routes, cargo weight tiers, and rider breaks.',
      accent: 'from-lime-500 via-emerald-600 to-teal-600',
      tradeChecklist: [
        { id: 'v1', label: 'Cargo weight tier compliance', done: false, priority: 'high' },
        { id: 'v2', label: 'Green corridor ETA', done: false, priority: 'medium' },
        { id: 'v3', label: 'Rider hydration break policy', done: true, priority: 'low' },
      ],
      smartFeedHints: ['Heat index · swap short routes', 'Cargo bike maintenance due'],
      guestNotificationPlaybook: ['CO₂ saved this trip', 'Contactless handoff PIN'],
    },
    Recruitment: {
      id: 'Recruitment',
      label: 'Recruitment',
      headline: 'Pipelines, interviews, and employer SLAs.',
      accent: 'from-indigo-600 via-violet-600 to-fuchsia-600',
      tradeChecklist: [
        { id: 'v1', label: 'Offer response SLA · 48h', done: false, priority: 'high' },
        { id: 'v2', label: 'Interview scorecards sync', done: false, priority: 'medium' },
        { id: 'v3', label: 'Employer brand story post', done: true, priority: 'low' },
      ],
      smartFeedHints: ['3 candidates awaiting feedback', 'Client A · role reopened'],
      guestNotificationPlaybook: ['Interview kit checklist', 'Anonymous salary band opt-in'],
    },
    JobSearch: {
      id: 'JobSearch',
      label: 'Job seeker hub',
      headline: 'Applications, coach sessions, and follow-ups.',
      accent: 'from-sky-600 via-blue-700 to-indigo-800',
      tradeChecklist: [
        { id: 'v1', label: 'CV review queue', done: false, priority: 'high' },
        { id: 'v2', label: 'Mock interview slots', done: false, priority: 'medium' },
        { id: 'v3', label: 'Weekly accountability nudge', done: true, priority: 'low' },
      ],
      smartFeedHints: ['2 new matches in Kigali', 'Application deadline tonight'],
      guestNotificationPlaybook: ['Application opened by recruiter', 'Prep pack for tomorrow'],
    },
  }
  return packs[id] || packs.Salon
}

module.exports = { getVerticalPack, normalizeVertical }
