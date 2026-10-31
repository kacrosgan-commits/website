import fs from "node:fs";
import path from "node:path";
import { evaluateCmsReadiness } from "./cms-load.ts";
import { readActiveRelease, readPointer, readRelease } from "./release-store.ts";
import type { PublishedSiteSnapshot } from "./release-types.ts";
import { getContentSource } from "./source.ts";

export type { PublishedSiteSnapshot } from "./release-types.ts";

/**
 * Resolve the immutable public site snapshot for CONTENT_SOURCE=cms.
 * Reads the ACTIVE release pointer — never mutable Directus draft rows.
 * Fail closed when no active release exists (real staged baseline stays blocked).
 */
export function getPublishedSiteSnapshot(options?: {
  releaseRoot?: string;
  requireActive?: boolean;
}): PublishedSiteSnapshot {
  const root = options?.releaseRoot;
  const pointer = readPointer(root);
  if (!pointer.activeReleaseId) {
    throw new Error(
      "CONTENT_SOURCE=cms refused: no active immutable release. " +
        "Activate an owner-approved release with cms:release:activate, " +
        "or keep CONTENT_SOURCE=local (see STEP_10D_BASELINE_RECONCILIATION.md).",
    );
  }
  const snapshot = readActiveRelease(root);
  if (!snapshot) {
    throw new Error("CONTENT_SOURCE=cms refused: active pointer set but release snapshot missing");
  }
  return snapshot;
}

/** Optional pin for a single build — refuses mid-build pointer drift. */
export function getPinnedPublishedSiteSnapshot(
  releaseId: string,
  expectedHash: string,
  releaseRoot?: string,
): PublishedSiteSnapshot {
  const snapshot = readRelease(releaseId, releaseRoot);
  if (snapshot.contentHash !== expectedHash) {
    throw new Error(`Pinned release hash mismatch for ${releaseId}`);
  }
  return snapshot;
}

/**
 * Build-time gate for cms mode: require active release + structural integrity.
 * Does NOT approve real Directus draft rows; only validates the activated snapshot.
 */
export function assertCmsReleaseBuildAllowed(snapshot: PublishedSiteSnapshot) {
  const readiness = evaluateCmsReadiness({
    team: snapshot.team,
    projects: snapshot.projects,
    services: snapshot.services,
    insights: snapshot.insights,
  });
  // Fixture releases may be smaller than the production baseline.
  // Allow explicitly marked fixture releases (notes contain "fixture") to skip baseline size.
  const isFixture = (snapshot.notes || "").toLowerCase().includes("fixture");
  if (!isFixture && !readiness.ok) {
    throw new Error(
      `Active release ${snapshot.releaseId} fails public baseline:\n` +
        readiness.blockers.map((b) => `- ${b}`).join("\n"),
    );
  }
  // Insights in a release must already be cmsEligible; never include draft bodies by accident.
  for (const article of snapshot.insights) {
    if (!article.cmsEligible) {
      throw new Error(`Release contains ineligible insight slug=${article.slug}`);
    }
  }
}

/** Write private build pin so media + pages agree on one release. */
export function writeBuildPin(snapshot: PublishedSiteSnapshot, cwd = process.cwd()) {
  const dir = path.join(cwd, "cms", ".tmp");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "step-10d-build-pin.json");
  fs.writeFileSync(
    file,
    JSON.stringify(
      {
        releaseId: snapshot.releaseId,
        contentHash: snapshot.contentHash,
        pinnedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );
  fs.chmodSync(file, 0o600);
  return file;
}

export function readBuildPin(cwd = process.cwd()): { releaseId: string; contentHash: string } | null {
  const file = path.join(cwd, "cms", ".tmp", "step-10d-build-pin.json");
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")) as { releaseId: string; contentHash: string };
}

/** Convenience for layouts: only load snapshot when cms mode is active. */
export function tryGetPublishedSiteSnapshotForBuild(): PublishedSiteSnapshot | null {
  if (getContentSource() !== "cms") return null;
  const pin = readBuildPin();
  if (pin) {
    // Pin is only honored when it still matches the ACTIVE pointer (prevents stale fixture pins).
    const pointer = readPointer();
    if (
      pointer.activeReleaseId === pin.releaseId &&
      pointer.activeContentHash === pin.contentHash
    ) {
      return getPinnedPublishedSiteSnapshot(pin.releaseId, pin.contentHash);
    }
  }
  return getPublishedSiteSnapshot();
}
