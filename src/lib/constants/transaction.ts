export const transactionStatuses = {
  pending_payment: { label: "Menunggu pembayaran", tone: "warning" },
  paid: { label: "Sudah dibayar", tone: "info" },
  processing: { label: "Diproses", tone: "info" },
  delivered: { label: "Sudah dikirim", tone: "info" },
  completed: { label: "Selesai", tone: "success" },
  cancelled: { label: "Dibatalkan", tone: "neutral" },
  disputed: { label: "Dalam komplain", tone: "danger" },
  refunded: { label: "Dikembalikan", tone: "neutral" },
} as const;

export type TransactionStatuses = keyof typeof transactionStatuses;
