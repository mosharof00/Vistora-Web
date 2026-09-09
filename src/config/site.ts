export const APP_NAME = "Vistora";
export const APP_LEGAL_NAME = "Vistora Tours & Travels";

export const siteConfig = {
  name: APP_NAME,
  legalName: APP_LEGAL_NAME,
  tagline: "Explore More, Travel Beyond",
  description:
    "Vistora Tours & Travels is a modern travel partner for visas, work permits, tours, Umrah & Hajj, and end-to-end travel support from Dhaka.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en",
  copyrightYear: 2026,
  contact: {
    phone: process.env.NEXT_PUBLIC_PHONE ?? "",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "",
    email: process.env.NEXT_PUBLIC_EMAIL ?? "",
    address: process.env.NEXT_PUBLIC_ADDRESS ?? "",
    facebook: "https://www.facebook.com/VistoraTravels",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM ?? "",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE ?? "",
    tiktok: process.env.NEXT_PUBLIC_TIKTOK ?? "",
  },
  socialHandle: "@VistoraTravels",
  whatsappPrefill:
    "Hello Vistora Tours & Travels, I would like to know more about your travel services.",
} as const;

export type SiteConfig = typeof siteConfig;
