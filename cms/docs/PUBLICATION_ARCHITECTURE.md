# Publication architecture — design now, implement in 10C/10D

Step 10A creates the CMS and schema only. Astro continues to read local files. This document is the contract for later steps.

## 1. Editorial data is not public by default

Workflow:

`draft` → `in_review` → `approved` → `published` (or `archived`)

Plus a separate boolean `publication_approved` that defaults to `false`.

A status dropdown alone does **not** create an immutable approved snapshot. Later implementation must choose one verified approach on the installed Directus tier:

1. Directus content versioning / revisions if available under Core, or
2. An explicit published-snapshot collection / frozen JSON export consumed by the Astro build, or
3. A build-time fetch that only accepts rows where `status = published` **and** `publication_approved = true`, while editors continue editing a draft copy.

Until that is implemented, never treat “status changed in Studio” as a live website publish.

## 2. Static Astro build contract

Recommended integration (Step 10C+):

- Build-time fetch with a **server-only** read token or local export artifact.
- Astro emits static HTML, navigation, metadata, and sitemap.
- No CMS token, draft body, or private file URL in the browser bundle.
- If CMS is unreachable during CI build: fail closed or reuse the last known-good approved export — never silently publish empty pages or drafts.

## 3. Media

- Approved images only enter the public pipeline after owner approval.
- Private draft uploads stay inaccessible anonymously (already the 10A default).
- Original team portraits and portfolio screenshots remain the Astro/public sources until Step 10B migration verifies checksums and permissions.
- Homepage team film remains the existing illustrative silent MP4 + poster; disclosure text stays non-documentary.

## 4. Publish events

A future authenticated webhook or CI job may rebuild the static site after an owner publish action. Step 10A does **not** configure hosting, webhook secrets, or external CI.

## 5. Deletion / unpublish

- Prefer archive/unpublish over hard delete.
- Next approved build must drop public routes and sitemap entries.
- Avoid cascading file deletes that remove still-referenced media.

## 6. Rollback

- Keep database dumps, upload archives, and previous deploy artifacts.
- Previous published snapshot must be restorable independently of in-progress drafts.

## 7. Contact form

The Astro contact page stays copy-only (“Inquiry copied. No message has been sent.”). CMS must not pretend to accept or send inquiries.

## 8. Site URL

Canonical URLs, robots, and sitemap origin remain governed by Astro’s deferred `PUBLIC_SITE_URL` (currently the `https://example.com` placeholder). Directus `PUBLIC_URL` is only the local Studio/API origin.
