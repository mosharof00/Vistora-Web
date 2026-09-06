"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";
import { brand } from "@/config/brand";

type LayerProps = {
  src: string;
  alt: string;
  opacity: MotionValue<number>;
  scale?: MotionValue<number>;
  y?: MotionValue<string>;
  blend?: "normal" | "screen";
  objectPosition?: string;
  filter?: string;
};

function Layer({
  src,
  alt,
  opacity,
  scale,
  y,
  blend = "normal",
  objectPosition = "center",
  filter,
}: LayerProps) {
  return (
    <motion.img
      src={src}
      alt={alt}
      className="absolute inset-0 h-full w-full object-cover"
      style={{
        opacity,
        scale,
        y,
        mixBlendMode: blend,
        objectPosition,
        filter,
      }}
      draggable={false}
    />
  );
}

type HeroLayersProps = {
  progress: MotionValue<number>;
  compact: boolean;
};

export function HeroLayers({ progress, compact }: HeroLayersProps) {
  const clip = useTransform(
    progress,
    [0, 0.07, 0.15],
    compact
      ? [
          "ellipse(34% 18% at 50% 46%)",
          "ellipse(70% 42% at 50% 48%)",
          "inset(0%)",
        ]
      : [
          "ellipse(13% 23% at 50% 47%)",
          "ellipse(38% 48% at 50% 48%)",
          "inset(0%)",
        ],
  );

  const frameOpacity = useTransform(progress, [0, 0.09, 0.16], [1, 0.4, 0]);
  const skyOpacity = useTransform(progress, [0, 0.25], [0.75, 0.12]);
  const skyScale = useTransform(progress, [0, 1], [1.05, 1.2]);
  const windowOpacity = useTransform(progress, [0, 0.1, 0.2], [1, 0.85, 0]);
  const windowScale = useTransform(progress, [0, 0.2], [1.12, 1.35]);
  const wingOpacity = useTransform(progress, [0.08, 0.16, 0.34, 0.46], [0, 1, 1, 0]);
  const wingScale = useTransform(progress, [0.12, 0.4], [1.08, 1.22]);
  const wingY = useTransform(progress, [0.12, 0.4], ["6%", "-4%"]);
  const cloudOpacity = useTransform(progress, [0.3, 0.4, 0.58, 0.72], [0, 1, 0.9, 0.2]);
  const cloudScale = useTransform(progress, [0.34, 0.7], [1.15, 1.05]);
  const cloudY = useTransform(progress, [0.34, 0.7], ["8%", "-10%"]);
  const eiffelOpacity = useTransform(progress, [0.5, 0.64, 1], [0, 1, 1]);
  const eiffelScale = useTransform(progress, [0.52, 1], [1.28, 1.06]);
  const eiffelY = useTransform(progress, [0.52, 1], ["18%", "0%"]);
  const mistOpacity = useTransform(progress, [0.5, 0.66, 0.86, 1], [0.85, 0.55, 0.22, 0.08]);
  const mistY = useTransform(progress, [0.5, 1], ["0%", "22%"]);
  const mistScale = useTransform(progress, [0.5, 1], [1.2, 1.35]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050814]">
      <motion.div className="absolute inset-0 will-change-[clip-path]" style={{ clipPath: clip }}>
        <Layer
          src={brand.assets.hero.sky}
          alt=""
          opacity={skyOpacity}
          scale={skyScale}
        />
        <Layer
          src={brand.assets.hero.window}
          alt="Night sky through an aircraft window"
          opacity={windowOpacity}
          scale={windowScale}
          filter="brightness(0.62) saturate(0.75) contrast(1.15)"
        />
        <Layer
          src={brand.assets.hero.cloudsWing}
          alt="Aircraft wing above the clouds"
          opacity={wingOpacity}
          scale={wingScale}
          y={wingY}
          objectPosition="center 35%"
          filter="brightness(0.45) saturate(0.7) hue-rotate(-12deg) contrast(1.2)"
        />
        <Layer
          src={brand.assets.hero.cloudsDark}
          alt="Clouds at dusk"
          opacity={cloudOpacity}
          scale={cloudScale}
          y={cloudY}
          filter="brightness(0.55) saturate(0.85) contrast(1.2)"
        />
        <Layer
          src={brand.assets.hero.eiffelNight}
          alt="Illuminated Eiffel Tower"
          opacity={eiffelOpacity}
          scale={eiffelScale}
          y={eiffelY}
          objectPosition="72% 40%"
          filter="brightness(0.58) saturate(0.9) contrast(1.18)"
        />
        <Layer
          src={brand.assets.hero.cloudsDark}
          alt=""
          opacity={mistOpacity}
          y={mistY}
          scale={mistScale}
          blend="screen"
        />
        <div className="absolute inset-0 bg-[#0b1c38]/30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/55" />
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ opacity: frameOpacity }}
      >
        <div
          className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/30"
          style={{
            width: compact ? "68%" : "26%",
            height: compact ? "36%" : "46%",
            boxShadow:
              "inset 0 0 50px rgba(0,0,0,0.65), 0 0 0 140vmax rgba(5,8,20,0.92)",
          }}
        />
      </motion.div>
    </div>
  );
}
