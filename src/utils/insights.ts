/**
 * Public Insights predicate.
 * A post is public only when the owner has approved it and its status is published.
 * Draft files, review copies, samples, and demonstration placeholders stay private.
 */

export const insightCategories = [
  "Web Development",
  "Mobile Apps",
  "AI Solutions",
  "SaaS Development",
  "Backend & APIs",
  "Cloud & DevOps",
  "UI/UX Design",
  "QA & Testing",
] as const;

export type InsightCategory = (typeof insightCategories)[number];
export type InsightStatus = "draft" | "review" | "published";

export interface InsightPublication {
  id?: string;
  title?: string;
  description?: string;
  publicationApproved?: boolean;
  status?: InsightStatus | string;
  draft?: boolean;
  demonstration?: boolean;
  sample?: boolean;
  featured?: boolean;
  publishedAt?: Date | string | null;
  updatedAt?: Date | string | null;
  category?: string;
}

export function isPublicInsight(post: InsightPublication): boolean {
  return (
    post.publicationApproved === true &&
    post.status === "published" &&
    post.draft !== true &&
    post.demonstration !== true &&
    post.sample !== true
  );
}

function publishedTime(post: InsightPublication): number {
  if (!post.publishedAt) return 0;
  const value = new Date(post.publishedAt).valueOf();
  return Number.isFinite(value) ? value : 0;
}

/** Newest approved publication date first. Equal dates fall back to the slug. */
export function comparePublicInsights(a: InsightPublication, b: InsightPublication): number {
  const byDate = publishedTime(b) - publishedTime(a);
  if (byDate !== 0) return byDate;
  return (a.id ?? "").localeCompare(b.id ?? "");
}

export function publicInsights<T extends InsightPublication>(posts: T[]): T[] {
  return posts.filter((post) => isPublicInsight(post)).sort(comparePublicInsights);
}

export function publicInsightPath(post: InsightPublication): string | null {
  if (!post.id || !isPublicInsight(post)) return null;
  return `/insights/${post.id}`;
}

export function publicInsightHref(id: string, posts: InsightPublication[]): string | null {
  const post = posts.find((entry) => entry.id === id);
  if (!post) return null;
  return publicInsightPath(post);
}

export interface PublicInsightMeta {
  title: string;
  description: string;
  path: string;
  publishedAt: Date | null;
}

export function publicInsightMeta(post: InsightPublication): PublicInsightMeta | null {
  const path = publicInsightPath(post);
  const title = post.title?.trim() ?? "";
  const description = post.description?.trim() ?? "";
  if (!path || !title || !description) return null;
  const publishedAt = post.publishedAt ? new Date(post.publishedAt) : null;
  return {
    title,
    description,
    path,
    publishedAt: publishedAt && Number.isFinite(publishedAt.valueOf()) ? publishedAt : null,
  };
}

export function relatedPublicInsights<T extends InsightPublication>(posts: T[], currentId: string, category?: string): T[] {
  const others = publicInsights(posts).filter((post) => post.id !== currentId);
  const same = others.filter((post) => category && post.category === category);
  const rest = others.filter((post) => !category || post.category !== category);
  return [...same, ...rest].slice(0, 2);
}

/** Same rule as `isPublicInsight`, applied to Markdown frontmatter. Used by the sitemap. */
export function frontmatterIsPublicInsight(raw: string): boolean {
  const value = (name: string) => new RegExp(`^${name}:\\s*(.+?)\\s*$`, "m").exec(raw)?.[1]?.replace(/^["']|["']$/g, "");
  return isPublicInsight({
    publicationApproved: value("publicationApproved") === "true",
    status: value("status"),
    draft: value("draft") === "true",
    demonstration: value("demonstration") === "true",
    sample: value("sample") === "true",
  });
}
