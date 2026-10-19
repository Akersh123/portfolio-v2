import { useEffect, useRef } from "react";
import { isTouch, prefersReducedMotion } from "../lib/gsap";

/**
 * Doodle-arrow cursor with handwritten notes.
 * - The arrow always points at the nearest clickable thing ([data-cursor]) and bounces when on it.
 * - Elements with data-note get a handwritten note written above them.
 * Mouse-only: touch devices keep the native behaviour.
 */

export function Cursor() {
  const arrow = useRef<SVGSVGElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isTouch()) return;
    const cv = canvas.current!, g = cv.getContext("2d")!, ar = arrow.current!;
    const reduced = prefersReducedMotion();
    document.documentElement.classList.add("has-cursor");

    const css = (n: string) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
    let pal = { accent: "", raised: "" };
    const readPal = () => { pal = { accent: css("--accent"), raised: css("--bg-raised") }; };
    readPal();
    const mo = new MutationObserver(readPal);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const P = { x: -200, y: -200, in: false };
    let hover: Element | null = null, noteEl: HTMLElement | null = null, noteT = 0;
    let targets: Element[] = [], rects: DOMRect[] = [], rectsAt = 0, ang = 0, raf = 0, dpr = 1;

    const size = () => {
      dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = Math.round(innerWidth * dpr); cv.height = Math.round(innerHeight * dpr);
    };
    size();

    const refreshTargets = () => { targets = [...document.querySelectorAll("[data-cursor]")]; rectsAt = 0; };
    refreshTargets();
    const mut = new MutationObserver(refreshTargets);
    mut.observe(document.body, { childList: true, subtree: true });

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      P.x = e.clientX; P.y = e.clientY; P.in = true;
      hover = e.target instanceof Element ? e.target : null;
    };
    const leave = () => { P.in = false; };

    const nearest = () => {
      const now = performance.now();
      if (now - rectsAt > 120) { rects = targets.map((t) => t.getBoundingClientRect()); rectsAt = now; }
      let best: { x: number; y: number } | null = null, bd = Infinity;
      for (const r of rects) {
        if (r.width === 0 || r.bottom < -50 || r.top > innerHeight + 50) continue;
        const cx = Math.max(r.left, Math.min(P.x, r.right)), cy = Math.max(r.top, Math.min(P.y, r.bottom));
        const d = Math.hypot(cx - P.x, cy - P.y);
        if (d < bd) { bd = d; best = { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
      }
      return best;
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, innerWidth, innerHeight);
      const t = now / 1000;
      ar.style.opacity = P.in ? "1" : "0";
      if (!P.in) return;

      // Arrow: point at the nearest clickable thing, bounce when on it
      const best = nearest(), onLink = !!hover?.closest("[data-cursor]");
      const want = best ? Math.atan2(best.y - P.y, best.x - P.x) : ang;
      ang += Math.atan2(Math.sin(want - ang), Math.cos(want - ang)) * (reduced ? 1 : 0.22);
      const bob = onLink && !reduced ? Math.sin(t * 12) * 4 : 0;
      ar.style.transform = `translate(${P.x - 22 + Math.cos(ang) * bob}px, ${P.y - 22 + Math.sin(ang) * bob}px) rotate(${ang}rad)`;

      // Note: handwritten above the hovered element
      const n = hover?.closest<HTMLElement>("[data-note]") ?? null;
      if (n !== noteEl) { noteEl = n; noteT = now; }
      if (noteEl?.dataset.note) {
        const r = noteEl.getBoundingClientRect(), txt = noteEl.dataset.note;
        g.font = `600 22px Caveat, "Segoe Print", cursive`;
        const tw = g.measureText(txt).width;
        const x = Math.max(12, Math.min(r.left + r.width * 0.55, innerWidth - tw - 20)), y = r.top - 12 < 30 ? r.bottom + 28 : r.top - 12;
        const k = reduced ? 1 : Math.min(1, (now - noteT) / 450);
        g.save(); g.beginPath(); g.rect(x - 12, y - 34, (tw + 36) * k, 50); g.clip(); // generous box: Caveat overhangs its measured width
        g.translate(x, y); g.rotate(-0.04);
        g.globalAlpha = 0.92; g.fillStyle = pal.raised; g.beginPath(); g.roundRect(-8, -21, tw + 20, 28, 8); g.fill(); g.globalAlpha = 1;
        g.font = `600 22px Caveat, "Segoe Print", cursive`; g.fillStyle = pal.accent; g.fillText(txt, 0, 0);
        g.restore();
      }
    };
    raf = requestAnimationFrame(tick);

    addEventListener("pointermove", move);
    addEventListener("resize", size);
    const onScroll = () => { rectsAt = 0; };
    addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf); mo.disconnect(); mut.disconnect();
      document.documentElement.classList.remove("has-cursor");
      removeEventListener("pointermove", move); removeEventListener("resize", size); removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div className="ab-cursor" aria-hidden>
      <canvas ref={canvas} className="ab-cursor-fx" />
      <svg ref={arrow} className="ab-cursor-arrow" viewBox="0 0 44 44">
        <path d="M4 24 C14 20 24 22 36 22 M28 14 L37 22 L28 30" />
      </svg>
    </div>
  );
}
