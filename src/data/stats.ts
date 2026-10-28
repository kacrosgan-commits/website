export interface Stat {
  value: string;
  label: string;
  /** Only verified figures are rendered. */
  verified: boolean;
}

/**
 * Add a statistic only when the number and its source are confirmed.
 * An empty list hides the statistics section.
 */
export const stats: Stat[] = [];

export const verifiedStats = stats.filter((item) => item.verified && item.value && item.label);
