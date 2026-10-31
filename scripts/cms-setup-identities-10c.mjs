#!/usr/bin/env node
/**
 * Creates/updates Directus Core read-only identities for Astro builds.
 * Requires cms/.env ADMIN_TOKEN once. Writes DIRECTUS_SHADOW_TOKEN / DIRECTUS_BUILD_TOKEN
 * into the project .env (gitignored). Never prints token values.
 *
 * Note: Directus Core rejects custom permission filter rules
 * (`custom_permission_rules_enabled`). Identities are read-only with app_access=false;
 * publication gates are enforced in Astro application code.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const cmsEnv = path.join(root, "cms/.env");
const projectEnv = path.join(root, ".env");

function loadEnv(filePath) {
  return Object.fromEntries(
    fs
      .readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const i = line.indexOf("=");
        return [line.slice(0, i), line.slice(i + 1)];
      }),
  );
}

function upsert(src, key, val) {
  const line = `${key}=${val}`;
  if (new RegExp(`^${key}=`, "m").test(src)) return src.replace(new RegExp(`^${key}=.*$`, "m"), line);
  return `${src.replace(/\s*$/, "")}\n${line}\n`;
}

const env = loadEnv(cmsEnv);
const base = (env.PUBLIC_URL || "http://127.0.0.1:8055").replace(/\/$/, "");
const admin = env.ADMIN_TOKEN;
if (!admin) {
  console.error("cms/.env ADMIN_TOKEN required for one-time identity setup");
  process.exit(1);
}

async function api(method, urlPath, body) {
  const response = await fetch(`${base}${urlPath}`, {
    method,
    headers: { Authorization: `Bearer ${admin}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data };
}

async function ensureNamed(listPath, name, createBody) {
  const listed = await api("GET", `${listPath}?limit=-1`);
  const found = (listed.data?.data || []).find((row) => row.name === name);
  if (found) return found.id;
  const created = await api("POST", listPath, createBody);
  if (!created.ok) throw new Error(`create ${name}: ${created.status}`);
  return created.data.data.id;
}

const shadowPolicy = await ensureNamed("/policies", "Astro Shadow Auditor", {
  name: "Astro Shadow Auditor",
  icon: "key",
  admin_access: false,
  app_access: false,
});
const buildPolicy = await ensureNamed("/policies", "Astro Build Reader", {
  name: "Astro Build Reader",
  icon: "key",
  admin_access: false,
  app_access: false,
});
const shadowRole = await ensureNamed("/roles", "Astro Shadow Auditor", { name: "Astro Shadow Auditor", icon: "badge" });
const buildRole = await ensureNamed("/roles", "Astro Build Reader", { name: "Astro Build Reader", icon: "badge" });

async function ensureAccess(roleId, policyId) {
  const listed = await api("GET", "/access?limit=-1");
  if ((listed.data?.data || []).some((row) => row.role === roleId && row.policy === policyId)) return;
  await api("POST", "/access", { role: roleId, policy: policyId });
}
await ensureAccess(shadowRole, shadowPolicy);
await ensureAccess(buildRole, buildPolicy);

const collections = [
  "team_members",
  "portfolio_projects",
  "portfolio_screenshots",
  "services",
  "insights_articles",
  "homepage_content",
  "site_settings",
  "page_sections",
  "directus_files",
];

async function ensureRead(policyId) {
  for (const collection of collections) {
    const listed = await api(
      "GET",
      `/permissions?filter[policy][_eq]=${policyId}&filter[collection][_eq]=${collection}&filter[action][_eq]=read&limit=5`,
    );
    if ((listed.data?.data || []).length) continue;
    const created = await api("POST", "/permissions", {
      policy: policyId,
      collection,
      action: "read",
      fields: ["*"],
      permissions: {},
    });
    if (!created.ok) console.error("perm", collection, created.status);
  }
}
await ensureRead(shadowPolicy);
await ensureRead(buildPolicy);

async function ensureUser(email, roleId, token, password, lastName) {
  const listed = await api("GET", `/users?filter[email][_eq]=${encodeURIComponent(email)}&fields=id`);
  const found = (listed.data?.data || [])[0];
  if (found) {
    await api("PATCH", `/users/${found.id}`, { role: roleId, token, status: "active", password });
    return found.id;
  }
  const created = await api("POST", "/users", {
    email,
    password,
    role: roleId,
    token,
    status: "active",
    first_name: "Astro",
    last_name: lastName,
  });
  if (!created.ok) throw new Error(`user ${email}: ${created.status}`);
  return created.data.data.id;
}

const shadowToken = crypto.randomBytes(32).toString("hex");
const buildToken = crypto.randomBytes(32).toString("hex");
await ensureUser("astro.shadow@example.com", shadowRole, shadowToken, crypto.randomBytes(24).toString("base64url"), "Shadow");
await ensureUser("astro.build@example.com", buildRole, buildToken, crypto.randomBytes(24).toString("base64url"), "Build");

let text = fs.existsSync(projectEnv) ? fs.readFileSync(projectEnv, "utf8") : "";
text = upsert(text, "CONTENT_SOURCE", "local");
text = upsert(text, "DIRECTUS_URL", "http://127.0.0.1:8055");
text = upsert(text, "DIRECTUS_SHADOW_TOKEN", shadowToken);
text = upsert(text, "DIRECTUS_BUILD_TOKEN", buildToken);
fs.writeFileSync(projectEnv, text, { mode: 0o600 });
fs.chmodSync(projectEnv, 0o600);

const shadowProbe = await fetch(`${base}/items/team_members?limit=1`, {
  headers: { Authorization: `Bearer ${shadowToken}` },
});
const writeProbe = await fetch(`${base}/items/team_members`, {
  method: "POST",
  headers: { Authorization: `Bearer ${shadowToken}`, "Content-Type": "application/json" },
  body: JSON.stringify({ slug: "x" }),
});

console.log(
  JSON.stringify(
    {
      ok: shadowProbe.status === 200 && writeProbe.status === 403,
      shadow_read: shadowProbe.status,
      shadow_write: writeProbe.status,
      core_custom_filters: "blocked_by_license",
      project_env: ".env updated (gitignored)",
    },
    null,
    2,
  ),
);
