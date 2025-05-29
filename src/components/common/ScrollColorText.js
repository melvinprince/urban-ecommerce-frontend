// components/ScrollColorText.jsx
"use client";

import { useRef, useEffect } from "react";

export default function ScrollColorText({
  text,
  className = "",
  font = "eulogy",
  size = "5rem",
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // grab all letter-spans in document order
    const letters = Array.from(el.querySelectorAll(".scroll-letter"));
    const total = letters.length;

    const startGray = 200; // light gray
    const endGray = 0; // black

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;

        // raw progress 0→1 as the container moves through viewport
        const raw = (vh - rect.top) / (vh + rect.height);
        const p = Math.min(Math.max(raw, 0), 1);

        // full black by 80% scroll
        const norm = Math.min(p / 0.8, 1);
        const filled = Math.floor(norm * total);

        letters.forEach((span, i) => {
          const v = i < filled ? endGray : startGray;
          span.style.color = `rgb(${v},${v},${v})`;
        });

        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initialize colors
    return () => window.removeEventListener("scroll", onScroll);
  }, [text]);

  // Split into words & spaces, so we can wrap only at word boundaries
  const segments = text.split(/(\s+)/);

  return (
    <div
      ref={containerRef}
      className={`mx-[5rem] whitespace-pre-wrap break-normal [word-spacing:1rem] ${className}`}
    >
      {segments.map((seg, idx) => {
        // whitespace segment: render as-is so wrapping can happen here
        if (/^\s+$/.test(seg)) {
          return <span key={idx}>{seg}</span>;
        }

        // a whole word: group letters so they stay together
        return (
          <span key={idx} className="inline-block">
            {seg.split("").map((char, i) => (
              <span
                key={i}
                className={`scroll-letter inline-block text-[${size}] font-${font}`}
              >
                {char}
              </span>
            ))}
          </span>
        );
      })}
    </div>
  );
}
