import { useEffect, useRef } from "react";
import { useGSAP } from "./lib/gsap";
import { setupMotion } from "./lib/motion";
import { startLenis } from "./lib/lenis";
import { Cursor } from "./components/Cursor";
import { Loader } from "./components/Loader";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Skills, Principles } from "./components/IndexRows";
import { Work } from "./components/Work";
import { Timeline } from "./components/Timeline";
import { Contact } from "./components/Contact";

export default function App() {
  const main = useRef<HTMLElement>(null);

  useEffect(() => startLenis(), []);

  // SplitText uses autoSplit, so lines re-measure once the webfonts load and on resize.
  useGSAP(() => {
    if (main.current) setupMotion(main.current);
  }, { scope: main });

  return (
    <>
      <a className="ab-btn ab-btn-primary ab-btn-sm ab-skip" href="#about">Skip to content</a>
      <Loader />
      <Cursor />
      <Nav />
      <main ref={main} className="ab-page">
        <Hero />
        <About />
        <Skills />
        <Work />
        <Timeline />
        <Principles />
        <Contact />
      </main>
    </>
  );
}
