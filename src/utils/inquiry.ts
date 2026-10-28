export const MIN_SUBMIT_MS = 1200;

export const projectTypes = [
  "Web Application",
  "Mobile Application",
  "AI Solution",
  "SaaS Product",
  "Backend / API",
  "Cloud / DevOps",
  "UI/UX Design",
  "QA & Testing",
  "Other",
] as const;

export const budgets = [
  "Not sure yet",
  "Under $15,000",
  "$15,000–$40,000",
  "$40,000–$80,000",
  "$80,000–$150,000",
  "$150,000+",
] as const;

export const timelines = ["Not sure yet", "Under 1 month", "1–3 months", "3–6 months", "6 months or more"] as const;

export interface InquiryValues {
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
  consent: boolean;
}

export interface InquiryProblem {
  id: string;
  message: string;
}

export type DeliveryPlan =
  | { mode: "blocked"; reason: string }
  | { mode: "unconfigured" }
  | { mode: "provider"; endpoint: string };

export type ProviderOutcome = "confirmed-success" | "recoverable-error";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const placeholderHosts = new Set(["example.com", "example.org", "www.example.com", "www.example.org"]);

const serviceAliases: Record<string, string> = {
  "web-application-development": "Web Application",
  "web development": "Web Application",
  "web application development": "Web Application",
  "mobile-app-development": "Mobile Application",
  "mobile apps": "Mobile Application",
  "mobile app development": "Mobile Application",
  "ai-intelligent-automation": "AI Solution",
  "ai solutions": "AI Solution",
  "ai & intelligent automation": "AI Solution",
  "saas-platform-development": "SaaS Product",
  "saas development": "SaaS Product",
  "saas platform development": "SaaS Product",
  "backend-api-engineering": "Backend / API",
  "backend & apis": "Backend / API",
  "backend & api engineering": "Backend / API",
  "cloud-devops": "Cloud / DevOps",
  "cloud & devops": "Cloud / DevOps",
  "ui-ux-product-design": "UI/UX Design",
  "ui/ux design": "UI/UX Design",
  "ui/ux product design": "UI/UX Design",
  "qa-software-testing": "QA & Testing",
  "qa & testing": "QA & Testing",
  "qa & software testing": "QA & Testing",
};

export function isPracticalEmail(value: string): boolean {
  const email = value.trim();
  if (email.length > 254 || /\s/.test(email)) return false;
  return emailPattern.test(email);
}

function allowed(value: string, options: readonly string[]): boolean {
  return options.includes(value);
}

export function inquiryProblems(input: InquiryValues): InquiryProblem[] {
  const problems: InquiryProblem[] = [];
  if (input.name.trim().length < 2) problems.push({ id: "full-name", message: "Enter your full name." });
  if (!isPracticalEmail(input.email)) problems.push({ id: "business-email", message: "Enter a valid email address." });
  if (input.company.trim().length < 2) problems.push({ id: "company-name", message: "Enter your company name." });
  if (!allowed(input.service.trim(), projectTypes)) problems.push({ id: "project-type", message: "Select a project type." });
  if (input.budget.trim() && !allowed(input.budget.trim(), budgets)) {
    problems.push({ id: "estimated-budget", message: "Select a listed budget, or leave it blank." });
  }
  if (input.timeline.trim() && !allowed(input.timeline.trim(), timelines)) {
    problems.push({ id: "expected-timeline", message: "Select a listed timeline, or leave it blank." });
  }
  if (input.message.trim().length < 20) {
    problems.push({ id: "project-description", message: "Describe the project in at least 20 characters." });
  }
  if (!input.consent) problems.push({ id: "privacy-consent", message: "Confirm the privacy notice to continue." });
  return problems;
}

/**
 * Maps a service-page query to a known project type.
 * Unknown, empty, and markup-like values become an empty selection.
 */
export function resolveServicePrefill(requested: string | null, options: readonly string[] = projectTypes): string {
  if (!requested) return "";
  const decoded = requested.trim();
  if (!decoded || /[<>]/.test(decoded)) return "";
  const target = serviceAliases[decoded.toLowerCase()] ?? decoded;
  return options.find((option) => option.toLowerCase() === target.toLowerCase()) ?? "";
}

/** Plain-text draft. Omits blank optional fields, the honeypot, and hidden flags. */
export function composeInquiry(input: InquiryValues): string {
  const rows: [string, string][] = [
    ["Name", input.name.trim()],
    ["Email", input.email.trim()],
    ["Company", input.company.trim()],
    ["Project type", input.service.trim()],
  ];
  if (input.budget.trim()) rows.push(["Budget", input.budget.trim()]);
  if (input.timeline.trim()) rows.push(["Timeline", input.timeline.trim()]);
  return `${rows.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\n${input.message.trim()}`;
}

export function isConfiguredEndpoint(endpoint: string): boolean {
  try {
    const url = new URL(endpoint);
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    if (placeholderHosts.has(url.hostname.toLowerCase())) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Decides how an inquiry may leave the browser.
 * `unconfigured` means the site must not claim the message was delivered.
 * A fast submit is blocked only when a real endpoint would be contacted.
 */
export function planDelivery(endpoint: string, honeypot: string, elapsedMs: number): DeliveryPlan {
  if (honeypot.trim()) return { mode: "blocked", reason: "This inquiry was not copied." };
  if (!isConfiguredEndpoint(endpoint)) return { mode: "unconfigured" };
  if (elapsedMs < MIN_SUBMIT_MS) {
    return { mode: "blocked", reason: "The message was not sent. Wait a moment and try again." };
  }
  return { mode: "provider", endpoint };
}

export function providerOutcome(input: { ok: boolean; status: number; aborted?: boolean; payloadOk?: boolean }): ProviderOutcome {
  if (input.aborted || !input.ok || input.status < 200 || input.status >= 300 || input.payloadOk === false) {
    return "recoverable-error";
  }
  return "confirmed-success";
}
