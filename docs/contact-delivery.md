# Contact delivery setup

The public contact form does not send mail until this is configured. The site will not show a success message while the endpoint is empty. The button says “Copy inquiry”. Copying puts the draft on the visitor’s clipboard. It does not deliver a message, and it does not open a mail app.

No endpoint is included in the repository. Do not commit a real form id if the repository is public.

## What you need

1. A Formspree form that you control.
2. The address where those submissions should arrive. That inbox has to be a real mailbox you can read.
3. Optional: a booking link, if you already have one.

## Local configuration

Copy `.env.example` to `.env` in the project root. Astro reads `PUBLIC_*` variables at build time.

```
PUBLIC_SITE_URL=https://your-domain.example
PUBLIC_CONTACT_EMAIL=you@your-domain.example
PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
PUBLIC_BOOKING_URL=
```

- `PUBLIC_CONTACT_EMAIL` is shown as a mailto link only when it does not end in `@example.com` or `@example.org`. Leave the placeholder in place until the mailbox exists. The footer, contact page, and privacy page stay honest while it is a placeholder.
- `PUBLIC_FORMSPREE_ENDPOINT` must be an `http://` or `https://` URL on a real host. An empty value, a `mailto:` value, or a URL on `example.com` keeps the form in the unconfigured state. The form source does not need an edit when you set this variable.
- `PUBLIC_BOOKING_URL` adds a booking card on the contact page when it is a real URL. Leave it empty if you do not have one.
- `PUBLIC_SITE_URL` is the canonical origin used for links and the sitemap. `https://example.com` is the unset default and is not a live domain.

Restart `npm run dev` after changing `.env`. Production builds need the same variables in the host’s environment. This document does not set a host or a domain.

## How to confirm it works

1. Set the two required variables to values you control.
2. Run `npm run build` and open the contact page from that build.
3. The unconfigured banner should be gone, and the button should say “Send message”.
4. Submit a real test inquiry.
5. Confirm the message arrived in the Formspree inbox you configured.
6. Only then should the success state (“Message submitted”) be treated as delivery. A failed request stays on the form and says delivery was not confirmed.

The honeypot field stays in place. The short-submit check applies only when an endpoint is configured, so a local copy is not delayed. Neither one is a substitute for the provider’s spam filtering.

## What is still not configured

Until the variables above are set, the contact page is a validated inquiry draft with a copy button. Copying does not send. It is not a live lead inbox.
