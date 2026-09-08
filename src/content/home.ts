export const aboutHome = {
  kicker: "About Vistora",
  titleLead: "Your travel partner from",
  titleAccent: "Dhaka",
  titleTrail: "to the world.",
  body: "Vistora Tours & Travels assists families, professionals, corporate groups, and pilgrims with complex embassy visa dossiers, accredited work permits, curated tour packages, and Umrah & Hajj. A dedicated consultant stays with your file from first consultation through safe departure.",
  primaryCta: "Start Your File",
  secondaryCta: "Direct WhatsApp Desk",
  hubLabel: "Dhaka Diplomatic Hub",
  hubTitle: "Trusted travel & visa desk",
  hubBody:
    "Our team orchestrates visa logistics, biometric scheduling, certified translations, hotel vouchers, and multi-destination itineraries with clear follow-through.",
  hubAddressLabel: "Dhaka, Bangladesh",
  hubAddressDetail: "Open Saturday to Thursday · WhatsApp-ready support",
  metrics: [
    {
      value: "10,000",
      suffix: "+",
      label: "Journeys Planned",
      hint: "Seamless global departures",
    },
    {
      value: "99.2",
      suffix: "%",
      label: "Visa File Success*",
      hint: "Rigorous dossier curation",
    },
    {
      value: "45",
      suffix: "+",
      label: "Destination Countries",
      hint: "Popular outbound routes",
    },
    {
      value: "24/7",
      suffix: "",
      label: "Dhaka Support Desk",
      hint: "Real-time WhatsApp hotline",
    },
  ],
  metricsNote:
    "*Success reflects correctly prepared files we support — final visa decisions rest with embassies.",
} as const;

export const servicesHome = {
  kicker: "Our Services",
  title: "Everything you need to travel with clarity.",
  body: "Visas, paperwork, packages, and the journey beyond — curated under one roof.",
  cta: "Custom Service Request",
  items: [
    {
      id: "visa-processing",
      category: "Consular Advisory",
      name: "Visa Processing",
      excerpt:
        "Tailored document checklists, notarization guidance, biometrics assistance, and embassy submission support by destination.",
      icon: "FileCheck",
    },
    {
      id: "tour-packages",
      category: "Curated Itineraries",
      name: "Tour Packages",
      excerpt:
        "Private and group holiday experiences with vetted hotels, transfers, and English-speaking local guides.",
      icon: "Map",
    },
    {
      id: "umrah-hajj",
      category: "Spiritual Pilgrimages",
      name: "Umrah & Hajj",
      excerpt:
        "Devoted journeys planned with care: accommodation guidance, Nusuk clearances, and escorted support in Makkah and Madinah.",
      icon: "Mosque",
    },
    {
      id: "work-permit",
      category: "Employment Clearance",
      name: "Work Permit",
      excerpt:
        "Diligent handling of overseas employment documentation, BMET clearances, attestation, and immigration compliance.",
      icon: "Briefcase",
    },
    {
      id: "hotel-booking",
      category: "Hospitality Sourcing",
      name: "Hotel Booking",
      excerpt:
        "Pre-screened stays matching your budget and location — with vouchers suitable for embassy submission.",
      icon: "Hotel",
    },
    {
      id: "travel-insurance",
      category: "Risk Management",
      name: "Travel Insurance",
      excerpt:
        "Medical and baggage coverage options that satisfy common consular requirements for worry-free travel.",
      icon: "Shield",
    },
    {
      id: "airport-transfer",
      category: "Ground Fleet",
      name: "Airport Transfer",
      excerpt:
        "Reliable chauffeur pickups and drop-offs when you land or leave — coordinated with your itinerary.",
      icon: "Car",
    },
    {
      id: "consultation",
      category: "Strategic Planning",
      name: "Travel Consultation",
      excerpt:
        "Honest advice on routes, seasonal timing, visa lead times, and eligibility before you commit.",
      icon: "MessageCircle",
    },
  ],
} as const;

export const destinationsHome = {
  kicker: "Curated Portals",
  title: "Where Bangladesh travelers go next.",
  body: "Top routes for vacationers, business travelers, and spiritual journeys.",
  filters: [
    { id: "all", label: "All" },
    { id: "se-asia", label: "Southeast Asia" },
    { id: "middle-east", label: "Middle East" },
    { id: "europe-asia", label: "Europe / Asia" },
    { id: "regional", label: "Regional" },
  ],
  items: [
    {
      name: "Malaysia",
      region: "se-asia",
      badge: "SE Asia",
      places: "Kuala Lumpur · Penang · Langkawi",
      fromPrice: "From BDT 42,000",
      image:
        "https://images.unsplash.com/photo-1596422846543-75c6fc764821?auto=format&fit=crop&w=900&q=80",
      tone: "#0b3d4a",
    },
    {
      name: "Thailand",
      region: "se-asia",
      badge: "SE Asia",
      places: "Bangkok · Phuket · Pattaya",
      fromPrice: "From BDT 48,000",
      image:
        "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=900&q=80",
      tone: "#1a3a5c",
    },
    {
      name: "Singapore",
      region: "se-asia",
      badge: "Urban Luxe",
      places: "Marina Bay · Sentosa Island",
      fromPrice: "From BDT 65,000",
      image:
        "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=80",
      tone: "#12263a",
    },
    {
      name: "UAE",
      region: "middle-east",
      badge: "Middle East",
      places: "Dubai · Abu Dhabi · Sharjah",
      fromPrice: "From BDT 72,000",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea833fcd8bb?auto=format&fit=crop&w=900&q=80",
      tone: "#0f2f3a",
    },
    {
      name: "Saudi Arabia",
      region: "middle-east",
      badge: "Pilgrimage",
      places: "Makkah · Madinah · Jeddah",
      fromPrice: "From BDT 95,000",
      image:
        "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=900&q=80",
      tone: "#1c2e24",
    },
    {
      name: "India",
      region: "regional",
      badge: "Regional",
      places: "Kolkata · Delhi · Chennai · Goa",
      fromPrice: "From BDT 18,500",
      image:
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80",
      tone: "#2a1f18",
    },
    {
      name: "Maldives",
      region: "se-asia",
      badge: "Islands",
      places: "North Malé · Private Atolls",
      fromPrice: "From BDT 85,000",
      image:
        "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=80",
      tone: "#0d3b4d",
    },
    {
      name: "Turkey",
      region: "europe-asia",
      badge: "Eurasia",
      places: "Istanbul · Cappadocia · Antalya",
      fromPrice: "From BDT 89,000",
      image:
        "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=900&q=80",
      tone: "#2a1820",
    },
    {
      name: "Azerbaijan",
      region: "europe-asia",
      badge: "Caucasus",
      places: "Baku · Shahdag",
      fromPrice: "From BDT 56,000",
      image:
        "https://images.unsplash.com/photo-1601665748403-0c3f4c4e0c8f?auto=format&fit=crop&w=900&q=80",
      tone: "#1a2740",
    },
    {
      name: "Georgia",
      region: "europe-asia",
      badge: "Europe / Asia",
      places: "Tbilisi · Kazbegi · Batumi",
      fromPrice: "From BDT 68,000",
      image:
        "https://images.unsplash.com/photo-1565008576549-57569a493712?auto=format&fit=crop&w=900&q=80",
      tone: "#243044",
    },
  ],
} as const;

export const toursHome = {
  kicker: "Signature Collections",
  title: "Trips shaped around how you want to arrive.",
  body: "Starting points — enquire for current season dates and availability.",
  cta: "View All & Enquire",
  items: [
    {
      id: "kl-escape",
      name: "Kuala Lumpur Escape",
      duration: "4 Nights · 5 Days",
      badge: "All-Inclusive Land",
      destination: "Malaysia",
      startingPrice: 45000,
      currency: "BDT" as const,
      excerpt:
        "City highlights, Bukit Bintang shopping, Batu Caves day tour, and chauffeured airport transfers.",
      perks: [
        "4-Star downtown hotel + breakfast",
        "Private airport transfers included",
        "Malaysia eVisa assistance",
      ],
      image:
        "https://images.unsplash.com/photo-1596422846543-75c6fc764821?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "bangkok-pulse",
      name: "Bangkok City Pulse",
      duration: "5 Nights · 6 Days",
      badge: "Bestseller",
      destination: "Thailand",
      startingPrice: 52000,
      currency: "BDT" as const,
      excerpt:
        "Grand Palace temples, floating markets, Thai cuisine, and a paced itinerary for first-timers.",
      perks: [
        "Sukhumvit premium stay + breakfast",
        "Chao Phraya dinner cruise",
        "Thai tourist visa processing",
      ],
      image:
        "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "dubai-lights",
      name: "Dubai Lights",
      duration: "4 Nights · 5 Days",
      badge: "Executive Tier",
      destination: "UAE",
      startingPrice: 78000,
      currency: "BDT" as const,
      excerpt:
        "Skyline views, desert dune safari with banquet, marina cruise, and airport concierge support.",
      perks: [
        "5-Star Business Bay hotel",
        "Premium desert safari",
        "UAE visit visa assistance",
      ],
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea833fcd8bb?auto=format&fit=crop&w=1200&q=80",
    },
  ],
} as const;

export const visaHome = {
  kicker: "Consular Precision",
  title: "Clear guidance for the countries you need.",
  body: "We vet bank statements, invitations, and supporting documents before submission — never a promise of guaranteed approval.",
  disclaimer:
    "Visa decisions rest with the issuing authority. Vistora helps you prepare and submit correctly.",
  items: [
    {
      country: "Malaysia",
      flag: "🇲🇾",
      turnaround: "2–4 Working Days",
      excerpt:
        "Tourist eVisa and employment pass pathways with checklist-led file preparation.",
      checks: [
        "Valid passport (min. 6 months)",
        "Bank solvency & statement",
        "Hotel / itinerary proof",
      ],
    },
    {
      country: "UAE",
      flag: "🇦🇪",
      turnaround: "24–48 Hours",
      excerpt:
        "30 / 60 / 90-day visit permits and employment residency document pre-checks.",
      checks: [
        "Clear colour passport scan",
        "White-background digital photo",
        "National ID / supporting IDs",
      ],
    },
    {
      country: "Saudi Arabia",
      flag: "🇸🇦",
      turnaround: "1–3 Working Days",
      excerpt:
        "Visit visas, Umrah e-visas via Nusuk, and commercial multi-entry guidance.",
      checks: [
        "Original passport",
        "Meningitis vaccination certificate",
        "Nusuk appointment support",
      ],
    },
    {
      country: "Thailand",
      flag: "🇹🇭",
      turnaround: "4–6 Working Days",
      excerpt:
        "Royal Thai Embassy Dhaka sticker visa — tourist and medical tourism files.",
      checks: [
        "Bank statement meeting embassy norms",
        "Employer NOC / trade license & TIN",
        "Confirmed hotel vouchers",
      ],
    },
    {
      country: "Singapore",
      flag: "🇸🇬",
      turnaround: "3–5 Working Days",
      excerpt:
        "e-Visa filing support through authorised channels with careful document review.",
      checks: [
        "Form 14A duly signed",
        "Letter of introduction where required",
        "Detailed day-wise travel plan",
      ],
    },
    {
      country: "Turkey",
      flag: "🇹🇷",
      turnaround: "Sticker / e-Visa",
      excerpt:
        "e-Visa support for eligible passport holders and full embassy dossier prep.",
      checks: [
        "Supporting OECD / Schengen visa if needed",
        "Biometric photos (50×50mm)",
        "Travel health insurance policy",
      ],
    },
  ],
} as const;

export const whyHome = {
  kicker: "The Vistora Standard",
  title: "Practical help. Personal follow-through.",
  body: "We replace call-center friction with single-point accountability.",
  items: [
    {
      title: "One consultant, one file",
      body: "A named officer manages your case from enquiry to departure — not a revolving inbox.",
      icon: "UserCheck",
    },
    {
      title: "Visas to permits",
      body: "Embassy visas, work permits, tours, and Umrah under one coordinated desk in Dhaka.",
      icon: "FileStack",
    },
    {
      title: "Honest timelines",
      body: "Transparent consular processing days — we never promise impossible embassy speedruns.",
      icon: "Hourglass",
    },
    {
      title: "WhatsApp-ready support",
      body: "Checklists, draft reviews, and status updates straight to your messaging inbox.",
      icon: "MessageCircle",
    },
  ],
} as const;

export const howHome = {
  kicker: "Transparent Execution",
  title: "From first message to departure.",
  body: "Four clear stages for documentation and travel planning.",
  steps: [
    {
      index: "01",
      title: "Contact",
      body: "Share your destination, dates, and service need via form, phone, or WhatsApp.",
      icon: "Send",
    },
    {
      index: "02",
      title: "Plan",
      body: "We map visa dossiers, packages, or permits around your budget and timeline.",
      icon: "Map",
    },
    {
      index: "03",
      title: "Confirm",
      body: "Documents undergo compliance checks, payments are receipted, and dates are secured.",
      icon: "Lock",
    },
    {
      index: "04",
      title: "Travel",
      body: "Depart with clarity — and a dedicated contact if rules or schedules shift.",
      icon: "Plane",
    },
  ],
} as const;

export const reviewsHome = {
  kicker: "Verified Travelers",
  title: "Trusted by travelers from Dhaka.",
  body: "Real experiences from families, pilgrims, and corporate executives.",
  ratingLabel: "5.0 / 5.0 Rating",
  items: [
    {
      author: "Tanvir Hossain",
      meta: "Dhaka · Malaysia Family Vacation",
      initials: "TH",
      quote:
        "Vistora managed our family Malaysia tour without a single hiccup. Hotel vouchers were accepted instantly and transfers were on time.",
      rating: 5,
    },
    {
      author: "Rubina Akhter",
      meta: "Gulshan · Dubai Corporate Visit",
      initials: "RA",
      quote:
        "Securing the Dubai multiple-entry visit for our management delegation was handled with absolute professionalism.",
      rating: 5,
    },
    {
      author: "Farid Ahmed",
      meta: "Uttara · Umrah Premium Package",
      initials: "FA",
      quote:
        "Our elderly parents completed Umrah through Vistora. Proximity to the Haram in Madinah and wheelchair assistance was a true blessing.",
      rating: 5,
    },
  ],
} as const;

export const inquiryHome = {
  kicker: "Direct Desk",
  title: "Tell us how you want to travel.",
  body: "Whether you need embassy document validation, a family holiday package, or work-permit guidance — our Dhaka desk responds within hours.",
  serviceOptions: [
    "Visa Processing & File Preparation",
    "Holiday Tour Package",
    "Umrah & Hajj Spiritual Journey",
    "Work Permit & Employment Clearance",
    "Hotel Booking & Airport Transfer",
    "Travel Insurance",
    "General Travel Consultation",
    "Other",
  ],
  successTitle: "Thank you — we received your enquiry.",
  successBody:
    "A consultant will review your details and connect shortly. For faster help, message us on WhatsApp.",
  privacy:
    "Your details are handled with care for travel and consular follow-up only.",
} as const;

export const footerHome = {
  blurb:
    "Your dedicated travel and visa consultancy partner from Dhaka — visas, work permits, tours, and Umrah & Hajj with discreet follow-through.",
  licenses: "Licenses & registrations available on request.",
  copyright: `© ${new Date().getFullYear()} Vistora Tours & Travels. All rights reserved.`,
} as const;
