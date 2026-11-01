import fs from "node:fs";
import { expect, test } from "@playwright/test";

const shotDir = "docs/hero-3d-qa/after";

const heroes = [
  ["/", "home"],
  ["/about", "about"],
  ["/services", "services"],
  ["/portfolio", "portfolio"],
  ["/process", "process"],
  ["/team", "team"],
  ["/contact", "contact"],
] as const;

test.beforeAll(() => {
  fs.mkdirSync(shotDir, { recursive: true });
});

test("reduced motion keeps the hero fallback and skips WebGL", async ({ page }) => {
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/about", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-hero-stage='workspace']")).toHaveCount(1);
  await expect(page.locator(".hero-stage-3d.is-live")).toHaveCount(0);
  await expect(page.locator(".stage-world")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.screenshot({ path: `${shotDir}/about-1440-reduced-motion.png` });
});

test("main heroes mount a live scene without page errors", async ({ page }) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 900 });
  const failures: string[] = [];
  page.on("pageerror", (error) => failures.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") failures.push(message.text());
  });

  for (const [path, name] of heroes) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    if (path === "/") {
      await expect(page.locator("[data-home-showcase]")).toHaveCount(1);
      await expect(page.locator(".hero-stage-3d")).toHaveCount(0);
    } else {
      await expect(page.locator("[data-hero-stage]")).toHaveCount(1);
      await expect(page.locator(".hero-stage-3d.is-live")).toHaveCount(1, { timeout: 8_000 });
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
  await page.goto("/services", { waitUntil: "domcontentloaded" });
  await page.screenshot({ path: `${shotDir}/services-375.png` });
});
