import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defaultSiteUrl } from "./src/data/defaults";
import { team } from "./src/data/team";

const site = process.env.PUBLIC_SITE_URL || defaultSiteUrl;

function unindexedPathnames(): string[] {
  const absolute = path.join(process.cwd(), "src/content/case-studies");
  const paths: string[] = [];
  if (!fs.existsSync(absolute)) return paths;

  for (const file of fs.readdirSync(absolute)) {
    if (!/\.mdx?$/.test(file)) continue;
    const raw = fs.readFileSync(path.join(absolute, file), "utf8");
    const blocked = /^(draft|demonstration|sample):\s*true\s*$/m.test(raw);
    const approved = /^publicationApproved:\s*true\s*$/m.test(raw);
    if (blocked || !approved) {
      paths.push(`/portfolio/${file.replace(/\.mdx?$/, "")}`);
    }
  }

  return paths;
}

const hidden = unindexedPathnames();

export default defineConfig({
  site,
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname.replace(/\/$/, "") || "/";
        if (pathname === "/terms" || pathname === "/privacy") return false;
        if (pathname === "/insights" || pathname.startsWith("/insights/")) return false;
        if (pathname === "/services" || pathname.startsWith("/services/")) return false;
        if (team.some((member) => !member.isPublished && pathname === `/team/${member.slug}`)) return false;
        return !hidden.some((entry) => pathname === entry);
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
