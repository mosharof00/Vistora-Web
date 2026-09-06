/** Continuous film sequence from user screenshots 1→9 (window → wing → clouds → Eiffel → cream). */

export const FILM_FRAME_COUNT = 9;

export const filmFrames = Array.from({ length: FILM_FRAME_COUNT }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return `/hero/film/${n}.jpg`;
});

/** Map scroll progress 0–1 to a continuous float frame index in [0, count-1]. */
export function progressToFrameIndex(progress: number, count = FILM_FRAME_COUNT) {
  const p = Math.min(1, Math.max(0, progress));
  // Ease the first and last beats slightly so window + arrival hold longer
  const eased =
    p < 0.12
      ? p * 0.7
      : p > 0.88
        ? 0.84 + (p - 0.88) * 1.333
        : 0.084 + ((p - 0.12) / 0.76) * 0.756;
  return Math.min(count - 1, Math.max(0, eased * (count - 1)));
}

/** Airplane window visibility: fully closed at start, gone once we are beside the wing. */
export function windowOpenAmount(progress: number) {
  const p = Math.min(1, Math.max(0, progress));
  if (p <= 0.02) return 0;
  if (p >= 0.28) return 1;
  // smoothstep
  const t = (p - 0.02) / 0.26;
  return t * t * (3 - 2 * t);
}

export function cabinAmount(progress: number) {
  return Math.max(0, 1 - windowOpenAmount(progress) * 1.15);
}
