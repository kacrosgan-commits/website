export interface ProcessStep {
  number: string;
  title: string;
  summary: string;
  details: string[];
  home?: boolean;
  homeTitle?: string;
}

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discovery & Requirements",
    homeTitle: "Discover",
    home: true,
    summary: "We learn the product, the users, and the constraints before recommending a build.",
    details: [
      "Conversations with the people who know the problem, the users, and the limits.",
      "A review of any existing product, codebase, or integrations that the new work has to live with.",
      "A written statement of what the first release must do, and what it will leave for later.",
    ],
  },
  {
    number: "02",
    title: "Architecture & Planning",
    homeTitle: "Plan",
    home: true,
    summary: "We choose a technical shape, a sequence of work, and the risks worth naming early.",
    details: [
      "An architecture sketch the client can question, not only a diagram for engineers.",
      "A delivery plan with milestones, dependencies, and the decisions still open.",
      "Environments, repositories, and access agreed before implementation starts.",
    ],
  },
  {
    number: "03",
    title: "UI/UX & Prototyping",
    homeTitle: "Design",
    home: true,
    summary: "Interfaces are explored before they are expensive to change.",
    details: [
      "Flows for the tasks users actually repeat.",
      "Prototypes or interface drafts reviewed with the people who will sign off.",
      "A design direction the engineering work can follow without reinventing the screen each sprint.",
    ],
  },
  {
    number: "04",
    title: "Agile Development",
    homeTitle: "Develop",
    home: true,
    summary: "We build in short cycles so progress is visible and feedback arrives while it still matters.",
    details: [
      "Working software shown on a regular rhythm, not only at the end.",
      "Code review and shared standards so the codebase stays readable.",
      "A single thread for questions, scope changes, and blockers.",
    ],
  },
  {
    number: "05",
    title: "QA & Validation",
    homeTitle: "Test",
    home: true,
    summary: "We check the product against the agreed behavior before it is treated as ready.",
    details: [
      "Test passes for the critical paths, including the unhappy ones.",
      "Fixes tracked in the open, with a clear line between a blocker and a later improvement.",
      "Release notes the client can read without translating them.",
    ],
  },
  {
    number: "06",
    title: "Deployment & Support",
    homeTitle: "Improve",
    home: true,
    summary: "Launch includes the handover: how it is deployed, watched, and improved.",
    details: [
      "A deployment path the team can repeat, with the access and runbooks that path needs.",
      "An agreed window for fixes after release.",
      "A conversation about what the next version should learn from the first one.",
    ],
  },
];

export const homeProcessSteps = processSteps.filter((step) => step.home);
