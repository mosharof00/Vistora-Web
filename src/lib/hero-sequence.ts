/** Real AI-generated film: 219 frames scrubbed 1:1 with scroll. */

export const SEQUENCE_FRAME_COUNT = 219;

export function frameSrc(index: number) {
  const n = String(index + 1).padStart(3, "0");
  return `/hero/sequence/ezgif-frame-${n}.jpg`;
}

export const sequenceFrames = Array.from(
  { length: SEQUENCE_FRAME_COUNT },
  (_, i) => frameSrc(i),
);

/** Linear map: scroll 0→1 plays frames 0→218 (video-like). */
export function progressToFrameIndex(
  progress: number,
  count = SEQUENCE_FRAME_COUNT,
) {
  const p = Math.min(1, Math.max(0, progress));
  return Math.min(count - 1, Math.max(0, p * (count - 1)));
}
