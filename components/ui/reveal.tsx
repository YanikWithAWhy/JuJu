"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in seconds (useful for staggering siblings). */
  delay?: number;
  /** Initial vertical offset in px. */
  y?: number;
  /** Re-trigger every time it enters the viewport instead of just once. */
  repeat?: boolean;
}

/** Fades + slides its children in when scrolled into view. */
export function Reveal({ children, className, delay = 0, y = 28, repeat = false }: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: !repeat, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.5, 0.27, 0.99] }}
    >
      {children}
    </motion.div>
  );
}
