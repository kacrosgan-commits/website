import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.E2E_PORT || 4321);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  fullyParallel: false,
  // Specs share one local preview server; parallel files caused timeouts under load.
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "off",
    ...(process.env.CI ? {} : { channel: "chrome" as const }),
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Astro 7 sends `astro preview` to the background when it detects an automated or agent shell,
    // and the launching process then exits at once ("webServer exited early") while the server keeps
    // running. --ignore-lock keeps it a foreground child that Playwright owns and stops after the run.
    command: `npm run preview -- --host 127.0.0.1 --port ${port} --ignore-lock`,
    url: baseURL,
    // Always test a fresh server for the current dist/. A stray server on the port fails fast
    // instead of being reused with an old build.
    reuseExistingServer: false,
    gracefulShutdown: { signal: "SIGTERM", timeout: 5_000 },
    timeout: 120_000,
  },
});
