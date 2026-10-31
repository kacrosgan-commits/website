# STEP 10D — Release Schema, Activation & Rollback

## Snapshot schema (`PublishedSiteSnapshot`)

```
schemaVersion: 1
releaseId: rel-<timestamp>-<rand>
createdAt, activatedAt?, publisher, notes?, contentHash
team[], projects[], services[], insights[]
homepage, pageSections[], siteSettings
media[] (fileId, role, sha256?, publicPath?)
sourceRecordChecksums{}
```

- Serialization: canonical JSON (sorted keys) → SHA-256 `contentHash`
- Storage: `cms/releases/<releaseId>/snapshot.json` (immutable, `0400`) + `CONTENT_HASH`
- Pointer: `cms/releases/ACTIVE.json` (`activeReleaseId`, `activeContentHash`, `updatedAt`, `updatedBy`)
- Audit: `cms/releases/audit.jsonl` (append-only)
- Override root: `CMS_RELEASE_ROOT` (fixtures use `cms/.tmp/step-10d/fixture-releases`)

Git: release payloads gitignored; `cms/releases/.gitkeep` tracked.

---

## Activation atomicity

1. Write complete immutable snapshot directory first (fails if id exists).
2. Verify hash + structure.
3. Require confirm token matching `releaseId:contentHash`.
4. Rename/write `ACTIVE.json` last.
5. Append audit `activate`.

If any step fails before pointer write, previous ACTIVE remains valid. Incomplete candidates are never ACTIVE.

Mid-build pin: `cms/.tmp/step-10d-build-pin.json` only honored when it still matches ACTIVE (stale fixture pins ignored).

---

## Retention

- Prior releases kept on disk for rollback.
- Do not delete media still referenced by ACTIVE or retained rollback targets.
- Backups under `cms/backups/` are separate restore path for DB/uploads.

---

## Backup integrity (Step 10D pre-change)

Directory: `cms/backups/step-10d-20261031-141926/`

| File | Purpose |
| --- | --- |
| `directus-before.sql` | PostgreSQL dump (~892 KB) |
| `uploads-before.tgz` | Directus uploads (~21.5 MB) |
| `BACKUP_MANIFEST.json` | sha256 + sizes |
| `pre-change-inventory.json` | collection counts |

Verify:

```bash
sha256sum -c <(jq -r '"\(.dump_sha256)  directus-before.sql","\(.uploads_tar_sha256)  uploads-before.tgz"' BACKUP_MANIFEST.json)
```

(from inside the backup directory)

**Restore:** restore only into a disposable DB/volume — never rehearse against live CMS volumes without owner approval. Live restore steps: stop Directus → restore SQL → restore uploads → start → verify inventory.

---

## Isolated restore / publish rehearsal

Executed: `npm run cms:fixture:rehearsal` → **passed** (`cms/.tmp/step-10d/fixture-rehearsal-report.json`)

| Step | Result |
| --- | --- |
| Seed + activate A | OK |
| Draft edit without new release | ACTIVE unchanged |
| Rewrite immutable A | Denied |
| Activate without confirm | Denied |
| Activate B (edited role + new project + insight) | OK |
| Stale hash | Denied |
| Activate C (withdraw gamma) | gamma absent |
| Rollback to A | hash matches A; prior B/C retained on disk |

No real Directus mutations. Real `cms/releases` ACTIVE remains null.

---

## Recovery actions (operator)

| Situation | Action |
| --- | --- |
| Bad cms build | Keep prior `dist` / rebuild `CONTENT_SOURCE=local` |
| Wrong ACTIVE | `cms:release:rollback` to prior id+hash |
| Corrupt snapshot | Fail closed; restore from backup or re-plan |
| Lost ACTIVE file | Reconstruct pointer only after verifying snapshot hash |
| DB disaster | Restore Step 10D (or later) backup into disposable env first |

---

## Commands quick reference

```bash
npm run cms:release:plan
npm run cms:release:verify -- --release <id> --hash <sha>
CMS_RELEASE_CONFIRM="<id>:<sha>" npm run cms:release:activate -- --release <id> --hash <sha>
CMS_RELEASE_CONFIRM="<id>:<sha>" npm run cms:release:rollback -- --release <id> --hash <sha>
npm run cms:build-local
npm run cms:fixture:rehearsal
```
