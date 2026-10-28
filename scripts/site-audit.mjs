// Responsive and runtime audit of every built page.
// Usage: npm run build && npm run preview -- --host 127.0.0.1 --port 4321
//        node scripts/site-audit.mjs [baseUrl] [outFile]
// Modes: zoom 1 at five widths; root font-size 200% at four widths; 32px browser default font at 1024 and 1440.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://127.0.0.1:4321";
const outFile = process.argv[3] ?? "site-audit.json";
const widths = [320, 375, 768, 1024, 1440];
const zoomWidths = [320, 375, 768, 1024];

function routes() {
  const dist = path.resolve("dist");
  const found = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".html")) {
        const rel = path.relative(dist, full).replaceAll(path.sep, "/");
        if (rel === "404.html") found.push("/404");
        else found.push(`/${rel.replace(/index\.html$/, "")}`);
      }
    }
  };
  walk(dist);
  return found.sort();
}

async function inspect(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none";
    };
    const clipped = [...document.querySelectorAll("h1, h2, .btn, button")]
      .filter((el) => visible(el) && !el.closest(".sr-only") && el.scrollWidth > el.clientWidth + 1)
      .map((el) => `${el.tagName}: ${el.textContent.trim().slice(0, 40)}`);
    const overflowing = doc.scrollWidth > doc.clientWidth
      ? [...document.querySelectorAll("body *")]
          .filter((el) => el.getBoundingClientRect().right > doc.clientWidth + 1 && !el.closest("[aria-hidden='true'], .sr-only, .skip-link"))
          .slice(0, 3)
          .map((el) => `${el.tagName}.${String(el.className).slice(0, 40)}: ${el.textContent.trim().slice(0, 30)}`)
      : [];
    const small = [...document.querySelectorAll("a[href], button, input, select, textarea, summary")]
      .filter((el) => {
        if (!visible(el) || el.closest("[inert], .hp, .skip-link")) return false;
        if (el.type === "checkbox" || el.type === "radio") return false;
        const cs = getComputedStyle(el);
        if (cs.display === "inline" && el.parentElement?.closest("p, li, figcaption, td, dd")) return false;
        const r = el.getBoundingClientRect();
        return r.width < 24 || r.height < 24;
      })
      .map((el) => {
        const r = el.getBoundingClientRect();
        return `${el.tagName} ${Math.round(r.width)}x${Math.round(r.height)} ${(el.getAttribute("aria-label") || el.textContent).trim().slice(0, 30)}`;
      });
    const header = document.querySelector("header")?.getBoundingClientRect();
    const splitWords = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const parent = node.parentElement;
      if (!parent || parent.closest("script, style, .sr-only, [aria-hidden='true'], svg, [inert]") || !visible(parent)) continue;
      for (const match of node.textContent.matchAll(/[^\s\-–—/]{2,}/gu)) {
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        const lines = new Set([...range.getClientRects()].filter((r) => r.width > 0).map((r) => Math.round(r.top)));
        if (lines.size > 1) splitWords.push(`${parent.tagName}.${String(parent.className).split(" ")[0]}: ${match[0]}`);
      }
    }
    const gridOverflow = [...document.querySelectorAll("body *")]
      .filter((el) => {
        const display = getComputedStyle(el).display;
        return (display === "grid" || display === "flex") && visible(el) && el.scrollWidth > el.clientWidth + 1;
      })
      .filter((el) => !el.closest(".sr-only, [aria-hidden='true'], .marquee, [data-marquee]"))
      .slice(0, 3)
      .map((el) => `${el.tagName}.${String(el.className).slice(0, 50)} ${el.clientWidth}<${el.scrollWidth}`);
    const desktopNav = document.querySelector("header nav");
    const menuToggle = document.querySelector("[data-menu-toggle]");
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      navAvailable: Boolean((desktopNav && visible(desktopNav)) || (menuToggle && visible(menuToggle))),
      skipLinkShowing: (document.querySelector(".skip-link")?.getBoundingClientRect().bottom ?? 0) > 0,
      h1: document.querySelectorAll("h1").length,
      headerHeight: header ? Math.round(header.height) : 0,
      clipped,
      overflowing,
      gridOverflow,
      splitWords: [...new Set(splitWords)].slice(0, 12),
      small: [...new Set(small)],
    };
  });
}

const browser = await chromium.launch({ channel: process.env.CI ? undefined : "chrome" });
const context = await browser.newContext();
const page = await context.newPage();
const consoleErrors = [];
const failed = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push({ url: page.url(), text: msg.text() });
});
page.on("requestfailed", (req) => failed.push({ url: req.url(), error: req.failure()?.errorText }));
page.on("response", (res) => {
  if (res.status() >= 400 && !res.url().includes("/missing")) failed.push({ url: res.url(), status: res.status(), page: page.url() });
});

const results = [];
const list = routes();
for (const route of list) {
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${base}${route}`, { waitUntil: "load" });
    const row = { route, width, zoom: 1, ...(await inspect(page)) };
    if (width === 375 || width === 1440) {
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo({ top: y, behavior: "instant" });
          await new Promise((resolve) => setTimeout(resolve, 60));
        }
        window.scrollTo({ top: 0, behavior: "instant" });
      });
      await page.waitForLoadState("networkidle");
      row.brokenImages = await page.evaluate(() =>
        [...document.images]
          .filter((img) => img.getAttribute("src") && img.complete && img.naturalWidth === 0)
          .map((img) => img.getAttribute("src")),
      );
      row.pendingImages = await page.evaluate(() =>
        [...document.images].filter((img) => !img.complete).map((img) => img.getAttribute("src")),
      );
    }
    results.push(row);
  }
  for (const width of zoomWidths) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${base}${route}`, { waitUntil: "load" });
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    results.push({ route, width, zoom: 2, ...(await inspect(page)) });
  }
}

// A larger browser default font also scales rem-based media queries, unlike the root-size override above.
const fontPage = await (await browser.newContext()).newPage();
const cdp = await fontPage.context().newCDPSession(fontPage);
await cdp.send("Page.enable");
await cdp.send("Page.setFontSizes", { fontSizes: { standard: 32, fixed: 26 } });
for (const route of list) {
  for (const width of [1024, 1440]) {
    await fontPage.setViewportSize({ width, height: 900 });
    await fontPage.goto(`${base}${route}`, { waitUntil: "load" });
    results.push({ route, width, zoom: "font32", ...(await inspect(fontPage)) });
  }
}
await browser.close();

const problems = results.filter(
  (row) =>
    row.scrollWidth > row.clientWidth ||
    !row.navAvailable ||
    row.skipLinkShowing ||
    row.h1 !== 1 ||
    row.clipped.length ||
    row.gridOverflow.length ||
    (row.zoom === 1 && row.splitWords.length) ||
    row.brokenImages?.length ||
    row.pendingImages?.length,
);
const summary = {
  base,
  routes: list.length,
  checks: results.length,
  overflow: results.filter((row) => row.scrollWidth > row.clientWidth).length,
  problems: problems.length,
  consoleErrors,
  failed: [...new Map(failed.map((item) => [JSON.stringify(item), item])).values()],
};
fs.writeFileSync(outFile, JSON.stringify({ summary, results }, null, 2));
console.log(JSON.stringify(summary, null, 2));
for (const row of problems) console.log(JSON.stringify(row));
