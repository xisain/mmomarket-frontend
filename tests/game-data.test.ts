import assert from "node:assert/strict";
import { test } from "node:test";
import { ApiError } from "../src/lib/api";
import { gameService } from "../src/lib/services/game.service";
import { getListingCategory, getListingGame, listings } from "../src/lib/demo-data";
import { getGameArtwork } from "../src/lib/game-presentation";
import type { Game } from "../src/lib/types/game";

const game: Game = {
  id: "2174b5cf-3b59-57ce-a70e-09bc17680bfb", name: "VALORANT", slug: "valorant",
  description: "Tactical shooter 5v5.", publisher: "Riot Games", is_active: true,
  created_at: "2026-10-17T07:51:16+07:00", updated_at: "2026-10-17T07:51:16+07:00",
};

test("game API envelope, errors, URL encoding, and request options", async () => {
  const originalFetch = globalThis.fetch;
  const originalUrl = process.env.NEXT_PUBLIC_API_URL;
  process.env.NEXT_PUBLIC_API_URL = "http://backend.test/api/v1/";
  let body: unknown = { success: true, data: [game] };
  let status = 200;
  let invalidJson = false;
  const requests: { url: string; options?: RequestInit }[] = [];
  globalThis.fetch = async (input: string | URL | Request, options?: RequestInit) => {
    requests.push({ url: String(input), options });
    return new Response(invalidJson ? "not JSON" : JSON.stringify(body), { status });
  };
  try {
    assert.deepEqual(await gameService.getAll(), [game]);
    assert.equal(requests[0].url, "http://backend.test/api/v1/game");
    assert.equal(requests[0].options?.credentials, "include");
    assert.equal(requests[0].options?.cache, "no-store");
    body = { success: true, data: [] };
    assert.deepEqual(await gameService.getAll(), []);
    const detail = { ...game, categories: [{ id: "category-id", name: "Currency", slug: "currency" }], regions: [] };
    body = { success: true, data: detail };
    assert.deepEqual(await gameService.getBySlug("valorant/asia"), detail);
    assert.equal(requests.at(-1)?.url, "http://backend.test/api/v1/game/valorant%2Fasia/");
    for (const invalid of [null, {}, { success: false, data: [game] }, { success: true, data: null }, { success: true, data: [{}] }]) {
      body = invalid;
      await assert.rejects(gameService.getAll());
    }
    for (const invalid of [{ ...detail, categories: null }, { ...detail, regions: [{}] }]) {
      body = { success: true, data: invalid };
      await assert.rejects(gameService.getBySlug("valorant"));
    }
    for (const code of [404, 401, 500]) {
      status = code;
      await assert.rejects(gameService.getBySlug("missing"), (error: unknown) => error instanceof ApiError && error.status === code);
    }
    status = 200;
    invalidJson = true;
    await assert.rejects(gameService.getAll(), SyntaxError);
    globalThis.fetch = async () => { throw new TypeError("Network unavailable"); };
    await assert.rejects(gameService.getAll(), /Network unavailable/);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_API_URL;
    else process.env.NEXT_PUBLIC_API_URL = originalUrl;
  }
});

test("listing previews retain labels and match API games by slug with real UUIDs", () => {
  const wow = { ...game, slug: "world-of-warcraft", name: "World of Warcraft" };
  assert.equal(getListingGame(listings[0], [wow])?.id, wow.id);
  assert.equal(getListingGame(listings[0], [])?.name, "World of Warcraft");
  assert.equal(getListingCategory(listings[0]), "currency");
  assert.equal(getListingCategory(listings[2]), "boosting");
  assert.equal(getGameArtwork("final-fantasy-xiv"), 2);
  assert.equal(getGameArtwork("new-game"), 0);
});
