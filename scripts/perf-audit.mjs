// Local lab measurements against the production preview. Not field data and not a Lighthouse score.
// Usage: node scripts/perf-audit.mjs [baseUrl] [outFile] [runs]
//        PERF_ROUTES=/,/contact/ limits the run to those routes.
import fs from "node:fs";
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://127.0.0.1:4321";
const outFile = process.argv[3] ?? "perf-audit.json";
const runs = Number(process.argv[4] ?? 3);
const routes = process.env.PERF_ROUTES?.split(",") ?? [
  "/",
  "/about/",
  "/services/",
  "/services/web-application-development/",
  "/portfolio/",
  "/portfolio/scaleup-systems/",
  "/portfolio/medastare/",
  "/portfolio/born-to-rock/",
  "/team/",
  "/team/ai-engineer/",
  "/contact/",
];
const profiles = [
  { name: "desktop-unthrottled", viewport: { width: 1440, height: 900 } },
  { name: "mobile-unthrottled", viewport: { width: 375, height: 812 }, isMobile: true, deviceScaleFactor: 2 },
  {
    name: "mobile-slow-network",
    viewport: { width: 375, height: 812 },
    isMobile: true,
    deviceScaleFactor: 2,
    network: { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 },
    cpu: 4,
  },
];

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

async function measure(browser, route, profile) {
  const context = await browser.newContext({
    viewport: profile.viewport,
    isMobile: profile.isMobile ?? false,
    deviceScaleFactor: profile.deviceScaleFactor ?? 1,
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  if (profile.network) await cdp.send("Network.emulateNetworkConditions", profile.network);
  if (profile.cpu) await cdp.send("Emulation.setCPUThrottlingRate", { rate: profile.cpu });

  const transfers = new Map();
  let phase = "initial";
  const byPhase = { initial: { requests: 0, bytes: 0 }, scrolled: { requests: 0, bytes: 0 } };
  const types = {};
  cdp.on("Network.responseReceived", (event) => transfers.set(event.requestId, { url: event.response.url, type: event.type, phase }));
  cdp.on("Network.loadingFinished", (event) => {
    const item = transfers.get(event.requestId);
    if (!item) return;
    byPhase[item.phase].requests += 1;
    byPhase[item.phase].bytes += event.encodedDataLength;
    types[item.type] = (types[item.type] ?? 0) + event.encodedDataLength;
  });

  await page.addInitScript(() => {
    window.__lcp = { time: 0, element: "", url: "" };
    window.__cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__lcp = {
          time: entry.startTime,
          element: entry.element ? `${entry.element.tagName}.${String(entry.element.className).slice(0, 40)}` : "",
          url: entry.url || "",
        };
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__cls += entry.value;
    }).observe({ type: "layout-shift", buffered: true });
  });

  await page.goto(`${base}${route}`, { waitUntil: "load", timeout: 120_000 });
  await page.waitForTimeout(500);
  const timing = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const paint = performance.getEntriesByName("first-contentful-paint")[0];
    return {
      ttfb: nav.responseStart,
      fcp: paint?.startTime ?? 0,
      dcl: nav.domContentLoadedEventEnd,
      load: nav.loadEventEnd,
      lcp: window.__lcp,
      clsBeforeScroll: window.__cls,
    };
  });
  phase = "scrolled";
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
  });
  await page.waitForLoadState("networkidle", { timeout: 120_000 });
  const clsAfterScroll = await page.evaluate(() => window.__cls);
  await context.close();
  return { ...timing, clsAfterScroll, byPhase, types };
}

const browser = await chromium.launch({ channel: process.env.CI ? undefined : "chrome" });
const version = browser.version();
const results = [];
for (const profile of profiles) {
  for (const route of routes) {
    const samples = [];
    for (let i = 0; i < runs; i += 1) samples.push(await measure(browser, route, profile));
    const last = samples.at(-1);
    results.push({
      profile: profile.name,
      route,
      runs,
      fcpMs: Math.round(median(samples.map((s) => s.fcp))),
      lcpMs: Math.round(median(samples.map((s) => s.lcp.time))),
      lcpElement: last.lcp.element,
      lcpUrl: last.lcp.url.replace(base, ""),
      loadMs: Math.round(median(samples.map((s) => s.load))),
      clsBeforeScroll: Number(median(samples.map((s) => s.clsBeforeScroll)).toFixed(4)),
      clsAfterScroll: Number(median(samples.map((s) => s.clsAfterScroll)).toFixed(4)),
      initialRequests: last.byPhase.initial.requests,
      initialKB: Math.round(last.byPhase.initial.bytes / 1024),
      scrolledRequests: last.byPhase.scrolled.requests,
      scrolledKB: Math.round(last.byPhase.scrolled.bytes / 1024),
      typesKB: Object.fromEntries(Object.entries(last.types).map(([key, value]) => [key, Math.round(value / 1024)])),
    });
    console.log(JSON.stringify(results.at(-1)));
  }
}
await browser.close();
fs.writeFileSync(outFile, JSON.stringify({ base, chrome: version, runs, profiles, results }, null, 2));
