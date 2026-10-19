import { useRef, type ReactNode, type MouseEvent } from "react";
import { useMagnetic } from "../hooks/useMagnetic";
import { lenis } from "../lib/lenis";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

type ButtonProps = {
  variant?: "primary" | "ghost" | "link";
  size?: "md" | "sm";
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  arrow?: boolean;
  download?: boolean;
  external?: boolean;
  className?: string;
  /** Handwritten note the cursor arrow writes beside this button. */
  note?: string;
  children: ReactNode;
};

/** In-page anchors scroll with Lenis; everything else behaves like a normal link. */
export function handleAnchor(e: MouseEvent<HTMLAnchorElement>, href?: string) {
  if (href && href.startsWith("#") && href.length > 1) {
    e.preventDefault();
    lenis.scrollTo(href === "#top" ? 0 : href);
    history.replaceState(null, "", href);
  }
}

export function Button({ variant = "primary", size, href, onClick, icon, arrow = true, download, external, className, note, children }: ButtonProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  useMagnetic(ref, variant === "link" ? 0.15 : 0.35);
  const cls = cx("ab-btn", `ab-btn-${variant}`, size === "sm" && "ab-btn-sm", className);
  const inner = (
    <span className="ab-btn-label">
      {children}
      {arrow && <span className="ab-btn-arrow" aria-hidden>{icon ?? "→"}</span>}
    </span>
  );
  if (href)
    return (
      <a ref={ref} className={cls} href={href} data-cursor="link" data-note={note} download={download || undefined}
        target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}
        onClick={(e) => handleAnchor(e, href)}>
        {inner}
      </a>
    );
  return <button ref={ref} type="button" className={cls} onClick={onClick} data-cursor="link" data-note={note}>{inner}</button>;
}

export function Tag({ tone, children }: { tone?: "accent" | "solid"; children: ReactNode }) {
  return <span className={cx("ab-tag", tone && `ab-tag-${tone}`)}>{children}</span>;
}

export function Label({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span className={cx("ab-label", className)}>
      {children}
    </span>
  );
}

/** Section opener: label in the first quarter, split-revealed title, optional aside. */
export function SectionHead({ label, title, aside }: { label: string; title: ReactNode; aside?: ReactNode }) {
  return (
    <div className="ab-head">
      <Label>{label}</Label>
      <div className="ab-head-aside">
        <h2 data-split>{title}</h2>
        {aside && <p data-reveal data-delay="200">{aside}</p>}
      </div>
    </div>
  );
}

export { cx };
