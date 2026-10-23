"use client";

import { useId, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GameArt } from "@/components/game/art";
import { getGameArtwork } from "@/lib/game-presentation";

// Use different views of the available artwork until product photos are supplied.
const views = [
  { label: "Gambar utama", className: "neo-gallery-full" },
  { label: "Detail kiri", className: "neo-gallery-left" },
  { label: "Detail kanan", className: "neo-gallery-right" },
];

export function ListingGallery({ gameSlug, name }: { gameSlug: string; name: string }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const view = views[active];
  const variant = getGameArtwork(gameSlug);

  return (
    <section className="neo-product-gallery" aria-label={`Galeri ${name}`}>
      <div className="neo-gallery-stage">
        <div id={id} className={`neo-product-image ${view.className}`} role="img" aria-label={`${name} — ${view.label}`}>
          <GameArt variant={variant} />
        </div>
        <button className="neo-gallery-previous" type="button" aria-label="Gambar sebelumnya" aria-controls={id} onClick={() => setActive((active + views.length - 1) % views.length)}><ChevronLeft size={20} /></button>
        <button className="neo-gallery-next" type="button" aria-label="Gambar berikutnya" aria-controls={id} onClick={() => setActive((active + 1) % views.length)}><ChevronRight size={20} /></button>
        <span className="neo-gallery-counter" aria-live="polite">{active + 1} / {views.length}</span>
      </div>
      <div className="neo-gallery-thumbnails" role="group" aria-label="Pilih tampilan gambar">
        {views.map((item, index) => (
          <button key={item.className} type="button" className={`neo-gallery-thumbnail ${item.className}`} aria-label={item.label} aria-pressed={active === index} aria-controls={id} onClick={() => setActive(index)}>
            <GameArt variant={variant} />
          </button>
        ))}
      </div>
      <p className="neo-gallery-caption">Ilustrasi game · Thumbnail menampilkan detail artwork yang sama.</p>
    </section>
  );
}
