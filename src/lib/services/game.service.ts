import { api } from "@/lib/api";
import type { Game, GameCategory, GameDetail, GameRegion } from "@/lib/types/game";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hasStrings(value: Record<string, unknown>, keys: string[]): boolean {
  return keys.every((key) => typeof value[key] === "string");
}

function isGame(value: unknown): value is Game {
  return isObject(value) &&
    hasStrings(value, ["id", "name", "slug", "description", "publisher", "created_at", "updated_at"]) &&
    typeof value.is_active === "boolean";
}

function isCategory(value: unknown): value is GameCategory {
  return isObject(value) && hasStrings(value, ["id", "name", "slug"]);
}

function isRegion(value: unknown): value is GameRegion {
  return isObject(value) &&
    hasStrings(value, ["id", "game_id", "name", "slug", "created_at", "updated_at"]) &&
    typeof value.is_active === "boolean";
}

function isDetail(value: unknown): value is GameDetail {
  return isGame(value) && "categories" in value && "regions" in value &&
    Array.isArray(value.categories) && value.categories.every(isCategory) &&
    Array.isArray(value.regions) && value.regions.every(isRegion);
}

async function getData<T>(path: string, validate: (value: unknown) => value is T): Promise<T> {
  // api() preserves HTTP errors (including 404) and rejects malformed JSON.
  const response = await api<unknown>(path, { cache: "no-store" });
  if (!isObject(response) || response.success !== true || !validate(response.data)) {
    throw new Error("Format respons game tidak sesuai kontrak backend.");
  }
  return response.data;
}

export const gameService = {
  getAll(): Promise<Game[]> {
    // Public routes in the Go router use singular /game.
    return getData("/game", (data): data is Game[] => Array.isArray(data) && data.every(isGame));
  },
  getBySlug(slug: string): Promise<GameDetail> {
    return getData(`/game/${encodeURIComponent(slug)}/`, isDetail);
  },
};
