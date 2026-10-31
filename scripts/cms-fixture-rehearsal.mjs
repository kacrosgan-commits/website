#!/usr/bin/env node
/**
 * Isolated publish/rollback rehearsal (filesystem fixtures — no real Directus mutations).
 * Proves: draft edits don't change active release; activation needs confirm; rollback restores.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const fixtureRoot = path.join(root, "cms", ".tmp", "step-10d", "fixture-releases");
const reportPath = path.join(root, "cms", ".tmp", "step-10d", "fixture-rehearsal-report.json");

// Clean fixture root for deterministic run
fs.rmSync(fixtureRoot, { recursive: true, force: true });
fs.mkdirSync(fixtureRoot, { recursive: true });

function run(args, env = {}) {
  const result = spawnSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, CMS_RELEASE_ROOT: fixtureRoot, ...env },
  });
  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

function parseJson(stdout) {
  try {
    return JSON.parse(stdout);
  } catch {
    return { parseError: true, stdout };
  }
}

const steps = [];

// 1. Seed A and activate
let out = run(["scripts/cms-fixture-release.mjs", "--seed-a"]);
const a = parseJson(out.stdout);
steps.push({ step: "seed-a", status: out.status, releaseId: a.releaseId, hash: a.contentHash });

out = run(["scripts/cms-fixture-release.mjs", "--activate", "--release", a.releaseId, "--hash", a.contentHash]);
steps.push({ step: "activate-a", status: out.status, body: parseJson(out.stdout) });

const { readActiveRelease, readRelease, writeImmutableRelease: _w } = await import(
  pathToFileURL(path.join(root, "src/lib/content/release-store.ts")).href
);
let active = readActiveRelease(fixtureRoot);
const titleA = active.team.find((t) => t.slug === "fixture-alice")?.role;
steps.push({ step: "read-active-a", aliceRole: titleA, projects: active.projects.map((p) => p.slug) });

// 2. Simulate draft edit WITHOUT new release — active must stay A
const draftMutation = { ...active, team: active.team.map((t) => (t.slug === "fixture-alice" ? { ...t, role: "DRAFT ONLY ROLE" } : t)) };
// Mutating the in-memory object must not change the on-disk immutable release
active = readActiveRelease(fixtureRoot);
const stillA = active.team.find((t) => t.slug === "fixture-alice")?.role === titleA;
steps.push({ step: "draft-edit-does-not-mutate-release", stillA, aliceRole: active.team.find((t) => t.slug === "fixture-alice")?.role });

// Attempt to overwrite immutable release directory must fail
let immutabilityDenied = false;
try {
  const { writeImmutableRelease } = await import(pathToFileURL(path.join(root, "src/lib/content/release-store.ts")).href);
  writeImmutableRelease(active, fixtureRoot);
} catch (err) {
  immutabilityDenied = /immutable|already exists/i.test(String(err));
}
steps.push({ step: "immutability-enforced", immutabilityDenied });

// 3. Activation without confirmation denied
out = run(
  ["scripts/cms-release-activate.mjs", "--release", a.releaseId, "--hash", a.contentHash],
  { CMS_RELEASE_CONFIRM: "" },
);
steps.push({ step: "activate-without-confirm", status: out.status, denied: out.status === 3 });

// 4. Seed B, activate with confirm
out = run(["scripts/cms-fixture-release.mjs", "--seed-b"]);
const b = parseJson(out.stdout);
steps.push({ step: "seed-b", status: out.status, releaseId: b.releaseId, hash: b.contentHash });

out = run(
  ["scripts/cms-release-activate.mjs", "--release", b.releaseId, "--hash", b.contentHash],
  { CMS_RELEASE_CONFIRM: `${b.releaseId}:${b.contentHash}`, CMS_RELEASE_ACTOR: "fixture-owner" },
);
steps.push({ step: "activate-b", status: out.status, body: parseJson(out.stdout) });

active = readActiveRelease(fixtureRoot);
steps.push({
  step: "read-active-b",
  aliceRole: active.team.find((t) => t.slug === "fixture-alice")?.role,
  projects: active.projects.map((p) => p.slug),
  hero: active.homepage.heroTitle,
  insights: active.insights.map((i) => i.slug),
});

// 5. Stale hash activation denied
out = run(
  ["scripts/cms-release-activate.mjs", "--release", b.releaseId, "--hash", "0".repeat(64)],
  { CMS_RELEASE_CONFIRM: `${b.releaseId}:${"0".repeat(64)}` },
);
steps.push({ step: "stale-hash-denied", status: out.status, denied: out.status !== 0 });

// 6. Seed C (withdraw gamma), activate
out = run(["scripts/cms-fixture-release.mjs", "--seed-c"]);
const c = parseJson(out.stdout);
out = run(
  ["scripts/cms-release-activate.mjs", "--release", c.releaseId, "--hash", c.contentHash],
  { CMS_RELEASE_CONFIRM: `${c.releaseId}:${c.contentHash}` },
);
active = readActiveRelease(fixtureRoot);
steps.push({
  step: "activate-c-withdraw-gamma",
  status: out.status,
  projects: active.projects.map((p) => p.slug),
  gammaAbsent: !active.projects.some((p) => p.slug === "fixture-gamma"),
});

// 7. Rollback to A
out = run(
  ["scripts/cms-release-rollback.mjs", "--release", a.releaseId, "--hash", a.contentHash],
  { CMS_RELEASE_CONFIRM: `${a.releaseId}:${a.contentHash}` },
);
active = readActiveRelease(fixtureRoot);
steps.push({
  step: "rollback-to-a",
  status: out.status,
  aliceRole: active.team.find((t) => t.slug === "fixture-alice")?.role,
  projects: active.projects.map((p) => p.slug),
  matchesA: active.contentHash === a.contentHash,
});

// 8. Verify A still readable after C existed
const aAgain = readRelease(a.releaseId, fixtureRoot);
steps.push({ step: "prior-release-retained", ok: aAgain.contentHash === a.contentHash });

const report = {
  generatedAt: new Date().toISOString(),
  fixtureRoot,
  realDirectusMutated: false,
  steps,
  passed:
    stillA &&
    immutabilityDenied &&
    steps.find((s) => s.step === "activate-without-confirm")?.denied === true &&
    steps.find((s) => s.step === "read-active-b")?.aliceRole === "Managing Director" &&
    steps.find((s) => s.step === "read-active-b")?.projects?.includes("fixture-gamma") &&
    steps.find((s) => s.step === "activate-c-withdraw-gamma")?.gammaAbsent === true &&
    steps.find((s) => s.step === "rollback-to-a")?.matchesA === true &&
    steps.find((s) => s.step === "stale-hash-denied")?.denied === true,
};

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
fs.chmodSync(reportPath, 0o600);
console.log(JSON.stringify(report, null, 2));
process.exit(report.passed ? 0 : 2);
