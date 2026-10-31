# Vortex Digital CMS (Step 10A)

Local Directus Studio and PostgreSQL for the existing Astro website. This directory is intentionally separate from the Astro app. **Step 10A does not migrate live website content and does not change the frontend.**

## Prerequisites (Ubuntu)

- Docker Engine
- Docker Compose V2 (`docker compose`)
- Membership in the `docker` group for your shell session

Check:

```bash
docker --version
docker compose version
docker info --format '{{.ServerVersion}}'
```

If `docker info` says permission denied but `getent group docker` lists your user, your current shell may not have the group yet. Open a new login shell, or run Compose under that group:

```bash
sg docker -c 'docker compose version'
```

Do not weaken `docker.sock` permissions. Membership in the `docker` group is root-equivalent.

## First-time setup

```bash
cd cms
cp .env.example .env
# Edit .env: set SECRET, DB_PASSWORD, ADMIN_PASSWORD, ADMIN_TOKEN to strong random values.
# Example generators:
#   openssl rand -hex 32
#   openssl rand -base64 24

sg docker -c 'docker compose config --quiet'
sg docker -c 'docker compose up -d'
sg docker -c 'docker compose ps'
```

Wait until `directus` is healthy, then open Studio:

[http://127.0.0.1:8055](http://127.0.0.1:8055)

Sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `cms/.env`.

Apply the Vortex content schema (idempotent). Collections use UUID primary keys:

```bash
cd cms
node scripts/apply-schema.mjs
node scripts/verify-10a.mjs
```

Only if you must wipe **empty** custom collections and recreate them:

```bash
node scripts/apply-schema.mjs --reset-custom-collections
```

## Daily commands

```bash
cd cms
sg docker -c 'docker compose up -d'     # start
sg docker -c 'docker compose ps'        # status
sg docker -c 'docker compose logs --tail=80 directus'  # redact secrets before sharing
sg docker -c 'docker compose down'      # stop; keeps volumes
```

**Do not** run `docker compose down -v` unless you intentionally want to destroy the database volume.

## What this stack includes

| Service | Image | Host exposure |
| --- | --- | --- |
| Directus Studio/API | `directus/directus:12.6.0` | `127.0.0.1:8055` only |
| PostgreSQL | `postgres:16.10-alpine` | none (internal network) |

Persistent storage:

- Named volume `vortex_cms_pgdata` for Postgres
- Bind mount `cms/uploads` for Directus files

## Schema

Custom collections (8 total, under the Core tier 25-collection limit):

1. `team_members`
2. `portfolio_projects`
3. `portfolio_screenshots`
4. `services`
5. `insights_articles`
6. `site_settings` (singleton)
7. `homepage_content` (singleton)
8. `page_sections`

Details: `docs/CONTENT_SCHEMA.md`.

## Security defaults (Step 10A)

- Studio requires authentication
- Anonymous API reads of custom collections and files are denied
- No website content is imported yet
- No Astro `PUBLIC_*` variable points at Directus
- Contact delivery, domain, DNS, and hosting remain unchanged

## Docs

- `docs/CONTENT_SCHEMA.md`
- `docs/SECURITY_AND_PERMISSIONS.md`
- `docs/PUBLICATION_ARCHITECTURE.md`
- `docs/BACKUP_AND_RESTORE.md`
- `docs/STEP_10A_LOCAL_TESTS.md`

## Out of scope here

- Step 10B content migration
- Step 10C Astro CMS reads
- Domain, email, Formspree, deployment
