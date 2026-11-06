import { useState } from "react";
import { site } from "../data/content";
import { KochiNow } from "./KochiNow";
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
          Have a project<br />in <span className="ab-hand">mind</span><span className="ab-dot">?</span>
        </h2>
        <button className={cx("ab-mail", copied && "is-copied")} onClick={copy} data-cursor="text" data-note="click to copy">
          {site.email}
          <span className="ab-mail-hint" aria-live="polite">{copied ? "Copied" : "Click to copy"}</span>
        </button>
        <div className="ab-contact-row">
          <div className="ab-socials">
            {site.linkedin && <Button variant="link" href={site.linkedin} icon="↗" external>LinkedIn</Button>}
            {site.github && <Button variant="link" href={site.github} icon="↗" external>GitHub</Button>}
            <Button variant="link" href={`mailto:${site.email}`} icon="↗">Email</Button>
          </div>
          {site.resume && <Button href={site.resume} icon="↓" download>Download résumé</Button>}
        </div>
      </div>
      <div className="ab-wrap">
        <KochiNow />
        <footer className="ab-foot">
          <span>© 2026 {site.name}</span>
          <a href="#top" data-cursor="link" onClick={(e) => handleAnchor(e, "#top")}>Back to top ↑</a>
        </footer>
      </div>
    </section>
  );
}
