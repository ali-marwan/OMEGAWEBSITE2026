"use client";

import { MotionConfig } from "framer-motion";
import { type ReactNode } from "react";
import { ease } from "@/lib/motion";

/**
 * Wraps the app in a Framer Motion config that:
 *  - Honors the user's `prefers-reduced-motion` setting (motion is
 *    disabled or simplified system-wide when they request it).
 *  - Sets the global default ease so any motion.* without an explicit
 *    transition still feels engineered and on-brand.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease }}>
      {children}
    </MotionConfig>
  );
}
