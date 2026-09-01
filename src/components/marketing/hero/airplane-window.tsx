"use client";

import { motion, type MotionValue } from "framer-motion";

type AirplaneWindowProps = {
  frameTop: MotionValue<string>;
  frameLeft: MotionValue<string>;
  frameRight: MotionValue<string>;
  frameBottom: MotionValue<string>;
  frameRadius: MotionValue<string>;
  frameOpacity: MotionValue<number>;
  frameScale: MotionValue<number>;
};

export function AirplaneWindow({
  frameTop,
  frameLeft,
  frameRight,
  frameBottom,
  frameRadius,
  frameOpacity,
  frameScale,
}: AirplaneWindowProps) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute z-20 origin-center"
      style={{
        top: frameTop,
        left: frameLeft,
        right: frameRight,
        bottom: frameBottom,
        borderRadius: frameRadius,
        opacity: frameOpacity,
        scale: frameScale,
      }}
    >
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.16) 0%, transparent 26%, transparent 72%, rgba(160,190,255,0.07) 100%)",
          boxShadow: [
            "inset 0 0 28px rgba(0,0,0,0.45)",
            "inset 0 10px 18px rgba(0,0,0,0.28)",
            "0 0 0 3px #1c222c",
            "0 0 0 7px #4c5566",
            "0 0 0 8px rgba(255,255,255,0.18)",
            "0 0 0 13px #2a3140",
            "0 0 0 18px #12161e",
            "0 24px 50px rgba(0,0,0,0.5)",
          ].join(", "),
        }}
      />
    </motion.div>
  );
}
