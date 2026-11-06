/* All site copy lives here. Lines marked TODO need a real detail from you (a link, a number, a confirmation). */

export const site = {
  name: "Akersh Bhaskar",
  role: "Assistant Project Manager & Mid-Level Laravel Developer",
  city: "Kochi",
  email: "akershbhaskar.in@gmail.com",
  // Empty = hidden. Fill these in and the links/buttons appear.
  linkedin: "", // TODO: https://www.linkedin.com/in/…
  github: "", // TODO: https://github.com/…
  resume: "", // TODO: put the PDF in /public and set "/akersh-bhaskar-resume.pdf"
};

/** Phrases that become links wherever they appear in site copy (see <Linkify>). note = cursor note. */
export const links: Record<string, { href: string; note: string }> = {
  "sector1.in": { href: "https://sector1.in", note: "visit the store" },
  "Bytekat Technologies": { href: "https://bytekat.com", note: "where I work" },
  Bytekat: { href: "https://bytekat.com", note: "where I work" },
};

export const nav = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
] as const;

export const hero = {
  sub: "Three years at Bytekat building Laravel systems for banks, financial-services firms, an agricultural university, online stores and ERP clients.",
  stack: "Laravel · PHP · MySQL · React · Linux · AWS",
  note: "the good stuff's below", // handwritten note in the hero foot, arrow points to #work
};

export const about = {
  statement:
    "I joined Bytekat in November 2023 as a junior Laravel developer who also tested each release. I’ve since moved into running projects, but I still write the code, and I still test it before it reaches a client.",
  hats: [
    { title: "Developer", body: "PHP and Laravel back ends, MySQL schemas and REST APIs, plus the Tailwind front end on top." },
    { title: "Project manager", body: "Requirement calls with clients, scoping, sprint planning and progress updates." },
    { title: "Tester", body: "Manual QA before each release. I write the test cases and check each user role against edge cases and bad input." },
  ],
};

export type SkillGroup = { name: string; items: string[]; note: string; status?: string };
export const skills: SkillGroup[] = [
  { name: "Backend", items: ["PHP", "Laravel", "MySQL", "REST APIs", "Queues & jobs"], note: "Most of my working day." },
  { name: "Frontend", items: ["Tailwind CSS", "JavaScript", "React", "GSAP"], note: "The interfaces my back ends need, and this site." },
  { name: "Cloud", items: ["AWS S3"], note: "Using S3 now, learning the rest of AWS.", status: "In progress" },
  { name: "Servers", items: ["Linux", "Server management"], note: "I set up and maintain the servers my apps run on." },
  { name: "Process", items: ["Project leadership", "Manual testing", "Requirement analysis"], note: "How I run projects at Bytekat." },
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
    problem: "A men’s wear store in Kattappana, Kerala, carrying several brands, wanted to sell online and ship across India while keeping stock and payments in sync.",
    solution: "A Laravel storefront and admin panel. The catalog tracks stock for every size and colour. Checkout runs on Razorpay, with an idempotent webhook so a repeated payment event can’t process an order twice, and stale orders are refunded automatically. Admin access is tiered by plan.",
    // TODO: add one real number here: orders per month, products listed, or how long it has been live
    outcome: "Live at sector1.in. Every change to an order’s status is logged.",
    stack: ["Laravel 13", "PHP 8.4", "MySQL", "Tailwind v4", "Alpine.js", "Razorpay"],
    doodle: { tag: "Razorpay", note: "every payment accounted for" },
    gallery: [
      { src: "/work/sector1/store-home.jpg", alt: "Sector1 storefront home page with the “Dressed for impact” hero", group: "Storefront" },
      { src: "/work/sector1/store-shop.jpg", alt: "Shop page with category filters, search and product grid", group: "Storefront" },
      { src: "/work/sector1/store-product.jpg", alt: "Product page with colour and size pickers, add to cart and buy now", group: "Storefront" },
      { src: "/work/sector1/admin-dashboard.jpg", alt: "Admin dashboard with revenue, orders, monthly sales and order status", group: "Admin" },
      { src: "/work/sector1/admin-variants.jpg", alt: "Admin product editor generating size × colour variants with stock per SKU", group: "Admin" },
    ],
  },
  {
    slug: "bugsby", title: "Bugsby — Test Case Management", role: "Design & full-stack build", domain: "QA tooling", status: "Launching soon", // TODO: confirm role
    problem: "QA teams kept test cases in spreadsheets, copied them again for each release, and collected client bug reports by email with no shared status.",
    solution: "A self-hosted platform. Test cases live in a reusable library, and test sheets and runs are versioned. A bug reopens on its own when its retest fails. Clients report and follow their bugs in a portal, signing in with a link and an emailed code instead of an account.",
    outcome: "Every screen and API route is built, with permissions for five roles: Super Admin, Test Manager, Tester, Developer and Client. Email delivery and deployment are the last steps before launch.",
    stack: ["Rust", "Axum", "PostgreSQL", "Redis", "React", "TypeScript", "Tailwind"],
    doodle: { tag: "Rust", note: "new stack, new tricks" },
    image: "/work/bugsby/mockup.jpg", // stylised mockup; the real UI stays private until launch
  },
  {
    slug: "portfolio", title: "This portfolio", role: "Design & build", domain: "Personal",
    problem: "A CV can list front-end skills, but it can’t show them.",
    solution: "Designed and built in React, TypeScript and Tailwind, with GSAP for the scroll animation, Lenis for smooth scrolling and hand-drawn SVG doodles that draw as you scroll.",
    outcome: "The site you’re reading.",
    stack: ["React", "TypeScript", "Tailwind", "GSAP", "Lenis"],
    image: "/work/portfolio/mockup.jpg", // mockup of this site: hero on desktop, a doodled project card on a phone
    doodle: { tag: "GSAP", note: "you're scrolling it right now" },
  },
];

export const experience = {
  company: "Bytekat Technologies",
  location: "Kerala, India",
  domains: ["Banking", "Financial services", "Agricultural university", "E-commerce", "ERP"],
  // Oldest first: the timeline spine fills top to bottom as you scroll.
  stages: [
    { start: "Nov 2023", end: "Nov 2025", title: "Junior Laravel Developer & Tester",
      summary: "Built Laravel features and tested each release before it went to the client." },
    { start: "Nov 2025", end: "Oct 2026", title: "Project Lead, Junior Laravel Developer & Tester",
      summary: "Started leading projects: running delivery with clients and the team, while still writing and testing the Laravel." },
    { start: "Oct 2026", end: "Now", title: "Assistant Project Manager & Mid-Level Laravel Developer",
      summary: "Managing delivery across several projects and building the Laravel behind them." },
  ],
};

export const principles = [
  { title: "Own the requirement", body: "I restate the problem in the client’s words, then as data. If I can’t write the acceptance criteria, I’m not ready to write the code." },
  { title: "Test before handing over", body: "I test my own builds the way a QA tester would, so the obvious bugs never reach anyone else." },
  { title: "Keep it visible", body: "Small tickets, decisions written down and a board the whole team can see." },
  { title: "Finish the details", body: "Empty states, loading states and error messages get the same attention as the main screens." },
];
