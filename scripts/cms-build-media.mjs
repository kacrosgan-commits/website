#!/usr/bin/env node
/**
 * Build-time approved media materialization from the ACTIVE immutable release.
 * Never materializes draft Directus media that is not referenced by the release.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const i = line.indexOf("=");
    const key = line.slice(0, i);
    const val = line.slice(i + 1);
    if (process.env[key] === undefined) process.env[key] = val;
  }
}
loadEnvFile(path.join(root, ".env"));
loadEnvFile(path.join(root, "cms", ".env"));

const { readActiveRelease, getReleaseRoot } = await import(
  pathToFileURL(path.join(root, "src/lib/content/release-store.ts")).href
);
const { createDirectusClient } = await import(
  pathToFileURL(path.join(root, "src/lib/content/directus-client.server.ts")).href
);
const { materializeApprovedAsset, cleanCmsMediaOutput } = await import(
  pathToFileURL(path.join(root, "src/lib/content/media.ts")).href
);

const releaseRoot = process.env.CMS_RELEASE_ROOT ? path.resolve(process.env.CMS_RELEASE_ROOT) : getReleaseRoot();
const snapshot = readActiveRelease(releaseRoot);

if (!snapshot) {
  console.log(
    JSON.stringify(
      {
        ok: false,
        skipped: true,
        reason: "No active immutable release — refusing to materialize media",
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

const fixtureOnly = (snapshot.notes || "").toLowerCase().includes("fixture");
const stagingDir = path.join(root, "cms", ".tmp", "cms-media-staging", snapshot.releaseId);
fs.rmSync(stagingDir, { recursive: true, force: true });
fs.mkdirSync(stagingDir, { recursive: true });

const materialized = [];
const skipped = [];

if (fixtureOnly || process.env.CMS_MEDIA_FIXTURE === "1") {
  // Fixture releases use synthetic /cms-media paths already; no Directus download.
  for (const ref of snapshot.media) {
    skipped.push({ fileId: ref.fileId, reason: "fixture synthetic path" });
  }
} else {
  const client = createDirectusClient({ kind: "build" });
  for (const ref of snapshot.media) {
    if (!ref.fileId || ref.fileId.startsWith("fixture-")) {
      skipped.push({ fileId: ref.fileId, reason: "non-directus id" });
      continue;
    }
    try {
      const asset = await materializeApprovedAsset(client, ref.fileId, stagingDir);
      materialized.push(asset);
      ref.publicPath = asset.publicPath;
      ref.sha256 = asset.sha256;
      ref.bytes = asset.bytes;
      ref.mime = asset.contentType;
    } catch (err) {
      console.error(JSON.stringify({ ok: false, error: String(err), fileId: ref.fileId }, null, 2));
      process.exit(2);
    }
  }

  // Promote staging → dist/cms-media only after full success
  const dist = path.join(root, "dist");
  if (fs.existsSync(dist)) {
    cleanCmsMediaOutput(dist);
    const target = path.join(dist, "cms-media");
    fs.mkdirSync(target, { recursive: true });
    for (const file of fs.readdirSync(stagingDir)) {
      fs.copyFileSync(path.join(stagingDir, file), path.join(target, file));
    }
  }
}

const manifest = {
  ok: true,
  releaseId: snapshot.releaseId,
  contentHash: snapshot.contentHash,
  materialized: materialized.length,
  skipped: skipped.length,
  assets: materialized.map((a) => ({ fileId: a.fileId, publicPath: a.publicPath, sha256: a.sha256, bytes: a.bytes })),
  skippedDetails: skipped,
};

const outDir = path.join(root, "cms", ".tmp", "step-10d");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "media-manifest.json"), JSON.stringify(manifest, null, 2));
fs.chmodSync(path.join(outDir, "media-manifest.json"), 0o600);

console.log(JSON.stringify(manifest, null, 2));
