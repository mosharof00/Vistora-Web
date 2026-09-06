export type HeroChapter = {
  id: string;
  index: number;
  kicker?: string;
  coords?: string;
  title: string;
  body?: string;
  align: "center" | "left" | "right";
  cta?: {
    label: string;
    target: "next" | "services";
  };
};

/** Chapter copy + timing aligned to screenshots 1–9 / VELUNE beat sheet. */
export const heroChapters: HeroChapter[] = [
  {
    id: "home",
    index: 0,
    coords: "PARIS  /  48.8566° N",
    title: "Paris begins before you land.",
    body: "Private arrivals, after-dark tables, and the city revealed at your pace.",
    align: "center",
    cta: { label: "Begin the descent", target: "next" },
  },
  {
    id: "threshold",
    index: 1,
    kicker: "01  —  THE THRESHOLD",
    title: "Leave the itinerary behind.",
    body: "We choreograph the quiet details between arrival and discovery.",
    align: "left",
  },
  {
    id: "between",
    index: 2,
    kicker: "02  —  BETWEEN WORLDS",
    title: "The city waits beneath the clouds.",
    body: "No queues. No templates. Just a Paris shaped around how you want to feel.",
    align: "left",
  },
  {
    id: "first-light",
    index: 3,
    kicker: "03  —  FIRST LIGHT",
    title: "Paris, revealed.",
    align: "right",
  },
  {
    id: "arrival",
    index: 4,
    kicker: "04  —  YOUR ARRIVAL",
    title: "Arrive beyond the ordinary.",
    body: "One city. Entirely yours.",
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
