---
title: "API Habits for a Small Product Team"
description: "Authentication, validation, idempotency, error responses, limits, and logs for an API a startup can keep correct."
pubDate: 2026-10-27
updatedAt: 2026-10-27
author: "Vortex Digital"
category: "Backend & APIs"
draft: true
demonstration: false
editorialReview: true
publicationApproved: false
status: review
featured: false
---

A small product’s API is the contract between its screens and its data. It may later be the contract with another application. The habits that keep it correct are ordinary: know who is calling, check the input on the server, make retries safe, and return errors a client can handle. The shapes below are examples for planning. They are not a Vortex Digital client API, and they are not a certification checklist.

## Know who is calling, then what they may do

Authentication answers “who is this?” A session cookie, a short-lived token, or a signed request are all acceptable when you can revoke them and when the secret is not stored in the app’s source. Pick one way for the product’s own interface. A second way, added for a script and then forgotten, becomes the way that skips a check.

Authorization answers “what may they do?” Do it on the server for every command and every read. The user’s id and the tenant’s id come from the session, not from a hidden field the client can edit. A request to archive project 42 should fail when project 42 belongs to another customer, even if the caller guesses the id.

Admin actions are a separate path. A token that can act as any customer is production access. Keep it off the public interface, limit who can mint it, and record its use.

## Validate before you write

Reject input that does not match the operation. Types, required fields, lengths, and allowed values belong in one schema the handler uses. The form in the browser can repeat the check so the person gets a faster message. The server check is the one that counts.

Return the field and the reason when the person can fix it. “email is not a valid address” is actionable. “Bad request” alone forces them to guess. Do not echo the raw body back in the error if it might contain a secret they just pasted.

Ignore fields the operation does not accept. An endpoint that copies the whole JSON object into a row will eventually store a permission flag the client sent itself.

## Make the dangerous retries safe

Networks time out. Clients retry. A create that is not idempotent will create two projects, send two invites, or charge twice. Give those operations a key the client generates, and store the result of the first successful call under that key. The retry returns the same result.

A unique constraint in the database is the other half. Two requests can pass the application check at the same moment. The database should still refuse a second membership for the same person in the same workspace, or a second payment with the same provider id.

Deletes and updates need a rule too. Updating a record with an older copy of the form should not wipe a change someone else saved. A version, or an update of only the fields the person changed, is enough for many products. You do not need a full event log on day one. You need to notice the clash.

## Use a small set of errors

Clients should not parse English sentences to decide what to do. A small vocabulary is enough:

| Situation | What the client should do |
| --- | --- |
| The input is invalid | Show the field errors. Do not retry unchanged. |
| The caller is not signed in | Send them to sign in again. |
| The caller may not do this | Say so. Do not offer a retry that will fail the same way. |
| The record is gone, or it changed | Refresh and let the person decide. |
| The server or a provider failed | Show a message and allow one deliberate retry. |
| The caller has hit a limit | Say when they can try again, if you know. |

An example body, not a public schema you have to adopt:

```json
{
  "error": "invalid_input",
  "fields": [{ "name": "email", "message": "Enter a valid email address." }]
}
```

Use the HTTP status that matches the class of problem, and keep the `error` code stable. Changing the prose is fine. Changing the code breaks the client.

## Limit the expensive paths

A public or authenticated endpoint that sends email, calls a model, or runs a heavy report needs a limit. Per user and per hour is a reasonable start. The limit is there to contain a bug and a loop, not to invent a pricing tier. Return a clear error when it trips.

The same idea applies inside the process. A job that retries forever will fill a queue. Cap retries, record the last error, and leave the record in a state a person can see.

## Log so you can find one request

Give each request an id and return it in the error the person sees, or in a header your own client can show to support. Log that id with the operation name, the tenant, the status, and how long it took. Leave the body out when the body is customer content. You can add a debug log for a single tenant later, for a short time, if a real incident needs it.

These logs are also how you decide whether the API needs to grow. If one operation is slow or failing, you have a named path to fix. If you do not, another service or a cache is a guess.

## Scale the API after the product, not before

A single application behind one database answers a lot of product traffic. Add a read replica, a queue, or a split service when a measurement says the current shape is the limit. Pagination belongs in the first version of any list that can grow. Authentication and the tenant check belong there too. A public API for other companies can wait until someone else will depend on the shape. When you do offer it, version it and write down what you will not change.

## Takeaway

Treat the API as the place where identity, permission, validation, and retries are decided. Keep the error vocabulary small, cap the expensive calls, and log an id you can trace. Add infrastructure when a real path is slow or unsafe, not when the diagram looks thin.

[Backend and API engineering](/services/backend-api-engineering) is this contract: the rules behind the product, checked on every call, in a form a small team can operate.
