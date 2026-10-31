import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type { PublishedSiteSnapshot, ReleaseAuditEvent, ReleasePointer } from "./release-types.ts";

export function getReleaseRoot(env: NodeJS.ProcessEnv = process.env): string {
  const override = (env.CMS_RELEASE_ROOT || "").trim();
  if (override) return path.resolve(override);
  return path.join(process.cwd(), "cms", "releases");
}

function pointerPath(root: string) {
  return path.join(root, "ACTIVE.json");
}

function releaseDir(root: string, releaseId: string) {
  return path.join(root, releaseId);
}

function auditPath(root: string) {
  return path.join(root, "audit.jsonl");
}

/** Canonical JSON for hashing — stable key order via recursive sort. */
export function canonicalJson(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      out[key] = sortValue((value as Record<string, unknown>)[key]);
    }
    return out;
  }
  return value;
}

export function hashSnapshot(snapshot: Omit<PublishedSiteSnapshot, "contentHash"> | PublishedSiteSnapshot): string {
  const { contentHash: _ignored, ...rest } = snapshot as PublishedSiteSnapshot;
  return crypto.createHash("sha256").update(canonicalJson(rest)).digest("hex");
}

export function ensureReleaseRoot(root = getReleaseRoot()) {
  fs.mkdirSync(root, { recursive: true });
  const gitkeep = path.join(root, ".gitkeep");
  if (!fs.existsSync(gitkeep)) fs.writeFileSync(gitkeep, "");
  return root;
}

export function readPointer(root = getReleaseRoot()): ReleasePointer {
  const file = pointerPath(root);
  if (!fs.existsSync(file)) {
    return { activeReleaseId: null, activeContentHash: null, updatedAt: null, updatedBy: null };
  }
  return JSON.parse(fs.readFileSync(file, "utf8")) as ReleasePointer;
}

export function writePointer(pointer: ReleasePointer, root = getReleaseRoot()) {
  ensureReleaseRoot(root);
  const tmp = pointerPath(root) + `.tmp-${process.pid}`;
  fs.writeFileSync(tmp, JSON.stringify(pointer, null, 2));
  fs.chmodSync(tmp, 0o600);
  fs.renameSync(tmp, pointerPath(root));
}

export function writeImmutableRelease(snapshot: PublishedSiteSnapshot, root = getReleaseRoot()) {
  ensureReleaseRoot(root);
  const dir = releaseDir(root, snapshot.releaseId);
  if (fs.existsSync(dir)) {
    throw new Error(`Release ${snapshot.releaseId} already exists and is immutable`);
  }
  fs.mkdirSync(dir, { recursive: true });
  const expected = hashSnapshot(snapshot);
  if (snapshot.contentHash !== expected) {
    throw new Error(`Release contentHash mismatch: got ${snapshot.contentHash}, expected ${expected}`);
  }
  const file = path.join(dir, "snapshot.json");
  fs.writeFileSync(file, JSON.stringify(snapshot, null, 2));
  fs.chmodSync(file, 0o400); // read-only
  fs.writeFileSync(path.join(dir, "CONTENT_HASH"), `${snapshot.contentHash}\n`);
  fs.chmodSync(path.join(dir, "CONTENT_HASH"), 0o400);
  return { dir, file };
}

export function readRelease(releaseId: string, root = getReleaseRoot()): PublishedSiteSnapshot {
  const file = path.join(releaseDir(root, releaseId), "snapshot.json");
  if (!fs.existsSync(file)) throw new Error(`Release not found: ${releaseId}`);
  const snapshot = JSON.parse(fs.readFileSync(file, "utf8")) as PublishedSiteSnapshot;
  const expected = hashSnapshot(snapshot);
  if (snapshot.contentHash !== expected) {
    throw new Error(`Release ${releaseId} failed integrity check`);
  }
  return snapshot;
}

export function readActiveRelease(root = getReleaseRoot()): PublishedSiteSnapshot | null {
  const pointer = readPointer(root);
  if (!pointer.activeReleaseId) return null;
  const snapshot = readRelease(pointer.activeReleaseId, root);
  if (pointer.activeContentHash && pointer.activeContentHash !== snapshot.contentHash) {
    throw new Error("Active pointer hash does not match release snapshot");
  }
  return snapshot;
}

export function appendAudit(event: ReleaseAuditEvent, root = getReleaseRoot()) {
  ensureReleaseRoot(root);
  fs.appendFileSync(auditPath(root), `${JSON.stringify(event)}\n`);
  fs.chmodSync(auditPath(root), 0o600);
}

export function listReleases(root = getReleaseRoot()): string[] {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("rel-"))
    .map((entry) => entry.name)
    .sort();
}

export function activateRelease(options: {
  releaseId: string;
  expectedHash: string;
  actor: string;
  root?: string;
}) {
  const root = options.root ?? getReleaseRoot();
  const snapshot = readRelease(options.releaseId, root);
  if (snapshot.contentHash !== options.expectedHash) {
    throw new Error("Activation denied: expected hash does not match release");
  }
  const pointer: ReleasePointer = {
    activeReleaseId: snapshot.releaseId,
    activeContentHash: snapshot.contentHash,
    updatedAt: new Date().toISOString(),
    updatedBy: options.actor,
  };
  writePointer(pointer, root);
  appendAudit(
    {
      at: pointer.updatedAt!,
      action: "activate",
      releaseId: snapshot.releaseId,
      contentHash: snapshot.contentHash,
      actor: options.actor,
    },
    root,
  );
  return pointer;
}

export function rollbackRelease(options: {
  releaseId: string;
  expectedHash: string;
  actor: string;
  root?: string;
}) {
  const root = options.root ?? getReleaseRoot();
  const snapshot = readRelease(options.releaseId, root);
  if (snapshot.contentHash !== options.expectedHash) {
    throw new Error("Rollback denied: expected hash does not match release");
  }
  const pointer = activateRelease({ ...options, root });
  appendAudit(
    {
      at: new Date().toISOString(),
      action: "rollback",
      releaseId: snapshot.releaseId,
      contentHash: snapshot.contentHash,
      actor: options.actor,
      detail: "pointer moved to prior immutable release",
    },
    root,
  );
  return pointer;
}
