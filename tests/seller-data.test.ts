import assert from "node:assert/strict";
import { test } from "node:test";
import { ApiError } from "../src/lib/api";
import { applyForSeller } from "../src/lib/seller";

test("seller application sends shop data with session and rejects failed submissions", async () => {
  const originalFetch = globalThis.fetch;
  const originalUrl = process.env.NEXT_PUBLIC_API_URL;
  process.env.NEXT_PUBLIC_API_URL = "http://backend.test/api/v1/";
  let status = 201;
  let body: unknown = { success: true, data: { status: "pending" } };
  const input = { shop_name: "Goldsmith Guild", slug: "goldsmith-guild", description: "Game currency" };
  globalThis.fetch = async (url, options) => {
    assert.equal(String(url), "http://backend.test/api/v1/seller/applications");
    assert.equal(options?.method, "POST");
    assert.equal(options?.credentials, "include");
    assert.equal(new Headers(options?.headers).get("Content-Type"), "application/json");
    assert.deepEqual(JSON.parse(String(options?.body)), input);
    return new Response(JSON.stringify(body), { status });
  };
  try {
    await applyForSeller(input);
    for (const code of [400, 401, 409, 500]) {
      status = code;
      await assert.rejects(applyForSeller(input), (error: unknown) => error instanceof ApiError && error.status === code);
    }
    status = 200;
    for (const invalid of [null, {}, { success: false, message: "Rejected" }]) {
      body = invalid;
      await assert.rejects(applyForSeller(input));
    }
    globalThis.fetch = async () => { throw new TypeError("Network unavailable"); };
    await assert.rejects(applyForSeller(input), /Network unavailable/);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_API_URL;
    else process.env.NEXT_PUBLIC_API_URL = originalUrl;
  }
});
