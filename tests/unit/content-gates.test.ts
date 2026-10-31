import assert from "node:assert/strict";
import test from "node:test";
import { getContentSource } from "../../src/lib/content/source.ts";
import {
  CMS_PUBLIC_BASELINE,
  isCmsPubliclyEligible,
  publicationGateFailures,
} from "../../src/lib/content/publication-gates.ts";
import { mapInsight, mapTeamMember } from "../../src/lib/content/directus-mappers.ts";

test("CONTENT_SOURCE defaults to local and rejects unknown modes", () => {
  assert.equal(getContentSource({}), "local");
  assert.equal(getContentSource({ CONTENT_SOURCE: "" }), "local");
  assert.equal(getContentSource({ CONTENT_SOURCE: "local" }), "local");
  assert.equal(getContentSource({ CONTENT_SOURCE: "cms-shadow" }), "cms-shadow");
  assert.equal(getContentSource({ CONTENT_SOURCE: "cms" }), "cms");
  assert.throws(() => getContentSource({ CONTENT_SOURCE: "prod" }), /Unknown CONTENT_SOURCE/);
});

test("publication gate requires status, approval, and published_at together", () => {
  assert.equal(
    isCmsPubliclyEligible({
      status: "published",
      publication_approved: true,
      published_at: "2026-01-01T00:00:00.000Z",
    }),
    true,
  );
  assert.equal(
    isCmsPubliclyEligible({
      status: "published",
      publication_approved: false,
      published_at: "2026-01-01T00:00:00.000Z",
    }),
    false,
  );
  assert.equal(
    isCmsPubliclyEligible({
      status: "draft",
      publication_approved: true,
      published_at: "2026-01-01T00:00:00.000Z",
    }),
    false,
  );
  assert.equal(
    isCmsPubliclyEligible({ status: "published", publication_approved: true, published_at: null }),
    false,
  );
  assert.ok(publicationGateFailures({ status: "draft", publication_approved: false, published_at: null }).length >= 2);
});

test("staged CMS rows map as ineligible and fail the public baseline", () => {
  const team = Array.from({ length: 9 }, (_, i) =>
    mapTeamMember(
      {
        slug: `s${i}`,
        name: `N${i}`,
        role: "Role",
        status: "draft",
        publication_approved: false,
        published_at: null,
        display_order: i + 1,
      },
      i,
    ),
  );
  assert.equal(team.every((member) => member.cmsEligible === false), true);
  assert.equal(team.filter((member) => member.cmsEligible).length < CMS_PUBLIC_BASELINE.team_members, true);

  const insight = mapInsight({
    slug: "draft-a",
    title: "T",
    excerpt: "E",
    body: "B",
    status: "draft",
    publication_approved: false,
    published_at: null,
  });
  assert.equal(insight.cmsEligible, false);
});

test("synthetic fully approved fixture rows are cmsEligible", () => {
  const published = {
    status: "published",
    publication_approved: true,
    published_at: "2026-01-02T00:00:00.000Z",
  };
  const team = Array.from({ length: 9 }, (_, i) =>
    mapTeamMember({ slug: `member-${i}`, name: `Person ${i}`, role: "Role", display_order: i + 1, ...published }, i),
  );
  assert.equal(team.every((member) => member.cmsEligible), true);
  assert.equal(team.length, CMS_PUBLIC_BASELINE.team_members);
});
