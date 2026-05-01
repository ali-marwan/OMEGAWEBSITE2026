"use client";

import Spline from "@splinetool/react-spline";

const SCENE_URL =
  "https://prod.spline.design/bm2de-HidmYQSS0H/scene.splinecode";

/**
 * Thin Spline canvas used by the landing-page Engineering-Led
 * Experience section. Kept in its own module so it can be lazy-loaded
 * via `next/dynamic({ ssr: false })` from `SplineFeatureSceneClient`
 * — the heavy `@splinetool/react-spline` + `@splinetool/runtime`
 * graph then ships in its own chunk and is only fetched when (and
 * if) the section is about to enter the viewport on a desktop with
 * normal motion preferences.
 */
export default function SplineFeatureScene() {
  return (
    <Spline
      scene={SCENE_URL}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
