/* All site copy lives here. Items marked DRAFT were written from project names — replace with the real story. */

export const site = {
  name: "Akersh Bhaskar",
  role: "Laravel Developer & Project Lead",
  city: "Kochi",
  email: "akershbhaskar.in@gmail.com",
  linkedin: "#", // TODO: https://www.linkedin.com/in/…
  github: "#", // TODO: https://github.com/…
  resume: "/akersh-bhaskar-resume.pdf", // TODO: drop the PDF into /public
};

export const nav = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
] as const;

export const hero = {
  sub: "Three years shipping enterprise systems for banking, financial services and agriculture — from the first requirement call to the tested release.",
  stack: "Laravel · PHP · MySQL · React · Linux · AWS",
};

export const about = {
  statement:
    "For three years I’ve built enterprise systems that banks, financial-services teams and an agricultural university rely on every day. I write the Laravel, I lead the delivery, and I test the build before it reaches anyone — so what ships is the whole product, not just the code.",
  hats: [
    { title: "Developer", body: "PHP and Laravel back ends, MySQL schemas, REST APIs — and the Tailwind front end that sits on top." },
    { title: "Project lead", body: "Requirement calls, scoping, sprint planning and the client update nobody has to chase." },
    { title: "Tester", body: "Manual QA on every release: roles, edge cases and bad data, written up as clear test cases." },
  ],
  facts: [
    { value: "3+", label: "years at Bytekat Technologies" },
    { value: "3", label: "client domains: banking, financial services, agriculture" },
    { value: "1", label: "person from requirement to release" },
  ],
};

export type SkillGroup = { name: string; items: string[]; note: string; status?: string };
export const skills: SkillGroup[] = [
  { name: "Backend", items: ["PHP", "Laravel", "MySQL", "REST APIs", "Queues & jobs"], note: "Where I spend most days." },
  { name: "Frontend", items: ["Tailwind CSS", "JavaScript", "React", "GSAP"], note: "Interfaces with motion that means something." },
  { name: "Cloud", items: ["AWS S3"], note: "Learning: wider AWS — compute, queues, mail.", status: "In progress" },
  { name: "Servers", items: ["Linux", "Server management"], note: "Setting up and looking after the machines my apps run on." },
  { name: "Process", items: ["Project leadership", "Manual testing", "Requirement analysis"], note: "The part that makes code a product." },
];

export type Project = {
  slug: string; title: string; role: string; domain: string;
  problem: string; solution: string; outcome: string; stack: string[];
  image?: string; // 16:11 screenshot in /public/work
  gallery?: Shot[]; // 16:11 screenshots, shown as a carousel instead of `image`
  status?: string; // badge beside the title, e.g. "Upcoming"
  doodle?: { tag: string; note: string }; // hand-drawn circle around `tag` (must match a stack item) + margin note
};
export type Shot = { src: string; alt: string; group: string };
export const projects: Project[] = [
  {
    slug: "sector1", title: "Sector1 — Men’s Wear Store", role: "Full-stack developer", domain: "Retail · E-commerce", // TODO: confirm role
    problem: "A multi-brand men’s wear store in Kattappana, Kerala needed to sell online and deliver across India — without losing track of stock or payments.", // DRAFT
    solution: "A Laravel storefront and admin panel: filterable catalog with size × colour stock, guest and account carts, Razorpay checkout backed by an idempotent webhook that auto-refunds stale orders, and plan-tiered admin access.",
    outcome: "Live at sector1.in — the store takes and tracks orders online, with a full audit trail on every status change.",
    stack: ["Laravel 13", "PHP 8.4", "MySQL", "Tailwind v4", "Alpine.js", "Razorpay"],
    doodle: { tag: "Razorpay", note: "every payment accounted for" }, // DRAFT note — edit freely
    gallery: [
      { src: "/work/sector1/store-home.jpg", alt: "Sector1 storefront home page with the “Dressed for impact” hero", group: "Storefront" },
      { src: "/work/sector1/store-shop.jpg", alt: "Shop page with category filters, search and product grid", group: "Storefront" },
      { src: "/work/sector1/store-product.jpg", alt: "Product page with colour and size pickers, add to cart and buy now", group: "Storefront" },
      { src: "/work/sector1/admin-dashboard.jpg", alt: "Admin dashboard with revenue, orders, monthly sales and order status", group: "Admin" },
      { src: "/work/sector1/admin-variants.jpg", alt: "Admin product editor generating size × colour variants with stock per SKU", group: "Admin" },
    ],
  },
  {
    slug: "bugsby", title: "Bugsby — Test Case Management", role: "Design & full-stack build", domain: "QA tooling", status: "Upcoming — launching soon", // TODO: confirm role
    problem: "QA teams kept test cases in spreadsheets, re-copied them for every release, and collected client bug reports over email with no shared status.", // DRAFT
    solution: "A self-hosted platform with a reusable test case library, versioned test sheets and runs, a bug workflow that reopens automatically when a retest fails, and a client portal where clients report and follow their bugs through a signed link and an email code — no account needed.",
    outcome: "Every screen and API route is built and role-scoped across Super Admin, Test Manager, Tester, Developer and Client. Email delivery and deployment are being finished before it goes live.",
    stack: ["Rust", "Axum", "PostgreSQL", "Redis", "React", "TypeScript", "Tailwind"],
    doodle: { tag: "Rust", note: "new stack, new tricks" }, // DRAFT note — edit freely
    image: "/work/bugsby/mockup.jpg", // stylised mockup — real UI stays private until launch
  },
  {
    slug: "portfolio", title: "This portfolio", role: "Design & build", domain: "Personal",
    problem: "A CV lists skills. It can’t show how I care about the last 10% of a product.",
    solution: "A motion-led site in React, TypeScript and Tailwind with GSAP ScrollTrigger and Lenis, built from a documented design system.",
    outcome: "A working sample of my front-end and UX detail — and the system behind it.",
    stack: ["React", "TypeScript", "Tailwind", "GSAP", "Lenis"],
    doodle: { tag: "GSAP", note: "you're scrolling it right now" }, // DRAFT note — edit freely
  },
];

export const experience = {
  company: "Bytekat Technologies",
  location: "Kerala, India",
  domains: ["Banking", "Financial services", "Agricultural university"],
  // Oldest first: the timeline spine fills top to bottom as you scroll. Summaries are DRAFT — edit freely.
  stages: [
    { start: "Nov 2023", end: "Nov 2025", title: "Junior Laravel Developer & Tester",
      summary: "Joined Bytekat building Laravel features and testing each release before it reached the client." },
    { start: "Nov 2025", end: "Oct 2026", title: "Project Lead, Junior Laravel Developer & Tester",
      summary: "Took the lead on projects: running delivery with clients and the team, while still writing and testing the Laravel." },
    { start: "Oct 2026", end: "Now", title: "Assistant Project Manager & Mid Level Laravel Developer",
      summary: "Managing delivery across projects with clients and the team, and building the Laravel behind them." },
  ],
};

export const principles = [
  { title: "Own the requirement", body: "I restate the problem in the client’s words, then in data. If I can’t write the acceptance criteria, I’m not ready to write the code." },
  { title: "Ship tested", body: "I test my own builds the way QA would — every role, every edge case, the bad data — before anyone else has to." },
  { title: "Make it obvious", body: "Small tickets, written decisions, a visible board. A team moves faster when nobody has to guess." },
  { title: "Finish the last 10%", body: "Empty states, loading states, the wording of an error. The details users feel but never mention." },
];
