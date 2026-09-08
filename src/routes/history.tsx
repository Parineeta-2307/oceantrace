import { createFileRoute } from "@tanstack/react-router";
import { INVESTIGATION_ID, relativeTime, fmtUTC } from "@/data/investigation";

export const Route = createFileRoute("/history")(
  {
    head: () => ({
      meta: [
        { title: "History — investigation log | OceanTrace" },
        {
          name: "description",
          content:
            "Complete investigation history and notification log for OT-2026-0801-001.",
        },
      ],
    }),
    component: HistoryPage,
  },
);

const EVENTS = [
  {
    t: "2026-08-01T02:22:03Z",
    title: "Fisher alert package ready",
    detail: "Advisory prepared for three harbour clusters.",
    type: "alert" as const,
  },
  {
    t: "2026-08-01T02:18:47Z",
    title: "Forecast complete",
    detail: "+6h, +12h, +24h and +48h horizons published.",
    type: "pipeline" as const,
  },
  {
    t: "2026-08-01T02:05:10Z",
    title: "Evidence available",
    detail: "Relative evidence scores computed for correlated vessels.",
    type: "pipeline" as const,
  },
  {
    t: "2026-08-01T01:48:20Z",
    title: "AIS correlation complete",
    detail: "AIS tracks correlated against the drift corridor and origin distribution.",
    type: "pipeline" as const,
  },
  {
    t: "2026-08-01T01:31:55Z",
    title: "Origin region resolved",
    detail: "24h backward hindcast completed with 100 particles over 25 time steps.",
    type: "pipeline" as const,
  },
  {
    t: "2026-08-01T01:14:02Z",
    title: "Ocean validation passed",
    detail: "Candidate validated against ocean mask and current field availability.",
    type: "pipeline" as const,
  },
  {
    t: "2026-08-01T01:09:40Z",
    title: "Slick confirmed",
    detail: "Look-alike screening passed; anomaly confirmed as an oil slick.",
    type: "confirm" as const,
  },
  {
    t: "2026-08-01T01:02:11Z",
    title: "SAR detection",
    detail: "Dark-patch anomaly detected in Sentinel-1 SAR scene at 20.125331° N, 72.732091° E.",
    type: "detect" as const,
  },
];

const typeBadge = (type: string) => {
  switch (type) {
    case "alert":
      return "bg-[var(--amber)]/10 text-[var(--amber)]";
    case "confirm":
      return "bg-[var(--lime)]/10 text-[var(--lime)]";
    case "detect":
      return "bg-[var(--coral)]/10 text-[var(--coral)]";
    default:
      return "bg-[var(--violet)]/10 text-[var(--violet)]";
  }
};

function HistoryPage() {
  return (
    <div className="mx-auto max-w-4xl px-8 py-8">
      <h1>Investigation history</h1>
      <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">
        Complete event log for investigation {INVESTIGATION_ID}.
      </p>

      <div className="mt-8">
        <ol className="relative border-l-2 border-border pl-8">
          {EVENTS.map((e) => (
            <li key={e.title} className="mb-8 last:mb-0">
              <span className="absolute -left-[7px] mt-1.5 size-3 rounded-full border-2 border-card bg-[var(--lime)]" />
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-medium text-ink">
                      {e.title}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${typeBadge(e.type)}`}
                    >
                      {e.type}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {e.detail}
                  </p>
                  <div className="num mt-1.5 text-[11px] text-muted-foreground">
                    {fmtUTC(e.t)} · {relativeTime(e.t)}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
