# Content approval needed

Do not treat the public site as factually complete until each item below is supplied and reviewed.

| Item | Current state | Needed before it can be stated as fact |
| --- | --- | --- |
| Public brand | `Vortex Digital` in `src/data/site.ts`. `nameIsPlaceholder` is false | Confirmed. Do not ask again. |
| Legal entity | `legalName` is empty and unpublished | Registered legal name, if it differs from the public brand |
| Domain | `PUBLIC_SITE_URL` defaults to `https://example.com` | Owned domain with DNS and HTTPS |
| Public email | `hello@example.com` | A mailbox the company actually reads |
| Address and jurisdiction | Empty / unset | Only if the company wants them published |
| Nine people | Roles only. `name` is null. `isPublished` is false | Name, photo permission, and a decision that the portrait matches that person |
| Portraits 01–04 | Owner-supplied, identity not confirmed. May be the same person | Written confirmation per seat |
| Portraits 05–09 | Illustrative | Replace or explicitly approve as non-employee artwork |
| 18 collaboration scenes | AI-generated illustrations | Keep the illustrative label, or replace with real photos |
| Case studies | Six sample markdown files, not published | Client-approved problem, role, approach, and outcomes |
| Insights | Six demonstration drafts, not published | Editorial review, then set `demonstration: false` and `draft: false` |
| Privacy and terms | Templates, both `noindex` | Counsel review, legal entity, and a real last-updated date |
| Social profiles | Empty, so the icons stay hidden | Real profile URLs only |
