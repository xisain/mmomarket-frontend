import { api } from "@/lib/api";
import type { BuyerTransaction } from "@/lib/types/buyer";
import type {
  Order,
  BuyerOrdersResponse,
} from "@/lib/types/order";

function mapOrderToTransaction(order: Order): BuyerTransaction {
  const location = [
    order.listing.server.name,
    order.listing.region.name,
  ].filter(Boolean);

  return {
    id: order.id,
    product: order.listing.name,
    game: order.listing.game.name,
    category: order.listing.category.name,
    seller: order.seller.shop_name,
    server: location.join(" · ") || "—",
    quantity: order.quantity,
    unitPrice: order.unit_price,
    totalAmount: order.total_amount,
    currency: order.currency,
    status: order.status,
    createdAt: order.created_at,
  };
}

export async function getBuyerTransactions(
  signal?: AbortSignal,
): Promise<BuyerTransaction[]> {
  const response = await api<BuyerOrdersResponse>("/orders", {
    signal,
    cache: "no-store",
  });

  if (
    !response ||
    !("orders" in response) ||
    (response.orders !== null && !Array.isArray(response.orders))
  ) {
    throw new Error("Format respons transaksi tidak sesuai.");
  }

  return (response.orders ?? []).map(mapOrderToTransaction);
}