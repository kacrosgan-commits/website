# Backup and restore — Step 10A

Local-only procedures for the Directus + PostgreSQL stack under `cms/`. Never commit dumps, uploads, or credentials.

## What to back up

| Asset | Location | Notes |
| --- | --- | --- |
| PostgreSQL data | Docker volume `vortex_cms_pgdata` | Schema + Directus system + content rows |
| Uploaded media | `cms/uploads/` (bind mount) | File binaries; metadata lives in Postgres |
| Schema apply script | `cms/scripts/apply-schema.mjs` | Reproducible collection definitions |
| Schema meta snapshot | `cms/schema/collections.meta.json` | Sanitized collection list after apply |
| Secrets | `cms/.env` | **Never** store in Git or shared dumps |

Schema export ≠ data backup ≠ media backup. Keep all three for a full recovery story.

## PostgreSQL dump (recommended)

From the project host, with the stack running:

```bash
cd cms
sg docker -c 'docker compose exec -T database \
  pg_dump --username="$POSTGRES_USER" --format=custom --dbname="$POSTGRES_DB"' \
  > "../backups/vortex-cms-$(date -u +%Y%m%dT%H%M%SZ).dump"
```

Use a directory outside Git (for example `~/backups/vortex-cms/`) and keep permissions private (`umask 077`).

Restore into a **stopped application / empty target** only after an explicit owner decision:

```bash
# WARNING: destructive to the target database contents.
cd cms
sg docker -c 'docker compose stop directus'
sg docker -c 'docker compose exec -T database \
  pg_restore --username="$POSTGRES_USER" --clean --if-exists --dbname="$POSTGRES_DB"' \
  < /path/to/vortex-cms-YYYYMMDD.dump
sg docker -c 'docker compose start directus'
```

Exact flags may vary with dump format; verify with `pg_restore --list` before applying.

## Uploads backup

```bash
cd cms
tar -czf ~/backups/vortex-cms-uploads-$(date -u +%Y%m%dT%H%M%SZ).tgz uploads
```

Restore by extracting into `cms/uploads/` while Directus is stopped, then starting again. Preserve file modes where possible.

## Schema reproducibility

Fresh machine with the same pinned images:

```bash
cd cms
cp .env.example .env   # fill secrets locally
sg docker -c 'docker compose up -d'
node scripts/apply-schema.mjs
```

Only use `node scripts/apply-schema.mjs --reset-custom-collections` when intentionally deleting **custom** collections (no Astro content should be in CMS during 10A). This does **not** wipe the Directus system tables or the Postgres volume.

## Persistence smoke test (non-destructive)

Do **not** destroy the volume to “prove” restore.

1. `node scripts/verify-10a.mjs` — creates a disposable test item + tiny PNG.
2. `sg docker -c 'docker compose restart'`
3. Wait until Directus is healthy.
4. `node scripts/verify-persistence.mjs`
5. `node scripts/cleanup-test-data.mjs`

## Safety warnings

- Never run `docker compose down -v` or `docker volume rm vortex_cms_pgdata` as a routine step.
- Never paste dump contents, tokens, or `.env` values into tickets or reports.
- Full dump→empty-volume restore rehearsal: **not tested** in Step 10A (persistence across restart **was** tested).
