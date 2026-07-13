"use client";

import { useEffect, useRef } from "react";

/**
 * A gradient bar pinned to the top that fills as the reader scrolls
 * through the page.
 */
export default function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - doc.clientHeight;
        const ratio = scrollable > 0 ? doc.scrollTop / scrollable : 0;
        el.style.width = `${Math.min(1, Math.max(0, ratio)) * 100}%`;
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="progress-bar" style={{ width: "0%" }} aria-hidden />;
}
