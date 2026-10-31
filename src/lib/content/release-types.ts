import type {
  NormalizedHomepage,
  NormalizedInsight,
  NormalizedProject,
  NormalizedService,
  NormalizedTeamMember,
} from "./types.ts";

export interface ReleaseMediaRef {
  fileId: string;
  role: string;
  sha256?: string | null;
  bytes?: number | null;
  mime?: string | null;
  alt?: string | null;
  /** Materialized public path after cms build, if known. */
  publicPath?: string | null;
}

export interface PublishedSiteSnapshot {
  schemaVersion: 1;
  releaseId: string;
  createdAt: string;
  activatedAt?: string | null;
  publisher: string;
  contentHash: string;
  notes?: string;
  team: NormalizedTeamMember[];
  projects: NormalizedProject[];
  services: NormalizedService[];
  insights: NormalizedInsight[];
  homepage: NormalizedHomepage;
  pageSections: {
    page_key: string;
    section_key: string;
    section_type: string;
    eyebrow?: string;
    title?: string;
    body?: string;
    items?: unknown;
    sort: number;
  }[];
  siteSettings: {
    site_name: string;
    tagline?: string;
    summary?: string;
    description?: string;
  };
  media: ReleaseMediaRef[];
  sourceRecordChecksums: Record<string, string>;
}

export interface ReleasePointer {
  activeReleaseId: string | null;
  activeContentHash: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface ReleaseAuditEvent {
  at: string;
  action: "plan" | "verify" | "activate" | "rollback" | "withdraw";
  releaseId: string;
  contentHash: string;
  actor: string;
  detail?: string;
}
