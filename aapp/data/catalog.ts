export type Listing = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  city: string;
  area: string;
  rating: number;
  reviews: number;
  priceFromRwf: number;
  instantConfirm: boolean;
  busyNow: boolean;
  openUntil: string;
  memberSince: string;
  languages: string[];
  image: string;
  gallery: string[];
  highlights: string[];
  badges: string[];
  whatsapp: string;
  services: { id: string; name: string; priceRwf: number; durationMin: number; description?: string }[];
};

export const categories = [
  { id: 'all', label: 'All services', icon: '✨' },
  { id: 'Salon', label: 'Salon', icon: '💇' },
  { id: 'Barber', label: 'Barber', icon: '✂️' },
  { id: 'Spa', label: 'Spa', icon: '🧖' },
  { id: 'Nails', label: 'Nails', icon: '💅' },
  { id: 'Massage', label: 'Massage', icon: '💆' },
  { id: 'Courier', label: 'Courier', icon: '📬' },
];

export const listings: Listing[] = [
  {
    slug: 'amahoro-glow-salon',
    name: 'Amahoro Glow Salon',
    tagline: 'Colour, braids & blow-dry - confirmed on WhatsApp in minutes.',
    category: 'Salon',
    city: 'Kigali',
    area: 'Kimihurura',
    rating: 4.9,
    reviews: 328,
    priceFromRwf: 12000,
    instantConfirm: true,
    busyNow: true,
    openUntil: '19:00',
    memberSince: '2022',
    languages: ['English', 'Kinyarwanda', 'French'],
    image:
      'https://images.unsplash.com/photo-1560066984-138d7534a604?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1200&q=80',
    ],
    highlights: ['Walk-ins welcome', 'Private styling room', 'Card & MoMo accepted'],
    badges: ['popular', 'topRated'],
    whatsapp: '250788000001',
    services: [
      {
        id: 'wash-blow',
        name: 'Wash & blow-dry',
        priceRwf: 15000,
        durationMin: 45,
        description: 'Shampoo, treatment, finish with your preferred style.',
      },
      { id: 'braids-m', name: 'Braids (medium length)', priceRwf: 35000, durationMin: 120 },
      { id: 'colour', name: 'Colour touch-up', priceRwf: 22000, durationMin: 60 },
    ],
  },
  {
    slug: 'kigali-cuts-barbers',
    name: 'Kigali Cuts Barbers',
    tagline: 'Sharp fades, beard sculpting, zero hassle booking.',
    category: 'Barber',
    city: 'Kigali',
    area: 'Nyarutarama',
    rating: 4.85,
    reviews: 214,
    priceFromRwf: 5000,
    instantConfirm: true,
    busyNow: false,
    openUntil: '20:30',
    memberSince: '2021',
    languages: ['English', 'Kinyarwanda'],
    image:
      'https://images.unsplash.com/photo-1503951914875-452162b0e3e1?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80',
    ],
    highlights: ['Kids cuts', 'Hot towel finish', 'Same-day slots'],
    badges: ['popular'],
    whatsapp: '250788000002',
    services: [
      { id: 'cut', name: 'Signature haircut', priceRwf: 5000, durationMin: 30 },
      { id: 'cut-beard', name: 'Haircut + beard', priceRwf: 8000, durationMin: 45 },
      { id: 'kids', name: 'Kids cut', priceRwf: 4000, durationMin: 25 },
    ],
  },
  {
    slug: 'ikirezi-spa',
    name: 'Ikirezi Spa & Wellness',
    tagline: 'Massage, facials, and quiet rooms for deep recovery.',
    category: 'Spa',
    city: 'Kigali',
    area: 'Remera',
    rating: 4.95,
    reviews: 156,
    priceFromRwf: 18000,
    instantConfirm: false,
    busyNow: false,
    openUntil: '21:00',
    memberSince: '2024',
    languages: ['English', 'French'],
    image:
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80',
    ],
    highlights: ['Couples room', 'Certified therapists', 'Free tea'],
    badges: ['topRated', 'new'],
    whatsapp: '250788000003',
    services: [
      { id: 'facial', name: 'Express facial', priceRwf: 18000, durationMin: 40 },
      { id: 'massage', name: 'Full body massage', priceRwf: 45000, durationMin: 90 },
    ],
  },
  {
    slug: 'inkuru-nails',
    name: 'Inkuru Nails Studio',
    tagline: 'Gel, acrylic, and quick lunch-hour slots.',
    category: 'Nails',
    city: 'Kigali',
    area: 'CBD',
    rating: 4.7,
    reviews: 402,
    priceFromRwf: 8000,
    instantConfirm: true,
    busyNow: false,
    openUntil: '18:00',
    memberSince: '2023',
    languages: ['English', 'Kinyarwanda'],
    image:
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519014816548-bf6468b28b08?auto=format&fit=crop&w=1200&q=80',
    ],
    highlights: ['Hygienic tools', 'Design catalog', 'Group bookings'],
    badges: ['popular'],
    whatsapp: '250788000004',
    services: [
      { id: 'gel', name: 'Gel manicure', priceRwf: 12000, durationMin: 50 },
      { id: 'acrylic', name: 'Acrylic set', priceRwf: 22000, durationMin: 75 },
    ],
  },
];

export function searchListings(query: string, category: string) {
  const q = query.trim().toLowerCase();
  return listings.filter((item) => {
    const inQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.tagline.toLowerCase().includes(q) ||
      item.area.toLowerCase().includes(q);
    const inCategory = category === 'all' || !category || item.category === category;
    return inQuery && inCategory;
  });
}

export function getListing(slug?: string | string[]) {
  if (!slug || Array.isArray(slug)) return undefined;
  return listings.find((item) => item.slug === slug);
}
