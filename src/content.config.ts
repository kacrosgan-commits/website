import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { insightCategories } from "./utils/insights";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** Draft writing date. Not a publication date unless `publishedAt` is set on an approved post. */
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** Set only after the owner approves publication. */
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    /** Organizational byline. Not an individual employee credit. */
    author: z.string(),
    category: z.enum(insightCategories),
    draft: z.boolean().default(true),
    demonstration: z.boolean().default(true),
    /** Local reading copy. Included in `astro dev` only, never in the production build. */
    editorialReview: z.boolean().default(false),
    /** Owner approval. Defaults private. Do not set this true without an explicit owner decision. */
    publicationApproved: z.boolean().default(false),
    status: z.enum(["draft", "review", "published"]).default("draft"),
    featured: z.boolean().default(false),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/case-studies" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** Document title when it should differ from the visible heading. */
    seoTitle: z.string().default(""),
    /** Meta description when it should differ from the visible summary. */
    seoDescription: z.string().default(""),
    subtitle: z.string().default(""),
    /** Short line for portfolio cards. The case-study lede stays in `description`. */
    cardSummary: z.string().default(""),
    /** Short card heading when the case-study title is longer. */
    cardTitle: z.string().default(""),
    challengeHeading: z.string().default("Product challenge"),
    featuresHeading: z.string().default("Key features"),
    galleryHeading: z.string().default("Product gallery"),
    technologyHeading: z.string().default("Technical context"),
    ctaTitle: z.string().default(""),
    ctaDescription: z.string().default(""),
    ctaLabel: z.string().default(""),
    client: z.string(),
    industry: z.string(),
    services: z.array(z.string()),
    category: z.string(),
    date: z.coerce.date(),
    sample: z.boolean().default(true),
    /** Internal review entry. Visible in `astro dev`, omitted from production routes. */
    review: z.boolean().default(false),
    /** Public route and sitemap only when this is true and `sample` is false. */
    publicationApproved: z.boolean().default(false),
    contributionVerified: z.boolean().default(false),
    featured: z.boolean().default(false),
    /** Lower numbers are preferred on the homepage once a project is approved and featured. */
    homeRank: z.number().default(99),
    visual: z.enum(["prism", "orbit", "grid", "wave", "signal", "layers"]).default("prism"),
    tone: z.enum(["stage", "fashion", "saas", "industrial", "market", "luxury"]).default("saas"),
    mediaLayout: z.enum(["mobile", "web"]).default("web"),
    filters: z.array(z.enum(["Mobile", "AI & SaaS", "Marketplaces", "Ecommerce"])).default([]),
    technologies: z.array(z.string()).default([]),
    publicPlatform: z.array(z.string()).default([]),
    projectUrl: z.string().optional(),
    projectUrlLabel: z.string().default("View live product"),
    overview: z.string().default(""),
    challenge: z.string().default(""),
    features: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
    screenshots: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
          caption: z.string(),
          kind: z.string(),
          width: z.number(),
          height: z.number(),
        }),
      )
      .default([]),
    technology: z
      .array(
        z.object({
          status: z.enum(["Confirmed platform", "Publisher-described", "Observed", "Unverified"]),
          text: z.string(),
        }),
      )
      .default([]),
    evidenceNote: z.string().default(""),
    contributionPrompt: z.string().default(""),
    engagementRole: z.string().default(""),
    workDates: z.string().default(""),
    modulesDelivered: z.string().default(""),
    technologiesUsed: z.string().default(""),
    integrationsDeveloped: z.string().default(""),
    qaContribution: z.string().default(""),
    publicationPermission: z.string().default(""),
    sources: z.array(z.object({ label: z.string(), url: z.string(), note: z.string() })).default([]),
    metrics: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
          verified: z.boolean(),
        }),
      )
      .default([]),
  }),
});

export const collections = { blog, caseStudies };
