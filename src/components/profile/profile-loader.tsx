"use client";

import { Suspense, startTransition, use, useEffect, useState } from "react";
import { getBuyerProfile } from "@/lib/profile";
import { getBuyerTransactions } from "@/lib/transaction";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { BuyerProfile } from "./buyer-profile";
import type { BuyerTransaction, Buyer } from "@/lib/types/buyer";

type ProfileResult =
  | { buyer: Buyer; transactions: BuyerTransaction[]; error?: never }
  | { error: string };

export function ProfileLoader() {
  const [result, setResult] = useState<Promise<ProfileResult> | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load(): Promise<ProfileResult> {
      try {
        const [buyer, transactions] = await Promise.all([
          getBuyerProfile(controller.signal),
          getBuyerTransactions(controller.signal),
        ]);
        return { buyer, transactions };
      } catch {
        return { error: "Gagal memuat profil atau transaksi." };
      }
    }

    // Start browser-authenticated requests only after hydration. The server
    // and first client render both show the skeleton without suspending.
    const request = load();
    startTransition(() => setResult(request));
    return () => controller.abort();
  }, []);

  return (
    <Suspense fallback={<DashboardSkeleton variant="profile" />}>
      {result ? <ProfileContent result={result} /> : <DashboardSkeleton variant="profile" />}
    </Suspense>
  );
}

function ProfileContent({ result }: { result: Promise<ProfileResult> }) {
  const data = use(result);
  if (data.error !== undefined) {
    return <main className="container section" id="main-content"><p role="alert">{data.error}</p></main>;
  }
  return <BuyerProfile buyerId={data.buyer.id} buyer={data.buyer} transactions={data.transactions} />;
}
