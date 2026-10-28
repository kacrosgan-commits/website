import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { jsonLd } from "../../src/utils/format.ts";
import { cardCopy, webpCopy } from "../../src/utils/images.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const publicFile = (src: string) => path.join(root, "public", src);

function screenshots(): { slug: string; srcs: string[] }[] {
  const dir = path.join(root, "src/content/case-studies");
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md") && !file.startsWith("sample-"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const block = raw.split("\nscreenshots:\n")[1] ?? "";
      return { slug: file.replace(/\.md$/, ""), srcs: [...block.matchAll(/^\s*- src:\s*"([^"]+)"/gm)].map((m) => m[1]) };
    });
}

function pngSize(file: string): [number, number] {
  const data = fs.readFileSync(file);
  return [data.readUInt32BE(16), data.readUInt32BE(20)];
}

function webpSize(file: string): [number, number] {
  const data = fs.readFileSync(file);
  assert.equal(data.toString("ascii", 0, 4), "RIFF");
  assert.equal(data.toString("ascii", 8, 12), "WEBP");
  const chunk = data.toString("ascii", 12, 16);
  if (chunk === "VP8X") return [1 + data.readUIntLE(24, 3), 1 + data.readUIntLE(27, 3)];
  if (chunk === "VP8 ") return [data.readUInt16LE(26) & 0x3fff, data.readUInt16LE(28) & 0x3fff];
  const bits = data.readUInt32LE(21);
  return [(bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1];
}

test("JSON-LD output cannot close its script element", () => {
  const value = { name: "</script><script>alert(1)</script>", url: "https://example.com/" };
  const output = jsonLd(value);
  assert.equal(output.includes("<"), false);
  assert.deepEqual(JSON.parse(output), value);
});

test("six approved projects keep 18 screenshots and every PNG has a same-size, smaller WebP copy", () => {
  const projects = screenshots();
  assert.equal(projects.length, 6);
  const all = projects.flatMap((project) => project.srcs);
  assert.equal(all.length, 18);
  const pngs = all.filter((src) => src.endsWith(".png"));
  assert.equal(pngs.length, 6);
  for (const src of pngs) {
    const copy = webpCopy(src);
    assert.ok(copy, `missing WebP copy for ${src}`);
    assert.deepEqual(webpSize(publicFile(copy)), pngSize(publicFile(src)), src);
    assert.ok(fs.statSync(publicFile(copy)).size < fs.statSync(publicFile(src)).size, src);
  }
  for (const src of all.filter((item) => !item.endsWith(".png"))) assert.equal(webpCopy(src), undefined, src);
});

test("each project card image has a smaller card-size WebP copy", () => {
  for (const { slug, srcs } of screenshots()) {
    const copy = cardCopy(srcs[0]);
    assert.ok(copy, `missing card copy for ${slug}`);
    const [width] = webpSize(publicFile(copy));
    assert.ok(width === 480 || width === 800, `${slug} card width ${width}`);
    assert.ok(fs.statSync(publicFile(copy)).size < fs.statSync(publicFile(srcs[0])).size, slug);
  }
  assert.equal(cardCopy("/assets/portfolio/missing.jpg"), undefined);
});

test("stylesheet breakpoints use rem so they follow the browser text size like Tailwind's", () => {
  const css = fs.readFileSync(path.join(root, "src/styles/global.css"), "utf8");
  const pxQueries = [...css.matchAll(/@media[^{]*\d+px[^{]*\{/g)].map((m) => m[0]);
  assert.deepEqual(pxQueries, []);
});

test("the homepage team film uses the supplied silent MP4 and poster", () => {
  const video = path.join(root, "public/videos/vortex-team-showcase.mp4");
  const poster = path.join(root, "public/videos/vortex-team-poster.webp");
  assert.equal(fs.statSync(video).size, 4_718_893);
  assert.equal(fs.statSync(poster).size, 95_264);
  assert.deepEqual(webpSize(poster), [1280, 720]);
  const homepage = fs.readFileSync(path.join(root, "src/pages/index.astro"), "utf8");
  const hero = homepage.indexOf('class="photo-hero"');
  const film = homepage.indexOf("<TeamShowcase");
  const intro = homepage.indexOf('id="intro-heading"');
  assert.ok(hero >= 0 && film > hero && intro > film);
});
