import { useEffect, useRef } from "react";
import type * as L from "leaflet";
import { SENTINEL_WATCH_EVENTS } from "@/data/sentinelWatch";

// Same three zones used in the Colab backend - kept in sync manually.
// If the backend's zone boxes ever change, update here too.
const WATCH_ZONES = [
  { name: "Gulf of Khambhat / Gujarat Approach", lonMin: 71.8, lonMax: 72.8, latMin: 20.0, latMax: 21.0 },
  { name: "Mumbai Offshore Approach", lonMin: 72.5, lonMax: 73.2, latMin: 18.7, latMax: 19.3 },
  { name: "Goa / Mormugao Approach", lonMin: 73.7, lonMax: 73.9, latMin: 15.3, latMax: 15.5 },
];

// Same tile config as InvestigationMap.tsx, duplicated to keep this
// component standalone rather than modifying the existing map file.
const TILES = {
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "© Esri, Maxar, Earthstar Geographics",
    maxZoom: 19,
  },
};

function scoreColor(score: number): string {
  if (score >= 0.7) return "#a3e635"; // matches --lime used elsewhere for high confidence
  if (score >= 0.4) return "#facc15";
  return "#94a3b8";
}

export default function WatchMap({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const leaflet = (await import("leaflet")) as unknown as typeof L;
      if (cancelled || !containerRef.current || mapRef.current) return;

      // Centered/zoomed to show the full India west-coast span across all
      // three zones (~15.3N to 21N) - deliberately wider than InvestigationMap's
      // zoom 9, since this covers a coastline, not one incident site.
      const map = leaflet.map(containerRef.current, {
        center: [18.0, 72.8],
        zoom: 6,
        zoomControl: false,
        attributionControl: true,
        fadeAnimation: false,
        zoomAnimation: false,
        // FIX: page-scroll vs map-zoom conflict. Scroll-wheel zoom is off by
        // default so scrolling the page past the map behaves normally.
        // People can still zoom via the +/- buttons (bottomright) or by
        // double-clicking the map (Leaflet's default doubleClickZoom stays on).
        scrollWheelZoom: false,
      });

      leaflet
        .tileLayer(TILES.satellite.url, {
          attribution: TILES.satellite.attribution,
          maxZoom: TILES.satellite.maxZoom,
        })
        .addTo(map);

      leaflet.control.zoom({ position: "bottomright" }).addTo(map);

      // Draw each watch zone as an outlined rectangle, not a point -
      // these are regions, not single locations.
      WATCH_ZONES.forEach((zone) => {
        const bounds: L.LatLngBoundsExpression = [
          [zone.latMin, zone.lonMin],
          [zone.latMax, zone.lonMax],
        ];
        leaflet
          .rectangle(bounds, {
            color: "#38bdf8",
            weight: 1.5,
            fillOpacity: 0.05,
          })
          .bindTooltip(zone.name, { sticky: true })
          .addTo(map);
      });

      // Flagged vessels as circle markers, sized/colored by watch score.
      SENTINEL_WATCH_EVENTS.forEach((e) => {
        leaflet
          .circleMarker([e.lastLat, e.lastLon], {
            radius: 6 + e.watchScore * 6,
            color: scoreColor(e.watchScore),
            fillColor: scoreColor(e.watchScore),
            fillOpacity: 0.7,
            weight: 1,
          })
          .bindPopup(
            `<strong>${e.shipName}</strong><br/>` +
              `${e.vesselType} · ${e.zoneName}<br/>` +
              `Gap: ${e.gapDurationHours.toFixed(1)}h · Score: ${e.watchScore.toFixed(3)}`,
          )
          .addTo(map);
      });

      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className={`relative h-full w-full ${className}`}>
      <div ref={containerRef} className="h-full w-full" />
      <div className="pointer-events-none absolute bottom-3 left-3 rounded bg-background/80 px-2 py-1 text-[11px] text-muted-foreground">
        Scroll to move the page · use + / − or double-click to zoom the map
      </div>
    </div>
  );
}
