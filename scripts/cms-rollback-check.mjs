#!/usr/bin/env node
/**
 * Verifies local-mode rollback: CONTENT_SOURCE=local builds without Directus.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

const env = {
  ...process.env,
  CONTENT_SOURCE: "local",
  // Intentionally break Directus reachability for this check.
  DIRECTUS_URL: "http://127.0.0.1:9",
  DIRECTUS_SHADOW_TOKEN: "",
  DIRECTUS_BUILD_TOKEN: "",
};

const result = spawnSync("npm", ["run", "build"], {
  cwd: root,
  env,
  encoding: "utf8",
  timeout: 180_000,
});

const distHtml = fs.existsSync(path.join(root, "dist"))
  ? [...fs.readdirSync(path.join(root, "dist"), { recursive: true })].filter((f) => String(f).endsWith(".html")).length
  : 0;

const leaked = [];
function scan(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) scan(abs);
    else if (/\.(html|js|css|xml|txt|json)$/i.test(entry.name)) {
      const text = fs.readFileSync(abs, "utf8");
      if (text.includes("DIRECTUS_SHADOW_TOKEN") || text.includes("DIRECTUS_BUILD_TOKEN") || text.includes("ADMIN_TOKEN")) {
        leaked.push(abs);
      }
      if (/access_token=/.test(text)) leaked.push(abs + "#access_token");
      if (/127\.0\.0\.1:8055/.test(text) && entry.name.endsWith(".html")) leaked.push(abs + "#directus_url");
    }
  }
}
scan(path.join(root, "dist"));

const ok = result.status === 0 && distHtml >= 30 && leaked.length === 0;
console.log(
  JSON.stringify(
    {
      ok,
      build_exit: result.status,
      html_pages: distHtml,
      secret_leaks: leaked.length,
      content_source: "local",
      directus_required: false,
    },
    null,
    2,
  ),
);
if (!ok) {
  if (result.status !== 0) console.error(result.stderr?.slice(-2000) || result.stdout?.slice(-2000));
  process.exit(1);
}
