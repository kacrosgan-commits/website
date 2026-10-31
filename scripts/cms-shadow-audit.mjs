#!/usr/bin/env node
/**
 * CONTENT_SOURCE=cms-shadow style private parity audit.
 * Writes cms/.tmp/step-10c-shadow-parity.json (gitignored). Never prints tokens.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

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
loadEnvFile(path.join(root, "cms/.env"));

const base = (process.env.DIRECTUS_URL || "http://127.0.0.1:8055").replace(/\/$/, "");
const token = process.env.DIRECTUS_SHADOW_TOKEN;
if (!token) {
  console.error("DIRECTUS_SHADOW_TOKEN missing. Create scoped shadow reader first.");
  process.exit(1);
}

async function list(collection, fields) {
  const rows = [];
  let page = 1;
  for (;;) {
    const url = new URL(`${base}/items/${collection}`);
    url.searchParams.set("fields", fields);
    url.searchParams.set("limit", "100");
    url.searchParams.set("page", String(page));
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error(`${collection} HTTP ${response.status}`);
    const json = await response.json();
    const batch = json.data || [];
    rows.push(...batch);
    if (batch.length < 100) break;
    page += 1;
  }
  return rows;
}

function sha(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

const team = await list("team_members", "slug,name,role,status,publication_approved,published_at,portrait,display_order");
const projects = await list("portfolio_projects", "slug,title,status,publication_approved,published_at");
const shots = await list("portfolio_screenshots", "id,project,sort,checksum_sha256,alt");
const services = await list("services", "slug,title,status,publication_approved,published_at");
const insights = await list("insights_articles", "slug,title,status,publication_approved,published_at,body");

const expectedTeam = [
  "founder-ceo",
  "cofounder-cto",
  "cfo",
  "project-manager",
  "senior-fullstack-developer",
  "ai-engineer",
  "mobile-app-developer",
  "uiux-product-designer",
  "qa-devops-engineer",
];
const expectedProjects = [
  "scaleup-systems",
  "medastare",
  "gain-energy-upstrima",
  "gowabi",
  "daniela-diamonds",
  "born-to-rock",
];

const issues = [];
if (team.length !== 9) issues.push({ severity: "error", message: `team count ${team.length}` });
if (projects.length !== 6) issues.push({ severity: "error", message: `projects count ${projects.length}` });
if (shots.length !== 18) issues.push({ severity: "error", message: `screenshots count ${shots.length}` });
if (services.length !== 8) issues.push({ severity: "error", message: `services count ${services.length}` });
if (insights.length !== 12) issues.push({ severity: "error", message: `insights count ${insights.length}` });

for (const slug of expectedTeam) {
  if (!team.some((row) => row.slug === slug)) issues.push({ severity: "error", message: `missing team ${slug}` });
}
for (const slug of expectedProjects) {
  if (!projects.some((row) => row.slug === slug)) issues.push({ severity: "error", message: `missing project ${slug}` });
}

const eligible = {
  team: team.filter((r) => r.status === "published" && r.publication_approved === true && r.published_at).length,
  projects: projects.filter((r) => r.status === "published" && r.publication_approved === true && r.published_at).length,
  services: services.filter((r) => r.status === "published" && r.publication_approved === true && r.published_at).length,
  insights: insights.filter((r) => r.status === "published" && r.publication_approved === true && r.published_at).length,
};

const adrian = team.find((r) => r.name === "Adrian Cruz");
const matheus = team.find((r) => r.name === "Matheus Pereira");
if (!adrian || !matheus || adrian.portrait === matheus.portrait) {
  issues.push({ severity: "error", message: "Adrian/Matheus portraits not distinct" });
}

for (const article of insights) {
  if (article.status === "published" || article.publication_approved === true || article.published_at) {
    issues.push({ severity: "error", message: `insight ${article.slug} is not fully draft/unapproved` });
  }
}

const report = {
  generated_at: new Date().toISOString(),
  mode: "cms-shadow",
  counts: {
    team: team.length,
    projects: projects.length,
    screenshots: shots.length,
    services: services.length,
    insights: insights.length,
  },
  eligible_public_counts: eligible,
  issues,
  body_fingerprints: insights.map((article) => ({
    slug: article.slug,
    body_sha256: sha(article.body || ""),
  })),
  ok: issues.filter((i) => i.severity === "error").length === 0,
  note: "Public Astro output remains local. This audit is private and must not leak draft bodies into dist.",
};

const outDir = path.join(root, "cms/.tmp");
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, "step-10c-shadow-parity.json");
fs.writeFileSync(out, JSON.stringify(report, null, 2));
fs.chmodSync(out, 0o600);

console.log(
  JSON.stringify(
    {
      ok: report.ok,
      counts: report.counts,
      eligible_public_counts: report.eligible_public_counts,
      issue_count: issues.length,
      report: "cms/.tmp/step-10c-shadow-parity.json",
    },
    null,
    2,
  ),
);
process.exit(report.ok ? 0 : 1);
