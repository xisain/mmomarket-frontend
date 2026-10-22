import { TransactionStatuses } from "../constants/transaction";

export type SellerTransaction = {
  id: string;
  product: string;
  game: string;
  category: string;
  buyer: string;
  server: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  currency: string;
  status: TransactionStatuses;
  createdAt: string;
};