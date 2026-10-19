import { Fragment, useState } from "react";
import { site } from "../data/content";
import { KochiNow } from "./KochiNow";
import { stack } from "../data/stack";
import { Button, Label, cx, handleAnchor } from "./ui";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(site.email); } catch { window.location.href = `mailto:${site.email}`; return; }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <section className="ab-section ab-contact" id="contact">
      <div className="ab-wrap">
        <Label>Contact</Label>
        <h2 className="ab-contact-title" data-split>
          Have something<br />that needs <span className="ab-serif">solutions</span><span className="ab-dot">?</span>
        </h2>
        <button className={cx("ab-mail", copied && "is-copied")} onClick={copy} data-cursor="text" data-note="click to copy">
          {site.email}
          <span className="ab-mail-hint" aria-live="polite">{copied ? "Copied" : "Click to copy"}</span>
        </button>
        <div className="ab-contact-row">
          <div className="ab-socials">
            <Button variant="link" href={site.linkedin} icon="↗" external note="let’s connect">LinkedIn</Button>
            <Button variant="link" href={site.github} icon="↗" external note="peek at my code">GitHub</Button>
            <Button variant="link" href={`mailto:${site.email}`} icon="↗" note="write to me">Email</Button>
          </div>
          <Button href={site.resume} icon="↓" download note="the full story">Download résumé</Button>
        </div>
      </div>
      <div className="ab-marquee" aria-hidden>
        <div className="ab-marquee-track">
          {/* Two identical halves (the track slides -50%); one full set is ~2700px, wider than a 2560px screen */}
          {[0, 1].map((k) => (
            <Fragment key={k}>
              {stack.map((t) => (
                <span className="ab-marquee-item" key={t.name}>
                  <svg viewBox="0 0 24 24" style={{ color: t.color, scale: t.scale ? String(t.scale) : undefined }} aria-hidden><path d={t.path} /></svg>
                  {t.name}<span className="ab-dot">●</span>
                </span>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
      <div className="ab-wrap">
        <KochiNow />
        <footer className="ab-foot">
          <span>© 2026 {site.name}</span>
          <a href="#top" data-cursor="link" data-note="beam me up" onClick={(e) => handleAnchor(e, "#top")}>Back to top ↑</a>
        </footer>
      </div>
    </section>
  );
}
