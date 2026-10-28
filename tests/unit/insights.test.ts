import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  comparePublicInsights,
  frontmatterIsPublicInsight,
  isPublicInsight,
  publicInsightHref,
  publicInsightMeta,
  publicInsights,
  relatedPublicInsights,
  type InsightPublication,
} from "../../src/utils/insights.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const blogDir = path.join(root, "src/content/blog");

const live = (id: string, publishedAt: string, category = "Web Development"): InsightPublication => ({
  id,
  title: `Public ${id}`,
  description: `A real excerpt for ${id}.`,
  publicationApproved: true,
  status: "published",
  draft: false,
  demonstration: false,
  category,
  publishedAt,
});

test("a new article without approval stays private", () => {
  assert.equal(isPublicInsight({}), false);
  assert.equal(isPublicInsight({ id: "new-note", title: "New note", description: "Complete draft copy." }), false);
  assert.equal(isPublicInsight({ publicationApproved: true, status: "review" }), false);
  assert.equal(isPublicInsight({ publicationApproved: true, status: "draft" }), false);
  assert.equal(isPublicInsight({ publicationApproved: false, status: "published" }), false);
  assert.equal(isPublicInsight({ publicationApproved: true, status: "published", draft: true }), false);
  assert.equal(isPublicInsight({ publicationApproved: true, status: "published", demonstration: true }), false);
  assert.equal(isPublicInsight({ publicationApproved: true, status: "published", sample: true }), false);
  assert.equal(publicInsightMeta({ id: "new-note", title: "New note", description: "Complete draft copy." }), null);
  assert.equal(publicInsightHref("new-note", [{ id: "new-note", title: "New note", description: "Complete draft copy." }]), null);
});

test("every current Insights file is unpublished", () => {
  const files = fs.readdirSync(blogDir).filter((file) => file.endsWith(".md"));
  assert.ok(files.length >= 12);
  for (const file of files) {
    const raw = fs.readFileSync(path.join(blogDir, file), "utf8");
    assert.equal(frontmatterIsPublicInsight(raw), false, file);
    assert.match(raw, /^publicationApproved:\s*false\s*$/m, file);
    assert.doesNotMatch(raw, /^status:\s*published\s*$/m, file);
    assert.doesNotMatch(raw, /^publishedAt:/m, file);
  }
});

test("public selectors share one approval rule and a stable order", () => {
  const posts = [
    live("later", "2026-06-02"),
    { id: "secret", title: "Secret draft", description: "Must not leak.", publicationApproved: false, status: "review", category: "Web Development" },
    live("alpha", "2026-06-01"),
    live("zeta", "2026-06-01", "AI Solutions"),
    { ...live("sample", "2026-07-01"), sample: true },
  ];
  assert.deepEqual(publicInsights(posts).map((post) => post.id), ["later", "alpha", "zeta"]);
  assert.deepEqual(
    publicInsights([posts[3], posts[2], posts[0]]).map((post) => post.id),
    publicInsights([posts[0], posts[2], posts[3]]).map((post) => post.id),
  );
  assert.ok(comparePublicInsights(posts[2], posts[3]) < 0);

  const meta = publicInsightMeta(live("alpha", "2026-06-01"));
  assert.ok(meta);
  assert.equal(meta?.path, "/insights/alpha");
  assert.ok(meta && meta.title.length > 0 && meta.description.length > 0);

  assert.equal(publicInsightHref("secret", posts), null);
  assert.equal(publicInsightHref("alpha", posts), "/insights/alpha");
  assert.deepEqual(
    relatedPublicInsights(posts, "later", "Web Development").map((post) => post.id),
    ["alpha", "zeta"],
  );
  assert.equal(frontmatterIsPublicInsight("publicationApproved: true\nstatus: published\n"), true);
  assert.equal(frontmatterIsPublicInsight("publicationApproved: true\nstatus: review\n"), false);
  assert.equal(frontmatterIsPublicInsight("publicationApproved: true\nstatus: published\ndraft: true\n"), false);

  const config = fs.readFileSync(path.join(root, "astro.config.ts"), "utf8");
  assert.match(config, /frontmatterIsPublicInsight/);
  for (const file of ["src/pages/insights/index.astro", "src/pages/insights/[slug].astro", "src/pages/index.astro", "src/components/layout/Header.astro", "src/components/layout/Footer.astro"]) {
    assert.match(fs.readFileSync(path.join(root, file), "utf8"), /isPublicInsight|relatedPublicInsights/);
  }
});

test("approved portfolio studies and named team profiles stay in place", () => {
  for (const slug of ["scaleup-systems", "medastare", "gain-energy-upstrima", "gowabi", "daniela-diamonds", "born-to-rock"]) {
    const raw = fs.readFileSync(path.join(root, "src/content/case-studies", `${slug}.md`), "utf8");
    assert.match(raw, /^publicationApproved:\s*true\s*$/m, slug);
    assert.match(raw, /^sample:\s*false\s*$/m, slug);
  }
  for (const file of fs.readdirSync(path.join(root, "src/content/case-studies"))) {
    if (!file.startsWith("sample-")) continue;
    const raw = fs.readFileSync(path.join(root, "src/content/case-studies", file), "utf8");
    assert.match(raw, /^sample:\s*true\s*$/m, file);
    assert.doesNotMatch(raw, /^publicationApproved:\s*true\s*$/m, file);
  }
  const team = fs.readFileSync(path.join(root, "src/data/team.ts"), "utf8");
  for (const name of ["Don Tran", "Joshua Mendoza", "Lin Jiayi", "Pongsak Rattanakul", "Dmytro Melnyk", "Carlo Garcia", "Matheus Pereira", "Adrian Cruz", "Sofia Vasylivna Melnyk"]) {
    assert.match(team, new RegExp(`name: "${name}"`));
  }
});
