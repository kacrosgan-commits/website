# STEP 10D — Baseline Reconciliation (Owner Review Package)

**Status:** Checklist only — **no real staged rows were bulk-approved or activated in Step 10D.**

Inventory source: `cms/backups/step-10d-20261031-141926/pre-change-inventory.json`  
Parity context: Step 10C shadow audit (0 material mismatches; eligible public counts 0).

---

## Required owner authorization (separate from this step)

Before any real ACTIVE release, the owner must explicitly authorize:

1. Per-record editorial gates (`status`, `publication_approved`, `published_at`) for each public row, **or** an equivalent signed release plan listing exact slugs.
2. Activation of a specific `releaseId` + `contentHash`.
3. Switching operational builds to `CONTENT_SOURCE=cms` (optional; local remains valid).

This Step 10D document is **not** that authorization.

---

## Team (9) — review checklist

| Slug | Review | Portrait distinctness / notes |
| --- | --- | --- |
| `founder-ceo` | [ ] | |
| `cofounder-cto` | [ ] | |
| `cfo` | [ ] | |
| `project-manager` | [ ] | |
| `senior-fullstack-developer` | [ ] | |
| `ai-engineer` | [ ] | |
| `mobile-app-developer` | [ ] | |
| `uiux-product-designer` | [ ] | Adrian Cruz external employment must stay **external** |
| `qa-devops-engineer` | [ ] | Matheus portrait must stay distinct from Adrian |

Current CMS: all draft / unapproved.

---

## Portfolio (6) + screenshots (18)

| Slug | Review | Contribution / URLs / tech preserved |
| --- | --- | --- |
| `scaleup-systems` | [ ] | |
| `medastare` | [ ] | |
| `gain-energy-upstrima` | [ ] | |
| `gowabi` | [ ] | |
| `daniela-diamonds` | [ ] | |
| `born-to-rock` | [ ] | |

Confirm 18 screenshots and media UUIDs match Step 10B audit before first release.

---

## Services (8)

| Slug | Review |
| --- | --- |
| `web-application-development` | [ ] |
| `mobile-app-development` | [ ] |
| `ai-intelligent-automation` | [ ] |
| `saas-platform-development` | [ ] |
| `backend-api-engineering` | [ ] |
| `cloud-devops` | [ ] |
| `ui-ux-product-design` | [ ] |
| `qa-software-testing` | [ ] |

CMS title/summary/hero overlay code-owned ServiceDetail bodies when slug matches.

---

## Homepage / sections / settings

| Record | Review |
| --- | --- |
| `homepage_content` (film UUID = owner-selected 30s #29) | [ ] |
| `site_settings` | [ ] |
| `page_sections` (8) About/Process mapped fields | [ ] |

Preserve poster + 30s MP4 semantics in public output.

---

## Insights (12) — keep unpublished

All remain draft. Do **not** bulk-approve. Individual publish only with separate authorization.

Slugs (inventory):  
`deploying-applications-with-confidence`, `api-habits-for-a-small-product-team`, `what-startups-should-know-about-ai-integration`, `how-to-plan-a-custom-software-project`, `building-scalable-web-applications`, `ux-and-qa-before-a-product-launch`, `choosing-architecture-for-a-saas-product`, `improving-mobile-application-performance`, `building-maintainable-saas-applications`, `native-vs-cross-platform-apps`, `integrating-ai-into-existing-applications`, `planning-an-mvp-for-a-startup`.

---

## Integrity anchors

- Pre-change backup SHA256s: `BACKUP_MANIFEST.json` in the Step 10D backup dir  
- After a future real release: record `contentHash` from `ACTIVE.json` here  

| Field | Value |
| --- | --- |
| Real ACTIVE releaseId | `null` (as of Step 10D close) |
| Real ACTIVE contentHash | `null` |
