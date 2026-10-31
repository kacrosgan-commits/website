#!/usr/bin/env node
/**
 * Isolated fixture release writer — does NOT touch real Directus data or cms/releases ACTIVE.
 * Writes under CMS_RELEASE_ROOT (default: cms/.tmp/step-10d/fixture-releases).
 *
 * Modes:
 *   --seed-a     create release A (synthetic baseline)
 *   --seed-b     create release B (edited title + new project + archived one)
 *   --seed-c     create release C (withdraw one project)
 *   --activate   activate --release/--hash inside the fixture root
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const fixtureRoot = process.env.CMS_RELEASE_ROOT
  ? path.resolve(process.env.CMS_RELEASE_ROOT)
  : path.join(root, "cms", ".tmp", "step-10d", "fixture-releases");

process.env.CMS_RELEASE_ROOT = fixtureRoot;

const { buildReleaseCandidate } = await import(pathToFileURL(path.join(root, "src/lib/content/release-builder.ts")).href);
const { writeImmutableRelease, activateRelease, ensureReleaseRoot, readPointer } = await import(
  pathToFileURL(path.join(root, "src/lib/content/release-store.ts")).href
);

const published = {
  status: "published",
  publication_approved: true,
  published_at: "2026-01-15T12:00:00.000Z",
};

function member(slug, name, role, overrides = {}) {
  return {
    slug,
    name,
    role,
    intro: `${name} intro`,
    biography: [`${name} biography`],
    responsibilities: [{ title: "Delivery", detail: "Ships work" }],
    expertise: [{ title: "Craft", detail: "Solid craft" }],
    experience: "5+ years",
    startupSupport: "Supports startup delivery",
    related: [],
    portraitSrc: `/cms-media/fixture-${slug}.webp`,
    portraitAlt: `${name} portrait`,
    displayOrder: 1,
    featured: false,
    sourceApproval: true,
    cmsEligible: true,
    ...overrides,
  };
}

function project(slug, title, rank, shotCount = 1) {
  return {
    slug,
    title,
    description: `${title} description`,
    cardTitle: title,
    cardSummary: `${title} summary`,
    client: `${title} Client`,
    industry: "Software",
    category: "Product",
    services: ["Web Development"],
    technologies: ["TypeScript"],
    featured: rank <= 2,
    homeRank: rank,
    mediaLayout: "web",
    filters: ["web"],
    screenshots: Array.from({ length: shotCount }, (_, i) => ({
      projectSlug: slug,
      sort: i + 1,
      src: `/cms-media/fixture-${slug}-${i + 1}.webp`,
      fileId: `fixture-file-${slug}-${i + 1}`,
      alt: `${title} screenshot ${i + 1}`,
      width: 1200,
      height: 800,
      checksum: null,
    })),
    sourceApproval: true,
    cmsEligible: true,
    contributionVerified: true,
  };
}

function service(slug, title, order) {
  return {
    slug,
    title,
    summary: `${title} summary`,
    hero: `${title} hero`,
    displayOrder: order,
    featured: order <= 3,
    sourceApproval: true,
    cmsEligible: true,
  };
}

function homepage(overrides = {}) {
  return {
    heroEyebrow: "Fixture agency",
    heroTitle: "Fixture Hero Title",
    heroLede: "Fixture lede for isolated publishing tests.",
    primaryCtaLabel: "Contact",
    primaryCtaHref: "/contact",
    secondaryCtaLabel: "Services",
    secondaryCtaHref: "/services",
    teamFilmEyebrow: "Team",
    teamFilmHeading: "Fixture film heading",
    teamFilmDescription: "Fixture film description",
    teamFilmDisclosure: "Illustrative fixture footage.",
    teamFilmVideoId: null,
    teamFilmPosterId: null,
    featuredProjectSlugs: ["fixture-alpha", "fixture-beta"],
    cmsEligible: true,
    ...overrides,
  };
}

function seedA() {
  ensureReleaseRoot(fixtureRoot);
  const snapshot = buildReleaseCandidate({
    releaseId: "rel-fixture-a-20260101-aaa",
    publisher: "fixture-rehearsal",
    notes: "fixture release A — synthetic baseline",
    eligibleOnly: false,
    team: [
      member("fixture-alice", "Alice Fixture", "Founder", { displayOrder: 1 }),
      member("fixture-bob", "Bob Fixture", "Engineer", { displayOrder: 2 }),
    ],
    projects: [project("fixture-alpha", "Fixture Alpha", 1, 2), project("fixture-beta", "Fixture Beta", 2, 1)],
    services: [service("web-application-development", "Web Development", 1), service("fixture-special", "Fixture Special", 2)],
    insights: [],
    homepage: homepage(),
  });
  writeImmutableRelease(snapshot, fixtureRoot);
  return snapshot;
}

function seedB() {
  ensureReleaseRoot(fixtureRoot);
  // Edited Alice title, new project gamma, keep alpha/beta
  const snapshot = buildReleaseCandidate({
    releaseId: "rel-fixture-b-20260102-bbb",
    publisher: "fixture-rehearsal",
    notes: "fixture release B — edited role + new project",
    eligibleOnly: false,
    team: [
      member("fixture-alice", "Alice Fixture", "Managing Director", { displayOrder: 1 }),
      member("fixture-bob", "Bob Fixture", "Engineer", {
        displayOrder: 2,
        portraitSrc: "/cms-media/fixture-bob-v2.webp",
      }),
    ],
    projects: [
      project("fixture-alpha", "Fixture Alpha Revised", 1, 2),
      project("fixture-beta", "Fixture Beta", 2, 1),
      project("fixture-gamma", "Fixture Gamma", 3, 1),
    ],
    services: [service("web-application-development", "Web Development", 1), service("fixture-special", "Fixture Special", 2)],
    insights: [
      {
        slug: "fixture-insight-one",
        title: "Fixture Insight One",
        excerpt: "Safe synthetic excerpt",
        body: "Safe synthetic body for fixture insight.",
        author: "Fixture Author",
        featured: false,
        sourceApproval: true,
        cmsEligible: true,
      },
    ],
    homepage: homepage({ heroTitle: "Fixture Hero Title B" }),
  });
  writeImmutableRelease(snapshot, fixtureRoot);
  return snapshot;
}

function seedC() {
  ensureReleaseRoot(fixtureRoot);
  // Withdraw gamma; keep Alice's new title from B
  const snapshot = buildReleaseCandidate({
    releaseId: "rel-fixture-c-20260103-ccc",
    publisher: "fixture-rehearsal",
    notes: "fixture release C — withdraw gamma",
    eligibleOnly: false,
    team: [
      member("fixture-alice", "Alice Fixture", "Managing Director", { displayOrder: 1 }),
      member("fixture-bob", "Bob Fixture", "Engineer", { displayOrder: 2 }),
    ],
    projects: [project("fixture-alpha", "Fixture Alpha Revised", 1, 2), project("fixture-beta", "Fixture Beta", 2, 1)],
    services: [service("web-application-development", "Web Development", 1), service("fixture-special", "Fixture Special", 2)],
    insights: [],
    homepage: homepage({ heroTitle: "Fixture Hero Title C" }),
  });
  writeImmutableRelease(snapshot, fixtureRoot);
  return snapshot;
}

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

ensureReleaseRoot(fixtureRoot);
let result;

if (process.argv.includes("--seed-a")) {
  const snap = seedA();
  result = { ok: true, seeded: "A", releaseId: snap.releaseId, contentHash: snap.contentHash, root: fixtureRoot };
} else if (process.argv.includes("--seed-b")) {
  const snap = seedB();
  result = { ok: true, seeded: "B", releaseId: snap.releaseId, contentHash: snap.contentHash, root: fixtureRoot };
} else if (process.argv.includes("--seed-c")) {
  const snap = seedC();
  result = { ok: true, seeded: "C", releaseId: snap.releaseId, contentHash: snap.contentHash, root: fixtureRoot };
} else if (process.argv.includes("--activate")) {
  const releaseId = arg("--release");
  const hash = arg("--hash");
  if (!releaseId || !hash) {
    console.error("Need --release and --hash with --activate");
    process.exit(1);
  }
  const pointer = activateRelease({
    releaseId,
    expectedHash: hash,
    actor: "fixture-rehearsal",
    root: fixtureRoot,
  });
  result = { ok: true, activated: releaseId, pointer, root: fixtureRoot };
} else if (process.argv.includes("--status")) {
  result = { ok: true, pointer: readPointer(fixtureRoot), root: fixtureRoot };
} else {
  console.error("Usage: --seed-a | --seed-b | --seed-c | --activate --release <id> --hash <sha> | --status");
  process.exit(1);
}

// Tiny placeholder media files for fixture public paths (gitignored staging)
const mediaDir = path.join(root, "cms", ".tmp", "step-10d", "fixture-media");
fs.mkdirSync(mediaDir, { recursive: true });
// 1x1 webp-ish placeholder bytes are not valid webp; pages just need paths for route tests.
fs.writeFileSync(path.join(mediaDir, "README.txt"), "Fixture media paths are synthetic; no Directus downloads.\n");

console.log(JSON.stringify(result, null, 2));
