import assert from "node:assert/strict";
import test from "node:test";
import { providerErrorText, submitToProvider } from "../../src/utils/inquiry.ts";

const endpoint = "https://formspree.io/f/abc";

function fakeFetch(status: number, payload: unknown, seen: { init?: RequestInit; url?: string } = {}) {
  return (async (url: string | URL | Request, init?: RequestInit) => {
    seen.url = String(url);
    seen.init = init;
    return new Response(JSON.stringify(payload), { status, headers: { "Content-Type": "application/json" } });
  }) as typeof fetch;
}

function inquiry() {
  const data = new FormData();
  data.set("name", "Ada Owner");
  data.set("email", "ada@client.test");
  data.set("message", "We need a private admin tool for the operations team.");
  return data;
}

test("a confirmed Formspree response is a success, posted as form data that asks for JSON", async () => {
  const seen: { init?: RequestInit; url?: string } = {};
  const result = await submitToProvider(endpoint, inquiry(), fakeFetch(200, { ok: true, next: "/thanks" }, seen));
  assert.deepEqual(result, { outcome: "confirmed-success", detail: "" });
  assert.equal(seen.url, endpoint);
  assert.equal(seen.init?.method, "POST");
  assert.deepEqual(seen.init?.headers, { Accept: "application/json" });
  assert.ok(seen.init?.body instanceof FormData);
  assert.equal((seen.init?.body as FormData).get("email"), "ada@client.test");
});

test("provider errors are failures and keep the provider's own message", async () => {
  const rejected = await submitToProvider(endpoint, inquiry(), fakeFetch(422, { errors: [{ message: "Email is not valid" }] }));
  assert.deepEqual(rejected, { outcome: "recoverable-error", detail: "Email is not valid" });
  const notOk = await submitToProvider(endpoint, inquiry(), fakeFetch(200, { ok: false }));
  assert.equal(notOk.outcome, "recoverable-error");
  const serverError = await submitToProvider(endpoint, inquiry(), fakeFetch(500, { error: "Server error" }));
  assert.deepEqual(serverError, { outcome: "recoverable-error", detail: "Server error" });
});

test("a network failure is a failure, never a success", async () => {
  const offline = (async () => {
    throw new TypeError("Failed to fetch");
  }) as typeof fetch;
  assert.deepEqual(await submitToProvider(endpoint, inquiry(), offline), { outcome: "recoverable-error", detail: "" });
});

test("provider error text is plain and bounded", () => {
  assert.equal(providerErrorText(null), "");
  assert.equal(providerErrorText({ errors: [{ message: "A" }, { message: "B" }] }), "A B");
  assert.equal(providerErrorText({ errors: ["Plain"] }), "Plain");
  assert.equal(providerErrorText({ error: "x".repeat(400) }).length, 240);
});
