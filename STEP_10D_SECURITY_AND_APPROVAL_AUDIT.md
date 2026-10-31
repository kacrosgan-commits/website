# STEP 10D — Security & Approval Audit

**Probes run:** 2026-10-31 via `scripts/cms-security-probes-10d.mjs` → `cms/.tmp/step-10d/security-probes.json`

---

## Anonymous Directus API

| Path | Status |
| --- | --- |
| `/items/team_members` | 403 |
| `/items/portfolio_projects` | 403 |
| `/items/insights_articles` | 403 |
| `/items/services` | 403 |
| `/files` | 403 |
| `/assets/<uuid>` | 403 |

No anonymous collection or asset read enabled.

---

## Approval / activation controls

| Control | Behavior verified |
| --- | --- |
| Editorial gate | Requires `status=published` **and** `publication_approved=true` **and** valid `published_at` |
| Mutable status alone | Does not flip ACTIVE; cms builds ignore draft items |
| Activate without confirm | Exit 3 denied |
| Stale/wrong hash | Denied |
| `--yes` alone | Not accepted |
| Confirm token | `CMS_RELEASE_CONFIRM="<releaseId>:<contentHash>"` or interactive ID match |
| Real ACTIVE pointer | Remains `null` after Step 10D |

---

## Snapshot immutability

- Writing an existing `rel-*` directory throws (`already exists` / immutable).
- In-memory draft mutation does not alter on-disk snapshot (unit + fixture rehearsal).
- Snapshot files chmod `0400`; `ACTIVE.json` / audit `0600`.

---

## Draft isolation

- 12 Insights: all draft, unapproved, `published_at` null (authenticated shadow read).
- `cms:release:plan` eligible insights = 0; ineligible = 12.
- Fixture builds never included real Insight bodies.
- Local / shadow HTML contain no draft Insight routes.

---

## Media handling

- `cms:media` materializes only UUIDs listed on the ACTIVE release.
- MIME sniff + size caps + markup rejection (Step 10C media module reused).
- Failures abort before promoting partial `dist/cms-media`.
- Fixture releases use synthetic paths (no Directus download of private files).

---

## Client / dist leakage

- Local `dist` scan: **0** matches for Bearer tokens, `DIRECTUS_TOKEN`, or `127.0.0.1:8055`.
- No `PUBLIC_*` publish secrets introduced.

---

## Core residual risks (honest)

1. **Build/shadow tokens can still read draft items** if granted broad collection read — keep host-local, rotate, never ship in browser.
2. **Admin user can bypass** Studio restrictions — trusted-operator assumption.
3. **Filesystem audit.jsonl** is append-only vs casual editors, not cryptographic tamper-proof against host admin.
4. **No Directus-native immutable versioning** on Core — filesystem releases are the control plane.

---

## Permissions unchanged by 10D

- Loopback bind `127.0.0.1:8055` retained  
- No public role grants  
- No domain/DNS/email/hosting exposure  
