import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});
const spaceGrotesk = localFont({
  src: [
    { path: "./fonts/space-grotesk-medium.woff2", weight: "500" },
    { path: "./fonts/space-grotesk-bold.woff2", weight: "700" },
  ],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MMO Market — Your next adventure starts here",
    template: "%s | MMO Market",
  },
  description:
    "Temukan currency dan layanan boosting untuk game MMORPG favoritmu. Satu marketplace untuk petualangan berikutnya.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Lewati ke konten
        </a>
        {children}
      </body>
    </html>
  );
}
