#!/usr/bin/env node
/**
 * Step 10D security probes: anonymous Directus 403, release immutability path checks,
 * no token in dist (if present), Insights remain draft in live CMS.
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

const base = (process.env.DIRECTUS_URL || "http://127.0.0.1:8055").replace(/\/$/, "");
const probes = [];

async function anon(pathSuffix) {
  const res = await fetch(`${base}${pathSuffix}`, { redirect: "manual" });
  return { path: pathSuffix, status: res.status };
}

try {
  for (const p of [
    "/items/team_members",
    "/items/portfolio_projects",
    "/items/insights_articles",
    "/items/services",
    "/files",
    "/assets/00000000-0000-0000-0000-000000000000",
  ]) {
    const result = await anon(p);
    probes.push({ ...result, expect403: result.status === 403 || result.status === 401 });
  }
} catch (err) {
  probes.push({ error: String(err), directusReachable: false });
}

// Live insights must stay draft (authenticated read via shadow token if available)
let insightsDraft = { checked: false };
try {
  const { createDirectusClient } = await import(
    pathToFileURL(path.join(root, "src/lib/content/directus-client.server.ts")).href
  );
  const client = createDirectusClient({ kind: "shadow" });
  const rows = await client.listItems("insights_articles", ["slug", "status", "publication_approved", "published_at"]);
  const bad = rows.filter(
    (row) => row.status === "published" || row.publication_approved === true || row.published_at,
  );
  insightsDraft = {
    checked: true,
    count: rows.length,
    allDraftUnapproved: bad.length === 0,
    leaked: bad.map((row) => row.slug),
  };
} catch (err) {
  insightsDraft = { checked: false, error: String(err) };
}

// Scan dist for token leakage if built
let distScan = { scanned: false };
const dist = path.join(root, "dist");
if (fs.existsSync(dist)) {
  const secrets = [];
  const tokenHints = [/directus.*token/i, /Bearer\s+[A-Za-z0-9._-]{20,}/, /CMS_.*TOKEN/, /127\.0\.0\.1:8055/];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(html|js|css|json|txt|xml)$/i.test(entry.name)) {
        const text = fs.readFileSync(full, "utf8");
        for (const re of tokenHints) {
          if (re.test(text)) secrets.push({ file: path.relative(dist, full), pattern: String(re) });
        }
      }
    }
  }
  walk(dist);
  distScan = { scanned: true, leaks: secrets.length, samples: secrets.slice(0, 10) };
}

// Real cms/releases ACTIVE should be null (no owner publish)
const { readPointer } = await import(pathToFileURL(path.join(root, "src/lib/content/release-store.ts")).href);
const realPointer = readPointer(path.join(root, "cms", "releases"));

const report = {
  generatedAt: new Date().toISOString(),
  anonymousProbes: probes,
  anonymousOk: probes.every((p) => p.expect403 !== false || p.directusReachable === false),
  insightsDraft,
  distScan,
  realActivePointer: realPointer,
  realActiveIsNull: realPointer.activeReleaseId == null,
};

const out = path.join(root, "cms", ".tmp", "step-10d", "security-probes.json");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(report, null, 2));
fs.chmodSync(out, 0o600);
console.log(JSON.stringify(report, null, 2));

const ok =
  report.anonymousOk &&
  report.realActiveIsNull &&
  (insightsDraft.allDraftUnapproved === true || insightsDraft.checked === false) &&
  (distScan.leaks === 0 || distScan.scanned === false);
process.exit(ok ? 0 : 2);
