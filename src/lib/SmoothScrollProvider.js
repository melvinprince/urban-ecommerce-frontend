// components/SmoothScrollProvider.jsx
"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    // 1. Instantiate Lenis with your “physics” settings:
    const lenis = new Lenis({
      duration: 1.8, // higher = more easing/inertia
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true, // enable Babylon-style smoothing
      direction: "vertical", // vertical scrolling only
      gestureDirection: "vertical", // track touch/pointer gestures
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}
