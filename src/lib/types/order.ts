import { TransactionStatuses } from "../constants/transaction";

type NamedEntity = {
  id: string;
  name: string;
};

// Field respons yang digunakan oleh halaman buyer.
export type Order = {
  id: string;
  listing_id: string;
  seller_id: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  currency: string;
  status: TransactionStatuses;
  created_at: string;

  seller: {
    id: string;
    shop_name: string;
    slug: string;
  };

  listing: {
    id: string;
    name: string;
    game: NamedEntity;
    category: NamedEntity;
    region: NamedEntity;
    server: NamedEntity;
  };
};
export type SellerOrder = {
  id: string;
  listing_id: string;
  buyer_id: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  currency: string;
  status: TransactionStatuses;
  created_at: string;

  buyer: NamedEntity;

  listing: {
    id: string;
    name: string;
    game: NamedEntity;
    category: NamedEntity;
    region: NamedEntity;
    server: NamedEntity;
  };
}
export type BuyerOrdersResponse = {
  orders: Order[] | null;
};
export type SellerOrdersResponse = {
  orders: SellerOrder[] | null;
};
