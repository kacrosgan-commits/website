import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8");

test("motion tokens and reveal classes stay visible without the enhancement flag", () => {
  const css = read("src/styles/global.css");
  for (const token of [
    "--motion-duration-fast: 180ms",
    "--motion-duration-normal: 420ms",
    "--motion-duration-emphasis: 680ms",
    "--motion-ease-out:",
    "--motion-ease-spring:",
    "--motion-stagger: 70ms",
  ]) {
    assert.match(css, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(css, /\.reveal,\s*\.reveal-up,\s*\.reveal-fade,\s*\.reveal-scale,\s*\.motion-item \{\s*opacity: 1;/);
  assert.doesNotMatch(css, /await-reveal:not\(\.is-in\) \{\s*opacity: 0/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /animation: none !important/);
  assert.match(css, /scroll-behavior: auto/);
});

test("the shared observer is progressive and does not hide content up front", () => {
  const layout = read("src/layouts/BaseLayout.astro");
  assert.match(layout, /prefers-reduced-motion: reduce/);
  assert.match(layout, /IntersectionObserver/);
  assert.match(layout, /await-reveal/);
  assert.match(layout, /can-reveal/);
  assert.match(layout, /focusin/);
  assert.match(layout, /hashchange/);
  assert.doesNotMatch(layout, /classList\.add\("await-reveal"\)[\s\S]{0,80}querySelectorAll/);
});

test("homepage film and contact copy behavior are unchanged", () => {
  const film = read("src/components/sections/TeamShowcase.astro");
  assert.match(film, /autoplay/);
  assert.match(film, /preload="auto"/);
  assert.match(film, /vortex-team-showcase\.mp4/);
  assert.match(film, /vortex-team-poster\.webp/);
  assert.match(film, /Illustrative team scenes/);
  const form = read("src/components/forms/ContactForm.astro");
  assert.match(form, /this site won't send it/);
  assert.match(form, /Copying an inquiry needs JavaScript/);
  assert.match(form, /Inquiry copied\. No message has been sent\./);
  const pkg = read("package.json");
  assert.doesNotMatch(pkg, /gsap|framer-motion|lenis|locomotive/i);
});
