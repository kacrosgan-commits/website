import fs from "node:fs";
import { expect, test } from "@playwright/test";

const shotDir = "docs/sitewide-motion-qa";

test.beforeAll(() => {
  fs.mkdirSync(shotDir, { recursive: true });
});

test("reduced motion keeps content visible and skips the reveal enhancement", async ({ page }) => {
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).not.toHaveClass(/can-reveal/);
  await expect(page.locator(".await-reveal")).toHaveCount(0);
  const hero = page.getByRole("heading", { level: 1 });
  await expect(hero).toBeVisible();
  expect(await hero.evaluate((node) => getComputedStyle(node).opacity)).toBe("1");
  expect(await hero.evaluate((node) => getComputedStyle(node).animationName)).toBe("none");
  await page.screenshot({ path: `${shotDir}/home-1440-reduced-motion.png` });
});

test("scroll reveal runs once and leaves headings readable", async ({ page }) => {
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 900 });
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.screenshot({ path: `${shotDir}/home-1440-top.png` });
  await expect(page.locator("html")).toHaveClass(/can-reveal/);
  const heading = page.locator("#services-heading");
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toBeVisible();
  const section = page.locator("section[aria-labelledby='services-heading']");
  await expect(section).toHaveClass(/is-in/);
  expect(await heading.evaluate((node) => Number(getComputedStyle(node).opacity))).toBeGreaterThan(0.9);
  await page.screenshot({ path: `${shotDir}/home-1440-scrolled.png` });
  await page.evaluate(async () => {
    for (let step = 0; step < 8; step += 1) {
      window.scrollTo(0, document.documentElement.scrollHeight);
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
  });
  const stuck = await page.evaluate(() =>
    [...document.querySelectorAll(".await-reveal:not(.is-in)")].filter((node) => {
      const rect = node.getBoundingClientRect();
      return rect.height > 1 && rect.top < window.innerHeight && rect.bottom > 0;
    }).length,
  );
  expect(stuck).toBe(0);
  expect(errors).toEqual([]);
});

test("key routes stay in frame at the requested widths", async ({ page }) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const routes = ["/", "/about", "/services", "/portfolio", "/team", "/process", "/contact", "/insights"];
  for (const route of routes) {
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${route} at ${width}px`).toBeLessThanOrEqual(1);
    }
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.screenshot({ path: `${shotDir}/home-375.png` });
  await page.goto("/contact");
  await page.screenshot({ path: `${shotDir}/contact-375.png` });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/portfolio");
  await page.screenshot({ path: `${shotDir}/portfolio-1440.png` });
  await page.goto("/team");
  await page.screenshot({ path: `${shotDir}/team-1440.png` });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "Services" })).toBeVisible();
  await page.screenshot({ path: `${shotDir}/home-375-menu.png` });
});

test("javascript disabled still shows the homepage and contact form", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Start Your Project" })).toBeVisible();
  await page.screenshot({ path: `${shotDir}/home-1280-no-js.png` });
  await page.goto("/contact");
  await expect(page.getByText(/won.t send it/)).toBeVisible();
  await expect(page.getByLabel("Full name")).toBeVisible();
  await page.screenshot({ path: `${shotDir}/contact-1280-no-js.png` });
  await context.close();
});
