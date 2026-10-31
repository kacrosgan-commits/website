#!/usr/bin/env node
/**
 * Non-mutating CMS publication readiness check.
 * Expected against current Step 10B staged data: FAIL CLOSED (exit 1).
 */
import fs from "node:fs";
import path from "node:path";

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

const base = (process.env.DIRECTUS_URL || "http://127.0.0.1:8055").replace(/\/$/, "");
const token = process.env.DIRECTUS_BUILD_TOKEN;
if (!token) {
  console.error("DIRECTUS_BUILD_TOKEN missing");
  process.exit(1);
}

async function list(collection, fields) {
  const url = new URL(`${base}/items/${collection}`);
  url.searchParams.set("fields", fields);
  url.searchParams.set("limit", "-1");
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`${collection} HTTP ${response.status}`);
  return (await response.json()).data || [];
}

function eligible(row) {
  return row.status === "published" && row.publication_approved === true && Boolean(row.published_at);
}

const team = await list("team_members", "slug,status,publication_approved,published_at");
const projects = await list("portfolio_projects", "slug,status,publication_approved,published_at");
const shots = await list("portfolio_screenshots", "id,project,status");
const services = await list("services", "slug,status,publication_approved,published_at");
const insights = await list("insights_articles", "slug,status,publication_approved,published_at");

const counts = {
  team_total: team.length,
  team_eligible: team.filter(eligible).length,
  projects_total: projects.length,
  projects_eligible: projects.filter(eligible).length,
  screenshots_total: shots.length,
  services_total: services.length,
  services_eligible: services.filter(eligible).length,
  insights_total: insights.length,
  insights_eligible: insights.filter(eligible).length,
};

const blockers = [];
if (counts.team_eligible < 9) blockers.push(`team eligible ${counts.team_eligible}/9`);
if (counts.projects_eligible < 6) blockers.push(`projects eligible ${counts.projects_eligible}/6`);
if (counts.services_eligible < 8) blockers.push(`services eligible ${counts.services_eligible}/8`);
// screenshots follow projects; with 0 eligible projects, screenshots baseline fails
if (counts.projects_eligible < 6) blockers.push("screenshots baseline blocked until projects are approved");

const report = {
  generated_at: new Date().toISOString(),
  ok: blockers.length === 0,
  counts,
  blockers,
  decision:
    blockers.length === 0
      ? "CONTENT_SOURCE=cms may proceed after media materialization"
      : "CONTENT_SOURCE=cms must FAIL CLOSED — keep local until owner reconciliation",
};

const outDir = path.join(root, "cms/.tmp");
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, "step-10c-readiness.json");
fs.writeFileSync(out, JSON.stringify(report, null, 2));
fs.chmodSync(out, 0o600);
console.log(JSON.stringify({ ok: report.ok, counts, blockers, report: "cms/.tmp/step-10c-readiness.json" }, null, 2));
process.exit(report.ok ? 0 : 2);
