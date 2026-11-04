import { team } from "../../data/team";
import { services } from "../../data/services";
import type {
  NormalizedHomepage,
  NormalizedInsight,
  NormalizedProject,
  NormalizedService,
  NormalizedTeamMember,
} from "./types.ts";

/** Local/Astro source snapshot — no Directus I/O. */
export function loadLocalTeam(): NormalizedTeamMember[] {
  return team.map((member, index) => ({
    slug: member.slug,
    name: member.name,
    role: member.role,
    intro: member.intro,
    biography: member.biography,
    responsibilities: member.responsibilities,
    expertise: member.expertise,
    experience: member.experience,
    externalExperience: member.externalExperience,
    startupSupport: member.startupSupport,
    related: member.related,
    portraitSrc: member.portrait.src,
    portraitAlt: member.portrait.alt,
    displayOrder: index + 1,
    featured: false,
    linkedin: member.linkedin,
    github: member.github,
    portfolio: member.portfolio,
    sourceApproval: member.isPublished,
    cmsEligible: false,
  }));
}

export function loadLocalServices(): NormalizedService[] {
  return services.map((service, index) => ({
    slug: service.slug,
    title: service.title,
    summary: service.summary,
    hero: service.hero,
    iconToken: service.icon,
    visualToken: service.visual,
    displayOrder: index + 1,
    featured: service.featured,
    ctaLabel: service.cta,
    ctaHref: `/contact?service=${encodeURIComponent(service.slug)}`,
    sourceApproval: true,
    cmsEligible: false,
  }));
}

export function localHomepageDefaults(): NormalizedHomepage {
  return {
    heroEyebrow: "Software engineering for startups",
    heroTitle: "We Build Software That Moves Business Forward.",
    heroLede:
      "Vortex Digital helps startups design, build, and improve digital products: web and mobile applications, AI-powered software, and SaaS platforms with a foundation the team can keep changing.",
    primaryCtaLabel: "Start Your Project",
    primaryCtaHref: "/contact",
    secondaryCtaLabel: "View Our Work",
    secondaryCtaHref: "/portfolio",
    teamFilmEyebrow: "The people behind the build",
    teamFilmHeading: "A look at collaboration, from idea to launch",
    teamFilmDescription:
      "A short visual interpretation of the conversations, design reviews, and engineering work that shape digital products.",
    teamFilmDisclosure: "Illustrative team scenes, not footage of an actual company event.",
    teamFilmVideoId: null,
    teamFilmPosterId: null,
    featuredProjectSlugs: [],
    cmsEligible: false,
  };
}

/** Map Astro case-study collection entries into normalized projects (local paths preserved). */
export function normalizeLocalProjects(
  entries: {
    id: string;
    data: {
      title: string;
      description: string;
      cardTitle?: string;
      cardSummary?: string;
      client: string;
      industry: string;
      category: string;
      services: string[];
      technologies?: string[];
      projectUrl?: string;
      projectUrlLabel?: string;
      featured?: boolean;
      homeRank?: number;
      mediaLayout?: "web" | "mobile";
      filters?: string[];
      publicationApproved?: boolean;
      contributionVerified?: boolean;
      sample?: boolean;
      screenshots?: {
        src: string;
        alt: string;
        caption?: string;
        kind?: string;
        width?: number;
        height?: number;
      }[];
    };
  }[],
): NormalizedProject[] {
  return entries
    .filter((entry) => entry.data.sample !== true && entry.data.publicationApproved === true)
    .map((entry) => ({
      slug: entry.id,
      title: entry.data.title,
      description: entry.data.description,
      cardTitle: entry.data.cardTitle,
      cardSummary: entry.data.cardSummary,
      client: entry.data.client,
      industry: entry.data.industry,
      category: entry.data.category,
      services: entry.data.services,
      technologies: entry.data.technologies ?? [],
      projectUrl: entry.data.projectUrl,
      projectUrlLabel: entry.data.projectUrlLabel,
      featured: entry.data.featured === true,
      homeRank: entry.data.homeRank ?? 99,
      mediaLayout: entry.data.mediaLayout === "mobile" ? "mobile" : "web",
      filters: entry.data.filters ?? [],
      screenshots: (entry.data.screenshots ?? []).map((shot, index) => ({
        projectSlug: entry.id,
        sort: index + 1,
        src: shot.src,
        fileId: null,
        alt: shot.alt,
        caption: shot.caption,
        kind: shot.kind,
        width: shot.width,
        height: shot.height,
        checksum: null,
      })),
      sourceApproval: true,
      contributionVerified: entry.data.contributionVerified === true,
      cmsEligible: false,
    }));
}

export function normalizeLocalInsights(
  entries: {
    id: string;
    body?: string;
    data: {
      title: string;
      description: string;
      author: string;
      category?: string;
      featured?: boolean;
      publicationApproved?: boolean;
      draft?: boolean;
      status?: string;
    };
  }[],
): NormalizedInsight[] {
  return entries.map((entry) => ({
    slug: entry.id,
    title: entry.data.title,
    excerpt: entry.data.description,
    body: entry.body ?? "",
    author: entry.data.author,
    category: entry.data.category,
    featured: entry.data.featured === true,
    sourceApproval: entry.data.publicationApproved === true,
    cmsEligible: false,
  }));
}

export function assertLocalTeamBaseline(members: NormalizedTeamMember[] = loadLocalTeam()) {
  if (members.length !== 9) throw new Error(`Expected 9 local team members, found ${members.length}`);
  const adrian = members.find((m) => m.name === "Adrian Cruz");
  const matheus = members.find((m) => m.name === "Matheus Pereira");
  if (!adrian || !matheus) throw new Error("Adrian/Matheus missing from local team");
  if (adrian.portraitSrc === matheus.portraitSrc) {
    throw new Error("Adrian and Matheus must not share a portrait path");
  }
}
