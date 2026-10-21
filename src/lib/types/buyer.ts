import { TransactionStatuses } from "../constants/transaction";

export type Buyer = {
  id: string;
  displayName: string;
  email: string;
};



export type BuyerTransaction = {
  id: string;
  product: string;
  game: string;
  category: string;
  seller: string;
  server: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  currency: string;
  status: TransactionStatuses;
  createdAt: string;
};