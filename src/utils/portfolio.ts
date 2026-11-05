export const portfolioFilters = ["Mobile", "AI & SaaS", "Marketplaces", "Ecommerce"] as const;

export type PortfolioFilter = (typeof portfolioFilters)[number];

export interface PortfolioFlags {
  sample?: boolean;
  review?: boolean;
  publicationApproved?: boolean;
  featured?: boolean;
  homeRank?: number;
  filters?: readonly string[];
}

/** A production route. Samples and unapproved reviews never qualify. */
export function isPublicProject(project: PortfolioFlags): boolean {
  return project.sample !== true && project.publicationApproved === true;
}

/** A dev-only review page. Production builds must not emit these routes. */
export function isReviewProject(project: PortfolioFlags, dev: boolean): boolean {
  return dev && project.sample !== true && project.review === true && project.publicationApproved !== true;
}

export function isVisibleProject(project: PortfolioFlags, dev: boolean): boolean {
  return isPublicProject(project) || isReviewProject(project, dev);
}

export function filtersInUse(projects: readonly PortfolioFlags[]): PortfolioFilter[] {
  return portfolioFilters.filter((name) => projects.some((project) => project.filters?.includes(name)));
}

export function homepageProjects<T extends { data: PortfolioFlags }>(projects: readonly T[]): T[] {
  return projects
    .filter((project) => isPublicProject(project.data) && project.data.featured === true)
    .sort((a, b) => (a.data.homeRank ?? 99) - (b.data.homeRank ?? 99))
    .slice(0, 6);
}

/** How a card spans the Work grid: the full row, half of it, or a third. */
export type WorkSpan = "wide" | "half" | "third";

export interface WorkSlot {
  /** Two-column grid, 768 px to 1279 px. */
  md: WorkSpan;
  /** Three-column grid, 1280 px and up. */
  lg: WorkSpan;
}

/**
 * Grid placement for `count` visible Work cards, in order. The first card is always the wide
 * featured card. The rest fill complete rows with no empty cell: two-column rows use halves and
 * an odd card out becomes wide; three-column rows use halves first, then thirds.
 */
export function workLayout(count: number): WorkSlot[] {
  if (count <= 0) return [];
  const rest = count - 1;
  const md: WorkSpan[] = Array.from({ length: rest }, (_, index) => (rest % 2 === 1 && index === rest - 1 ? "wide" : "half"));
  let lg: WorkSpan[];
  if (rest === 1) {
    lg = ["wide"];
  } else {
    let thirds = Math.floor(rest / 3);
    let halves = 0;
    if (rest % 3 === 2) halves = 1;
    if (rest % 3 === 1) {
      thirds -= 1;
      halves = 2;
    }
    lg = [...Array<WorkSpan>(halves * 2).fill("half"), ...Array<WorkSpan>(thirds * 3).fill("third")];
  }
  return [{ md: "wide", lg: "wide" }, ...md.map((span, index) => ({ md: span, lg: lg[index] ?? "third" }))];
}
