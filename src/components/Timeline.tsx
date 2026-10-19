import { experience as x } from "../data/content";
import { Label, SectionHead, Tag } from "./ui";

export function Timeline() {
  const last = x.stages.length - 1;
  return (
    <section className="ab-section ab-wrap" id="experience">
      <SectionHead label="Experience" title="Where I’ve shipped" />
      <ol className="ab-tl">
        <span className="ab-tl-prog" aria-hidden />
        {x.stages.map((s, i) => (
          <li className="ab-tl-item" key={s.start}>
            <span className="ab-tl-dot" />
            <div className="ab-tl-when"><b>{s.start}</b><Label>{s.end === "Now" ? "to now" : `to ${s.end}`}</Label></div>
            <div className="ab-tl-body" data-reveal data-delay={i * 80}>
              <span className="ab-label ab-tl-co">{x.company} · {x.location}{i === last && <Tag tone="accent">Current</Tag>}</span>
              <h3>{s.title}</h3>
              <p>{s.summary}</p>
              {i === last && <div className="ab-tags">{x.domains.map((d) => <Tag key={d}>{d}</Tag>)}</div>}
            </div>
          </li>
        ))}
        <li className="ab-tl-item is-next">
          <span className="ab-tl-dot" />
          <div className="ab-tl-when"><b style={{ color: "var(--fg-muted)" }}>Next</b><Label>Open to roles</Label></div>
          <div className="ab-tl-body" data-reveal data-delay="120">
            <h3 style={{ color: "var(--fg-muted)" }}>Your team?</h3>
            <p>Looking for a team where I can keep building, leading and shipping complete products.</p>
          </div>
        </li>
      </ol>
    </section>
  );
}
