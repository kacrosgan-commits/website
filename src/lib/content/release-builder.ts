import crypto from "node:crypto";
import type { DirectusClient } from "./directus-client.server.ts";
import { loadCmsSnapshot } from "./cms-load.ts";
import { hashSnapshot } from "./release-store.ts";
import type { PublishedSiteSnapshot, ReleaseMediaRef } from "./release-types.ts";
import type {
  NormalizedHomepage,
  NormalizedInsight,
  NormalizedProject,
  NormalizedService,
  NormalizedTeamMember,
} from "./types.ts";

function checksumRecord(value: unknown): string {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 16);
}

function collectMedia(input: {
  team: NormalizedTeamMember[];
  projects: NormalizedProject[];
  homepage: NormalizedHomepage;
}): ReleaseMediaRef[] {
  const refs: ReleaseMediaRef[] = [];
  const seen = new Set<string>();
  const push = (fileId: string | null | undefined, role: string, alt?: string | null) => {
    if (!fileId || seen.has(fileId)) return;
    seen.add(fileId);
    refs.push({ fileId, role, alt: alt ?? null });
  };
  for (const member of input.team) {
    // portraitSrc may already be a public path; file ids live on screenshots / homepage
    void member;
  }
  for (const project of input.projects) {
    for (const shot of project.screenshots) {
      push(shot.fileId, `screenshot:${project.slug}:${shot.sort}`, shot.alt);
    }
  }
  push(input.homepage.teamFilmVideoId, "homepage:team-film-video");
  push(input.homepage.teamFilmPosterId, "homepage:team-film-poster");
  return refs;
}

export interface ReleaseCandidateInput {
  releaseId: string;
  publisher: string;
  notes?: string;
  team: NormalizedTeamMember[];
  projects: NormalizedProject[];
  services: NormalizedService[];
  insights: NormalizedInsight[];
  homepage: NormalizedHomepage;
  pageSections?: PublishedSiteSnapshot["pageSections"];
  siteSettings?: PublishedSiteSnapshot["siteSettings"];
  /** Only include cmsEligible rows (default true). */
  eligibleOnly?: boolean;
}

/** Build an immutable snapshot object (does not write to disk). */
export function buildReleaseCandidate(input: ReleaseCandidateInput): PublishedSiteSnapshot {
  const eligibleOnly = input.eligibleOnly !== false;
  const team = eligibleOnly ? input.team.filter((t) => t.cmsEligible) : input.team;
  const projects = eligibleOnly ? input.projects.filter((p) => p.cmsEligible) : input.projects;
  const services = eligibleOnly ? input.services.filter((s) => s.cmsEligible) : input.services;
  const insights = eligibleOnly ? input.insights.filter((i) => i.cmsEligible) : input.insights;

  const sourceRecordChecksums: Record<string, string> = {};
  for (const member of team) sourceRecordChecksums[`team:${member.slug}`] = checksumRecord(member);
  for (const project of projects) sourceRecordChecksums[`project:${project.slug}`] = checksumRecord(project);
  for (const service of services) sourceRecordChecksums[`service:${service.slug}`] = checksumRecord(service);
  for (const article of insights) sourceRecordChecksums[`insight:${article.slug}`] = checksumRecord(article);
  sourceRecordChecksums["homepage"] = checksumRecord(input.homepage);

  const base = {
    schemaVersion: 1 as const,
    releaseId: input.releaseId,
    createdAt: new Date().toISOString(),
    activatedAt: null,
    publisher: input.publisher,
    notes: input.notes,
    team,
    projects,
    services,
    insights,
    homepage: input.homepage,
    pageSections: input.pageSections ?? [],
    siteSettings: input.siteSettings ?? {
      site_name: "Vortex Digital",
      tagline: undefined,
      summary: undefined,
      description: undefined,
    },
    media: collectMedia({ team, projects, homepage: input.homepage }),
    sourceRecordChecksums,
  };
  const contentHash = hashSnapshot(base);
  return { ...base, contentHash };
}

export function newReleaseId(prefix = "rel"): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z").replace("T", "-");
  const rand = crypto.randomBytes(3).toString("hex");
  return `${prefix}-${stamp}-${rand}`;
}

/**
 * Plan a release from live Directus draft rows that already pass editorial gates.
 * Does NOT activate. Real staged rows today are drafts → empty/blocked plan.
 */
export async function planReleaseFromDirectus(options: {
  client: DirectusClient;
  publisher: string;
  notes?: string;
  releaseId?: string;
}): Promise<{
  snapshot: PublishedSiteSnapshot;
  blockers: string[];
  ineligible: { team: number; projects: number; services: number; insights: number };
}> {
  const loaded = await loadCmsSnapshot(options.client);
  const ineligible = {
    team: loaded.team.filter((t) => !t.cmsEligible).length,
    projects: loaded.projects.filter((p) => !p.cmsEligible).length,
    services: loaded.services.filter((s) => !s.cmsEligible).length,
    insights: loaded.insights.filter((i) => !i.cmsEligible).length,
  };
  const snapshot = buildReleaseCandidate({
    releaseId: options.releaseId ?? newReleaseId(),
    publisher: options.publisher,
    notes: options.notes,
    team: loaded.team,
    projects: loaded.projects,
    services: loaded.services,
    insights: loaded.insights,
    homepage: loaded.homepage,
  });
  const blockers: string[] = [];
  if (snapshot.team.length === 0) blockers.push("No eligible team_members (status+approval+published_at)");
  if (snapshot.projects.length === 0) blockers.push("No eligible portfolio_projects");
  if (snapshot.services.length === 0) blockers.push("No eligible services");
  // Draft insights must stay out — already filtered by cmsEligible
  if (ineligible.insights > 0 && snapshot.insights.length === 0) {
    blockers.push(`${ineligible.insights} insights remain draft/unpublished (expected until individual approval)`);
  }
  return { snapshot, blockers, ineligible };
}

/** Structural verification of a candidate/active snapshot. */
export function verifyReleaseSnapshot(snapshot: PublishedSiteSnapshot): {
  ok: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (snapshot.schemaVersion !== 1) errors.push(`Unsupported schemaVersion ${snapshot.schemaVersion}`);
  if (!snapshot.releaseId.startsWith("rel-")) errors.push("releaseId must start with rel-");
  if (hashSnapshot(snapshot) !== snapshot.contentHash) errors.push("contentHash integrity failure");

  const teamSlugs = new Set<string>();
  for (const member of snapshot.team) {
    if (!member.slug) errors.push("team member missing slug");
    if (teamSlugs.has(member.slug)) errors.push(`duplicate team slug ${member.slug}`);
    teamSlugs.add(member.slug);
    if (!member.cmsEligible) errors.push(`ineligible team in release: ${member.slug}`);
  }
  const projectSlugs = new Set<string>();
  for (const project of snapshot.projects) {
    if (!project.slug) errors.push("project missing slug");
    if (projectSlugs.has(project.slug)) errors.push(`duplicate project slug ${project.slug}`);
    projectSlugs.add(project.slug);
    if (!project.cmsEligible) errors.push(`ineligible project in release: ${project.slug}`);
    for (const shot of project.screenshots) {
      if (!shot.fileId && !shot.src) errors.push(`screenshot missing media for ${project.slug}`);
    }
  }
  const serviceSlugs = new Set<string>();
  for (const service of snapshot.services) {
    if (!service.slug) errors.push("service missing slug");
    if (serviceSlugs.has(service.slug)) errors.push(`duplicate service slug ${service.slug}`);
    serviceSlugs.add(service.slug);
  }
  for (const article of snapshot.insights) {
    if (!article.cmsEligible) errors.push(`ineligible insight in release: ${article.slug}`);
    if (/<script/i.test(article.body)) errors.push(`insight body looks like script: ${article.slug}`);
  }
  if (!snapshot.homepage.heroTitle) warnings.push("homepage heroTitle empty");
  return { ok: errors.length === 0, errors, warnings };
}
