export const heroScrollHeight = "520vh";

export const chapterRanges = [
  { id: "home", from: 0, to: 0.18 },
  { id: "threshold", from: 0.18, to: 0.4 },
  { id: "between", from: 0.4, to: 0.6 },
  { id: "first-light", from: 0.6, to: 0.8 },
  { id: "arrival", from: 0.8, to: 1 },
] as const;

export function chapterIndexFromProgress(progress: number) {
  const idx = chapterRanges.findIndex((c) => progress <= c.to);
  return idx === -1 ? chapterRanges.length - 1 : idx;
}

export function fadeInRange(from: number, to: number, fade = 0.05) {
  return [from, from + fade, to - fade, to] as const;
}
