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

export const heroChapters: HeroChapter[] = [
  {
    id: "home",
    index: 0,
    coords: "PARIS  /  48.8566° N",
    title: "The journey begins before you land.",
    body: "Air tickets, visas, and work permits — arranged before you leave the ground.",
    align: "center",
    cta: { label: "Begin the descent", target: "next" },
  },
  {
    id: "threshold",
    index: 1,
    kicker: "01  —  THE THRESHOLD",
    title: "Leave the paperwork behind.",
    body: "We choreograph the quiet details between enquiry and departure.",
    align: "left",
  },
  {
    id: "between",
    index: 2,
    kicker: "02  —  BETWEEN WORLDS",
    title: "The city waits beneath the clouds.",
    body: "No queues at our desk. No guesswork. A journey shaped around how you want to arrive.",
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
