import { createDirectusClient, type DirectusClient } from "./directus-client.server.ts";
import {
  mapHomepage,
  mapInsight,
  mapProject,
  mapScreenshot,
  mapService,
  mapTeamMember,
} from "./directus-mappers.ts";
import { CMS_PUBLIC_BASELINE, isCmsPubliclyEligible } from "./publication-gates.ts";
import type {
  NormalizedHomepage,
  NormalizedInsight,
  NormalizedProject,
  NormalizedService,
  NormalizedTeamMember,
} from "./types.ts";

const TEAM_FIELDS = [
  "id",
  "status",
  "publication_approved",
  "published_at",
  "slug",
  "name",
  "role",
  "intro",
  "biography",
  "responsibilities",
  "expertise",
  "experience",
  "external_experience",
  "startup_support",
  "related_roles",
  "portrait",
  "portrait_alt",
  "display_order",
  "featured",
  "linkedin",
  "github",
  "portfolio_url",
];

const PROJECT_FIELDS = [
  "id",
  "status",
  "publication_approved",
  "published_at",
  "slug",
  "title",
  "description",
  "card_title",
  "card_summary",
  "client",
  "industry",
  "category",
  "services",
  "technologies",
  "project_url",
  "project_url_label",
  "featured",
  "home_rank",
  "media_layout",
  "filters",
  "contribution_verified",
];

const SHOT_FIELDS = [
  "id",
  "project",
  "image",
  "alt",
  "caption",
  "kind",
  "width",
  "height",
  "sort",
  "checksum_sha256",
  "status",
];

export async function fetchCmsSnapshot(kind: "shadow" | "build" = "shadow") {
  const client = createDirectusClient({ kind });
  return loadCmsSnapshot(client);
}

export async function loadCmsSnapshot(client: DirectusClient) {
  const [teamRows, projectRows, shotRows, serviceRows, insightRows, homepageRows] = await Promise.all([
    client.listItems<Record<string, unknown>>("team_members", TEAM_FIELDS, { sort: "display_order" }),
    client.listItems<Record<string, unknown>>("portfolio_projects", PROJECT_FIELDS, { sort: "home_rank" }),
    client.listItems<Record<string, unknown>>("portfolio_screenshots", SHOT_FIELDS, { sort: "sort" }),
    client.listItems<Record<string, unknown>>("services", ["*"], { sort: "display_order" }),
    client.listItems<Record<string, unknown>>("insights_articles", [
      "id",
      "status",
      "publication_approved",
      "published_at",
      "slug",
      "title",
      "excerpt",
      "body",
      "author",
      "category",
      "featured",
    ]),
    client.listItems<Record<string, unknown>>("homepage_content", ["*"]),
  ]);

  const projectIdToSlug = new Map(
    projectRows.map((row) => [String(row.id), String(row.slug)]),
  );

  const team: NormalizedTeamMember[] = teamRows.map((row, index) => {
    const mapped = mapTeamMember(row, index);
    return mapped;
  });

  const projects: NormalizedProject[] = projectRows.map((row) => {
    const slug = String(row.slug);
    const shots = shotRows
      .filter((shot) => {
        const projectRef = shot.project;
        const id = typeof projectRef === "string" ? projectRef : (projectRef as { id?: string })?.id;
        return projectIdToSlug.get(String(id)) === slug;
      })
      .map((shot) => mapScreenshot(shot, slug));
    return mapProject(row, shots);
  });

  const services: NormalizedService[] = serviceRows.map((row) => mapService(row));
  const insights: NormalizedInsight[] = insightRows.map((row) => mapInsight(row));
  const homepage: NormalizedHomepage = mapHomepage(homepageRows[0] || {});

  return { client, team, projects, services, insights, homepage, raw: { teamRows, projectRows, shotRows } };
}

export interface CmsReadinessResult {
  ok: boolean;
  eligible: {
    team: number;
    projects: number;
    screenshots: number;
    services: number;
    insights: number;
  };
  blockers: string[];
}

export function evaluateCmsReadiness(snapshot: {
  team: NormalizedTeamMember[];
  projects: NormalizedProject[];
  services: NormalizedService[];
  insights: NormalizedInsight[];
}): CmsReadinessResult {
  const team = snapshot.team.filter((item) => item.cmsEligible);
  const projects = snapshot.projects.filter((item) => item.cmsEligible);
  const services = snapshot.services.filter((item) => item.cmsEligible);
  const insights = snapshot.insights.filter((item) => item.cmsEligible);
  const screenshots = projects.reduce((n, project) => n + project.screenshots.length, 0);

  const blockers: string[] = [];
  if (team.length < CMS_PUBLIC_BASELINE.team_members) {
    blockers.push(
      `Eligible team_members ${team.length}/${CMS_PUBLIC_BASELINE.team_members} — staged CMS records remain draft/unapproved`,
    );
  }
  if (projects.length < CMS_PUBLIC_BASELINE.portfolio_projects) {
    blockers.push(
      `Eligible portfolio_projects ${projects.length}/${CMS_PUBLIC_BASELINE.portfolio_projects}`,
    );
  }
  if (screenshots < CMS_PUBLIC_BASELINE.portfolio_screenshots) {
    blockers.push(
      `Eligible screenshots ${screenshots}/${CMS_PUBLIC_BASELINE.portfolio_screenshots}`,
    );
  }
  if (services.length < CMS_PUBLIC_BASELINE.services) {
    blockers.push(`Eligible services ${services.length}/${CMS_PUBLIC_BASELINE.services}`);
  }
  // Insights may be zero publicly; any eligible is fine, but drafts must not leak.
  for (const article of snapshot.insights) {
    if (!article.cmsEligible && isCmsPubliclyEligible({ status: "draft", publication_approved: false, published_at: null })) {
      // no-op; keep clarity
    }
  }

  return {
    ok: blockers.length === 0,
    eligible: {
      team: team.length,
      projects: projects.length,
      screenshots,
      services: services.length,
      insights: insights.length,
    },
    blockers,
  };
}

export function assertCmsBuildAllowed(readiness: CmsReadinessResult) {
  if (!readiness.ok) {
    const detail = readiness.blockers.map((item) => `- ${item}`).join("\n");
    throw new Error(
      `CONTENT_SOURCE=cms refused: public baseline is not approved in Directus.\n${detail}\nKeep CONTENT_SOURCE=local until owner reconciliation (see STEP_10C_RECONCILIATION_PLAN.md).`,
    );
  }
}
