import { createFileRoute } from "@tanstack/react-router";
import Pipeline from "@/components/investigation/Pipeline";
import InvestigationTimeline from "@/components/investigation/InvestigationTimeline";
import {
  DETECTION,
  INVESTIGATION_COORDS,
  INVESTIGATION_ID,
  fmtCoord,
  fmtUTC,
  relativeTime,
} from "@/data/investigation";
import sarImage from "@/assets/sar-detection.png";

export const Route = createFileRoute("/investigation")(
  {
    head: () => ({
      meta: [
        { title: "Investigation — OceanTrace" },
        {
          name: "description",
          content:
            "Full investigation pipeline and timeline for confirmed oil slick OT-2026-0801-001.",
        },
      ],
    }),
    component: InvestigationPage,
  },
);

function InvestigationPage() {
  return (
    <div className="mx-auto max-w-5xl px-8 py-8">
      {/* Investigation header */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--coral)]/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--coral)]">
              Active investigation
            </span>
          </div>
          <h1 className="mt-3">
            Oil spill investigation — Gulf of Khambhat approach
          </h1>
          <p className="mt-2 max-w-xl text-[15px] text-muted-foreground">
            A confirmed slick observed by Sentinel-1 SAR, reconstructed
            backwards to an origin region and projected forward across four
            horizons.
          </p>
        </div>

        {/* SAR card */}
        <figure className="w-[200px] shrink-0 overflow-hidden rounded-xl border border-border bg-card">
          <img
            src={sarImage}
            alt="Sentinel-1 SAR image patch"
            className="aspect-square w-full object-cover"
            style={{ filter: "grayscale(1) contrast(1.25)" }}
          />
          <figcaption className="px-3 py-2">
            <div className="label-xs">SAR detection</div>
            <div className="num mt-0.5 text-[10px] text-muted-foreground">
              {fmtCoord(INVESTIGATION_COORDS.lat, INVESTIGATION_COORDS.lng, 6)}
            </div>
          </figcaption>
        </figure>
      </div>

      <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
        <span className="num text-ink">{INVESTIGATION_ID}</span>
        {" · "}
        {fmtCoord(INVESTIGATION_COORDS.lat, INVESTIGATION_COORDS.lng)}
        {" · "}
        {fmtUTC(DETECTION.timestamp)}
        {" · last reported "}
        {relativeTime(DETECTION.timestamp)}
        {" · "}
        <span className="font-medium text-[var(--lime)]">CONFIRMED</span>
      </p>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
        Spill age:{" "}
        <span className="font-medium uppercase tracking-wide text-ink">In progress</span>
        {" — "}
        automated slick-age estimation is being integrated.
      </p>

      {/* Full pipeline detail */}
      <div className="mt-12">
        <h2>Processing pipeline</h2>
        <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">
          9-stage investigation pipeline from SAR acquisition to alert dispatch.
        </p>
        <div className="mt-6">
          <Pipeline expanded />
        </div>
      </div>

      {/* Investigation timeline */}
      <div className="mt-14">
        <h2>Chronology</h2>
        <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">
          Key events in this investigation, ordered by timestamp.
        </p>
        <div className="mt-6">
          <InvestigationTimeline />
        </div>
      </div>
    </div>
  );
}
