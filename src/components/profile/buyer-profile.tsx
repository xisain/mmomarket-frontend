
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCheck,
  ClipboardList,
  Clock3,
  ShoppingBag,
  UserRound,
  Wallet,
  MessageCircle,
} from "lucide-react";

import { Brand } from "@/components/brand";
import { Me } from "@/components/profile/me";

import { Transaction } from "@/components/profile/transaction";

import type { Buyer, BuyerTransaction } from "@/lib/types/buyer";
import { formatPrice } from "@/lib/utils/format";

import "../dashboard.css";
import "./profile.css";

type BuyerTab = "profile" | "transactions" | "chat";

const tabs = [
  {
    id: "profile",
    title: "Profil saya",
    icon: UserRound,
  },
  {
    id: "transactions",
    title: "Transaksi",
    icon: ClipboardList,
  },
  {
    id: "chat",
    title: "Chat & Resolve",
    icon: MessageCircle,
  },
] as const;

interface BuyerProfileProps {
  buyerId: string;
  buyer: Buyer;
  transactions: BuyerTransaction[];
}

export function BuyerProfile({
  buyerId,
  buyer,
  transactions,
}: BuyerProfileProps) {
  const [tab, setTab] = useState<BuyerTab>("profile");

  const profile = {
    ...buyer,
    id: buyerId,
  };

  // Buyer initials
  const initials = buyer.displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  // Transaction filtering
  const completed = transactions.filter(
    (item) => item.status === "completed"
  );

  const active = transactions.filter((item) =>
    [
      "pending_payment",
      "paid",
      "processing",
      "delivered",
      "disputed",
    ].includes(item.status)
  );

  // Calculate total spending
  const spent = completed.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  // Current tab title
  const title = tabs.find((item) => item.id === tab)?.title ?? "Profil saya";

  // Dynamic page heading
  const pageContent = {
    profile: {
      title: `Halo, ${buyer.displayName.split(" ")[0]}.`,
      description:
        "Profil dan perjalanan belanjamu, dalam satu tempat.",
    },
    transactions: {
      title: "Transaksi saya.",
      description:
        "Pantau pesanan dan lihat kembali semua petualanganmu.",
    },
    chat: {
      title: "Chat & Resolve.",
      description:
        "Kelola percakapan, bantuan, dan penyelesaian masalah transaksi.",
    },
  };

  const currentPage = pageContent[tab];

  // Buyer stats
  const stats = [
    {
      label: "Total transaksi",
      value: transactions.length,
      note: "Seluruh riwayat belanja",
      icon: ClipboardList,
      color: "lavender",
    },
    {
      label: "Transaksi aktif",
      value: active.length,
      note: "Masih dalam perjalanan",
      icon: Clock3,
      color: "yellow",
    },
    {
      label: "Transaksi selesai",
      value: completed.length,
      note: "Petualangan terselesaikan",
      icon: CheckCheck,
      color: "green",
    },
    {
      label: "Total belanja",
      value: formatPrice(String(spent)),
      note: "Dari transaksi selesai",
      icon: Wallet,
      color: "pink",
    },
  ];

  return (
    <div className="dash-shell dash-buyer">
      {/* SIDEBAR */}
      <aside className="dash-sidebar">
        <Brand />

        <div className="dash-workspace">
          <span className="dash-workspace-icon">
            <ShoppingBag size={22} />
          </span>

          <div>
            <strong>Akun buyer</strong>
            <small>Ruang petualanganmu</small>
          </div>
        </div>

        <p className="dash-nav-label">AKUN SAYA</p>

        {/* NAVIGATION */}
        <nav
          className="dash-nav is-open"
          aria-label="Menu profil buyer"
        >
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              className={tab === item.id ? "active" : ""}
              aria-current={
                tab === item.id ? "page" : undefined
              }
              onClick={() => setTab(item.id)}
            >
              <item.icon size={18} />

              <span>{item.title}</span>

              {item.id === "transactions" && (
                <small>{transactions.length}</small>
              )}
            </button>
          ))}
        </nav>

        {/* SIDEBAR BOTTOM */}
        <div className="dash-sidebar-bottom">
          <Link href="/" className="dash-market-link">
            <ArrowLeft size={17} />
            Kembali ke marketplace
          </Link>

          <div className="dash-profile">
            <span className="dash-profile-avatar">
              {initials}
            </span>

            <div>
              <strong>{buyer.displayName}</strong>
              <small>Buyer</small>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN BODY */}
      <div className="dash-body">
        {/* TOPBAR */}
        <header className="dash-topbar">
          <span>
            Market / Akun saya / <strong>{title}</strong>
          </span>

          <Link href="/">
            Marketplace
            <ArrowUpRight size={15} />
          </Link>
        </header>

        <main className="dash-main" id="main-content">
          {/* PAGE HEADING */}
          <div className="dash-page-heading">
            <div>
              <span className="section-kicker">
                YOUR ADVENTURE HUB
              </span>

              <h1>{currentPage.title}</h1>

              <p>{currentPage.description}</p>
            </div>

            <span className="dash-role-tag">
              <ShoppingBag size={16} />
              BUYER SPACE
            </span>
          </div>

          {/* TRANSACTION STATS */}
          {tab !== "chat" && (
            <section
              className="dash-stats"
              aria-label="Ringkasan transaksi"
            >
              {stats.map((stat) => (
                <div
                  className={`dash-stat ${stat.color}`}
                  key={stat.label}
                >
                  <span className="dash-stat-label">
                    {stat.label}

                    <stat.icon
                      size={19}
                      aria-hidden="true"
                    />
                  </span>

                  <strong>{stat.value}</strong>

                  <span className="dash-stat-note">
                    {stat.note}
                  </span>
                </div>
              ))}
            </section>
          )}

          {/* TAB CONTENT */}
          {tab === "profile" && (
            <Me buyer={profile} />
          )}

          {tab === "transactions" && (
            <Transaction transactions={transactions} />
          )}

          {tab === "chat" && (
            <section className="dash-chat">
              <div className="dash-chat-empty">
                <div className="dash-chat-icon">
                  <MessageCircle
                    size={38}
                    strokeWidth={2.2}
                    aria-hidden="true"
                  />
                </div>
          
                <h2>YOUR CHAT HQ.</h2>
          
                <p>
                  Semua percakapan dengan seller dan penyelesaian
                  masalah transaksi akan tersedia di sini.
                  Komunikasi lebih mudah, transaksi lebih aman.
                </p>
          
                <div className="dash-chat-badge">
                  <Clock3 size={15} />
                  COMING SOON
                </div>
          
                <div className="dash-chat-decor" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </section>
          )}

          {/* FOOTER */}
          <footer className="dash-footer">
            <span>© 2026 MMO Market.</span>
            <span>Satu marketplace. Banyak dunia.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
