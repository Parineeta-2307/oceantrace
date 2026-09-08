import { useState } from "react";
import { ChevronDown, Layers, Info, Map as MapIcon } from "lucide-react";
import type { BasemapId, MapLayers } from "./InvestigationMap";

const LAYER_ITEMS: { key: keyof MapLayers; label: string }[] = [
  { key: "slick", label: "Slick zone" },
  { key: "hindcast", label: "Backward hindcast" },
  { key: "forecast", label: "Forecast" },
  { key: "vessels", label: "Vessels" },
];

export function LayerToggleControl({
  value,
  onChange,
  keys,
}: {
  value: MapLayers;
  onChange: (v: MapLayers) => void;
  keys?: Array<keyof MapLayers>;
}) {
  const [open, setOpen] = useState(true);
  const items = keys
    ? LAYER_ITEMS.filter((it) => keys.includes(it.key))
    : LAYER_ITEMS;
  return (
    <div className="overflow-hidden rounded-lg border border-white/15 bg-card/95 shadow-sm backdrop-blur">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-3 py-2 label-xs hover:bg-accent"
      >
        <span className="flex items-center gap-1.5">
          <Layers className="size-3.5" /> Layers
        </span>
        <ChevronDown className={`size-3.5 ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && (
        <div className="border-t border-border p-1">
          {items.map((it) => (
            <label
              key={it.key}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent"
            >
              <input
                type="checkbox"
                className="accent-[var(--slick)]"
                checked={value[it.key]}
                onChange={(e) => onChange({ ...value, [it.key]: e.target.checked })}
              />
              {it.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export function BasemapControl({
  value,
  onChange,
}: {
  value: BasemapId;
  onChange: (v: BasemapId) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/15 bg-card/95 shadow-sm backdrop-blur">
      <div className="flex items-center gap-1.5 px-3 py-2 label-xs">
        <MapIcon className="size-3.5" /> Basemap
      </div>
      <div className="grid grid-cols-2 gap-1 border-t border-border p-1.5">
        {(
          [
            ["satellite", "Satellite"],
            ["streets", "Streets"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`rounded-md px-2 py-1.5 text-[12px] font-medium ${
              value === id ? "bg-[var(--ocean)] text-white" : "text-ink hover:bg-accent"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MapLegend() {
  const [open, setOpen] = useState(true);
  return (
    <div className="absolute right-3 bottom-3 z-[600] w-56 overflow-hidden rounded-lg border border-white/15 bg-card/95 shadow-sm backdrop-blur">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-3 py-2 label-xs hover:bg-accent"
      >
        <span className="flex items-center gap-1.5">
          <Info className="size-3.5" /> Legend
        </span>
        <ChevronDown className={`size-3.5 ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && (
        <ul className="space-y-1.5 border-t border-border p-3 text-xs text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="inline-block size-3 rounded-full bg-[#ff2a2a]" /> Confirmed slick zone
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block size-3 rounded-full bg-[#7ae0ff]" /> Hindcast / origin
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block size-3 rounded-full bg-[#ffb020]" /> Forecast envelope
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block size-3 bg-[#ff3b30]" style={{ clipPath: "polygon(50% 0,100% 100%,50% 75%,0 100%)" }} /> Suspect vessel
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block size-3 bg-[#38bdf8]" style={{ clipPath: "polygon(50% 0,100% 100%,50% 75%,0 100%)" }} /> Regional AIS
          </li>
        </ul>
      )}
    </div>
  );
}
