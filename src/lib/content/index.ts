import fs from "node:fs";
import path from "node:path";
import { assertCmsBuildAllowed, evaluateCmsReadiness, fetchCmsSnapshot } from "./cms-load.ts";
import { assertLocalTeamBaseline, loadLocalServices, loadLocalTeam } from "./local.ts";
import { buildParityReport } from "./parity.ts";
import {
  assertCmsReleaseBuildAllowed,
  getPublishedSiteSnapshot,
  writeBuildPin,
} from "./published-snapshot.ts";
import { getContentSource, type ContentSource } from "./source.ts";
import type { NormalizedInsight, NormalizedProject } from "./types.ts";

export * from "./source.ts";
export * from "./publication-gates.ts";
export * from "./types.ts";
export * from "./release-types.ts";
export {
  loadLocalTeam,
  loadLocalServices,
  localHomepageDefaults,
  normalizeLocalProjects,
  normalizeLocalInsights,
} from "./local.ts";
export { evaluateCmsReadiness, fetchCmsSnapshot, assertCmsBuildAllowed } from "./cms-load.ts";
export { buildParityReport } from "./parity.ts";
export { createDirectusClient } from "./directus-client.server.ts";
export { materializeApprovedAsset, cleanCmsMediaOutput } from "./media.ts";
export {
  getPublishedSiteSnapshot,
  tryGetPublishedSiteSnapshotForBuild,
  assertCmsReleaseBuildAllowed,
  writeBuildPin,
  readBuildPin,
} from "./published-snapshot.ts";
export {
  isCmsRenderMode,
  getTeamForRender,
  getServicesForRender,
  getServiceForRender,
  getProjectsForRender,
  getProjectForRender,
  getInsightsForRender,
  getHomepageForRender,
  getReleaseMeta,
  requireCmsSnapshot,
} from "./site-content.ts";
export {
  hashSnapshot,
  readActiveRelease,
  readPointer,
  writeImmutableRelease,
  activateRelease,
  rollbackRelease,
  getReleaseRoot,
} from "./release-store.ts";
export { buildReleaseCandidate, planReleaseFromDirectus, verifyReleaseSnapshot, newReleaseId } from "./release-builder.ts";

let shadowRan = false;

function privateTmpDir() {
  const dir = path.join(process.cwd(), "cms", ".tmp");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/**
 * Build-time gate invoked from Astro layouts/pages.
 * - local: no Directus I/O
 * - cms-shadow: private parity audit; still render local content
 * - cms: require activated immutable release (not mutable Directus drafts)
 */
export async function ensureContentMode(options?: {
  localProjects?: NormalizedProject[];
  localInsights?: NormalizedInsight[];
}): Promise<{ source: ContentSource }> {
  const source = getContentSource();
  assertLocalTeamBaseline();

  if (source === "local") {
    return { source };
  }

  if (source === "cms-shadow") {
    if (!shadowRan) {
      shadowRan = true;
      const snapshot = await fetchCmsSnapshot("shadow");
      const report = buildParityReport({
        mode: "cms-shadow",
        teamLocal: loadLocalTeam(),
        teamCms: snapshot.team,
        projectsLocal: options?.localProjects ?? [],
        projectsCms: snapshot.projects,
        servicesLocal: loadLocalServices(),
        servicesCms: snapshot.services,
        insightsLocal: options?.localInsights ?? [],
        insightsCms: snapshot.insights,
      });
      const out = path.join(privateTmpDir(), "step-10c-shadow-parity.json");
      fs.writeFileSync(out, JSON.stringify(report, null, 2));
      fs.chmodSync(out, 0o600);
      if (!report.ok && (options?.localProjects?.length || 0) > 0) {
        throw new Error(`cms-shadow parity failed — see ${out}`);
      }
    }
    return { source };
  }

  // cms mode — read immutable ACTIVE release only (never draft items collections)
  const release = getPublishedSiteSnapshot();
  assertCmsReleaseBuildAllowed(release);
  writeBuildPin(release);
  const readinessPath = path.join(privateTmpDir(), "step-10d-release-readiness.json");
  fs.writeFileSync(
    readinessPath,
    JSON.stringify(
      {
        ok: true,
        releaseId: release.releaseId,
        contentHash: release.contentHash,
        counts: {
          team: release.team.length,
          projects: release.projects.length,
          services: release.services.length,
          insights: release.insights.length,
          media: release.media.length,
        },
        // Live Directus draft eligibility remains separate and fail-closed for real baseline.
        liveDraftGate: evaluateCmsReadiness(await safeLiveDraftSnapshot()),
      },
      null,
      2,
    ),
  );
  fs.chmodSync(readinessPath, 0o600);
  return { source };
}

async function safeLiveDraftSnapshot() {
  try {
    const snap = await fetchCmsSnapshot("build");
    return {
      team: snap.team,
      projects: snap.projects,
      services: snap.services,
      insights: snap.insights,
    };
  } catch {
    return { team: [], projects: [], services: [], insights: [] };
  }
}

/** @deprecated Prefer ensureContentMode; kept for scripts that checked draft eligibility. */
export { assertCmsBuildAllowed as assertLiveDraftCmsBuildAllowed };
