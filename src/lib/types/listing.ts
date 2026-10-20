/** Backend IDs are UUID strings; local preview fixtures never go to the API. */
export interface Listing {
  id: string;
  game_id: string;
  category_id: string;
  game_region_id: string | null;
  server_id: string | null;
  seller_id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  stock_type: "finite" | "unlimited";
  stock_quantity: number | null;
  quantity_per_unit: number;
  status: "draft" | "active" | "sold" | "archived";
}
