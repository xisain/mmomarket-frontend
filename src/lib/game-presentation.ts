// Keep the existing vector artwork stable when API ordering changes.
const artwork: Record<string, number> = {
  "world-of-warcraft": 0,
  "albion-online": 1,
  "final-fantasy-xiv": 2,
  "black-desert-online": 3,
};

export function getGameArtwork(slug?: string): number {
  return slug ? artwork[slug] ?? 0 : 0;
}
