import manifest from "../../ASSET_MANIFEST.json";

export interface TeamPortrait {
  src: string;
  thumb: string;
  alt: string;
  width: number;
  height: number;
  /** Owner confirmed this portrait belongs with this named profile. Not an independent identification from the image. */
  identityVerified: boolean;
  /** Owner-supplied photograph, or an illustrative portrait. */
  source: "supplied" | "illustrative";
}

export interface TeamWorkImage {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  isIllustrative: boolean;
}

export interface RolePoint {
  title: string;
  detail: string;
}

export interface RelatedRole {
  slug: string;
  note: string;
}

export interface TeamMember {
  id: string;
  slug: string;
  /** Null until a real name is confirmed. Do not invent one. */
  name: string | null;
  role: string;
  intro: string;
  biography: string[];
  responsibilities: RolePoint[];
  /** What the seat is expected to cover. Not a verified personal résumé. */
  expertise: RolePoint[];
  /** Owner-supplied duration. Empty of a year count when none was given. */
  experience: string;
  /** Earlier employers, kept separate from Vortex Digital work. */
  externalExperience?: string[];
  startupSupport: string;
  related: RelatedRole[];
  portrait: TeamPortrait;
  workImages: TeamWorkImage[];
  projectIds: string[];
  linkedin?: string;
  github?: string;
  portfolio?: string;
  /** Unpublished profiles stay out of the sitemap and send noindex. */
  isPublished: boolean;
}

function assetMember(slug: string) {
  const member = manifest.members.find((entry) => entry.slug === slug);
  if (!member) throw new Error(`ASSET_MANIFEST.json is missing ${slug}`);
  return member;
}

function portrait(slug: string, name: string, role: string): TeamPortrait {
  const asset = assetMember(slug).portrait;
  if (asset.path !== `/assets/team/${slug}/portrait.webp`) {
    throw new Error(`Unexpected portrait path for ${slug}: ${asset.path}`);
  }
  if (!asset.identityVerified) {
    throw new Error(`Portrait for ${slug} is not marked owner-confirmed`);
  }
  return {
    src: asset.path,
    thumb: `/assets/team/${slug}/portrait-thumb.webp`,
    alt: `Portrait of ${name}, ${role} at Vortex Digital`,
    width: asset.width,
    height: asset.height,
    identityVerified: true,
    source: "supplied",
  };
}

function scenes(slug: string): TeamWorkImage[] {
  const images = assetMember(slug).workImages.map((image) => ({
    src: image.path,
    alt: image.alt,
    caption: `${image.sceneDescription}. Illustrative scene, not a photograph of a named employee or a documented company event.`,
    width: image.width,
    height: image.height,
    isIllustrative: true,
  }));
  if (images.length !== 2 || images.some((image) => !image.src.startsWith(`/assets/team/${slug}/work-`))) {
    throw new Error(`Expected two work images for ${slug}`);
  }
  return images;
}

/**
 * Exactly nine roles, in order. Names and portraits are owner-approved.
 * Project credits and social links stay empty. Collaboration images are illustrations.
 */
export const team: TeamMember[] = [
  {
    id: "member-01",
    slug: "founder-ceo",
    name: "Don Tran",
    role: "Founder & CEO",
    intro: "Founder and CEO with 9 years in software engineering, focused on backend systems, SaaS products, and AI solutions.",
    biography: [
      "Don Tran leads Vortex Digital. Before founding the company, Don worked as a Senior Software Engineer.",
      "Current work is the company's technical strategy, oversight of software projects, startup client work, guidance for the engineering team, and the architecture decisions those projects depend on.",
    ],
    responsibilities: [
      { title: "Technical strategy", detail: "Lead the technical direction of the company." },
      { title: "Project oversight", detail: "Oversee software development projects." },
      { title: "Startup clients", detail: "Work directly with startup clients." },
      { title: "Engineering guidance", detail: "Guide the engineering team." },
      { title: "Architecture decisions", detail: "Make the key architecture decisions." },
    ],
    expertise: [
      { title: "Backend systems", detail: "Backend systems for the products the company takes on." },
      { title: "SaaS products", detail: "SaaS product work." },
      { title: "AI solutions", detail: "AI solutions alongside the rest of the engineering work." },
      { title: "Technical strategy", detail: "Technical strategy for the company." },
      { title: "Software architecture", detail: "Architecture decisions on software projects." },
    ],
    experience: "9 years in software engineering",
    startupSupport: "Startup clients work with Don on technical strategy and the architecture of the product, from the first scope through the engineering team that builds it.",
    related: [
      { slug: "cofounder-cto", note: "Turns a commercial promise into an architecture and an engineering plan." },
      { slug: "cfo", note: "Keeps the budget and the reporting attached to the scope that was agreed." },
      { slug: "project-manager", note: "Carries the agreed plan into the week-to-week client conversation." },
    ],
    portrait: portrait("founder-ceo", "Don Tran", "Founder & CEO"),
    workImages: scenes("founder-ceo"),
    projectIds: [],
    isPublished: true,
  },
  {
    id: "member-02",
    slug: "cofounder-cto",
    name: "Joshua Mendoza",
    role: "Co-Founder & CTO",
    intro: "Co-founder and CTO with 10 years in software engineering, across full-stack development, cloud architecture, backend systems, and DevOps.",
    biography: [
      "Joshua Mendoza co-founded Vortex Digital after working as a Senior Software Engineer and Technical Lead.",
      "Current work is technical architecture and engineering execution, development-team management, cloud infrastructure and DevOps, code-quality review, and technical decisions with the CEO.",
    ],
    responsibilities: [
      { title: "Technical architecture", detail: "Lead technical architecture for the engineering work." },
      { title: "Engineering execution", detail: "Lead how the engineering work gets done." },
      { title: "Development teams", detail: "Manage the development teams." },
      { title: "Cloud and DevOps", detail: "Oversee cloud infrastructure and DevOps." },
      { title: "Code quality", detail: "Review code quality and decide technical questions with the CEO." },
    ],
    expertise: [
      { title: "Full-stack development", detail: "Full-stack development." },
      { title: "Cloud architecture", detail: "Cloud architecture." },
      { title: "Backend systems", detail: "Backend systems." },
      { title: "DevOps", detail: "DevOps and cloud infrastructure." },
      { title: "Engineering leadership", detail: "Engineering leadership and team management." },
    ],
    experience: "10 years in software engineering",
    startupSupport: "Startup products get a technical architecture and an engineering plan from Joshua, including cloud infrastructure, DevOps, and code review.",
    related: [
      { slug: "founder-ceo", note: "Connects technical options to the business decision and the client promise." },
      { slug: "senior-fullstack-developer", note: "Turns the architecture into working application code." },
      { slug: "qa-devops-engineer", note: "Connects the technical plan to testing and a repeatable release." },
    ],
    portrait: portrait("cofounder-cto", "Joshua Mendoza", "Co-Founder & CTO"),
    workImages: scenes("cofounder-cto"),
    projectIds: [],
    isPublished: true,
  },
  {
    id: "member-03",
    slug: "cfo",
    name: "Lin Jiayi",
    role: "CFO",
    intro: "CFO with 8 years in corporate finance, covering financial planning, budgeting, and business operations.",
    biography: [
      "Lin Jiayi joined Vortex Digital after working as a Financial Analyst and Finance Manager.",
      "Current work is financial planning and budgeting, cash flow, project profitability, financial reports, and growth and financial decisions with the CEO.",
    ],
    responsibilities: [
      { title: "Financial planning", detail: "Oversee financial planning for the company." },
      { title: "Budgeting", detail: "Manage budgeting." },
      { title: "Cash flow", detail: "Manage cash flow." },
      { title: "Project profitability", detail: "Monitor project profitability." },
      { title: "Financial reports", detail: "Prepare financial reports and work with the CEO on growth and financial decisions." },
    ],
    expertise: [
      { title: "Corporate finance", detail: "Corporate finance." },
      { title: "Financial planning", detail: "Financial planning." },
      { title: "Budgeting", detail: "Budgeting." },
      { title: "Cash flow management", detail: "Cash flow management." },
      { title: "Project profitability", detail: "Project profitability." },
    ],
    experience: "8 years in corporate finance",
    startupSupport: "Startup engagements get a financial plan, a budget, and a view of project profitability from Lin, shared with the CEO when a growth decision has a cost.",
    related: [
      { slug: "founder-ceo", note: "Uses the financial picture when deciding what the company should commit to." },
      { slug: "project-manager", note: "Needs the cost effect of a schedule or scope change while it is still negotiable." },
      { slug: "cofounder-cto", note: "Surfaces the cost of a technical option before it becomes the plan." },
    ],
    portrait: portrait("cfo", "Lin Jiayi", "CFO"),
    workImages: scenes("cfo"),
    projectIds: [],
    isPublished: true,
  },
  {
    id: "member-04",
    slug: "project-manager",
    name: "Pongsak Rattanakul",
    role: "Project Manager",
    intro: "Project manager with 8+ years leading cross-functional software and product teams through Agile delivery.",
    biography: [
      "Pongsak Rattanakul has worked as a Project Manager and Senior Project Manager on cross-functional software and product teams, and has also held Project Manager and Scrum Master roles at Vortex Digital.",
      "That background covers Agile delivery of web and mobile applications, using Scrum, Kanban, and hybrid approaches. Current work at the company is Agile planning, stakeholder coordination, risk mitigation, and team delivery, including sprint planning.",
    ],
    responsibilities: [
      { title: "Agile planning", detail: "Plan delivery with the engineering, product, and business people on the work, including sprint planning." },
      { title: "Stakeholder coordination", detail: "Coordinate stakeholders across those groups." },
      { title: "Risk mitigation", detail: "Surface delivery risk while the plan can still change." },
      { title: "Team delivery", detail: "Keep the team on the delivery that was agreed." },
    ],
    expertise: [
      { title: "Project management", detail: "Project management for software and product teams." },
      { title: "Agile", detail: "Agile delivery." },
      { title: "Scrum", detail: "Scrum." },
      { title: "Kanban", detail: "Kanban." },
      { title: "Sprint planning", detail: "Sprint planning." },
      { title: "Stakeholder coordination", detail: "Stakeholder coordination." },
      { title: "Risk mitigation", detail: "Risk mitigation." },
    ],
    experience: "8+ years in project management",
    startupSupport: "Startup delivery stays coordinated through Pongsak: Agile planning, the stakeholder conversation, and the risks that would move the release.",
    related: [
      { slug: "founder-ceo", note: "Sets the engagement this role is coordinating." },
      { slug: "uiux-product-designer", note: "Needs a decision on flows before engineering builds the wrong screen." },
      { slug: "qa-devops-engineer", note: "Needs testing and release time inside the plan, not after it." },
    ],
    portrait: portrait("project-manager", "Pongsak Rattanakul", "Project Manager"),
    workImages: scenes("project-manager"),
    projectIds: [],
    isPublished: true,
  },
  {
    id: "member-05",
    slug: "senior-fullstack-developer",
    name: "Dmytro Melnyk",
    role: "Senior Full-Stack Developer",
    intro: "Senior full-stack developer with 15+ years building web applications, internet services, and e-commerce platforms.",
    biography: [
      "Dmytro Melnyk specializes in Magento 2 and Adobe Commerce, including Open Source, Enterprise, and headless Magento, with PHP, TypeScript, Next.js, Node.js, GraphQL, BFF, MySQL, and API integrations. Previous roles include Senior Software Developer and Engineering Competence Lead, with work on Magento upgrades, security patches, headless commerce, Magento Cloud, Google Cloud, and Vercel.",
      "Current work is full-stack web applications, Magento and headless commerce implementations, API integrations, code review, performance and security, and mentoring junior developers.",
    ],
    responsibilities: [
      { title: "Full-stack applications", detail: "Design and develop full-stack web applications." },
      { title: "Commerce implementations", detail: "Lead Magento and headless commerce implementations." },
      { title: "API integrations", detail: "Build API integrations." },
      { title: "Review and hardening", detail: "Review code and improve performance and security." },
      { title: "Mentoring", detail: "Mentor junior developers." },
    ],
    expertise: [
      { title: "Magento 2", detail: "Magento 2, Open Source and Enterprise." },
      { title: "Adobe Commerce", detail: "Adobe Commerce." },
      { title: "Headless commerce", detail: "Headless Magento and headless commerce." },
      { title: "PHP", detail: "PHP." },
      { title: "TypeScript", detail: "TypeScript." },
      { title: "Next.js", detail: "Next.js." },
      { title: "Node.js", detail: "Node.js." },
      { title: "GraphQL", detail: "GraphQL." },
      { title: "BFF", detail: "Backend-for-frontend work." },
      { title: "MySQL", detail: "MySQL." },
      { title: "API integrations", detail: "API integrations." },
    ],
    experience: "15+ years in web software development",
    startupSupport: "Startup web products can draw on Dmytro for the application itself, including commerce platforms, APIs, and the review of performance and security.",
    related: [
      { slug: "cofounder-cto", note: "Sets the architecture this implementation has to respect." },
      { slug: "uiux-product-designer", note: "Provides the flows and interface this role builds." },
      { slug: "qa-devops-engineer", note: "Checks the paths this role ships and the way they are released." },
    ],
    portrait: portrait("senior-fullstack-developer", "Dmytro Melnyk", "Senior Full-Stack Developer"),
    workImages: scenes("senior-fullstack-developer"),
    projectIds: [],
    isPublished: true,
  },
  {
    id: "member-06",
    slug: "ai-engineer",
    name: "Carlo Garcia",
    role: "AI Engineer",
    intro: "AI engineer with 9 years in software engineering, including 4 years in AI and machine learning.",
    biography: [
      "Carlo Garcia previously worked as a Python Developer and Machine Learning Engineer, building AI-powered applications and intelligent automation tools. The confirmed toolkit is Python, PyTorch, LangChain, LLM integration, RAG systems, vector databases, and AI agents.",
      "Current work is AI-powered applications, LLM integrations and RAG pipelines, AI agents, vector databases, model performance, and deployment of those features into production with backend engineers.",
    ],
    responsibilities: [
      { title: "AI applications", detail: "Design and develop AI-powered applications." },
      { title: "LLM and RAG", detail: "Build LLM integrations and RAG pipelines." },
      { title: "AI agents", detail: "Implement AI agents." },
      { title: "Vector databases", detail: "Work with vector databases and model performance." },
      { title: "Production deployment", detail: "Deploy AI features into production with backend engineers." },
    ],
    expertise: [
      { title: "Python", detail: "Python." },
      { title: "PyTorch", detail: "PyTorch." },
      { title: "LangChain", detail: "LangChain." },
      { title: "LLMs", detail: "LLM integration." },
      { title: "RAG", detail: "RAG systems and pipelines." },
      { title: "Vector databases", detail: "Vector databases." },
      { title: "AI agents", detail: "AI agents." },
    ],
    experience: "9 years in software engineering, including 4 years in AI and machine learning",
    startupSupport: "Startup products that need an AI feature get the application, the retrieval pipeline, and the production handoff from Carlo.",
    related: [
      { slug: "cofounder-cto", note: "Decides where an AI feature sits in the system and what it is allowed to touch." },
      { slug: "senior-fullstack-developer", note: "Builds the application surface and API the feature has to live inside." },
      { slug: "qa-devops-engineer", note: "Needs a way to test model-backed behavior before release." },
    ],
    portrait: portrait("ai-engineer", "Carlo Garcia", "AI Engineer"),
    workImages: scenes("ai-engineer"),
    projectIds: [],
    isPublished: true,
  },
  {
    id: "member-07",
    slug: "mobile-app-developer",
    name: "Matheus Pereira",
    role: "Mobile App Developer",
    intro: "Mobile app developer with 8 years in iOS and Android, including Flutter, native platforms, and API integration.",
    biography: [
      "Matheus Pereira previously worked as a Mobile Developer and Senior Mobile Engineer, building consumer apps and SaaS mobile products. The confirmed toolkit is Flutter, Dart, Swift, Kotlin, Firebase, REST APIs, and mobile performance work.",
      "Current work is cross-platform Flutter apps, native iOS and Android features, API and Firebase integration, performance, bug fixes, and production-ready apps with designers and backend developers.",
    ],
    responsibilities: [
      { title: "Flutter apps", detail: "Design and develop cross-platform Flutter apps." },
      { title: "Native features", detail: "Build native iOS and Android features." },
      { title: "APIs and Firebase", detail: "Integrate APIs and Firebase services." },
      { title: "Performance", detail: "Improve performance and fix bugs." },
      { title: "Production apps", detail: "Work with designers and backend developers on production-ready apps." },
    ],
    expertise: [
      { title: "Flutter", detail: "Flutter." },
      { title: "Dart", detail: "Dart." },
      { title: "Swift", detail: "Swift." },
      { title: "Kotlin", detail: "Kotlin." },
      { title: "Firebase", detail: "Firebase." },
      { title: "REST APIs", detail: "REST APIs." },
      { title: "Mobile performance", detail: "Mobile app performance." },
    ],
    experience: "8 years in iOS and Android development",
    startupSupport: "Startup mobile products get Flutter and native iOS and Android work from Matheus, including the APIs and Firebase services those apps call.",
    related: [
      { slug: "uiux-product-designer", note: "Designs the mobile flows this role implements." },
      { slug: "senior-fullstack-developer", note: "Often owns the API and data the app calls." },
      { slug: "qa-devops-engineer", note: "Covers the test and release path for the builds this role produces." },
    ],
    portrait: portrait("mobile-app-developer", "Matheus Pereira", "Mobile App Developer"),
    workImages: scenes("mobile-app-developer"),
    projectIds: [],
    isPublished: true,
  },
  {
    id: "member-08",
    slug: "uiux-product-designer",
    name: "Adrian Cruz",
    role: "UI/UX & Product Designer",
    intro: "UX research and human factors for Vortex Digital, including usability studies and interface evaluation. A year count was not supplied.",
    biography: [
      "Adrian Cruz conducts user research, plans and runs usability studies, evaluates product interfaces, and turns those findings into design improvements with designers, developers, and product managers.",
      "The agency has not established whether this work is exclusive or full-time. This profile describes the confirmed Vortex Digital responsibilities only.",
    ],
    responsibilities: [
      { title: "User research", detail: "Conduct user research on Vortex Digital UI/UX and product design projects." },
      { title: "Usability studies", detail: "Plan and run usability studies." },
      { title: "Interface evaluation", detail: "Evaluate product interfaces." },
      { title: "Design improvements", detail: "Translate findings into design improvements." },
      { title: "Cross-functional work", detail: "Collaborate with designers, developers, and product managers." },
    ],
    expertise: [
      { title: "UX research", detail: "UX research." },
      { title: "Usability studies", detail: "Usability studies." },
      { title: "Human factors", detail: "Human factors." },
      { title: "Human-centered product design", detail: "Human-centered product design." },
      { title: "Interface evaluation", detail: "Interface evaluation." },
    ],
    experience: "Experience in UX research and human factors; years not specified",
    externalExperience: [
      "Human Factors Engineer at Cepheid since May 2023, focused on UX and human factors for medical diagnostic products. That role is not Vortex Digital work.",
      "Earlier, UX Lab Assistant at UEGroup, moderating in-person usability sessions and refining testing protocols and study environments, and Lead Vision Lab Coordinator at San José State University, supporting visual psychology experiments, data analysis, and assistant training.",
      "MS in Human Factors and Ergonomics, San José State University. BA in Psychology, California State University, Fullerton.",
    ],
    startupSupport: "Startup product work can include Adrian for research, usability studies, and the design changes that follow from those findings.",
    related: [
      { slug: "founder-ceo", note: "Confirms that the designed task matches the product the client asked for." },
      { slug: "senior-fullstack-developer", note: "Implements the interface and needs states the design has already considered." },
      { slug: "mobile-app-developer", note: "Needs mobile-specific flows when the product is an app." },
    ],
    portrait: portrait("uiux-product-designer", "Adrian Cruz", "UI/UX & Product Designer"),
    workImages: scenes("uiux-product-designer"),
    projectIds: [],
    isPublished: true,
  },
  {
    id: "member-09",
    slug: "qa-devops-engineer",
    name: "Sofia Vasylivna Melnyk",
    role: "QA & DevOps Engineer",
    intro: "QA and DevOps engineer with 7 years across manual testing, automation, CI/CD, and deployment monitoring.",
    biography: [
      "Sofia Vasylivna Melnyk previously worked as a QA Engineer and DevOps Engineer on web, mobile, and SaaS projects. The confirmed toolkit is manual and automated testing, Playwright, Selenium, Docker, CI/CD pipelines, GitHub Actions, AWS, and deployment monitoring.",
      "Current work is test planning and execution, Playwright and Selenium suites, CI/CD pipelines, Docker-based environments, deployment monitoring, production issues, and reliability work with developers.",
    ],
    responsibilities: [
      { title: "Testing", detail: "Plan and execute manual and automated tests." },
      { title: "Automation suites", detail: "Build Playwright and Selenium suites." },
      { title: "CI/CD", detail: "Maintain CI/CD pipelines." },
      { title: "Docker environments", detail: "Manage Docker-based environments." },
      { title: "Deployments", detail: "Monitor deployments, investigate production issues, and work with developers on reliability." },
    ],
    expertise: [
      { title: "Manual QA", detail: "Manual testing." },
      { title: "Test automation", detail: "Automated testing." },
      { title: "Playwright", detail: "Playwright." },
      { title: "Selenium", detail: "Selenium." },
      { title: "Docker", detail: "Docker." },
      { title: "CI/CD", detail: "CI/CD pipelines." },
      { title: "GitHub Actions", detail: "GitHub Actions." },
      { title: "AWS", detail: "AWS." },
      { title: "Deployment monitoring", detail: "Deployment monitoring." },
    ],
    experience: "7 years in software QA and DevOps",
    startupSupport: "Startup releases get test planning, automation, and the deployment path from Sofia, including the pipelines and environments that path uses.",
    related: [
      { slug: "cofounder-cto", note: "Sets the technical bar a release has to meet." },
      { slug: "senior-fullstack-developer", note: "Produces the changes this role tests and ships." },
      { slug: "project-manager", note: "Needs test and release time visible in the schedule." },
    ],
    portrait: portrait("qa-devops-engineer", "Sofia Vasylivna Melnyk", "QA & DevOps Engineer"),
    workImages: scenes("qa-devops-engineer"),
    projectIds: [],
    isPublished: true,
  },
];

export function publicName(member: TeamMember): string | null {
  const name = member.name?.trim();
  return name ? name : null;
}

export function getMember(slug: string): TeamMember | undefined {
  return team.find((member) => member.slug === slug);
}

export function adjacentMembers(slug: string): { previous: TeamMember; next: TeamMember } {
  const index = team.findIndex((member) => member.slug === slug);
  const previous = team[(index - 1 + team.length) % team.length];
  const next = team[(index + 1) % team.length];
  return { previous, next };
}

export const teamAssetCount = team.reduce((total, member) => total + 1 + member.workImages.length, 0);

if (team.length !== 9) {
  throw new Error(`Expected 9 roles, found ${team.length}`);
}

if (teamAssetCount !== manifest.totalImages) {
  throw new Error(`Expected ${manifest.totalImages} team images, found ${teamAssetCount}`);
}

for (const member of team) {
  if (member.responsibilities.length < 4 || member.expertise.length < 3 || member.related.length < 2) {
    throw new Error(`Incomplete role content for ${member.slug}`);
  }
  for (const related of member.related) {
    if (!team.some((entry) => entry.slug === related.slug)) {
      throw new Error(`${member.slug} links to an unknown role: ${related.slug}`);
    }
  }
}

export function workScene(slug: string, index: 0 | 1) {
  const member = getMember(slug);
  const image = member?.workImages[index];
  if (!member || !image) throw new Error(`Missing collaboration image for ${slug}`);
  return { ...image, role: member.role, slug: member.slug };
}
