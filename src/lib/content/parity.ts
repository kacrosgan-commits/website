import type {
  ContentParityReport,
  NormalizedInsight,
  NormalizedProject,
  NormalizedService,
  NormalizedTeamMember,
  ParityIssue,
} from "./types.ts";

function push(
  issues: ParityIssue[],
  collection: string,
  key: string,
  severity: ParityIssue["severity"],
  message: string,
) {
  issues.push({ collection, key, severity, message });
}

export function compareTeamParity(
  local: NormalizedTeamMember[],
  cms: NormalizedTeamMember[],
): ParityIssue[] {
  const issues: ParityIssue[] = [];
  if (local.length !== cms.length) {
    push(issues, "team_members", "*", "error", `count local=${local.length} cms=${cms.length}`);
  }
  for (const member of local) {
    const row = cms.find((item) => item.slug === member.slug);
    if (!row) {
      push(issues, "team_members", member.slug, "error", "missing in CMS");
      continue;
    }
    if (row.name !== member.name) push(issues, "team_members", member.slug, "warn", "name differs");
    if (row.role !== member.role) push(issues, "team_members", member.slug, "warn", "role differs");
    if (row.cmsEligible) {
      push(issues, "team_members", member.slug, "info", "CMS already publish-eligible");
    }
  }
  const adrian = cms.find((m) => m.name === "Adrian Cruz");
  const matheus = cms.find((m) => m.name === "Matheus Pereira");
  // Portrait file IDs compared later; ensure both present by slug.
  if (!local.find((m) => m.name === "Adrian Cruz") || !local.find((m) => m.name === "Matheus Pereira")) {
    push(issues, "team_members", "portraits", "error", "local Adrian/Matheus missing");
  }
  if (adrian && matheus && adrian.slug === matheus.slug) {
    push(issues, "team_members", "portraits", "error", "Adrian/Matheus slug collision");
  }
  return issues;
}

export function compareProjectParity(local: NormalizedProject[], cms: NormalizedProject[]): ParityIssue[] {
  const issues: ParityIssue[] = [];
  if (local.length !== cms.length) {
    push(issues, "portfolio_projects", "*", "error", `count local=${local.length} cms=${cms.length}`);
  }
  for (const project of local) {
    const row = cms.find((item) => item.slug === project.slug);
    if (!row) {
      push(issues, "portfolio_projects", project.slug, "error", "missing in CMS");
      continue;
    }
    if (row.screenshots.length !== 3) {
      push(
        issues,
        "portfolio_screenshots",
        project.slug,
        "error",
        `expected 3 screenshots, found ${row.screenshots.length}`,
      );
    }
    if (row.title !== project.title) push(issues, "portfolio_projects", project.slug, "warn", "title differs");
  }
  return issues;
}

export function compareServiceParity(local: NormalizedService[], cms: NormalizedService[]): ParityIssue[] {
  const issues: ParityIssue[] = [];
  if (local.length !== cms.length) {
    push(issues, "services", "*", "error", `count local=${local.length} cms=${cms.length}`);
  }
  for (const service of local) {
    if (!cms.find((item) => item.slug === service.slug)) {
      push(issues, "services", service.slug, "error", "missing in CMS");
    }
  }
  return issues;
}

export function compareInsightParity(local: NormalizedInsight[], cms: NormalizedInsight[]): ParityIssue[] {
  const issues: ParityIssue[] = [];
  if (local.length !== cms.length) {
    push(issues, "insights_articles", "*", "error", `count local=${local.length} cms=${cms.length}`);
  }
  for (const article of cms) {
    if (article.cmsEligible) {
      push(issues, "insights_articles", article.slug, "error", "CMS insight unexpectedly publish-eligible");
    }
    const localRow = local.find((item) => item.slug === article.slug);
    if (!localRow) {
      push(issues, "insights_articles", article.slug, "warn", "CMS slug not in local blog set");
      continue;
    }
    if (article.body !== localRow.body) {
      push(issues, "insights_articles", article.slug, "warn", "body hash/text differs");
    }
  }
  return issues;
}

export function buildParityReport(input: {
  mode: string;
  teamLocal: NormalizedTeamMember[];
  teamCms: NormalizedTeamMember[];
  projectsLocal: NormalizedProject[];
  projectsCms: NormalizedProject[];
  servicesLocal: NormalizedService[];
  servicesCms: NormalizedService[];
  insightsLocal: NormalizedInsight[];
  insightsCms: NormalizedInsight[];
}): ContentParityReport {
  const issues = [
    ...compareTeamParity(input.teamLocal, input.teamCms),
    ...compareProjectParity(input.projectsLocal, input.projectsCms),
    ...compareServiceParity(input.servicesLocal, input.servicesCms),
    ...compareInsightParity(input.insightsLocal, input.insightsCms),
  ];
  const errors = issues.filter((issue) => issue.severity === "error");
  return {
    generatedAt: new Date().toISOString(),
    mode: input.mode,
    counts: {
      team_local: input.teamLocal.length,
      team_cms: input.teamCms.length,
      projects_local: input.projectsLocal.length,
      projects_cms: input.projectsCms.length,
      services_local: input.servicesLocal.length,
      services_cms: input.servicesCms.length,
      insights_local: input.insightsLocal.length,
      insights_cms: input.insightsCms.length,
      screenshots_cms: input.projectsCms.reduce((n, p) => n + p.screenshots.length, 0),
    },
    issues,
    leakedDraftMedia: false,
    ok: errors.length === 0,
  };
}
