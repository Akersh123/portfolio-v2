# Akersh Bhaskar — portfolio

React + TypeScript + Tailwind, with GSAP (ScrollTrigger, SplitText) and Lenis.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build to dist/
```

## Where things live

| Path | What |
|---|---|
| `src/data/content.ts` | All site copy. Lines marked `TODO` still need a real detail |
| `src/styles/tokens.css` | Colour, spacing, radius and fluid type tokens (dark + light) |
| `src/styles/components.css` | Component styles (`ab-*` classes) |
| `tailwind.config.ts` | Tailwind theme mapped to the same tokens (`bg-bg`, `text-fg-muted`, `text-h1`, `p-gutter`…) |
| `src/lib/motion.ts` | Scroll animations, driven by `data-*` attributes |
| `src/lib/lenis.ts` | Smooth scroll, synced to GSAP's ticker |
| `src/lib/suncalc.ts` | Sun and moon positions for the Kochi footer panel |
| `src/components/` | Nav, Hero, About, Skills/Principles (`IndexRows`), Work, Timeline, Contact, KochiNow, Cursor, UI primitives |

## Motion attributes

Add these to any element and `setupMotion` picks it up:

- `data-split`: line-split reveal on scroll (`data-split="load"` plays on page load)
- `data-reveal`: fade and rise (`data-reveal="load"` plays on page load)
- `data-delay="200"`: delay in ms for either of the above
- `data-cursor="link"`: the cursor arrow points at this element
- `data-note="…"`: handwritten note the cursor writes above the element
- `data-parallax`: ±8% scrubbed parallax

With `prefers-reduced-motion`, Lenis and the reveals are off and content shows at rest. Touch devices get the native cursor.

## Before you publish

1. Set `site.linkedin`, `site.github` and `site.resume` in `content.ts`. Each link or button stays hidden while its value is empty.
2. Work through the `TODO`s in `content.ts`, especially a real number for the Sector1 outcome.
