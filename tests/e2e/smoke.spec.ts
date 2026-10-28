import { expect, test } from "@playwright/test";

const routes = ["/", "/about", "/services", "/portfolio", "/process", "/team", "/team/gallery", "/insights", "/contact", "/privacy", "/terms"];
const profiles = [
  "founder-ceo",
  "cofounder-cto",
  "cfo",
  "project-manager",
  "senior-fullstack-developer",
  "ai-engineer",
  "mobile-app-developer",
  "uiux-product-designer",
  "qa-devops-engineer",
];

test("primary routes respond and the homepage states the offer", async ({ page }) => {
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.ok(), route).toBeTruthy();
  }
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("We Build Software That Moves Business Forward");
  await expect(page.getByRole("link", { name: "Start Your Project" })).toHaveAttribute("href", "/contact");
});

test("team, gallery, and profiles render the supplied images", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("/team");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("The People and Disciplines Behind");
  await expect(page.getByRole("heading", { name: "How We Work Together" })).toBeVisible();
  await expect(page.getByRole("link", { name: "View Profile" })).toHaveCount(9);
  await expect(page.getByRole("link", { name: "View All 27 Images" })).toBeVisible();
  await expect(page.getByText("Name pending")).toHaveCount(0);
  const people: [string, string][] = [
    ["founder-ceo", "Don Tran"],
    ["cofounder-cto", "Joshua Mendoza"],
    ["cfo", "Lin Jiayi"],
    ["project-manager", "Pongsak Rattanakul"],
    ["senior-fullstack-developer", "Dmytro Melnyk"],
    ["ai-engineer", "Carlo Garcia"],
    ["mobile-app-developer", "Matheus Pereira"],
    ["uiux-product-designer", "Adrian Cruz"],
    ["qa-devops-engineer", "Sofia Vasylivna Melnyk"],
  ];
  for (const [, name] of people) {
    await expect(page.getByRole("heading", { level: 3, name, exact: true })).toBeVisible();
  }
  await expect(page.getByText("Illustrative portrait")).toHaveCount(0);

  await page.goto("/team/gallery");
  const images = page.locator('img[src*="/assets/team/"]');
  await expect(images).toHaveCount(27);
  await page.evaluate(async () => {
    const nodes = [...document.querySelectorAll<HTMLImageElement>('img[src*="/assets/team/"]')];
    for (const img of nodes) {
      img.scrollIntoView({ behavior: "instant", block: "center" });
      await img.decode().catch(() => undefined);
    }
  });
  const sizes = await images.evaluateAll((nodes) =>
    nodes.map((node) => ({
      src: node.getAttribute("src"),
      width: (node as HTMLImageElement).naturalWidth,
      alt: node.getAttribute("alt") ?? "",
    })),
  );
  expect(new Set(sizes.map((item) => item.src)).size).toBe(27);
  expect(sizes.every((item) => item.width > 0 && item.alt.length > 0)).toBeTruthy();

  for (const [slug, name] of people) {
    await page.goto(`/team/${slug}`);
    const memberImages = page.locator(`img[src*="/assets/team/${slug}/"]`);
    await expect(memberImages).toHaveCount(3);
    await expect(page.getByRole("heading", { name: "Working Together" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
    await expect(page.getByText("Name pending")).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    const portrait = page.locator(`img[src="/assets/team/${slug}/portrait.webp"]`);
    await expect(portrait.first()).toBeVisible();
    await expect(portrait.first()).toHaveAttribute("alt", new RegExp(`^Portrait of ${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}, `));
    if (slug === "uiux-product-designer") {
      await expect(page.getByRole("heading", { name: "Previous and external experience" })).toBeVisible();
      await expect(page.getByText("Human Factors Engineer at Cepheid")).toBeVisible();
      await expect(page.getByText("That role is not Vortex Digital work.")).toBeVisible();
    }
  }

  await page.goto("/team/founder-ceo");
  await page.getByRole("link", { name: /Next/ }).click();
  await expect(page).toHaveURL(/\/team\/cofounder-cto\/?$/);
  await page.getByRole("link", { name: /Previous/ }).click();
  await expect(page).toHaveURL(/\/team\/founder-ceo\/?$/);
});

test("contact form copies a draft and does not send it", async ({ page }) => {
  test.setTimeout(60_000);
  const posts: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") posts.push(request.url());
  });

  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/contact");
  await expect(page).toHaveTitle(/Contact/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.locator("[data-delivery='unconfigured']")).toContainText("won't send it");
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Copy inquiry" })).toBeVisible();

  await page.getByRole("button", { name: "Copy inquiry" }).click();
  await expect(page.locator("#full-name-error")).toHaveText("Enter your full name.");
  await expect(page.locator("#full-name")).toBeFocused();
  await expect(page.locator("[data-success]")).toBeHidden();
  await expect(page.getByText("Inquiry copied")).toHaveCount(0);

  await page.locator("#full-name").fill("Ada Owner");
  await expect(page.locator("#full-name-error")).toBeHidden();
  await page.locator("#business-email").fill("not-an-email");
  await page.getByRole("button", { name: "Copy inquiry" }).click();
  await expect(page.locator("#business-email-error")).toHaveText("Enter a valid email address.");
  await page.locator("#business-email").fill("ada@client.test");
  await page.locator("#company-name").fill("Northwind");
  await page.locator("#project-type").selectOption("Web Application");
  await page.locator("#project-description").fill("We need a private admin tool for the operations team.");
  await page.locator("#privacy-consent").check();
  await page.locator("#business-email").blur();
  await expect(page.locator("#business-email-error")).toBeHidden();

  await page.locator("#full-name").focus();
  await page.keyboard.press("Tab");
  await expect(page.locator("#business-email")).toBeFocused();
  await expect(page.locator("#company_website")).not.toBeFocused();

  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.getByRole("button", { name: "Copy inquiry" }).click();
  await expect(page.locator("[data-form-status]")).toHaveText("Inquiry copied. No message has been sent.");
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("Name: Ada Owner");
  expect(copied).toContain("Email: ada@client.test");
  expect(copied).not.toContain("company_website");
  expect(copied).not.toContain("hello@example.com");
  expect(posts).toEqual([]);
  await expect(page.locator("[data-success]")).toBeHidden();

  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error("denied")) },
    });
  });
  await page.getByRole("button", { name: "Copy inquiry" }).click();
  await expect(page.locator("[data-form-status]")).toHaveText("Copy wasn't available in this browser; select and copy the text manually.");
  await expect(page.locator("#inquiry-draft")).toHaveValue(/Name: Ada Owner/);
  await expect(page.locator("#inquiry-draft")).not.toHaveValue(/company_website/);
  await expect(page.getByText("Inquiry copied")).toHaveCount(0);

  await page.goto("/contact?service=%3Cscript%3Ealert(1)%3C/script%3E");
  await expect(page.locator("#project-type")).toHaveValue("");

  await page.goto("/services/web-application-development");
  await page.getByRole("link", { name: "Discuss Your Web Application" }).first().click();
  await expect(page).toHaveURL(/\/contact\/?\?service=web-application-development/);
  await expect(page.locator("#project-type")).toHaveValue("Web Application");

  await page.goto("/services/qa-software-testing");
  await page.getByRole("link", { name: "Discuss Your Testing Plan" }).first().click();
  await expect(page.locator("#project-type")).toHaveValue("QA & Testing");
});

test("unknown routes use the custom 404", async ({ page }) => {
  const response = await page.goto("/missing-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("mobile navigation opens", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Open menu" });
  await expect(menu).toBeVisible();
  await menu.click();
  await expect(page.getByRole("link", { name: "Contact" }).first()).toBeVisible();
});

test("six approved case studies are public", async ({ page }) => {
  await page.goto("/portfolio");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Selected Work");
  const cards = page.getByRole("heading", { level: 3 });
  await expect(cards).toHaveCount(6);
  await expect(cards.nth(0)).toContainText("ScaleUp Systems");
  await expect(cards.nth(1)).toContainText("MedaStaré");
  await expect(cards.nth(2)).toContainText("Gain Energy / Upstrima");
  await expect(cards.nth(3)).toContainText("GoWabi");
  await expect(cards.nth(4)).toContainText("Daniela Diamonds");
  await expect(cards.nth(5)).toContainText("Born To Rock");
  await expect(page.getByRole("link", { name: "View Case Study" })).toHaveCount(6);
  await expect(page.locator(".filter-btn")).toHaveCount(0);

  await page.goto("/portfolio/medastare");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("MedaStaré — AI Fashion & Lifestyle Mobile App");
  await expect(page.getByRole("link", { name: "View live product" })).toHaveAttribute(
    "href",
    "https://apps.apple.com/us/app/medastar%C3%A9/id6813994639",
  );
  await expect(page.locator("[data-shot]")).toHaveCount(3);
  const sources = await page.locator('img[src*="/assets/portfolio/medastare/"]').evaluateAll((nodes) => [
    ...new Set(nodes.map((node) => node.getAttribute("src"))),
  ]);
  expect(sources.sort()).toEqual([
    "/assets/portfolio/medastare/meda-1.png",
    "/assets/portfolio/medastare/meda-2.png",
    "/assets/portfolio/medastare/meda-3-wardrobe.png",
  ]);
  await expect(page.getByRole("link", { name: "ScaleUp Systems — Marketing Website for an AI Sales Platform" })).toBeVisible();
  await expect(page.getByText("recommendation engine")).toHaveCount(0);
  await expect(page.getByText("Stripe Connect")).toHaveCount(0);
  await expect(page.getByText("Firebase backend")).toHaveCount(0);

  await page.goto("/portfolio/gain-energy-upstrima");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Gain Energy / Upstrima — Website for an AI-Powered Energy Platform",
  );
  await expect(page.getByRole("link", { name: "Visit Live Website" })).toHaveAttribute("href", "https://www.gain.energy/");
  await expect(page.getByText("Next.js and React were used for the public marketing website.")).toBeVisible();
  await expect(page.getByText("specific SaaS modules are not detailed in this case study.")).toBeVisible();
  await expect(page.locator("[data-shot]")).toHaveCount(3);
  const gainSources = await page.locator('img[src*="/assets/portfolio/gain-energy-upstrima/"]').evaluateAll((nodes) => [
    ...new Set(nodes.map((node) => node.getAttribute("src"))),
  ]);
  expect(gainSources.sort()).toEqual([
    "/assets/portfolio/gain-energy-upstrima/gain-01-home.jpg",
    "/assets/portfolio/gain-energy-upstrima/gain-02-features.jpg",
    "/assets/portfolio/gain-energy-upstrima/gain-03-cases.jpg",
  ]);
  await expect(page.getByRole("link", { name: "ScaleUp Systems — Marketing Website for an AI Sales Platform" })).toBeVisible();
  await expect(page.getByRole("link", { name: "MedaStaré — AI Fashion & Lifestyle Mobile App" })).toBeVisible();
  await expect(page.getByText("FastAPI")).toHaveCount(0);
  await expect(page.getByText("WITSML")).toHaveCount(0);
  await expect(page.getByText("LangChain")).toHaveCount(0);

  await page.goto("/portfolio/gowabi");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("GoWabi — Beauty & Wellness Marketing Website");
  await expect(page.getByRole("link", { name: "Visit Live Website" })).toHaveAttribute("href", "https://www.gowabi.com/");
  await expect(page.getByText("HTML, CSS, and JavaScript").first()).toBeVisible();
  await expect(page.getByText("booking marketplace behind the pages")).toBeVisible();
  const stack = page.locator("section").filter({ has: page.getByRole("heading", { name: "Technology stack" }) });
  await expect(stack.getByText("Next.js")).toHaveCount(0);
  await expect(stack.getByText("React")).toHaveCount(0);
  await expect(page.locator("[data-shot]")).toHaveCount(3);
  const gowabiSources = await page.locator('img[src*="/assets/portfolio/gowabi/"]').evaluateAll((nodes) => [
    ...new Set(nodes.map((node) => node.getAttribute("src"))),
  ]);
  expect(gowabiSources.sort()).toEqual([
    "/assets/portfolio/gowabi/gowabi-01-home.jpg",
    "/assets/portfolio/gowabi/gowabi-02-listings.jpg",
    "/assets/portfolio/gowabi/gowabi-03-venue.jpg",
  ]);
  await expect(page.getByRole("link", { name: "ScaleUp Systems — Marketing Website for an AI Sales Platform" })).toBeVisible();
  await expect(page.getByRole("link", { name: "MedaStaré — AI Fashion & Lifestyle Mobile App" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Gain Energy / Upstrima", exact: true })).toBeVisible();
  await expect(page.getByText("booking engine")).toHaveCount(0);
  await expect(page.getByText("payment processing")).toHaveCount(0);
  await expect(page.getByText("Ruby on Rails")).toHaveCount(0);

  await page.goto("/portfolio/scaleup-systems");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("ScaleUp Systems");
  await expect(page.getByRole("link", { name: "MedaStaré — AI Fashion & Lifestyle Mobile App" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Gain Energy / Upstrima", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "GoWabi", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Daniela Diamonds", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Born To Rock", exact: true })).toBeVisible();

  await page.goto("/portfolio/daniela-diamonds");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Daniela Diamonds — Jewelry E-commerce Storefront UI");
  await expect(page.getByRole("link", { name: "Visit Live Website" })).toHaveAttribute("href", "https://danieladiamonds.com/");
  await expect(page.getByText("HTML, CSS, and JavaScript").first()).toBeVisible();
  await expect(page.getByText("Belgium Webnet Inc.")).toBeVisible();
  await expect(page.getByText("does not claim sole ownership of the store.")).toBeVisible();
  const jewelryStack = page.locator("section").filter({ has: page.getByRole("heading", { name: "Technology stack" }) });
  await expect(jewelryStack.getByText("Shopify")).toHaveCount(0);
  await expect(jewelryStack.getByText("Liquid")).toHaveCount(0);
  await expect(page.locator("[data-shot]")).toHaveCount(3);
  const danielaSources = await page.locator('img[src*="/assets/portfolio/daniela-diamonds/"]').evaluateAll((nodes) => [
    ...new Set(nodes.map((node) => node.getAttribute("src"))),
  ]);
  expect(danielaSources.sort()).toEqual([
    "/assets/portfolio/daniela-diamonds/daniela-01-home.jpg",
    "/assets/portfolio/daniela-diamonds/daniela-02-ring-builder.jpg",
    "/assets/portfolio/daniela-diamonds/daniela-03-product.jpg",
  ]);
  await expect(page.getByRole("link", { name: "GoWabi", exact: true })).toBeVisible();
  await expect(page.getByText("payment gateway")).toHaveCount(0);
  await expect(page.getByText("Liquid templates")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "ScaleUp Systems — Marketing Website for an AI Sales Platform" })).toBeVisible();

  await page.goto("/portfolio/born-to-rock");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Born To Rock — Mobile Rhythm Game");
  await expect(page.getByRole("link", { name: "View on App Store" })).toHaveAttribute(
    "href",
    "https://apps.apple.com/us/app/born-to-rock-rhythm-game/id6789210953",
  );
  await expect(page.getByText("React, Ionic, and PixiJS").first()).toBeVisible();
  await expect(page.getByText("April 2026 – Present. Ongoing.")).toBeVisible();
  await expect(page.getByText("developed the complete game")).toBeVisible();
  const gameStack = page.locator("section").filter({ has: page.getByRole("heading", { name: "Technology stack" }) });
  await expect(gameStack.getByText("Unity")).toHaveCount(0);
  await expect(gameStack.getByText("Cocos")).toHaveCount(0);
  await expect(gameStack.getByText("Capacitor")).toHaveCount(0);
  const contribution = page.locator("section").filter({ has: page.getByRole("heading", { name: "Our contribution" }) });
  await expect(contribution.getByText("Unity")).toHaveCount(0);
  await expect(contribution.getByText("Capacitor")).toHaveCount(0);
  await expect(contribution.getByText("backend")).toHaveCount(0);
  await expect(page.getByText("100,000 downloads")).toHaveCount(0);
  await expect(page.getByText("$500,000")).toHaveCount(0);
  await expect(page.locator("[data-shot]")).toHaveCount(3);
  const rockSources = await page.locator('img[src*="/assets/portfolio/born-to-rock/"]').evaluateAll((nodes) => [
    ...new Set(nodes.map((node) => node.getAttribute("src"))),
  ]);
  expect(rockSources.sort()).toEqual([
    "/assets/portfolio/born-to-rock/rock-1.png",
    "/assets/portfolio/born-to-rock/rock-2.png",
    "/assets/portfolio/born-to-rock/rock-3.png",
  ]);
  await expect(page.getByRole("link", { name: "Discuss Your Game" })).toHaveAttribute("href", "/contact");
  await expect(page.getByRole("link", { name: "Daniela Diamonds", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "MedaStaré — AI Fashion & Lifestyle Mobile App" })).toBeVisible();

  const sample = await page.goto("/portfolio/sample-brand-platform");
  expect(sample?.status()).toBe(404);

  const index = await page.request.get("/sitemap-index.xml");
  expect(index.ok()).toBeTruthy();
  const indexXml = await index.text();
  const children = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
  expect(children.length).toBeGreaterThan(0);
  let sawScaleUp = false;
  let sawMeda = false;
  let sawGain = false;
  let sawGoWabi = false;
  let sawDaniela = false;
  let sawBorn = false;
  for (const child of children) {
    const xml = await (await page.request.get(child)).text();
    if (xml.includes("scaleup-systems")) sawScaleUp = true;
    if (xml.includes("medastare")) sawMeda = true;
    if (xml.includes("gain-energy-upstrima")) sawGain = true;
    if (xml.includes("/gowabi")) sawGoWabi = true;
    if (xml.includes("daniela-diamonds")) sawDaniela = true;
    if (xml.includes("born-to-rock")) sawBorn = true;
    expect(xml, child).not.toContain("sample-brand-platform");
  }
  expect(sawScaleUp).toBeTruthy();
  expect(sawMeda).toBeTruthy();
  expect(sawGain).toBeTruthy();
  expect(sawGoWabi).toBeTruthy();
  expect(sawDaniela).toBeTruthy();
  expect(sawBorn).toBeTruthy();

  await page.goto("/");
  const work = page.locator("section").filter({ has: page.getByRole("heading", { name: "Approved client work." }) });
  const featured = work.getByRole("heading", { level: 3 });
  await expect(featured).toHaveCount(6);
  await expect(featured.nth(0)).toContainText("ScaleUp Systems");
  await expect(featured.nth(1)).toContainText("MedaStaré");
  await expect(featured.nth(2)).toContainText("Gain Energy / Upstrima");
  await expect(featured.nth(3)).toContainText("GoWabi");
  await expect(featured.nth(4)).toContainText("Daniela Diamonds");
  await expect(featured.nth(5)).toContainText("Born To Rock");
  await expect(work.getByRole("link", { name: "View Case Study" })).toHaveCount(6);
});

test("named profiles are indexed and the gallery stays out", async ({ page }) => {
  await page.goto("/team/founder-ceo");
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  await expect(page).toHaveTitle(/Don Tran — Founder & CEO/);
  await page.goto("/team/gallery");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByText("not a group photograph of the team")).toBeVisible();

  const index = await page.request.get("/sitemap-index.xml");
  expect(index.ok()).toBeTruthy();
  const indexXml = await index.text();
  const children = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
  const xml = (await Promise.all(children.map((child) => page.request.get(child).then((response) => response.text())))).join("\n");
  for (const slug of profiles) expect(xml).toContain(`/team/${slug}`);
  expect(xml).not.toContain("/team/gallery");
  expect(xml).not.toContain("sample-brand-platform");
});

test("unapproved insights stay off the public site", async ({ page }) => {
  await page.goto("/insights");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Insights are being prepared.");
  await expect(page.getByRole("heading", { name: "No articles are published yet." })).toBeVisible();
  await expect(page.getByRole("link", { name: "View services" })).toHaveAttribute("href", "/services");
  await expect(page.getByRole("link", { name: "View portfolio" })).toHaveAttribute("href", "/portfolio");
  for (const title of [
    "Planning an MVP for a Startup",
    "Architecture for an Early-Stage SaaS Product",
    "API Habits for a Small Product Team",
    "UX and QA Checks Before a Product Launch",
  ]) {
    await expect(page.getByText(title)).toHaveCount(0);
  }
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Insights" })).toHaveCount(0);

  await page.setViewportSize({ width: 375, height: 800 });
  await page.getByRole("button", { name: "Open menu" }).click();
  const mobile = page.getByRole("navigation", { name: "Mobile" });
  await expect(mobile.getByRole("link", { name: "Insights" })).toHaveCount(0);
  await expect(mobile.getByRole("link", { name: "Services" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");

  expect((await page.goto("/insights/planning-an-mvp-for-a-startup"))?.status()).toBe(404);
  expect((await page.goto("/insights/api-habits-for-a-small-product-team"))?.status()).toBe(404);

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await expect(page.getByText("Planning an MVP for a Startup")).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Insights" })).toHaveCount(0);

  const index = await page.request.get("/sitemap-index.xml");
  expect(index.ok()).toBeTruthy();
  const children = [...(await index.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
  const xml = (await Promise.all(children.map((child) => page.request.get(child).then((response) => response.text())))).join("\n");
  expect(xml).not.toContain("/insights/planning-an-mvp-for-a-startup");
  expect(xml).not.toContain("/insights/api-habits-for-a-small-product-team");
  expect(xml).not.toContain("/insights/ux-and-qa-before-a-product-launch");
  expect(xml).toContain("/insights/");
});
