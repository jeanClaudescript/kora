export type ListingBadge = 'popular' | 'topRated' | 'almostFull' | 'new'

export type ServiceItem = {
  id: string
  name: string
  priceRwf: number
  durationMin: number
  description?: string
}

export type Listing = {
  slug: string
  name: string
  tagline: string
  category: string
  city: string
  area: string
  rating: number
  reviews: number
  priceFromRwf: number
  instantConfirm: boolean
  busyNow: boolean
  openUntil: string
  image: string
  gallery: string[]
  highlights: string[]
  badges: ListingBadge[]
  services: ServiceItem[]
  /** WhatsApp number without + */
  whatsapp: string
  memberSince: string
  languages: string[]
}

export const listings: Listing[] = [
  {
    slug: 'amahoro-glow-salon',
    name: 'Amahoro Glow Salon',
    tagline: 'Colour, braids & blow-dry — confirmed on WhatsApp in minutes.',
    category: 'Salon',
    city: 'Kigali',
    area: 'Kimihurura',
    rating: 4.9,
    reviews: 328,
    priceFromRwf: 12000,
    instantConfirm: true,
    busyNow: true,
    openUntil: '19:00',
    image:
      'https://images.unsplash.com/photo-1560066984-138d7534a604?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=900&q=80',
    ],
    highlights: [
      'Walk-ins welcome',
      'Private styling room',
      'Card & MoMo accepted',
    ],
    badges: ['popular', 'topRated', 'almostFull'],
    services: [
      {
        id: 'wash-blow',
        name: 'Wash & blow-dry',
        priceRwf: 15000,
        durationMin: 45,
        description: 'Shampoo, treatment, finish with your preferred style.',
      },
      {
        id: 'braids-m',
        name: 'Braids (medium length)',
        priceRwf: 35000,
        durationMin: 120,
      },
      {
        id: 'colour',
        name: 'Colour touch-up',
        priceRwf: 22000,
        durationMin: 60,
      },
    ],
    whatsapp: '250788000001',
    memberSince: '2022',
    languages: ['English', 'Kinyarwanda', 'French'],
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
    image:
      'https://images.unsplash.com/photo-1503951914875-452162b0e3e1?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=900&q=80',
    ],
    highlights: ['Kids cuts', 'Hot towel finish', 'Same-day slots'],
    badges: ['popular', 'topRated'],
    services: [
      {
        id: 'cut',
        name: 'Signature haircut',
        priceRwf: 5000,
        durationMin: 30,
      },
      {
        id: 'cut-beard',
        name: 'Haircut + beard',
        priceRwf: 8000,
        durationMin: 45,
      },
      {
        id: 'kids',
        name: 'Kids cut',
        priceRwf: 4000,
        durationMin: 25,
      },
    ],
    whatsapp: '250788000002',
    memberSince: '2021',
    languages: ['English', 'Kinyarwanda'],
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
    image:
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=900&q=80',
    ],
    highlights: ['Couples room', 'Certified therapists', 'Free tea'],
    badges: ['topRated', 'almostFull', 'new'],
    services: [
      {
        id: 'facial',
        name: 'Express facial',
        priceRwf: 18000,
        durationMin: 40,
      },
      {
        id: 'massage',
        name: 'Full body massage',
        priceRwf: 45000,
        durationMin: 90,
      },
    ],
    whatsapp: '250788000003',
    memberSince: '2024',
    languages: ['English', 'French'],
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
    image:
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519014816548-bf6468b28b08?auto=format&fit=crop&w=900&q=80',
    ],
    highlights: ['Hygienic tools', 'Design catalog', 'Group bookings'],
    badges: ['popular'],
    services: [
      { id: 'gel', name: 'Gel manicure', priceRwf: 12000, durationMin: 50 },
      { id: 'acrylic', name: 'Acrylic set', priceRwf: 22000, durationMin: 75 },
    ],
    whatsapp: '250788000004',
    memberSince: '2023',
    languages: ['English', 'Kinyarwanda'],
  },
]

export const categories = [
  { id: 'all', label: 'All services', icon: '✨' },
  { id: 'Salon', label: 'Salon', icon: '💇' },
  { id: 'Barber', label: 'Barber', icon: '✂️' },
  { id: 'Spa', label: 'Spa', icon: '🧖' },
  { id: 'Nails', label: 'Nails', icon: '💅' },
  { id: 'Makeup', label: 'Makeup', icon: '💄' },
  { id: 'Skincare', label: 'Skincare', icon: '🧴' },
  { id: 'Massage', label: 'Massage', icon: '💆' },
  { id: 'Physiotherapy', label: 'Physiotherapy', icon: '🩺' },
  { id: 'Dentist', label: 'Dentist', icon: '🦷' },
  { id: 'EyeCare', label: 'Eye care', icon: '👓' },
  { id: 'GeneralClinic', label: 'General clinic', icon: '🏥' },
  { id: 'MentalHealth', label: 'Mental health', icon: '🧠' },
  { id: 'Pharmacy', label: 'Pharmacy', icon: '💊' },
  { id: 'Laboratory', label: 'Laboratory', icon: '🧪' },
  { id: 'Veterinary', label: 'Veterinary', icon: '🐾' },
  { id: 'PersonalTrainer', label: 'Personal trainer', icon: '🏋️' },
  { id: 'Gym', label: 'Gym', icon: '🏃' },
  { id: 'Yoga', label: 'Yoga', icon: '🧘' },
  { id: 'Nutritionist', label: 'Nutritionist', icon: '🥗' },
  { id: 'HairSupply', label: 'Hair supply', icon: '🛍️' },
  { id: 'Tailoring', label: 'Tailoring', icon: '🧵' },
  { id: 'Laundry', label: 'Laundry', icon: '🧺' },
  { id: 'DryCleaning', label: 'Dry cleaning', icon: '👔' },
  { id: 'ShoeRepair', label: 'Shoe repair', icon: '👞' },
  { id: 'WatchRepair', label: 'Watch repair', icon: '⌚' },
  { id: 'JewelryRepair', label: 'Jewelry repair', icon: '💍' },
  { id: 'PhoneRepair', label: 'Phone repair', icon: '📱' },
  { id: 'ComputerRepair', label: 'Computer repair', icon: '💻' },
  { id: 'ApplianceRepair', label: 'Appliance repair', icon: '🔌' },
  { id: 'TvRepair', label: 'TV repair', icon: '📺' },
  { id: 'Plumber', label: 'Plumber', icon: '🔧' },
  { id: 'Electrician', label: 'Electrician', icon: '💡' },
  { id: 'Carpenter', label: 'Carpenter', icon: '🪚' },
  { id: 'Painter', label: 'Painter', icon: '🖌️' },
  { id: 'Mason', label: 'Mason', icon: '🧱' },
  { id: 'Welder', label: 'Welder', icon: '⚙️' },
  { id: 'CleaningHome', label: 'Home cleaning', icon: '🧼' },
  { id: 'PestControl', label: 'Pest control', icon: '🪳' },
  { id: 'SecurityGuard', label: 'Security guard', icon: '🛡️' },
  { id: 'CctvInstall', label: 'CCTV install', icon: '📹' },
  { id: 'InternetInstall', label: 'Internet install', icon: '🌐' },
  { id: 'WaterDelivery', label: 'Water delivery', icon: '🚰' },
  { id: 'GasDelivery', label: 'Gas delivery', icon: '🛢️' },
  { id: 'MovingService', label: 'Moving service', icon: '📦' },
  { id: 'Storage', label: 'Storage', icon: '🏬' },
  { id: 'InteriorDesign', label: 'Interior design', icon: '🛋️' },
  { id: 'Architecture', label: 'Architecture', icon: '🏗️' },
  { id: 'RealEstateAgent', label: 'Real estate', icon: '🏠' },
  { id: 'PropertyManagement', label: 'Property management', icon: '🏢' },
  { id: 'Coworking', label: 'Coworking', icon: '🪑' },
  { id: 'EventVenue', label: 'Event venue', icon: '🏛️' },
  { id: 'Photographer', label: 'Photographer', icon: '📸' },
  { id: 'Videographer', label: 'Videographer', icon: '🎥' },
  { id: 'Dj', label: 'DJ', icon: '🎧' },
  { id: 'LiveBand', label: 'Live band', icon: '🎸' },
  { id: 'McHost', label: 'MC / Host', icon: '🎤' },
  { id: 'Decoration', label: 'Decoration', icon: '🎈' },
  { id: 'Catering', label: 'Catering', icon: '🍽️' },
  { id: 'Bakery', label: 'Bakery', icon: '🥐' },
  { id: 'Restaurant', label: 'Restaurant', icon: '🍲' },
  { id: 'CoffeeShop', label: 'Coffee shop', icon: '☕' },
  { id: 'FoodDelivery', label: 'Food delivery', icon: '🛵' },
  { id: 'GroceryDelivery', label: 'Grocery delivery', icon: '🛒' },
  { id: 'Courier', label: 'Courier', icon: '📬' },
  { id: 'MotorbikeRide', label: 'Motorbike ride', icon: '🏍️' },
  { id: 'BicycleTransport', label: 'Bicycle transport', icon: '🚲' },
  { id: 'Taxi', label: 'Taxi', icon: '🚕' },
  { id: 'CarRental', label: 'Car rental', icon: '🚗' },
  { id: 'BusTicket', label: 'Bus ticket', icon: '🚌' },
  { id: 'TruckTransport', label: 'Truck transport', icon: '🚚' },
  { id: 'Freight', label: 'Freight', icon: '🚛' },
  { id: 'Logistics', label: 'Logistics', icon: '🗺️' },
  { id: 'TravelAgent', label: 'Travel agent', icon: '🧳' },
  { id: 'TourGuide', label: 'Tour guide', icon: '🧭' },
  { id: 'Hotel', label: 'Hotel', icon: '🏨' },
  { id: 'GuestHouse', label: 'Guest house', icon: '🛏️' },
  { id: 'AirportTransfer', label: 'Airport transfer', icon: '✈️' },
  { id: 'Mechanic', label: 'Mechanic', icon: '🛠️' },
  { id: 'CarWash', label: 'Car wash', icon: '🚿' },
  { id: 'TyreService', label: 'Tyre service', icon: '🛞' },
  { id: 'CarBattery', label: 'Car battery', icon: '🔋' },
  { id: 'FuelStation', label: 'Fuel station', icon: '⛽' },
  { id: 'DrivingSchool', label: 'Driving school', icon: '🚦' },
  { id: 'Insurance', label: 'Insurance', icon: '📄' },
  { id: 'Banking', label: 'Banking', icon: '🏦' },
  { id: 'MobileMoney', label: 'Mobile money', icon: '📲' },
  { id: 'Accounting', label: 'Accounting', icon: '🧾' },
  { id: 'TaxService', label: 'Tax service', icon: '📊' },
  { id: 'Legal', label: 'Legal', icon: '⚖️' },
  { id: 'Notary', label: 'Notary', icon: '🖋️' },
  { id: 'Translation', label: 'Translation', icon: '🌍' },
  { id: 'Printing', label: 'Printing', icon: '🖨️' },
  { id: 'DesignService', label: 'Design service', icon: '🎨' },
  { id: 'WebDevelopment', label: 'Web development', icon: '🧑‍💻' },
  { id: 'AppDevelopment', label: 'App development', icon: '📱' },
  { id: 'DigitalMarketing', label: 'Digital marketing', icon: '📣' },
  { id: 'Seo', label: 'SEO', icon: '🔎' },
  { id: 'SocialMediaManager', label: 'Social media', icon: '📲' },
  { id: 'ContentWriting', label: 'Content writing', icon: '✍️' },
  { id: 'Tutoring', label: 'Tutoring', icon: '📘' },
  { id: 'LanguageClass', label: 'Language class', icon: '🗣️' },
  { id: 'MusicLessons', label: 'Music lessons', icon: '🎼' },
  { id: 'CodingBootcamp', label: 'Coding bootcamp', icon: '👨‍🏫' },
  { id: 'Childcare', label: 'Childcare', icon: '🧸' },
  { id: 'ElderlyCare', label: 'Elderly care', icon: '🫶' },
  { id: 'HomeNurse', label: 'Home nurse', icon: '👩‍⚕️' },
  { id: 'PetCare', label: 'Pet care', icon: '🐶' },
  { id: 'PetGrooming', label: 'Pet grooming', icon: '🐕' },
  { id: 'AgricultureService', label: 'Agriculture service', icon: '🌾' },
  { id: 'FarmSupply', label: 'Farm supply', icon: '🚜' },
  { id: 'ConstructionLabor', label: 'Construction labor', icon: '👷' },
  { id: 'JobSearch', label: 'Job search', icon: '🔍' },
  { id: 'Recruitment', label: 'Recruitment', icon: '🧑‍💼' },
  { id: 'FreelanceProjects', label: 'Freelance projects', icon: '📁' },
  { id: 'RemoteWork', label: 'Remote work', icon: '🏡' },
  { id: 'Internships', label: 'Internships', icon: '🎓' },
  { id: 'MarketplaceGoods', label: 'Marketplace goods', icon: '🏪' },
  { id: 'ElectronicsShop', label: 'Electronics shop', icon: '🔊' },
  { id: 'FurnitureShop', label: 'Furniture shop', icon: '🪑' },
  { id: 'BeautyProducts', label: 'Beauty products', icon: '🧴' },
  { id: 'MedicalSupplies', label: 'Medical supplies', icon: '🩹' },
  { id: 'BooksStationery', label: 'Books & stationery', icon: '📚' },
  { id: 'HardwareStore', label: 'Hardware store', icon: '🧰' },
  { id: 'BabyProducts', label: 'Baby products', icon: '🍼' },
  { id: 'SportsShop', label: 'Sports shop', icon: '⚽' },
  { id: 'Gaming', label: 'Gaming', icon: '🎮' },
] as const

export function getListing(slug: string): Listing | undefined {
  return listings.find((l) => l.slug === slug)
}

export function searchListings(params: {
  q: string
  category: string
  city: string
}): Listing[] {
  const q = params.q.trim().toLowerCase()
  const cat = params.category
  const city = params.city.trim().toLowerCase()

  return listings.filter((l) => {
    const matchQ =
      !q ||
      l.name.toLowerCase().includes(q) ||
      l.tagline.toLowerCase().includes(q) ||
      l.area.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q)
    const matchCat = cat === 'all' || !cat || l.category === cat
    const matchCity = !city || l.city.toLowerCase().includes(city)
    return matchQ && matchCat && matchCity
  })
}
