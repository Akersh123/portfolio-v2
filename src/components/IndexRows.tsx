import { Fragment } from "react";
import { principles, skills } from "../data/content";
import { SectionHead, Tag } from "./ui";

export function Skills() {
  return (
    <section className="ab-section ab-wrap" id="skills">
      <SectionHead label="Skills" title="What I work with"
        aside="Grouped by where they show up in a project — not rated on a bar." />
      <ul className="ab-rows">
        {skills.map((s, i) => (
          <li className="ab-row" key={s.name} data-reveal data-delay={i * 80}>
            <span className="ab-row-n">0{i + 1}</span>
            <h3 className="ab-row-t">{s.name}</h3>
            <div className="ab-row-d">
              {s.items.map((x, j) => (
                <Fragment key={x}>{j > 0 && <span className="sep">/</span>}{x}</Fragment>
              ))}
              <span className="ab-row-note ab-label">
                {s.status && <Tag tone="accent">{s.status}</Tag>} {s.note}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Principles() {
  return (
    <section className="ab-section ab-wrap" id="process">
      <SectionHead label="How I work"
        title={<>Four rules I<br />work <span className="ab-serif">by</span><span className="ab-dot">.</span></>} />
      <ol className="ab-rows">
        {principles.map((p, i) => (
          <li className="ab-row" key={p.title} data-reveal data-delay={i * 80}>
            <span className="ab-row-n">0{i + 1}</span>
            <h3 className="ab-row-t">{p.title}</h3>
            <p className="ab-row-d" style={{ margin: 0 }}>{p.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
