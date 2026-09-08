import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import InvestigationMap from "@/components/map/InvestigationMap";
import {
  hindcast,
  hindcastSteps,
  stepLabel,
  fmtCoord,
} from "@/data/investigation";

export const Route = createFileRoute("/reconstruction")(
  {
    head: () => ({
      meta: [
        { title: "Reconstruction — backward hindcast | OceanTrace" },
        {
          name: "description",
          content:
            "24h backward particle drift reconstruction for confirmed oil slick OT-2026-0801-001.",
        },
      ],
    }),
    component: ReconstructionPage,
  },
);

function ReconstructionPage() {
  const [step, setStep] = useState(hindcastSteps.length - 1);
  const od = hindcast.origin_distribution;

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-8 py-5">
        <h1>Backward reconstruction</h1>
      <p className="mt-1 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
        24-hour backward particle hindcast — 100 particles advected through
        ocean current and wind fields over 25 time steps.
      </p>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Map */}
        <div className="relative flex-1">
          <InvestigationMap
            layers={{ slick: true, hindcast: true, forecast: false, vessels: false }}
            hindcastStep={step}
          />
        </div>

        {/* Sidebar panel */}
        <div className="w-[320px] shrink-0 overflow-y-auto border-l border-border bg-card p-6">
          <div>
            <div className="label-xs">Time step</div>
            <div className="mt-2 text-[15px] font-medium text-ink">{stepLabel(step)}</div>
            <input
              type="range"
              min={0}
              max={hindcastSteps.length - 1}
              value={step}
              onChange={(e) => setStep(Number(e.target.value))}
              className="mt-3 w-full accent-[var(--violet)]"
            />
            <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
              <span>24h before detection</span>
              <span>Now</span>
            </div>
          </div>

          <div className="mt-10">
            <div className="label-xs">Origin region centre</div>
            <div className="num mt-2 text-[17px] leading-snug text-ink">
              {fmtCoord(od.center.latitude, od.center.longitude)}
            </div>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              Read from the hindcast origin distribution — not derived from the
              detection coordinate.
            </p>
          </div>

          <dl className="mt-10 space-y-4 border-t border-border pt-6 text-[15px]">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Particles</dt>
              <dd className="num text-ink">
                {hindcast.particle_count} · {hindcast.time_steps} steps · {hindcast.duration_hours}h
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Origin points</dt>
              <dd className="num text-ink">{hindcast.origin_points.length}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Origin span</dt>
              <dd className="num mt-1 text-ink">
                {((od.latitude_max - od.latitude_min) * 111).toFixed(1)} km N–S
              </dd>
              <dd className="num mt-1 text-[13px] text-muted-foreground">
                {od.latitude_min.toFixed(6)}°–{od.latitude_max.toFixed(6)}° N
                <br />
                {od.longitude_min.toFixed(6)}°–{od.longitude_max.toFixed(6)}° E
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">This step</dt>
              <dd className="num text-ink">
                {hindcastSteps[step]?.particle_count ?? 0} particles
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
