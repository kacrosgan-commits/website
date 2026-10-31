#!/usr/bin/env node
/**
 * Idempotent Directus schema bootstrap for Vortex Digital Step 10A.
 * Uses ADMIN_TOKEN from cms/.env. Never prints secrets.
 *
 * Usage (from cms/):
 *   node scripts/apply-schema.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env");
if (!fs.existsSync(envPath)) {
  console.error("Missing cms/.env. Copy cms/.env.example and fill secrets first.");
  process.exit(1);
}

const env = Object.fromEntries(
  fs
    .readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i), line.slice(i + 1)];
    }),
);

const base = (env.PUBLIC_URL || "http://127.0.0.1:8055").replace(/\/$/, "");
const token = env.ADMIN_TOKEN;
if (!token) {
  console.error("ADMIN_TOKEN is required in cms/.env for schema scripts.");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function api(method, urlPath, body, attempt = 1) {
  const response = await fetch(`${base}${urlPath}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  if ((response.status === 503 || response.status === 429) && attempt < 8) {
    await sleep(750 * attempt);
    return api(method, urlPath, body, attempt + 1);
  }
  return { ok: response.ok, status: response.status, data };
}

function field(collection, fieldName, type, extras = {}) {
  return {
    collection,
    field: fieldName,
    type,
    meta: {
      interface: extras.interface,
      special: extras.special,
      required: extras.required ?? false,
      readonly: extras.readonly ?? false,
      hidden: extras.hidden ?? false,
      width: extras.width ?? "full",
      note: extras.note,
      options: extras.options,
      display: extras.display,
      display_options: extras.display_options,
      sort: extras.sort,
    },
    schema: {
      is_nullable: extras.required ? false : true,
      is_unique: extras.unique ?? false,
      default_value: extras.default ?? undefined,
      max_length: extras.max_length,
      foreign_key_table: extras.foreign_key_table,
      foreign_key_column: extras.foreign_key_column,
    },
  };
}

const STATUS_CHOICES = [
  { text: "Draft", value: "draft" },
  { text: "In review", value: "in_review" },
  { text: "Approved", value: "approved" },
  { text: "Published", value: "published" },
  { text: "Archived", value: "archived" },
];

function editorialFields(collection, { withSlug = true, withSeo = true } = {}) {
  const fields = [
    field(collection, "status", "string", {
      interface: "select-dropdown",
      required: true,
      default: "draft",
      options: { choices: STATUS_CHOICES },
      note: "Editorial workflow status. Defaults to draft. Publishing is a later-step decision.",
      sort: 10,
    }),
    field(collection, "publication_approved", "boolean", {
      interface: "boolean",
      required: true,
      default: false,
      note: "Owner approval flag. Must stay false until an explicit owner decision.",
      sort: 20,
    }),
    field(collection, "published_at", "timestamp", {
      interface: "datetime",
      note: "Set only when a record is actually published to the public site.",
      sort: 30,
    }),
  ];
  if (withSlug) {
    fields.push(
      field(collection, "slug", "string", {
        interface: "input",
        required: true,
        unique: true,
        max_length: 120,
        note: "Stable public route segment. Preserve existing Astro slugs when migrating.",
        sort: 40,
      }),
    );
  }
  if (withSeo) {
    fields.push(
      field(collection, "seo_title", "string", {
        interface: "input",
        max_length: 70,
        note: "Optional document title override.",
        sort: 900,
      }),
      field(collection, "seo_description", "text", {
        interface: "input-multiline",
        note: "Optional meta description override.",
        sort: 910,
      }),
      field(collection, "seo_image", "uuid", {
        interface: "file-image",
        special: ["file"],
        note: "Optional Open Graph image. Private until explicitly approved later.",
        sort: 920,
      }),
    );
  }
  return fields;
}

const collections = [
  {
    collection: "team_members",
    meta: {
      collection: "team_members",
      icon: "groups",
      note: "Named team profiles. Do not invent employees. Portraits migrate in Step 10B.",
      display_template: "{{name}} — {{role}}",
      archive_field: "status",
      archive_value: "archived",
      unarchive_value: "draft",
      sort_field: "display_order",
      accountability: "all",
    },
    schema: { name: "team_members" },
    fields: [
      ...editorialFields("team_members"),
      field("team_members", "name", "string", {
        interface: "input",
        max_length: 160,
        note: "Null/empty until a real name is confirmed.",
        sort: 50,
      }),
      field("team_members", "role", "string", {
        interface: "input",
        required: true,
        max_length: 160,
        sort: 60,
      }),
      field("team_members", "intro", "text", { interface: "input-multiline", sort: 70 }),
      field("team_members", "biography", "json", {
        interface: "input-code",
        options: { language: "json" },
        note: "JSON array of biography paragraphs.",
        sort: 80,
      }),
      field("team_members", "responsibilities", "json", {
        interface: "input-code",
        options: { language: "json" },
        note: "JSON array of {title, detail} objects.",
        sort: 90,
      }),
      field("team_members", "expertise", "json", {
        interface: "input-code",
        options: { language: "json" },
        note: "JSON array of {title, detail} objects.",
        sort: 100,
      }),
      field("team_members", "experience", "string", { interface: "input", sort: 110 }),
      field("team_members", "external_experience", "json", {
        interface: "input-code",
        options: { language: "json" },
        note: "Earlier employers. Keep separate from Vortex Digital work.",
        sort: 120,
      }),
      field("team_members", "startup_support", "text", { interface: "input-multiline", sort: 130 }),
      field("team_members", "related_roles", "json", {
        interface: "input-code",
        options: { language: "json" },
        note: "JSON array of {slug, note}.",
        sort: 140,
      }),
      field("team_members", "portrait", "uuid", {
        interface: "file-image",
        special: ["file"],
        note: "Owner-assigned portrait. Do not swap identities.",
        sort: 150,
      }),
      field("team_members", "portrait_alt", "string", { interface: "input", sort: 160 }),
      field("team_members", "display_order", "integer", {
        interface: "input",
        required: true,
        default: 99,
        sort: 170,
      }),
      field("team_members", "featured", "boolean", {
        interface: "boolean",
        required: true,
        default: false,
        sort: 180,
      }),
      field("team_members", "linkedin", "string", { interface: "input", sort: 190 }),
      field("team_members", "github", "string", { interface: "input", sort: 200 }),
      field("team_members", "portfolio_url", "string", { interface: "input", sort: 210 }),
    ],
  },
  {
    collection: "portfolio_projects",
    meta: {
      collection: "portfolio_projects",
      icon: "work",
      note: "Approved case studies only after owner verification. No invented metrics in 10A.",
      display_template: "{{title}}",
      archive_field: "status",
      archive_value: "archived",
      unarchive_value: "draft",
      sort_field: "home_rank",
      accountability: "all",
    },
    schema: { name: "portfolio_projects" },
    fields: [
      ...editorialFields("portfolio_projects"),
      field("portfolio_projects", "title", "string", { interface: "input", required: true, sort: 50 }),
      field("portfolio_projects", "card_title", "string", { interface: "input", sort: 55 }),
      field("portfolio_projects", "subtitle", "string", { interface: "input", sort: 60 }),
      field("portfolio_projects", "description", "text", { interface: "input-multiline", required: true, sort: 70 }),
      field("portfolio_projects", "card_summary", "text", { interface: "input-multiline", sort: 80 }),
      field("portfolio_projects", "client", "string", { interface: "input", sort: 90 }),
      field("portfolio_projects", "industry", "string", { interface: "input", sort: 100 }),
      field("portfolio_projects", "category", "string", { interface: "input", sort: 110 }),
      field("portfolio_projects", "services", "json", {
        interface: "tags",
        note: "Service labels linked to this project.",
        sort: 120,
      }),
      field("portfolio_projects", "overview", "text", { interface: "input-rich-text-md", sort: 130 }),
      field("portfolio_projects", "challenge", "text", { interface: "input-rich-text-md", sort: 140 }),
      field("portfolio_projects", "features", "json", {
        interface: "input-code",
        options: { language: "json" },
        note: "JSON array of {title, text}.",
        sort: 150,
      }),
      field("portfolio_projects", "technologies", "json", {
        interface: "tags",
        sort: 160,
      }),
      field("portfolio_projects", "technology_notes", "json", {
        interface: "input-code",
        options: { language: "json" },
        note: "JSON array of {status, text} matching current case-study notes.",
        sort: 170,
      }),
      field("portfolio_projects", "project_url", "string", { interface: "input", sort: 180 }),
      field("portfolio_projects", "project_url_label", "string", { interface: "input", sort: 190 }),
      field("portfolio_projects", "work_dates", "string", { interface: "input", sort: 200 }),
      field("portfolio_projects", "engagement_role", "string", { interface: "input", sort: 210 }),
      field("portfolio_projects", "modules_delivered", "text", { interface: "input-multiline", sort: 220 }),
      field("portfolio_projects", "technologies_used", "text", { interface: "input-multiline", sort: 230 }),
      field("portfolio_projects", "integrations_developed", "text", { interface: "input-multiline", sort: 240 }),
      field("portfolio_projects", "qa_contribution", "text", { interface: "input-multiline", sort: 250 }),
      field("portfolio_projects", "publication_permission", "text", { interface: "input-multiline", sort: 260 }),
      field("portfolio_projects", "evidence_note", "text", { interface: "input-multiline", sort: 270 }),
      field("portfolio_projects", "media_layout", "string", {
        interface: "select-dropdown",
        options: {
          choices: [
            { text: "Web", value: "web" },
            { text: "Mobile", value: "mobile" },
          ],
        },
        default: "web",
        sort: 280,
      }),
      field("portfolio_projects", "filters", "json", { interface: "tags", sort: 290 }),
      field("portfolio_projects", "featured", "boolean", {
        interface: "boolean",
        required: true,
        default: false,
        sort: 300,
      }),
      field("portfolio_projects", "home_rank", "integer", {
        interface: "input",
        required: true,
        default: 99,
        sort: 310,
      }),
      field("portfolio_projects", "contribution_verified", "boolean", {
        interface: "boolean",
        required: true,
        default: false,
        sort: 320,
      }),
    ],
  },
  {
    collection: "portfolio_screenshots",
    meta: {
      collection: "portfolio_screenshots",
      icon: "photo_library",
      note: "Ordered screenshots for a portfolio project. Originals migrate in Step 10B.",
      display_template: "{{caption}}",
      sort_field: "sort",
      accountability: "all",
    },
    schema: { name: "portfolio_screenshots" },
    fields: [
      field("portfolio_screenshots", "project", "uuid", {
        interface: "select-dropdown-m2o",
        special: ["m2o"],
        required: true,
        options: { template: "{{title}}" },
        note: "Parent portfolio project. Relation applied separately.",
        sort: 10,
      }),
      field("portfolio_screenshots", "image", "uuid", {
        interface: "file-image",
        special: ["file"],
        required: true,
        sort: 20,
      }),
      field("portfolio_screenshots", "alt", "string", { interface: "input", required: true, sort: 30 }),
      field("portfolio_screenshots", "caption", "text", { interface: "input-multiline", sort: 40 }),
      field("portfolio_screenshots", "kind", "string", {
        interface: "input",
        note: "For example: Public page capture, App Store artwork.",
        sort: 50,
      }),
      field("portfolio_screenshots", "width", "integer", { interface: "input", sort: 60 }),
      field("portfolio_screenshots", "height", "integer", { interface: "input", sort: 70 }),
      field("portfolio_screenshots", "orientation", "string", {
        interface: "select-dropdown",
        options: {
          choices: [
            { text: "Landscape", value: "landscape" },
            { text: "Portrait", value: "portrait" },
          ],
        },
        sort: 80,
      }),
      field("portfolio_screenshots", "provenance_note", "text", {
        interface: "input-multiline",
        note: "Source attribution / permission note.",
        sort: 90,
      }),
      field("portfolio_screenshots", "checksum_sha256", "string", {
        interface: "input",
        note: "Optional hash of the historical original file.",
        sort: 100,
      }),
      field("portfolio_screenshots", "sort", "integer", {
        interface: "input",
        required: true,
        default: 1,
        sort: 110,
      }),
      field("portfolio_screenshots", "status", "string", {
        interface: "select-dropdown",
        required: true,
        default: "draft",
        options: { choices: STATUS_CHOICES },
        sort: 120,
      }),
    ],
  },
  {
    collection: "services",
    meta: {
      collection: "services",
      icon: "design_services",
      note: "Eight specialty pages. Preserve existing slugs.",
      display_template: "{{title}}",
      archive_field: "status",
      archive_value: "archived",
      unarchive_value: "draft",
      sort_field: "display_order",
      accountability: "all",
    },
    schema: { name: "services" },
    fields: [
      ...editorialFields("services"),
      field("services", "title", "string", { interface: "input", required: true, sort: 50 }),
      field("services", "summary", "text", { interface: "input-multiline", required: true, sort: 60 }),
      field("services", "hero", "text", { interface: "input-multiline", sort: 70 }),
      field("services", "icon_token", "string", {
        interface: "input",
        note: "Safe existing design-system icon name only. Not arbitrary JS.",
        sort: 80,
      }),
      field("services", "visual_token", "string", {
        interface: "input",
        note: "Existing visual variant token from the Astro design map.",
        sort: 90,
      }),
      field("services", "tags", "json", { interface: "tags", sort: 100 }),
      field("services", "applications", "json", {
        interface: "input-code",
        options: { language: "json" },
        sort: 110,
      }),
      field("services", "challenges", "json", {
        interface: "input-code",
        options: { language: "json" },
        sort: 120,
      }),
      field("services", "approach", "json", {
        interface: "input-code",
        options: { language: "json" },
        sort: 130,
      }),
      field("services", "capabilities", "json", {
        interface: "input-code",
        options: { language: "json" },
        sort: 140,
      }),
      field("services", "deliverables", "json", {
        interface: "input-code",
        options: { language: "json" },
        sort: 150,
      }),
      field("services", "faqs", "json", {
        interface: "input-code",
        options: { language: "json" },
        sort: 160,
      }),
      field("services", "related_slugs", "json", { interface: "tags", sort: 170 }),
      field("services", "cta_label", "string", { interface: "input", sort: 180 }),
      field("services", "cta_href", "string", {
        interface: "input",
        note: "Relative path only in normal use, e.g. /contact?service=...",
        sort: 190,
      }),
      field("services", "featured", "boolean", {
        interface: "boolean",
        required: true,
        default: false,
        sort: 200,
      }),
      field("services", "display_order", "integer", {
        interface: "input",
        required: true,
        default: 99,
        sort: 210,
      }),
    ],
  },
  {
    collection: "insights_articles",
    meta: {
      collection: "insights_articles",
      icon: "article",
      note: "All current articles remain unpublished. Do not import or approve them in 10A.",
      display_template: "{{title}}",
      archive_field: "status",
      archive_value: "archived",
      unarchive_value: "draft",
      accountability: "all",
    },
    schema: { name: "insights_articles" },
    fields: [
      ...editorialFields("insights_articles"),
      field("insights_articles", "title", "string", { interface: "input", required: true, sort: 50 }),
      field("insights_articles", "excerpt", "text", { interface: "input-multiline", required: true, sort: 60 }),
      field("insights_articles", "body", "text", {
        interface: "input-rich-text-md",
        note: "Markdown body. Sanitize at the Astro boundary later; never trust raw HTML.",
        sort: 70,
      }),
      field("insights_articles", "author", "string", {
        interface: "input",
        note: "Organizational byline unless a named author is authorized.",
        sort: 80,
      }),
      field("insights_articles", "category", "string", {
        interface: "select-dropdown",
        options: {
          choices: [
            "Web Development",
            "Mobile Apps",
            "AI Solutions",
            "SaaS Development",
            "Backend & APIs",
            "Cloud & DevOps",
            "UI/UX Design",
            "QA & Testing",
          ].map((value) => ({ text: value, value })),
        },
        sort: 90,
      }),
      field("insights_articles", "cover_image", "uuid", {
        interface: "file-image",
        special: ["file"],
        sort: 100,
      }),
      field("insights_articles", "featured", "boolean", {
        interface: "boolean",
        required: true,
        default: false,
        sort: 110,
      }),
      field("insights_articles", "reviewed_at", "timestamp", { interface: "datetime", sort: 120 }),
    ],
  },
  {
    collection: "site_settings",
    meta: {
      collection: "site_settings",
      icon: "settings",
      note: "Public content settings only. Never store secrets, SMTP, domain, or PUBLIC_SITE_URL here.",
      singleton: true,
      accountability: "all",
    },
    schema: { name: "site_settings" },
    fields: [
      field("site_settings", "site_name", "string", { interface: "input", required: true, sort: 10 }),
      field("site_settings", "tagline", "string", { interface: "input", sort: 20 }),
      field("site_settings", "summary", "text", { interface: "input-multiline", sort: 30 }),
      field("site_settings", "description", "text", { interface: "input-multiline", sort: 40 }),
      field("site_settings", "location", "string", {
        interface: "input",
        note: "Leave empty until a real public location should be shown.",
        sort: 50,
      }),
      field("site_settings", "social_links", "json", {
        interface: "input-code",
        options: { language: "json" },
        note: "Only verified https links. Empty links stay hidden on the site.",
        sort: 60,
      }),
      field("site_settings", "default_seo_title", "string", { interface: "input", max_length: 70, sort: 70 }),
      field("site_settings", "default_seo_description", "text", { interface: "input-multiline", sort: 80 }),
      field("site_settings", "branding_image", "uuid", {
        interface: "file-image",
        special: ["file"],
        sort: 90,
      }),
      field("site_settings", "cta_primary_label", "string", { interface: "input", sort: 100 }),
      field("site_settings", "cta_primary_href", "string", { interface: "input", sort: 110 }),
    ],
  },
  {
    collection: "homepage_content",
    meta: {
      collection: "homepage_content",
      icon: "home",
      note: "Homepage editable content. Team film is illustrative, not a real event recording.",
      singleton: true,
      accountability: "all",
    },
    schema: { name: "homepage_content" },
    fields: [
      field("homepage_content", "hero_eyebrow", "string", { interface: "input", sort: 10 }),
      field("homepage_content", "hero_title", "string", { interface: "input", required: true, sort: 20 }),
      field("homepage_content", "hero_lede", "text", { interface: "input-multiline", sort: 30 }),
      field("homepage_content", "hero_image", "uuid", {
        interface: "file-image",
        special: ["file"],
        sort: 40,
      }),
      field("homepage_content", "primary_cta_label", "string", { interface: "input", sort: 50 }),
      field("homepage_content", "primary_cta_href", "string", { interface: "input", sort: 60 }),
      field("homepage_content", "secondary_cta_label", "string", { interface: "input", sort: 70 }),
      field("homepage_content", "secondary_cta_href", "string", { interface: "input", sort: 80 }),
      field("homepage_content", "team_film_eyebrow", "string", { interface: "input", sort: 90 }),
      field("homepage_content", "team_film_heading", "string", { interface: "input", sort: 100 }),
      field("homepage_content", "team_film_description", "text", { interface: "input-multiline", sort: 110 }),
      field("homepage_content", "team_film_disclosure", "text", {
        interface: "input-multiline",
        note: "Must remain an illustrative disclosure, not a claim of a real company event.",
        sort: 120,
      }),
      field("homepage_content", "team_film_video", "uuid", {
        interface: "file",
        special: ["file"],
        note: "Later: owner-supplied silent 16:9 MP4. Not imported in 10A.",
        sort: 130,
      }),
      field("homepage_content", "team_film_poster", "uuid", {
        interface: "file-image",
        special: ["file"],
        sort: 140,
      }),
      field("homepage_content", "featured_project_slugs", "json", {
        interface: "tags",
        note: "Ordered approved project slugs for the homepage showcase.",
        sort: 150,
      }),
      field("homepage_content", "status", "string", {
        interface: "select-dropdown",
        required: true,
        default: "draft",
        options: { choices: STATUS_CHOICES },
        sort: 160,
      }),
      field("homepage_content", "publication_approved", "boolean", {
        interface: "boolean",
        required: true,
        default: false,
        sort: 170,
      }),
    ],
  },
  {
    collection: "page_sections",
    meta: {
      collection: "page_sections",
      icon: "view_agenda",
      note: "Reusable About/Process and similar sections. Whitelisted types only.",
      display_template: "{{page_key}} / {{section_key}}",
      sort_field: "sort",
      archive_field: "status",
      archive_value: "archived",
      unarchive_value: "draft",
      accountability: "all",
    },
    schema: { name: "page_sections" },
    fields: [
      field("page_sections", "page_key", "string", {
        interface: "select-dropdown",
        required: true,
        options: {
          choices: [
            { text: "About", value: "about" },
            { text: "Process", value: "process" },
            { text: "Contact", value: "contact" },
            { text: "Services index", value: "services_index" },
            { text: "Team index", value: "team_index" },
          ],
        },
        sort: 10,
      }),
      field("page_sections", "section_key", "string", {
        interface: "input",
        required: true,
        max_length: 80,
        sort: 20,
      }),
      field("page_sections", "section_type", "string", {
        interface: "select-dropdown",
        required: true,
        options: {
          choices: [
            { text: "Hero", value: "hero" },
            { text: "Copy block", value: "copy" },
            { text: "List", value: "list" },
            { text: "CTA", value: "cta" },
            { text: "FAQ", value: "faq" },
            { text: "Media", value: "media" },
          ],
        },
        sort: 30,
      }),
      field("page_sections", "eyebrow", "string", { interface: "input", sort: 40 }),
      field("page_sections", "title", "string", { interface: "input", sort: 50 }),
      field("page_sections", "body", "text", {
        interface: "input-rich-text-md",
        note: "Markdown/plain content. No executable HTML.",
        sort: 60,
      }),
      field("page_sections", "items", "json", {
        interface: "input-code",
        options: { language: "json" },
        sort: 70,
      }),
      field("page_sections", "image", "uuid", {
        interface: "file-image",
        special: ["file"],
        sort: 80,
      }),
      field("page_sections", "sort", "integer", {
        interface: "input",
        required: true,
        default: 1,
        sort: 90,
      }),
      field("page_sections", "status", "string", {
        interface: "select-dropdown",
        required: true,
        default: "draft",
        options: { choices: STATUS_CHOICES },
        sort: 100,
      }),
      field("page_sections", "publication_approved", "boolean", {
        interface: "boolean",
        required: true,
        default: false,
        sort: 110,
      }),
    ],
  },
];

const relations = [
  {
    collection: "portfolio_screenshots",
    field: "project",
    related_collection: "portfolio_projects",
    meta: {
      many_collection: "portfolio_screenshots",
      many_field: "project",
      one_collection: "portfolio_projects",
      one_field: "screenshots",
      one_deselect_action: "delete",
      sort_field: "sort",
    },
    schema: {
      table: "portfolio_screenshots",
      column: "project",
      foreign_key_table: "portfolio_projects",
      foreign_key_column: "id",
      // CASCADE (not SET NULL): project is required / NOT NULL.
      on_delete: "CASCADE",
    },
  },
];

const UUID_PRIMARY_KEY = {
  field: "id",
  type: "uuid",
  meta: {
    hidden: true,
    readonly: true,
    interface: "input",
    special: ["uuid"],
  },
  schema: {
    is_primary_key: true,
    length: 36,
    has_auto_increment: false,
  },
};

async function ensureCollection(spec) {
  const existing = await api("GET", `/collections/${spec.collection}`);
  if (existing.status === 200) {
    const idField = await api("GET", `/fields/${spec.collection}/id`);
    const idType = idField.data?.data?.type;
    if (idType && idType !== "uuid") {
      console.error(
        `collection ${spec.collection} has id type ${idType}; expected uuid. Delete and re-run with --reset-custom-collections.`,
      );
      process.exit(1);
    }
    console.log(`collection exists: ${spec.collection}`);
    return "exists";
  }
  const created = await api("POST", "/collections", {
    collection: spec.collection,
    meta: spec.meta,
    schema: spec.schema,
    fields: [UUID_PRIMARY_KEY],
  });
  if (!created.ok) {
    console.error(`Failed to create ${spec.collection}:`, created.status, JSON.stringify(created.data)?.slice(0, 400));
    process.exit(1);
  }
  console.log(`collection created: ${spec.collection}`);
  return "created";
}

async function resetCustomCollections() {
  const listed = await api("GET", "/collections");
  if (!listed.ok) {
    console.error("Unable to list collections for reset:", listed.status);
    process.exit(1);
  }
  const custom = (listed.data?.data || [])
    .map((item) => item.collection)
    .filter((name) => !name.startsWith("directus_"));
  // Children first so FK parents can be removed.
  const order = [
    "portfolio_screenshots",
    "team_members",
    "portfolio_projects",
    "services",
    "insights_articles",
    "site_settings",
    "homepage_content",
    "page_sections",
    ...custom.filter(
      (name) =>
        ![
          "portfolio_screenshots",
          "team_members",
          "portfolio_projects",
          "services",
          "insights_articles",
          "site_settings",
          "homepage_content",
          "page_sections",
        ].includes(name),
    ),
  ];
  for (const name of order) {
    if (!custom.includes(name)) continue;
    const deleted = await api("DELETE", `/collections/${name}`);
    console.log(`reset delete ${name}:`, deleted.status);
  }
}

async function ensureField(spec) {
  const existing = await api("GET", `/fields/${spec.collection}/${spec.field}`);
  if (existing.status === 200) return "exists";
  const created = await api("POST", `/fields/${spec.collection}`, spec);
  if (!created.ok) {
    // Some system id/date fields already exist after collection create.
    if (created.status === 400 && /already exists|duplicate/i.test(JSON.stringify(created.data))) {
      return "exists";
    }
    console.error(`Failed field ${spec.collection}.${spec.field}:`, created.status, JSON.stringify(created.data)?.slice(0, 500));
    process.exit(1);
  }
  return "created";
}

async function ensureRelation(spec) {
  const list = await api("GET", "/relations");
  const found = (list.data?.data || []).some(
    (item) => item.collection === spec.collection && item.field === spec.field,
  );
  if (found) return "exists";
  const created = await api("POST", "/relations", spec);
  if (!created.ok) {
    console.error(`Failed relation ${spec.collection}.${spec.field}:`, created.status, JSON.stringify(created.data)?.slice(0, 500));
    process.exit(1);
  }
  return "created";
}

async function lockPublicPolicy() {
  // Confirm Public role/policy has no custom collection reads.
  const roles = await api("GET", "/roles");
  if (!roles.ok) {
    console.log("roles inspection skipped:", roles.status);
    return;
  }
  const publicRole = (roles.data?.data || []).find((role) => role.name === "Public" || role.id === null);
  console.log("public_role", publicRole ? publicRole.name || publicRole.id : "none-listed");

  const permissions = await api("GET", "/permissions?limit=-1");
  if (!permissions.ok) {
    console.log("permissions inspection skipped:", permissions.status);
    return;
  }
  const publicReads = (permissions.data?.data || []).filter((item) => {
    const action = item.action;
    const collection = item.collection;
    const isCustom = [
      "team_members",
      "portfolio_projects",
      "portfolio_screenshots",
      "services",
      "insights_articles",
      "site_settings",
      "homepage_content",
      "page_sections",
      "directus_files",
    ].includes(collection);
    return isCustom && action === "read";
  });
  // In Directus 11+/12 policies model, Public may be empty by default. We only report.
  console.log("custom_or_file_read_permissions", publicReads.length);
}

async function main() {
  const health = await api("GET", "/server/health");
  if (!health.ok && health.status !== 200) {
    // /server/health may be open; also try ping
    const ping = await fetch(`${base}/server/ping`);
    if (!ping.ok) {
      console.error("Directus is not reachable at", base);
      process.exit(1);
    }
  }

  const me = await api("GET", "/users/me");
  if (!me.ok) {
    console.error("Admin token authentication failed:", me.status);
    process.exit(1);
  }
  console.log("authenticated_as", me.data?.data?.email || me.data?.data?.id || "admin");

  if (process.argv.includes("--reset-custom-collections")) {
    console.log("WARNING: deleting custom collections (schema only; no Astro content imported yet)");
    await resetCustomCollections();
  }

  let createdCollections = 0;
  let existingCollections = 0;
  let createdFields = 0;

  for (const spec of collections) {
    const state = await ensureCollection(spec);
    if (state === "created") createdCollections += 1;
    else existingCollections += 1;
    for (const fieldSpec of spec.fields) {
      const fieldState = await ensureField(fieldSpec);
      if (fieldState === "created") createdFields += 1;
    }
  }

  for (const relation of relations) {
    await ensureRelation(relation);
  }

  await lockPublicPolicy();

  const listed = await api("GET", "/collections");
  const custom = (listed.data?.data || [])
    .map((item) => item.collection)
    .filter((name) => !name.startsWith("directus_"));
  console.log("custom_collections", custom.length, custom.sort().join(","));
  console.log("summary", JSON.stringify({ createdCollections, existingCollections, createdFields }));

  fs.mkdirSync(path.join(root, "schema"), { recursive: true });
  const snapshotMeta = {
    generated_at: new Date().toISOString(),
    directus_public_url: base,
    custom_collections: custom.sort(),
    collection_count: custom.length,
    core_tier_limit: 25,
    note: "Collections created via REST. Re-run apply-schema.mjs is safe. No live content imported.",
  };
  fs.writeFileSync(path.join(root, "schema/collections.meta.json"), JSON.stringify(snapshotMeta, null, 2));
  console.log("wrote schema/collections.meta.json");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
