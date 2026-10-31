# Step 10B migration guide (Ubuntu)

Migrate verified Astro content into the existing local Directus instance under `cms/`. Does **not** connect Astro to Directus (that is Step 10C).

## Prerequisites

- Healthy stack: `cd cms && sg docker -c 'docker compose ps'`
- Directus Studio: [http://127.0.0.1:8055](http://127.0.0.1:8055)
- `cms/.env` present (never commit it)
- Node 22+ with project `node_modules` (uses `typescript` and `yaml` already available)

## Backup (required before `--apply`)

A verified pre-migration backup already exists at:

`cms/backups/step-10b-20261029-111409/`

Contents:

- `directus-before.sql` — `pg_dump` via the running `database` service
- `BACKUP_MANIFEST.json` — size + SHA-256 integrity record
- `uploads-before.tgz` — uploads tree at backup time
- `pre-migration-inventory.json` — collection counts before import

To create a **new** timestamped backup later:

```bash
cd cms
STAMP=$(date -u +%Y%m%d-%H%M%S)
DIR="backups/step-10b-$STAMP"
mkdir -m 700 -p "$DIR"
sg docker -c 'docker compose exec -T database sh -lc "exec pg_dump -U \"$POSTGRES_USER\" \"$POSTGRES_DB\""' \
  > "$DIR/directus-before.sql"
chmod 600 "$DIR/directus-before.sql"
# Then record SHA-256 + uploads tar into BACKUP_MANIFEST.json (see BACKUP_AND_RESTORE.md)
```

Set `BACKUP_OK=1` only after confirming the dump is nonempty and the SHA matches.

## Commands

```bash
cd cms

# Read-only inventory
node scripts/migrate-content-10b.mjs --inventory

# Plan creates/skips (default). Nonzero if critical blockers.
node scripts/migrate-content-10b.mjs --dry-run

# Controlled write (idempotent by slug / checksum / checkpoint)
BACKUP_OK=1 node scripts/migrate-content-10b.mjs --apply

# Read-back verification
node scripts/migrate-content-10b.mjs --verify
```

## What is imported

| Source | CMS collection | Staging |
| --- | --- | --- |
| 9 team profiles + portraits | `team_members` | `draft`, `publication_approved=false` |
| 6 approved case studies | `portfolio_projects` | same |
| 18 screenshots (3 each) | `portfolio_screenshots` | `status=draft` |
| 8 services | `services` | same staging |
| 12 Insights Markdown drafts | `insights_articles` | same staging; never published |
| Site labels | `site_settings` | singleton patch |
| Homepage copy + poster + owner-accepted film | `homepage_content` | 30s MP4 imported as file #29; Astro path unchanged |
| About / process blocks | `page_sections` | 8 sections |

Excluded: six `sample-*` case-study stubs.

## Viewing in Studio

1. Open [http://127.0.0.1:8055](http://127.0.0.1:8055) and sign in as the owner admin.
2. Open Collections → confirm counts (9 / 6 / 18 / 8 / 12 / …).
3. Open a team member → portrait should load while authenticated.
4. Confirm Insights remain Draft / not approved.

## Safe reruns

`--apply` a second time must create **zero** new items/files when source is unchanged. Matching keys:

- Files: SHA-256 embedded in Directus file title + checkpoint map
- Items: unique `slug` (or page_key+section_key / screenshot checksum)

Conflicts with owner-edited existing rows: skip (no silent overwrite).

## Likely errors

| Symptom | Cause / action |
| --- | --- |
| `APPLY_BLOCKED` / missing backup | Create or point at verified backup; set `BACKUP_OK=1` |
| Admin auth failed | Check `ADMIN_TOKEN` in `cms/.env`; do not print it |
| 503 under pressure | Script retries; re-run `--apply` (idempotent) |
| Portrait conflict | Adrian/Matheus must keep distinct source paths |

## Privacy

Anonymous GETs to custom collections, `/files`, and `/assets/<id>` must remain denied (observed 403). Do not add Public read permissions in 10B.
