# STEP 10C — Rollback guide

Restore the authorized public site without touching Directus data or volumes.

## One-command local rollback

```bash
cd /home/ubuntu/Documents/website
CONTENT_SOURCE=local npm run build
npm run preview -- --host 127.0.0.1 --port 4377
```

Expected:

- Build exit 0
- **35** HTML pages
- **31** sitemap URLs
- Homepage video still `/videos/vortex-team-showcase.mp4`
- No Directus host/token strings in `dist`

Automated check:

```bash
npm run cms:rollback-check
```

## Clear accidental CMS mode

1. Ensure project `.env` has `CONTENT_SOURCE=local` (or unset it).
2. Do **not** set `CONTENT_SOURCE=cms` in CI or shell profiles.
3. Rebuild: `CONTENT_SOURCE=local npm run build`

## What rollback does **not** do

- Does not run `docker compose down -v`
- Does not delete `cms/uploads` or `vortex_cms_pgdata`
- Does not change Directus publication flags
- Does not restore database dumps (unnecessary for frontend rollback)

## If a failed `cms` build left `dist/` messy

```bash
rm -rf dist
CONTENT_SOURCE=local npm run build
```

`cms-media/` is only created for approved CMS builds; local builds do not require it. Stale `dist/cms-media` should be removed with `dist` before a clean local rebuild.

## Directus outage behavior

| Situation | Behavior |
| --- | --- |
| `CONTENT_SOURCE=local` | Builds succeed with Directus stopped/unreachable |
| `CONTENT_SOURCE=cms-shadow` | Audit fails if Directus/token unavailable; do not treat as match |
| `CONTENT_SOURCE=cms` | Fail closed |
| Already-built static `dist` | Continues to serve without Directus (when previewed/hosted later) |
