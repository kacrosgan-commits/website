---
title: "UX and QA Checks Before a Product Launch"
description: "A practical pass over research, accessibility, test priority, and the release checklist before a web or mobile product meets users."
pubDate: 2026-10-27
updatedAt: 2026-10-27
author: "Vortex Digital"
category: "UI/UX Design"
draft: true
demonstration: false
editorialReview: true
publicationApproved: false
status: review
featured: false
---

The week before a launch is a bad time to discover that new users cannot finish the main task, or that the task only works on the author’s laptop. A useful pre-launch pass is smaller than a full research program and smaller than a promise of zero defects. It checks the path you are about to put in front of people, on the devices you claim to support, and it writes down what you did not test. This is a method. It is not a report of a Vortex Digital client launch, and it is not a statement that the agency is certified against any accessibility or security standard.

## Watch the task with someone who did not build it

You need a few sessions, not a panel. Sit with someone who matches the user you named in the plan. Give them the task in their words — “record yesterday’s order” — and stay quiet while they try. Note where they hesitate, what they click first, and where they ask what a label means.

Five sessions will not prove a market. They will show the broken step you have stopped seeing. If you cannot recruit the real user yet, use someone inside the company who did not design the screen, and treat the result as a rehearsal, not as research with customers.

Write the findings as observations. “Three people looked for Save at the bottom of the form and it was only in the header” is a finding. “Users love the clean design” is not, unless those people said that, and you should still fix the Save button.

## Fix the interface issues that block the task

Prioritize what stopped the task over what looks unfinished.

- Labels that use your internal vocabulary.
- A primary action that is easy to miss.
- An error that says “invalid” without saying what to change.
- A step that depends on data the person does not have yet.
- Text that overflows or disappears at the width of a phone.

Contrast, focus, and keyboard use belong in this pass for a web product. Someone should be able to reach the main action with a keyboard, see which control is focused, and read the text against its background. Checkboxes and error text should have names a screen reader can find. You do not need to claim conformance to WCAG. You do need to fix the barriers you can find on the path you are shipping. A mobile app needs the same honesty about type size, tap targets, and the system’s text settings.

Do not open a visual redesign the week of launch unless the current UI is blocking the task. A new layout has its own bugs. Change the control that failed the session, and leave the rest of the brand alone.

## Test the risks, not every screen equally

List the ways this release can hurt a real person or their data. Those rows get tests first.

- Sign-in, sign-out, and a wrong password.
- The main task from empty state to a saved record.
- A second user who must not see the first user’s data.
- A failed network in the middle of Save.
- The migration or the import, run on a copy.
- The one integration you promised, against a test account if you have one.

Repeat those after any change that touches them. That is the regression set. A screenshot of a happy path is not a regression set. Automate the cases that are stable and painful to repeat, such as “user A cannot read user B’s project.” Leave a written script for the cases that still need a person, such as the layout on a specific phone.

Exploratory time still matters. After the script passes, spend a fixed hour trying to break the task: the back button, a double click on Pay or Send, a name that is only one character, a file of the wrong type. Write down what you tried so the next release can add the failures you found.

## A release checklist

Use this as a gate. If a line is not true, either fix it or write down the limit you are shipping with.

- The main task was completed by someone who did not build it, on a deployed environment.
- The empty, loading, and error states on that task have been looked at.
- A second account cannot see the first account’s records.
- The build you are shipping is the build you tested, from the pipeline, not from a laptop.
- Migrations have been tried on a copy, with a note for what to do if they stop.
- You know how to turn the new path off or how to roll back.
- The privacy and support basics are true: a way to reach you, and no placeholder phone number or example email presented as the company.
- Known limits are written where the team can find them. A limit you hide is a support incident you have scheduled.

Accessibility and security items you did not check stay on that known-limits list. Do not describe an unchecked item as covered.

## What to skip

A full redesign of screens that are not in this release.

A test matrix of every browser and every phone you can name. Pick the browsers and the devices your users actually have, plus one small phone, and say which those were.

Performance theater. Time the main task on a representative phone and connection. Do not publish a score from a lab as if it were the customer’s experience.

Vanity QA counts. “200 test cases” says nothing if they avoid the permission check. The list of risks above is a better report.

## Takeaway

Before launch, watch a real task, fix what blocks it, test the ways data can leak or a save can fail, and ship the build you tested. Record what you did not cover. That record is more useful than a claim that the product is finished.

[UI/UX design](/services/ui-ux-product-design) and [QA and testing](/services/qa-software-testing) meet on this pass: the interface a person can finish, and the checks that protect the record they just created.
