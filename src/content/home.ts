import { brand } from "@/config/brand";

export const aboutHome = {
  kicker: "ABOUT VISTORA",
  title: "Your travel partner from Dhaka to the world.",
  body: "Vistora Tours & Travels helps families, professionals, and pilgrims with air tickets, visas, work permits, tours, and Umrah & Hajj — with a consultant who stays with your file from first enquiry to departure.",
  cta: "Read more",
  href: "#about",
} as const;

export const servicesHome = {
  kicker: "OUR SERVICES",
  title: "Everything you need to travel with clarity.",
  body: "One partner for tickets, paperwork, and the journey beyond.",
  items: [
    {
      id: "air-ticketing",
      name: "Air Ticketing",
      excerpt: "Domestic and international flights with clear fare options.",
      icon: "Plane",
    },
    {
      id: "visa-processing",
      name: "Visa Processing",
      excerpt: "Document guidance and submission support by destination.",
      icon: "FileCheck",
    },
    {
      id: "tour-packages",
      name: "Tour Packages",
      excerpt: "Curated trips with hotels, transfers, and on-ground support.",
      icon: "Map",
    },
    {
      id: "umrah-hajj",
      name: "Umrah & Hajj",
      excerpt: "Spiritual journeys planned with care and clear checklists.",
      icon: "Mosque",
    },
    {
      id: "work-permit",
      name: "Work Permit",
      excerpt: "Overseas employment paperwork handled with diligence.",
      icon: "Briefcase",
    },
    {
      id: "hotel-booking",
      name: "Hotel Booking",
      excerpt: "Stays matched to your budget, dates, and destination.",
      icon: "Hotel",
    },
    {
      id: "travel-insurance",
      name: "Travel Insurance",
      excerpt: "Coverage options so you travel with peace of mind.",
      icon: "Shield",
    },
    {
      id: "airport-transfer",
      name: "Airport Transfer",
      excerpt: "Reliable pickups and drop-offs when you land or leave.",
      icon: "Car",
    },
    {
      id: "consultation",
      name: "Travel Consultation",
      excerpt: "Honest advice on routes, visas, and timing before you book.",
      icon: "MessageCircle",
    },
  ],
} as const;

export const destinationsHome = {
  kicker: "POPULAR DESTINATIONS",
  title: "Where Bangladesh travelers go next.",
  body: "Featured routes today — more destinations can be added as you grow.",
  items: [
    { name: "Malaysia", country: "Malaysia", tone: "#0b3d4a" },
    { name: "Thailand", country: "Thailand", tone: "#1a3a5c" },
    { name: "Singapore", country: "Singapore", tone: "#12263a" },
    { name: "UAE", country: "United Arab Emirates", tone: "#0f2f3a" },
    { name: "Saudi Arabia", country: "Saudi Arabia", tone: "#1c2e24" },
    { name: "India", country: "India", tone: "#2a1f18" },
    { name: "Maldives", country: "Maldives", tone: "#0d3b4d" },
    { name: "Turkey", country: "Turkey", tone: "#2a1820" },
    { name: "Azerbaijan", country: "Azerbaijan", tone: "#1a2740" },
    { name: "Georgia", country: "Georgia", tone: "#243044" },
  ],
} as const;

export const toursHome = {
  kicker: "TOUR PACKAGES",
  title: "Trips shaped around how you want to arrive.",
  body: "Starting points — enquire for current dates and availability.",
  items: [
    {
      id: "kl-escape",
      name: "Kuala Lumpur Escape",
      destination: "Malaysia",
      duration: "4D / 3N",
      startingPrice: 45000,
      currency: "BDT" as const,
      excerpt: "City highlights, shopping, and easy transfers from Dhaka.",
      image: brand.assets.hero.frameNight,
    },
    {
      id: "bangkok-pulse",
      name: "Bangkok City Pulse",
      destination: "Thailand",
      duration: "5D / 4N",
      startingPrice: 52000,
      currency: "BDT" as const,
      excerpt: "Temples, markets, and a paced itinerary for first-timers.",
      image: brand.assets.hero.frameWing,
    },
    {
      id: "dubai-lights",
      name: "Dubai Lights",
      destination: "UAE",
      duration: "5D / 4N",
      startingPrice: 78000,
      currency: "BDT" as const,
      excerpt: "Skyline views, desert evening, and airport support included.",
      image: brand.assets.hero.frameArrival,
    },
  ],
} as const;

export const visaHome = {
  kicker: "VISA ASSISTANCE",
  title: "Clear guidance for the countries you need.",
  body: "We support documentation and process — never a promise of guaranteed approval.",
  disclaimer:
    "Visa decisions rest with the issuing authority. Vistora helps you prepare and submit correctly.",
  items: [
    {
      country: "Malaysia",
      name: "Tourist & employment pathways",
      excerpt: "Checklist, appointment support, and follow-up on your file.",
    },
    {
      country: "UAE",
      name: "Visit & work documentation",
      excerpt: "Paperwork structured for embassies and employers.",
    },
    {
      country: "Saudi Arabia",
      name: "Visit, Umrah & related visas",
      excerpt: "Requirements mapped before you submit.",
    },
    {
      country: "Thailand",
      name: "Tourist visa support",
      excerpt: "Forms, photos, and travel proof prepared carefully.",
    },
    {
      country: "Singapore",
      name: "Visit visa guidance",
      excerpt: "Document review so incomplete files don’t slow you down.",
    },
    {
      country: "Turkey",
      name: "e-Visa & visit support",
      excerpt: "Practical steps for popular leisure routes.",
    },
  ],
} as const;

export const whyHome = {
  kicker: "WHY CHOOSE VISTORA",
  title: "Practical help. Personal follow-through.",
  items: [
    {
      title: "One consultant, one file",
      body: "You speak to someone who knows your case — not a revolving inbox.",
    },
    {
      title: "Tickets to permits",
      body: "Air tickets, visas, work permits, and tours under one roof in Dhaka.",
    },
    {
      title: "Honest timelines",
      body: "We explain what is in our control — and what depends on embassies or airlines.",
    },
    {
      title: "WhatsApp-ready support",
      body: "Fast answers when you need an update before you travel.",
    },
  ],
} as const;

export const howHome = {
  kicker: "HOW IT WORKS",
  title: "From first message to departure.",
  steps: [
    {
      index: "01",
      title: "Contact",
      body: "Share your destination, dates, and service need via form or WhatsApp.",
    },
    {
      index: "02",
      title: "Plan",
      body: "We map tickets, visas, or packages around your budget and timeline.",
    },
    {
      index: "03",
      title: "Confirm",
      body: "Documents, payments, and bookings are locked with clear next steps.",
    },
    {
      index: "04",
      title: "Travel",
      body: "You depart knowing who to call if anything shifts on the day.",
    },
  ],
} as const;

export const reviewsHome = {
  kicker: "TRAVELER NOTES",
  title: "What clients say after the stamp and the boarding pass.",
  items: [
    {
      author: "Rahim H.",
      country: "Malaysia",
      quote:
        "Visa documents were checked twice before submission. No last-minute surprises.",
      rating: 5,
    },
    {
      author: "Nusrat A.",
      country: "UAE",
      quote:
        "Ticket and hotel were sorted in one conversation. Clear pricing from the start.",
      rating: 5,
    },
    {
      author: "Karim S.",
      country: "Saudi Arabia",
      quote:
        "Umrah planning felt organised. They stayed reachable on WhatsApp throughout.",
      rating: 5,
    },
  ],
} as const;

export const galleryHome = {
  kicker: "GALLERY",
  title: "Moments from the journey.",
  images: [
    { src: brand.assets.hero.frameStart, alt: "View from the cabin window" },
    { src: brand.assets.hero.frameWing, alt: "Wing above the clouds" },
    { src: brand.assets.hero.frameClouds, alt: "Descending through cloud" },
    { src: brand.assets.hero.frameNight, alt: "Night sky over the city" },
    { src: brand.assets.hero.frameArrival, alt: "Paris revealed" },
    { src: brand.assets.hero.frameStart, alt: "Ready for departure" },
  ],
} as const;

export const inquiryHome = {
  kicker: "ENQUIRE",
  title: "Tell us how you want to travel.",
  body: "Share a few details — a Vistora consultant will follow up.",
  serviceOptions: [
    "Air Ticketing",
    "Visa Processing",
    "Tour Packages",
    "Umrah & Hajj",
    "Work Permit",
    "Hotel Booking",
    "Travel Insurance",
    "Airport Transfer",
    "Travel Consultation",
    "Other",
  ],
  successTitle: "Thank you — we received your enquiry.",
  successBody:
    "Our team will contact you shortly. For faster help, message us on WhatsApp.",
} as const;

export const footerHome = {
  blurb:
    "Vistora Tours & Travels — air tickets, visas, work permits, tours, and Umrah & Hajj from Dhaka.",
  licenses: "Licenses & registrations available on request.",
  copyright: `© ${new Date().getFullYear()} ${brand.legalName}. All rights reserved.`,
} as const;
