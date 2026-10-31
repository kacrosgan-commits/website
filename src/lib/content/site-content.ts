import type { TeamMember } from "../../data/team";
import { team as localTeam, publicName as localPublicName } from "../../data/team";
import { services as localServices, getService as getLocalService, type Service } from "../../data/services";
import { getContentSource } from "./source.ts";
import { tryGetPublishedSiteSnapshotForBuild, getPublishedSiteSnapshot } from "./published-snapshot.ts";
import type { PublishedSiteSnapshot } from "./release-types.ts";
import type {
  NormalizedHomepage,
  NormalizedInsight,
  NormalizedProject,
  NormalizedService,
  NormalizedTeamMember,
} from "./types.ts";

/**
 * Unified content accessors.
 * local / cms-shadow → existing Astro source data
 * cms → active immutable release only
 */

export function isCmsRenderMode(): boolean {
  return getContentSource() === "cms";
}

export function requireCmsSnapshot(): PublishedSiteSnapshot {
  const pinned = tryGetPublishedSiteSnapshotForBuild();
  if (pinned) return pinned;
  return getPublishedSiteSnapshot();
}

/** Adapt a normalized CMS team member into the TeamMember shape components expect. */
export function normalizedToTeamMember(member: NormalizedTeamMember): TeamMember {
  const portraitSrc = member.portraitSrc || "/assets/team/placeholder-portrait.webp";
  return {
    id: member.slug,
    slug: member.slug,
    name: member.name,
    role: member.role,
    intro: member.intro,
    biography: member.biography.length ? member.biography : [member.intro],
    responsibilities: member.responsibilities,
    expertise: member.expertise,
    experience: member.experience || "Experience details managed in CMS.",
    externalExperience: member.externalExperience,
    startupSupport: member.startupSupport || "",
    related: member.related,
    portrait: {
      src: portraitSrc,
      thumb: portraitSrc,
      alt: member.portraitAlt || `${member.name ?? member.role} portrait`,
      width: 800,
      height: 1000,
      identityVerified: true,
      source: "supplied",
    },
    workImages: [],
    projectIds: [],
    linkedin: member.linkedin,
    github: member.github,
    portfolio: member.portfolio,
    isPublished: member.cmsEligible,
  };
}

export function getTeamForRender(): TeamMember[] {
  if (!isCmsRenderMode()) return localTeam;
  return requireCmsSnapshot().team.map(normalizedToTeamMember);
}

export function getTeamMemberForRender(slug: string): TeamMember | undefined {
  return getTeamForRender().find((m) => m.slug === slug);
}

/**
 * Services: CMS supplies title/summary/hero/order/featured.
 * Complex ServiceDetail body remains code-owned when a matching local slug exists.
 * Fixture-only slugs get a minimal Service shell (documented code gap for new services).
 */
export function getServicesForRender(): Service[] {
  if (!isCmsRenderMode()) return localServices;
  const snap = requireCmsSnapshot();
  return snap.services
    .slice()
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((normalized) => mergeService(normalized));
}

function mergeService(normalized: NormalizedService): Service {
  const local = getLocalService(normalized.slug);
  if (local) {
    return {
      ...local,
      title: normalized.title || local.title,
      summary: normalized.summary || local.summary,
      hero: normalized.hero || local.hero,
      featured: normalized.featured,
      cta: normalized.ctaLabel || local.cta,
    };
  }
  return {
    slug: normalized.slug,
    title: normalized.title,
    summary: normalized.summary,
    metaDescription: normalized.summary,
    icon: "code",
    visual: "grid",
    featured: normalized.featured,
    hero: normalized.hero || normalized.summary,
    tags: [],
    applicationsIntro: "Service detail body is code-owned; CMS holds title and summary for this fixture slug.",
    applications: [],
    challengesIntro: "",
    challenges: [],
    approachIntro: "",
    approach: [],
    capabilities: [],
    deliverables: [],
    technologyGroups: [],
    technologyNote: "",
    faqs: [],
    related: [],
    cta: normalized.ctaLabel || "Start a project",
  };
}

export function getServiceForRender(slug: string): Service | undefined {
  return getServicesForRender().find((s) => s.slug === slug);
}

export function getProjectsForRender(): NormalizedProject[] {
  if (!isCmsRenderMode()) {
    throw new Error("getProjectsForRender is only for CONTENT_SOURCE=cms");
  }
  return requireCmsSnapshot().projects.slice().sort((a, b) => a.homeRank - b.homeRank);
}

export function getProjectForRender(slug: string): NormalizedProject | undefined {
  return getProjectsForRender().find((p) => p.slug === slug);
}

export function getInsightsForRender(): NormalizedInsight[] {
  if (!isCmsRenderMode()) {
    throw new Error("getInsightsForRender is only for CONTENT_SOURCE=cms");
  }
  return requireCmsSnapshot().insights;
}

export function getHomepageForRender(): NormalizedHomepage | null {
  if (!isCmsRenderMode()) return null;
  return requireCmsSnapshot().homepage;
}

export function publicNameFromMember(member: TeamMember): string | null {
  return localPublicName(member);
}

export function getReleaseMeta(): { releaseId: string; contentHash: string } | null {
  if (!isCmsRenderMode()) return null;
  const snap = requireCmsSnapshot();
  return { releaseId: snap.releaseId, contentHash: snap.contentHash };
}

export function getPageSectionsForRender(pageKey: string) {
  if (!isCmsRenderMode()) return [];
  return requireCmsSnapshot()
    .pageSections.filter((s) => s.page_key === pageKey)
    .sort((a, b) => a.sort - b.sort);
}
