"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

type Direction = "up" | "down" | "left" | "right" | "fade" | "scale";

function offsetFor(direction: Direction, distance: number) {
  switch (direction) {
    case "left":
      return { x: -distance, y: 0 };
    case "right":
      return { x: distance, y: 0 };
    case "down":
      return { x: 0, y: -distance };
    case "fade":
      return { x: 0, y: 0 };
    case "scale":
      return { x: 0, y: 12 };
    case "up":
    default:
      return { x: 0, y: distance };
  }
}

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 36,
  duration = 0.75,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
  distance?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -8% 0px" });
  const from = offsetFor(direction, distance);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        ...from,
        scale: direction === "scale" ? 0.96 : 1,
      }}
      animate={
        inView
          ? { opacity: 1, x: 0, y: 0, scale: 1 }
          : { opacity: 0, ...from, scale: direction === "scale" ? 0.96 : 1 }
      }
      transition={{ duration, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  stagger = 0.09,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: 0.06 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  direction = "up",
  distance = 28,
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  distance?: number;
}) {
  const from = offsetFor(direction, distance);

  return (
    <motion.div
      className={cn(className)}
      variants={{
        hidden: {
          opacity: 0,
          ...from,
          scale: direction === "scale" ? 0.97 : 1,
        },
        show: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          transition: { duration: 0.65, ease },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
