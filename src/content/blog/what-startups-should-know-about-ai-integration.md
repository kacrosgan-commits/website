---
title: "What Startups Should Know About AI Integration"
description: "How to add a model to an existing product without treating the demo as the system."
pubDate: 2026-10-22
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

A model is a component. It takes input, returns output, and fails in ways a normal function does not: it can be slow, expensive, rate-limited, and wrong while still looking fluent. Integrating one into a product is the work of defining the task, the data you are allowed to send, and what the application does when the answer is unusable.

## Start with a task, not a model

Write the task the way you would write any other feature. “Suggest a reply a support agent can edit” is a task. “Add AI” is not. The task decides whether you need generation, classification, extraction, or search over your own documents.

If a deterministic rule or a database query already answers the question, use that. A model is justified when the input is unstructured or the output is a draft a person will review.

| Approach | Use it when | Do not use it when |
| --- | --- | --- |
| A rule or a query | The answer is already in structured data, or the cases are few and stable. | The input is unstructured text and the rules keep growing into exceptions. |
| A model call that returns a draft | A person will review the result before it changes anything important. | The result sets a price, a permission, or a record with nobody in between. |
| Retrieval over your documents | The answer depends on material you already have, and you can filter it by who is asking. | You would be asking the model to hide documents the retrieval step already returned. |
| An agent that takes several steps | The task is a sequence you can bound, log, and stop, and a person can see what it did. | You cannot name the tools it may call, or a wrong step would be hard to undo. |

An agent is the last of these, not the default. If one model call with a schema and a review step answers the task, stop there.

## Decide what leaves your system

Every call sends data to whoever runs the model, unless you run the model yourself. List the fields that are allowed to leave: a support ticket, a product description, a document the customer has uploaded. List the fields that must not: secrets, payment data, and anything your agreement with the customer forbids you to share.

Log the request id and the outcome. Do not log the full prompt if it contains customer content you would not put in an ordinary application log. Keep a way to turn the feature off without taking the rest of the product down.

## Treat the output as untrusted

Show generated text as a draft when a person is accountable for the result. Parse structured output with a schema and reject responses that do not match. Do not let a model choose a database query, a price, or a permission by returning free text that your code executes.

Timeouts, empty responses, and refusals need a visible path. The screen should say the suggestion is unavailable and offer the manual action. A spinner that never ends is a broken feature, not a cautious one.

## Measure cost and quality on your own inputs

Token prices and latency are published by the provider and change. They are not a forecast for your product. Run the feature on a set of real examples you are allowed to use, and record how often a person accepts, edits, or discards the result. That review is the quality signal. A vendor benchmark on someone else’s dataset does not replace it.

Put a limit on calls per user and per day before you launch. A loop that retries a failing prompt can spend more than the rest of the application.

## Retrieval is a data problem

If the model needs your documents, you need a way to select the relevant passages, keep them current, and omit documents the current user should not see. Access control belongs in the retrieval step. Asking the model not to mention a private document is not a control.

## A practical first integration

One task, one provider, a human review step, a timeout, a kill switch, and a log of accepted versus discarded results. Expand to a second task after the first one has been used. Switching models later is easier when the prompt, the schema, and the review step are not scattered through the interface.

## Takeaway

Add a model when the task needs a draft, a classification, or a search over your own documents, and when a person or a schema can reject a bad result. Keep the data you send explicit, and keep a way to turn the feature off.

[AI solutions](/services/ai-intelligent-automation) for a product team start from that task. They do not start from a demo that has no place in the existing workflow.
