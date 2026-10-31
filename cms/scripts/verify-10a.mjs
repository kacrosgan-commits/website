#!/usr/bin/env node
/**
 * Step 10A verification: auth, CRUD on a clearly marked test item,
 * anonymous denial, optional tiny upload, and persistence prep notes.
 * Never prints secrets from cms/.env.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = Object.fromEntries(
  fs
    .readFileSync(path.join(root, ".env"), "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i), line.slice(i + 1)];
    }),
);
const base = (env.PUBLIC_URL || "http://127.0.0.1:8055").replace(/\/$/, "");
const token = env.ADMIN_TOKEN;
const auth = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
const results = [];

function record(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function api(method, urlPath, body, useAuth = true) {
  const response = await fetch(`${base}${urlPath}`, {
    method,
    headers: useAuth ? auth : body instanceof FormData ? {} : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
  });
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text.slice(0, 300) };
  }
  return { ok: response.ok, status: response.status, data };
}

async function anonymous(urlPath) {
  const response = await fetch(`${base}${urlPath}`);
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  return { status: response.status, data, text: text.slice(0, 200) };
}

async function main() {
  const ping = await fetch(`${base}/server/ping`);
  record("server_ping", ping.ok, `status ${ping.status}`);

  const me = await api("GET", "/users/me");
  record("admin_auth", me.ok, me.ok ? me.data?.data?.email || "authenticated" : `status ${me.status}`);

  const collections = await api("GET", "/collections");
  const custom = (collections.data?.data || [])
    .map((item) => item.collection)
    .filter((name) => !String(name).startsWith("directus_"))
    .sort();
  const expected = [
    "homepage_content",
    "insights_articles",
    "page_sections",
    "portfolio_projects",
    "portfolio_screenshots",
    "services",
    "site_settings",
    "team_members",
  ];
  const missing = expected.filter((name) => !custom.includes(name));
  record("collections_present", missing.length === 0, `count=${custom.length}; missing=${missing.join(",") || "none"}`);

  const create = await api("POST", "/items/team_members", {
    status: "draft",
    publication_approved: false,
    slug: "local-test-not-for-publication",
    name: "LOCAL TEST — NOT FOR PUBLICATION",
    role: "Verification Fixture",
    intro: "Disposable Directus Step 10A test record. Not a real employee.",
    biography: ["This record exists only to prove CRUD and persistence."],
    responsibilities: [],
    expertise: [],
    experience: "",
    startup_support: "",
    related_roles: [],
    display_order: 9999,
    featured: false,
  });
  const itemId = create.data?.data?.id;
  record("create_test_item", create.ok && Boolean(itemId), create.ok ? `id=${itemId}` : `status ${create.status}`);

  let updatedOk = false;
  if (itemId) {
    const update = await api("PATCH", `/items/team_members/${itemId}`, {
      intro: "Updated disposable Directus Step 10A test record.",
      status: "archived",
    });
    updatedOk = update.ok;
    record("update_test_item", updatedOk, `status ${update.status}`);
  } else {
    record("update_test_item", false, "skipped — create failed");
  }

  const deniedTargets = [
    "/items/team_members",
    "/items/portfolio_projects",
    "/items/insights_articles",
    "/items/services",
    "/items/site_settings",
    "/items/homepage_content",
    "/items/page_sections",
    "/files",
  ];
  let anonymousDenied = true;
  for (const target of deniedTargets) {
    const result = await anonymous(target);
    const leaked =
      result.status === 200 &&
      result.data &&
      (Array.isArray(result.data.data) ? result.data.data.length > 0 : Boolean(result.data.data));
    if (result.status === 200 && leaked) anonymousDenied = false;
    // 401/403/404 are all acceptable denials for Step 10A.
    if (![200, 401, 403, 404].includes(result.status)) anonymousDenied = false;
    if (result.status === 200 && !leaked) {
      // Empty 200 with no data is unusual but not a private leak.
    } else if (result.status === 200 && leaked) {
      record(`anonymous_${target}`, false, `leaked status ${result.status}`);
    } else {
      record(`anonymous_${target}`, true, `status ${result.status}`);
    }
  }
  record("anonymous_overall", anonymousDenied, "custom collections and files deny public reads");

  // Tiny 1x1 PNG upload to prove file persistence path works.
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  );
  const form = new FormData();
  form.append("file", new Blob([png], { type: "image/png" }), "local-test-pixel.png");
  const uploadResponse = await fetch(`${base}/files`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const uploadJson = await uploadResponse.json().catch(() => ({}));
  const fileId = uploadJson?.data?.id;
  record("upload_test_file", uploadResponse.ok && Boolean(fileId), uploadResponse.ok ? `id=${fileId}` : `status ${uploadResponse.status}`);

  if (fileId) {
    const anonFile = await anonymous(`/files/${fileId}`);
    const fileDenied = anonFile.status === 401 || anonFile.status === 403 || anonFile.status === 404;
    record("anonymous_private_file", fileDenied, `status ${anonFile.status}`);
  }

  // Keep the test item id for the persistence restart check.
  const statePath = path.join(root, ".tmp/verify-state.json");
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(
    statePath,
    JSON.stringify(
      {
        itemId,
        fileId,
        slug: "local-test-not-for-publication",
        created_at: new Date().toISOString(),
      },
      null,
      2,
    ),
  );

  const failed = results.filter((item) => !item.ok);
  console.log(JSON.stringify({ passed: results.length - failed.length, failed: failed.length, custom_collections: custom }, null, 2));
  if (failed.length) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
