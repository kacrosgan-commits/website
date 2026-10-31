# STEP 10D — Publishing Workflow (Editor / Owner)

## Roles

| Role | Directus Studio | Release CLI | Astro build |
| --- | --- | --- | --- |
| Editor | Create/edit drafts (team, portfolio, services, homepage, sections, Insights) | Cannot activate (no confirm secret) | N/A |
| Owner / publisher | Review fields, set editorial gates when authorizing a record | `plan` → `verify` → `activate` / `rollback` | Sets `CONTENT_SOURCE` for local builds |
| Build identity | Read-only tokens (shadow/build) — residual Core risk | Never activate | Reads ACTIVE release only in `cms` mode |

**Limitation (Directus Core):** No reliable Studio “Publish” button / custom permission filters for immutable versioning. Studio = authoring; CLI = publication.

---

## Conceptual states

`Draft → In Review → Owner Approved (editorial flags) → Release Candidate (immutable snapshot) → Published Release (ACTIVE pointer) → Archived/Withdrawn (new release without the record)`

Saving in Studio is **never** publication.

---

## Editor actions (Studio)

1. Open `http://127.0.0.1:8055` (loopback only).
2. Edit text, portraits, screenshots, homepage film refs, etc.
3. Leave Insights as draft unless the owner individually authorizes one later.
4. Do **not** expect the live Astro site to change.

---

## Owner actions (secure local CLI)

All commands from `/home/ubuntu/Documents/website`.

### 1. Read-only plan (non-mutating)

```bash
npm run cms:release:plan
```

Shows eligible counts, blockers, redacted slugs. Current real baseline: **0 eligible** (all drafts). Writes `cms/.tmp/step-10d/last-plan.json`.

### 2. Verify a candidate on disk

```bash
npm run cms:release:verify -- --release <rel-...> --hash <sha256>
# or
npm run cms:release:verify -- --active
```

Checks schema, hash integrity, duplicate slugs, ineligible rows inside the snapshot.

### 3. Activate (explicit confirmation required)

```bash
CMS_RELEASE_CONFIRM="<rel-id>:<sha256>" \
CMS_RELEASE_ACTOR="owner@example.com" \
npm run cms:release:activate -- --release <rel-id> --hash <sha256>
```

Interactive TTY alternative: type the exact release ID when prompted.  
`--yes` alone is **insufficient**.

### 4. Build public HTML from ACTIVE release

```bash
CONTENT_SOURCE=cms npm run build
# or combined helper (verify + media + build):
npm run cms:build-local
npm run preview
```

### 5. Unpublish / archive

Produce a **new** release without the withdrawn record(s), verify, activate. Historical snapshots remain on disk for rollback.

### 6. Rollback

```bash
CMS_RELEASE_CONFIRM="<prior-id>:<prior-hash>" \
npm run cms:release:rollback -- --release <prior-id> --hash <prior-hash>
CONTENT_SOURCE=cms npm run build
```

---

## How to verify a visible change

1. Note ACTIVE id/hash before (`cms/releases/ACTIVE.json` or `cms:release:verify -- --active`).
2. Activate a new release that includes the field change.
3. Rebuild with `CONTENT_SOURCE=cms`.
4. Open the affected route under `astro preview` and confirm the new string/media path.
5. Confirm draft-only edits without activation do **not** appear after rebuild.

---

## Modes

| `CONTENT_SOURCE` | Behavior |
| --- | --- |
| `local` (default) | Existing Astro content; no Directus I/O |
| `cms-shadow` | Local HTML + private parity audit |
| `cms` | ACTIVE immutable release only; fail closed if missing |

---

## Fixture rehearsal (safe)

```bash
npm run cms:fixture:rehearsal
```

Uses `cms/.tmp/step-10d/fixture-releases` only. Does **not** mutate real Directus or real `cms/releases` ACTIVE.

---

## Real baseline authorization

Publishing the imported 9/6/8 records requires a **separate owner authorization** after reviewing `STEP_10D_BASELINE_RECONCILIATION.md`. This Step 10D prompt alone does **not** authorize it.
