import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8");

test("homepage uses the lobby photo hero and the work-first section order", () => {
  const home = read("src/pages/index.astro");
  const order = [
    "photo-hero-bleed",
    "vortex-digital-hall.png",
    "intro-heading",
    "work-heading",
    "Testimonials",
    "TeamShowcase",
    "services-heading",
    "Stats",
    "process-heading",
    "team-heading",
    "faq-heading",
    "CtaSection",
  ];
  let cursor = -1;
  for (const token of order) {
    const next = home.indexOf(token, cursor + 1);
    assert.ok(next > cursor, `missing or out of order: ${token}`);
    cursor = next;
  }
  assert.match(home, /"View Our Work"/);
  assert.match(home, /"\/portfolio"/);
  assert.doesNotMatch(home, /HomeProductHero|HomeWorkGrid|HomeServicesBento|CollaborationPreview/);
  assert.doesNotMatch(home, /insights-heading|BlogCard|\/insights\//);
  assert.doesNotMatch(home, /href=["'`]\/services|secondaryHref=["'`]\/services/);
});

test("team film playback contract stays intact", () => {
  const film = read("src/components/sections/TeamShowcase.astro");
  assert.match(film, /autoplay/);
  assert.match(film, /muted/);
  assert.match(film, /loop/);
  assert.match(film, /controls/);
  assert.match(film, /playsinline/);
  assert.match(film, /preload="auto"/);
  assert.match(film, /vortex-team-showcase\.mp4/);
  assert.match(film, /vortex-team-poster\.webp/);
  assert.match(film, /Illustrative team scenes/);
});

test("lobby photo hero styles stay progressive", () => {
  const css = read("src/styles/global.css");
  assert.match(css, /\.photo-hero/);
  assert.match(css, /\.photo-hero-bleed/);
  assert.match(css, /\.photo-hero-img/);
  assert.doesNotMatch(read("src/pages/index.astro"), /HallDepth|hall-fin/);
});

test("fonts stay self-hosted so the Content-Security-Policy keeps working", () => {
  const css = read("src/styles/global.css");
  assert.doesNotMatch(read("src/layouts/BaseLayout.astro"), /fonts\.googleapis|fonts\.gstatic/);
  for (const match of css.matchAll(/url\("(\/fonts\/[^"]+)"\)/g)) {
    assert.ok(fs.existsSync(path.join(root, "public", match[1]!)), `missing font file: ${match[1]}`);
  }
  assert.match(css, /"Antic Didone"/);
  assert.match(read("public/_headers"), /font-src 'self'/);
});

test("homepage motion keeps content visible until an enhancement is armed", () => {
  const motion = read("src/scripts/luxe-motion.ts");
  assert.match(motion, /prefers-reduced-motion: reduce/);
  assert.match(read("src/layouts/BaseLayout.astro"), /luxe-motion\.ts/);
  const css = read("src/styles/global.css");
  assert.match(css, /--ap: 1;/);
  assert.match(css, /--progress: 1;/);
  assert.match(css, /--hero-p: 0;/);
});
