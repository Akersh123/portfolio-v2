import { prefersReducedMotion } from "./gsap";

/**
 * Intro loader timing, decided once per page load.
 * The loader shows on the first visit of a browser session only, and never for reduced-motion users.
 */
const KEY = "ab-intro-seen";

function decide(): boolean {
  if (typeof window === "undefined" || prefersReducedMotion()) return false;
  try {
    if (sessionStorage.getItem(KEY)) return false;
    sessionStorage.setItem(KEY, "1");
  } catch {
    // storage blocked: still show it, just can't remember that we did
  }
  return true;
}

export const SHOW_INTRO = decide();

/** When the loader panel starts lifting (ms). Keep in sync with the CSS animation delay on .ab-intro. */
export const INTRO_LIFT_MS = 1950;
/** How long the lift takes (ms). */
export const INTRO_OUT_MS = 700;

/** Extra delay (s) for hero "load" animations so they play as the loader lifts away. */
export const INTRO_HOLD = SHOW_INTRO ? INTRO_LIFT_MS / 1000 : 0;
