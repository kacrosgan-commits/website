import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  composeInquiry,
  inquiryProblems,
  planDelivery,
  providerOutcome,
  resolveServicePrefill,
  type InquiryValues,
} from "../../src/utils/inquiry.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const valid: InquiryValues = {
  name: "Ada Owner",
  email: "ada@client.test",
  company: "Northwind",
  service: "Web Application",
  budget: "Not sure yet",
  timeline: "1–3 months",
  message: "We need a private admin tool for the operations team.",
  consent: true,
};

test("a complete inquiry has no field problems", () => {
  assert.deepEqual(inquiryProblems(valid), []);
  assert.deepEqual(inquiryProblems({ ...valid, budget: "", timeline: "" }), []);
  assert.equal(inquiryProblems({ ...valid, email: "ada+ops@client.test" }).length, 0);
});

test("missing fields are reported without claiming delivery", () => {
  const problems = inquiryProblems({
    ...valid,
    name: " ",
    email: "not-an-email",
    company: "  ",
    service: "",
    message: "too short",
    consent: false,
  });
  assert.deepEqual(
    problems.map((problem) => problem.id),
    ["full-name", "business-email", "company-name", "project-type", "project-description", "privacy-consent"],
  );
  assert.ok(problems.every((problem) => !/sent|delivered|received/i.test(problem.message)));
});

test("email checks stay practical", () => {
  assert.equal(inquiryProblems({ ...valid, email: "a@b" }).some((problem) => problem.id === "business-email"), true);
  assert.equal(inquiryProblems({ ...valid, email: "ada@client.test" }).length, 0);
  assert.equal(inquiryProblems({ ...valid, email: " ada@client.test " }).length, 0);
});

test("unknown service values and prefills are ignored", () => {
  assert.ok(inquiryProblems({ ...valid, service: "Not a service" }).some((problem) => problem.id === "project-type"));
  assert.equal(resolveServicePrefill("web-application-development"), "Web Application");
  assert.equal(resolveServicePrefill("qa-software-testing"), "QA & Testing");
  assert.equal(resolveServicePrefill("not-a-real-service"), "");
  assert.equal(resolveServicePrefill("<script>alert(1)</script>"), "");
  assert.equal(resolveServicePrefill(null), "");
});

test("inquiry text includes only entered fields", () => {
  const text = composeInquiry({ ...valid, budget: "", timeline: "" });
  assert.match(text, /^Name: Ada Owner\nEmail: ada@client\.test\nCompany: Northwind\nProject type: Web Application\n\nWe need/);
  assert.doesNotMatch(text, /Budget:|Timeline:|company_website|_subject|endpoint|hello@example\.com/);
  const withOptional = composeInquiry(valid);
  assert.match(withOptional, /Budget: Not sure yet\nTimeline: 1–3 months/);
});

test("honeypot and fast submits are blocked", () => {
  assert.equal(planDelivery("https://formspree.io/f/test", "http://spam.test", 5000).mode, "blocked");
  assert.equal(planDelivery("https://formspree.io/f/test", "", 100).mode, "blocked");
  assert.equal(planDelivery("", "filled", 5000).mode, "blocked");
});

test("an empty endpoint is unconfigured and is not a successful send", () => {
  assert.deepEqual(planDelivery("", "", 2000), { mode: "unconfigured" });
  assert.deepEqual(planDelivery("", "", 100), { mode: "unconfigured" });
  assert.deepEqual(planDelivery("mailto:hello@example.com", "", 2000), { mode: "unconfigured" });
  assert.deepEqual(planDelivery("https://example.com/form", "", 2000), { mode: "unconfigured" });
  assert.notEqual(planDelivery("", "", 2000).mode, "provider");
});

test("a configured https endpoint is handed to the provider", () => {
  assert.deepEqual(planDelivery("https://formspree.io/f/abc", "", 2000), {
    mode: "provider",
    endpoint: "https://formspree.io/f/abc",
  });
  assert.equal(providerOutcome({ ok: true, status: 200 }), "confirmed-success");
  assert.equal(providerOutcome({ ok: true, status: 200, payloadOk: false }), "recoverable-error");
  assert.equal(providerOutcome({ ok: false, status: 500 }), "recoverable-error");
  assert.equal(providerOutcome({ ok: false, status: 0, aborted: true }), "recoverable-error");
});

test("portfolio, team, and insights publication stay unchanged", () => {
  for (const slug of ["scaleup-systems", "medastare", "gain-energy-upstrima", "gowabi", "daniela-diamonds", "born-to-rock"]) {
    const raw = fs.readFileSync(path.join(root, "src/content/case-studies", `${slug}.md`), "utf8");
    assert.match(raw, /^publicationApproved:\s*true\s*$/m, slug);
    assert.match(raw, /^sample:\s*false\s*$/m, slug);
  }
  const team = fs.readFileSync(path.join(root, "src/data/team.ts"), "utf8");
  for (const name of ["Don Tran", "Joshua Mendoza", "Lin Jiayi", "Pongsak Rattanakul", "Dmytro Melnyk", "Carlo Garcia", "Matheus Pereira", "Adrian Cruz", "Sofia Vasylivna Melnyk"]) {
    assert.match(team, new RegExp(`name: "${name}"`));
  }
  const blogDir = path.join(root, "src/content/blog");
  const posts = fs.readdirSync(blogDir).filter((file) => file.endsWith(".md"));
  assert.equal(posts.length, 12);
  for (const file of posts) {
    const raw = fs.readFileSync(path.join(blogDir, file), "utf8");
    assert.match(raw, /^publicationApproved:\s*false\s*$/m, file);
    assert.doesNotMatch(raw, /^status:\s*published\s*$/m, file);
  }
});
