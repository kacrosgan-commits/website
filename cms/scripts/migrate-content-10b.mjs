#!/usr/bin/env node
/**
 * Step 10B — migrate verified Astro content into local Directus.
 *
 * Modes:
 *   --inventory   read-only source + CMS summary
 *   --dry-run     default; plan creates/skips with no writes (nonzero on critical blockers)
 *   --apply       controlled writes (requires BACKUP_OK=1 and verified backup dir)
 *   --verify      read-back comparison after import
 *
 * Secrets load only from cms/.env. Never printed.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parse as parseYaml } from "yaml";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CMS_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(CMS_ROOT, "..");
const TMP_DIR = path.join(CMS_ROOT, ".tmp");
const CHECKPOINT_PATH = path.join(TMP_DIR, "step-10b-checkpoint.json");
const PRIVATE_MANIFEST_PATH = path.join(TMP_DIR, "step-10b-private-manifest.json");
const EXPECTED_BACKUP = path.join(CMS_ROOT, "backups/step-10b-20261029-111409");

const args = new Set(process.argv.slice(2));
const MODE = args.has("--apply")
  ? "apply"
  : args.has("--verify")
    ? "verify"
    : args.has("--inventory")
      ? "inventory"
      : "dry-run";

const APPROVED_PROJECT_SLUGS = [
  "scaleup-systems",
  "medastare",
  "gain-energy-upstrima",
  "gowabi",
  "daniela-diamonds",
  "born-to-rock",
];

function loadEnv() {
  const envPath = path.join(CMS_ROOT, ".env");
  if (!fs.existsSync(envPath)) throw new Error("Missing cms/.env");
  return Object.fromEntries(
    fs
      .readFileSync(envPath, "utf8")
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const i = line.indexOf("=");
        return [line.slice(0, i), line.slice(i + 1)];
      }),
  );
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function publicPath(webPath) {
  return path.join(REPO_ROOT, "public", webPath.replace(/^\//, ""));
}

function mimeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return (
    {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".mp4": "video/mp4",
      ".pdf": "application/pdf",
    }[ext] || "application/octet-stream"
  );
}

/** Transpile and import local src/data/*.ts without Astro runtime. */
const moduleCache = new Map();
async function importDataModule(relFromRepo) {
  const abs = path.join(REPO_ROOT, relFromRepo);
  if (moduleCache.has(abs)) return import(moduleCache.get(abs));

  let source = fs.readFileSync(abs, "utf8");
  source = source.replace(/import\s+(\w+)\s+from\s+"([^"]+\.json)"\s*;/g, (_, name, jsonRel) => {
    const jsonPath = path.resolve(path.dirname(abs), jsonRel);
    return `const ${name} = ${fs.readFileSync(jsonPath, "utf8")};`;
  });
  source = source.replace(/import\s+type\s+[^;]+;/g, "");
  source = source.replace(/import\.meta\.env\.(\w+)/g, 'undefined /* $1 */');

  const importRe = /from\s+"(\.\/[^"]+)"/g;
  let match;
  const deps = [];
  while ((match = importRe.exec(source))) {
    if (match[1].endsWith(".json")) continue;
    deps.push(match[1]);
  }
  for (const dep of deps) {
    const depRel = path.relative(
      REPO_ROOT,
      path.resolve(path.dirname(abs), dep.endsWith(".ts") ? dep : `${dep}.ts`),
    );
    await importDataModule(depRel);
  }

  source = source.replace(/from\s+"(\.\/[^"]+)"/g, (_, relImp) => {
    if (relImp.endsWith(".json")) return `from "${relImp}"`;
    const depAbs = path.resolve(path.dirname(abs), relImp.endsWith(".ts") ? relImp : `${relImp}.ts`);
    return `from ${JSON.stringify(moduleCache.get(depAbs))}`;
  });

  const out = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    fileName: abs,
  }).outputText;

  const tmp = path.join(TMP_DIR, `mod-${crypto.createHash("sha1").update(abs).digest("hex")}.mjs`);
  fs.mkdirSync(TMP_DIR, { recursive: true });
  fs.writeFileSync(tmp, out);
  const url = pathToFileURL(tmp).href;
  moduleCache.set(abs, url);
  return import(url);
}

function parseMarkdownFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`Missing frontmatter: ${filePath}`);
  return { data: parseYaml(match[1]), body: match[2].replace(/^\n/, ""), raw, sourcePath: filePath };
}

function loadCheckpoint() {
  if (!fs.existsSync(CHECKPOINT_PATH)) {
    return {
      created_at: new Date().toISOString(),
      backup_dir: EXPECTED_BACKUP,
      files: {},
      items: {},
      created_item_ids: [],
      created_file_ids: [],
    };
  }
  return JSON.parse(fs.readFileSync(CHECKPOINT_PATH, "utf8"));
}

function saveCheckpoint(cp) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
  fs.writeFileSync(CHECKPOINT_PATH, JSON.stringify(cp, null, 2));
  fs.chmodSync(CHECKPOINT_PATH, 0o600);
}

function apiFactory(env) {
  const base = (env.PUBLIC_URL || "http://127.0.0.1:8055").replace(/\/$/, "");
  const token = env.ADMIN_TOKEN;
  if (!token) throw new Error("ADMIN_TOKEN required");

  async function api(method, urlPath, body, attempt = 1) {
    const headers = { Authorization: `Bearer ${token}` };
    let payload = body;
    if (body !== undefined && !(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    }
    const response = await fetch(`${base}${urlPath}`, { method, headers, body: payload });
    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { raw: text.slice(0, 300) };
    }
    if ((response.status === 503 || response.status === 429) && attempt < 8) {
      await sleep(500 * attempt);
      return api(method, urlPath, body, attempt + 1);
    }
    return { ok: response.ok, status: response.status, data };
  }

  async function anonymous(urlPath) {
    const response = await fetch(`${base}${urlPath}`);
    return { status: response.status };
  }

  return { base, api, anonymous };
}

async function buildSourceInventory() {
  const teamMod = await importDataModule("src/data/team.ts");
  const servicesMod = await importDataModule("src/data/services.ts");
  const siteMod = await importDataModule("src/data/site.ts");
  const aboutMod = await importDataModule("src/data/about.ts");
  const processMod = await importDataModule("src/data/process.ts");

  const team = teamMod.team;
  if (team.length !== 9) throw new Error(`Expected 9 team members, found ${team.length}`);

  const services = servicesMod.services;
  if (services.length !== 8) throw new Error(`Expected 8 services, found ${services.length}`);

  const caseDir = path.join(REPO_ROOT, "src/content/case-studies");
  const projects = [];
  const excludedSamples = [];
  for (const file of fs.readdirSync(caseDir).filter((f) => f.endsWith(".md")).sort()) {
    const parsed = parseMarkdownFile(path.join(caseDir, file));
    const slug = file.replace(/\.md$/, "");
    if (parsed.data.sample === true) {
      excludedSamples.push(slug);
      continue;
    }
    if (parsed.data.publicationApproved !== true) {
      excludedSamples.push(`${slug} (not publicationApproved)`);
      continue;
    }
    projects.push({ slug, ...parsed, sourceApproval: true });
  }
  const missing = APPROVED_PROJECT_SLUGS.filter((s) => !projects.some((p) => p.slug === s));
  if (missing.length) throw new Error(`Missing approved projects: ${missing.join(",")}`);
  if (projects.length !== 6) throw new Error(`Expected 6 approved projects, found ${projects.length}`);

  const blogDir = path.join(REPO_ROOT, "src/content/blog");
  const articles = fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((file) => {
      const parsed = parseMarkdownFile(path.join(blogDir, file));
      return { slug: file.replace(/\.md$/, ""), ...parsed };
    });
  if (articles.length !== 12) throw new Error(`Expected 12 insights, found ${articles.length}`);

  const media = [];
  function addMedia(role, webPath, meta = {}) {
    const abs = publicPath(webPath);
    if (!fs.existsSync(abs)) {
      media.push({ role, webPath, missing: true, ...meta });
      return;
    }
    media.push({
      role,
      webPath,
      abs,
      bytes: fs.statSync(abs).size,
      sha256: sha256File(abs),
      mime: mimeFor(abs),
      missing: false,
      ...meta,
    });
  }

  for (const [index, member] of team.entries()) {
    addMedia("team_portrait", member.portrait.src, {
      memberSlug: member.slug,
      memberName: member.name,
      display_order: index + 1,
    });
  }

  for (const project of projects) {
    (project.data.screenshots || []).forEach((shot, index) => {
      addMedia("portfolio_screenshot", shot.src, {
        projectSlug: project.slug,
        sort: index + 1,
        alt: shot.alt,
        caption: shot.caption,
        kind: shot.kind,
        width: shot.width,
        height: shot.height,
      });
    });
  }

  addMedia("homepage_poster", "/videos/vortex-team-poster.webp", { deferredVideoCompanion: true });
  // Owner-accepted working-tree film (30s / 13,032,156 bytes). Astro public path unchanged.
  addMedia("homepage_video", "/videos/vortex-team-showcase.mp4", { ownerAcceptedCurrentFilm: true });
  const videoPath = "/videos/vortex-team-showcase.mp4";
  const videoAbs = publicPath(videoPath);
  const videoBytes = fs.existsSync(videoAbs) ? fs.statSync(videoAbs).size : null;
  const videoSha = fs.existsSync(videoAbs) ? sha256File(videoAbs) : null;
  const videoBlocker = {
    role: "homepage_video",
    webPath: videoPath,
    bytes: videoBytes,
    sha256: videoSha,
    expected_verified_bytes: 4718893,
    owner_accepted_current_bytes: 13032156,
    verified_optimized_available: false,
    action: "IMPORT_OWNER_CURRENT",
    reason:
      "Owner confirmed the current 30-second working-tree MP4 (13,032,156 bytes) is the chosen homepage film. Import into Directus; leave Astro public file and homepage layout unchanged. Step 9F's 4,718,893-byte optimized copy was not found in git and is not restored.",
  };

  const adrian = team.find((m) => m.name === "Adrian Cruz");
  const matheus = team.find((m) => m.name === "Matheus Pereira");
  const portraitConflict =
    adrian && matheus && adrian.portrait.src === matheus.portrait.src
      ? "Adrian and Matheus share the same portrait path"
      : null;

  return {
    team,
    services,
    projects,
    articles,
    excludedSamples,
    media,
    videoBlocker,
    portraitConflict,
    site: siteMod.site,
    socialLinks: siteMod.socialLinks,
    about: aboutMod.about,
    homeIntro: aboutMod.homeIntro,
    processSteps: processMod.processSteps,
    homepage: {
      hero_eyebrow: "Software engineering for startups",
      hero_title: "We Build Software That Moves Business Forward.",
      hero_lede: `${siteMod.site.name} helps startups design, build, and improve digital products: web and mobile applications, AI-powered software, and SaaS platforms with a foundation the team can keep changing.`,
      primary_cta_label: "Start Your Project",
      primary_cta_href: "/contact",
      secondary_cta_label: "Explore Our Services",
      secondary_cta_href: "/services",
      team_film_eyebrow: "The people behind the build",
      team_film_heading: "A look at collaboration, from idea to launch",
      team_film_description:
        "A short visual interpretation of the conversations, design reviews, and engineering work that shape digital products.",
      team_film_disclosure: "Illustrative team scenes, not footage of an actual company event.",
      featured_project_slugs: [...projects]
        .sort((a, b) => (a.data.homeRank ?? 99) - (b.data.homeRank ?? 99))
        .map((p) => p.slug),
    },
  };
}

function stagingFlags() {
  return {
    status: "draft",
    publication_approved: false,
    published_at: null,
  };
}

function mapTeam(member, index, portraitFileId) {
  return {
    ...stagingFlags(),
    slug: member.slug,
    name: member.name,
    role: member.role,
    intro: member.intro,
    biography: member.biography,
    responsibilities: member.responsibilities,
    expertise: member.expertise,
    experience: member.experience || "",
    external_experience: member.externalExperience || [],
    startup_support: member.startupSupport || "",
    related_roles: member.related || [],
    portrait: portraitFileId,
    portrait_alt: member.portrait.alt,
    display_order: index + 1,
    featured: index < 4,
    linkedin: member.linkedin || null,
    github: member.github || null,
    portfolio_url: member.portfolio || null,
    seo_title: null,
    seo_description: null,
  };
}

function mapProject(project) {
  const d = project.data;
  return {
    ...stagingFlags(),
    slug: project.slug,
    title: d.title,
    card_title: d.cardTitle || null,
    subtitle: d.subtitle || null,
    description: d.description,
    card_summary: d.cardSummary || null,
    client: d.client || null,
    industry: d.industry || null,
    category: d.category || null,
    services: d.services || [],
    overview: d.overview || null,
    challenge: d.challenge || null,
    features: d.features || [],
    technologies: d.technologies || [],
    technology_notes: d.technology || [],
    project_url: d.projectUrl || null,
    project_url_label: d.projectUrlLabel || null,
    work_dates: d.workDates || null,
    engagement_role: d.engagementRole || null,
    modules_delivered: d.modulesDelivered || null,
    technologies_used: d.technologiesUsed || null,
    integrations_developed: d.integrationsDeveloped || null,
    qa_contribution: d.qaContribution || null,
    publication_permission: d.publicationPermission || null,
    evidence_note: d.evidenceNote || null,
    media_layout: d.mediaLayout || "web",
    filters: d.filters || [],
    featured: Boolean(d.featured),
    home_rank: d.homeRank ?? 99,
    contribution_verified: Boolean(d.contributionVerified),
    seo_title: d.seoTitle || null,
    seo_description: d.seoDescription || null,
  };
}

function mapService(service, index) {
  return {
    ...stagingFlags(),
    slug: service.slug,
    title: service.title,
    summary: service.summary,
    hero: service.hero,
    icon_token: service.icon,
    visual_token: service.visual,
    tags: service.tags || [],
    applications: { intro: service.applicationsIntro, items: service.applications },
    challenges: { intro: service.challengesIntro, items: service.challenges },
    approach: { intro: service.approachIntro, items: service.approach },
    capabilities: service.capabilities,
    deliverables: service.deliverables,
    faqs: service.faqs,
    related_slugs: service.related || [],
    cta_label: service.cta || "Discuss this service",
    cta_href: `/contact?service=${service.slug}`,
    featured: Boolean(service.featured),
    display_order: index + 1,
    seo_title: service.title,
    seo_description: service.metaDescription,
  };
}

function mapArticle(article) {
  const d = article.data;
  return {
    ...stagingFlags(),
    slug: article.slug,
    title: d.title,
    excerpt: d.description,
    body: article.body,
    author: d.author || "Vortex Digital",
    category: d.category,
    featured: Boolean(d.featured),
    reviewed_at: d.updatedAt || d.updatedDate || null,
    seo_title: d.title,
    seo_description: d.description,
    cover_image: null,
  };
}

async function listBySlug(api, collection) {
  const result = await api("GET", `/items/${collection}?limit=-1&fields=id,slug`);
  const rows = Array.isArray(result.data?.data) ? result.data.data : [];
  return new Map(rows.filter((r) => r.slug).map((r) => [r.slug, r.id]));
}

async function findFileByHash(api, sha256, checkpoint) {
  if (checkpoint.files[sha256]) return checkpoint.files[sha256];
  // Directus may not index sha; fall back to scanning titles with our prefix.
  const listed = await api("GET", `/files?limit=-1&fields=id,title,filename_download,filesize`);
  const rows = Array.isArray(listed.data?.data) ? listed.data.data : [];
  for (const row of rows) {
    if (row.title && String(row.title).includes(sha256.slice(0, 16))) {
      checkpoint.files[sha256] = row.id;
      return row.id;
    }
  }
  return null;
}

async function uploadFile(api, media, checkpoint, apply) {
  const existing = await findFileByHash(api, media.sha256, checkpoint);
  if (existing) return { id: existing, created: false, skipped: true };

  if (!apply) return { id: null, created: false, planned: true };

  const bytes = fs.readFileSync(media.abs);
  const form = new FormData();
  form.append(
    "file",
    new Blob([bytes], { type: media.mime }),
    path.basename(media.abs),
  );
  // Directus accepts multipart fields for title etc.
  form.append(
    "title",
    `10b:${media.role}:${media.sha256.slice(0, 16)}:${path.basename(media.abs)}`,
  );

  const uploaded = await api("POST", "/files", form);
  if (!uploaded.ok) {
    throw new Error(`Upload failed ${media.webPath}: ${uploaded.status} ${JSON.stringify(uploaded.data)?.slice(0, 200)}`);
  }
  const id = uploaded.data?.data?.id;
  checkpoint.files[media.sha256] = id;
  checkpoint.created_file_ids.push(id);
  return { id, created: true };
}

async function upsertBySlug(api, collection, slug, payload, checkpoint, apply, keyPrefix) {
  const mapKey = `${keyPrefix || collection}:${slug}`;
  const existingMap = await listBySlug(api, collection);
  if (existingMap.has(slug)) {
    return { id: existingMap.get(slug), created: false, skipped: true, reason: "slug_exists" };
  }
  if (checkpoint.items[mapKey]) {
    return { id: checkpoint.items[mapKey], created: false, skipped: true, reason: "checkpoint" };
  }
  if (!apply) return { id: null, created: false, planned: true };

  const created = await api("POST", `/items/${collection}`, payload);
  if (!created.ok) {
    throw new Error(`Create ${collection}/${slug} failed: ${created.status} ${JSON.stringify(created.data)?.slice(0, 400)}`);
  }
  const id = created.data?.data?.id;
  checkpoint.items[mapKey] = id;
  checkpoint.created_item_ids.push({ collection, id, slug });
  return { id, created: true };
}

function singletonHasOwnerContent(collection, row) {
  if (!row || !row.id) return false;
  if (collection === "site_settings") return Boolean(row.site_name && row.summary);
  if (collection === "homepage_content") return Boolean(row.hero_title && row.hero_lede);
  return false;
}

async function upsertSingleton(api, collection, payload, checkpoint, apply) {
  // Directus singletons use GET/PATCH on /items/<collection> (no POST create route).
  const existing = await api("GET", `/items/${collection}`);
  const row = Array.isArray(existing.data?.data)
    ? existing.data.data[0]
    : existing.data?.data;
  const checkpointKey = `${collection}:singleton`;
  const owned = Boolean(checkpoint.items[checkpointKey]);

  if (row?.id && singletonHasOwnerContent(collection, row)) {
    if (!owned) {
      checkpoint.items[checkpointKey] = row.id;
    }
    return { id: row.id, created: false, skipped: true, reason: "singleton_exists" };
  }
  if (!apply) return { id: row?.id || null, created: false, planned: !singletonHasOwnerContent(collection, row) };

  const patched = await api("PATCH", `/items/${collection}`, payload);
  if (!patched.ok) {
    throw new Error(
      `Patch singleton ${collection} failed: ${patched.status} ${JSON.stringify(patched.data)?.slice(0, 400)}`,
    );
  }
  const id = patched.data?.data?.id;
  if (!owned) {
    checkpoint.items[checkpointKey] = id;
    checkpoint.created_item_ids.push({ collection, id, slug: "singleton" });
    return { id, created: true };
  }
  return { id, created: false, skipped: true, reason: "checkpoint_owned_updated" };
}

async function upsertPageSection(api, pageKey, sectionKey, payload, checkpoint, apply) {
  const key = `${pageKey}/${sectionKey}`;
  const listed = await api(
    "GET",
    `/items/page_sections?limit=-1&filter[page_key][_eq]=${encodeURIComponent(pageKey)}&filter[section_key][_eq]=${encodeURIComponent(sectionKey)}&fields=id`,
  );
  const rows = Array.isArray(listed.data?.data) ? listed.data.data : [];
  if (rows[0]?.id) return { id: rows[0].id, created: false, skipped: true };
  if (checkpoint.items[`page_sections:${key}`]) {
    return { id: checkpoint.items[`page_sections:${key}`], created: false, skipped: true };
  }
  if (!apply) return { id: null, created: false, planned: true };
  const created = await api("POST", "/items/page_sections", payload);
  if (!created.ok) {
    throw new Error(`Create page_section ${key} failed: ${created.status}`);
  }
  const id = created.data?.data?.id;
  checkpoint.items[`page_sections:${key}`] = id;
  checkpoint.created_item_ids.push({ collection: "page_sections", id, slug: key });
  return { id, created: true };
}

function verifyBackupGate() {
  const manifestPath = path.join(EXPECTED_BACKUP, "BACKUP_MANIFEST.json");
  const dumpPath = path.join(EXPECTED_BACKUP, "directus-before.sql");
  if (!fs.existsSync(manifestPath) || !fs.existsSync(dumpPath)) {
    return { ok: false, detail: `Missing verified backup at ${EXPECTED_BACKUP}` };
  }
  const meta = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const dump = fs.readFileSync(dumpPath);
  const sha = crypto.createHash("sha256").update(dump).digest("hex");
  if (dump.length < 1000 || !meta.dump_looks_like_pg_dump) {
    return { ok: false, detail: "Backup dump failed integrity checks" };
  }
  if (sha !== meta.dump_sha256) {
    return { ok: false, detail: "Backup dump SHA-256 mismatch vs BACKUP_MANIFEST" };
  }
  if (process.env.BACKUP_OK !== "1" && MODE === "apply") {
    return {
      ok: false,
      detail: "Refusing --apply without BACKUP_OK=1 (set after confirming backup dir)",
    };
  }
  return { ok: true, meta, sha };
}

async function countCollection(api, collection) {
  const result = await api("GET", `/items/${collection}?aggregate[count]=id`);
  const value = result.data?.data?.[0]?.count?.id;
  if (value !== undefined) return Number(value);
  const listed = await api("GET", `/items/${collection}?limit=-1&fields=id`);
  if (Array.isArray(listed.data?.data)) return listed.data.data.length;
  if (listed.data?.data) return 1;
  return 0;
}

async function main() {
  const env = loadEnv();
  const { base, api, anonymous } = apiFactory(env);

  const ping = await fetch(`${base}/server/ping`);
  if (!ping.ok) throw new Error(`Directus unreachable at ${base}`);
  const me = await api("GET", "/users/me");
  if (!me.ok) throw new Error(`Admin auth failed: ${me.status}`);

  const source = await buildSourceInventory();
  const checkpoint = loadCheckpoint();
  const backup = verifyBackupGate();

  const plan = {
    mode: MODE,
    directus: base,
    backup_ok: backup.ok,
    backup_detail: backup.detail || backup.meta?.backup_dir,
    video_blocker: source.videoBlocker,
    portrait_conflict: source.portraitConflict,
    excluded_samples: source.excludedSamples,
    counts_source: {
      team_members: source.team.length,
      portfolio_projects: source.projects.length,
      portfolio_screenshots: source.projects.reduce((n, p) => n + (p.data.screenshots?.length || 0), 0),
      services: source.services.length,
      insights_articles: source.articles.length,
    },
    media_to_upload: source.media.filter((m) => !m.missing).length,
    media_missing: source.media.filter((m) => m.missing).map((m) => m.webPath),
    creates: [],
    skips: [],
    errors: [],
  };

  if (source.portraitConflict) plan.errors.push(source.portraitConflict);
  if (plan.media_missing.length) plan.errors.push(`Missing media: ${plan.media_missing.join(", ")}`);

  const criticalBlockers = [...plan.errors];
  // Video mismatch is recorded but not a migration blocker for other content.
  if (!backup.ok && MODE === "apply") criticalBlockers.push(backup.detail);

  console.log(
    JSON.stringify(
      {
        mode: MODE,
        source_counts: plan.counts_source,
        media_planned: plan.media_to_upload,
        media_missing: plan.media_missing,
        excluded_samples: plan.excluded_samples,
        video_blocker: {
          bytes: source.videoBlocker.bytes,
          action: source.videoBlocker.action,
        },
        portrait_conflict: source.portraitConflict,
        backup_ok: backup.ok,
      },
      null,
      2,
    ),
  );

  if (MODE === "inventory") {
    const cmsCounts = {};
    for (const c of [
      "team_members",
      "portfolio_projects",
      "portfolio_screenshots",
      "services",
      "insights_articles",
      "page_sections",
    ]) {
      cmsCounts[c] = await countCollection(api, c);
    }
    console.log(JSON.stringify({ cms_counts: cmsCounts, adrian: source.team.find((t) => t.name === "Adrian Cruz")?.portrait.src, matheus: source.team.find((t) => t.name === "Matheus Pereira")?.portrait.src }, null, 2));
    return;
  }

  const apply = MODE === "apply";
  if (apply && criticalBlockers.length) {
    console.error("APPLY_BLOCKED", criticalBlockers);
    process.exit(1);
  }

  const stats = {
    files_created: 0,
    files_skipped: 0,
    items_created: {},
    items_skipped: {},
  };
  const bump = (bag, key, field) => {
    bag[key] = bag[key] || { created: 0, skipped: 0 };
    bag[key][field] += 1;
  };
  const bumpResult = (key, result) => {
    bump(stats.items_created, key, result.created || result.planned ? "created" : "skipped");
  };

  // --- files ---
  const fileIdByWebPath = new Map();
  for (const media of source.media) {
    if (media.missing) continue;
    const result = await uploadFile(api, media, checkpoint, apply);
    if (result.created || result.planned) stats.files_created += 1;
    else stats.files_skipped += 1;
    if (result.id) fileIdByWebPath.set(media.webPath, result.id);
    else if (!apply) fileIdByWebPath.set(media.webPath, `planned:${media.sha256.slice(0, 12)}`);
    if (apply) saveCheckpoint(checkpoint);
  }

  // --- team ---
  for (const [index, member] of source.team.entries()) {
    const portraitId = fileIdByWebPath.get(member.portrait.src);
    const payload = mapTeam(member, index, apply ? portraitId : null);
    if (!apply) delete payload.portrait;
    const result = await upsertBySlug(api, "team_members", member.slug, payload, checkpoint, apply);
    bumpResult("team_members", result);
    if (apply) saveCheckpoint(checkpoint);
  }

  // --- projects then screenshots ---
  const projectIdBySlug = new Map();
  for (const project of source.projects) {
    const payload = mapProject(project);
    const result = await upsertBySlug(api, "portfolio_projects", project.slug, payload, checkpoint, apply);
    bumpResult("portfolio_projects", result);
    if (result.id) projectIdBySlug.set(project.slug, result.id);
    else if (!apply) projectIdBySlug.set(project.slug, `planned:${project.slug}`);
    if (apply) saveCheckpoint(checkpoint);
  }

  // refresh project ids from CMS when skipping
  if (apply) {
    const map = await listBySlug(api, "portfolio_projects");
    for (const [slug, id] of map) projectIdBySlug.set(slug, id);
  }

  for (const project of source.projects) {
    const shots = project.data.screenshots || [];
    for (const [index, shot] of shots.entries()) {
      const sort = index + 1;
      const slugKey = `${project.slug}#${sort}`;
      const existing = await api(
        "GET",
        `/items/portfolio_screenshots?limit=1&filter[checksum_sha256][_eq]=${sha256File(publicPath(shot.src))}&fields=id`,
      );
      const existingRow = Array.isArray(existing.data?.data) ? existing.data.data[0] : null;
      if (existingRow?.id) {
        bump(stats.items_created, "portfolio_screenshots", "skipped");
        continue;
      }
      if (checkpoint.items[`portfolio_screenshots:${slugKey}`]) {
        bump(stats.items_created, "portfolio_screenshots", "skipped");
        continue;
      }
      if (!apply) {
        bump(stats.items_created, "portfolio_screenshots", "created");
        continue;
      }
      const imageId = fileIdByWebPath.get(shot.src);
      const projectId = projectIdBySlug.get(project.slug);
      const orientation = shot.width >= shot.height ? "landscape" : "portrait";
      const payload = {
        project: projectId,
        image: imageId,
        alt: shot.alt,
        caption: shot.caption,
        kind: shot.kind,
        width: shot.width,
        height: shot.height,
        orientation,
        provenance_note: shot.kind,
        checksum_sha256: sha256File(publicPath(shot.src)),
        sort,
        status: "draft",
      };
      const created = await api("POST", "/items/portfolio_screenshots", payload);
      if (!created.ok) throw new Error(`screenshot ${slugKey}: ${created.status}`);
      const id = created.data?.data?.id;
      checkpoint.items[`portfolio_screenshots:${slugKey}`] = id;
      checkpoint.created_item_ids.push({ collection: "portfolio_screenshots", id, slug: slugKey });
      bump(stats.items_created, "portfolio_screenshots", "created");
      saveCheckpoint(checkpoint);
    }
  }

  // --- services ---
  for (const [index, service] of source.services.entries()) {
    const payload = mapService(service, index);
    const result = await upsertBySlug(api, "services", service.slug, payload, checkpoint, apply);
    bumpResult("services", result);
    if (apply) saveCheckpoint(checkpoint);
  }

  // --- insights ---
  for (const article of source.articles) {
    if (article.data.publicationApproved === true) {
      throw new Error(`Insight ${article.slug} is publicationApproved in source — refusing migrate-as-draft assumption`);
    }
    const payload = mapArticle(article);
    const result = await upsertBySlug(api, "insights_articles", article.slug, payload, checkpoint, apply);
    bumpResult("insights_articles", result);
    if (apply) saveCheckpoint(checkpoint);
  }

  // --- site settings singleton ---
  {
    const payload = {
      site_name: source.site.name,
      tagline: source.site.tagline,
      summary: source.site.summary,
      description: source.site.description,
      location: source.site.location || "",
      social_links: (source.socialLinks || []).filter((l) => String(l.href || "").startsWith("http")),
      default_seo_title: source.site.name,
      default_seo_description: source.site.description,
      cta_primary_label: "Start Your Project",
      cta_primary_href: "/contact",
    };
    const result = await upsertSingleton(api, "site_settings", payload, checkpoint, apply);
    bumpResult("site_settings", result);
    if (apply) saveCheckpoint(checkpoint);
  }

  // --- homepage singleton (poster + owner-accepted current film) ---
  {
    const posterId = fileIdByWebPath.get("/videos/vortex-team-poster.webp") || null;
    const videoId = fileIdByWebPath.get("/videos/vortex-team-showcase.mp4") || null;
    const payload = {
      ...source.homepage,
      hero_image: null,
      team_film_video: apply ? videoId : null,
      team_film_poster: apply ? posterId : null,
      status: "draft",
      publication_approved: false,
    };
    if (!apply) {
      delete payload.team_film_poster;
      delete payload.team_film_video;
    }
    const result = await upsertSingleton(api, "homepage_content", payload, checkpoint, apply);
    bumpResult("homepage_content", result);

    // Additive correction: if singleton already existed without video, attach file only.
    if (apply && videoId) {
      const current = await api("GET", "/items/homepage_content?fields=id,team_film_video,team_film_poster");
      const row = Array.isArray(current.data?.data) ? current.data.data[0] : current.data?.data;
      const needsVideo = row?.id && !row.team_film_video;
      const needsPoster = row?.id && !row.team_film_poster && posterId;
      if (needsVideo || needsPoster) {
        const patch = {};
        if (needsVideo) patch.team_film_video = videoId;
        if (needsPoster) patch.team_film_poster = posterId;
        const patched = await api("PATCH", "/items/homepage_content", patch);
        if (!patched.ok) {
          throw new Error(`homepage video/poster attach failed: ${patched.status}`);
        }
        console.log(
          JSON.stringify({
            homepage_media_attach: {
              video: needsVideo ? videoId : "already_set",
              poster: needsPoster ? posterId : "already_set_or_skipped",
            },
          }),
        );
      }
    }
    if (apply) saveCheckpoint(checkpoint);
  }

  // --- page sections (about + process) ---
  const aboutSections = [
    {
      page_key: "about",
      section_key: "hero",
      section_type: "hero",
      eyebrow: source.about.heroEyebrow,
      title: source.about.heroTitle,
      body: source.about.heroDescription,
      sort: 1,
    },
    {
      page_key: "about",
      section_key: "who",
      section_type: "copy",
      title: source.about.whoHeading,
      body: (source.about.who || []).join("\n\n"),
      sort: 2,
    },
    {
      page_key: "about",
      section_key: "audiences",
      section_type: "list",
      title: source.about.audienceHeading,
      body: source.about.audienceNote,
      items: source.about.audiences,
      sort: 3,
    },
    {
      page_key: "about",
      section_key: "mission",
      section_type: "copy",
      title: source.about.missionHeading,
      body: `${source.about.mission}\n\n${source.about.missionSupport}`,
      sort: 4,
    },
    {
      page_key: "about",
      section_key: "vision",
      section_type: "copy",
      title: source.about.visionHeading,
      body: `${source.about.vision}\n\n${source.about.visionSupport}`,
      sort: 5,
    },
    {
      page_key: "about",
      section_key: "philosophy",
      section_type: "list",
      title: source.about.philosophyHeading,
      items: source.about.philosophy,
      sort: 6,
    },
    {
      page_key: "process",
      section_key: "steps",
      section_type: "list",
      title: "Our process",
      items: source.processSteps,
      sort: 1,
    },
    {
      page_key: "about",
      section_key: "home_intro",
      section_type: "copy",
      eyebrow: source.homeIntro.eyebrow,
      title: source.homeIntro.title,
      body: `${source.homeIntro.lead}\n\n${source.homeIntro.body}\n\n${source.homeIntro.support}`,
      sort: 7,
    },
  ];

  for (const section of aboutSections) {
    const payload = {
      ...section,
      status: "draft",
      publication_approved: false,
    };
    const result = await upsertPageSection(api, section.page_key, section.section_key, payload, checkpoint, apply);
    bumpResult("page_sections", result);
    if (apply) saveCheckpoint(checkpoint);
  }

  // --- verify / privacy ---
  const cmsCounts = {};
  for (const c of [
    "team_members",
    "portfolio_projects",
    "portfolio_screenshots",
    "services",
    "insights_articles",
    "page_sections",
  ]) {
    cmsCounts[c] = apply || MODE === "verify" || MODE === "dry-run" ? await countCollection(api, c) : null;
  }

  const privacy = {};
  for (const target of [
    "/items/team_members",
    "/items/portfolio_projects",
    "/items/insights_articles",
    "/items/services",
    "/files",
  ]) {
    privacy[target] = (await anonymous(target)).status;
  }

  let verifyDetails = null;
  if (MODE === "verify" || apply) {
    const teams = await api("GET", "/items/team_members?limit=-1&fields=id,slug,name,status,publication_approved,published_at,portrait,display_order&sort=display_order");
    const projects = await api("GET", "/items/portfolio_projects?limit=-1&fields=id,slug,status,publication_approved,published_at,home_rank,contribution_verified&sort=home_rank");
    const shots = await api("GET", "/items/portfolio_screenshots?limit=-1&fields=id,project,sort,checksum_sha256,status");
    const insights = await api("GET", "/items/insights_articles?limit=-1&fields=id,slug,status,publication_approved,published_at");
    const teamRows = teams.data?.data || [];
    const projectRows = projects.data?.data || [];
    const shotRows = shots.data?.data || [];
    const insightRows = insights.data?.data || [];

    const adrianRow = teamRows.find((t) => t.name === "Adrian Cruz");
    const matheusRow = teamRows.find((t) => t.name === "Matheus Pereira");

    const shotsByProject = {};
    for (const shot of shotRows) {
      const key = shot.project;
      shotsByProject[key] = (shotsByProject[key] || 0) + 1;
    }

    const homepage = await api("GET", "/items/homepage_content?fields=id,team_film_video,team_film_poster,team_film_disclosure,status,publication_approved");
    const homeRow = Array.isArray(homepage.data?.data) ? homepage.data.data[0] : homepage.data?.data;
    const filesMeta = await api("GET", "/files?limit=0&meta=filter_count");
    const fileCount = filesMeta.data?.meta?.filter_count ?? null;

    verifyDetails = {
      team_count: teamRows.length,
      project_count: projectRows.length,
      screenshot_count: shotRows.length,
      insights_count: insightRows.length,
      file_count: fileCount,
      homepage_team_film_video: homeRow?.team_film_video || null,
      homepage_team_film_poster: homeRow?.team_film_poster || null,
      homepage_disclosure: homeRow?.team_film_disclosure || null,
      all_draft: [...teamRows, ...projectRows, ...insightRows].every(
        (r) => r.status === "draft" && r.publication_approved === false && !r.published_at,
      ),
      adrian_portrait: adrianRow?.portrait,
      matheus_portrait: matheusRow?.portrait,
      portraits_distinct: adrianRow && matheusRow ? adrianRow.portrait !== matheusRow.portrait : false,
      screenshots_per_project: shotsByProject,
      project_slugs: projectRows.map((p) => p.slug).sort(),
      insight_slugs: insightRows.map((i) => i.slug).sort(),
    };
  }

  // private manifest
  const privateManifest = {
    generated_at: new Date().toISOString(),
    mode: MODE,
    backup_dir: EXPECTED_BACKUP,
    source_approval: {
      team: source.team.map((t) => ({ slug: t.slug, name: t.name, source_isPublished: t.isPublished })),
      projects: source.projects.map((p) => ({
        slug: p.slug,
        source_publicationApproved: true,
        cms_status: "draft",
        cms_publication_approved: false,
      })),
      insights: source.articles.map((a) => ({
        slug: a.slug,
        source_status: a.data.status,
        source_publicationApproved: a.data.publicationApproved,
        source_draft: a.data.draft,
        cms_status: "draft",
        cms_publication_approved: false,
      })),
    },
    checkpoint_items: checkpoint.items,
    created_item_ids: checkpoint.created_item_ids,
    created_file_ids: checkpoint.created_file_ids,
    media: source.media.map((m) => ({
      role: m.role,
      webPath: m.webPath,
      sha256: m.sha256,
      bytes: m.bytes,
      file_id: checkpoint.files[m.sha256] || null,
    })),
    video_blocker: source.videoBlocker,
  };
  fs.mkdirSync(TMP_DIR, { recursive: true });
  fs.writeFileSync(PRIVATE_MANIFEST_PATH, JSON.stringify(privateManifest, null, 2));
  fs.chmodSync(PRIVATE_MANIFEST_PATH, 0o600);
  if (apply) saveCheckpoint(checkpoint);

  const summary = {
    mode: MODE,
    stats,
    cms_counts_after: Object.fromEntries(
      await Promise.all(
        [
          "team_members",
          "portfolio_projects",
          "portfolio_screenshots",
          "services",
          "insights_articles",
          "page_sections",
        ].map(async (c) => [c, await countCollection(api, c)]),
      ),
    ),
    privacy_anonymous_status: privacy,
    verify: verifyDetails,
    video_deferred: false,
    video_imported:
      Boolean(verifyDetails?.homepage_team_film_video) &&
      Number(verifyDetails?.file_count) >= 29,
    critical_blockers: criticalBlockers,
  };
  console.log(JSON.stringify(summary, null, 2));

  if (MODE === "dry-run" && criticalBlockers.length) process.exit(1);
  if (MODE === "verify") {
    const ok =
      verifyDetails &&
      verifyDetails.team_count === 9 &&
      verifyDetails.project_count === 6 &&
      verifyDetails.screenshot_count === 18 &&
      verifyDetails.insights_count === 12 &&
      verifyDetails.file_count === 29 &&
      Boolean(verifyDetails.homepage_team_film_video) &&
      Boolean(verifyDetails.homepage_team_film_poster) &&
      verifyDetails.all_draft &&
      verifyDetails.portraits_distinct &&
      Object.values(privacy).every((s) => s === 401 || s === 403 || s === 404);
    if (!ok) {
      console.error("VERIFY_FAILED", {
        file_count: verifyDetails?.file_count,
        homepage_team_film_video: Boolean(verifyDetails?.homepage_team_film_video),
        homepage_team_film_poster: Boolean(verifyDetails?.homepage_team_film_poster),
      });
      process.exit(1);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
