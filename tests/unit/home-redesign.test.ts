import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8");

test("homepage uses the product-first section order", () => {
  const home = read("src/pages/index.astro");
  const order = [
    "HomeProductHero",
    "HomeWorkGrid",
    "HomeServicesBento",
    "HomeProcessRibbon",
    "TeamShowcase",
    "team-heading",
    "HomeTechStrip",
    "faq-heading",
    "CtaSection",
  ];
  let cursor = -1;
  for (const token of order) {
    const next = home.indexOf(token, cursor + 1);
    assert.ok(next > cursor, `missing or out of order: ${token}`);
    cursor = next;
  }
  assert.match(home, /secondaryHref=\{secondaryHref\}/);
  assert.match(home, /"View Our Work"/);
  assert.match(home, /"\/portfolio"/);
  assert.doesNotMatch(home, /CollaborationPreview|homeIntro|reasons|Stats|Testimonials/);
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

test("homepage hero and work components stay progressive", () => {
  const hero = read("src/components/home/HomeProductHero.astro");
  const work = read("src/components/home/HomeWorkGrid.astro");
  const css = read("src/styles/global.css");
  assert.match(hero, /role="tablist"/);
  assert.match(hero, /prefers-reduced-motion: reduce/);
  assert.match(work, /Approved client work\./);
  assert.match(work, /View Case Study/);
  assert.match(css, /\.home-hero/);
  assert.match(css, /\.home-work-grid/);
  assert.match(css, /\.home-services-bento/);
  assert.match(css, /home-panel-drift/);
});
