import fs from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

const draftDir = path.resolve("src/content/blog");
const drafts = fs
  .readdirSync(draftDir)
  .filter((file) => file.endsWith(".md"))
  .map((file) => {
    const raw = fs.readFileSync(path.join(draftDir, file), "utf8");
    return { slug: file.replace(/\.md$/, ""), title: raw.match(/^title:\s*"?(.*?)"?\s*$/m)?.[1] ?? "" };
  });

async function sitemapPaths(page: Page): Promise<string[]> {
  const xml = await (await page.request.get("/sitemap-0.xml")).text();
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}

async function setLargeText(page: Page) {
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
}

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

test("sitemap pages have unique metadata, one h1, valid JSON-LD, and working internal links", async ({ page }) => {
  test.setTimeout(120_000);
  const paths = await sitemapPaths(page);
  expect(paths.length).toBeGreaterThanOrEqual(25);
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();
  const links = new Set<string>();
  for (const route of paths) {
    const response = await page.request.get(route);
    expect(response.status(), route).toBe(200);
    const html = await response.text();
    const title = html.match(/<title>(.*?)<\/title>/)?.[1] ?? "";
    const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
    expect(title, route).not.toBe("");
    expect(description, route).not.toBe("");
    expect(titles.get(title), `${route} repeats a title`).toBeUndefined();
    expect(descriptions.get(description), `${route} repeats a description`).toBeUndefined();
    titles.set(title, route);
    descriptions.set(description, route);
    expect(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1], route).toMatch(new RegExp(`${route.replace(/\//g, "\\/")}$`));
    expect(html.match(/<h1[\s>]/g)?.length, route).toBe(1);
    expect(html).toContain('<html lang="en"');
    expect(html, route).not.toMatch(/href="(#"|javascript:)/);
    for (const fragment of html.matchAll(/href="#([^"]+)"/g)) expect(html, `${route} #${fragment[1]}`).toContain(`id="${fragment[1]}"`);
    for (const tag of html.match(/<a [^>]*target="_blank"[^>]*>/g) ?? []) expect(tag, route).toContain("noopener");
    for (const block of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
      const data = JSON.parse(block[1]);
      if (data["@type"] === "BreadcrumbList") {
        for (const item of data.itemListElement) if (item.item) expect(item.item, route).toMatch(/\/$/);
      }
    }
    for (const draft of drafts) {
      expect(html, `${route} mentions draft ${draft.slug}`).not.toContain(`/insights/${draft.slug}`);
      if (draft.title) expect(html, `${route} mentions draft title`).not.toContain(draft.title);
    }
    for (const match of html.matchAll(/(?:href|src|srcset)="(\/[^"#?\s]*)/g)) links.add(match[1]);
  }
  for (const link of links) {
    const status = (await page.request.get(link)).status();
    expect(status, link).toBe(200);
  }
});

test("robots and sitemap list the approved public pages only", async ({ page }) => {
  const robots = await (await page.request.get("/robots.txt")).text();
  expect(robots).toMatch(/^Sitemap: .*\/sitemap-index\.xml$/m);
  const paths = await sitemapPaths(page);
  for (const slug of ["born-to-rock", "medastare", "scaleup-systems", "gain-energy-upstrima", "gowabi", "daniela-diamonds"]) {
    expect(paths).toContain(`/portfolio/${slug}/`);
  }
  expect(paths.filter((item) => /^\/team\/[^/]+\/$/.test(item) && item !== "/team/gallery/")).toHaveLength(9);
  expect(paths).not.toContain("/team/gallery/");
  expect(paths).not.toContain("/privacy/");
  expect(paths).not.toContain("/terms/");
  expect(paths.filter((item) => item.includes("sample-"))).toEqual([]);
  expect(paths.filter((item) => item.startsWith("/insights/") && item !== "/insights/")).toEqual([]);
});

test("the 404 page is noindex and claims no canonical URL", async ({ page }) => {
  const response = await page.goto("/missing-page-for-quality-check");
  expect(response?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
});

test("key pages reflow without horizontal scrolling at 320 to 1440 px and with 200% text", async ({ page }) => {
  test.setTimeout(180_000);
  const routes = ["/", "/about", "/services/web-application-development", "/portfolio/medastare", "/team/project-manager", "/process", "/contact"];
  for (const route of routes) {
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      expect(await horizontalOverflow(page), `${route} at ${width}px`).toBeLessThanOrEqual(0);
      if (width === 1440) continue;
      await setLargeText(page);
      expect(await horizontalOverflow(page), `${route} at ${width}px, 200% text`).toBeLessThanOrEqual(0);
    }
  }
});

test("navigation stays available with a 32px browser font at desktop width", async ({ page }) => {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Page.enable");
  await cdp.send("Page.setFontSizes", { fontSizes: { standard: 32, fixed: 26 } });
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/about");
  const desktopNav = page.getByRole("navigation", { name: "Primary" });
  const toggle = page.locator("[data-menu-toggle]");
  expect((await desktopNav.isVisible()) || (await toggle.isVisible())).toBe(true);
  expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
});

test("portfolio images reserve space before loading and use WebP copies", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.route(/\/assets\/portfolio\/.*\.(png|webp|jpg)$/, (route) => route.abort());
  await page.goto("/portfolio");
  const boxes = await page.locator(".shot-frame-mobile img").evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().height));
  expect(boxes.length).toBeGreaterThan(0);
  for (const height of boxes) expect(height).toBeGreaterThan(300);
  await page.unroute(/\/assets\/portfolio\/.*\.(png|webp|jpg)$/);

  await page.goto("/portfolio/born-to-rock");
  const hero = page.locator(".case-hero-shot");
  await expect(hero).toHaveAttribute("src", "/assets/portfolio/born-to-rock/rock-1.png");
  await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.currentSrc)).toMatch(/rock-1\.webp$/);
  const trigger = page.locator("[data-shot]").first();
  await trigger.click();
  const dialog = page.locator("[data-shot-dialog]");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("img")).toHaveAttribute("src", /rock-1\.webp$/);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("the mobile menu stays reachable with 200% text on a short screen", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  await setLargeText(page);
  const toggle = page.locator("[data-menu-toggle]");
  await toggle.click();
  const last = page.locator("[data-mobile-menu] a").last();
  await last.scrollIntoViewIfNeeded();
  const box = await last.boundingBox();
  expect(box && box.y >= 0 && box.y + box.height <= 568).toBe(true);
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
});

test("the skip link stays hidden until it receives focus", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/contact");
  await setLargeText(page);
  const skip = page.locator(".skip-link");
  expect((await skip.boundingBox())!.y + (await skip.boundingBox())!.height).toBeLessThanOrEqual(0);
  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  await expect.poll(async () => (await skip.boundingBox())!.y).toBeGreaterThanOrEqual(0);
});

test("homepage team film plays on its own and stays in frame", async ({ page }) => {
  test.setTimeout(90_000);
  expect((await page.request.get("/videos/vortex-team-showcase.mp4")).status()).toBe(200);
  expect((await page.request.head("/videos/vortex-team-poster.webp")).status()).toBe(200);

  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const films = page.getByRole("region", { name: "A look at collaboration, from idea to launch" });
  await expect(films).toHaveCount(1);
  const hero = page.getByRole("heading", { level: 1 });
  expect(await hero.boundingBox().then((box) => box?.y ?? 999)).toBeLessThan((await films.boundingBox())!.y);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

  const video = films.locator("video");
  await expect(video).toHaveAttribute("autoplay", "");
  await expect(video).toHaveAttribute("muted", "");
  await expect(video).toHaveAttribute("loop", "");
  await expect(video).toHaveJSProperty("paused", false);
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.currentTime)).toBeGreaterThan(0.2);
  await expect(video).toHaveAttribute("controls", "");
  await expect(video).toHaveAttribute("playsinline", "");
  await expect(video).toHaveAttribute("preload", "auto");
  await expect(video).toHaveAttribute("poster", "/videos/vortex-team-poster.webp");
  await expect(video.locator("source")).toHaveAttribute("src", "/videos/vortex-team-showcase.mp4");
  await expect(video.locator("source")).toHaveAttribute("type", "video/mp4");
  await expect(films.getByText("Illustrative team scenes, not footage of an actual company event.")).toBeVisible();
  await expect(films.getByRole("link", { name: "Meet our team" })).toHaveAttribute("href", "/team");
  const beforePlay = await page.evaluate(() =>
    performance.getEntriesByType("resource").map((entry) => ({
      name: entry.name,
      transfer: (entry as PerformanceResourceTiming).transferSize,
    })),
  );
  fs.mkdirSync("docs/step-9f", { recursive: true });
  fs.writeFileSync(
    "docs/step-9f/network-before-play.json",
    JSON.stringify(
      beforePlay.filter((entry) => /video|poster|office-visual/i.test(entry.name)),
      null,
      2,
    ),
  );

  const ratio = await video.evaluate((node) => {
    const box = node.getBoundingClientRect();
    return box.width / box.height;
  });
  expect(Math.abs(ratio - 16 / 9)).toBeLessThan(0.02);

  await video.focus();
  await expect(video).toBeFocused();
  let reachedTeamLink = false;
  for (let step = 0; step < 15; step += 1) {
    await page.keyboard.press("Tab");
    if (await films.getByRole("link", { name: "Meet our team" }).evaluate((node) => node === document.activeElement)) {
      reachedTeamLink = true;
      break;
    }
  }
  expect(reachedTeamLink, "keyboard can leave the player and reach the team link").toBe(true);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.paused)).toBe(true);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.paused)).toBe(false);
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.videoWidth)).toBe(1280);
  const afterPlay = await page.evaluate(() =>
    performance.getEntriesByType("resource").map((entry) => ({
      name: entry.name,
      transfer: (entry as PerformanceResourceTiming).transferSize,
    })),
  );
  fs.writeFileSync(
    "docs/step-9f/network-after-play.json",
    JSON.stringify(
      afterPlay.filter((entry) => /vortex-team/i.test(entry.name)),
      null,
      2,
    ),
  );
  expect(errors.filter((text) => /video|media|mp4/i.test(text))).toEqual([]);

  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await video.scrollIntoViewIfNeeded();
    expect(await horizontalOverflow(page), `home at ${width}px`).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `docs/step-9f/home-${width}.png`, fullPage: false });
    if (width === 1440) continue;
    await setLargeText(page);
    expect(await horizontalOverflow(page), `home at ${width}px, 200% text`).toBeLessThanOrEqual(0);
    if (width === 375) await page.screenshot({ path: "docs/step-9f/home-375-200.png", fullPage: false });
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "";
    });
  }
});
