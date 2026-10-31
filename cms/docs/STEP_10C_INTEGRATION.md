# Step 10C — operator notes

See root documents:

- `STEP_10C_ARCHITECTURE.md`
- `STEP_10C_REPORT.md`
- `STEP_10C_ROLLBACK_GUIDE.md`

Quick commands from the Astro project root:

```bash
npm run cms:shadow
npm run cms:readiness
CONTENT_SOURCE=local npm run build
CONTENT_SOURCE=cms npm run build   # expect fail until owner approvals
```
