import { defaultEmail, defaultSiteUrl } from "./defaults";

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "linkedin" | "instagram" | "youtube" | "x";
}

const email = import.meta.env.PUBLIC_CONTACT_EMAIL || defaultEmail;
const url = import.meta.env.PUBLIC_SITE_URL || defaultSiteUrl;

/**
 * Public company details.
 * `name` is the confirmed public brand. `legalName` stays empty until a registered entity is confirmed.
 * Domain and email still come from environment variables.
 */
const name = "Vortex Digital";

export const site = {
  name,
  /** Registered legal entity. Unpublished until the owner confirms it. */
  legalName: "",
  nameIsPlaceholder: false,
  tagline: "From Idea to Product. Built Together.",
  description: `${name} is a software development agency for startups. We help founders design, build, and improve web applications, mobile apps, AI features, SaaS platforms, and the engineering around them.`,
  summary:
    "A software development agency for startups that need product design, engineering, and a clear path from an idea to a working application.",
  url,
  urlIsPlaceholder: url === defaultSiteUrl,
  email,
  emailIsPlaceholder: /@example\.(com|org)$/i.test(email),
  /** Public location. Leave empty until a real address should be shown. */
  location: "",
  bookingUrl: import.meta.env.PUBLIC_BOOKING_URL || "",
  /** Public Formspree endpoint. Leave empty until the form is created. */
  formEndpoint: import.meta.env.PUBLIC_FORMSPREE_ENDPOINT || "",
  locale: "en",
  copyrightYear: 2026,
} as const;

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Our Work", href: "/portfolio" },
  { label: "Our Process", href: "/process" },
  { label: "Team", href: "/team" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

export const footerNavigation: NavItem[] = navigation.filter((item) => item.href !== "/");

/**
 * Add a full https URL to show a profile. Empty links stay hidden.
 */
export const socialLinks: SocialLink[] = [
  { label: "LinkedIn", href: "", icon: "linkedin" },
  { label: "Instagram", href: "", icon: "instagram" },
  { label: "YouTube", href: "", icon: "youtube" },
  { label: "X", href: "", icon: "x" },
];

export const activeSocialLinks = socialLinks.filter((item) => item.href.startsWith("http"));

export function isActivePath(pathname: string, href: string): boolean {
  const current = pathname.replace(/\/$/, "") || "/";
  if (href === "/") return current === "/";
  return current === href || current.startsWith(`${href}/`);
}
