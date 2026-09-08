import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import InvestigationMap, { type BasemapId, type MapLayers } from "@/components/map/InvestigationMap";
import { BasemapControl, LayerToggleControl, MapLegend } from "@/components/map/MapControls";
import { useLiveFleet } from "@/data/liveFleet";
import {
  DETECTION,
  INVESTIGATION_COORDS,
  INVESTIGATION_ID,
  PIPELINE_STAGES,
  completedStageCount,
  fmtCoord,
  relativeTime,
} from "@/data/investigation";
import sarImage from "@/assets/sar-detection.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OceanTrace — confirmed oil slick investigation console" },
      {
        name: "description",
        content:
          "Live investigation console for a confirmed Sentinel-1 oil slick off the Gulf of Khambhat: origin reconstruction, vessel evidence and drift forecast.",
      },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { vessels, selectedId, hoveredId, setSelectedId, setHoveredId } = useLiveFleet();
  const [layers, setLayers] = useState<MapLayers>({
    slick: true,
    hindcast: false,
    forecast: false,
    vessels: true,
  });
  const [basemap, setBasemap] = useState<BasemapId>("satellite");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(id);
  }, []);

  const readyCount = PIPELINE_STAGES.length - completedStageCount;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between border-b border-border bg-card px-5 py-2">
        <div className="flex flex-wrap items-center gap-5 num text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 text-[var(--lime)]">
            <span className="inline-block size-1.5 animate-pulse rounded-full bg-[var(--lime)]" />
            AIS feed live
          </span>
          <span>{fmtCoord(INVESTIGATION_COORDS.lat, INVESTIGATION_COORDS.lng, 6)}</span>
          <span>Vessels tracked {vessels.length}</span>
          <span>Last refreshed {new Date(now).toISOString().slice(11, 19)} UTC</span>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <InvestigationMap
          layers={layers}
          vessels={vessels}
          selectedVesselId={selectedId}
          hoveredVesselId={hoveredId}
          onSelectVessel={setSelectedId}
          onHoverVessel={setHoveredId}
          zoom={9}
          basemap={basemap}
        />
        <div className="absolute right-3 top-3 z-[600] flex w-48 flex-col gap-2">
          <LayerToggleControl
            value={layers}
            onChange={setLayers}
            keys={["slick", "vessels"]}
          />
          <BasemapControl value={basemap} onChange={setBasemap} />
        </div>
        <MapLegend />

        <div className="absolute left-3 top-3 z-[600] w-[min(320px,calc(100%-1.5rem))] overflow-hidden rounded-lg border border-white/20 bg-card/95 shadow-lg backdrop-blur">
          <div className="px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--slick)]/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--slick)]">
                Active investigation
              </span>
              <span className="num text-[10px] text-muted-foreground">{INVESTIGATION_ID}</span>
            </div>
            <h2
              className="mt-2 text-[15px] font-semibold leading-snug text-ink"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Oil spill — Gulf of Khambhat approach
            </h2>
            <div className="mt-2 space-y-1 num text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-[var(--lime)]" />
                <span className="font-medium text-[var(--lime)]">CONFIRMED</span>
                <span>— oil slick</span>
              </div>
              <div>{fmtCoord(INVESTIGATION_COORDS.lat, INVESTIGATION_COORDS.lng, 6)}</div>
              <div>Last reported {relativeTime(DETECTION.timestamp, now)}</div>
            </div>
          </div>
          <div className="border-t border-border px-4 py-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] text-muted-foreground">
                {completedStageCount} of {PIPELINE_STAGES.length} stages complete · {readyCount} ready
              </span>
              <Link
                to="/investigation"
                className="shrink-0 text-[11px] font-medium text-[var(--slick)] hover:underline"
              >
                View pipeline →
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 left-3 z-[600] hidden w-[180px] overflow-hidden rounded-lg border border-white/20 bg-card/95 shadow-sm backdrop-blur sm:block">
          <img
            src={sarImage}
            alt="Sentinel-1 SAR detection patch"
            className="aspect-square w-full object-cover grayscale"
            style={{ filter: "grayscale(1) contrast(1.25)" }}
          />
          <div className="px-2.5 py-2">
            <div className="label-xs">SAR detection</div>
            <div className="num mt-0.5 text-[10px] text-muted-foreground">
              {fmtCoord(INVESTIGATION_COORDS.lat, INVESTIGATION_COORDS.lng, 6)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
