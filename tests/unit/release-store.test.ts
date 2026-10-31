import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { buildReleaseCandidate } from "../../src/lib/content/release-builder.ts";
import {
  activateRelease,
  hashSnapshot,
  readActiveRelease,
  readPointer,
  rollbackRelease,
  writeImmutableRelease,
} from "../../src/lib/content/release-store.ts";
import { getPublishedSiteSnapshot } from "../../src/lib/content/published-snapshot.ts";

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "vd-release-"));
}

function sampleSnapshot(releaseId: string, role = "Engineer") {
  return buildReleaseCandidate({
    releaseId,
    publisher: "test",
    notes: "fixture unit test",
    eligibleOnly: false,
    team: [
      {
        slug: "alice",
        name: "Alice",
        role,
        intro: "intro",
        biography: ["bio"],
        responsibilities: [],
        expertise: [],
        experience: "1y",
        startupSupport: "",
        related: [],
        portraitSrc: "/cms-media/a.webp",
        portraitAlt: "Alice",
        displayOrder: 1,
        featured: false,
        sourceApproval: true,
        cmsEligible: true,
      },
    ],
    projects: [
      {
        slug: "proj-a",
        title: "Proj A",
        description: "desc",
        client: "Client",
        industry: "Tech",
        category: "Web",
        services: [],
        technologies: [],
        featured: true,
        homeRank: 1,
        mediaLayout: "web",
        filters: [],
        screenshots: [
          {
            projectSlug: "proj-a",
            sort: 1,
            src: "/cms-media/p.webp",
            fileId: "file-1",
            alt: "shot",
          },
        ],
        sourceApproval: true,
        cmsEligible: true,
        contributionVerified: true,
      },
    ],
    services: [
      {
        slug: "web-application-development",
        title: "Web",
        summary: "summary",
        displayOrder: 1,
        featured: true,
        sourceApproval: true,
        cmsEligible: true,
      },
    ],
    insights: [],
    homepage: {
      heroTitle: "Hello",
      featuredProjectSlugs: ["proj-a"],
      cmsEligible: true,
    },
  });
}

test("immutable release write + content hash integrity", () => {
  const root = tmpRoot();
  const snap = sampleSnapshot("rel-unit-a-001");
  assert.equal(snap.contentHash, hashSnapshot(snap));
  writeImmutableRelease(snap, root);
  assert.throws(() => writeImmutableRelease(snap, root), /immutable|already exists/);
  const active = readActiveRelease(root);
  assert.equal(active, null);
});

test("activation requires matching hash; drafts do not change active snapshot", () => {
  const root = tmpRoot();
  const a = sampleSnapshot("rel-unit-a-002", "Founder");
  const b = sampleSnapshot("rel-unit-b-002", "Managing Director");
  writeImmutableRelease(a, root);
  writeImmutableRelease(b, root);

  assert.throws(
    () => activateRelease({ releaseId: a.releaseId, expectedHash: "deadbeef", actor: "t", root }),
    /hash/,
  );

  activateRelease({ releaseId: a.releaseId, expectedHash: a.contentHash, actor: "owner", root });
  let active = readActiveRelease(root)!;
  assert.equal(active.team[0].role, "Founder");

  // Simulate "draft edit" by mutating a copy — on-disk A unchanged
  const mutated = structuredClone(active);
  mutated.team[0].role = "DRAFT";
  active = readActiveRelease(root)!;
  assert.equal(active.team[0].role, "Founder");

  activateRelease({ releaseId: b.releaseId, expectedHash: b.contentHash, actor: "owner", root });
  active = readActiveRelease(root)!;
  assert.equal(active.team[0].role, "Managing Director");

  rollbackRelease({ releaseId: a.releaseId, expectedHash: a.contentHash, actor: "owner", root });
  active = readActiveRelease(root)!;
  assert.equal(active.contentHash, a.contentHash);
  assert.equal(readPointer(root).activeReleaseId, a.releaseId);
});

test("getPublishedSiteSnapshot fails closed without active pointer", () => {
  const root = tmpRoot();
  assert.throws(() => getPublishedSiteSnapshot({ releaseRoot: root }), /no active immutable release/i);
  const snap = sampleSnapshot("rel-unit-c-003");
  writeImmutableRelease(snap, root);
  activateRelease({ releaseId: snap.releaseId, expectedHash: snap.contentHash, actor: "t", root });
  const loaded = getPublishedSiteSnapshot({ releaseRoot: root });
  assert.equal(loaded.releaseId, snap.releaseId);
});
