# Step 10A local tests

Credentials redacted. Commands run on Ubuntu with Docker Engine + Compose V2.

## Environment

| Check | Result |
| --- | --- |
| `docker --version` | Docker version 29.9.2 |
| `docker compose version` | Docker Compose version v5.6.1 |
| Node | v24.21.0 |
| Directus image | `directus/directus:12.6.0` |
| PostgreSQL image | `postgres:16.10-alpine` |
| Studio URL | `http://127.0.0.1:8055` |
| Host Postgres port | not published |
| Docker group note | Shell may need `sg docker -c '…'` when the login session lacks the group |

## Compose

```bash
cd cms
sg docker -c 'docker compose config --quiet'   # exit 0; do not dump resolved secrets
sg docker -c 'docker compose up -d'
sg docker -c 'docker compose ps'
```

Observed healthy services:

- `database` — healthy, `5432/tcp` internal only
- `directus` — healthy, `127.0.0.1:8055->8055/tcp`
- Volume `vortex_cms_pgdata` present

`ss -ltn` showed listener on `127.0.0.1:8055` only (no host `5432`).

## Admin bootstrap note

First boot with `ADMIN_EMAIL=owner@localhost.local` failed Directus email validation, so no admin user was created. Corrected to `owner@example.com`, recreated the **empty** volume once, and re-bootstrapped successfully. Login and static `ADMIN_TOKEN` both returned HTTP 200 for `/users/me`.

## Schema apply

```bash
cd cms
node scripts/apply-schema.mjs --reset-custom-collections   # once, to fix integer→uuid PK mismatch
node scripts/apply-schema.mjs                              # idempotent thereafter
```

Result:

- 8 custom collections
- UUID primary keys
- `portfolio_screenshots.project` → `portfolio_projects.id` (`ON DELETE CASCADE`)
- `schema/collections.meta.json` written
- Public/custom read permissions count: 0

## API verification

```bash
node scripts/verify-10a.mjs
```

| Check | Result |
| --- | --- |
| server ping | PASS |
| admin auth | PASS |
| collections present (8) | PASS |
| create/update test team item | PASS |
| anonymous reads (team, portfolio, insights, services, settings, homepage, page_sections, files) | PASS (403) |
| tiny PNG upload | PASS |
| anonymous private file | PASS (403) |
| summary | 16 passed, 0 failed |

## Persistence

```bash
sg docker -c 'docker compose restart'
node scripts/verify-persistence.mjs
node scripts/cleanup-test-data.mjs
```

| Check | Result |
| --- | --- |
| test item survived restart | PASS |
| test file survived restart | PASS |
| disposable cleanup | PASS (204 deletes) |

## Studio UI

Browser opened `http://127.0.0.1:8055` → redirected to `/admin/login`. Sign-in form rendered (Email, Password, Sign In). Full interactive password entry was not scripted in-agent (credential material kept out of transcripts); authenticated Studio capability was proven via admin token/API CRUD against the same instance.

## Astro regression (no CMS wiring)

| Command | Result |
| --- | --- |
| `npm run check` | Pass — 0 errors / 0 warnings / 0 hints |
| `npm run build` | Pass — 35 pages |
| `npm test` | 24 pass / 1 fail — see note below |
| `npm run test:e2e` (default; reuses `astro dev` on :4321) | 12 pass / 5 fail — sitemap missing on dev server; Insights DEV draft preview |
| e2e vs `astro preview` on `127.0.0.1:4377` after build | **17 pass / 0 fail** |

**Unit failure note:** `tests/unit/site-quality.test.ts` asserts homepage team film byte size `4718893`; on-disk `public/videos/vortex-team-showcase.mp4` is `13032156`. Failure is unrelated to `cms/` (Astro sources were not switched to Directus in 10A). Existing six portfolio cases, nine team profiles, twelve Insights drafts, eight services, and copy-only contact remain in the Astro tree.

## Not tested in 10A

- Full `pg_restore` onto a wiped volume
- Content migration (10B)
- Astro fetch from Directus (10C)
- Domain, DNS, email, hosting, deployment
