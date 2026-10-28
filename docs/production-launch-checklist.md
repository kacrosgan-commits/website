# Production launch checklist

Do not point a custom domain at this site until the boxes that require a person are done. Code and local checks are not go-live approval.

## Repository

- [x] Static Astro build writes to `dist`.
- [x] `public/_headers` sets nosniff, referrer policy, frame denial, permissions policy, HSTS, and a content security policy.
- [x] `.env.example` lists public settings and contains no secrets.
- [x] GitHub Actions workflow `.github/workflows/release-checks.yml` runs unit tests, `astro check`, the production build, and Playwright.
- [ ] Push the repository to the host that will deploy it. This workspace was not deployed.

## Cloudflare Pages

- Output directory: `dist`.
- Build command: `npm run build`.
- Node.js: 24.21.0 (see `.nvmrc`).
- Environment variables, set in the host, not in git: `PUBLIC_SITE_URL`, `PUBLIC_CONTACT_EMAIL`, `PUBLIC_FORMSPREE_ENDPOINT`. Leave `PUBLIC_BOOKING_URL` empty unless a real scheduler exists.
- Confirm the `_headers` file is applied on a preview deployment before changing DNS.
- HSTS is present. Enable it only on the HTTPS hostname.

## Before DNS cutover

- [ ] Replace the placeholder brand, domain, and email in the environment.
- [ ] Create the Formspree form and set `PUBLIC_FORMSPREE_ENDPOINT`.
- [ ] Send one real test inquiry and confirm it arrives.
- [ ] Have counsel replace the privacy and terms templates, then remove `noindex` from those pages and put them back in the sitemap filter in `astro.config.ts`.
- [ ] Approve or replace team portraits and set `isPublished` only for approved people.
- [ ] Add client-approved case studies by setting `sample: false` on a real markdown file.
- [ ] Decide whether `/team/gallery` stays a noindex review page. It should, until the imagery is honest to show customers as photography of this company.
- [ ] Explicit go-live approval from the site owner.

## Commands

```bash
npm ci
npm test
npm run check
npm run build
npm run test:e2e
npm run preview -- --host 127.0.0.1 --port 4321
```
