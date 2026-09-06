export const heroScrollHeight = "620vh";

/** Chapter ranges synced to the 9-frame film path. */
export const chapterRanges = [
  { id: "home", from: 0, to: 0.14 },
  { id: "threshold", from: 0.14, to: 0.34 },
  { id: "between", from: 0.34, to: 0.54 },
  { id: "first-light", from: 0.54, to: 0.74 },
  { id: "arrival", from: 0.74, to: 0.88 },
] as const;

export function chapterIndexFromProgress(progress: number) {
  if (progress >= 0.88) return 4;
  const idx = chapterRanges.findIndex((c) => progress <= c.to);
  return idx === -1 ? chapterRanges.length - 1 : idx;
}

export function fadeInRange(from: number, to: number, fade = 0.05) {
  return [from, from + fade, to - fade, to] as const;
}
