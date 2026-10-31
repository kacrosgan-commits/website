/**
 * Publication gate for CMS → public Astro output.
 * status=published alone is NEVER enough.
 */
export interface CmsEditorialFlags {
  status?: string | null;
  publication_approved?: boolean | null;
  published_at?: string | null;
}

export function isCmsPubliclyEligible(record: CmsEditorialFlags): boolean {
  return (
    record.status === "published" &&
    record.publication_approved === true &&
    typeof record.published_at === "string" &&
    record.published_at.length > 0 &&
    !Number.isNaN(Date.parse(record.published_at))
  );
}

export function publicationGateFailures(record: CmsEditorialFlags): string[] {
  const failures: string[] = [];
  if (record.status !== "published") failures.push(`status=${record.status ?? "null"} (need published)`);
  if (record.publication_approved !== true) failures.push("publication_approved is not true");
  if (!record.published_at) failures.push("published_at is empty");
  else if (Number.isNaN(Date.parse(record.published_at))) failures.push("published_at is not a valid date");
  return failures;
}

/** Baseline required for a real cms-mode public site cutover. */
export const CMS_PUBLIC_BASELINE = {
  team_members: 9,
  portfolio_projects: 6,
  portfolio_screenshots: 18,
  services: 8,
  insights_articles_min_public: 0,
} as const;
