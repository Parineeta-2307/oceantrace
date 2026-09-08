import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import InvestigationMap, { type BasemapId } from "@/components/map/InvestigationMap";
import { BasemapControl } from "@/components/map/MapControls";
import GfwRankingTable from "@/components/vessels/GfwRankingTable";
import { useLiveFleet } from "@/data/liveFleet";
import { GFW_MATCH_COUNT } from "@/data/gfwAttribution";

export const Route = createFileRoute("/vessels")({
  head: () => ({
    meta: [
      { title: "Vessels — GFW attribution ranking | OceanTrace" },
      {
        name: "description",
        content:
          "Relative evidence ranking of GFW/OpenDrift candidate vessels for confirmed oil slick OT-2026-0801-001.",
      },
    ],
  }),
  component: VesselsPage,
});

function VesselsPage() {
  const { vessels, selectedId, hoveredId, setSelectedId, setHoveredId } = useLiveFleet();
  const [basemap, setBasemap] = useState<BasemapId>("satellite");

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <div className="border-b border-border bg-card px-8 py-5">
        <h1>Vessel attribution</h1>
        <p className="mt-1 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          {GFW_MATCH_COUNT} GFW candidate records in the reconstruction window. Ranked
          suspects on the map; click a marker or a table row for AIS detail.
        </p>
      </div>

      <div className="relative min-h-0 flex-1">
        <InvestigationMap
          layers={{ slick: true, hindcast: false, forecast: false, vessels: true }}
          vessels={vessels}
          selectedVesselId={selectedId}
          hoveredVesselId={hoveredId}
          onSelectVessel={setSelectedId}
          onHoverVessel={setHoveredId}
          zoom={9}
          basemap={basemap}
        />
        <div className="absolute right-3 top-3 z-[600] w-48">
          <BasemapControl value={basemap} onChange={setBasemap} />
        </div>
      </div>

      <div className="max-h-[38vh] shrink-0 overflow-y-auto">
        <GfwRankingTable />
      </div>
    </div>
  );
}
