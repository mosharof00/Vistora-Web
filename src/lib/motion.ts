export const heroScrollHeight = "780vh";

/** Five chapter ranges synced to the 219-frame Paris film. */
export const chapterRanges = [
  { id: "departure", from: 0, to: 0.16 },
  { id: "threshold", from: 0.16, to: 0.34 },
  { id: "between", from: 0.34, to: 0.52 },
  { id: "first-light", from: 0.52, to: 0.7 },
  { id: "destination", from: 0.7, to: 0.88 },
] as const;

export function chapterIndexFromProgress(progress: number) {
  if (progress >= 0.88) return 4;
  const idx = chapterRanges.findIndex((c) => progress < c.to);
  return idx === -1 ? chapterRanges.length - 1 : idx;
}
