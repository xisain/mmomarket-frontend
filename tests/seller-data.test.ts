import assert from "node:assert/strict";
import { test } from "node:test";
import { ApiError } from "../src/lib/api";
import { applyForSeller, getSellerListings, getSellerProfile, sellerDashboardHref, type SellerSummary } from "../src/lib/seller";

test("seller navigation uses the seller ID for every non-pending status", () => {
  const seller: SellerSummary = { id: "seller-123", shop_name: "My Store", slug: "my-store", status: "pending" };
  assert.equal(sellerDashboardHref(null), null);
  assert.equal(sellerDashboardHref(undefined), null);
  assert.equal(sellerDashboardHref(seller), null);
  for (const status of ["approved", "rejected", "suspended"] as const) {
    assert.equal(sellerDashboardHref({ ...seller, status }), "/seller/seller-123");
  }
});

test("seller dashboard fetches the session profile and all listing pages without caching", async () => {
  const originalFetch = globalThis.fetch;
  const originalUrl = process.env.NEXT_PUBLIC_API_URL;
  process.env.NEXT_PUBLIC_API_URL = "http://backend.test/api/v1";
  const profile = { id: "store-1", shop_name: "My Store", status: "approved" };
  const controller = new AbortController();
  const paths: string[] = [];
  globalThis.fetch = async (url, options) => {
    assert.equal(options?.credentials, "include");
    assert.equal(options?.cache, "no-store");
    assert.equal(options?.signal, controller.signal);
    const path = String(url).replace(process.env.NEXT_PUBLIC_API_URL!, "");
    paths.push(path);
    const data = path === "/seller/profile" ? profile
      : path.endsWith("offset=0") ? Array.from({ length: 100 }, (_, id) => ({ id: String(id) }))
        : [{ id: "last-listing" }];
    return new Response(JSON.stringify({ success: true, data }));
  };
  try {
    assert.deepEqual(await getSellerProfile(controller.signal), profile);
    const listings = await getSellerListings(profile.id, controller.signal);
    assert.equal(listings.length, 101);
    assert.equal(listings[100].id, "last-listing");
    assert.deepEqual(paths, ["/seller/profile", "/seller/store-1/listings?limit=100&offset=0", "/seller/store-1/listings?limit=100&offset=100"]);
    globalThis.fetch = async () => new Response(JSON.stringify({ success: false }));
    await assert.rejects(getSellerProfile(), /Profil seller gagal/);
    await assert.rejects(getSellerListings(profile.id), /Listing toko gagal/);
    globalThis.fetch = async () => new Response("", { status: 403 });
    await assert.rejects(getSellerListings(profile.id), (error: unknown) => error instanceof ApiError && error.status === 403);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_API_URL;
    else process.env.NEXT_PUBLIC_API_URL = originalUrl;
  }
});

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
