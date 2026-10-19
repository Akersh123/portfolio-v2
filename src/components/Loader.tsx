import { useEffect, useState } from "react";
import { INTRO_LIFT_MS, INTRO_OUT_MS, SHOW_INTRO } from "../lib/intro";
import { lenis } from "../lib/lenis";

const ITEMS = ["coffee", "code", "ship it!"];

/** Handwritten checklist intro: each box gets a doodled tick, then the panel lifts. Timing lives in CSS. */
export function Loader() {
  const [done, setDone] = useState(!SHOW_INTRO);

  useEffect(() => {
    if (done) return;
    window.scrollTo(0, 0);
    const stop = requestAnimationFrame(() => lenis.stop()); // Lenis starts in App's effect, after this one
    const finish = setTimeout(() => { lenis.start(); setDone(true); }, INTRO_LIFT_MS + INTRO_OUT_MS);
    return () => { cancelAnimationFrame(stop); clearTimeout(finish); lenis.start(); };
  }, [done]);

  if (done) return null;
  return (
    <div className="ab-intro" role="status" aria-label="Loading">
      <ul className="ab-intro-list" aria-hidden>
        {ITEMS.map((t, i) => (
          <li key={t} style={{ "--i": i } as React.CSSProperties}>
            <svg viewBox="0 0 40 40">
              <rect x="4" y="6" width="28" height="28" rx="4" />
              <path d="M10 20 L18 29 L36 4" pathLength={1} />
            </svg>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
