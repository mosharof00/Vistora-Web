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
    "Manpower recruitment and travel support — from demand letter to deployment.",

  /** Square mark (sidebar / header). */
  logoIcon: "/brand/vistora_logo.png",
  /** Same mark used full-width on auth until a wordmark exists. */
  logoFull: "/brand/vistora_logo.png",
  favicon: "/brand/vistora_logo.png",

  /**
   * Bump after replacing files in `public/brand/` so browsers refresh caches.
   */
  assetVersion: "1",

  /**
   * Palette from the bird-and-briefcase logo.
   * Dashboard maps these into CSS variables in globals.css.
   */
  colors: {
    /** Deep royal blue — primary buttons */
    primary: "#0b4f9c",
    primaryHover: "#083d7a",
    /** Bright cyan highlight from wing tips */
    accent: "#1aa6e0",
    /** Very light tint of logo blue — page background */
    background: "#eef5fb",
    /** Slightly cooler sidebar */
    sidebar: "#e4eef8",
    /** Card / elevated surface */
    card: "#ffffff",
    /** Near-navy ink for text */
    foreground: "#0b1f33",
    muted: "#d7e4f2",
    mutedForeground: "#5a738c",
    border: "#c9dae9",
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
    hero: {
      window: "/hero/plane-travel.jpg",
      cloudsWing: "/hero/window.jpg",
      cloudsDark: "/hero/clouds-dark.jpg",
      sky: "/hero/sky-stars.jpg",
      eiffelNight: "/hero/eiffel-night.jpg",
      eiffelPeak: "/hero/eiffel-night.jpg",
      parisDusk: "/hero/paris-dusk.jpg",
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
