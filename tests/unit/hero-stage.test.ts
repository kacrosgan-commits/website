import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8");

test("hero scenes share one stage and keep a visible fallback", () => {
  const stage = read("src/components/visuals/HeroStage.astro");
  const runtime = read("src/scripts/hero-stage.ts");
  const css = read("src/styles/global.css");
  for (const scene of ["workspace", "architecture", "showcase", "pipeline", "collaboration", "communication", "editorial"]) {
    assert.match(read("src/data/hero-scenes.ts"), new RegExp(scene));
  }
  assert.match(stage, /aria-hidden="true"/);
  assert.match(stage, /stage-world/);
  assert.match(stage, /prefers-reduced-motion: reduce/);
  assert.match(stage, /requestIdleCallback/);
  assert.match(runtime, /IntersectionObserver/);
  assert.match(runtime, /visibilitychange/);
  assert.match(runtime, /pagehide/);
  assert.match(runtime, /renderer\.dispose\(\)/);
  assert.match(runtime, /cancelAnimationFrame/);
  assert.match(css, /\.hero-stage-3d\.is-live \.stage-world \{ opacity: 0; \}/);
  assert.doesNotMatch(css, /\.hero-stage-3d \{\s*opacity: 0/);
  assert.match(read("package.json"), /"three"/);
});

test("decorative hero svgs are gone and the protected content is still in place", () => {
  const pages = ["about", "portfolio/index", "process", "team/index", "contact"].map((page) =>
    read(`src/pages/${page}.astro`),
  );
  for (const page of pages) {
    assert.doesNotMatch(page, /scene-wash|about-orbit|services-spheres|portfolio-portal|process-orbit|contact-globe/);
  }
  assert.match(read("src/pages/about.astro"), /HeroStage scene="workspace"/);
  assert.doesNotMatch(read("src/pages/about.astro"), /A dark engineering workspace in violet light/);
  assert.match(read("src/pages/index.astro"), /photo-hero-bleed/);
  assert.match(read("src/pages/index.astro"), /vortex-digital-hall\.png/);
  assert.doesNotMatch(read("src/pages/index.astro"), /HallDepth|hall-fin/);
  assert.doesNotMatch(read("src/pages/index.astro"), /insights-heading|BlogCard|\/insights\//);
  assert.doesNotMatch(read("src/pages/index.astro"), /purple-glow|purple-atmosphere/);
  const form = read("src/components/forms/ContactForm.astro");
  assert.match(form, /this site won't send it/);
  const film = read("src/components/sections/TeamShowcase.astro");
  assert.match(film, /vortex-team-showcase\.mp4/);
  assert.match(read("src/pages/portfolio/index.astro"), /showcasePlates/);
});
