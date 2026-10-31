export const CONTENT_SOURCES = ["local", "cms-shadow", "cms"] as const;

export type ContentSource = (typeof CONTENT_SOURCES)[number];

/** Resolve CONTENT_SOURCE. Missing/empty → local. Unknown → throw (no silent fallback). */
export function getContentSource(env: NodeJS.ProcessEnv = process.env): ContentSource {
  const raw = (env.CONTENT_SOURCE ?? "").trim();
  if (!raw) return "local";
  if ((CONTENT_SOURCES as readonly string[]).includes(raw)) return raw as ContentSource;
  throw new Error(
    `Unknown CONTENT_SOURCE="${raw}". Expected one of: ${CONTENT_SOURCES.join(", ")}.`,
  );
}

export function isCmsMode(source: ContentSource = getContentSource()): boolean {
  return source === "cms";
}

export function isShadowMode(source: ContentSource = getContentSource()): boolean {
  return source === "cms-shadow";
}

export function requiresDirectus(source: ContentSource = getContentSource()): boolean {
  return source === "cms" || source === "cms-shadow";
}
