import type { NowItem, Profile } from "./types";

export const profile: Profile = {
  name: "Somil Athole",
  monogram: "SA",
  headline: "Full Stack Engineer · API security & GenAI tooling",
  role: "Full Stack Engineer",
  focus: ["API security", "GenAI tooling"],
  oneLiner: "I build the tools that find what your API docs forgot.",
  subLine:
    "2.5+ years shipping React, Next.js, Node.js and PostgreSQL products. Currently building an API security platform: shadow-API detection, vulnerability triage and AI-written remediation.",
  experienceYears: "2.5+",
  careerPath: "UX → Full Stack → Security tooling",
  location: "Gurugram, India",
  locationShort: "Gurugram, IN",
  openTo: "Open to Bengaluru, Pune, Noida, Mumbai and remote (India)",
  availability: "Open to conversations",
  email: "sathole2001@gmail.com",
  siteUrl: "https://somil-athole.netlify.app",
  repoUrl: "https://github.com/somil14/Digital-Portfolio-Next.Js-Typescript",
  links: {
    github: { label: "GitHub", href: "https://github.com/somil14" },
    linkedin: {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/somil-athole/",
    },
    leetcode: {
      label: "LeetCode",
      href: "https://leetcode.com/u/somil_athole/",
    },
    // TODO(somil): the GitHub profile README links /sathole2001 instead. Confirm which is right.
    hackerrank: {
      label: "HackerRank",
      href: "https://www.hackerrank.com/profile/sathole2001",
    },
    x: { label: "X", href: "https://twitter.com/somil_athole" },
    behance: { label: "Behance", href: "https://www.behance.net/somilathole" },
  },
  education: {
    degree: "B.Tech, Computer Science & Engineering",
    school: "VIT Bhopal University",
    years: "2019–2023",
  },
  about: [
    "I started in UX, running user research and usability tests as a design intern. From there I moved into full-stack engineering with UK product teams, building features end to end in React, Next.js and Node.js.",
    "Today I build API security tooling: software that finds the endpoints nobody documented and helps teams decide what to fix first.",
    "I care about the space between design and systems. That means interfaces that make complex security data understandable, and backends that are validated, rate-limited, cached and observable.",
    "Outside work you'll find me on UX and UI design, making content, trekking, or playing chess and e-sports.",
  ],
  interests: [
    "UX/UI design",
    "Content creation",
    "Trekking",
    "Chess",
    "E-sports",
  ],
  // TODO(somil): confirm the four FTPC bullets as the /tldr summary, or pick four others.
  tldrBulletsFrom: "ftpc",
  // TODO(somil): portrait photo for the About section (optional).
  // TODO(somil): phone number on the generated resume PDF, yes or no. Never shown on the site.
};

export const now: NowItem[] = [
  {
    label: "Data structures & algorithms",
    detail: "NeetCode 150, daily",
    state: "ongoing",
  },
  {
    label: "System design",
    detail: "Low-level and high-level design",
    state: "ongoing",
  },
  {
    label: "Next build",
    detail: "A RAG + agents project with a streaming UI and evals",
    state: "planned",
  },
];
