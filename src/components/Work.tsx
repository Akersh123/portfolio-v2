import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { projects, type Project, type Shot } from "../data/content";
import { Button, Label, Linkify, SectionHead, Tag, cx } from "./ui";

/** Scroll-snap carousel: swipe/trackpad natively, buttons, dots and arrow keys. */
function Gallery({ shots, title }: { shots: Shot[]; title: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const go = (n: number) => {
    const el = track.current;
    if (!el) return;
    const next = (n + shots.length) % shots.length;
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };
  const onScroll = () => {
    const el = track.current;
    if (el) setI(Math.round(el.scrollLeft / el.clientWidth));
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
  };
  return (
    <div className="ab-work-media ab-gal" role="region" aria-roledescription="carousel"
      aria-label={`${title} screenshots`} tabIndex={0} onKeyDown={onKey}>
      <div className="ab-gal-track" ref={track} onScroll={onScroll}>
        {shots.map((s, n) => (
          <figure className="ab-gal-slide" key={s.src} aria-roledescription="slide" aria-label={`${n + 1} of ${shots.length}`}>
            <img src={s.src} alt={s.alt} loading="lazy" draggable={false} />
          </figure>
        ))}
      </div>
      <span className="ab-gal-tag ab-label">{shots[i]?.group}</span>
      <div className="ab-gal-ctrl">
        <button type="button" onClick={() => go(i - 1)} aria-label="Previous screenshot" data-cursor="link" data-note="previous one">←</button>
        <div className="ab-gal-dots">
          {shots.map((s, n) => (
            <button type="button" key={s.src} className={cx(n === i && "is-on")} onClick={() => go(n)}
              aria-label={`Show screenshot ${n + 1}`} aria-current={n === i ? "true" : undefined} data-cursor="link" />
          ))}
        </div>
        <button type="button" onClick={() => go(i + 1)} aria-label="Next screenshot" data-cursor="link" data-note="next one">→</button>
      </div>
    </div>
  );
}

/** Stand-in screen until real screenshots exist (set `image` on the project). */
function Mock() {
  return (
    <div className="ab-work-screen">
      <div className="ab-mock-bar"><i /><i /><i /><span /></div>
      <div className="ab-mock">
        <div className="ab-mock-side"><b /><b /><b /><b /><b /></div>
        <div className="ab-mock-main"><b className="s" /><b className="a" /><b /><b /><b /><b /></div>
      </div>
    </div>
  );
}

/** Seeded wobble so each card's doodle is hand-drawn but stable between renders. */
const wobble = (seed: number) => (i: number) => Math.sin(seed * 12.9898 + i * 78.233) * 0.5;

/** Hand-drawn swoosh, star, circle around one stack tag and an arrow to the margin note — drawn by scroll position. */
function Doodle({ body, note, tag, seed }: { body: RefObject<HTMLDivElement>; note: RefObject<HTMLSpanElement>; tag: string; seed: number }) {
  const [paths, setPaths] = useState<{ ring: string; arrow: string; head: string; under: string; star: string } | null>(null);
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = body.current, nt = note.current;
    if (!el || !nt) return;
    const j = wobble(seed);
    const measure = () => {
      const t = [...el.querySelectorAll<HTMLElement>(".ab-tag")].find((x) => x.textContent?.trim() === tag);
      if (!t) return setPaths(null);
      const b = el.getBoundingClientRect(), r = t.getBoundingClientRect(), n = nt.getBoundingClientRect();
      // Tighter loop on narrow cards so a ring around the first tag stays inside the page gutter
      const narrow = b.width < 560, cx = r.left - b.left + r.width / 2, cy = r.top - b.top + r.height / 2;
      const rx = r.width / 2 + (narrow ? 7 : 15), ry = r.height / 2 + (narrow ? 7 : 11);
      // ~1.1 turns with a little drift, like a pen that overshoots
      const a0 = -2.2 + j(1) * 0.4, pts: string[] = [];
      for (let i = 0; i <= 44; i++) {
        const a = a0 + (i / 44) * Math.PI * 2.18, k = 1 + j(i) * 0.06 + i * 0.0018;
        pts.push(`${(cx + Math.cos(a) * rx * k).toFixed(1)},${(cy + Math.sin(a) * ry * k).toFixed(1)}`);
      }
      // arrow from the note's left/top towards the ring
      const sx = n.left - b.left - 8, sy = n.top - b.top + n.height * 0.45;
      const ang = Math.atan2(sy - cy, sx - cx), ex = cx + Math.cos(ang) * (rx + 7), ey = cy + Math.sin(ang) * (ry + 7);
      const mx = (sx + ex) / 2, my = (sy + ey) / 2, len = Math.hypot(sx - ex, sy - ey);
      // bow the arrow downward so it passes under the tag row, not through it
      let px = -(ey - sy) / len, py = (ex - sx) / len;
      if (py < 0) { px = -px; py = -py; }
      const qx = mx + px * len * 0.28, qy = my + py * len * 0.28;
      const d = Math.atan2(ey - qy, ex - qx), hl = 10;
      const head = `M${(ex - Math.cos(d - 0.5) * hl).toFixed(1)},${(ey - Math.sin(d - 0.5) * hl).toFixed(1)} L${ex.toFixed(1)},${ey.toFixed(1)} L${(ex - Math.cos(d + 0.5) * hl).toFixed(1)},${(ey - Math.sin(d + 0.5) * hl).toFixed(1)}`;
      // swoosh under the title's last line (open space below it) + a star after it
      const lines = [...(el.querySelector(".ab-work-title span")?.getClientRects() ?? [])].filter((q) => q.width > 4);
      let under = "", star = "";
      if (lines.length) {
        const f = lines[0], l = lines[lines.length - 1];
        const ux0 = l.left - b.left - 6, ux1 = l.left - b.left + Math.max(l.width * 0.92, 90), uy = l.bottom - b.top + 8;
        under = `M${ux0.toFixed(1)},${(uy + 2).toFixed(1)} C${(ux0 + (ux1 - ux0) * 0.3).toFixed(1)},${(uy - 3 + j(3) * 3).toFixed(1)} ${(ux0 + (ux1 - ux0) * 0.7).toFixed(1)},${(uy + 4).toFixed(1)} ${ux1.toFixed(1)},${(uy - 4).toFixed(1)}`;
        const R = 18, room = l.right - b.left + 34 + R <= b.width;
        // beside the last line when there's room; otherwise tucked above the title's right edge
        const sxc = room ? l.right - b.left + 34 : b.width - R - 4, syc = room ? l.top - b.top + l.height * 0.45 : f.top - b.top - R - 4;
        const sp: string[] = [];
        for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + 0.12 + i * Math.PI / 5, rr = (i % 2 ? R * 0.45 : R) * (1 + j(i + 20) * 0.08); sp.push(`${(sxc + Math.cos(a) * rr).toFixed(1)},${(syc + Math.sin(a) * rr).toFixed(1)}`); }
        star = `M${sp.join(" L")}`;
      }
      // On narrow cards the note wraps under the button and any arrow would cut through tags, so skip it there
      const arrow = narrow ? "" : `M${sx.toFixed(1)},${sy.toFixed(1)} Q${qx.toFixed(1)},${qy.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`;
      setPaths({ ring: `M${pts.join(" L")}`, arrow, head: narrow ? "" : head, under, star });
    };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [body, note, tag, seed]);

  // Scrubbed by scroll: 0 when the card's top is 85% down the screen, 1 when its bottom gets there.
  // Each doodle owns a slice of that range, so they draw in order going down and undraw going up.
  useEffect(() => {
    const el = body.current, nt = note.current, sv = svg.current;
    if (!el || !nt || !sv) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const slices: [string, number, number][] = [["under", 0, 0.18], ["star", 0.14, 0.34], ["ring", 0.3, 0.55], ["arrow", 0.55, 0.74], ["head", 0.74, 0.8]];
    const parts = slices.map(([k, a, b]) => [sv.querySelector<SVGPathElement>(`.ab-doodle-${k}`), a, b] as const);
    const seg = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect(), line = innerHeight * 0.85;
      const p = reduced ? 1 : Math.min(1, Math.max(0, (line - r.top) / Math.max(1, r.height)));
      for (const [path, a, b] of parts) if (path) path.style.strokeDashoffset = String(1 - seg(p, a, b));
      const k = seg(p, 0.78, 1);
      nt.style.clipPath = `inset(-14px calc(${((1 - k) * 100).toFixed(2)}% - ${(k * 18).toFixed(1)}px) -14px -14px)`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(raf); removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); };
  }, [paths, body, note]);

  if (!paths) return null;
  return (
    <svg ref={svg} className="ab-doodle" aria-hidden>
      {paths.under && <path className="ab-doodle-under" d={paths.under} pathLength={1} />}
      {paths.star && <path className="ab-doodle-star" d={paths.star} pathLength={1} />}
      <path className="ab-doodle-ring" d={paths.ring} pathLength={1} />
      {paths.arrow && <path className="ab-doodle-arrow" d={paths.arrow} pathLength={1} />}
      {paths.head && <path className="ab-doodle-head" d={paths.head} pathLength={1} />}
    </svg>
  );
}

export function WorkCard({ item, index }: { item: Project; index: number }) {
  const n = String(index + 1).padStart(2, "0");
  const href = `#work`; // TODO: link to /work/${item.slug} once case-study pages exist
  const body = useRef<HTMLDivElement>(null), note = useRef<HTMLSpanElement>(null);
  return (
    <article className="ab-work" data-reveal>
      {item.gallery?.length
        ? <Gallery shots={item.gallery} title={item.title} />
        : <a className="ab-work-media" href={href} data-cursor="view" data-note="have a look" aria-label={`Open case study: ${item.title}`}>
            <div className="ab-work-media-in" data-parallax>
              <div className="ab-work-zoom">
                {item.image
                  ? <img src={item.image} alt="" loading="lazy" />
                  : <><span className="ab-work-num">{n}</span><Mock /></>}
              </div>
            </div>
          </a>}
      <div className="ab-work-body" ref={body}>
        {item.doodle && <Doodle body={body} note={note} tag={item.doodle.tag} seed={index + 1} />}
        <div className="ab-work-top">
          <Label>{item.domain}</Label>
          <span className="ab-label ab-work-role">{item.role}</span>
        </div>
        {item.status && <div><Tag tone="accent"><span className="ab-pulse" aria-hidden />{item.status}</Tag></div>}
        <h3 className="ab-work-title"><span>{item.title}</span></h3>
        <dl className="ab-pso">
          <div><dt>Problem</dt><dd><Linkify text={item.problem} /></dd></div>
          <div><dt>Solution</dt><dd><Linkify text={item.solution} /></dd></div>
          <div><dt>Outcome</dt><dd><Linkify text={item.outcome} /></dd></div>
        </dl>
        <div className="ab-tags">{item.stack.map((t) => <Tag key={t}>{t}</Tag>)}</div>
        <div className="ab-work-foot">
          <Button variant="link" href={href}>Read case study</Button>
          {item.doodle && <span className="ab-doodle-note" ref={note}>{item.doodle.note}</span>}
        </div>
      </div>
    </article>
  );
}

export function Work() {
  return (
    <section className="ab-section ab-wrap" id="work">
      <SectionHead label="Selected work"
        title={<>Selected<br /><span className="ab-serif">work</span><span className="ab-dot">.</span></>}
        aside="Three products, each taken from requirement to release." />
      <div className="ab-works">
        {projects.map((p, i) => <WorkCard key={p.slug} item={p} index={i} />)}
      </div>
    </section>
  );
}
