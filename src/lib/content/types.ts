export interface NormalizedTeamMember {
  slug: string;
  name: string | null;
  role: string;
  intro: string;
  biography: string[];
  responsibilities: { title: string; detail: string }[];
  expertise: { title: string; detail: string }[];
  experience: string;
  externalExperience?: string[];
  startupSupport: string;
  related: { slug: string; note: string }[];
  portraitSrc: string | null;
  portraitAlt: string;
  displayOrder: number;
  featured: boolean;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  sourceApproval: boolean;
  cmsEligible: boolean;
}

export interface NormalizedScreenshot {
  projectSlug: string;
  sort: number;
  src: string | null;
  fileId: string | null;
  alt: string;
  caption?: string;
  kind?: string;
  width?: number;
  height?: number;
  checksum?: string | null;
}

export interface NormalizedProject {
  slug: string;
  title: string;
  description: string;
  cardTitle?: string;
  cardSummary?: string;
  client: string;
  industry: string;
  category: string;
  services: string[];
  technologies: string[];
  projectUrl?: string;
  projectUrlLabel?: string;
  featured: boolean;
  homeRank: number;
  mediaLayout: "web" | "mobile";
  filters: string[];
  screenshots: NormalizedScreenshot[];
  sourceApproval: boolean;
  cmsEligible: boolean;
  contributionVerified: boolean;
}

export interface NormalizedService {
  slug: string;
  title: string;
  summary: string;
  hero?: string;
  iconToken?: string;
  visualToken?: string;
  displayOrder: number;
  featured: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  sourceApproval: boolean;
  cmsEligible: boolean;
}

export interface NormalizedInsight {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  author: string;
  category?: string;
  featured: boolean;
  sourceApproval: boolean;
  cmsEligible: boolean;
}

export interface NormalizedHomepage {
  heroEyebrow?: string;
  heroTitle: string;
  heroLede?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  teamFilmEyebrow?: string;
  teamFilmHeading?: string;
  teamFilmDescription?: string;
  teamFilmDisclosure?: string;
  teamFilmVideoId?: string | null;
  teamFilmPosterId?: string | null;
  featuredProjectSlugs: string[];
  cmsEligible: boolean;
}

export interface ParityIssue {
  collection: string;
  key: string;
  severity: "info" | "warn" | "error";
  message: string;
}

export interface ContentParityReport {
  generatedAt: string;
  mode: string;
  counts: Record<string, number>;
  issues: ParityIssue[];
  leakedDraftMedia: boolean;
  ok: boolean;
}
