"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
