"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";
import { ease, viewportOnce } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  /** Pixels of upward travel for the fade-up. Default 14, max 20. */
  distance?: number;
  className?: string;
  as?:
    | "div"
    | "section"
    | "header"
    | "footer"
    | "article"
    | "li"
    | "h1"
    | "h2"
    | "h3"
    | "p"
    | "span";
  once?: boolean;
};

/**
 * Standard scroll-triggered reveal — fades in from a small upward offset.
 * Honors `prefers-reduced-motion` automatically via the root MotionConfig.
 * Use small distances (12–20px) and shared `ease` so motion stays calm.
 */
export function Reveal({
  children,
  delay = 0,
  duration = 0.9,
  distance = 14,
  className,
  as = "div",
  once = true,
}: RevealProps) {
  const variants: Variants = {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, ease, delay },
    },
  };
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...viewportOnce, once }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}
