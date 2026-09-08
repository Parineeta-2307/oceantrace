import { useState } from "react";
import { fmtUTC } from "@/data/investigation";

const EVENTS = [
  { t: "2026-08-01T01:02:11Z", title: "Detection", detail: "Dark-patch anomaly detected in Sentinel-1 SAR scene at 20.125331° N, 72.732091° E." },
  { t: "2026-08-01T01:09:40Z", title: "Confirmation", detail: "Look-alike screening passed; anomaly confirmed as an oil slick." },
  { t: "2026-08-01T01:14:02Z", title: "Ocean validation", detail: "Candidate validated against ocean mask and current field availability." },
  { t: "2026-08-01T01:31:55Z", title: "Backward reconstruction", detail: "24h hindcast with 100 particles over 25 steps; origin region resolved ~17 km west." },
  { t: "2026-08-01T01:48:20Z", title: "AIS correlation", detail: "AIS tracks correlated against the drift corridor and origin distribution." },
  { t: "2026-08-01T02:05:10Z", title: "Vessel attribution", detail: "Relative evidence scores computed. Evidence available, not a legal determination." },
  { t: "2026-08-01T02:18:47Z", title: "Forecast", detail: "Forward forecast produced at +6h, +12h, +24h, +48h with P95 uncertainty." },
  { t: "2026-08-01T02:22:03Z", title: "Response readiness", detail: "Fisher alert package prepared; investigation ready for dispatch." },
];

export default function InvestigationTimeline() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <ol className="relative border-l-2 border-border pl-6">
      {EVENTS.map((e) => (
        <li key={e.title} className="mb-6 last:mb-0">
          <span className="absolute -left-[6px] mt-1.5 size-2.5 rounded-full border-2 border-card bg-[var(--lime)]" />
          <button
            className="text-left"
            onClick={() => setOpen(open === e.title ? null : e.title)}
          >
            <div className="text-sm font-medium text-ink">{e.title}</div>
            <div className="num text-[11px] text-muted-foreground">{fmtUTC(e.t)}</div>
          </button>
          {open === e.title && (
            <p className="mt-1.5 max-w-lg text-sm text-muted-foreground leading-relaxed">{e.detail}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
