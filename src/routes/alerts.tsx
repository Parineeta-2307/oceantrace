import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Check } from "lucide-react";
import { INVESTIGATION_COORDS, forecast, fmtCoord } from "@/data/investigation";

export const Route = createFileRoute("/alerts")(
  {
    head: () => ({
      meta: [
        { title: "Alerts — fisher alert package | OceanTrace" },
        {
          name: "description",
          content:
            "Fisher alert package and dispatch system for confirmed oil slick OT-2026-0801-001.",
        },
      ],
    }),
    component: AlertsPage,
  },
);

const ZONES = [
  { name: "Umbergaon coastal belt", boats: 128, eta: "+6h" },
  { name: "Valsad inshore grounds", boats: 214, eta: "+12h" },
  { name: "Daman offshore banks", boats: 96, eta: "+24h" },
];

function AlertsPage() {
  const [sent, setSent] = useState(false);
  const f = forecast.horizons["+24h"];

  return (
    <div className="mx-auto max-w-5xl px-8 py-8">
      <h1>Alerts</h1>
      <p className="mt-1 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
        Fisher alert advisory and coastal community notification system.
      </p>

      {/* Fisher alert package */}
      <div className="mt-8 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-3">
          <span className="label-xs">Fisher alert package</span>
          <span className="num text-[11px] font-semibold text-[var(--amber)]">
            READY
          </span>
        </div>
        <div className="grid gap-6 p-6 md:grid-cols-[1fr_280px]">
          <div>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              Advisory drafted for fishing communities inside the projected drift
              corridor. Coordinates reference the +24h forecast centre at{" "}
              <span className="num text-ink">
                {fmtCoord(f.latitude, f.longitude, 4)}
              </span>{" "}
              with a P95 uncertainty radius of{" "}
              <span className="num text-ink">
                {f.uncertainty_p95_km.toFixed(2)} km
              </span>
              .
            </p>

            <div className="mt-6">
              <div className="label-xs mb-3">Exposure zones</div>
              <div className="divide-y divide-border rounded-lg border border-border">
                {ZONES.map((z) => (
                  <div
                    key={z.name}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <span className="text-sm text-ink">{z.name}</span>
                    <span className="num text-[11px] text-muted-foreground">
                      {z.boats} boats · exposure {z.eta}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-5">
            <div className="label-xs">Dispatch</div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Sends the advisory, slick coordinates and forecast corridor to
              registered harbour contacts.
            </p>
            <button
              onClick={() => setSent(true)}
              disabled={sent}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--coral)] px-3 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-70"
            >
              {sent ? <Check className="size-4" /> : <Send className="size-4" />}
              {sent ? "Advisory dispatched" : "Dispatch fisher alert"}
            </button>
            <div className="num mt-3 text-[10px] text-muted-foreground">
              Slick origin{" "}
              {INVESTIGATION_COORDS.lat.toFixed(4)},{" "}
              {INVESTIGATION_COORDS.lng.toFixed(4)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
