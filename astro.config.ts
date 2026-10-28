import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defaultSiteUrl } from "./src/data/defaults";
import { team } from "./src/data/team";
import { frontmatterIsPublicInsight } from "./src/utils/insights";

const site = process.env.PUBLIC_SITE_URL || defaultSiteUrl;

function unindexedPathnames(): string[] {
  const groups = [
    { dir: "src/content/blog", prefix: "/insights/" },
    { dir: "src/content/case-studies", prefix: "/portfolio/" },
  ];
  const paths: string[] = [];

  for (const group of groups) {
    const absolute = path.join(process.cwd(), group.dir);
    if (!fs.existsSync(absolute)) continue;

    for (const file of fs.readdirSync(absolute)) {
      if (!/\.mdx?$/.test(file)) continue;
      const raw = fs.readFileSync(path.join(absolute, file), "utf8");
      const blocked = /^(draft|demonstration|sample):\s*true\s*$/m.test(raw);
      const caseStudy = group.dir.endsWith("case-studies");
      const approved = /^publicationApproved:\s*true\s*$/m.test(raw);
      const unpublished = caseStudy ? blocked || !approved : !frontmatterIsPublicInsight(raw);
      if (unpublished) {
        paths.push(`${group.prefix}${file.replace(/\.mdx?$/, "")}`);
      }
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
        if (pathname === "/terms" || pathname === "/privacy" || pathname === "/team/gallery") return false;
        if (team.some((member) => !member.isPublished && pathname === `/team/${member.slug}`)) return false;
        return !hidden.some((entry) => pathname === entry);
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
