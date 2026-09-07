export type HeroChapter = {
  id: string;
  index: number;
  kicker?: string;
  coords?: string;
  /** Use \\n for HorizonX-style editorial line breaks. */
  title: string;
  body?: string;
  align: "center" | "left" | "right";
  cta?: {
    label: string;
    target: "next" | "services";
  };
};

/**
 * Five story beats over the Paris film —
 * align: center → left → left → right → left (HorizonX pattern).
 */
export const heroChapters: HeroChapter[] = [
  {
    id: "departure",
    index: 0,
    coords: "PARIS  /  48.8566° N",
    title: "Paris begins before you land.",
    body: "Air tickets, visas, and work permits — arranged by Vistora before you leave the ground.",
    align: "center",
    cta: { label: "Begin the descent", target: "next" },
  },
  {
    id: "threshold",
    index: 1,
    kicker: "01  —  THE THRESHOLD",
    title: "Leave the paperwork\nbehind.",
    body: "We handle the quiet details between enquiry, visa, and departure.",
    align: "left",
  },
  {
    id: "between",
    index: 2,
    kicker: "02  —  BETWEEN WORLDS",
    title: "The city waits\nbeneath\nthe clouds.",
    body: "No guesswork. A Paris journey shaped around how you want to arrive.",
    align: "left",
  },
  {
    id: "first-light",
    index: 3,
    kicker: "03  —  FIRST LIGHT",
    title: "Paris, revealed.",
    body: "One partner for tickets, visas, tours, and the permit that opens the door.",
    align: "right",
  },
  {
    id: "destination",
    index: 4,
    kicker: "04  —  YOUR DESTINATION",
    title: "Explore more.\nTravel beyond.",
    body: "From the first enquiry to the lights below — Vistora stays with the journey.",
    align: "left",
    cta: { label: "Plan with Vistora", target: "services" },
  },
];

export const heroChrome = {
  scrollHint: "SCROLL TO DESCEND",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  lastChapter: 4,
} as const;
