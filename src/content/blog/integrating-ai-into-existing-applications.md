---
title: "Integrating AI Into Existing Applications"
description: "Where to put a model call in software that already has users, permissions, and a screen for the job."
pubDate: 2026-08-20
updatedAt: 2026-10-27
author: "Vortex Digital"
category: "AI Solutions"
draft: true
demonstration: false
editorialReview: true
publicationApproved: false
status: review
featured: false
---

An integration is a model call inside a product that already has a job. A separate demo that people must remember to open is not an integration. The work is to put the draft, the classification, or the extracted fields on the screen where the work already happens, and to leave the rest of the product standing when the model is slow or wrong. This is a design note. It is not a claim about a deployed Vortex Digital feature.

Whether you need a model at all — a rule, a single call, retrieval, or an agent — is a separate decision. This note assumes you have named one task and you are placing it in the software you have.

## Sit it on a workflow you can point at

Pick a screen and a moment. A support tool might offer a draft reply under the ticket the agent is already reading. An operations tool might suggest a category beside the queue the person is already sorting. The person should not have to copy text into another site and paste the answer back.

Write the input from records the product already has. If the draft needs the ticket and the last three messages, load those on the server and send only that. Do not ask the client to assemble a prompt from whatever happens to be on the page. The page changes. The server contract should not.

Keep the result in the product’s own data model when you store it. A draft reply is a draft on the ticket, with a flag that a person has not sent it. It is not a blob in a side table nobody else can audit.

## Use the permissions you already enforce

The model must not become a way around access control. If the current user cannot open a document, the retrieval step must not fetch it, and the prompt must not include it. Asking the model to “ignore private documents” is not a permission check. The check happens before the call, with the same rules the rest of the application uses.

Run the call on the server. A key in the mobile app or the browser is a key you have shipped to every user. The server can apply the user’s permissions, the timeout, and the limit on how often this feature may run.

Log the request id, the task name, the latency, and whether the person accepted or discarded the result. Do not log the full customer text if you would not put that text in an ordinary application log.

## Choose synchronous only when the person is waiting on purpose

Some tasks are short enough to finish while a dialog is open: a classification, a few extracted fields, a paragraph. Set a timeout. If the call exceeds it, close the wait and offer the manual path. The screen they were on should still be usable.

Longer work belongs in a job. The person starts it, the record shows “preparing,” and they can leave. When it finishes, they can open the draft. A job needs a failure state. “Preparing” forever is a stuck feature. Store the error in words the person can act on, and let them try again without creating a second copy of the work.

Do not let the model perform the save, the send, or the permission change as a side effect of the call. Return a draft. The existing button, with the existing validation, commits it. That keeps one way to change the record.

## Make the failure look like the rest of the product

Empty responses, refusals, and timeouts need a sentence on the same screen. “No suggestion is available. You can write this yourself.” is enough. Do not clear the form. Do not show a stack trace. Do not leave a disabled button with no explanation.

Give the team a switch that turns the feature off without a new deploy if you can, and a switch that certainly works on the next deploy if you cannot. The switch should hide the suggestion and leave the manual task in place. If the model provider is down, the product’s older path is the product.

Review a sample of accepted and discarded results with people who know the workflow. That review is how you decide whether the prompt, the retrieved passages, or the placement of the button is wrong. A vendor score on a public dataset does not tell you whether your agents can use the draft.

## An example, not a project

A ticketing screen already loads a ticket for agents who are allowed to see it. The server builds a prompt from the ticket body and the customer’s last message, calls one model with a timeout of a few seconds, and returns a draft or a typed error. The agent edits the draft in the reply box and presses the same Send button as before. The ticket stores that a draft was offered and whether it was edited. Nothing in that example is a client engagement. It is a shape you can compare with your own screen.

## Common mistakes

Shipping the demo UI beside the real product and calling it integrated.

Letting the model return a database query or a price that your code executes. Parse a schema. Reject everything else. The existing code decides what may be written.

Retrying a failed prompt in a loop. One retry on a timeout can be reasonable. An automatic loop can multiply the bill and duplicate side effects. Cap the calls per user and per day before you turn the feature on for everyone.

Forgetting to remove the provider’s branding and raw response from the customer-facing screen. The customer needs the product’s message, not the model’s internals.

## Takeaway

Put the model on the screen where the work already happens, behind the permissions and the save path you already trust. Time-box the call, keep a manual path, and store the draft as a draft until a person commits it.

[AI solutions](/services/ai-intelligent-automation) in an existing product are this placement work: one task, one call path, and a product that still runs when the suggestion does not.
