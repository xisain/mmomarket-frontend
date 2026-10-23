import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api";
import { gameService } from "@/lib/services/game.service";

export async function getPageGame(slug: string) {
  try {
    console.log(slug);
    return await gameService.getBySlug(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}
