import { useEffect, useState } from "react";
import { hero, site } from "../data/content";
import { Button } from "./ui";

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

/** Load sequence: meta → name 200ms → positioning 650 → sub 850 → CTAs 1000. */
export function Hero() {
  return (
    <section className="ab-hero ab-wrap" id="top">
      <h1 className="ab-hero-name" data-split="load" data-delay="200">
        Akersh<br />Bhaskar<span className="ab-dot">.</span>
      </h1>
      <div className="ab-hero-row">
        <p className="ab-hero-pos" data-split="load" data-delay="650">
          {site.role} —<br />I build, lead <span className="ab-serif">and ship.</span>
        </p>
        <p className="ab-hero-sub" data-reveal="load" data-delay="850">{hero.sub}</p>
        <div className="ab-hero-cta" data-reveal="load" data-delay="1000">
          <Button href="#work" note="start here">View work</Button>
          <Button variant="ghost" href="#contact" arrow={false} note="say hi!">Get in touch</Button>
        </div>
      </div>
      <div className="ab-hero-foot">
        <span className="ab-scroll"><span className="ab-scroll-line" />Scroll</span>
        <span className="ab-scroll ab-hide-sm">{hero.stack}</span>
        <Clock />
      </div>
    </section>
  );
}
