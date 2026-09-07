"use client";

import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";
import { useMotionValueEvent } from "framer-motion";
import {
  progressToFrameIndex,
  sequenceFrames,
  SEQUENCE_FRAME_COUNT,
} from "@/lib/hero-sequence";

type HeroCanvasProps = {
  progress: MotionValue<number>;
};

/**
 * Scroll-scrubbed image sequence (HorizonX / VELUNE technique).
 * Draws the nearest frame for each scroll position — feels like video playback.
 */
export function HeroCanvas({ progress }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    Array.from({ length: SEQUENCE_FRAME_COUNT }, () => null),
  );
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });
  const [loaded, setLoaded] = useState(0);
  const readyRef = useRef(false);
  const rafRef = useRef(0);
  const lastFrameRef = useRef(-1);

  function drawCover(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    width: number,
    height: number,
  ) {
    // Slight overscan crops Hailuo/Minimax watermarks in the corner
    const scale = 1.06;
    const imgRatio = img.width / img.height;
    const canvasRatio = width / height;
    let drawW: number;
    let drawH: number;
    if (imgRatio > canvasRatio) {
      drawH = height * scale;
      drawW = drawH * imgRatio;
    } else {
      drawW = width * scale;
      drawH = drawW / imgRatio;
    }
    const x = (width - drawW) / 2;
    const y = (height - drawH) / 2 - height * 0.01;
    ctx.drawImage(img, x, y, drawW, drawH);
  }

  function paint(value: number) {
    const canvas = canvasRef.current;
    if (!canvas || !readyRef.current) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const { width, height, dpr } = sizeRef.current;
    if (!width || !height) return;

    const floatIndex = progressToFrameIndex(value);
    const index = Math.round(floatIndex);
    if (index === lastFrameRef.current && loaded > 0) {
      // still redraw on resize; allow fallthrough when size changed
    }
    lastFrameRef.current = index;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#050814";
    ctx.fillRect(0, 0, width, height);

    const img = imagesRef.current[index];
    if (img?.complete && img.naturalWidth) {
      ctx.globalAlpha = 1;
      drawCover(ctx, img, width, height);
    } else {
      // Prefer nearest loaded neighbor so scrub never blanks
      for (let d = 1; d < 12; d += 1) {
        const a = imagesRef.current[index - d];
        const b = imagesRef.current[index + d];
        if (a?.complete && a.naturalWidth) {
          drawCover(ctx, a, width, height);
          break;
        }
        if (b?.complete && b.naturalWidth) {
          drawCover(ctx, b, width, height);
          break;
        }
      }
    }

    // Soft vignette for text readability
    const vignette = ctx.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(width, height) * 0.28,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.75,
    );
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(3,6,12,0.42)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }

  useEffect(() => {
    let cancelled = false;
    let completed = 0;

    // Priority: first, last, then the rest in batches so first paint is fast
    const order = [
      0,
      SEQUENCE_FRAME_COUNT - 1,
      ...Array.from({ length: SEQUENCE_FRAME_COUNT - 2 }, (_, i) => i + 1),
    ];

    const loadOne = (index: number) =>
      new Promise<void>((resolve) => {
        if (cancelled) {
          resolve();
          return;
        }
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (!cancelled) {
            imagesRef.current[index] = img;
            completed += 1;
            setLoaded(completed);
            if (completed === 2 || completed === SEQUENCE_FRAME_COUNT) {
              readyRef.current = true;
              paint(progress.get());
            } else if (completed % 24 === 0) {
              paint(progress.get());
            }
          }
          resolve();
        };
        img.onerror = () => resolve();
        img.src = sequenceFrames[index];
      });

    (async () => {
      // Load first + last immediately
      await Promise.all([loadOne(order[0]), loadOne(order[1])]);
      readyRef.current = true;
      paint(progress.get());

      // Then stream the middle frames in chunks
      const rest = order.slice(2);
      const chunk = 18;
      for (let i = 0; i < rest.length; i += chunk) {
        if (cancelled) return;
        await Promise.all(rest.slice(i, i + chunk).map(loadOne));
        paint(progress.get());
      }
    })();

    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas?.parentElement) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.parentElement.clientWidth;
      const height = canvas.parentElement.clientHeight;
      sizeRef.current = { width, height, dpr };
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      lastFrameRef.current = -1;
      paint(progress.get());
    };

    resize();
    window.addEventListener("resize", resize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMotionValueEvent(progress, "change", (value) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => paint(value));
  });

  const readyPct = Math.round((loaded / SEQUENCE_FRAME_COUNT) * 100);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden
      />
      {loaded < SEQUENCE_FRAME_COUNT ? (
        <div className="pointer-events-none absolute bottom-8 left-1/2 z-[5] -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-[10px] tracking-[0.18em] text-white/70 uppercase backdrop-blur-sm md:bottom-10">
          Loading journey {readyPct}%
        </div>
      ) : null}
    </>
  );
}
