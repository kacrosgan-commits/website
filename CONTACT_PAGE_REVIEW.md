# Contact page review

Public mode: **unconfigured**. The contact page prepares an inquiry. It does not send one.

Copying an inquiry does not send it. The site does not open a mail app, and it does not post the form.

This is a review checklist. It is not a request to set a domain, a mailbox, or a delivery endpoint.

## Visible text

- Page title in the browser: Contact.
- One H1: “Discuss a product or software project.”
- Intro: “Share the product goal, the kind of work, and where the project stands. A budget or timeline can wait.”
- Delivery notice, shown before the fields: “Online message delivery isn't configured yet. You can draft your inquiry here and copy it, but this site won't send it.”
- Side note “What helps”: name the product, who it is for, and whether the work is web, mobile, AI, SaaS, APIs, DevOps, design, or QA. Budget and timeline are optional.
- Email card: “A public inbox is not set. This page does not open a mail app or send the form.”
- Privacy card: with no delivery endpoint, the form does not submit details to Vortex Digital. Copying stays on this device. Links go to the existing Privacy Policy, Services, Portfolio, and Process pages.
- Primary button: “Copy inquiry”.
- After a valid copy: “Inquiry copied. No message has been sent.”
- If the clipboard is blocked: “Copy wasn't available in this browser; select and copy the text manually.” A read-only draft is shown only in that case.
- With JavaScript off, an extra line is in the page: “Copying an inquiry needs JavaScript. With it turned off, this page still does not send the form.”

No location, social, or booking card is shown. Those values are empty.

## Fields

| Label | Control | Name | Required |
| --- | --- | --- | --- |
| Full name | text, autocomplete name | name | Yes, at least 2 characters after trim |
| Email | email, autocomplete email | email | Yes, a practical address |
| Company | text, autocomplete organization | company | Yes, at least 2 characters after trim |
| Project type | select | service | Yes, one of the listed types |
| Estimated budget | select | budget | No. Blank is “No budget yet” |
| Expected timeline | select | timeline | No. Blank is “No timeline yet” |
| Project description | textarea | message | Yes, at least 20 characters after trim |
| Privacy consent | checkbox | privacy | Yes |

Project types: Web Application, Mobile Application, AI Solution, SaaS Product, Backend / API, Cloud / DevOps, UI/UX Design, QA & Testing, Other.

A hidden honeypot, Company website, is not a real field. It is not copied.

## What the button does

1. The visitor clicks “Copy inquiry”.
2. Empty or invalid fields show a short error next to that field. Focus moves to the first invalid field. Nothing is copied and nothing is sent.
3. A valid inquiry is written to the clipboard only after that click.
4. The status says the inquiry was copied and that no message has been sent.
5. If the browser refuses the clipboard, the same text appears in a read-only box so the visitor can select it. The page does not say it was copied.

The production form has no `action`. The button is `type="button"`. The built page contains no `mailto:` link.

## Prefill that was confirmed

These service actions open `/contact?service=<slug>` and select the matching project type:

- Discuss Your Web Application → Web Application
- Discuss Your Mobile App → Mobile Application
- Discuss an AI Feature → AI Solution
- Discuss Your SaaS Product → SaaS Product
- Discuss Your API → Backend / API
- Discuss Your Deployment → Cloud / DevOps
- Discuss Your Product Design → UI/UX Design
- Discuss Your Testing Plan → QA & Testing

An unknown or markup-like `service` value leaves the select empty. Personal fields are not filled from the URL.

Homepage, header, footer, about, process, team, portfolio, and case-study actions still open `/contact` without inventing a project type.

## Later, if a real destination is approved

Do not configure this now. A later step would need an owner-approved `http` or `https` delivery URL and a real inbox behind it. The placeholder address and `example.com` must not be used as that destination. Until that exists, “Message submitted” must stay hidden.

## Still pending

- No-JavaScript visitors can read the page and the notice. They cannot copy from the button. The form still does not send.
- Privacy Policy and Terms were not rewritten in this step. Legal review is still pending.
- This page does not claim encryption, a reply time, or a monitored inbox.
- A screen reader pass by a person, and a certified WCAG audit, were not done.

## QA checklist

- [ ] 375, 768, 1024, and 1440: one H1, no sideways page scroll, delivery notice visible, button at least 48px tall.
- [ ] 320 if you can: the same, with the form above the side notes.
- [ ] Keyboard: tab reaches name, email, company, selects, description, consent, and Copy inquiry. It skips the honeypot. Focus is visible.
- [ ] Empty Copy inquiry: “Enter your full name.” appears, and the name field is focused. No success panel.
- [ ] Fix the name and the error for that field clears. Other answers stay.
- [ ] Valid test data, then Copy inquiry: status is “Inquiry copied. No message has been sent.” The clipboard text has name and email and does not include the honeypot.
- [ ] Block the clipboard: the failure sentence appears, the draft is selectable, and the page does not say the inquiry was copied.
- [ ] Network panel: no POST from the unconfigured page.
- [ ] A service “Discuss…” link selects the matching project type. A nonsense `service` query does not.
- [ ] JavaScript disabled: the unconfigured notice and the noscript line are visible, and the form does not navigate away as if it had been sent.
