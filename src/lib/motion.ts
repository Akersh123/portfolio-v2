import { gsap, ScrollTrigger, SplitText, EASE_OUT, prefersReducedMotion } from "./gsap";
import { INTRO_HOLD } from "./intro";

/**
 * Site-wide scroll motion, set up once from App inside useGSAP (auto-reverted on unmount).
 * Hooks in the markup:
 *   data-split            → line-split reveal (motion #1). data-split="load" plays on page load; data-delay="ms".
 *   data-reveal           → fade + rise (Reveal). data-delay="ms".
 *   data-scrub="about"    → word colour scrub (motion #3).
 *   data-parallax         → media parallax ±8% (motion #5).
 *   .ab-tl-prog           → timeline spine fill (motion #6).
 */
export function setupMotion(root: HTMLElement) {
  if (prefersReducedMotion()) {
    document.documentElement.classList.add("no-motion");
    root.querySelectorAll<HTMLElement>("[data-scrub] .w").forEach((w) => w.classList.add("on"));
    root.querySelectorAll<HTMLElement>(".ab-tl-prog").forEach((el) => (el.style.transform = "none"));
    return;
  }
  document.documentElement.classList.add("gsap-ready");
  const delay = (el: Element) => Number((el as HTMLElement).dataset.delay || 0) / 1000;

  // 1 — split lines: y 108% → 0, rotate 2° → 0, 900ms expo.out, 80ms stagger
  root.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "ab-split-line",
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 108,
          rotate: 2,
          transformOrigin: "0% 100%",
          duration: 0.9,
          ease: EASE_OUT,
          stagger: 0.08,
          delay: delay(el) + (el.dataset.split === "load" ? INTRO_HOLD : 0), // load reveals wait for the intro loader
          scrollTrigger: el.dataset.split === "load" ? undefined : { trigger: el, start: "top 85%", once: true },
        });
      },
    });
  });

  // Reveal: opacity 0 → 1 (640ms), y 24 → 0 (900ms)
  root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    const load = el.dataset.reveal === "load";
    const st = load ? undefined : { trigger: el, start: "top 85%", once: true };
    const d = delay(el) + (load ? INTRO_HOLD : 0);
    gsap.from(el, { autoAlpha: 0, duration: 0.64, ease: EASE_OUT, delay: d, scrollTrigger: st });
    gsap.from(el, { y: 24, duration: 0.9, ease: EASE_OUT, delay: d, scrollTrigger: st });
  });

  // Hero: name drifts up as you leave
  const hero = root.querySelector<HTMLElement>(".ab-hero");
  if (hero) {
    const st = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
    gsap.to(hero.querySelector(".ab-hero-name"), { yPercent: -12, ease: "none", scrollTrigger: st });
  }

  // 3 — About: words light from fg-faint to fg with scroll
  root.querySelectorAll<HTMLElement>("[data-scrub='about']").forEach((p) => {
    const words = Array.from(p.querySelectorAll<HTMLElement>(".w"));
    ScrollTrigger.create({
      trigger: p,
      start: "top 85%",
      end: "bottom 50%",
      scrub: true,
      onUpdate: (self) => {
        const lit = Math.round(self.progress * words.length);
        words.forEach((w, i) => w.classList.toggle("on", i < lit));
      },
    });
  });

  // 5 — work media parallax
  root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
    gsap.fromTo(el, { yPercent: -8 }, {
      yPercent: 8, ease: "none",
      scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  // 6 — timeline spine fill; dots light as the fill passes them
  root.querySelectorAll<HTMLElement>(".ab-tl").forEach((tl) => {
    const prog = tl.querySelector(".ab-tl-prog");
    const items = Array.from(tl.querySelectorAll<HTMLElement>(".ab-tl-item:not(.is-next)"));
    gsap.to(prog, {
      scaleY: 1, ease: "none",
      scrollTrigger: {
        trigger: tl, start: "top 70%", end: "bottom 70%", scrub: true,
        onUpdate: (self) => {
          const h = tl.offsetHeight;
          items.forEach((it) => it.classList.toggle("is-current", it.offsetTop / h <= self.progress + 0.001));
        },
      },
    });
  });
}
