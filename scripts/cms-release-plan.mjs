#!/usr/bin/env node
/**
 * Read-only release plan from Directus draft rows that pass editorial gates.
 * Never activates. Redacts bodies of unpublished insights.
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

const { createDirectusClient } = await import(pathToFileURL(path.join(root, "src/lib/content/directus-client.server.ts")).href);
const { planReleaseFromDirectus } = await import(pathToFileURL(path.join(root, "src/lib/content/release-builder.ts")).href);
const { readPointer } = await import(pathToFileURL(path.join(root, "src/lib/content/release-store.ts")).href);

const publisher = process.env.CMS_RELEASE_ACTOR || "local-planner";
const client = createDirectusClient({ kind: "shadow" });
const { snapshot, blockers, ineligible } = await planReleaseFromDirectus({ client, publisher, notes: "plan-only" });
const pointer = readPointer();

const redacted = {
  ok: blockers.length === 0 && snapshot.team.length > 0,
  action: "plan",
  mutating: false,
  activePointer: pointer,
  candidate: {
    releaseId: snapshot.releaseId,
    contentHash: snapshot.contentHash,
    createdAt: snapshot.createdAt,
    counts: {
      team: snapshot.team.length,
      projects: snapshot.projects.length,
      screenshots: snapshot.projects.reduce((n, p) => n + p.screenshots.length, 0),
      services: snapshot.services.length,
      insights: snapshot.insights.length,
      media: snapshot.media.length,
    },
    slugs: {
      team: snapshot.team.map((t) => t.slug),
      projects: snapshot.projects.map((p) => p.slug),
      services: snapshot.services.map((s) => s.slug),
      insights: snapshot.insights.map((i) => i.slug),
    },
  },
  ineligibleDraftCounts: ineligible,
  blockers,
  note:
    "Editing Directus does not publish. Activation requires cms:release:verify then cms:release:activate with explicit release ID + hash. Real staged baseline remains unapproved until owner reconciliation.",
};

const outDir = path.join(root, "cms", ".tmp", "step-10d");
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, "last-plan.json");
fs.writeFileSync(out, JSON.stringify(redacted, null, 2));
fs.chmodSync(out, 0o600);

console.log(JSON.stringify(redacted, null, 2));
process.exit(redacted.ok ? 0 : 2);
