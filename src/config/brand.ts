/**
 * Single source of truth for Vistora branding.
 * Edit colors, fonts, and logo paths here — UI tokens in globals.css map to these.
 */
export const brand = {
  name: "Vistora",
  shortName: "VISTORA",
  legalName: "Vistora Tours & Travels",
  tagline: "Explore More, Travel Beyond",
    description:
    "Manpower recruitment and travel support — visas, work permits, and deployment coordination.",

  /** Square mark (sidebar / header). */
  logoIcon: "/brand/logo.png",
  /** Same mark used full-width on auth until a wordmark exists. */
  logoFull: "/brand/vistora_full_logo.png",
  favicon: "/brand/vistora_logo.png",

  /**
   * Bump after replacing files in `public/brand/` so browsers refresh caches.
   */
  assetVersion: "1",

  /**
   * Dashboard palette — finance-dashboard pattern with Vistora deep blue.
   * Keep in sync with :root tokens in globals.css.
   */
  colors: {
    /** Deep blue — primary actions + active nav */
    primary: "#03045e",
    primaryHover: "#02033f",
    /** Mid blue highlight (charts / focus ring) */
    accent: "#0077b6",
    /** Page canvas — soft blue-gray */
    background: "#dde2ee",
    /** Sidebar deeper than page (Import Mark style) */
    sidebar: "#c5cddd",
    /** Selected nav — light pill */
    sidebarSelected: "#b8c0e0",
    /** Elevated cards */
    card: "#ffffff",
    /** Near-navy ink */
    foreground: "#0b1026",
    muted: "#cfd5e4",
    mutedForeground: "#5c647a",
    border: "#b8c0d4",
    destructive: "#b42318",
    /** Marketing dark (landing only) */
    navy: "#070b14",
    cream: "#f3eee4",
  },

  fonts: {
    /** Dashboard / app UI */
    sans: "Geist",
    /** Marketing display */
    serif: "Cormorant Garamond",
  },

  radius: {
    shell: "1rem",
    card: "1rem",
    pill: "999px",
  },

  assets: {
    /** Marketing stills pulled from the live Paris scroll sequence. */
    hero: {
      frameStart: "/hero/sequence/ezgif-frame-001.jpg",
      frameWing: "/hero/sequence/ezgif-frame-060.jpg",
      frameClouds: "/hero/sequence/ezgif-frame-110.jpg",
      frameNight: "/hero/sequence/ezgif-frame-160.jpg",
      frameArrival: "/hero/sequence/ezgif-frame-219.jpg",
    },
  },

  contact: {
    email: "",
    phone: "",
    location: "Dhaka, Bangladesh",
  },
} as const;

export type Brand = typeof brand;
export type BrandConfig = typeof brand;
