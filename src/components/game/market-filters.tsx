"use client";

import { useId } from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";

type GameMarketFiltersProps = {
  regions: string[];
  servers: string[];
  region: string;
  server: string;
  minPrice: string;
  maxPrice: string;
  onRegionChange: (value: string) => void;
  onServerChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onReset: () => void;
};

export function GameMarketFilters({
  regions, servers, region, server, minPrice, maxPrice,
  onRegionChange, onServerChange, onMinPriceChange, onMaxPriceChange, onReset,
}: GameMarketFiltersProps) {
  const id = useId();

  return (
    <>
      <div className="neo-filter-header">
        <h3><SlidersHorizontal size={19} aria-hidden="true" /> Filter listing</h3>
        <button type="button" onClick={onReset} className="neo-reset">
          <RotateCcw size={14} aria-hidden="true" /> Reset
        </button>
      </div>
      <div className="neo-filter-group">
        <label htmlFor={`${id}-region`}>Region</label>
        <select id={`${id}-region`} value={region} onChange={(event) => onRegionChange(event.target.value)}>
          <option value="">Semua region</option>
          {regions.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
      </div>
      <div className="neo-filter-group">
        <label htmlFor={`${id}-server`}>Server</label>
        <select id={`${id}-server`} value={server} onChange={(event) => onServerChange(event.target.value)}>
          <option value="">Semua server</option>
          {servers.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
      </div>
      <fieldset className="neo-filter-group neo-price-fieldset">
        <legend>Rentang harga (Rp)</legend>
        <div className="neo-price-inputs">
          <div>
            <label htmlFor={`${id}-min`}>Minimum</label>
            <input id={`${id}-min`} type="number" min="0" inputMode="numeric" placeholder="0" value={minPrice} onChange={(event) => onMinPriceChange(event.target.value)} />
          </div>
          <div>
            <label htmlFor={`${id}-max`}>Maksimum</label>
            <input id={`${id}-max`} type="number" min="0" inputMode="numeric" placeholder="Tanpa batas" value={maxPrice} onChange={(event) => onMaxPriceChange(event.target.value)} />
          </div>
        </div>
      </fieldset>
    </>
  );
}
