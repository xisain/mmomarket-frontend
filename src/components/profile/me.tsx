import { ArrowUpRight, Mail, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import type { Buyer } from "@/lib/types/buyer";

export function Me({ buyer }: { buyer: Buyer }) {
  const initials = buyer.displayName
    .split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase();

  return (
    <div className="buyer-profile-grid">
      <section className="dash-panel" aria-labelledby="buyer-info-title">
        <div className="dash-panel-title">
          <div>
            <span className="section-kicker">KENALI AKUNMU</span>
            <h2 id="buyer-info-title">Informasi profil</h2>
          </div>
          <UserRound size={21} aria-hidden="true" />
        </div>
        <div className="buyer-identity">
          <span className="buyer-avatar" aria-hidden="true">{initials}</span>
          <div>
            <h3>{buyer.displayName}</h3>
            <span className="dash-status info"><span />Buyer</span>
          </div>
        </div>
        <dl className="buyer-fields">
          <div>
            <dt><UserRound size={16} />Nama tampilan</dt>
            <dd>{buyer.displayName}</dd>
          </div>
          <div>
            <dt><Mail size={16} />Alamat email</dt>
            <dd>{buyer.email}</dd>
          </div>
          <div>
            <dt><ShieldCheck size={16} />ID akun</dt>
            <dd className="buyer-mono">{buyer.id}</dd>
          </div>
        </dl>
      </section>
      <aside className="dash-panel dash-note-panel buyer-note">
        <span className="section-kicker">SIAP UNTUK QUEST BERIKUTNYA?</span>
        <span className="dash-note-symbol"><ShieldCheck size={32} aria-hidden="true" /></span>
        <h2>Satu akun.<br />Banyak petualangan.</h2>
        <p>
          Temukan currency dan layanan boosting untuk game favoritmu.
          Semua riwayat belanjamu tersimpan di menu Transaksi.
        </p>
        <Link className="dash-inline-link" href="/games">
          Jelajahi game <ArrowUpRight size={16} />
        </Link>
      </aside>
    </div>
  );
}
