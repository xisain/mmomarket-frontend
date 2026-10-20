export interface Game {
  id: string;
  name: string;
  slug: string;
  description: string;
  publisher: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GameCategory {
  id: string;
  name: string;
  slug: string;
}

export interface GameRegion {
  id: string;
  game_id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GameDetail extends Game {
  categories: GameCategory[];
  regions: GameRegion[];
}