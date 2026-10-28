import type { IconName } from "./icons";
import { getService } from "./services";
import { site } from "./site";

const specialties = [
  { slug: "web-application-development", label: "Web Development" },
  { slug: "mobile-app-development", label: "Mobile Apps" },
  { slug: "ai-intelligent-automation", label: "AI Solutions" },
  { slug: "saas-platform-development", label: "SaaS Development" },
  { slug: "backend-api-engineering", label: "Backend & APIs" },
  { slug: "cloud-devops", label: "Cloud & DevOps" },
  { slug: "ui-ux-product-design", label: "UI/UX Design" },
  { slug: "qa-software-testing", label: "QA & Testing" },
] as const;

export const buildServices = specialties.map((item) => {
  const service = getService(item.slug);
  if (!service) throw new Error(`Missing service: ${item.slug}`);
  return { label: item.label, service };
});

export const about = {
  heroEyebrow: `About ${site.name}`,
  heroTitle: "We Build Software for What's Next.",
  heroDescription: `${site.name} brings software engineering, product design, and technical problem-solving together to help startups move from ideas to working digital products.`,
  whoHeading: "A Development Team Built Around Products.",
  who: [
    `${site.name} is a software development agency. The work is aimed at startups: founders with an idea, early teams building a first product, and companies that already have software and need it to hold together as it grows.`,
    "Design, engineering, and testing sit in the same conversation. A product can need a web application, a mobile app, an AI feature, a SaaS foundation, a backend, a cloud path, an interface, and a real test pass. Those are parts of one build, not eight unrelated offers.",
    "What we treat as quality is practical. The codebase should be readable by the next person who has to change it. Scope should be specific enough to build against. And the people making product decisions should be able to follow the technical ones without a translation layer.",
  ],
  audienceHeading: "Built for Startup Challenges.",
  audienceNote:
    "These are the situations the practice is set up for. They are not a list of completed client engagements.",
  audiences: [
    {
      title: "Founders Starting From an Idea",
      text: "The hard part is turning a concept into an application someone can use. That means naming the first tasks the product must support, choosing a stack that fits those tasks, and leaving the rest for a later release.",
    },
    {
      title: "Startups Building an MVP",
      text: "An MVP is a narrow product, not a sketch that has to be thrown away. The goal is a release founders can put in front of users, on a codebase that can take the next round of changes.",
    },
    {
      title: "Teams Improving Existing Products",
      text: "Some startups already have a platform. The work is then usability, reliability, integrations, and structure: understanding what is there before deciding what should change.",
    },
    {
      title: "Startups Preparing to Scale",
      text: "Growth shows up as new requirements, more users, and more moving parts. Architecture, deployment, and testing have to keep up so the product does not depend on one person's memory.",
    },
  ],
  buildHeading: "Everything Your Product Needs to Take Shape.",
  buildIntro:
    "Eight specialties, each with its own page. Together they cover the usual path from a startup idea to software a team can keep improving.",
  missionHeading: "Our Mission",
  mission:
    "To help startups develop practical, reliable, and thoughtfully designed software products through clear collaboration and disciplined engineering.",
  missionSupport:
    "This is the standard we want the work to meet. It is a goal for how projects are run, not a record of outcomes already delivered, and not a promise that a product will succeed in the market.",
  visionHeading: "Our Vision",
  vision: "To be a trusted technology partner for startups building products that solve meaningful problems.",
  visionSupport:
    "The long view is a partnership that stays useful after the first release: design, engineering, and quality remaining in the same conversation as the product changes. That is an aim. It is not a claim that the company is already a leading or widely known agency.",
  philosophyHeading: "How We Think About Building Software.",
  philosophy: [
    {
      title: "Product Thinking",
      icon: "compass" as IconName,
      text: "The first question is what the software has to do for the people who will use it. A feature that does not serve the release in front of us waits, even if it would look impressive in a plan.",
    },
    {
      title: "Thoughtful Architecture",
      icon: "layers" as IconName,
      text: "We choose the shape of the system for the product at hand: how data is owned, how tenants are separated, and which integrations are real. Those decisions are written down before they are expensive to undo.",
    },
    {
      title: "Clean and Maintainable Code",
      icon: "code" as IconName,
      text: "Startups outgrow the first version. Naming, boundaries, and review exist so the next change is a normal piece of work, not an excavation.",
    },
    {
      title: "User-Centered Design",
      icon: "palette" as IconName,
      text: "Interfaces follow the task. Risky flows get prototyped so a founder can question them before engineering spends a sprint on the wrong screen.",
    },
    {
      title: "Quality and Testing",
      icon: "shield-check" as IconName,
      text: "A release includes the paths that fail, not only the path that demos well. Testing is planned with the build, and the team keeps a record of what was actually checked.",
    },
    {
      title: "Collaborative Delivery",
      icon: "handshake" as IconName,
      text: "Founders stay close to the decisions. Working software is shown while it can still change, and a change in scope is written down instead of absorbed quietly.",
    },
  ],
  processHeading: "A Clear Path From Idea to Implementation.",
  processIntro:
    "Every engagement follows the same six stages used on the process page, from the first requirements conversation through deployment and support.",
  teamHeading: "Meet the people behind Vortex Digital.",
  teamIntro:
    "Don Tran, Joshua Mendoza, Lin Jiayi, and Pongsak Rattanakul lead company direction, engineering, finance, and delivery. Five more people cover full-stack development, AI, mobile, UX research, and QA. The team page has all nine profiles. None of them is credited on a client case study.",
  ctaTitle: "Building a Startup Product?",
  ctaDescription:
    "Whether you're planning an MVP, developing a new application, or improving an existing platform, we'd like to hear what you're working on.",
};

export const homeIntro = {
  eyebrow: "The company",
  title: "Your Startup Idea Deserves Great Engineering.",
  lead: "Building software takes more than writing code.",
  body: `${site.name} brings product design, web and mobile development, AI engineering, and technical delivery together to help startup teams build applications with a strong foundation.`,
  support:
    "That foundation can include a web or mobile client, an AI feature, a SaaS structure, a backend, cloud delivery, interface design, and testing. The About page explains how the team approaches that work.",
};

export const reasons = [
  {
    title: "Thoughtful Architecture",
    text: "Structure follows the product. We choose the shape of the system for the problem in front of us, and we write down why.",
    icon: "layers" as const,
  },
  {
    title: "Collaborative Development",
    text: "You stay close to the decisions. Reviews, demos, and questions happen while the work can still change.",
    icon: "handshake" as const,
  },
  {
    title: "Maintainable Code",
    text: "Naming, tests, and boundaries are part of the delivery. The goal is software the team can keep changing.",
    icon: "code" as const,
  },
  {
    title: "Quality-First Delivery",
    text: "Testing and release checks sit in the plan, not in a scramble the night before launch.",
    icon: "shield-check" as const,
  },
  {
    title: "Long-Term Technical Partnership",
    text: "We are set up to stay involved after the first release, when the product meets real users and real edge cases.",
    icon: "workflow" as const,
  },
];
