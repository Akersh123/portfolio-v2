import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/* The two curves of the system. */
export const EASE_OUT = "expo.out";
export const EASE_IO = "power3.inOut";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const isTouch = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

export { gsap, ScrollTrigger, SplitText, useGSAP };
