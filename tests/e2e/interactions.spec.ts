import { expect, test, type Page } from "@playwright/test";

/* Team bio panel, case-study image viewer, and the contact form's delivery states. */

const insideDialog = (page: Page, selector: string) =>
  page.evaluate((target) => Boolean(document.activeElement?.closest(target)), selector);

test("team portraits open a bio panel by mouse, keyboard and touch, and Escape returns focus", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/team");
  const tile = page.locator('a.wall-tile[data-bio-open="founder-ceo"]');
  const panel = page.locator("#bio-founder-ceo");
  await expect(panel).toBeHidden();
  await expect(page.getByRole("link", { name: /View profile/ })).toHaveCount(0);

  await tile.click();
  await expect(panel).toBeVisible();
  await expect(panel.getByRole("heading", { level: 2, name: "Don Tran" })).toBeVisible();
  await expect(panel.getByText("Founder and CEO with 9 years in software engineering")).toBeVisible();
  await expect(panel.getByRole("listitem").filter({ hasText: "Backend systems" })).toBeVisible();
  await expect(panel.getByRole("link", { name: /View profile/ })).toHaveAttribute("href", "/team/founder-ceo");
  await expect(panel.locator("[data-bio-close]")).toBeFocused();
  await expect(page).toHaveURL(/\/team\/?$/);

  // Focus stays inside the panel.
  for (let step = 0; step < 4; step += 1) {
    await page.keyboard.press("Tab");
    expect(await insideDialog(page, "#bio-founder-ceo")).toBe(true);
  }
  await page.keyboard.press("Shift+Tab");
  expect(await insideDialog(page, "#bio-founder-ceo")).toBe(true);

  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(tile).toBeFocused();

  // Keyboard: Enter on the focused portrait opens it; the close button closes it.
  await page.keyboard.press("Enter");
  await expect(panel).toBeVisible();
  await panel.locator("[data-bio-close]").click();
  await expect(panel).toBeHidden();
  await expect(tile).toBeFocused();

  // A click on the backdrop closes it too.
  await page.locator('a.wall-tile[data-bio-open="cfo"]').click();
  await expect(page.locator("#bio-cfo")).toBeVisible();
  await page.mouse.click(8, 8);
  await expect(page.locator("#bio-cfo")).toBeHidden();
});

test("the bio panel works on touch and with reduced motion", async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/team");
  await page.locator('a.wall-tile[data-bio-open="cfo"]').tap();
  const panel = page.locator("#bio-cfo");
  await expect(panel).toBeVisible();
  const box = (await panel.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(390);
  await panel.locator("[data-bio-close]").tap();
  await expect(panel).toBeHidden();
  await context.close();
});

test("without JavaScript each portrait links straight to its profile", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/team");
  await expect(page.locator(".bio[open]")).toHaveCount(0);
  await page.locator('a.wall-tile[data-bio-open="project-manager"]').click();
  await expect(page).toHaveURL(/\/team\/project-manager\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Pongsak Rattanakul");
  await context.close();
});

test("each person has one unique portrait transition name, shared with their profile", async ({ page }) => {
  await page.goto("/team");
  const names = await page.locator(".wall-tile img").evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).viewTransitionName));
  expect(names).toHaveLength(9);
  expect(new Set(names).size).toBe(9);
  expect(names[0]).toBe("team-founder-ceo");
  // Project cards keep their own names, so the two morphs never share one.
  expect(names.every((name) => name.startsWith("team-"))).toBe(true);
  await page.goto("/team/founder-ceo");
  const portrait = page.locator('img[src="/assets/team/founder-ceo/portrait.webp"]');
  expect(await portrait.evaluate((node) => getComputedStyle(node).viewTransitionName)).toBe("team-founder-ceo");
  const named = await page.evaluate(() =>
    [...document.querySelectorAll("*")].filter((node) => getComputedStyle(node).viewTransitionName.startsWith("team-")).length,
  );
  expect(named).toBe(1);
});

test("case-study previews open a keyboard-friendly image viewer", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/portfolio/gowabi");
  const previews = page.locator("[data-shot]");
  await expect(previews).toHaveCount(3);

  // 16:10 browser-frame previews, cropped from the top of each screenshot.
  const crop = page.locator(".shot-gallery-web .shot-crop").first();
  await crop.scrollIntoViewIfNeeded();
  const box = (await crop.boundingBox())!;
  expect(box.width / box.height).toBeCloseTo(1.6, 1);
  expect(await crop.locator("img").evaluate((img) => getComputedStyle(img).objectPosition)).toBe("50% 0%");

  const alts = await previews.evaluateAll((nodes) => nodes.map((node) => (node as HTMLElement).dataset.alt));
  await previews.first().click();
  const viewer = page.locator("[data-shot-dialog]");
  await expect(viewer).toBeVisible();
  await expect(viewer.locator("[data-shot-close]")).toBeFocused();
  await expect(viewer.locator("[data-shot-count]")).toHaveText("Image 1 of 3");
  await expect(viewer.locator("img")).toHaveAttribute("alt", alts[0]!);

  await page.keyboard.press("ArrowRight");
  await expect(viewer.locator("[data-shot-count]")).toHaveText("Image 2 of 3");
  await expect(viewer.locator("img")).toHaveAttribute("alt", alts[1]!);
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await expect(viewer.locator("[data-shot-count]")).toHaveText("Image 3 of 3");
  await expect(viewer.locator("img")).toHaveAttribute("src", "/assets/portfolio/gowabi/gowabi-03-venue.jpg");

  for (let step = 0; step < 5; step += 1) {
    await page.keyboard.press("Tab");
    expect(await insideDialog(page, "[data-shot-dialog]")).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(viewer).toBeHidden();
  await expect(previews.nth(2)).toBeFocused();

  await previews.nth(1).click();
  await viewer.getByRole("button", { name: /Next image/ }).click();
  await expect(viewer.locator("[data-shot-count]")).toHaveText("Image 3 of 3");
  await viewer.locator("[data-shot-close]").click();
  await expect(viewer).toBeHidden();
  await expect(previews.nth(2)).toBeFocused();
});

test("without JavaScript a preview opens the image file itself", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/portfolio/born-to-rock");
  await expect(page.locator("[data-shot]").first()).toHaveAttribute("href", "/assets/portfolio/born-to-rock/rock-1.png");
  await expect(page.locator(".shot-gallery-mobile .browser-bar")).toHaveCount(0);
  await context.close();
});

/* The production build has no endpoint, so these tests serve the contact page with one set (the
   same markup a configured build renders the data attribute from) and answer for Formspree. */
const endpoint = "https://formspree.io/f/e2etest";

async function configuredContact(page: Page) {
  await page.route(/\/contact\/?$/, async (route) => {
    const response = await route.fetch();
    // An empty endpoint renders as a bare data-endpoint attribute.
    const html = (await response.text()).replace(/data-endpoint(="")?(?=[\s>])/, `data-endpoint="${endpoint}"`);
    await route.fulfill({ response, body: html });
  });
  await page.goto("/contact");
  await page.locator("#full-name").fill("Ada Owner");
  await page.locator("#business-email").fill("ada@client.test");
  await page.locator("#company-name").fill("Northwind");
  await page.locator("#project-type").selectOption("Web Application");
  await page.locator("#project-description").fill("We need a private admin tool for the operations team.");
  await page.locator("#privacy-consent").check();
  await page.waitForTimeout(1300);
}

test("a confirmed Formspree delivery shows a clear success message", async ({ page }) => {
  let body = "";
  let accept = "";
  await page.route(endpoint, async (route) => {
    body = route.request().postData() ?? "";
    accept = (await route.request().allHeaders()).accept ?? "";
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });
  await configuredContact(page);
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator("[data-success]")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Message submitted" })).toBeFocused();
  await expect(page.locator("[data-contact-form]")).toBeHidden();
  expect(accept).toContain("application/json");
  for (const field of ["name", "email", "company", "service", "message", "privacy"]) {
    expect(body, field).toContain(`name="${field}"`);
  }
  expect(body).toContain("ada@client.test");
  expect(body).not.toContain("company_website");
});

test("a failed Formspree delivery says the message was not sent and keeps the answers", async ({ page }) => {
  await page.route(endpoint, (route) =>
    route.fulfill({
      status: 422,
      contentType: "application/json",
      body: JSON.stringify({ errors: [{ message: "Email is not valid" }] }),
    }),
  );
  await configuredContact(page);
  await page.getByRole("button", { name: "Send message" }).click();
  const alert = page.locator("[data-form-error]");
  await expect(alert).toBeVisible();
  await expect(alert).toContainText("Your message was not sent.");
  await expect(alert).toContainText("Email is not valid");
  await expect(page.locator("[data-success]")).toBeHidden();
  await expect(page.locator("#full-name")).toHaveValue("Ada Owner");
  await expect(page.getByRole("button", { name: "Send message" })).toBeEnabled();

  // A network failure is reported the same way, without a provider message.
  await page.unroute(endpoint);
  await page.route(endpoint, (route) => route.abort());
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(alert).toBeVisible();
  await expect(alert.locator("[data-form-error-detail]")).toBeHidden();
  await expect(page.locator("[data-success]")).toBeHidden();
});
