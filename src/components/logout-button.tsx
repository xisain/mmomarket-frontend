"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";

export function LogoutButton({ onLoggedOut }: { onLoggedOut?: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      await logout();
      onLoggedOut?.();
      router.replace("/login");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Logout gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button type="button" className="neo-button small" disabled={loading} onClick={handleLogout}>
        {loading ? "Keluar…" : "Keluar"}
      </button>
      {error && <p role="alert" className="field-error">{error}</p>}
    </div>
  );
}
