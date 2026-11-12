/**
 * View-transition name for a person's portrait. The team wall, the bio panel and the profile page
 * use the same name, so the portrait carries over from one to the next. Unique per person.
 */
export function personTransitionName(slug: string): string {
  return `team-${slug.toLowerCase().replace(/[^a-z0-9-]/g, "-")}`;
}
