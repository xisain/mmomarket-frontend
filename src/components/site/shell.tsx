import Link from "next/link";
import { ArrowUpRight, Gamepad2 } from "lucide-react";
import { Brand } from "@/components/brand";

export { Brand } from "@/components/brand";
export { SiteHeader } from "@/components/site/header";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <Brand />
          <p>
            Satu marketplace. Banyak dunia.
            <br />
            Petualangan berikutnya dimulai di sini.
          </p>
        </div>
        <div className="footer-links">
          <Link href="/games">Jelajahi game</Link>
          <Link href="/#how-it-works">Cara membeli</Link>
          <Link href="/#faq">Pusat bantuan</Link>
          <Link href="/seller/applications">
            Jadi seller <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 MMO Market.</span>
        <span>
          Built for players, by passion. <Gamepad2 size={15} />
        </span>
      </div>
    </footer>
  );
}
