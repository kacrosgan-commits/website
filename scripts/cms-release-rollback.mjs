#!/usr/bin/env node
/**
 * Rollback ACTIVE pointer to a prior immutable release.
 * Same confirmation rules as activate.
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
  console.error("Usage: cms:release:rollback --release <id> --hash <sha256>");
  process.exit(1);
}

const { rollbackRelease, readRelease, getReleaseRoot, readPointer } = await import(
  pathToFileURL(path.join(root, "src/lib/content/release-store.ts")).href
);

const releaseRoot = process.env.CMS_RELEASE_ROOT ? path.resolve(process.env.CMS_RELEASE_ROOT) : getReleaseRoot();
const before = readPointer(releaseRoot);
const snapshot = readRelease(releaseId, releaseRoot);
if (snapshot.contentHash !== expectedHash) {
  console.error(JSON.stringify({ ok: false, error: "hash mismatch" }, null, 2));
  process.exit(2);
}

const confirmEnv = (process.env.CMS_RELEASE_CONFIRM || "").trim();
const expectedConfirm = `${releaseId}:${expectedHash}`;
let confirmed = confirmEnv === expectedConfirm;

if (!confirmed && process.stdin.isTTY) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise((resolve) => {
    rl.question(`Type the exact release ID to rollback to (${releaseId}): `, (value) => {
      rl.close();
      resolve(value.trim());
    });
  });
  confirmed = answer === releaseId;
}

if (!confirmed) {
  console.error(JSON.stringify({ ok: false, error: "Rollback denied: confirmation required" }, null, 2));
  process.exit(3);
}

const actor = process.env.CMS_RELEASE_ACTOR || "local-owner";
const pointer = rollbackRelease({ releaseId, expectedHash, actor, root: releaseRoot });

const result = {
  ok: true,
  before,
  after: pointer,
  actor,
};

const outDir = path.join(root, "cms", ".tmp", "step-10d");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "last-rollback.json"), JSON.stringify(result, null, 2));
fs.chmodSync(path.join(outDir, "last-rollback.json"), 0o600);
console.log(JSON.stringify(result, null, 2));
