# Website completion status

Technical completion means the route builds, renders, and links. It does not mean the public facts on that page have been verified by the owner.

Reviewed in the browser and by HTTP against the dev server and the production preview on 27 October 2026. Widths checked for overflow: 375, 768, 1024, 1440, 1920 on the homepage; 375 on a service page and the dev portfolio.

| Page | Technically complete | Content complete | Visually reviewed | Functionality verified | Awaiting owner information |
| --- | --- | --- | --- | --- | --- |
| `/` | Yes | Partial. Offer, services, process, and role directory are accurate. No approved work, stats, or quotes. | Yes | Yes. CTAs go to services, contact, process, and team profiles. | Approved work, if any, before it can be featured. |
| `/about` | Yes | Partial. Positioning matches a software studio for startups. No legal entity, address, or named people. | Yes, in this pass as a consistency check. Not rebuilt. | Yes. Route responds. Team cards still link to profiles. | Legal name, location, identities. |
| `/services` | Yes | Yes, for the eight defined services. | Yes | Yes. Eight service links and related links resolve. | None for the service list itself. |
| `/services/web-application-development` | Yes | Yes, as a service description. Not a client result. | Yes at 375px. No overflow. | Yes | None |
| `/services/mobile-app-development` | Yes | Yes, as a service description. | Route verified. Layout shares the service template. | Yes | None |
| `/services/ai-intelligent-automation` | Yes | Yes, as a service description. | Route verified. | Yes | None |
| `/services/saas-platform-development` | Yes | Yes, as a service description. | Route verified. | Yes | None |
| `/services/backend-api-engineering` | Yes | Yes, as a service description. | Route verified. | Yes | None |
| `/services/cloud-devops` | Yes | Yes, as a service description. | Route verified. | Yes | None |
| `/services/ui-ux-product-design` | Yes | Yes, as a service description. | Route verified. | Yes | None |
| `/services/qa-software-testing` | Yes | Yes, as a service description. | Route verified. | Yes | None |
| `/portfolio` | Yes | No. Zero approved case studies. The public page says so and links to services. | Yes in development (review grid) and by production HTTP. | Yes. Production has no “View Case Study” links. | Contribution, dates, stack, deliverables, image permission, and publication approval per project. |
| `/portfolio/[slug]` | Dev only. Production 404 while unapproved. | No | Review layouts from Step 5 still return 200 in dev. | Safeguard verified: production 404, sitemap excludes the slugs. | Same as portfolio. |
| `/process` | Yes | Yes. Six stages match About, Services, and the homepage. | Route verified. Not rebuilt. | Yes | None for the stage names. |
| `/team` | Yes | Partial. Nine roles are complete. No names. | Yes | Yes. Profiles and the gallery link work. | Real names, biographies, and publication approval. |
| `/team/[slug]` (nine profiles) | Yes | Partial. Role content only. `isPublished` is false, so pages are `noindex`. | Step 6 layouts preserved. Founder profile returns 200. | Yes. E2E checks three images per profile and previous/next. | Identity, portrait approval, links, and any real project involvement. |
| `/team/gallery` | Yes | The 27 files are present. They are labeled as supplied or illustrative, not as confirmed meetings. | Route verified. | Yes. 27 team image references. `noindex`. | Which portraits and scenes may be described as real. |
| `/insights` | Yes | No published articles. Empty state is intentional. | Yes in dev, including the review list. | Yes. Hidden from header and footer until a post is published. | Approval of articles before they are public. |
| `/insights/[slug]` | Dev only for the four editorial drafts. Production 404. | Drafts are written. Not approved. | Dev URLs return 200. | Production 404 confirmed for all four. | Editorial approval, and a named author only if you want one. |
| `/contact` | Yes | Partial. The form is complete. Delivery is not. | Yes. Validation errors checked in the browser. | Partial. Validation passes. Sending does not. | `PUBLIC_FORMSPREE_ENDPOINT` and a real `PUBLIC_CONTACT_EMAIL`. See `docs/contact-delivery.md`. |
| `/privacy` | Yes | No. Working notice, not a reviewed policy. | Route verified. Placeholder inbox removed from the visible copy. | Yes | Legal review, controller identity, and a real contact address. |
| `/terms` | Yes | No. Working notice, not a reviewed agreement. | Route verified. | Yes | Legal review and the contracting entity. |
| `/404` | Yes | Yes | Route verified by e2e. | Yes | None |

Production build: 29 pages. That count includes the public pages above and excludes unapproved portfolio studies and unpublished articles.
