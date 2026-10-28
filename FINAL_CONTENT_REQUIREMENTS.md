# Final content requirements

Only facts that still have to come from the owner. The Vortex Digital name and the eight services are already confirmed and are not listed again.

## Team identities

For each of the nine roles, if that person should appear as a named employee:

- Real name
- Approval to publish that name
- Whether the current portrait is that person, or must stay labeled as illustrative
- A short biography the person has approved
- Expertise that person has actually confirmed
- Real LinkedIn, GitHub, or portfolio URLs, if any
- Any portfolio project they personally worked on, only after that project is also approved

Until then, profiles stay role descriptions, `isPublished` stays false, and no name is shown.

## Portfolio contributions and permissions

For each of Born To Rock, MedaStaré, ScaleUp Systems, Gain Energy / Upstrima, GoWabi, and Daniela Diamonds:

- What Vortex Digital actually did
- Dates of that work
- Modules delivered
- Technologies Vortex Digital used (separate from what the public product appears to use)
- Integrations Vortex Digital built
- QA or release work, if any
- Permission to publish the screenshots and to name the product as client work

`publicationApproved` stays false until those are confirmed. Do not treat the suggested homepage order as permission.

## Verified technologies

The site lists a working catalog (React, Next.js, TypeScript, Node.js, Python, Go, Flutter, React Native, Swift, Kotlin, common data and cloud tools, LLM APIs, RAG, vector search). It is labeled as a catalog, not a certification.

Say which of those the studio should stand behind as current practice, and which should be removed. Do not add a technology for a portfolio project unless the contribution note above confirms it.

## Contact delivery

The form does not deliver mail. Configuration is environment-only. Steps are in `docs/contact-delivery.md`.

Required:

- `PUBLIC_FORMSPREE_ENDPOINT` — an `https://` Formspree URL you control
- `PUBLIC_CONTACT_EMAIL` — a mailbox you can read. `hello@example.com` is not shown as an inbox.

Optional:

- `PUBLIC_BOOKING_URL` — only if a real scheduling link exists
- `PUBLIC_SITE_URL` — the real origin, when a domain is connected. This step did not set hosting.

After those are set, send one real test inquiry and confirm it arrives before treating the form as live.

## Insights

Four articles are in editorial review and are not public:

- Planning an MVP for a Startup
- Choosing Between Native and Cross-Platform Apps
- What Startups Should Know About AI Integration
- Building Maintainable SaaS Applications

To publish one, set `draft: false` on that file after you have read it. Leave `demonstration: false`. It will then appear on `/insights`, in the header, in the footer, and in the sitemap. A personal author name should be added only if that person agrees. Otherwise the byline stays “Vortex Digital.”

The older demonstration posts should stay unpublished.

## Other facts still unset

- Registered legal name (`legalName` is empty)
- Public postal address
- Social profile URLs (none are invented)
- Any verified outcome numbers or client quotes, if you later want those sections to appear
- Counsel review of `/privacy` and `/terms` before they are treated as binding

Domain registration, hosting, and DNS were not part of this step.
