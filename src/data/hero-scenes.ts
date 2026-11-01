/** Shared hero scene ids. Pages pass one id; they do not ship their own 3D code. */
export const heroScenes = [
  "workspace",
  "architecture",
  "showcase",
  "pipeline",
  "collaboration",
  "communication",
  "editorial",
  "service",
  "study",
  "profile",
] as const;

export type HeroScene = (typeof heroScenes)[number];

export const defaultHeroLabels: Record<HeroScene, string[]> = {
  workspace: ["Studio", "Review", "Build"],
  architecture: ["Frontend", "API", "Cloud", "Mobile", "AI"],
  showcase: ["Interface", "Product", "Detail"],
  pipeline: ["Discover", "Plan", "Design", "Develop", "Test", "Improve"],
  collaboration: ["Design", "Engineering", "Delivery", "Quality"],
  communication: ["Brief", "Reply", "Next step"],
  editorial: ["Notes", "Draft", "Release"],
  service: ["Scope", "Build", "Release"],
  study: ["Product"],
  profile: ["Role", "Practice"],
};

/** Short module names for service heroes. They describe the practice, not a client product. */
export const serviceHeroLabels: Record<string, string[]> = {
  "web-application-development": ["Browser", "API", "Data"],
  "mobile-app-development": ["iOS", "Android", "API"],
  "ai-intelligent-automation": ["Request", "Model", "Review"],
  "saas-platform-development": ["Access", "App", "Billing"],
  "backend-api-engineering": ["Client", "Service", "Store"],
  "cloud-devops": ["Commit", "Deploy", "Observe"],
  "ui-ux-product-design": ["Research", "Interface", "Handoff"],
  "qa-software-testing": ["Scope", "Checks", "Release"],
};
