import { createFileRoute } from "@tanstack/react-router";
import { forecast } from "@/data/investigation";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — environmental impact estimates | OceanTrace" },
      {
        name: "description",
        content:
          "Environmental and community impact scenario modeling for confirmed oil slick OT-2026-0801-001.",
      },
    ],
  }),
  component: AnalyticsPage,
});

const RECEPTORS = [
  {
    name: "Umbergaon–Daman shoreline",
    exposure: "≈ 38 km of coast in the +48h envelope",
  },
  {
    name: "Small-craft fishing effort",
    exposure: "438 registered boats across three harbour clusters",
  },
  {
    name: "Intertidal mudflat",
    exposure: "Sensitive habitat inside the drift corridor",
  },
  {
    name: "Mangrove fringe",
    exposure: "Second sensitive receptor, same corridor",
  },
];

function AnalyticsPage() {
  const f48 = forecast.horizons["+48h"];

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <div className="flex flex-wrap items-center gap-3">
        <h1>Analytics</h1>
        <span className="inline-flex items-center rounded-full border border-[var(--amber)]/30 bg-[var(--amber)]/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--amber)]">
          Estimated
        </span>
        <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Scenario model
        </span>
      </div>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
        Exposure figures below are a planning scenario drawn from the forecast
        corridor. They are not field measurements.
      </p>

      <section className="mt-10">
        <h2>Response window</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink">
          Containment is most effective before the slick disperses beyond the +24h
          P95 radius. At +48h the envelope reaches{" "}
          <span className="num text-ink">{f48.uncertainty_p95_km.toFixed(2)} km</span>
          .
        </p>
      </section>

      <section className="mt-12">
        <h2>Receptors in the corridor</h2>
        <div className="mt-5 divide-y divide-border border-y border-border">
          {RECEPTORS.map((r) => (
            <div key={r.name} className="flex items-baseline justify-between gap-8 py-4">
              <div className="text-[15px] font-medium text-ink">{r.name}</div>
              <div className="max-w-xs text-right text-sm text-muted-foreground">
                {r.exposure}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
