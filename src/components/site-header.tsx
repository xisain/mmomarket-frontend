"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X, UserRound } from "lucide-react";
import { Brand } from "@/components/brand";
import { ApiError } from "@/lib/api";
import { getCurrentUser, type CurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
import { sellerDashboardHref } from "@/lib/seller";

type Session =
  | { status: "loading" }
  | { status: "guest" }
  | { status: "authenticated"; user: CurrentUser }
  | { status: "error" };

export function SiteHeader({ minimal = false }: { minimal?: boolean }) {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<Session>({ status: "loading" });
  const seller = session.status === "authenticated" ? session.user.seller : null;
  const sellerHref = sellerDashboardHref(seller);
  const sellerLabel = sellerHref ? "Dashboard seller" : "Mulai jualan";

  function sellerAction(mobile = false) {
    if (seller?.status === "pending") {
      return <span className="seller-link" role="status">Pengajuan seller menunggu review</span>;
    }
    return <Link className={mobile ? undefined : "seller-link"} href={sellerHref ?? "/seller/applications"}>
      {sellerLabel} {!mobile && <ArrowUpRight size={15} />}
    </Link>;
  }

  useEffect(() => {
    const controller = new AbortController();

    getCurrentUser(controller.signal)
      .then((user) => {
        if (!controller.signal.aborted) {
          setSession({ status: "authenticated", user });
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setSession({
          status: error instanceof ApiError && error.status === 401
            ? "guest"
            : "error",
        });
      });

    return () => controller.abort();
  }, []);

  function accountActions() {
    if (session.status === "loading") {
      return <span role="status">Memuat akun…</span>;
    }

    if (session.status === "authenticated") {
      return (
        <>
          <Link
            className="header-user"
            href={`/profile/${encodeURIComponent(String(session.user.id))}`}
            title="Buka profil dan transaksi"
          >
            <UserRound size={18} aria-hidden="true" />
            <span>{session.user.display_name || session.user.email}</span>
          </Link>
          <LogoutButton onLoggedOut={() => setSession({ status: "guest" })} />
        </>
      );
    }

    return (
      <>
        {session.status === "error" && (
          <span role="status">Akun belum dapat dimuat.</span>
        )}
        <Link className="login-link" href="/login">Masuk</Link>
        <Link className="neo-button small" href="/register">
          Daftar gratis <ArrowUpRight size={16} />
        </Link>
      </>
    );
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        {!minimal && (
          <nav className="desktop-nav" aria-label="Navigasi utama">
            <Link href="/#games">Jelajahi game</Link>
            <Link href="/#offers">Kategori</Link>
            <Link href="/#how-it-works">Cara kerja</Link>
          </nav>
        )}
        <div className="header-actions">
          {sellerAction()}
          {accountActions()}
        </div>
        <button
          className="icon-button mobile-toggle"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Navigasi mobile"
          onClick={(event) => {
            if (event.target instanceof Element && event.target.closest("a")) {
              setOpen(false);
            }
          }}
        >
          <Link href="/#games">Jelajahi game</Link>
          <Link href="/#offers">Kategori</Link>
          <Link href="/#how-it-works">Cara kerja</Link>
          {sellerAction(true)}
          {accountActions()}
        </nav>
      )}
    </header>
  );
}
