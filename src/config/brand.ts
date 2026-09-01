export const brand = {
  colors: {
    navy: "#070b14",
    ink: "#0b1524",
    cyan: "#00b4e6",
    blue: "#1a5fbf",
    cream: "#f3eee4",
    creamMuted: "#e8e1d4",
    gold: "#e8a317",
    mist: "#c5d0dc",
  },
  radius: {
    shell: "2rem",
    card: "1.5rem",
    pill: "999px",
  },
  assets: {
    logo: "/brand/logo.png",
    hero: {
      window: "/hero/window.jpg",
      cloudsWing: "/hero/window.jpg",
      cloudsDark: "/hero/clouds-dark.jpg",
      sky: "/hero/sky-stars.jpg",
      eiffelNight: "/hero/eiffel-night.jpg",
      eiffelPeak: "/hero/eiffel-night.jpg",
      parisDusk: "/hero/paris-dusk.jpg",
    },
  },
} as const;

export type Brand = typeof brand;
