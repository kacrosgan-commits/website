# Step 10B rollback guide

## Principles

- Roll back **only** rows and files created by the Step 10B migration run.
- Never run `docker compose down -v`, `docker volume rm`, `apply-schema.mjs --reset-custom-collections`, or truncate tables.
- Never delete pre-migration owner records (there were none of the migrated content types before apply).
- `portfolio_screenshots.project` uses `ON DELETE CASCADE` — delete screenshots before projects if doing targeted deletes, or delete projects knowing children follow.

## Private rollback metadata (gitignored)

| File | Purpose |
| --- | --- |
| `cms/.tmp/step-10b-checkpoint.json` | Created item IDs, file IDs, slug→UUID map |
| `cms/.tmp/step-10b-private-manifest.json` | Full private mapping + source approval provenance |
| `cms/backups/step-10b-20261029-111409/` | Pre-migration `pg_dump` + uploads tar + integrity manifest |

Do not commit these paths. Root `.gitignore` includes `cms/backups/` and `cms/.tmp/`.

## Targeted rollback (manual, owner-approved)

Default plan is dry-run only — list IDs from the checkpoint, then delete in reverse dependency order via authenticated API or Studio:

1. `portfolio_screenshots` (migration-created IDs)
2. `portfolio_projects`
3. `team_members`
4. `services`
5. `insights_articles`
6. `page_sections`
7. Patch singletons `homepage_content` / `site_settings` back to empty/minimal only if they were empty before migration (pre-migration inventory showed empty content)
8. `directus_files` IDs listed in `created_file_ids` / checkpoint `files` values that were created by 10B

Always confirm each ID appears in the Step 10B checkpoint before deleting. Skip any ID an owner created outside the migration.

## Emergency full restore (explicit owner approval only)

**Do not auto-run.** Restores the pre-migration database snapshot:

1. Stop Directus: `cd cms && sg docker -c 'docker compose stop directus'`
2. Restore dump into the running Postgres service (destructive to current CMS rows):

```bash
cd cms
sg docker -c 'docker compose exec -T database sh -lc "psql -U \"$POSTGRES_USER\" -d \"$POSTGRES_DB\""' \
  < backups/step-10b-20261029-111409/directus-before.sql
```

Exact restore flags depend on dump format (`pg_dump` plain SQL in this backup). Verify with the owner before executing.

3. Optionally replace `cms/uploads/` from `uploads-before.tgz` (near-empty at backup time; post-migration uploads would be removed).
4. Start Directus: `sg docker -c 'docker compose start directus'`
5. Re-check health at `http://127.0.0.1:8055/server/ping`

### Restore rehearsal status

Full restore into a disposable isolated database: **not executed** in Step 10B. Persistence across `docker compose restart` (non-destructive) **was** verified with migrated records intact.

## Integrity constraints

- Backup dump SHA-256 must match `BACKUP_MANIFEST.json` before trusting the emergency path.
- After any rollback, re-run anonymous denial checks and `node scripts/migrate-content-10b.mjs --verify` expectations (counts may be zero).
- Astro public site does not read Directus in 10B — rolling back CMS does not change the static website.
