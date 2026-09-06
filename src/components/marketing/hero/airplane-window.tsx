"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";
import { cabinAmount, windowOpenAmount } from "@/lib/hero-sequence";

type AirplaneWindowProps = {
  progress: MotionValue<number>;
  compact: boolean;
};

/**
 * Premium cabin window that opens into the film — disappears once the camera
 * is beside the wing (no leftover double-window).
 */
export function AirplaneWindow({ progress, compact }: AirplaneWindowProps) {
  const open = useTransform(progress, (p) => windowOpenAmount(p));
  const cabinOpacity = useTransform(progress, (p) => cabinAmount(p));
  const frameOpacity = useTransform(open, (t) => Math.max(0, 1 - t * 1.35));
  const frameScale = useTransform(open, (t) => 1 + t * 1.85);

  const insetX = useTransform(open, (t) => {
    const start = compact ? 20 : 31;
    return `${start - t * (start + 8)}%`;
  });
  const insetY = useTransform(open, (t) => {
    const start = compact ? 14 : 11;
    return `${start - t * (start + 8)}%`;
  });
  const radius = useTransform(open, (t) => {
    const start = compact ? 40 : 52;
    return `${Math.max(0, start - t * start)}px`;
  });

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[12]"
        style={{
          opacity: cabinOpacity,
          background:
            "radial-gradient(ellipse at 50% 48%, rgba(20,28,42,0.05) 0%, rgba(5,8,14,0.88) 38%, #020308 74%)",
        }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute z-[14] origin-center"
        style={{
          top: insetY,
          left: insetX,
          right: insetX,
          bottom: insetY,
          borderRadius: radius,
          opacity: frameOpacity,
          scale: frameScale,
        }}
      >
        {/* Outer bezel */}
        <div
          className="absolute -inset-[2px] rounded-[inherit]"
          style={{
            background:
              "linear-gradient(145deg, #8a93a4 0%, #3a4252 32%, #141820 70%, #05070b 100%)",
            boxShadow:
              "0 28px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.28)",
          }}
        />
        {/* Mid plastic ring */}
        <div
          className="absolute inset-[5px] rounded-[inherit]"
          style={{
            background:
              "linear-gradient(165deg, #c8cfdb 0%, #4e5868 40%, #1a202c 78%, #07090e 100%)",
            boxShadow:
              "inset 0 2px 4px rgba(255,255,255,0.35), inset 0 -10px 16px rgba(0,0,0,0.5)",
          }}
        />
        {/* Inner reveal (transparent so film shows through) */}
        <div
          className="absolute inset-[11px] rounded-[inherit]"
          style={{
            boxShadow:
              "inset 0 0 26px rgba(0,0,0,0.55), inset 0 10px 18px rgba(0,0,0,0.35)",
          }}
        />
        {/* Glass sheen */}
        <div
          className="absolute inset-[11px] rounded-[inherit]"
          style={{
            background:
              "linear-gradient(118deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 16%, transparent 38%, transparent 68%, rgba(170,200,255,0.08) 100%)",
          }}
        />
        {/* Side cabin panels */}
        <div className="absolute top-1/2 -left-10 h-28 w-9 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#12161e] via-[#1c222c] to-transparent opacity-95" />
        <div className="absolute top-1/2 -right-10 h-28 w-9 -translate-y-1/2 rounded-full bg-gradient-to-l from-[#12161e] via-[#1c222c] to-transparent opacity-95" />
      </motion.div>
    </>
  );
}
