import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { filtersInUse, homepageProjects, isPublicProject, isReviewProject } from "../../src/utils/portfolio.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const reviewSlugs = [
  "born-to-rock",
  "medastare",
  "scaleup-systems",
  "gain-energy-upstrima",
  "gowabi",
  "daniela-diamonds",
];

test("public projects require approval and are never samples", () => {
  assert.equal(isPublicProject({ sample: true, publicationApproved: true }), false);
  assert.equal(isPublicProject({ sample: false, publicationApproved: false, review: true }), false);
  assert.equal(isPublicProject({ publicationApproved: true }), true);
});

test("review projects exist only in development and stay unpublished", () => {
  const review = { sample: false, review: true, publicationApproved: false };
  assert.equal(isReviewProject(review, false), false);
  assert.equal(isReviewProject(review, true), true);
  assert.equal(isReviewProject({ ...review, publicationApproved: true }, true), false);
  assert.equal(isReviewProject({ sample: true, review: true }, true), false);
});

test("the homepage stays empty until a project is approved and featured", () => {
  const entries = [
    { id: "scaleup-systems", data: { sample: false, review: true, publicationApproved: false, featured: true, homeRank: 1 } },
    { id: "medastare", data: { sample: false, review: true, publicationApproved: true, featured: false, homeRank: 2 } },
    { id: "old", data: { sample: true, publicationApproved: true, featured: true, homeRank: 0 } },
  ];
  assert.deepEqual(homepageProjects(entries), []);

  entries[0].data.publicationApproved = true;
  entries[1].data.featured = true;
  const published = homepageProjects([
    entries[2],
    { id: "extra", data: { publicationApproved: true, featured: true, homeRank: 7 } },
    { id: "born", data: { publicationApproved: true, featured: true, homeRank: 6 } },
    { id: "daniela", data: { publicationApproved: true, featured: true, homeRank: 5 } },
    { id: "gowabi", data: { publicationApproved: true, featured: true, homeRank: 4 } },
    { id: "gain", data: { publicationApproved: true, featured: true, homeRank: 3 } },
    entries[1],
    entries[0],
  ]);
  assert.deepEqual(
    published.map((entry) => entry.id),
    ["scaleup-systems", "medastare", "gain", "gowabi", "daniela", "born"],
  );
});

test("filters with no matching project are omitted", () => {
  assert.deepEqual(filtersInUse([{ filters: ["Mobile"] }, { filters: ["Mobile", "AI & SaaS"] }]), ["Mobile", "AI & SaaS"]);
});

test("the review set is six projects and eighteen distinct screenshots", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "PORTFOLIO_ASSET_MANIFEST.json"), "utf8"));
  assert.equal(manifest.projects.length, 6);
  const manifestPaths = manifest.projects.flatMap((project: { media: { public_url: string }[] }) =>
    project.media.map((item) => item.public_url),
  );
  assert.equal(new Set(manifestPaths).size, 18);

  const dir = path.join(root, "src/content/case-studies");
  const reviewFiles = fs.readdirSync(dir).filter((file) => reviewSlugs.includes(file.replace(/\.md$/, "")));
  assert.equal(reviewFiles.length, 6);

  const sources = new Set<string>();
  for (const file of reviewFiles) {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const slug = file.replace(/\.md$/, "");
    assert.match(raw, /^sample:\s*false\s*$/m);
    assert.match(raw, /^review:\s*true\s*$/m);
    if (slug === "scaleup-systems" || slug === "medastare" || slug === "gain-energy-upstrima" || slug === "gowabi" || slug === "daniela-diamonds" || slug === "born-to-rock") {
      assert.match(raw, /^publicationApproved:\s*true\s*$/m);
      assert.match(raw, /^contributionVerified:\s*true\s*$/m);
      assert.match(raw, /^featured:\s*true\s*$/m);
      if (slug === "born-to-rock") assert.match(raw, /^homeRank:\s*6\s*$/m);
    } else {
      assert.match(raw, /^publicationApproved:\s*false\s*$/m);
      assert.match(raw, /^contributionVerified:\s*false\s*$/m);
      assert.doesNotMatch(raw, /^featured:\s*true\s*$/m);
    }
    for (const match of raw.matchAll(/src: "(\/assets\/portfolio\/[^"]+)"/g)) sources.add(match[1]);
  }
  assert.equal(sources.size, 18);
  assert.deepEqual([...sources].sort(), [...manifestPaths].sort());

  for (const image of manifestPaths) {
    assert.equal(fs.existsSync(path.join(root, "public", image)), true, image);
  }

  const samples = fs.readdirSync(dir).filter((file) => file.startsWith("sample-"));
  assert.equal(samples.length, 6);
  for (const file of samples) {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    assert.match(raw, /^sample:\s*true\s*$/m);
    assert.doesNotMatch(raw, /^publicationApproved:\s*true\s*$/m);
  }
});
