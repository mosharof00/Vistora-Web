"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { useMotionValueEvent } from "framer-motion";
import { filmFrames, progressToFrameIndex } from "@/lib/hero-sequence";

type HeroCanvasProps = {
  progress: MotionValue<number>;
};

/**
 * Scroll-scrubbed film: crossfades consecutive frames so the camera path
 * feels continuous (video-like), matching the HorizonX VELUNE technique.
 */
export function HeroCanvas({ progress }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });
  const readyRef = useRef(false);
  const rafRef = useRef(0);

  function drawCover(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    width: number,
    height: number,
    scale = 1,
    offsetY = 0,
  ) {
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
    const y = (height - drawH) / 2 + offsetY;
    ctx.drawImage(img, x, y, drawW, drawH);
  }

  function paint(value: number) {
    const canvas = canvasRef.current;
    if (!canvas || !readyRef.current) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const { width, height, dpr } = sizeRef.current;
    if (!width || !height) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#050814";
    ctx.fillRect(0, 0, width, height);

    const floatIndex = progressToFrameIndex(value);
    const i0 = Math.floor(floatIndex);
    const i1 = Math.min(filmFrames.length - 1, i0 + 1);
    const mix = floatIndex - i0;

    const img0 = imagesRef.current[i0];
    const img1 = imagesRef.current[i1];

    // Continuous push-in (camera descending) + crop baked UI chrome from screenshots
    const push = 1.14 + value * 0.1;
    const driftY = value * -height * 0.035;

    if (img0?.complete && img0.naturalWidth) {
      ctx.globalAlpha = 1;
      drawCover(ctx, img0, width, height, push, driftY);
    }

    if (mix > 0.001 && img1?.complete && img1.naturalWidth && i1 !== i0) {
      ctx.globalAlpha = mix;
      drawCover(ctx, img1, width, height, push + mix * 0.02, driftY);
      ctx.globalAlpha = 1;
    }

    // Soft atmospheric vignette (VELUNE night grade)
    const vignette = ctx.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(width, height) * 0.25,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.72,
    );
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(3,6,12,0.45)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }

  useEffect(() => {
    let cancelled = false;
    imagesRef.current = filmFrames.map(() => null);

    Promise.all(
      filmFrames.map(
        (src, index) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.decoding = "async";
            img.onload = () => {
              if (!cancelled) imagesRef.current[index] = img;
              resolve();
            };
            img.onerror = () => resolve();
            img.src = src;
          }),
      ),
    ).then(() => {
      if (cancelled) return;
      readyRef.current = true;
      paint(progress.get());
    });

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

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
