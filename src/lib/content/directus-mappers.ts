import { isCmsPubliclyEligible } from "./publication-gates.ts";
import type {
  NormalizedHomepage,
  NormalizedInsight,
  NormalizedProject,
  NormalizedScreenshot,
  NormalizedService,
  NormalizedTeamMember,
} from "./types.ts";

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asBool(value: unknown): boolean {
  return value === true;
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function fileId(value: unknown): string | null {
  if (typeof value === "string" && value) return value;
  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id?: unknown }).id;
    return typeof id === "string" ? id : null;
  }
  return null;
}

export function mapTeamMember(row: Record<string, unknown>, index: number): NormalizedTeamMember {
  return {
    slug: asString(row.slug),
    name: row.name == null || row.name === "" ? null : asString(row.name),
    role: asString(row.role),
    intro: asString(row.intro),
    biography: asArray<string>(row.biography),
    responsibilities: asArray(row.responsibilities),
    expertise: asArray(row.expertise),
    experience: asString(row.experience),
    externalExperience: asArray<string>(row.external_experience),
    startupSupport: asString(row.startup_support),
    related: asArray(row.related_roles),
    portraitSrc: null,
    portraitAlt: asString(row.portrait_alt),
    displayOrder: typeof row.display_order === "number" ? row.display_order : index + 1,
    featured: asBool(row.featured),
    linkedin: asString(row.linkedin) || undefined,
    github: asString(row.github) || undefined,
    portfolio: asString(row.portfolio_url) || undefined,
    sourceApproval: false,
    cmsEligible: isCmsPubliclyEligible({
      status: asString(row.status),
      publication_approved: asBool(row.publication_approved),
      published_at: row.published_at == null ? null : asString(row.published_at),
    }),
  };
}

export function mapScreenshot(row: Record<string, unknown>, projectSlug: string): NormalizedScreenshot {
  return {
    projectSlug,
    sort: typeof row.sort === "number" ? row.sort : 1,
    src: null,
    fileId: fileId(row.image),
    alt: asString(row.alt),
    caption: asString(row.caption) || undefined,
    kind: asString(row.kind) || undefined,
    width: typeof row.width === "number" ? row.width : undefined,
    height: typeof row.height === "number" ? row.height : undefined,
    checksum: row.checksum_sha256 == null ? null : asString(row.checksum_sha256),
  };
}

export function mapProject(
  row: Record<string, unknown>,
  screenshots: NormalizedScreenshot[],
): NormalizedProject {
  return {
    slug: asString(row.slug),
    title: asString(row.title),
    description: asString(row.description),
    cardTitle: asString(row.card_title) || undefined,
    cardSummary: asString(row.card_summary) || undefined,
    client: asString(row.client),
    industry: asString(row.industry),
    category: asString(row.category),
    services: asArray<string>(row.services),
    technologies: asArray<string>(row.technologies),
    projectUrl: asString(row.project_url) || undefined,
    projectUrlLabel: asString(row.project_url_label) || undefined,
    featured: asBool(row.featured),
    homeRank: typeof row.home_rank === "number" ? row.home_rank : 99,
    mediaLayout: asString(row.media_layout, "web") === "mobile" ? "mobile" : "web",
    filters: asArray<string>(row.filters),
    screenshots: [...screenshots].sort((a, b) => a.sort - b.sort),
    sourceApproval: false,
    contributionVerified: asBool(row.contribution_verified),
    cmsEligible: isCmsPubliclyEligible({
      status: asString(row.status),
      publication_approved: asBool(row.publication_approved),
      published_at: row.published_at == null ? null : asString(row.published_at),
    }),
  };
}

export function mapService(row: Record<string, unknown>): NormalizedService {
  return {
    slug: asString(row.slug),
    title: asString(row.title),
    summary: asString(row.summary),
    hero: asString(row.hero) || undefined,
    iconToken: asString(row.icon_token) || undefined,
    visualToken: asString(row.visual_token) || undefined,
    displayOrder: typeof row.display_order === "number" ? row.display_order : 99,
    featured: asBool(row.featured),
    ctaLabel: asString(row.cta_label) || undefined,
    ctaHref: asString(row.cta_href) || undefined,
    sourceApproval: true,
    cmsEligible: isCmsPubliclyEligible({
      status: asString(row.status),
      publication_approved: asBool(row.publication_approved),
      published_at: row.published_at == null ? null : asString(row.published_at),
    }),
  };
}

export function mapInsight(row: Record<string, unknown>): NormalizedInsight {
  return {
    slug: asString(row.slug),
    title: asString(row.title),
    excerpt: asString(row.excerpt),
    body: asString(row.body),
    author: asString(row.author, "Vortex Digital"),
    category: asString(row.category) || undefined,
    featured: asBool(row.featured),
    sourceApproval: false,
    cmsEligible: isCmsPubliclyEligible({
      status: asString(row.status),
      publication_approved: asBool(row.publication_approved),
      published_at: row.published_at == null ? null : asString(row.published_at),
    }),
  };
}

export function mapHomepage(row: Record<string, unknown>): NormalizedHomepage {
  return {
    heroEyebrow: asString(row.hero_eyebrow) || undefined,
    heroTitle: asString(row.hero_title),
    heroLede: asString(row.hero_lede) || undefined,
    primaryCtaLabel: asString(row.primary_cta_label) || undefined,
    primaryCtaHref: asString(row.primary_cta_href) || undefined,
    secondaryCtaLabel: asString(row.secondary_cta_label) || undefined,
    secondaryCtaHref: asString(row.secondary_cta_href) || undefined,
    teamFilmEyebrow: asString(row.team_film_eyebrow) || undefined,
    teamFilmHeading: asString(row.team_film_heading) || undefined,
    teamFilmDescription: asString(row.team_film_description) || undefined,
    teamFilmDisclosure: asString(row.team_film_disclosure) || undefined,
    teamFilmVideoId: fileId(row.team_film_video),
    teamFilmPosterId: fileId(row.team_film_poster),
    featuredProjectSlugs: asArray<string>(row.featured_project_slugs),
    cmsEligible: isCmsPubliclyEligible({
      status: asString(row.status, "draft"),
      publication_approved: asBool(row.publication_approved),
      published_at: null,
    }),
  };
}
