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
