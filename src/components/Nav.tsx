import { useEffect, useRef, useState } from "react";
import { nav, site } from "../data/content";
import { lenis } from "../lib/lenis";
import { Button, Tag, cx, handleAnchor } from "./ui";

function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute("data-theme") || "dark");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0c0c0b" : "#f3f0e9");
    try { localStorage.setItem("theme", theme); } catch { /* private mode */ }
  }, [theme]);
  return [theme, () => setTheme((t) => (t === "dark" ? "light" : "dark"))] as const;
}

/** Highlights the link whose section is under the middle of the viewport. */
function useActiveSection() {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-50% 0px -50% 0px" },
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return active;
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const active = useActiveSection();
  const menu = useRef<HTMLElement>(null);
  useEffect(() => { menu.current?.toggleAttribute("inert", !open); }, [open]);

  // hide on scroll down after 120px, return on scroll up
  useEffect(() => {
    let last = scrollY;
    const onScroll = () => {
      const y = scrollY;
      setHidden(y > 120 && y > last);
      last = y;
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) lenis.stop(); else lenis.start();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [open]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setOpen(false);
    lenis.start();
    handleAnchor(e, href);
  };

  return (
    <header className={cx("ab-nav", open && "is-open", hidden && !open && "is-hidden")}>
      <a className="ab-nav-brand" href="#top" data-cursor="link" onClick={(e) => go(e, "#top")}>
        {site.name}
      </a>
      <ul className="ab-nav-links">
        {nav.map((n) => (
          <li key={n.label}>
            <a href={n.href} data-cursor="link" onClick={(e) => go(e, n.href)}
              className={cx("ab-nav-link", active === n.href.slice(1) && "is-active")}
              aria-current={active === n.href.slice(1) ? "true" : undefined}>
              <span className="ab-roll" data-t={n.label}>{n.label}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="ab-nav-right">
        <button className="ab-toggle" aria-pressed={theme === "light"} data-cursor="link" data-note="lights!" onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} />
        <Button size="sm" variant="ghost" href="#contact" note="let’s chat!">Let’s talk</Button>
        <button className="ab-menu-btn" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
          {open ? "Close" : "Menu"}<span className="ab-burger" aria-hidden />
        </button>
      </div>
      <nav id="mobile-menu" className={cx("ab-menu", open && "is-open")} ref={menu} aria-hidden={!open}>
        <ol>
          {nav.map((n) => (
            <li key={n.label}>
              <a href={n.href} onClick={(e) => go(e, n.href)} className={active === n.href.slice(1) ? "is-active" : ""}>
                {n.label}
              </a>
            </li>
          ))}
        </ol>
        <div className="ab-tags">
          <Tag>{site.email}</Tag><Tag>LinkedIn</Tag><Tag>GitHub</Tag>
        </div>
      </nav>
    </header>
  );
}
