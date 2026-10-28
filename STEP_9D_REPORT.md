# Step 9D report

Contact page: trustworthy inquiry UX, validation, accessibility, and responsive layout. Delivery stays unconfigured. The site was not deployed.

## 1. Executive summary

Step 9D is complete. `/contact` is a validated inquiry draft. The public mode is **unconfigured**.

The button says “Copy inquiry”. A successful copy says “Inquiry copied. No message has been sent.” The page never says a message was sent while the endpoint is empty. No domain, business email, or delivery endpoint was configured.

Final checks on this tree: `npm test` 20 passed, `npm run check` 0 errors / 0 warnings / 91 hints, `npm run build` 35 HTML pages and 31 sitemap URLs, `npm run test:e2e` 8 passed. Browser checks at 320, 375, 768, 1024, and 1440 found no horizontal page overflow, including at 200% root text size.

## 2. Existing contact architecture

Route: `/contact` from `src/pages/contact.astro`.

Form: `src/components/forms/ContactForm.astro`.

Rules: `src/utils/inquiry.ts`.

Styles: `src/styles/global.css` (field, error, required marker, draft, consent, focus).

Config, unchanged: `src/data/site.ts` reads `PUBLIC_FORMSPREE_ENDPOINT`, `PUBLIC_CONTACT_EMAIL`, `PUBLIC_SITE_URL`, and `PUBLIC_BOOKING_URL`. `src/data/defaults.ts` still supplies the placeholder email and site URL.

Also inspected: `src/components/layout/Header.astro`, `src/components/layout/Footer.astro`, `src/components/sections/ServiceDetail.astro`, `src/components/sections/CtaSection.astro`, `src/pages/services/[slug].astro`, `src/components/portfolio/CaseStudy.astro`, `docs/contact-delivery.md`, `STEP_7_REPORT.md`, `STEP_8F_REPORT.md`, `tests/unit/inquiry.test.ts`, `tests/e2e/smoke.spec.ts`.

There is one contact form. No second contact page was added.

## 3. Before-state audit

Recorded before this step, from the Step 7 and Step 8F reports and the form that was already in the repo:

- Fields were full name (`name`), email (`email`), company (`company`), project type (`service`), estimated budget (`budget`), expected timeline (`timeline`), project description (`message`), and privacy consent (`privacy`). Budget and timeline were required selects, including “Not sure yet”.
- Validation already rejected blanks, moved focus to the first invalid field, used a honeypot, and kept `data-delivery="unconfigured"` while `PUBLIC_FORMSPREE_ENDPOINT` was empty.
- The primary fallback label was “Open in email”. Step 7 recorded that this opened the visitor’s mail app with the configured address, which was still the placeholder, so it was not a working inbox.
- Step 7 had already hidden a visible `mailto:` for that placeholder on the footer, contact page, and privacy page. The mail-app button was the remaining misleading action.
- Service “Discuss…” links went to `/contact` without selecting a project type, even though an alias map existed.
- Step 8F: the contact end-to-end test failed once waiting for `#full-name-error` after “Open in email”, then passed on rerun. The snapshot already contained “Enter your full name.” The form was not changed in that step.

Endpoint value at the start of this step, and still: empty. The placeholder mailbox string was left in configuration and is not repeated here as a destination.

## 4. Scope guardrails

Not changed:

- `PUBLIC_SITE_URL`, DNS, hosting, and deployment.
- `PUBLIC_CONTACT_EMAIL` and the placeholder in `src/data/defaults.ts`.
- `PUBLIC_FORMSPREE_ENDPOINT` and `.env`.
- Privacy Policy and Terms copy.
- Package versions and dependencies.
- The six published case studies, their images, and their publication flags.
- The nine named team profiles, portraits, and gallery.
- The twelve Insights drafts and their approval flags.
- Analytics. None were added.

## 5. Contact page hierarchy

Before: the side notes sat above the form on small screens, and the action could be read as opening email.

After:

1. H1 about discussing a product or software project, plus a short intro that a budget or timeline can wait.
2. On small screens the form comes first. From 1024px up, the side column stays on the left and the form on the right.
3. The delivery notice is inside the form card, before the fields.
4. Side notes: what helps, the honest inbox state, and privacy with links to `/services`, `/portfolio`, and `/process`.
5. Empty location, social, and booking blocks stay hidden.

The dark and purple surfaces are the existing tokens (`#090713`, `#151027`, `#1C1533`, `#8B5CF6`, `#C084FC`, `#F8F7FF`). No new palette was introduced.

## 6. Final fields and validation

Required:

- Full name: trim, at least 2 characters. Error: “Enter your full name.”
- Email: trim, no spaces, at most 254 characters, practical `local@domain.tld`. Plus-addresses such as `ada+ops@client.test` pass. Error: “Enter a valid email address.”
- Company: trim, at least 2 characters. Error: “Enter your company name.”
- Project type: must be one of the nine listed options. Error: “Select a project type.”
- Project description: trim, at least 20 characters. Error: “Describe the project in at least 20 characters.”
- Privacy consent. Error: “Confirm the privacy notice to continue.”

Optional:

- Budget and timeline. Blank is allowed. A value that is not in the list is rejected. Blank values are omitted from the copied text.

Errors are written only after an attempt. Editing a field clears that field’s error and leaves the other answers in place. Messages do not say the inquiry was sent, delivered, or received.

Budget and timeline were made optional so the form does not demand a budget before a conversation exists.

## 7. Delivery state

`planDelivery` in `src/utils/inquiry.ts` returns one of:

- `blocked` — honeypot filled, or a real endpoint submitted sooner than 1200ms. Unconfigured copy is not delayed by that timer. Honeypot status: “This inquiry was not copied.” Fast configured submit: “The message was not sent. Wait a moment and try again.”
- `unconfigured` — endpoint missing, not `http`/`https`, `mailto:`, or a host of `example.com` / `example.org` (including `www`).
- `provider` — a real `http` or `https` URL after the short wait.

`providerOutcome` returns `confirmed-success` only when `ok` is true, status is 200–299, the request was not aborted, and `payload.ok` is not `false`. Anything else is `recoverable-error`.

Current production HTML has an empty `data-endpoint`, `data-delivery="unconfigured"`, and no form `action`. The success panel (“Message submitted”) stays hidden. A failed future send would keep the answers and say “We could not confirm delivery. Your answers are still in the form. No message was sent.” There is no automatic retry.

## 8. Placeholder email and mailto

The contact page Email card does not render a `mailto:` while the address is a placeholder. The built `/contact` HTML contains zero `mailto:` links, zero `hello@example.com`, and zero “Open in email”.

The footer already hid the placeholder and was left on that rule. Privacy still uses its existing conditional and was not edited. The configuration string was not changed.

`isConfiguredEndpoint` rejects `mailto:` and `https://example.com/...`, so those values cannot become a provider send.

## 9. Copy inquiry

Unconfigured button label: “Copy inquiry”. It is `type="button"`.

Status after a valid click and a successful clipboard write: “Inquiry copied. No message has been sent.”

Copied text is plain lines, in this order: Name, Email, Company, Project type, then Budget and Timeline only if filled, then a blank line and the description. It omits the honeypot, `_subject`, the endpoint, the page URL, and the placeholder address.

The copy runs only after that click and only after validation passes. It does not run on page load or on each keystroke.

If a real endpoint is present later, the same button slot says “Send message” and is `type="submit"`. That branch is not active in this build.

## 10. Clipboard success and failure

Success hides the draft box and sets the status above. Failure sets the status to “Copy wasn't available in this browser; select and copy the text manually.” and shows `#inquiry-draft` as a read-only textarea. The draft is assigned with `.value`, not HTML. The failure path does not say the inquiry was copied.

The end-to-end test grants clipboard write, checks the status and the clipboard text, then replaces `writeText` with a rejection and checks the failure sentence and the draft. No POST was recorded. The success panel stayed hidden.

## 11. JavaScript disabled

The delivery notice is in the static HTML, so it is present without JavaScript. The noscript line says copying needs JavaScript and that the page still does not send the form.

The built form has `method="post"` and no `action`. The only inquiry button is `type="button"`, so a click does not navigate or POST. Copying itself needs JavaScript. Navigation links still work.

## 12. Sanitation, honeypot, and privacy

- Prefill rejects values that contain `<` or `>`.
- The fallback draft is a textarea value, so visitor text is not inserted as HTML.
- The honeypot is `aria-hidden`, `tabindex="-1"`, and visually removed. It is not in the copied text. Filling it blocks the action and does not show success.
- Inquiry fields are not written to `localStorage`, cookies, the query string, or the console.
- No new tracker, CAPTCHA, or webhook was added.
- The privacy card states that, with no endpoint, the form does not submit details to Vortex Digital. It does not claim encryption or a certified policy. Legal pages were not rewritten.

## 13. Query prefill

`resolveServicePrefill` maps the eight service slugs, and a few existing titles, onto the project-type options. Unknown values, empty values, and markup-like values become an empty select.

Service hero buttons and the service-page closing action use `/contact?service=<slug>`. Portfolio actions stay `/contact` without a query so they do not invent a type.

Confirmed in the end-to-end test: Web Application and QA & Testing select the right option. `/contact?service=%3Cscript%3Ealert(1)%3C/script%3E` leaves the select empty.

## 14. Accessibility

Checked in the built page and in Chrome, not certified as WCAG.

- One H1. Side headings are H2.
- Labels are tied to controls with `for`/`id`. Required and optional are text, not color alone.
- Errors use `#id-error`, `aria-invalid`, and `aria-describedby`. The invalid border is rose and the message is text.
- One live region, `[data-form-status]`, `aria-live="polite"`. The static notice is not a second live region. Copy success is not announced as “sent”.
- Focus outline is the existing 2px solid lavender. Measured on the name field: `outline-style: solid`, `outline-width: 2px`.
- Tab from the name field lands on email and skips the honeypot.
- Inputs use `autocomplete="name"` and `autocomplete="email"`. The page does not autofocus a field.
- The copy button is 48px tall. Inputs are at least 48px tall. The textarea can be resized vertically.
- Sampled contrast: muted text `#A7A0BD` on `#090713` is 8:1. Error text `#FECDd3` on the card `#1C1533` is 12.36:1. Notice and required marker `#DDD6FE` on the page background is 14.38:1. Primary text `#F8F7FF` on `#090713` is 18.77:1.
- Header is sticky. The H1 starts below it (about 280px versus a 73–74px header). Focused fields use the existing `scroll-margin-top`.
- Reduced motion was already honored by the site stylesheet. The form adds no animation.
- At 200% root font size the page reflows without a horizontal scrollbar. At 320px and 200%, the large title breaks inside long words so the line fits. That is readable as letters, and it is rougher than the normal-size heading. See section 15.

## 15. Responsive checks

Production preview of the final build. Chrome. No horizontal overflow means `scrollWidth` equaled `clientWidth`.

| Width | Normal text | 200% root text | Layout |
| --- | --- | --- | --- |
| 320 | No overflow. Header 74px. One H1. | No overflow. | Form first, side notes below. |
| 375 | No overflow. Header 74px. | No overflow. | Form first. Name and email stack. |
| 768 | No overflow. Header 74px. Menu button shown. | No overflow. | Form first. Paired fields. |
| 1024 | No overflow. Header 73px. Desktop nav and “Let’s Talk” on one row. | No overflow. Header wraps instead of spilling. | Side notes left, form right. |
| 1440 | No overflow. Header 73px. | No overflow. | Side notes left, form right. |

Invalid state at 375: errors under the fields, rose borders, no overflow, button still 48px. The focused name field was not covered by the header.

## 16. Screenshots

Captured from the preview. Final width shots and the error shot match the final build:

- `docs/contact-qa/contact-320.png`
- `docs/contact-qa/contact-375.png`
- `docs/contact-qa/contact-375-errors.png`
- `docs/contact-qa/contact-768.png`
- `docs/contact-qa/contact-1024.png`
- `docs/contact-qa/contact-1440.png`
- `docs/contact-qa/contact-320-200.png` (320px at 200% text, overflow 0)

Earlier shots from the same QA pass, `contact-1440-focus.png`, `contact-375-action.png`, and `contact-375-copy-button.png`, were taken before the last reflow CSS. The final width files above supersede them for layout.

## 17. CTA audit

These resolve to the real contact page:

- Header and mobile menu: “Let’s Talk” → `/contact`
- Footer: “Start a project” → `/contact`
- Homepage: “Start Your Project” → `/contact`
- About, process, services index, portfolio index, team index, and the 404 page: existing contact actions → `/contact`
- Case studies: `/contact` (Born To Rock’s “Discuss Your Game” was asserted in the end-to-end test)
- Each service page: hero and closing action → `/contact?service=<slug>`

The service closing sentence now says the contact page lets the visitor prepare the inquiry and does not send it until delivery is configured. Button labels were not renamed.

## 18. Files changed

- `src/utils/inquiry.ts` — validation, prefill, plain-text draft, and the delivery decision.
- `src/components/forms/ContactForm.astro` — notice, copy action, errors, clipboard fallback, and the inactive provider branch.
- `src/pages/contact.astro` — hierarchy, honest inbox card, form first on small screens.
- `src/pages/services/[slug].astro` and `src/components/sections/ServiceDetail.astro` — service prefill links and an honest closing sentence.
- `src/styles/global.css` — invalid border, required marker, draft field, wrapping consent, and title wrap.
- `src/components/layout/Header.astro` — header can wrap at large text instead of overflowing.
- `src/components/layout/Footer.astro` — columns can shrink, and the gap no longer forces a sideways scroll at large text.
- `docs/contact-delivery.md` — copy does not send; the endpoint must be a real `http`/`https` URL.
- `tests/unit/inquiry.test.ts` — inquiry rules and publication guards.
- `tests/e2e/smoke.spec.ts` — copy, clipboard failure, prefill, and no POST.
- `docs/contact-qa/` — screenshots listed in section 16.
- `CONTACT_PAGE_REVIEW.md` and `STEP_9D_REPORT.md` — this review.

## 19. Unit tests

`npm test` (`node --test tests/unit/*.test.ts`).

Covered: complete inquiry with empty budget and timeline; whitespace and missing fields without delivery language; practical email; unknown service and script prefill; draft order and exclusions; honeypot and fast provider block; empty, `mailto:`, and `example.com` stay unconfigured; a real `https` URL becomes `provider`; 2xx versus `payload.ok: false`, HTTP 500, and abort; six approved studies, nine names, and twelve unpublished Insights files.

First run after the inquiry model: 20 passed, 0 failed. Final run after the layout CSS: 20 passed, 0 failed. No test failed in this step.

## 20. Astro check

`npm run check`.

First run: 0 errors, 0 warnings, 91 hints. Final run after the layout CSS: the same, “Result (73 files): 0 errors, 0 warnings, 91 hints.”

Each hint is the existing `z` deprecation in `src/content.config.ts` (`ts(6385)`). The checker prints those lines as warnings and then counts them as hints. Dependencies were not changed to hide them.

## 21. Build

`npm run build` completed successfully on every run in this step, including the final one. Each reported **35 page(s)**.

`dist/sitemap-0.xml` has **31** `<loc>` entries. `dist` contains **35** HTML files. `/contact/index.html` contains “Copy inquiry”, the won’t-send notice, and the noscript line. It does not contain `mailto:`, “Open in email”, `hello@example.com`, or a form `action`.

## 22. End-to-end tests

`npm run test:e2e` (`playwright test`), Chromium, against the production build.

The contact test checks the title, one H1, the unconfigured notice, zero mailto links, the copy button, the exact name error and focus, no success panel, error clearing, honeypot skipped by Tab, clipboard text, no POST, clipboard rejection plus the draft, a rejected script prefill, and two service CTAs. It uses invented test data only.

An earlier run, before the small-screen column reorder, passed 8 tests. The final run, after every layout edit, passed 8 tests in 1.2m. The contact test passed in 11.0s. There was no failed run and no retry.

The public page has no endpoint, so the browser test does not call a form host. Provider success and failure are covered in unit tests with response shapes, not a live request. A mocked browser POST of a configured endpoint was not added, because this build does not render that branch.

## 23. Historical contact-field flake

Step 8F timed out once waiting for `#full-name-error` after “Open in email”, then passed on rerun. The error text was already in the snapshot.

That path is gone. The button is “Copy inquiry”. The test waits for the exact string “Enter your full name.” and for focus on `#full-name`. The final contact test passed on its first run in 11.0s. The flake was not reproduced.

## 24. Portfolio regression

The six public studies are unchanged and still approved, not samples: ScaleUp Systems, MedaStaré, Gain Energy / Upstrima, GoWabi, Daniela Diamonds, Born To Rock. The portfolio page still shows them in that order. Sample routes still 404. Unit and end-to-end tests both assert this. Case-study copy and flags were not edited.

## 25. Team and Insights regression

Nine named profiles remain, in role order, with their portraits: Don Tran, Joshua Mendoza, Lin Jiayi, Pongsak Rattanakul, Dmytro Melnyk, Carlo Garcia, Matheus Pereira, Adrian Cruz, Sofia Vasylivna Melnyk. Adrian’s external employment stays separate. Team files and portraits were not edited.

Twelve files in `src/content/blog` still have `publicationApproved: false` and are not `status: published`. The public Insights page stays empty. Article routes stay off the production site. The end-to-end test asserts that.

## 26. Exclusions preserved

- Domain, DNS, canonical host, and `PUBLIC_SITE_URL` were not set or changed. The placeholder origin remains.
- Business email and the mailto configuration value were not changed.
- `PUBLIC_FORMSPREE_ENDPOINT` was not set. No Formspree, Resend, SMTP, or webhook account was created. No live submission was sent.
- Hosting was not changed. The site was not deployed.
- Privacy and Terms were not edited.
- No analytics were added.
- `package.json` versions were not changed. The package name is still `velora-website`.

## 27. Open risks and later owner testing

No message was delivered by this step. The success panel must stay unused until a real endpoint answers.

Later, and not in this step, a working channel needs:

- An owner-approved `http` or `https` form URL in `PUBLIC_FORMSPREE_ENDPOINT`.
- A real inbox behind that service.
- A rebuild with those variables, then a real test message that arrives.
- Only then should “Message submitted” be treated as delivery.

Still pending, not done here:

- Legal review of Privacy and Terms.
- A manual screen-reader pass.
- The 320px, 200% title breaks long words so the line fits. Normal sizes wrap on spaces.
- The configured send branch is unit-tested, not exercised in the browser, because the public build has no endpoint.

Step 9E was not started.
