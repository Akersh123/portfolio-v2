# Akersh Bhaskar — portfolio

React + TypeScript + Tailwind, with GSAP (ScrollTrigger, SplitText) and Lenis. Built from the **Akersh Bhaskar** design system. Tokens, components and motion all match it.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build to dist/
```

## Where things live

| Path | What |
|---|---|
| `src/data/content.ts` | **All copy.** Lines marked `DRAFT` / `TODO` need your real details |
| `src/styles/tokens.css` | Colour, spacing, radius, fluid type tokens (dark + light), generated from the design system |
| `src/styles/components.css` | Component styles ported from the design system (`ab-*` classes) |
| `tailwind.config.ts` | Tailwind theme mapped to the same tokens (`bg-bg`, `text-fg-muted`, `text-h1`, `p-gutter`…) |
| `src/lib/motion.ts` | Every scroll animation, driven by `data-*` hooks |
| `src/lib/lenis.ts` | Smooth scroll, synced to GSAP's ticker |
| `src/hooks/useMagnetic.ts` | Magnetic buttons |
| `src/components/` | Nav, Hero, About, Skills/Principles (`IndexRows`), Work, Timeline, Contact, Cursor, UI primitives |

## Motion hooks

Add these attributes to any element and `setupMotion` picks it up:

- `data-split`: line-split reveal on scroll (`data-split="load"` plays on page load)
- `data-reveal`: fade and rise (`data-reveal="load"` plays on page load)
- `data-delay="200"`: delay in ms for either of the above
- `data-cursor="link" | "view" | "text"` (+ `data-cursor-label`): custom cursor state
- `data-parallax`: ±8% scrubbed parallax

With `prefers-reduced-motion`, Lenis, reveals and magnetic pull are switched off, and content shows at rest. On touch devices there's no custom cursor and no magnetic pull.

## Before you publish

1. Fill in `site.linkedin`, `site.github` and the résumé PDF (`public/akersh-bhaskar-resume.pdf`).
2. Replace the `DRAFT` project copy and confirm `experience.period`.
3. Add 16:11 screenshots to `public/work/` and set `image: "/work/<file>.png"` on each project.
4. Optional: create `/work/:slug` case-study pages and update the `href` in `WorkCard`.
