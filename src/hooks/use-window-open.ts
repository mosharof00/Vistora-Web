"use client";

import { type MotionValue, useTransform } from "framer-motion";

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

export function windowOpenAmount(progress: number) {
  const t = clamp(progress / 0.2);
  return 1 - (1 - t) ** 3;
}

export function useWindowOpen(progress: MotionValue<number>, compact: boolean) {
  const startX = compact ? 18 : 34.5;
  const startY = compact ? 14 : 12.5;
  const startR = compact ? 52 : 90;

  const clipPath = useTransform(progress, (p) => {
    const t = windowOpenAmount(p);
    const x = lerp(startX, -10, t);
    const y = lerp(startY, -10, t);
    const r = lerp(startR, 0, t);
    return `inset(${y}% ${x}% ${y}% ${x}% round ${Math.max(r, 0)}px)`;
  });

  const frameTop = useTransform(progress, (p) => `${lerp(startY, -12, windowOpenAmount(p))}%`);
  const frameLeft = useTransform(progress, (p) => `${lerp(startX, -12, windowOpenAmount(p))}%`);
  const frameRight = useTransform(progress, (p) => `${lerp(startX, -12, windowOpenAmount(p))}%`);
  const frameBottom = useTransform(progress, (p) => `${lerp(startY, -12, windowOpenAmount(p))}%`);
  const frameRadius = useTransform(progress, (p) => `${lerp(startR, 8, windowOpenAmount(p))}px`);
  const frameOpacity = useTransform(progress, (p) => clamp(1 - windowOpenAmount(p) * 1.25));
  const frameScale = useTransform(progress, (p) => lerp(1, 1.9, windowOpenAmount(p)));
  const cabinOpacity = useTransform(progress, (p) => clamp(1 - windowOpenAmount(p) * 1.08));

  return {
    clipPath,
    frameTop,
    frameLeft,
    frameRight,
    frameBottom,
    frameRadius,
    frameOpacity,
    frameScale,
    cabinOpacity,
  };
}
