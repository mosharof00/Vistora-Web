"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";
import { brand } from "@/config/brand";
import { AirplaneWindow } from "@/components/marketing/hero/airplane-window";
import { useWindowOpen } from "@/hooks/use-window-open";

type LayerProps = {
  src: string;
  alt: string;
  opacity: MotionValue<number>;
  scale?: MotionValue<number>;
  y?: MotionValue<string>;
  objectPosition?: string;
  filter?: string;
};

function Layer({
  src,
  alt,
  opacity,
  scale,
  y,
  objectPosition = "center",
  filter,
}: LayerProps) {
  return (
    <motion.img
      src={src}
      alt={alt}
      className="absolute inset-0 h-full w-full object-cover will-change-transform"
      style={{ opacity, scale, y, objectPosition, filter }}
      draggable={false}
    />
  );
}

type HeroLayersProps = {
  progress: MotionValue<number>;
  compact: boolean;
};

export function HeroLayers({ progress, compact }: HeroLayersProps) {
  const windowOpen = useWindowOpen(progress, compact);

  const starsOpacity = useTransform(progress, [0, 0.22, 0.42], [0.85, 1, 0.15]);
  const starsScale = useTransform(progress, [0, 1], [1.04, 1.16]);
  const wingOpacity = useTransform(progress, [0, 0.04, 0.36, 0.5], [1, 1, 1, 0]);
  const wingScale = useTransform(progress, [0, 0.2, 0.48], [1.22, 1.12, 1.28]);
  const wingY = useTransform(progress, [0, 0.22, 0.48], ["2%", "0%", "-8%"]);
  const cloudOpacity = useTransform(progress, [0.28, 0.4, 0.56, 0.7], [0, 1, 1, 0.12]);
  const cloudScale = useTransform(progress, [0.32, 0.68], [1.18, 1.04]);
  const cloudY = useTransform(progress, [0.32, 0.68], ["10%", "-12%"]);
  const eiffelOpacity = useTransform(progress, [0.5, 0.62, 1], [0, 1, 1]);
  const eiffelScale = useTransform(progress, [0.5, 0.78, 1], [1.34, 1.12, 1.04]);
  const eiffelY = useTransform(progress, [0.5, 0.8, 1], ["22%", "6%", "0%"]);
  const mistOpacity = useTransform(progress, [0.5, 0.64, 0.82, 0.94], [0.95, 0.55, 0.18, 0]);
  const mistY = useTransform(progress, [0.5, 1], ["4%", "28%"]);
  const mistScale = useTransform(progress, [0.5, 1], [1.25, 1.45]);
  const cityGlow = useTransform(progress, [0.08, 0.28, 0.55, 0.72], [0.35, 0.55, 0.25, 0]);
  const vignette = useTransform(progress, [0, 0.2, 1], [0.15, 0.45, 0.55]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050814]">
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{
          opacity: windowOpen.cabinOpacity,
          background:
            "radial-gradient(ellipse at 50% 46%, #1c2638 0%, #0a0f18 46%, #03050a 78%)",
        }}
      />

      <motion.div
        className="absolute inset-0 will-change-[clip-path]"
        style={{ clipPath: windowOpen.clipPath }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, #1b2a4a 0%, #0b1220 38%, #050814 72%)",
          }}
        />
        <Layer
          src={brand.assets.hero.sky}
          alt=""
          opacity={starsOpacity}
          scale={starsScale}
          objectPosition="center top"
          filter="brightness(0.55) saturate(0.8) contrast(1.15)"
        />
        <Layer
          src={brand.assets.hero.cloudsWing}
          alt="Aircraft wing above the clouds at night"
          opacity={wingOpacity}
          scale={wingScale}
          y={wingY}
          objectPosition="center 42%"
          filter="brightness(0.42) saturate(0.55) hue-rotate(-18deg) contrast(1.25)"
        />
        <Layer
          src={brand.assets.hero.cloudsDark}
          alt="Clouds seen from the sky"
          opacity={cloudOpacity}
          scale={cloudScale}
          y={cloudY}
          objectPosition="center 60%"
          filter="brightness(0.5) saturate(0.7) contrast(1.22)"
        />
        <Layer
          src={brand.assets.hero.eiffelNight}
          alt="Illuminated Eiffel Tower"
          opacity={eiffelOpacity}
          scale={eiffelScale}
          y={eiffelY}
          objectPosition="68% 38%"
          filter="brightness(0.62) saturate(1.05) contrast(1.2)"
        />
        <Layer
          src={brand.assets.hero.cloudsDark}
          alt=""
          opacity={mistOpacity}
          y={mistY}
          scale={mistScale}
          filter="brightness(1.4) contrast(0.85)"
        />
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: cityGlow,
            background:
              "linear-gradient(to top, rgba(210,132,58,0.42) 0%, rgba(120,70,30,0.12) 18%, transparent 42%)",
          }}
        />
        <div className="absolute inset-0 bg-[#15284a]/25 mix-blend-multiply" />
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: vignette,
            background:
              "radial-gradient(ellipse at center, transparent 28%, rgba(3,6,12,0.72) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/45" />
      </motion.div>

      <AirplaneWindow
        frameTop={windowOpen.frameTop}
        frameLeft={windowOpen.frameLeft}
        frameRight={windowOpen.frameRight}
        frameBottom={windowOpen.frameBottom}
        frameRadius={windowOpen.frameRadius}
        frameOpacity={windowOpen.frameOpacity}
        frameScale={windowOpen.frameScale}
      />
    </div>
  );
}
