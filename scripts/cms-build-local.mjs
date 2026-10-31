#!/usr/bin/env node
/**
 * Local CMS build helper:
 *   verify active release → materialize media → CONTENT_SOURCE=cms astro build
 * Does NOT activate or approve anything. Fails closed without an active release.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const releaseRoot = process.env.CMS_RELEASE_ROOT || path.join(root, "cms", "releases");

function run(cmd, args, env = {}) {
  const result = spawnSync(cmd, args, {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, ...env },
    stdio: "inherit",
  });
  return result.status ?? 1;
}

const verify = run(process.execPath, ["scripts/cms-release-verify.mjs", "--active"], {
  CMS_RELEASE_ROOT: releaseRoot,
});
if (verify !== 0) {
  console.error("cms:build-local aborted: active release verify failed");
  process.exit(verify);
}

const media = run(process.execPath, ["scripts/cms-build-media.mjs"], {
  CMS_RELEASE_ROOT: releaseRoot,
});
if (media !== 0) {
  console.error("cms:build-local aborted: media materialization failed");
  process.exit(media);
}

// Build to a temp outDir then promote — Astro uses dist/ by default; document restore via local rebuild.
const status = run("npm", ["run", "build"], {
  CONTENT_SOURCE: "cms",
  CMS_RELEASE_ROOT: releaseRoot,
});

const outDir = path.join(root, "cms", ".tmp", "step-10d");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "last-build-local.json"),
  JSON.stringify({ ok: status === 0, at: new Date().toISOString(), releaseRoot }, null, 2),
);
process.exit(status);
