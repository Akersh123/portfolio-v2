import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";

let instance: Lenis | null = null;

/** Smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function startLenis(): (() => void) | undefined {
  if (instance || prefersReducedMotion()) return undefined;
  instance = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: { offset: -76 } });
  instance.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => instance?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    instance?.destroy();
    instance = null;
  };
}

export const lenis = {
  stop: () => instance?.stop(),
  start: () => instance?.start(),
  scrollTo: (target: string | number | HTMLElement, duration = 1.4) => {
    if (instance) instance.scrollTo(target, { duration, offset: typeof target === "number" ? 0 : -76 });
    else if (typeof target === "number") window.scrollTo({ top: target });
    else (typeof target === "string" ? document.querySelector(target) : target)?.scrollIntoView();
  },
};
