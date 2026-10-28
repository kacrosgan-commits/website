# VORTEX DIGITAL — STEP 9D CURSOR AGENT PROMPT
## Contact Page: Trustworthy Inquiry UX, Accessibility, Validation, Responsive Design, and Regression Safety

**Execution mode:** Cursor Agent — edit the **existing** repository, not merely propose a plan. Read this entire prompt, inspect current code, implement all in-scope improvements, run real tests and browser checks, and create `STEP_9D_REPORT.md` in the project root. **Stop after Step 9D.**

---

## 0. Mission, baseline, and strict exclusions

You are working on the existing **Vortex Digital** website built with **Astro 7 + TypeScript + Tailwind CSS v4**. Its visual identity is premium, cinematic **dark + purple**; reference the site's existing design tokens/components instead of guessing a new palette. Its clients are primarily **startups**. The eight services are **Web Development, Mobile Apps, AI Solutions, SaaS Development, Backend & APIs, Cloud & DevOps, UI/UX Design, and QA & Testing**.

**Step 9D mission:** Improve the existing `/contact` page and contact-form user experience so it is attractive, clear, accessible, responsive, honest about delivery status, safe with personal information, and fully tested. Optimize the user's journey from service pages, case studies, and other existing CTAs to an inquiry. This is **not** permission to enable or simulate contact delivery.

**Owner's explicit instruction: skip domain and business email.** These are hard boundaries:

- **No deployment**. Do not change hosting, DNS, domain purchase, `PUBLIC_SITE_URL`, canonical host (`https://example.com` is a known placeholder), production environment, or serverless infrastructure.
- **No business email setup.** Do not invent or substitute an inbox, change existing mailto configuration values, add a new company email, or use `hello@example.com` as a real destination. Existing placeholder strings may remain in configuration files for a later step, but must never be presented as a working public inbox or as the recipient of an actual message action.
- **No new contact delivery integration.** Do not register/configure Formspree, Resend, SendGrid, SMTP, Zapier, CRM, webhook, server endpoint, or another form service. Do not set `PUBLIC_FORMSPREE_ENDPOINT`, change `.env` files, or run a live submission. Preserve the existing optional endpoint integration code *if present*; improve only its user-facing safety/validation as needed without configuring it.
- **Do not pretend to send.** Do not display “Message sent”, “We'll get back to you”, “We've received your message”, or a success check for an unconfigured action. Opening an email composer, copying a message, or validating inputs is not delivery.
- **No invented claims.** No fabricated office locations, business hours, reply-time guarantees, social profiles, phone numbers, testimonials, client logos, case-study metrics, appointment booking links, security/compliance certifications, or contact details. Do not claim live support or 24/7 availability.
- **No expansion into unrelated work.** Preserve the approved six portfolio case studies, nine named team profiles, eight service pages, twelve unpublished Insights drafts, all publication controls, and approved images. Do not change their copy or flags. Do not alter privacy/terms legal wording without explicit owner approval. No dependency or global toolchain upgrades.

**Known repo history (verify against source):** Step 9C reported **35 production HTML pages**, **31 sitemap URLs**, **16 passing unit tests**, **8 passing E2E tests**, **12 unpublished Insights drafts, zero published**. `/contact` exists. Step 7 reported that `src/components/forms/ContactForm.astro` already supports validation, moves focus to the first invalid field, has a spam honeypot, and shows an **unconfigured** delivery state until `PUBLIC_FORMSPREE_ENDPOINT` is supplied. The legacy fallback button has read **“Open in email”**; previous reports warned that any fallback destination like `hello@example.com` was a placeholder, not a working mailbox. In Step 8F the contact E2E test failed once on a transient error-message wait and passed on rerun. Treat these as **reported findings, not code facts**: inspect the actual repository to understand how it works today.

---

## 1. Repository reconnaissance — inspect before editing

First read these files if present: `STEP_7_REPORT.md`, `STEP_8F_REPORT.md`, `STEP_9B_REPORT.md`, `STEP_9C_REPORT.md`, `INSIGHTS_CONTENT_REVIEW.md`, `docs/contact-delivery.md`, `FINAL_CONTENT_REQUIREMENTS.md`, `WEBSITE_COMPLETION_STATUS.md`, and `package.json`.

Locate and inspect the **actual** implementations. Likely locations include:

- `src/pages/contact.astro`
- `src/components/forms/ContactForm.astro`
- `src/styles/global.css`
- `src/pages/index.astro`, `src/pages/about.astro`, service pages, portfolio case study CTAs, shared header and footer
- `src/data/services.*`, form utilities/data/config, layout/SEO helpers, assets, tests/unit, `tests/e2e/smoke.spec.ts`

Do not assume those names are current; search and use canonical existing components. Read *all* markup, scripts, handlers, form field names, constraint checks, query-prefill behavior, delivery flags, mailto construction, clipboard behavior, honeypot, success/error states, and E2E selectors before touching anything. Look for any real/pseudo Formspree endpoint, placeholder mailbox, inactive submit button, unsupported promise of response times, falsely active calendar/social links, or duplicate form component.

In `STEP_9D_REPORT.md`, document the **before** state, including actual field names and required/optional flags, current endpoint resolution and delivery mode, visible fallback label, existing validated behaviors, the exact contact CTAs, and any deficiencies. Do not quote or copy private visitor input. Do not start a parallel contact page.

## 2. Contact-page messaging that earns trust without false availability

Keep `/contact` a useful, branded, responsive page with one clear H1 and a concise founder/startup-oriented explanation of how a prospective client can prepare an inquiry. Use site-specific language (web, mobile, AI, SaaS, APIs, DevOps, design, QA) rather than generic agency hype. Preserve already approved company messaging rather than adding fictional promises.

Required information hierarchy, adapted to current layout:

1. Clear page title and succinct purpose (discussing a product or software project).
2. A short note on what information helps scope a project: product goal, platform/service, stage, needs, and optional budget/timeframe *if those fields already exist*; don't demand a budget unnecessarily.
3. A properly labeled contact form with clear required markers, sensible grouping, help text, useful errors, and a transparent description of what the primary action **actually** does.
4. A truthful, unobtrusive **delivery availability notice** when the site has no validated submission destination.
5. Contextual next links to *real existing* `/services`, `/portfolio`, and `/process` routes if they help and fit the current page. Do not add nonfunctional schedule-a-call, external booking, phone, or social buttons.

Don't make the visitor think the agency has received an inquiry unless a verified endpoint responded with a real success. Avoid placing “secure form” or “private/confidential” assertions without an auditable basis. Plain-language privacy messaging may say that with no endpoint the form does not submit data to Vortex Digital, if that is verified in code; do not claim end-to-end encryption or certified compliance.

## 3. Exact delivery-state contract (most important part)

Inspect the current configuration and preserve its optional behavior. Establish **one understandable state model** derived from actual configuration and actual action outcomes; for example `unconfigured`, `ready` (only if existing destination valid), `sending`, `confirmed-success`, `recoverable-error`. Use other names if they match existing code. An existing `data-delivery="unconfigured"` attribute should remain meaningful and testable; do not invent a “connected” state from an email-shaped placeholder.

### When contact delivery is UNCONFIGURED (expected right now)

- Explain **before interaction** that sending through the site is not available. An honest example: **“Online message delivery isn't configured yet. You can draft your inquiry here and copy it, but this site won't send it.”** Adjust wording to match established tone.
- Do **not** attempt `fetch`, XHR, Formspree, mailto, or network submission to an unconfigured, placeholder, empty, or invalid recipient/endpoint. Never contact `hello@example.com` or similar placeholder addresses.
- The primary available action may be **“Copy inquiry”** (recommended) rather than “Send message” or “Open in email” when no real recipient is configured. This is *only* a local user-initiated clipboard operation, not a send. Do not rename a nonfunctional send button “Send”.
- Reuse the existing input fields and validation so a visitor can create a structured draft. Compose the copied text plainly and usefully (label + value), including only filled/legitimate fields. Example sections: name, return email, service, project details, optional budget/timeline. Escape/control formatting as needed; omit honeypot, secrets and unentered fields. Avoid including the origin URL, hidden technical flags, IP, browser fingerprint, or analytics ID.
- Only write to clipboard **on an explicit user's button click** after successful validation; never auto-copy while typing or when the page loads. Show a status such as **“Inquiry copied. No message has been sent.”** Do not present this as agency receipt.
- Handle clipboard API restrictions/failure safely: tell the user **“Copy wasn't available in this browser; select and copy the text manually.”** If implementing an accessible, read-only selectable draft fallback, ensure it is only displayed on that failure / deliberately requested, without leaking via analytics or public URL. Avoid false “copied” notifications.
- If an existing approved real email address is truly configured, retain the existing delivery/email action only as the code already supports, but **do not add or change that address in Step 9D**. If the visible email action would target a placeholder or is not verifiably configured, suppress the action instead of leaving a dead or misleading button. Do not alter the configuration key's value.
- If JavaScript is disabled, the page must still display clear notice that the form is not connected; it must **not** post to a fake endpoint. The basic navigation links remain usable. Prefer progressive enhancement; do not make an unconfigured `<form action>` navigate to itself claiming completion.
- Never persist visitor inquiry fields to `localStorage`, cookies, a server log, query parameters, telemetry, or a third-party resource. Do not log names, emails or message bodies in browser console. Do not load new marketing trackers.

### When an actual contact delivery endpoint is configured in the future

- **Do not configure or test a live endpoint in this step.** Preserve any existing integration contract and its environment variables as-is.
- In code, if feasible without expanding into a backend project, ensure a true success is displayed **only** after a positive response from the configured destination; distinguish network failures, aborted requests, non-2xx responses, and unknown outcome. Keep user-entered data available after failure, and never automatically retry a message that could cause duplicates.
- A simulated/mock HTTP success in E2E may test the configured code branch, but must be clearly a **mock** with no external destination. A mock can test failure too. The public unconfigured production UI remains the default.
- Do not add fabricated expected response times or deliverability guarantees. Avoid mentioning configured delivery in the public UI until the configuration genuinely exists.

## 4. Form design, fields, and useful inquiry preparation

Preserve the current set of fields and meaningful required/optional constraints unless you can justify a minimal fix. Discover existing names and labels rather than rewrite the schema. A common inquiry form may include name, email, service, and message, but do **not** add unsupported fields merely to match this example. Keep owner-provided service labels consistent with the eight real specialties; if an existing project-type alias maps to “QA & Testing”, preserve it.

Improve visual clarity within the existing branded layout: comfortable column width, readable line length, grouped spacing, clear labels and required indicators, accessible select defaults, textarea sufficient for useful descriptions, consistent input heights, visible focus and error styles, responsive action area. Avoid unnecessary animations, heavy backgrounds, floating-label tricks or full-screen popups. Avoid turning the page into a long sales funnel.

Existing CTA links from service and portfolio pages may include a query parameter to preselect a service or suggest a project type; find and preserve that behavior. Validate allowed values against known services, ignore unknown values safely, and avoid populating personal data from query parameters. URL-encoded content must not become script/HTML markup. Do not break backward-compatible CTA paths.

If the existing page includes extra contact cards for email, location, phone or socials, show them **only** when real, already approved, functional data exists; otherwise remove/hide only the misleading display, not valid configured data. Do not manufacture a placeholder destination to complete the visual layout.

## 5. Validation details and helpful error recovery

Inspect and retain existing validation wherever sound. Improve it as needed:

- Required fields are enforced on empty/whitespace-only values. Optional fields are genuinely optional.
- Email validation is practical, not aggressively rejecting uncommon valid addresses. Show examples only as format hints, not fake Vortex Digital addresses.
- Trim leading/trailing whitespace as appropriate; normalize only safe values. Don't silently discard message formatting or impose arbitrary tiny word limits. If the code has min/max lengths, make them consistent with the UI and tests.
- On invalid action, show short, specific field errors next to the relevant inputs, link them with `aria-describedby`, update `aria-invalid`, and move focus to the first invalid field. A concise summary may help; avoid duplicate screen-reader announcements.
- Clear stale errors appropriately when a user fixes a field; do not clear unrelated inputs, erase a message, or show phantom errors before first interaction.
- Handle bad select values, malformed prefill, unusually long text, blank messages, and checkbox states if present. Use native controls/constraints where beneficial while keeping custom accessibility reliable.
- Keep the existing honeypot safe: hidden from assistive tech and keyboard navigation, and not accidentally contributing to copied inquiry. A spam trap must not show as an ordinary required field or reveal fake success.
- Ensure real action buttons use `type="button"` or `type="submit"` appropriately so pressing Enter doesn't unintentionally trigger delivery. If an unconfigured form still has a submit handler, intercept it reliably and route to the truthful local action or instruct the user to use the copy action; do not let it perform a browser POST.
- If any asynchronous path remains, prevent rapid duplicate attempts, restore correct button state, and announce errors without losing entered data. Tests should not require arbitrary sleeps or brittle ordering.

**Specific regression:** Step 8F reported one transient timeout waiting for `#full-name-error` after “Open in email”; its rerun passed. Audit whether the actual form errors are synchronous and deterministic. If the test selector/expectation is brittle, stabilize the behavior/test within Step 9D without masking real defects. Report the first failure and any rerun accurately.

## 6. Accessibility and keyboard behavior

Target practical **WCAG 2.2 AA-aligned best practices**, without claiming certified WCAG compliance. Verify:

- Exactly one meaningful H1 and sensible H2/H3 hierarchy.
- Programmatically associated labels, required instructions, and clear inline errors; invalid state doesn't rely on red color alone.
- Keyboard-only flow through inputs, select, textarea, checkbox (if present), Copy action, and navigation. No focus traps, missing labels or inaccessible custom selects.
- Visible focus indicators with sufficient contrast against the dark/purple surfaces. Preserve the established lavender focus style unless contrast/visibility truly needs a scoped fix.
- Screen-reader-friendly status for copy success/failure and form validation, e.g. a **single** appropriately used `aria-live` region, not an automatically focused toast that jumps around the page.
- Minimum touch target size in the mobile layout, good text contrast, selectable text, logical reading/tab order, `autocomplete="name"` and `autocomplete="email"` where appropriate, and no autofocus that unexpectedly opens a mobile keyboard.
- Zoom/reflow at narrow viewports and 200% text; textarea resizing and clear focus are not blocked.
- Reduced-motion preference respected by any feedback animation; no animation is required for the form.
- A message copied to the clipboard is not silently spoken as “sent”.

Document manual checks; automated smoke passing is not full accessibility certification.

## 7. Responsive and visual refinement

Use the website's existing typography, backgrounds and accents; for context, the established design has included `#090713`, `#151027`, `#1C1533`, `#8B5CF6`, `#C084FC`, `#F8F7FF`, but **read actual CSS tokens first**. Keep professional spacing and hierarchy consistent with other pages.

Visually inspect `/contact` in Chrome/Playwright at **375, 768, 1024, 1440px**. Check wrapping of labels, helper/error messages, select options, form actions, descriptions and notices; no horizontal page overflow; sufficient button touch targets; no sticky/header overlaps; no contrast failures on muted explanatory text. Also check a narrow viewport near **320px** if feasible to catch the weakest layout. Check normal page and invalid-form error state. Use honest screenshots in the repo review report if browser tooling supports them; never invent screenshot files.

If forms are already usable on mobile, retain the shape and polish small details rather than replace it. Avoid oversized cards or hover-dependent content. Layout must still look intentional when the delivery notice is shown and when form errors lengthen fields.

## 8. Honest website-wide contact CTAs

Audit **in-scope links**, not entire-page redesign: homepage CTA, header/footer contact links, service page “Discuss...” CTAs, `/process`, `/about`, team/contact links if present, portfolio case-study CTAs. Verify they resolve to the real `/contact` page and that contextual service prefill still works. Do not imply a click triggers a booking or sends a message. Don't rename all brand CTAs unnecessarily; small wording changes may be warranted *only* if a label materially overpromises active contact delivery.

Do not remove valid internal navigation because the endpoint is not yet configured. Let visitors view the site's service offerings and prepare inquiry text. Never add an unapproved scheduling system or invent a meeting URL. Preserve existing links and slugs for portfolios, team and services.

## 9. Privacy, security, and non-collection boundaries

- No new external API call, analytics integration, session replay, CAPTCHA integration, user tracking, contact database, browser storage, marketing cookie, or webhook.
- Use browser clipboard only after informed user interaction. No automatic reads from clipboard.
- Ensure no personal data in page query strings, analytics event payloads, source maps, test fixtures that may be committed, or console logs. Use generic fake input in automated tests, not genuine client information.
- Escape any user-entered text when it is displayed in a fallback copy panel. Do not insert raw HTML from input, service query parameters, or user-provided strings.
- Preserve existing honeypot and minimal anti-spam safeguards; do not claim bot-proof protection.
- Don't describe the privacy/legal policy as professionally reviewed or fully compliant; legal pages are outside Step 9D. If the contact page's existing copy contradicts the actual unconfigured behavior, fix *that contact-page sentence* and document the remaining legal review rather than rewrite terms or privacy copy.
- If a future configured endpoint exists in code, do not expose credentials; do not add credentials to `PUBLIC_` variables. Do not change environment files.

## 10. Implementation discipline / avoid accidental scope creep

Make targeted, readable edits to the existing contact page/form and, if necessary, a small helper/test/scoped CSS change. Prefer existing component conventions and dependency-free TypeScript or browser APIs. Do not add React, Vue, UI component libraries, form validators, clipboard packages, analytics, image generators, or a server framework for this step. Do not convert the Astro page to a SPA.

No adjustments to:

- Portfolio files for **ScaleUp Systems, MedaStaré, Gain Energy / Upstrima, GoWabi, Daniela Diamonds, Born To Rock**, their images or publication flags.
- Named team profiles/portraits of **Don Tran, Joshua Mendoza, Lin Jiayi, Pongsak Rattanakul, Dmytro Melnyk, Carlo Garcia, Matheus Pereira, Adrian Cruz, Sofia Vasylivna Melnyk**, or their gallery; preserve Adrian's external employment separation.
- The **12 unpublished Insights drafts** and their approval-gated selectors; public article count remains zero unless preexisting independent owner approval exists (do not invent approval).
- Domain/DNS/canonical host, business email, mailto configuration values, Formspree endpoint configuration, hosting, deployment, environment files, global package versions, privacy and terms content.

If you discover an unrelated defect, add it under **out-of-scope findings** in the report. Do not silently fix another step's work.

## 11. Unit testing (add or update existing tests)

Extend the project's existing unit test runner. Prefer pure, deterministic helpers for validation, delivery mode, or inquiry composition where that fits the code. Cover at least:

1. Required field blanks and whitespace-only input produce field-specific errors.
2. Email validation rejects malformed input without rejecting sensible, standard inputs.
3. Empty/invalid select value and unknown service prefill are handled safely, if applicable.
4. Inquiry composition includes only user-entered fields and approved labels in deterministic order; never includes honeypot, hidden internal flags, endpoint, or PII in URLs.
5. Default or missing endpoint yields **unconfigured** state. Placeholder email/invalid destination cannot become a real delivery action.
6. In unconfigured state, no success state represents a send.
7. If a genuine preexisting endpoint path can be tested using mocks, distinguish actual 2xx success vs failed/aborted requests; do **not** hit the real network.
8. Six approved portfolio records and nine named team profiles remain unchanged, and Insights drafts stay unpublished.

Use the actual state model and APIs rather than hardcode phantom helpers. Tests should not reach the internet.

## 12. Browser and end-to-end tests

Extend `tests/e2e/smoke.spec.ts` or the repo's real E2E file. Test the **actual** page semantics without inventing data or relying on arbitrary timeouts:

- `/contact` loads with correct title, one H1, usable labeled fields, truthful unconfigured notice, and no dummy/public placeholder email link.
- Empty action focuses first invalid field and shows a visible associated message; valid edits clear/recalculate errors. Verify the prior `#full-name-error` (or replacement stable selector) no longer produces a flaky timeout.
- Fill the fields with invented **test-only** identities and project text; a valid inquiry draft can be copied. Mock clipboard permissions/writeText if needed. Assert the exact status says **not sent**, and no network POST occurs.
- Mock clipboard rejection; user sees honest failure and a selectable fallback if implemented; no false copy confirmation.
- If an actual endpoint integration branch exists, test success/error in **intercepted mock only**, with no live external submission; preserve the default unconfigured production mode.
- Query-prefill from at least one **existing service CTA** works; unsupported query values are safely ignored.
- Honeypot is not part of keyboard focus or copied message.
- Keyboard navigation, focus visibility, status announcement, and 375px mobile menu still work.
- Existing sitemap and route sanity remain intact; six approved portfolio pages accessible, sample portfolio routes still 404; nine named team pages accessible; none of twelve draft Insights article routes exposed.
- Test at minimum 375px plus representative desktop width; manually inspect 768px and 1024px and 1440px too.

Do not claim a live message was delivered; only test actual UI behavior and mocked configured-response branches. A genuine endpoint is intentionally absent.

## 13. Real project checks and browser inspection

Run the commands supported by the repo, typically:

```bash
npm test
npm run check
npm run build
npm run test:e2e
```

Use the project's configured package manager if scripts differ and record the exact command. Start the **production preview** after building for manual browser checks. Where feasible, also check no-JavaScript experience or inspect the rendered static HTML to confirm a meaningful unconfigured notice exists without JS.

Record the **first run and the final run**, including any failures, changes made, and number of passing tests. Report Astro errors, warnings and hints honestly. Do not change dependencies to hide a warning. Count actual built HTML pages and sitemap URLs (the Step 9C reference was 35 and 31 respectively; investigate but do not force a count). Check form state and CTA flow on both desktop and mobile. If automated browser screenshots are available, store/report real file paths, not guesses.

## 14. Documentation and owner action list

Create `CONTACT_PAGE_REVIEW.md` in the project root with:

- Exact current visible contact text and truthfully stated delivery mode.
- Existing form fields and which ones are required.
- Behavior of unconfigured form, validation and clipboard fallback; explicit notice that **copying does not send**.
- Which CTA/query-prefill paths were confirmed functional.
- What must be provided *later* to accept messages (an owner-approved delivery destination and endpoint configuration); **do not request or configure it now**.
- Any remaining user-experience limitations, no-JS limitations, and privacy/legal review tasks; mark these pending, not completed.
- A short repeatable QA checklist for mobile, desktop, keyboard, invalid inputs, valid copy, clipboard failure, and no unintended network call.

This document is a checklist, not a request to set up business email or deployment.

## 15. Required report: `STEP_9D_REPORT.md`

Write a complete, evidence-based report in the project root with the **following 27 numbered sections**:

1. Executive summary, Step 9D completion status and actual public contact mode.
2. Exact existing contact architecture/routes/components and files inspected.
3. Before-state audit: form fields, labels, requirements, endpoint values **redacted if sensitive**, fallbacks, CTAs and defects.
4. Scope guardrails and all configurations explicitly **not changed**.
5. Contact page content/visual hierarchy: before vs after.
6. Exact final form fields and validation rules.
7. Current delivery state machine/predicate and behavior with no configured endpoint.
8. Placeholder-email and invalid mailto safeguards; list any public links removed/hidden without modifying config values.
9. “Copy inquiry” or actual safe alternative UX (if implemented): exact button/status wording; no-send confirmation.
10. Clipboard success, failure, and supported-browser fallback; no silent false success.
11. JavaScript-disabled behavior and explicit limitations.
12. Input sanitation, honeypot, spam and privacy/data-collection handling.
13. Query-prefill/source CTA behaviors and validation of unknown values.
14. Accessibility review: labels, errors, focus, aria, keyboard, mobile targets.
15. Responsive visual checks at **375, 768, 1024, 1440** (and 320 if checked); actual results.
16. Any screenshots/screenshots paths **only if actually produced**.
17. Existing CTA and internal navigation audit, including service-to-contact journey.
18. Exact list of all created/modified files and justification for each.
19. Unit test cases and first/final `npm test` results.
20. First/final `npm run check` results with error/warning/hint counts.
21. First/final `npm run build` results, actual HTML page and sitemap URL counts.
22. First/final `npm run test:e2e` results with UI assertions, mocks and any limitations.
23. Known historical intermittent contact-field test: whether reproduced, what was stabilized, proof.
24. Regression: six published portfolio case studies still intact with correct order and flags.
25. Regression: nine named team profiles/approved portraits and 12 unpublished Insights drafts untouched.
26. Explicit exclusions preserved: domain/`PUBLIC_SITE_URL`/DNS, business email/mailto config, delivery endpoint, hosting, deployment, legal pages, analytics and dependency versions.
27. Open risks, exact remaining approval/setup requirements for a real future contact channel, and what needs later owner testing; no live delivery claim.

Do not just generate the report. Implement, run checks, inspect and then report **actual evidence**.

## 16. Final acceptance checklist

Step 9D is complete only if:

- `/contact` visibly works as a polished and honest **inquiry preparation** experience while delivery is unconfigured; no misleading send or “working mailbox” claim.
- Required input validation, accessible focus/error handling, and usable form layout work on mobile and desktop; no accidental background sends or leaks.
- There is a functional, truthful local next action where feasible (e.g., explicit copy inquiry); clipboard denial has a truthful recovery path.
- Legacy placeholder email never becomes a live-looking fallback or a recipient for an actual action.
- In the current production build no real contact service is configured and no real message is sent.
- Existing real service/portfolio CTAs still reach `/contact`, and supported prefill is preserved.
- Automated tests/check/build/E2E and browser checks have been honestly run, with documented outcomes and regressions.
- Six approved case studies, nine approved team profiles, and 12 unpublished Insights drafts remain unchanged; sitemap/publication safeguards preserved.
- `CONTACT_PAGE_REVIEW.md` and `STEP_9D_REPORT.md` exist in the project root.
- **No domain, business email, contact delivery integration, or deployment configuration has been changed.**

**Stop after Step 9D. Do not begin Step 9E, do not configure a mailbox, and do not deploy.** End with a concise summary and ask the owner to upload `STEP_9D_REPORT.md` for review.
