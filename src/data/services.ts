import type { IconName } from "./icons";
import { technologyGroups } from "./technologies";

export type VisualVariant = "prism" | "orbit" | "grid" | "wave" | "signal" | "layers";

export interface ServicePoint {
  title: string;
  text: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface Service {
  slug: string;
  /** Public specialty name. */
  title: string;
  summary: string;
  metaDescription: string;
  icon: IconName;
  visual: VisualVariant;
  featured: boolean;
  hero: string;
  tags: string[];
  /** What an engagement of this type can cover. Not a list of completed projects. */
  applicationsIntro: string;
  applications: ServicePoint[];
  challengesIntro: string;
  challenges: ServicePoint[];
  approachIntro: string;
  approach: ServicePoint[];
  capabilities: ServicePoint[];
  deliverables: string[];
  /** Labels from the working technology catalog. Not certifications. */
  technologyGroups: string[];
  technologyNote: string;
  faqs: ServiceFaq[];
  related: string[];
  cta: string;
}

const technologyNote =
  "Names below come from the working catalog in the site configuration. A project may use some of them, or a different set, once the product is known. Listing a tool is not a certification, a vendor partnership, or a promise that every engagement includes it.";

export const services: Service[] = [
  {
    slug: "web-application-development",
    title: "Web Development",
    summary: "Custom web applications with accounts, APIs, and a frontend people can actually finish a task in.",
    metaDescription:
      "Web application development for startups: custom interfaces, accounts, API integration, and maintainable full-stack architecture from Vortex Digital.",
    icon: "code",
    visual: "grid",
    featured: true,
    hero: "A startup web product is the application people log into, not a brochure. Vortex Digital designs and builds that software: the screens, the rules behind them, and the connections to the data and services the product depends on.",
    tags: ["Custom applications", "Accounts", "API integration", "Maintainable frontend"],
    applicationsIntro:
      "The work is application software. A marketing page can sit beside it, but it is not a substitute for the product.",
    applications: [
      {
        title: "Custom web applications",
        text: "Tools a founder can put in front of users: the workflows, forms, and views that carry the actual job of the product.",
      },
      {
        title: "Responsive interfaces",
        text: "Layouts that stay usable from a phone to a desktop without a separate product for each width.",
      },
      {
        title: "Accounts and permissions",
        text: "Sign-in, roles, and the difference between what one user can see and what an operator can change.",
      },
      {
        title: "Database-backed features",
        text: "Records the product has to remember: orders, projects, documents, or whatever the domain actually stores.",
      },
    ],
    challengesIntro: "These are ordinary pressures on a first web product. They are not a claim that we have already solved them for a named client.",
    challenges: [
      {
        title: "The idea is still a deck",
        text: "Screens get designed before anyone has named the tasks. We start from the jobs the application must support, then choose the interface.",
      },
      {
        title: "The frontend invents the rules",
        text: "When every screen calculates the business logic itself, the product disagrees with itself. The rules belong in one place the API can enforce.",
      },
      {
        title: "The first version cannot be changed",
        text: "A demo that only its author understands stalls the next release. Structure, names, and a short handover are part of the build.",
      },
      {
        title: "It feels slow where people wait",
        text: "Performance work starts with the screens and requests people actually hit, not with a generic score.",
      },
    ],
    approachIntro: "The sequence is planning, a thin architecture, implementation, integration, and a build the next developer can read.",
    approach: [
      {
        title: "Planning",
        text: "Write down the first release: who uses it, what they must be able to finish, and what waits.",
      },
      {
        title: "Architecture",
        text: "Separate the interface, the API, and the data. Decide authentication and the main entities before feature work spreads.",
      },
      {
        title: "Development",
        text: "Build the smallest path that proves the product, with review so the codebase stays legible.",
      },
      {
        title: "Integration",
        text: "Connect the third-party services the product truly needs, and make a failed call visible.",
      },
      {
        title: "Testing and handover",
        text: "Check the critical paths, including the unhappy ones, and leave notes another engineer can follow.",
      },
    ],
    capabilities: [
      {
        title: "Full-stack application structure",
        text: "A web client and a backend that share one definition of the product. The browser does not become the only place the rules exist.",
      },
      {
        title: "Authentication and user accounts",
        text: "Sign-up, sign-in, and session handling matched to the product. Roles are explicit when more than one kind of user exists.",
      },
      {
        title: "API integration",
        text: "Payments, email, files, or internal systems, connected where the workflow needs them. Each integration has a defined failure mode.",
      },
      {
        title: "Data-backed product features",
        text: "Models and queries for the records the application has to keep. Migrations are part of the change, not an afterthought.",
      },
      {
        title: "Interface performance",
        text: "Attention on the views people wait on: payload, rendering, and the requests those views make.",
      },
      {
        title: "A codebase that can take the next change",
        text: "Boundaries and names chosen so a later feature does not require archaeology. Handover notes travel with the repository.",
      },
    ],
    deliverables: [
      "A written slice for the first release",
      "The web application agreed in that slice",
      "Account and permission behavior, when accounts are in scope",
      "Integrations named in the proposal",
      "Notes another developer can use to run and change the app",
    ],
    technologyGroups: ["Frontend", "Backend", "Data"],
    technologyNote,
    faqs: [
      {
        question: "Is this landing-page design?",
        answer:
          "No. This service is for web applications: software with accounts, data, and tasks. A simple marketing site is a different, smaller piece of work and is not what this page describes.",
      },
      {
        question: "Can you work with an existing codebase?",
        answer:
          "Yes, after a look at the repository and how it is deployed. The recommendation may be to extend it, stabilize a part of it, or replace one boundary. That choice comes after the review, not before.",
      },
      {
        question: "How is an MVP scoped?",
        answer:
          "We name the tasks the first release must support and the ones that can wait. The proposal records that cut. This page does not set a price or a calendar.",
      },
      {
        question: "Who owns the code?",
        answer:
          "Ownership, repositories, and licensing belong in the contract. The website does not transfer intellectual property by itself.",
      },
      {
        question: "What does handover include?",
        answer:
          "How to run the application, where the main boundaries are, and which checks matter before a release. Ongoing support, if any, is a separate agreement.",
      },
    ],
    related: ["backend-api-engineering", "ui-ux-product-design", "cloud-devops"],
    cta: "Discuss Your Web Application",
  },
  {
    slug: "mobile-app-development",
    title: "Mobile Apps",
    summary: "iOS, Android, and cross-platform applications, with the API and account flows the product needs.",
    metaDescription:
      "Mobile app development for startups: iOS, Android, and cross-platform options, API integration, and device testing from Vortex Digital.",
    icon: "smartphone",
    visual: "orbit",
    featured: true,
    hero: "A mobile product has to earn its place on a phone: a task people repeat, an account that stays signed in, and an API that tells the truth. Vortex Digital helps startups choose a mobile path and build the application that path implies.",
    tags: ["iOS", "Android", "Cross-platform", "API-backed"],
    applicationsIntro: "The choice of native or cross-platform follows the product. This page describes the kinds of applications that choice can produce. It does not claim store releases.",
    applications: [
      {
        title: "iOS and Android applications",
        text: "Native builds when the product depends on platform behavior, performance, or a store-specific release process.",
      },
      {
        title: "Cross-platform applications",
        text: "One shared client when the product is mostly the same on both platforms and the team wants a single codebase.",
      },
      {
        title: "Account-backed mobile clients",
        text: "Sign-in, session refresh, and the same permissions the rest of the product already uses.",
      },
      {
        title: "Apps that talk to an API",
        text: "The phone is a client. Business rules stay on the server unless there is a clear reason to do otherwise.",
      },
    ],
    challengesIntro: "Mobile work fails in predictable ways. Naming them early is more useful than promising a store feature.",
    challenges: [
      {
        title: "Two platforms, two definitions of the app",
        text: "iOS and Android drift when nobody writes down the shared behavior. We keep one description of the tasks, then implement it per platform.",
      },
      {
        title: "The client outruns the API",
        text: "Screens that assume data the backend does not have yet create a demo that cannot ship. The contract comes first.",
      },
      {
        title: "Device differences show up late",
        text: "A layout that works on one phone fails on another size, a notch, or a slow network. Testing has to include those cases.",
      },
      {
        title: "Store release is treated as an afternoon",
        text: "Signing, listings, and review are their own work. We plan them only when a store release is actually in scope. Nothing here is a claim that an app is already listed.",
      },
    ],
    approachIntro: "We pick the platform strategy from constraints, then design the client, the API boundary, and the checks on real device classes.",
    approach: [
      {
        title: "Planning",
        text: "Decide native or cross-platform from the product, the devices, and what has to ship first.",
      },
      {
        title: "Mobile interface",
        text: "Flows for thumbs, interruption, and the few tasks the app exists to complete.",
      },
      {
        title: "Integration",
        text: "Authentication, API calls, and device capabilities such as camera, files, or notifications only when the product uses them.",
      },
      {
        title: "Testing",
        text: "Pass the critical paths on more than one screen size and on a slow connection, not only on the newest phone.",
      },
      {
        title: "Handover",
        text: "Document how a build is produced. Store submission steps are included only if that release is in the agreement.",
      },
    ],
    capabilities: [
      {
        title: "Platform strategy",
        text: "A written reason for native, cross-platform, or a split. The decision is revisited if the constraints change, not defended out of habit.",
      },
      {
        title: "Mobile UI and interaction",
        text: "Screens designed for the task and the device, with states for loading, empty data, and errors.",
      },
      {
        title: "Authentication",
        text: "Sign-in that survives an app restart, with a clear sign-out and a path when the session expires.",
      },
      {
        title: "API integration",
        text: "A client that follows the backend contract, including pagination, validation errors, and offline behavior only if the product needs it.",
      },
      {
        title: "Notifications and device features",
        text: "Push notifications, camera, location, or files when they serve a named task. They are not added as a checklist.",
      },
      {
        title: "Screen-size testing",
        text: "Checks across the device classes in scope, so a layout bug is found before a user finds it.",
      },
    ],
    deliverables: [
      "A platform recommendation and the reasons for it",
      "The mobile application for the agreed platforms",
      "API and account integration in scope",
      "Test notes for the device classes that were checked",
      "Build instructions, plus store-release notes only when a store release is in scope",
    ],
    technologyGroups: ["Mobile", "Backend"],
    technologyNote,
    faqs: [
      {
        question: "Do you publish apps to the App Store or Google Play?",
        answer:
          "A store release can be part of a proposal. This website does not claim that any app has already been published, and a store's review process is outside our control.",
      },
      {
        question: "Should we start native or cross-platform?",
        answer:
          "It depends on shared UI, device APIs, team skills, and how different the two platforms need to be. We make that call in planning and write the reason down.",
      },
      {
        question: "Can the app use our existing API?",
        answer:
          "Yes, if the API already supports the mobile tasks, or if changing it is in scope. We read the contract before designing screens that the server cannot feed.",
      },
      {
        question: "How do you handle push notifications?",
        answer:
          "Only when a workflow needs them. Setup includes the platform services, permission prompts, and what happens when a user declines. It is not assumed for every app.",
      },
      {
        question: "What is tested?",
        answer:
          "The critical flows on the screen sizes and platforms in the agreement, including poor network conditions when that matters. A test pass is not a promise of zero defects.",
      },
    ],
    related: ["ui-ux-product-design", "backend-api-engineering", "qa-software-testing"],
    cta: "Discuss Your Mobile App",
  },
  {
    slug: "ai-intelligent-automation",
    title: "AI Solutions",
    summary: "AI features inside a product: assistants, retrieval, and workflows with human review and clear limits.",
    metaDescription:
      "AI product engineering for startups: LLM integration, retrieval, workflow automation, evaluation, and human oversight from Vortex Digital.",
    icon: "bot",
    visual: "signal",
    featured: true,
    hero: "An AI feature is useful when it takes a real task off someone's plate and fails in a way a person can see. Vortex Digital helps startups add assistants, retrieval, and workflow automation inside a product, with limits, review, and an honest account of cost.",
    tags: ["LLM integration", "Retrieval", "Human review", "Usage cost"],
    applicationsIntro:
      "These are kinds of features a product can include. They are design options, not measured results, and not a claim of an autonomous system.",
    applications: [
      {
        title: "Assistants inside the product",
        text: "A chat or command surface that answers from approved sources and hands off when it should not decide.",
      },
      {
        title: "Retrieval over your content",
        text: "Search that pulls from documents or records you control, then asks a model to answer from that material.",
      },
      {
        title: "Workflow assistance",
        text: "Sorting, drafting, or extracting fields where a person still confirms the result before it changes the system of record.",
      },
      {
        title: "Document handling",
        text: "Reading uploads to suggest structure or summaries. The original file remains available, and a wrong extraction can be corrected.",
      },
    ],
    challengesIntro: "Model demos hide the product problems. The work is those problems.",
    challenges: [
      {
        title: "A demo with no source of truth",
        text: "A chat window that invents answers is not a feature. Retrieval, citations, and a refusal path come before the interface polish.",
      },
      {
        title: "Nobody can tell a bad answer from a good one",
        text: "Evaluation needs sample tasks and a person who knows the domain. We do not publish accuracy percentages the project has not measured.",
      },
      {
        title: "Customer data leaves the product by accident",
        text: "Prompts, logs, and vendor retention have to be chosen on purpose. Privacy is a design constraint, not a footer.",
      },
      {
        title: "The bill arrives after the demo",
        text: "Tokens, vector storage, and retries cost money. A proposal should say what drives usage, not pretend the feature is free to run.",
      },
    ],
    approachIntro: "Start with the task and the source material. Add a model only where it changes that task, and keep a person in the loop where a mistake is expensive.",
    approach: [
      {
        title: "Task definition",
        text: "Name the job, the input, the allowed sources, and what the system must refuse.",
      },
      {
        title: "Architecture",
        text: "Decide what is retrieved, what is sent to a model, what is stored, and which vendor or hosting option fits the privacy constraint.",
      },
      {
        title: "Integration",
        text: "Put the feature in the existing application, with the same accounts and audit trail the rest of the product uses.",
      },
      {
        title: "Evaluation",
        text: "Review a set of real examples with someone who knows the right answer. Track failures. Do not treat a single demo as proof.",
      },
      {
        title: "Operations",
        text: "Log usage, cap runaway calls, and leave a path to disable the feature without taking down the product.",
      },
    ],
    capabilities: [
      {
        title: "LLM integration",
        text: "A model API behind an application boundary, with timeouts, retries, and a non-AI path when the provider fails.",
      },
      {
        title: "Retrieval-augmented generation",
        text: "Chunking, indexing, and answers grounded in content you select. The index is not a dump of every file the company owns unless that is an explicit choice.",
      },
      {
        title: "Intelligent search",
        text: "Query the product's own records with a mix of keywords and vectors when that improves finding, and show the source.",
      },
      {
        title: "Human oversight",
        text: "Confirm, edit, or reject model output before it becomes a permanent record. High-impact actions are not left to an unattended loop.",
      },
      {
        title: "Privacy and data handling",
        text: "What is sent, what is logged, and how long a vendor may retain it. The legal review of that choice still belongs to the company and its counsel.",
      },
      {
        title: "Cost visibility",
        text: "A rough model of what drives spend, and controls such as limits per user or per day. Not a guarantee of a future invoice.",
      },
    ],
    deliverables: [
      "A written task for the AI feature, including what it must not do",
      "The integration agreed in the proposal",
      "A retrieval or workflow design when that is the approach",
      "A small evaluation set and a way to review failures",
      "Notes on data sent to vendors and what drives usage cost",
    ],
    technologyGroups: ["AI", "Backend", "Data"],
    technologyNote,
    faqs: [
      {
        question: "Will the system be correct on its own?",
        answer:
          "No. Models make mistakes. We design for review, refusal, and a record of failures. We do not promise an error-free or fully autonomous system, and we do not invent accuracy figures.",
      },
      {
        question: "Can you add AI to software we already have?",
        answer:
          "Often, if there is a clear task and source material. We look at the product and the data first. A chatbot pasted on the side of an app is not the default recommendation.",
      },
      {
        question: "How should we think about privacy?",
        answer:
          "Decide which data may leave your systems, what the model vendor stores, and who can see prompts and outputs. We can implement that decision. Counsel should review it.",
      },
      {
        question: "What does an AI feature cost to run?",
        answer:
          "It depends on volume, model choice, and how much text you retrieve. We can estimate the drivers during planning. The website cannot quote a bill.",
      },
      {
        question: "Do you train a private model?",
        answer:
          "Most startup products need integration and retrieval, not a model trained from scratch. Training is a different project and is not assumed here.",
      },
    ],
    related: ["backend-api-engineering", "web-application-development", "saas-platform-development"],
    cta: "Discuss an AI Feature",
  },
  {
    slug: "saas-platform-development",
    title: "SaaS Development",
    summary: "Multi-user products with accounts, roles, tenant boundaries, and room for billing when you are ready.",
    metaDescription:
      "SaaS development for startups: MVP planning, multi-tenant architecture, roles, billing concepts, and maintainable product structure from Vortex Digital.",
    icon: "blocks",
    visual: "layers",
    featured: true,
    hero: "A SaaS product is a system that can serve more than one customer without mixing their data. Vortex Digital helps startups plan that structure early enough that the second customer does not force a rewrite.",
    tags: ["Multi-tenant", "Roles", "MVP scope", "Billing hooks"],
    applicationsIntro:
      "These are architectural shapes a proposal can include. Mentioning billing or tenancy is not a claim that a specific platform already exists.",
    applications: [
      {
        title: "A first multi-user release",
        text: "The smallest product that lets more than one person sign in and do the core job, with a path to the next slice.",
      },
      {
        title: "Tenant separation",
        text: "A decision about what is shared and what belongs to one customer, written down before features assume the wrong model.",
      },
      {
        title: "Role-based access",
        text: "Owners, members, and admins, or whatever roles the product actually has, enforced on the server.",
      },
      {
        title: "Operational views",
        text: "Dashboards for the people running the product: status, records, and the actions they are allowed to take.",
      },
    ],
    challengesIntro: "SaaS complexity usually arrives as the second customer, the first invoice, or the first permission bug.",
    challenges: [
      {
        title: "It works for one customer",
        text: "Data and configuration sit in places that cannot be separated later. We name the tenancy model before those shortcuts spread.",
      },
      {
        title: "Billing is glued on at the end",
        text: "Subscriptions touch identity, plans, and what a lapsed account can still do. The workflow is designed even when the provider is chosen later.",
      },
      {
        title: "Every user is an admin",
        text: "Missing roles become a security problem the week a customer invites a colleague. Permissions are part of the first release when invites exist.",
      },
      {
        title: "The MVP is either a sketch or a platform",
        text: "We cut scope to a releasable product and keep the boundaries that would be expensive to add later. We do not pretend both extremes are the same project.",
      },
    ],
    approachIntro: "Plan the tenant and account model, build a narrow product on that model, and leave billing and scale as explicit decisions rather than surprises.",
    approach: [
      {
        title: "MVP planning",
        text: "List the jobs the first tenants must complete. Park the rest where it will not distort the data model.",
      },
      {
        title: "Architecture",
        text: "Choose how a customer's data is isolated, how users belong to an account, and which settings are global.",
      },
      {
        title: "Development",
        text: "Implement the core loop, roles, and the admin views required to operate it.",
      },
      {
        title: "Billing integration",
        text: "When subscriptions are in scope, connect a provider and define what each plan unlocks. If they are not, leave a seam instead of a fake checkout.",
      },
      {
        title: "Maintainability",
        text: "Document the tenancy rules. They are the part future features will get wrong if they live only in someone's head.",
      },
    ],
    capabilities: [
      {
        title: "Multi-tenant architecture",
        text: "A concrete isolation approach for the product in front of us, explained so a founder can question it. Not a universal diagram sold as already built.",
      },
      {
        title: "Authentication and membership",
        text: "Users, invites, and the account they belong to. Session handling that matches the rest of the application.",
      },
      {
        title: "Role-based access",
        text: "Server-side checks for the actions each role may take, including the ones that look harmless in the interface.",
      },
      {
        title: "Subscription workflows",
        text: "Plan changes, failed payments, and access after a subscription lapses, when billing is part of the scope. The provider is chosen for the project.",
      },
      {
        title: "Product dashboards",
        text: "Views over the product's own data for customers or operators. Not a decorative analytics screenshot.",
      },
      {
        title: "Room to change the product",
        text: "Boundaries that let a later feature add a plan, a role, or a tenant setting without rewriting the core tables.",
      },
    ],
    deliverables: [
      "An MVP cut and a tenancy recommendation",
      "The application slice agreed in the proposal",
      "Account, invite, and role behavior in scope",
      "Billing integration only when it is in scope",
      "A short description of the tenancy rules for the next developer",
    ],
    technologyGroups: ["Frontend", "Backend", "Data", "Cloud"],
    technologyNote,
    faqs: [
      {
        question: "Do you build the whole platform at once?",
        answer:
          "No. We plan a first release that can serve real users, on a structure that will not collapse when a second customer arrives. Later slices are separate agreements.",
      },
      {
        question: "Can you add subscriptions?",
        answer:
          "Yes, when billing is in scope. We integrate a payment provider and define what each plan allows. This page is not a specific checkout that already exists.",
      },
      {
        question: "How do you keep customer data apart?",
        answer:
          "By choosing an isolation model during architecture and enforcing it in queries and authorization. The exact model depends on the product and is written into the design notes.",
      },
      {
        question: "We already have users on a single-tenant app. Can you help?",
        answer:
          "We can review the current model and propose a migration path. A rewrite is not the automatic answer.",
      },
      {
        question: "Will it scale?",
        answer:
          "We design for the load you can describe and leave seams for later. We do not promise a traffic number or an uptime figure on this website.",
      },
    ],
    related: ["backend-api-engineering", "web-application-development", "cloud-devops"],
    cta: "Discuss Your SaaS Product",
  },
  {
    slug: "backend-api-engineering",
    title: "Backend & APIs",
    summary: "APIs, data models, and integrations that keep the product's rules in one place.",
    metaDescription:
      "Backend and API engineering for startups: REST services, data models, auth, integrations, and documentation from Vortex Digital.",
    icon: "server",
    visual: "prism",
    featured: true,
    hero: "The backend is where a product decides what is true. Vortex Digital designs APIs, data models, and integrations so web and mobile clients stay thin and the behavior stays consistent.",
    tags: ["REST", "Data modeling", "Auth", "Integrations"],
    applicationsIntro: "These are the kinds of backend systems a startup product usually needs. The exact surface is scoped per project.",
    applications: [
      {
        title: "HTTP APIs",
        text: "REST-style resources for the clients you have, with validation errors a UI can show. GraphQL or another style only when it fits the product.",
      },
      {
        title: "Domain services",
        text: "The rules for creating, changing, and refusing records, close to the data rather than copied into every client.",
      },
      {
        title: "Integrations",
        text: "Third-party APIs for payment, email, files, or the internal system the product cannot avoid.",
      },
      {
        title: "Background work",
        text: "Jobs for anything that should not block a request: mail, imports, retries, and scheduled checks.",
      },
    ],
    challengesIntro: "Backend pain is usually inconsistency, quiet failure, or a schema nobody can explain.",
    challenges: [
      {
        title: "Each client has its own rules",
        text: "Web and mobile disagree about what is allowed. The API becomes the authority, and the clients follow it.",
      },
      {
        title: "The database cannot answer the product's questions",
        text: "Tables that mirror a demo screen do not survive the second feature. Modeling starts from the domain.",
      },
      {
        title: "Integrations fail silently",
        text: "A timeout that looks like success corrupts trust. Failures are logged and surfaced.",
      },
      {
        title: "Nobody can call the API without asking",
        text: "Contracts and examples are part of delivery, so the next client does not reverse-engineer behavior from trial and error.",
      },
    ],
    approachIntro: "Model the data, expose a small contract, validate inputs, and document the parts other people must call.",
    approach: [
      {
        title: "Planning",
        text: "List the operations clients need and the invariants that must always hold.",
      },
      {
        title: "Data modeling",
        text: "Schema, constraints, and a migration path. Write down what a record means.",
      },
      {
        title: "API design",
        text: "Resources, status codes, and error shapes. Authentication and authorization on every operation that needs them.",
      },
      {
        title: "Integration and jobs",
        text: "Outbound calls with timeouts and retries that are safe to repeat. Background work for the slow parts.",
      },
      {
        title: "Reliability notes",
        text: "What happens when a dependency is down, and which checks tell you the API is unhealthy.",
      },
    ],
    capabilities: [
      {
        title: "REST API design",
        text: "Resources and actions a client can call without guessing. Versioning or compatibility rules when more than one client exists.",
      },
      {
        title: "Authentication and authorization",
        text: "Who is calling, and whether that caller may touch this record. Checks live on the server.",
      },
      {
        title: "Database design",
        text: "Tables or documents that match the domain, with indexes for the queries the product actually runs.",
      },
      {
        title: "Input validation",
        text: "Reject bad payloads at the boundary and return an error the client can explain to a person.",
      },
      {
        title: "Third-party integrations",
        text: "Adapters around external APIs so a vendor change does not leak through the whole codebase.",
      },
      {
        title: "API documentation",
        text: "A contract the next developer can read: endpoints, auth, and example errors. Not a novel.",
      },
    ],
    deliverables: [
      "An API surface for the operations in scope",
      "Schema and migrations for that surface",
      "Auth rules for the roles in scope",
      "Integrations and jobs named in the proposal",
      "Contract notes for the teams calling the API",
    ],
    technologyGroups: ["Backend", "Data"],
    technologyNote,
    faqs: [
      {
        question: "Do you only build REST?",
        answer:
          "REST is the default when clients need a straightforward contract. Another style is a project decision, made because the product needs it, not because it is fashionable.",
      },
      {
        question: "Can you add an API in front of a system we already run?",
        answer:
          "Yes, if we can see how that system behaves and what must stay unchanged. The proposal says whether we wrap it, extend it, or replace a piece.",
      },
      {
        question: "How are breaking changes handled?",
        answer:
          "By naming the clients and agreeing how they move. A breaking change is a planned release, not a surprise in a Friday deploy.",
      },
      {
        question: "What does reliable mean here?",
        answer:
          "Failed dependencies are visible, unsafe retries are avoided, and someone can tell the API is unhealthy. It is not an uptime guarantee.",
      },
      {
        question: "Will you write the documentation?",
        answer:
          "Yes, for the contract in scope. Internal trivia that only the author needs does not count as documentation.",
      },
    ],
    related: ["web-application-development", "cloud-devops", "saas-platform-development"],
    cta: "Discuss Your API",
  },
  {
    slug: "cloud-devops",
    title: "Cloud & DevOps",
    summary: "Environments, pipelines, and a deployment path more than one person can run.",
    metaDescription:
      "Cloud and DevOps for startups: environments, CI/CD, deployment, monitoring, and backup practices from Vortex Digital. No uptime guarantee is stated.",
    icon: "cloud",
    visual: "wave",
    featured: true,
    hero: "Shipping software includes how it is built, deployed, and watched. Vortex Digital sets up the cloud path a startup can repeat, without pretending a pipeline is a 24-hour operations contract.",
    tags: ["CI/CD", "Environments", "Monitoring", "No uptime promise"],
    applicationsIntro: "The items below are practices a project can include. They are not a standing support agreement.",
    applications: [
      {
        title: "Cloud environments",
        text: "Separate places to develop, test, and run the product, with access written down.",
      },
      {
        title: "Delivery pipelines",
        text: "A build that runs the same way when someone else pushes, including the checks you choose to block on.",
      },
      {
        title: "Deployment automation",
        text: "A release that does not depend on one laptop or a list of manual clicks nobody wrote down.",
      },
      {
        title: "Runtime signals",
        text: "Logs and a small set of alerts for the failures that matter, not a wall of charts.",
      },
    ],
    challengesIntro: "The risky part is a release only one person knows how to perform, and silence when production is unhealthy.",
    challenges: [
      {
        title: "Production is a manual ritual",
        text: "If the deploy lives in someone's shell history, the company does not have a release process. We turn the ritual into steps a second person can run.",
      },
      {
        title: "Environments do not match",
        text: "Code that passes locally fails in production because configuration drifted. Environments are defined, not remembered.",
      },
      {
        title: "Nobody notices an outage except the user",
        text: "A few checks on the paths that matter are more useful than a dashboard nobody opens.",
      },
      {
        title: "Backups are assumed",
        text: "A backup that has never been restored is a hope. We include a restore note when backups are in scope, and we do not promise a recovery time on this website.",
      },
    ],
    approachIntro: "Automate the path you will use twice, keep secrets explicit, and watch the product rather than only the server.",
    approach: [
      {
        title: "Planning",
        text: "Name the provider options, the environments, and who is allowed to deploy. No provider badge is a partnership.",
      },
      {
        title: "Infrastructure as configuration",
        text: "Describe the pieces the app needs so they can be recreated. Hand-built consoles get written down or replaced.",
      },
      {
        title: "Pipeline",
        text: "Build, test, and deploy from the repository. Failed checks stop the release when that is the rule you want.",
      },
      {
        title: "Monitoring and logs",
        text: "Centralize logs and alert on a short list of symptoms. Tune it so the alerts are worth reading.",
      },
      {
        title: "Security basics",
        text: "Secrets out of the repository, least-privilege access, and encrypted transport. A full security audit is a different engagement.",
      },
    ],
    capabilities: [
      {
        title: "Cloud architecture",
        text: "The runtime shape for this product: compute, data stores, and how they reach each other. Chosen for the app you have, not a reference diagram from a vendor.",
      },
      {
        title: "CI/CD pipelines",
        text: "Automated build and release steps tied to the repository, with a record of what ran.",
      },
      {
        title: "Environment management",
        text: "Configuration per environment, so a test deploy cannot silently point at production data.",
      },
      {
        title: "Monitoring and logging",
        text: "Enough visibility to tell whether a release is healthy. Not a promise that someone is watching overnight.",
      },
      {
        title: "Backup approach",
        text: "What is backed up, where it goes, and how a restore would be attempted, when that work is in scope.",
      },
      {
        title: "Security practices",
        text: "Access control, secret handling, and dependency updates as ongoing habits. This is not a certification and not a 24/7 security operation.",
      },
    ],
    deliverables: [
      "Environment definitions for the stages in scope",
      "A pipeline the team can re-run",
      "Deployment notes a second person can follow",
      "Logging or alerts for the signals agreed in the proposal",
      "A backup and restore note only when backups are in scope",
    ],
    technologyGroups: ["Cloud", "Backend"],
    technologyNote:
      "Cloud and pipeline tools below are a working catalog, not a preferred-vendor badge and not a certification. The provider is chosen per project. This service does not include a 24/7 support contract or an uptime guarantee unless a separate agreement says so.",
    faqs: [
      {
        question: "Do you offer 24/7 incident response?",
        answer:
          "Not from this page. Ongoing coverage, response times, and on-call duty have to be a written agreement. Building a pipeline is not that agreement.",
      },
      {
        question: "Which cloud do you use?",
        answer:
          "The one that fits the product, the team's access, and the budget you can describe. Listing a provider in the catalog is not a partnership.",
      },
      {
        question: "Can you take over a deploy that only one person understands?",
        answer:
          "We can document it and, where it is safe, automate it. We need access and a window where a mistake can be undone.",
      },
      {
        question: "Will you guarantee uptime?",
        answer:
          "No. Uptime depends on architecture, providers, and an operations agreement. None of those is implied by a marketing page.",
      },
      {
        question: "What about backups?",
        answer:
          "When backups are in scope, we define what is copied and how a restore would be tried. A backup that has not been restored is reported that way, not as a finished safety net.",
      },
    ],
    related: ["backend-api-engineering", "qa-software-testing", "saas-platform-development"],
    cta: "Discuss Your Deployment",
  },
  {
    slug: "ui-ux-product-design",
    title: "UI/UX Design",
    summary: "Product design for software: journeys, prototypes, and interfaces engineering can build without guessing.",
    metaDescription:
      "UI/UX and product design for startups: journeys, wireframes, prototypes, design systems, accessibility, and developer handoff from Vortex Digital.",
    icon: "palette",
    visual: "orbit",
    featured: true,
    hero: "Design here is product work. Vortex Digital helps startups learn the task, structure the product, and hand engineering an interface a person can learn. Decoration without a job is not the point.",
    tags: ["Journeys", "Prototypes", "Design systems", "Handoff"],
    applicationsIntro: "The outputs are decisions and files the build can follow. They are not a gallery of fictional apps.",
    applications: [
      {
        title: "Product discovery",
        text: "Enough research to name the user, the task, and the constraint. Not a months-long study unless that is the engagement.",
      },
      {
        title: "Journeys and structure",
        text: "The path through the product and the information each step needs.",
      },
      {
        title: "Wireframes and prototypes",
        text: "Low-fidelity structure first, then a prototype of the interaction that is risky to guess.",
      },
      {
        title: "Interface design",
        text: "Screens for the agreed flows, including empty, loading, and error states.",
      },
    ],
    challengesIntro: "Startups lose time when every feature invents its own interface, or when a pretty file cannot survive real data.",
    challenges: [
      {
        title: "Screens without a task",
        text: "Visuals that do not say what the user is trying to finish. We design the task first.",
      },
      {
        title: "A prototype that ignores the data",
        text: "Perfect records in a mock hide the empty state and the long name. We design those states on purpose.",
      },
      {
        title: "Engineering has to interpret the file",
        text: "Spacing, components, and behavior that are not specified become a second design project during the build.",
      },
      {
        title: "Accessibility arrives as a bug",
        text: "Contrast, focus, labels, and keyboard paths are part of the interface, not a later audit we promise to pass.",
      },
    ],
    approachIntro: "Watch the task, structure the product, prototype the risky part, and hand off a system rather than a pile of frames.",
    approach: [
      {
        title: "Discovery",
        text: "Talk to the people who know the problem. Write the jobs the first release must support.",
      },
      {
        title: "Information architecture",
        text: "Group the product so a new user can tell where a task lives.",
      },
      {
        title: "Wireframes",
        text: "Structure and priority before color. Review them while they are still cheap to change.",
      },
      {
        title: "Interface and prototype",
        text: "Visual design and a clickable path through the interaction that is easiest to get wrong.",
      },
      {
        title: "Handoff",
        text: "Components, states, and notes engineering can implement. A short design system if more than a handful of screens exist.",
      },
    ],
    capabilities: [
      {
        title: "User journeys",
        text: "The steps a person takes, including the ones that fail. Each step has a reason to exist.",
      },
      {
        title: "Wireframes",
        text: "Layout and hierarchy without the distraction of a finished coat of paint.",
      },
      {
        title: "Prototypes",
        text: "A model of the interaction founders can try before a sprint is spent on it.",
      },
      {
        title: "Interface design",
        text: "Typography, spacing, and components that match the product, applied to the screens in scope.",
      },
      {
        title: "Accessibility basics",
        text: "Contrast, focus order, names for controls, and text that still makes sense without color alone. Not a formal conformance certificate.",
      },
      {
        title: "Developer handoff",
        text: "Specs a developer can build from: components, spacing, and the behavior of each state.",
      },
    ],
    deliverables: [
      "Journey or flow notes for the tasks in scope",
      "Wireframes for those tasks",
      "Interface design for the agreed screens",
      "A prototype of the risky interaction",
      "Handoff files and a starter component set when the screen count justifies it",
    ],
    technologyGroups: ["Frontend"],
    technologyNote:
      "Design work is not a framework certification. The frontend names in the catalog are examples of what engineering may implement afterward. The handoff should not depend on a single tool, and no design-vendor partnership is claimed.",
    faqs: [
      {
        question: "Do you only make things look polished?",
        answer:
          "Polish is the last layer. The work starts with the task, the structure, and the states people actually hit. A decorative screen that hides the workflow is not the deliverable.",
      },
      {
        question: "Can you design inside an existing product?",
        answer:
          "Yes. We start from the current flows and the complaints that are specific. A full visual reboot is a choice, not the default.",
      },
      {
        question: "What do developers receive?",
        answer:
          "Files and notes that name components, spacing, and behavior, including empty and error states. The format is agreed so the engineering team can open it.",
      },
      {
        question: "Do you guarantee accessibility compliance?",
        answer:
          "We design for the basics and can test the flows in scope with assistive checks. A legal conformance claim needs a dedicated audit and is not made here.",
      },
      {
        question: "How many screens are included?",
        answer:
          "The ones the proposal lists. A product with forty views is not the same project as a product with six.",
      },
    ],
    related: ["web-application-development", "mobile-app-development", "saas-platform-development"],
    cta: "Discuss Your Product Design",
  },
  {
    slug: "qa-software-testing",
    title: "QA & Testing",
    summary: "Functional, regression, and API checks so a release has a record of what was actually validated.",
    metaDescription:
      "Software QA and testing for startups: functional, regression, API, and release checks from Vortex Digital. Testing does not promise zero defects.",
    icon: "shield-check",
    visual: "grid",
    featured: true,
    hero: "Quality is evidence, not a slogan. Vortex Digital tests the behavior a startup agreed to ship, writes down what failed, and does not pretend a test pass means the product is defect-free.",
    tags: ["Functional tests", "Regression", "API checks", "Release notes"],
    applicationsIntro: "Testing is scoped to the risks of the product in front of us. A checklist that ignores the domain is not the service.",
    applications: [
      {
        title: "Functional testing",
        text: "The tasks users must complete, including the wrong inputs and the missing data.",
      },
      {
        title: "Regression passes",
        text: "The paths that break when something nearby changes, re-checked before a release.",
      },
      {
        title: "API testing",
        text: "Contracts, auth failures, and the error shapes clients depend on.",
      },
      {
        title: "Release validation",
        text: "A written record of what was checked, what failed, and what was accepted as a later fix.",
      },
    ],
    challengesIntro: "Startups often discover bugs from customers because the happy path was the only path anyone opened.",
    challenges: [
      {
        title: "The demo is the test plan",
        text: "If the only check is the path that was rehearsed, everything else is unknown. We write the other paths down.",
      },
      {
        title: "Fixes reintroduce old bugs",
        text: "Regression coverage targets the areas that change often, automated where the check will be repeated.",
      },
      {
        title: "API clients fail in production",
        text: "Status codes and validation errors need their own checks, not only a browser click.",
      },
      {
        title: "Release day is the first time anyone looks",
        text: "Validation is scheduled before the release, with a line between a blocker and a later improvement.",
      },
    ],
    approachIntro: "Agree the behavior, test the risky paths, automate what you will run every week, and report defects without theater.",
    approach: [
      {
        title: "Scope",
        text: "List the flows, platforms, and APIs in scope. Say what is out of scope so the record is honest.",
      },
      {
        title: "Functional checks",
        text: "Execute the tasks, including failures. File defects with steps, not adjectives.",
      },
      {
        title: "Automation",
        text: "Automate the checks that will be repeated and that a machine can judge. Leave judgment calls to a person.",
      },
      {
        title: "Compatibility",
        text: "Browsers and device classes named in the plan, not every device on earth.",
      },
      {
        title: "Release record",
        text: "What passed, what failed, and what shipped anyway by decision. No claim of zero defects.",
      },
    ],
    capabilities: [
      {
        title: "Functional testing",
        text: "Scenario coverage for the product behavior in the agreement, including permissions and bad input.",
      },
      {
        title: "Regression testing",
        text: "A set of checks rerun when the product changes, focused on the areas that have broken before or that the change touches.",
      },
      {
        title: "API testing",
        text: "Requests against the contract: success, validation, and unauthorized calls.",
      },
      {
        title: "Browser and mobile checks",
        text: "The browsers and screen sizes listed in the plan. A pass on one browser is reported as that, not as universal compatibility.",
      },
      {
        title: "Automated tests",
        text: "Suites for stable, high-value paths. Automation is a tool, not a substitute for understanding the product.",
      },
      {
        title: "Defect reporting and release notes",
        text: "Issues with reproduction steps, and a release note a founder can read. Severity is a conversation, not a hidden score.",
      },
    ],
    deliverables: [
      "A test scope for the release in question",
      "Executed checks and the results",
      "Defect reports for the failures found",
      "Automated coverage only where it was agreed",
      "A release note of what was validated and what was not",
    ],
    technologyGroups: ["Frontend", "Backend"],
    technologyNote:
      "Test tooling is chosen for the project. The catalog is not a certification list. Performance testing, when included, is a measured check of an agreed scenario, not a universal speed claim.",
    faqs: [
      {
        question: "Can you guarantee there will be no bugs?",
        answer:
          "No. Testing reduces unknown risk and leaves a record. It does not prove the absence of defects, and we will not say that it does.",
      },
      {
        question: "Do you test software you did not build?",
        answer:
          "Yes, if we can run it and the behavior to check is written down. We need access, an environment, and a person who can explain what 'correct' means.",
      },
      {
        question: "What is automated?",
        answer:
          "Checks that are stable and worth running often. A fragile script that only its author understands is not a favor.",
      },
      {
        question: "Do you do performance testing?",
        answer:
          "We can measure an agreed scenario, such as a slow page or a hot API. That is a finding about that scenario, not a blanket performance promise.",
      },
      {
        question: "How are defects prioritized?",
        answer:
          "By impact on the release and how hard they are to reproduce. The decision to ship with a known issue belongs to the product owner and is written down.",
      },
    ],
    related: ["web-application-development", "cloud-devops", "mobile-app-development"],
    cta: "Discuss Your Testing Plan",
  },
];

export const featuredServices = services.filter((service) => service.featured);

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function relatedServices(service: Service): Service[] {
  return service.related
    .map((slug) => getService(slug))
    .filter((item): item is Service => Boolean(item));
}

export function serviceTechnologies(service: Service) {
  return service.technologyGroups.map((label) => {
    const group = technologyGroups.find((item) => item.label === label);
    if (!group) throw new Error(`Unknown technology group: ${label}`);
    return group;
  });
}

export const serviceNeeds: { title: string; text: string; slugs: string[] }[] = [
  {
    title: "Building an MVP",
    text: "Cut the first release to the tasks that prove the product, without painting the team into a corner. SaaS planning, web or mobile clients, and product design usually travel together.",
    slugs: ["saas-platform-development", "web-application-development", "ui-ux-product-design"],
  },
  {
    title: "Developing a custom application",
    text: "When the product is software rather than a site, the work is the application itself: interface, accounts, and the behavior behind them.",
    slugs: ["web-application-development", "mobile-app-development"],
  },
  {
    title: "Improving an existing product",
    text: "Start from the codebase or the flows you already have. Testing, design, and backend changes are ways to make a specific problem smaller. A rewrite is not assumed.",
    slugs: ["qa-software-testing", "ui-ux-product-design", "backend-api-engineering"],
  },
  {
    title: "Integrating APIs",
    text: "Payments, identity, internal systems, or a client that needs a contract. The backend work is the adapter, the failure mode, and the documentation.",
    slugs: ["backend-api-engineering", "web-application-development"],
  },
  {
    title: "Adding AI capabilities",
    text: "Put a model behind a real task, with retrieval, review, and a limit on what it may decide. The feature lives in the product you already have when that product can support it.",
    slugs: ["ai-intelligent-automation", "backend-api-engineering"],
  },
  {
    title: "Designing a new interface",
    text: "Structure the task before the visual layer. Design handoff is useful only if engineering can build the states the files describe.",
    slugs: ["ui-ux-product-design", "web-application-development", "mobile-app-development"],
  },
  {
    title: "Improving reliability and performance",
    text: "Look at the release path, the checks, and the requests people wait on. Cloud work and QA describe that effort. They do not promise an uptime number.",
    slugs: ["cloud-devops", "qa-software-testing", "backend-api-engineering"],
  },
];

export const serviceFlow = [
  {
    title: "Product design",
    text: "Name the task, the journey, and the interface engineering should build.",
  },
  {
    title: "Web or mobile client",
    text: "The surface people use. It stays thin and follows the API.",
  },
  {
    title: "Backend and APIs",
    text: "Rules, data, auth, and the third parties the product depends on.",
  },
  {
    title: "Cloud delivery",
    text: "A repeatable path from a commit to a running environment.",
  },
  {
    title: "Quality assurance",
    text: "Checks and a written record before the release is called ready.",
  },
];

for (const service of services) {
  if (service.faqs.length < 4 || service.capabilities.length < 4 || service.related.length < 2) {
    throw new Error(`Incomplete service content: ${service.slug}`);
  }
  for (const slug of service.related) {
    if (!services.some((item) => item.slug === slug)) throw new Error(`Broken related link on ${service.slug}: ${slug}`);
  }
}
