import { useEffect, useState } from "react";
import { hero, site } from "../data/content";
import { Button, handleAnchor } from "./ui";

function Clock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = () => setT(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date()));
    f();
    const id = setInterval(f, 15000);
    return () => clearInterval(id);
  }, []);
  return <span className="ab-scroll">{site.city} · IST {t}</span>;
}

/** Load sequence: name 200ms → positioning 650 → sub 850 → CTAs 1000 → note 1300. */
export function Hero() {
  return (
    <section className="ab-hero ab-wrap" id="top">
      <h1 className="ab-hero-name" data-split="load" data-delay="200">
        Akersh<br />Bhaskar<span className="ab-dot">.</span>
      </h1>
      <div className="ab-hero-row">
        <p className="ab-hero-pos" data-split="load" data-delay="650">
          {site.role}.<br />I write the code <span className="ab-hand">and run the project.</span>
        </p>
        <p className="ab-hero-sub" data-reveal="load" data-delay="850">{hero.sub}</p>
        <div className="ab-hero-cta" data-reveal="load" data-delay="1000">
          <Button href="#work">View work</Button>
          <Button variant="ghost" href="#contact" arrow={false} note="say hi!">Get in touch</Button>
        </div>
      </div>
      <div className="ab-hero-foot">
        <a className="ab-hero-note" href="#work" data-cursor="link" onClick={(e) => handleAnchor(e, "#work")}>
          <span className="ab-hero-note-text">{hero.note}</span>
          <svg viewBox="0 0 48 72" aria-hidden>
            <path pathLength={1} d="M3 14 C 14 10, 26 12, 30 22 C 34 32, 26 40, 19 35 C 12 30, 20 20, 30 27 C 38 33, 37 50, 34 64" />
            <path pathLength={1} d="M27 57 L 34 65 L 41 58" />
          </svg>
        </a>
        <span className="ab-scroll ab-hide-sm">{hero.stack}</span>
        <Clock />
      </div>
    </section>
  );
}
