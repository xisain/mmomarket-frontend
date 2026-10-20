import Link from "next/link";
import { Gamepad2 } from "lucide-react";

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="MMO Market — Beranda">
      <span className="brand-icon">
        <Gamepad2 size={24} strokeWidth={2.3} />
      </span>
      <span>
        MMO<span className="brand-light">market</span>
        <span className="brand-dot">.</span>
      </span>
    </Link>
  );
}
