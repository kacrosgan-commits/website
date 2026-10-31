# STEP 10C — Reconciliation plan (no automatic approval)

**Status:** Plan only. **Zero** real CMS `status` / `publication_approved` / `published_at` mutations were performed in Step 10C.

## Why CMS mode cannot cut over yet

Step 10B imported editorial records as:

- `status: draft`
- `publication_approved: false`
- `published_at: null`

That includes the nine staff profiles, six case studies, and eight services that are already public on the **Astro local** site. Source approval and CMS approval are **distinct facts**.

`npm run cms:readiness` currently reports **0** eligible rows in every public collection.

## Required owner actions (future explicit step — typically 10D)

For each record below, an owner must review Studio fields, then set **all three** gates:

1. `status = published`
2. `publication_approved = true`
3. `published_at = <real publish timestamp>`

Do **not** bulk-approve from a script in this repository.

### Team (9) — source already public on Astro

| Slug | Name | CMS today | Needed for cms mode |
| --- | --- | --- | --- |
| founder-ceo | Don Tran | draft / unapproved | owner publish gates |
| cofounder-cto | Joshua Mendoza | draft / unapproved | owner publish gates |
| cfo | Lin Jiayi | draft / unapproved | owner publish gates |
| project-manager | Pongsak Rattanakul | draft / unapproved | owner publish gates |
| senior-fullstack-developer | Dmytro Melnyk | draft / unapproved | owner publish gates |
| ai-engineer | Carlo Garcia | draft / unapproved | owner publish gates |
| mobile-app-developer | Matheus Pereira | draft / unapproved | owner publish gates |
| uiux-product-designer | Adrian Cruz | draft / unapproved | owner publish gates |
| qa-devops-engineer | Sofia Vasylivna Melnyk | draft / unapproved | owner publish gates |

Also confirm Adrian ≠ Matheus portraits before publishing.

### Portfolio (6) + screenshots (18)

| Slug | CMS today | Notes |
| --- | --- | --- |
| scaleup-systems | draft | 3 screenshots must remain attached |
| medastare | draft | |
| gain-energy-upstrima | draft | |
| gowabi | draft | |
| daniela-diamonds | draft | |
| born-to-rock | draft | |

### Services (8)

All eight specialty slugs remain draft/unapproved in CMS while public on Astro.

### Insights (12)

**Keep unpublished** in both Astro and CMS until individual owner decisions. Do not set publish gates on these as part of baseline cutover.

### Homepage / settings / page_sections

Review copy/disclosure; publish only with the same triple gate once the owner wants CMS-driven homepage fields. Keep the **30s** local MP4 as the public video source until an approved media materialization path is intentionally enabled.

## Verification after owner approvals

```bash
npm run cms:readiness    # expect ok:true only after gates are set
npm run cms:media        # materialize allowlisted approved files only
CONTENT_SOURCE=cms npm run build
```

Until then:

```bash
CONTENT_SOURCE=local npm run build
```

## Private machine-readable copy

`cms/.tmp/step-10c-readiness.json` (gitignored) records the latest non-mutating readiness snapshot.
