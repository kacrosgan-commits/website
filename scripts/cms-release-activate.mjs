#!/usr/bin/env node
/**
 * Activate an immutable release (flip ACTIVE pointer).
 * Requires explicit release ID + expected hash + confirmation token.
 *
 * Confirmation (pick one):
 *   CMS_RELEASE_CONFIRM="<releaseId>:<contentHash>"
 *   Interactive TTY prompt typing the exact releaseId
 *
 * --yes alone is NOT sufficient.
 */
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const releaseId = arg("--release");
const expectedHash = arg("--hash");
if (!releaseId || !expectedHash) {
  console.error("Usage: cms:release:activate --release <id> --hash <sha256>");
  console.error('Confirm with CMS_RELEASE_CONFIRM="<id>:<hash>" or interactive prompt.');
  process.exit(1);
}

const { activateRelease, readRelease, getReleaseRoot } = await import(
  pathToFileURL(path.join(root, "src/lib/content/release-store.ts")).href
);
const { verifyReleaseSnapshot } = await import(pathToFileURL(path.join(root, "src/lib/content/release-builder.ts")).href);

const releaseRoot = process.env.CMS_RELEASE_ROOT ? path.resolve(process.env.CMS_RELEASE_ROOT) : getReleaseRoot();
const snapshot = readRelease(releaseId, releaseRoot);
const structural = verifyReleaseSnapshot(snapshot);
if (!structural.ok) {
  console.error(JSON.stringify({ ok: false, error: "verify failed", errors: structural.errors }, null, 2));
  process.exit(2);
}
if (snapshot.contentHash !== expectedHash) {
  console.error(JSON.stringify({ ok: false, error: "hash mismatch before activation" }, null, 2));
  process.exit(2);
}

const confirmEnv = (process.env.CMS_RELEASE_CONFIRM || "").trim();
const expectedConfirm = `${releaseId}:${expectedHash}`;
let confirmed = confirmEnv === expectedConfirm;

if (!confirmed && process.stdin.isTTY) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise((resolve) => {
    rl.question(
      `Type the exact release ID to activate (${releaseId}): `,
      (value) => {
        rl.close();
        resolve(value.trim());
      },
    );
  });
  confirmed = answer === releaseId;
}

if (!confirmed) {
  console.error(
    JSON.stringify(
      {
        ok: false,
        error: "Activation denied: missing or invalid confirmation",
        hint: `Set CMS_RELEASE_CONFIRM="${expectedConfirm}" or run interactively`,
      },
      null,
      2,
    ),
  );
  process.exit(3);
}

const actor = process.env.CMS_RELEASE_ACTOR || "local-owner";
const pointer = activateRelease({ releaseId, expectedHash, actor, root: releaseRoot });

const result = {
  ok: true,
  activated: { releaseId, contentHash: expectedHash },
  pointer,
  actor,
  note: "Public Astro cms builds will now read this release. Draft Directus edits still do not affect output until a new release is activated.",
};

const outDir = path.join(root, "cms", ".tmp", "step-10d");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "last-activate.json"), JSON.stringify(result, null, 2));
fs.chmodSync(path.join(outDir, "last-activate.json"), 0o600);

console.log(JSON.stringify(result, null, 2));
