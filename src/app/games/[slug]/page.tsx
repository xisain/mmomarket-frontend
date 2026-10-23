import { Suspense } from "react";
import { redirect } from "next/navigation";

async function LegacyGame({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return redirect(`/game/${encodeURIComponent(slug)}`);
}

export default function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<main id="main-content" className="empty-state" role="status">Membuka kategori game…</main>}>
      <LegacyGame params={params} />
    </Suspense>
  );
}
