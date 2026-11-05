import fs from "node:fs";
import { expect, test } from "@playwright/test";

const shotDir = "docs/hero-3d-qa/after";

const heroes = [
  ["/", "home"],
  ["/about", "about"],
  ["/portfolio", "portfolio"],
  ["/process", "process"],
  ["/team", "team"],
  ["/contact", "contact"],
] as const;

test.beforeAll(() => {
  fs.mkdirSync(shotDir, { recursive: true });
});

test("reduced motion shows the inner pages' real content and no 3D scene", async ({ page }) => {
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/about", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-hero-stage]")).toHaveCount(0);
  await expect(page.locator(".about-photo img")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.screenshot({ path: `${shotDir}/about-1440-reduced-motion.png` });
});

/** The first piece of real content each inner page opens on, in place of the old 3D scene. */
const realContent: Record<string, string> = {
  "/about": ".about-photo img",
  "/portfolio": ".work-index > .portfolio-card[data-lg='wide'] img",
  "/process": ".stage-index a[href='#discovery-requirements']",
  "/team": ".team-wall .wall-tile",
  "/contact": "[data-contact-form]",
};

test("the homepage keeps its hero and inner pages open on real content without three.js", async ({ page }) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 900 });
  const failures: string[] = [];
  const scripts: string[] = [];
  page.on("pageerror", (error) => failures.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") failures.push(message.text());
  });
  page.on("request", (request) => scripts.push(request.url()));

  for (const [path, name] of heroes) {
    scripts.length = 0;
    await page.goto(path, { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    if (path === "/") {
      await expect(page.locator(".photo-hero-bleed")).toHaveCount(1);
      await expect(page.locator("[data-hall-parallax]")).toHaveCount(0);
      await expect(page.locator(".hero-stage-3d")).toHaveCount(0);
    } else {
      await expect(page.locator("[data-hero-stage]")).toHaveCount(0);
      const content = page.locator(realContent[path]).first();
      await expect(content).toBeVisible();
      expect((await content.boundingBox())!.y, `${path} content starts in the first view`).toBeLessThan(900);
      if (path === "/portfolio") {
        await page.locator(".work-index .shot-frame").first().hover();
        await page.waitForTimeout(600);
      }
      expect(scripts.filter((url) => /three|hero-stage|liquid-hover/i.test(url)), `${path} requests three.js`).toEqual([]);
    }
    const box = await page.getByRole("heading", { level: 1 }).boundingBox();
    expect(box && box.width).toBeGreaterThan(40);
    await page.screenshot({ path: `${shotDir}/${name}-1440.png` });
  }

  expect(failures).toEqual([]);
});

test("hero pages do not overflow at phone and desktop widths", async ({ page }) => {
  test.setTimeout(90_000);
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    for (const [path] of heroes) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(1);
    }
  }
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/about", { waitUntil: "domcontentloaded" });
  await page.screenshot({ path: `${shotDir}/about-375.png` });
});
