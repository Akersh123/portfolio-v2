import { useEffect, type RefObject } from "react";
import { isTouch, prefersReducedMotion } from "../lib/gsap";

/** Motion #2 — the element follows the pointer by `strength`× its offset; its label by an extra 0.4×. */
export function useMagnetic(ref: RefObject<HTMLElement>, strength = 0.35) {
  useEffect(() => {
    const el = ref.current;
    if (!el || strength <= 0 || isTouch() || prefersReducedMotion()) return;
    const label = el.querySelector<HTMLElement>(".ab-btn-label");
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transitionDuration = "160ms";
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      if (label) label.style.transform = `translate(${dx * strength * 0.4}px, ${dy * strength * 0.4}px)`;
    };
    const leave = () => {
      el.style.transitionDuration = "";
      el.style.transform = "";
      if (label) label.style.transform = "";
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [ref, strength]);
}
