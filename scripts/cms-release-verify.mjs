#!/usr/bin/env node
/**
 * Verify a candidate release snapshot on disk (integrity + structure).
 * Usage: node scripts/cms-release-verify.mjs --release <id> [--hash <sha256>]
 * Or verify the active pointer with --active
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const has = (name) => process.argv.includes(name);

const { readRelease, readActiveRelease, readPointer, appendAudit, getReleaseRoot } = await import(
  pathToFileURL(path.join(root, "src/lib/content/release-store.ts")).href
);
const { verifyReleaseSnapshot } = await import(pathToFileURL(path.join(root, "src/lib/content/release-builder.ts")).href);

const releaseRoot = process.env.CMS_RELEASE_ROOT ? path.resolve(process.env.CMS_RELEASE_ROOT) : getReleaseRoot();
let snapshot;
if (has("--active")) {
  snapshot = readActiveRelease(releaseRoot);
  if (!snapshot) {
    console.error(JSON.stringify({ ok: false, error: "No active release" }, null, 2));
    process.exit(2);
  }
} else {
  const releaseId = arg("--release");
  if (!releaseId) {
    console.error("Usage: cms:release:verify --release <id> [--hash <sha>] | --active");
    process.exit(1);
  }
  snapshot = readRelease(releaseId, releaseRoot);
}

const expected = arg("--hash");
const errors = [];
if (expected && expected !== snapshot.contentHash) {
  errors.push(`hash mismatch: expected ${expected}, got ${snapshot.contentHash}`);
}
const structural = verifyReleaseSnapshot(snapshot);
errors.push(...structural.errors);

const result = {
  ok: errors.length === 0,
  releaseId: snapshot.releaseId,
  contentHash: snapshot.contentHash,
  pointer: readPointer(releaseRoot),
  counts: {
    team: snapshot.team.length,
    projects: snapshot.projects.length,
    services: snapshot.services.length,
    insights: snapshot.insights.length,
    media: snapshot.media.length,
  },
  errors,
  warnings: structural.warnings,
};

if (result.ok) {
  appendAudit(
    {
      at: new Date().toISOString(),
      action: "verify",
      releaseId: snapshot.releaseId,
      contentHash: snapshot.contentHash,
      actor: process.env.CMS_RELEASE_ACTOR || "local-verifier",
    },
    releaseRoot,
  );
}

const outDir = path.join(root, "cms", ".tmp", "step-10d");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "last-verify.json"), JSON.stringify(result, null, 2));
fs.chmodSync(path.join(outDir, "last-verify.json"), 0o600);

console.log(JSON.stringify(result, null, 2));
process.exit(result.ok ? 0 : 2);
