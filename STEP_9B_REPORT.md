# Step 9B Report — Named team profiles

All nine owner-approved profiles are published. Each page uses the existing role slug, the supplied name, and the designated portrait. The six portfolio case studies were not edited. The site was not deployed.

## Scope

This step names the nine existing seats, publishes their owner-supplied biographies, and installs the eight replacement portraits. Don Tran's existing Founder & CEO portrait and thumbnail were left in place. Collaboration scenes stay illustrative and unlabeled as photographs of these people.

`isPublished` is true for all nine. `identityVerified` on each portrait means the agency owner assigned that photograph to that profile. It does not mean a third party identified the person from the pixels.

## The nine profiles

| Slug | Name | Role | isPublished | Portrait owner-assigned |
| --- | --- | --- | --- | --- |
| founder-ceo | Don Tran | Founder & CEO | true | true |
| cofounder-cto | Joshua Mendoza | Co-Founder & CTO | true | true |
| cfo | Lin Jiayi | CFO | true | true |
| project-manager | Pongsak Rattanakul | Project Manager | true | true |
| senior-fullstack-developer | Dmytro Melnyk | Senior Full-Stack Developer | true | true |
| ai-engineer | Carlo Garcia | AI Engineer | true | true |
| mobile-app-developer | Matheus Pereira | Mobile App Developer | true | true |
| uiux-product-designer | Adrian Cruz | UI/UX & Product Designer | true | true |
| qa-devops-engineer | Sofia Vasylivna Melnyk | QA & DevOps Engineer | true | true |

`projectIds` is empty for every person. No social links were supplied, so none are shown.

## Portraits

Previous files for the eight replacements were copied to `backups/team-portraits-pre-9b/<slug>/` before overwrite. Public paths stayed `/assets/team/<slug>/portrait.webp` and `portrait-thumb.webp`.

| Person | Public portrait | Dimensions | Thumb | Notes |
| --- | --- | --- | --- | --- |
| Don Tran | `public/assets/team/founder-ceo/portrait.webp` | 768×768 | yes, 384×384 | File unchanged. SHA-256 `f3fdb05108d137608dd7370d43a3653579d1717895ac566ae1fd196930e0a204` |
| Joshua Mendoza | `.../cofounder-cto/portrait.webp` | 1254×1254 | yes, 480×480 | Pack original SHA-256 `f6fda01fa4c58870c733c89816ba0a2da1d39ffb16381a41cffad74de3745f3a` |
| Lin Jiayi | `.../cfo/portrait.webp` | 1254×1254 | yes, 480×480 | `71f41594cf6e02bb4a6808061943208bbd93fca4517bb4fde781f052ab0dc8f0` |
| Pongsak Rattanakul | `.../project-manager/portrait.webp` | 1254×1254 | yes, 480×480 | `cd0657f032066802e8d138ad53ec43e11d1ac5b2a9664cb42febd13ab620fe7a` |
| Dmytro Melnyk | `.../senior-fullstack-developer/portrait.webp` | 1254×1254 | yes, 480×480 | `3628b662395ab68f9d683e164d13dfac9122e8df00d5b2217206231496b4decd` |
| Carlo Garcia | `.../ai-engineer/portrait.webp` | 1448×1086 | yes, 480×360 | `0a39f5600c04019de9e6d94627eedc0a20e4fef25b36bf9c2f4f8ea797fb6106` |
| Matheus Pereira | `.../mobile-app-developer/portrait.webp` | 1254×1254 | yes, 480×480 | `1150a588de7c5079494d06cb54078d07f4b3448ba1b6b05a3a2eac962c77cdd6` |
| Adrian Cruz | `.../uiux-product-designer/portrait.webp` | 1254×1254 | yes, 480×480 | `43c6138bbe49f774bc615e1d9156d9eaacdef694c415e1c87a4432e8f6690864` |
| Sofia Vasylivna Melnyk | `.../qa-devops-engineer/portrait.webp` | 1254×1254 | yes, 480×480 | `985fa025fe2e79c5365fe4c16cacc0d61f7b463972e09b7d452be083c655fca2` |

The eight original PNGs have distinct SHA-256 hashes. Adrian's public WebP and Matheus's public WebP also differ. Don's thumbnail already existed, so none was generated.

Carlo's source file in the pack manifest is named `ChatGPT Image Aug 17, 2026, 03_16_27 PM (1)(4).png`. This step did not regenerate, retouch, or swap that file. The square frame uses the existing `object-fit: cover` crop. At 1440px and 375px the rendered portrait still shows the full head. No per-person `object-position` override was added.

`ASSET_MANIFEST.json` now marks the nine portraits `identityVerified: true` and records the new dimensions. Work-scene records stay `identityVerified: false`. `approvedForFactualEmployeeClaims` stays false.

Alt text follows `Portrait of {name}, {role} at Vortex Digital`.

## Public biographies

Each profile has a short card line, two biography paragraphs, the owner-supplied experience line, current responsibilities, and the confirmed expertise tags. Wording below is the public summary, not a second biography.

- **Don Tran** — 9 years in software engineering. Founder and CEO. Previously a Senior Software Engineer. Leads technical strategy, project oversight, startup client work, the engineering team, and architecture decisions. Expertise: backend systems, SaaS products, AI solutions, technical strategy, software architecture.
- **Joshua Mendoza** — 10 years in software engineering. Co-founder and CTO. Previously a Senior Software Engineer and Technical Lead. Leads architecture, engineering execution, development teams, cloud infrastructure, DevOps, and code review with the CEO. Expertise: full-stack development, cloud architecture, backend systems, DevOps, engineering leadership.
- **Lin Jiayi** — 8 years in corporate finance. CFO. Previously a Financial Analyst and Finance Manager. Covers financial planning, budgeting, cash flow, project profitability, reports, and financial decisions with the CEO. Expertise: corporate finance, financial planning, budgeting, cash flow management, project profitability.
- **Pongsak Rattanakul** — 8+ years in project management. Has led cross-functional teams as Project Manager and Senior Project Manager, and has held Project Manager and Scrum Master roles at Vortex Digital, using Scrum, Kanban, and hybrid Agile delivery. Current work is Agile planning, stakeholder coordination, risk mitigation, and team delivery. No budgets or success rates were added.
- **Dmytro Melnyk** — 15+ years in web software development. Magento 2 / Adobe Commerce, headless commerce, PHP, TypeScript, Next.js, Node.js, GraphQL, BFF, MySQL, and API integrations. Previously Senior Software Developer and Engineering Competence Lead. Current work is full-stack applications, commerce implementations, integrations, review, performance, security, and mentoring.
- **Carlo Garcia** — 9 years in software engineering, including 4 in AI and machine learning. Previously Python Developer and Machine Learning Engineer. Current work is AI applications, LLM integrations, RAG pipelines, AI agents, vector databases, and production deployment with backend engineers. Expertise: Python, PyTorch, LangChain, LLMs, RAG, vector databases, AI agents.
- **Matheus Pereira** — 8 years in iOS and Android development. Previously Mobile Developer and Senior Mobile Engineer. Current work is Flutter apps, native iOS and Android features, APIs, Firebase, performance, and bug fixes. Expertise: Flutter, Dart, Swift, Kotlin, Firebase, REST APIs, mobile performance.
- **Adrian Cruz** — Years of experience were not supplied and are not shown as a number. Vortex Digital responsibilities are user research, usability studies, interface evaluation, and design improvements with designers, developers, and product managers. The page says the agency has not established an exclusive or full-time arrangement. Cepheid (Human Factors Engineer since May 2023), UEGroup, San José State University, the MS in Human Factors and Ergonomics, and the BA in Psychology from California State University, Fullerton, sit in a separate “Previous and external experience” section and are labeled as not Vortex Digital work. No Figma or visual-system claim was added.
- **Sofia Vasylivna Melnyk** — 7 years in software QA and DevOps. Previously QA Engineer and DevOps Engineer. Current work is manual and automated tests, Playwright, Selenium, CI/CD, Docker, GitHub Actions, AWS, deployment monitoring, and production issues. 

## What changed, and why

- `src/data/team.ts` — names, bios, responsibilities, expertise, experience, publication flags, portrait alt text, and stronger illustrative captions on work scenes.
- `src/components/cards/TeamCard.astro` — named heading, role, summary, and expertise tags. The unverified-portrait badge is hidden on published profiles.
- `src/components/team/TeamProfile.astro` — published pages read as biographies. Current responsibilities stay separate from Adrian's external employers. Work scenes stay labeled illustrative.
- `src/pages/team/index.astro`, `src/pages/team/[slug].astro`, `src/pages/team/gallery.astro` — directory copy, name-and-role titles, and gallery labeling. Gallery remains `noindex`.
- `src/pages/index.astro` — the compact role strip now shows name and role. The featured-work section was not changed.
- `src/pages/about.astro`, `src/data/about.ts` — the team block is four leaders (Don, Joshua, Lin, Pongsak) plus “Meet all nine”. It is not a second nine-card directory. The existing company story was not rewritten into a new origin claim.
- `ASSET_MANIFEST.json` — portrait metadata only.
- `tests/unit/team.test.ts`, `tests/e2e/smoke.spec.ts` — publication, order, unique portraits, Adrian/Matheus separation, Don's preserved file, names, alts, sitemap, and gallery `noindex`.
- `TEAM_CONTENT_REQUIRED.md` — published facts versus what is still unknown.
- `public/assets/team/<slug>/portrait.webp` and `portrait-thumb.webp` for the eight replacements.

## Pages

- `/` — compact nine-person strip in role order, with the matching thumb, name, and role. Portfolio cards are still the six approved studies.
- `/team` — nine cards, each with that person's portrait, name, role, summary, expertise tags, and profile link.
- `/team/<slug>` — one H1, the person's name. Title pattern: `{Name} — {Role} · Vortex Digital`. Meta description includes the name and role. No `noindex`. Canonical still uses the existing site URL helper.
- `/about` — four leadership cards and a link to all nine. The design-scene image remains captioned as an illustrative scene, not as Adrian.
- `/team/gallery` — 27 images. Portrait captions say the photo is owner-assigned. Scene captions say they are not photographs of a named employee and not a group photo. `noindex` remains.

Open Graph title, description, and image use the existing layout. The image is the profile portrait.

## Sitemap and robots

`dist/sitemap-0.xml` has 31 URLs, up from 22 in Step 8F. The nine profile URLs are included. `/team/gallery` is not. Sample case studies are not. The host is still `https://example.com` from the existing `PUBLIC_SITE_URL` placeholder. No new domain constant was added.

Published profiles omit the robots meta tag. The gallery meta is `noindex, follow`.

## Collaboration scenes

`work-01.webp` and `work-02.webp` were not replaced and are not described as events or as pictures of the named staff. Captions say “Illustrative scene, not a photograph of a named employee or a documented company event.” Gallery copy says the nine people are not shown together in a group photograph.

## Responsive check

Chrome against `http://127.0.0.1:4321` at 375, 768, 1024, and 1440.

Routes: `/`, `/about`, `/team`, all nine `/team/<slug>` pages, `/team/gallery`, `/portfolio`, `/contact`.

No horizontal overflow. No image with `naturalWidth` 0 on those routes. The team cards at 1440px show nine distinct names and nine distinct portrait URLs. Square frames are 411×411 there. Carlo's natural size is 1448×1086 and the frame keeps the head. Don, Adrian, and Matheus portraits were inspected as rendered images; Adrian and Matheus are different photographs, and Don's portrait is the previous founder image.

## Tests

`npm test` — first run of the new team assertions failed (2 failed, 10 passed). The assertions sliced the wrong region of `src/data/team.ts`, including a related-role mention of Adrian's slug and looking for alt text that is built in a function. The assertions were corrected. The rerun passed 12 of 12, including the two team tests. Exit 0.

`npm run check` — exit 0. 0 errors, 0 warnings, 87 hints (existing `z` deprecation hints).

`npm run build` — exit 0. 35 pages, the same count as Step 8F. Team routes already existed; publishing them did not add HTML pages. It did add the nine profiles to the sitemap.

`npm run test:e2e` — 7 passed, 0 failed, about 1.0 minute, exit 0. The team test checks all nine names on `/team`, the portrait path and alt on each profile, Adrian's external section, previous/next navigation, gallery image count, and the absence of “Name pending”. The sitemap test checks that named profiles are included and the gallery is not.

## Portfolio, Insights, and configuration

The six published case studies, their copy, slugs, approval flags, home order, and screenshot paths were not modified. Sample studies stay unpublished. Insights drafts stay unpublished.

Not changed: domain, `PUBLIC_SITE_URL`, DNS, business email, mailto settings, Formspree or contact delivery, booking URLs, hosting, deployment, package manager, and environment files. Legal copy was not edited.

## Still unknown

- Professional profile URLs for all nine people
- Any individual's work on a published case study
- Adrian Cruz's employment arrangement with Vortex Digital
- A year count for Adrian
- Employer dates, budgets, or success figures for Pongsak
- Independent verification of a portrait from the photograph itself
- Whether the collaboration gallery should ever be indexed
