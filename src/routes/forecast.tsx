import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import InvestigationMap from "@/components/map/InvestigationMap";
import {
  HORIZONS,
  forecast,
  fmtCoord,
  fmtUTC,
  type Horizon,
} from "@/data/investigation";

export const Route = createFileRoute("/forecast")({
  head: () => ({
    meta: [
      { title: "Forecast — forward drift projection | OceanTrace" },
      {
        name: "description",
        content:
          "Forward drift forecast at +6h, +12h, +24h and +48h for confirmed oil slick OT-2026-0801-001.",
      },
    ],
  }),
  component: ForecastPage,
});

function ForecastPage() {
  const [horizon, setHorizon] = useState<Horizon>("+24h");
  const f = forecast.horizons[horizon];
  const max = Math.max(...HORIZONS.map((h) => forecast.horizons[h].uncertainty_p95_km));

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-border bg-card px-8 py-5">
        <h1>Forward forecast</h1>
        <p className="mt-1 max-w-2xl text-[15px] text-muted-foreground">
          Drift projection at four horizons with P95 uncertainty envelopes. Step
          the horizon — nothing auto-plays.
        </p>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-px border-b border-border bg-border lg:grid-cols-4">
        {HORIZONS.map((h) => {
          const fh = forecast.horizons[h];
          const selected = h === horizon;
          return (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`bg-card px-5 py-4 text-left transition-colors ${
                selected ? "bg-[var(--coral)]/6" : "hover:bg-accent/60"
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="num text-sm font-semibold text-ink">{h}</span>
                <span className="num text-[11px] text-muted-foreground">
                  {fh.uncertainty_p95_km.toFixed(3)} km
                </span>
              </div>
              <div className="num mt-2 text-[11px] text-muted-foreground">
                {fmtCoord(fh.latitude, fh.longitude, 6)}
              </div>
              <div className="num mt-0.5 text-[11px] text-muted-foreground">{fmtUTC(fh.time)}</div>
            </button>
          );
        })}
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="relative min-w-0 flex-1">
          <InvestigationMap
            layers={{ slick: true, hindcast: false, forecast: true, vessels: false }}
            horizon={horizon}
          />
        </div>

        <aside className="w-[280px] shrink-0 overflow-y-auto border-l border-border bg-card p-6">
          <div className="label-xs">Selected horizon</div>
          <div className="mt-2 num text-2xl text-ink">{horizon}</div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Centre {fmtCoord(f.latitude, f.longitude, 6)}. P95 envelope{" "}
            <span className="num text-ink">{f.uncertainty_p95_km.toFixed(3)} km</span>.
          </p>

          <div className="mt-8">
            <div className="label-xs">Uncertainty growth</div>
            <div className="mt-4 space-y-3">
              {HORIZONS.map((h) => {
                const fh = forecast.horizons[h];
                return (
                  <div key={h}>
                    <div className="flex justify-between text-xs">
                      <span className="num text-muted-foreground">{h}</span>
                      <span className="num text-ink">{fh.uncertainty_p95_km.toFixed(2)} km</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(fh.uncertainty_p95_km / max) * 100}%`,
                          backgroundColor: h === horizon ? "var(--coral)" : "var(--amber)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
