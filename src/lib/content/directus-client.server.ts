/**
 * Server/build-only Directus client. Never import from client components.
 * Tokens must come from non-PUBLIC env vars and never appear in HTML.
 */

export type DirectusTokenKind = "shadow" | "build";

export interface DirectusClientOptions {
  url?: string;
  token?: string;
  kind?: DirectusTokenKind;
  timeoutMs?: number;
}

function resolveUrl(env: NodeJS.ProcessEnv = process.env): string {
  const url = (env.DIRECTUS_URL || "http://127.0.0.1:8055").replace(/\/$/, "");
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("DIRECTUS_URL is not a valid URL");
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("DIRECTUS_URL must be http(s)");
  }
  // Local Ubuntu builds expect loopback only.
  if (!["127.0.0.1", "localhost"].includes(parsed.hostname)) {
    throw new Error(`DIRECTUS_URL host "${parsed.hostname}" is not an allowed local build host`);
  }
  return url;
}

function resolveToken(kind: DirectusTokenKind, env: NodeJS.ProcessEnv = process.env): string {
  const key = kind === "shadow" ? "DIRECTUS_SHADOW_TOKEN" : "DIRECTUS_BUILD_TOKEN";
  const token = (env[key] || "").trim();
  if (!token) {
    throw new Error(`${key} is required for ${kind} Directus access (server-only; never PUBLIC_).`);
  }
  if (token === (env.ADMIN_TOKEN || "").trim() || key.includes("ADMIN")) {
    throw new Error("Admin tokens must not be used for Astro content builds");
  }
  return token;
}

export function createDirectusClient(options: DirectusClientOptions = {}) {
  const kind = options.kind ?? "build";
  const base = options.url ?? resolveUrl();
  const token = options.token ?? resolveToken(kind);
  const timeoutMs = options.timeoutMs ?? 15_000;

  async function request<T = unknown>(
    method: string,
    path: string,
    init: { query?: Record<string, string>; body?: unknown; attempt?: number } = {},
  ): Promise<{ ok: boolean; status: number; data: T | null; raw: string }> {
    const attempt = init.attempt ?? 1;
    const url = new URL(base + path);
    if (init.query) {
      for (const [key, value] of Object.entries(init.query)) url.searchParams.set(key, value);
    }
    // Never put tokens in the query string.
    if (url.searchParams.has("access_token")) {
      throw new Error("Refusing Directus URL that embeds access_token");
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
        },
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
        signal: controller.signal,
        redirect: "error",
      });
      const raw = await response.text();
      let data: T | null = null;
      try {
        data = raw ? (JSON.parse(raw) as T) : null;
      } catch {
        data = null;
      }
      if ((response.status === 503 || response.status === 429) && attempt < 4) {
        await new Promise((r) => setTimeout(r, 300 * attempt));
        return request(method, path, { ...init, attempt: attempt + 1 });
      }
      return { ok: response.ok, status: response.status, data, raw };
    } finally {
      clearTimeout(timer);
    }
  }

  async function listItems<T>(
    collection: string,
    fields: string[],
    extraQuery: Record<string, string> = {},
  ): Promise<T[]> {
    const rows: T[] = [];
    let page = 1;
    const limit = 100;
    for (;;) {
      const result = await request<{ data: T[] }>("GET", `/items/${collection}`, {
        query: {
          fields: fields.join(","),
          limit: String(limit),
          page: String(page),
          ...extraQuery,
        },
      });
      if (!result.ok) {
        throw new Error(`Directus read ${collection} failed: HTTP ${result.status}`);
      }
      const batch = Array.isArray(result.data?.data) ? result.data.data : [];
      rows.push(...batch);
      if (batch.length < limit) break;
      page += 1;
      if (page > 50) throw new Error(`Directus pagination exceeded for ${collection}`);
    }
    return rows;
  }

  async function downloadAsset(
    fileId: string,
  ): Promise<{ ok: boolean; status: number; bytes: Uint8Array; contentType: string }> {
    if (!/^[0-9a-fA-F-]{36}$/.test(fileId)) {
      throw new Error("Invalid Directus file UUID");
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(`${base}/assets/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
        redirect: "error",
      });
      const buffer = new Uint8Array(await response.arrayBuffer());
      return {
        ok: response.ok,
        status: response.status,
        bytes: buffer,
        contentType: response.headers.get("content-type") || "application/octet-stream",
      };
    } finally {
      clearTimeout(timer);
    }
  }

  return { base, kind, request, listItems, downloadAsset };
}

export type DirectusClient = ReturnType<typeof createDirectusClient>;
