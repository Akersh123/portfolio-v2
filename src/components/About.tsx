import { Fragment } from "react";
import { about } from "../data/content";
import { Label } from "./ui";

export function About() {
  const words = about.statement.split(" ");
  return (
    <section className="ab-section ab-wrap" id="about">
      <div className="ab-about-grid">
        <Label>About</Label>
        <div>
          <p className="ab-statement" data-scrub="about">
            {words.map((w, i) => (
              <Fragment key={i}><span className="w">{w}</span>{" "}</Fragment>
            ))}
          </p>
          <div className="ab-hats">
            {about.hats.map((h, i) => (
              <div className="ab-hat" key={h.title} data-reveal data-delay={i * 100}>
                <h3>{h.title}</h3>
                <p>{h.body}</p>
              </div>
            ))}
          </div>
          <div className="ab-facts">
            {about.facts.map((f, i) => (
              <div className="ab-fact" key={f.label} data-reveal data-delay={i * 100}>
                <b>{f.value}</b><span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
