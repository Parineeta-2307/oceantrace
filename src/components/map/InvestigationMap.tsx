import { useEffect, useRef, useState } from "react";
import type * as L from "leaflet";
import {
  DETECTION,
  INVESTIGATION_COORDS,
  HORIZONS,
  forecast,
  hindcast,
  hindcastSteps,
  type Horizon,
} from "@/data/investigation";
import type { LiveVessel } from "@/data/vesselSimulation";

export type MapLayers = {
  slick: boolean;
  hindcast: boolean;
  forecast: boolean;
  vessels: boolean;
};

export type BasemapId = "satellite" | "streets";

type Props = {
  layers?: Partial<MapLayers>;
  hindcastStep?: number;
  horizon?: Horizon;
  vessels?: LiveVessel[];
  selectedVesselId?: string | null;
  hoveredVesselId?: string | null;
  onSelectVessel?: (id: string) => void;
  onHoverVessel?: (id: string | null) => void;
  mode?: "live" | "hindcast-figure" | "forecast-figure";
  showReadout?: boolean;
  className?: string;
  zoom?: number;
  basemap?: BasemapId;
};

const TILES: Record<BasemapId, { url: string; attribution: string; maxZoom: number }> = {
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "© Esri, Maxar, Earthstar Geographics",
    maxZoom: 19,
  },
  streets: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: "© OpenStreetMap contributors © Esri",
    maxZoom: 19,
  },
};

const SLICK_RADIUS_M = 8500;

export default function InvestigationMap({
  layers,
  hindcastStep = hindcastSteps.length - 1,
  horizon = "+24h",
  vessels = [],
  selectedVesselId = null,
  hoveredVesselId = null,
  onSelectVessel,
  onHoverVessel,
  mode = "live",
  showReadout = true,
  className = "",
  zoom,
  basemap = "satellite",
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const LRef = useRef<typeof L | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const groups = useRef<{
    slick: L.LayerGroup | null;
    hindcast: L.LayerGroup | null;
    forecast: L.LayerGroup | null;
    vessels: L.LayerGroup | null;
  }>({ slick: null, hindcast: null, forecast: null, vessels: null });
  const [ready, setReady] = useState(false);
  const [cursor, setCursor] = useState<{ lat: number; lng: number; x: number; y: number } | null>(null);

  const on: MapLayers = {
    slick: true,
    hindcast: mode !== "forecast-figure",
    forecast: mode !== "hindcast-figure",
    vessels: mode === "live",
    ...layers,
  };

  const defaultZoom = zoom ?? (mode === "live" ? 9 : 10);

  useEffect(() => {
    let cancelled = false;
    let onResize: (() => void) | undefined;
    (async () => {
      const leaflet = (await import("leaflet")) as unknown as typeof L;
      if (cancelled || !containerRef.current || mapRef.current) return;
      LRef.current = leaflet;
      const interactive = mode === "live";
      const map = leaflet.map(containerRef.current, {
        center: [INVESTIGATION_COORDS.lat, INVESTIGATION_COORDS.lng - 0.18],
        zoom: defaultZoom,
        zoomControl: false,
        scrollWheelZoom: interactive,
        dragging: interactive,
        doubleClickZoom: interactive,
        boxZoom: interactive,
        keyboard: interactive,
        attributionControl: true,
        fadeAnimation: false,
        zoomAnimation: false,
        markerZoomAnimation: false,
      });

      const style = TILES[basemap];
      tileRef.current = leaflet
        .tileLayer(style.url, {
          attribution: style.attribution,
          maxZoom: style.maxZoom,
        })
        .addTo(map);

      if (interactive) {
        leaflet.control.zoom({ position: "bottomright" }).addTo(map);
      }

      map.on("mousemove", (e: L.LeafletMouseEvent) =>
        setCursor({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          x: e.containerPoint.x,
          y: e.containerPoint.y,
        }),
      );
      map.on("mouseout", () => setCursor(null));
      mapRef.current = map;
      (Object.keys(groups.current) as Array<keyof typeof groups.current>).forEach((k) => {
        groups.current[k] = leaflet.layerGroup().addTo(map);
      });
      if (cancelled) {
        map.remove();
        return;
      }
      const invalidate = () => map.invalidateSize();
      onResize = invalidate;
      setTimeout(invalidate, 60);
      window.addEventListener("resize", invalidate);
      setReady(true);
    })();
    return () => {
      cancelled = true;
      if (onResize) window.removeEventListener("resize", onResize);
      mapRef.current?.remove();
      mapRef.current = null;
      tileRef.current = null;
    };
  }, [mode, defaultZoom]);

  useEffect(() => {
    const l = LRef.current;
    const map = mapRef.current;
    if (!ready || !l || !map) return;
    const style = TILES[basemap];
    tileRef.current?.remove();
    tileRef.current = l
      .tileLayer(style.url, {
        attribution: style.attribution,
        maxZoom: style.maxZoom,
      })
      .addTo(map);
    tileRef.current.bringToBack();
  }, [basemap, ready]);

  useEffect(() => {
    const l = LRef.current;
    const g = groups.current.slick;
    if (!ready || !l || !g) return;
    g.clearLayers();
    if (!on.slick) return;

    l.circle([DETECTION.latitude, DETECTION.longitude], {
      radius: SLICK_RADIUS_M * 1.7,
      color: "#ff4d4d",
      weight: 1,
      dashArray: "6 6",
      fillColor: "#ff2d2d",
      fillOpacity: 0.16,
      interactive: false,
    }).addTo(g);

    l.circle([DETECTION.latitude, DETECTION.longitude], {
      radius: SLICK_RADIUS_M,
      color: "#ff2a2a",
      weight: 2.5,
      fillColor: "#ff1f1f",
      fillOpacity: 0.38,
      interactive: false,
    })
      .bindTooltip("Confirmed oil slick", { direction: "top" })
      .addTo(g);

    l.circleMarker([DETECTION.latitude, DETECTION.longitude], {
      radius: 6,
      color: "#fff4f0",
      weight: 2,
      fillColor: "#e10600",
      fillOpacity: 1,
    }).addTo(g);
  }, [ready, on.slick]);

  useEffect(() => {
    const l = LRef.current;
    const g = groups.current.hindcast;
    if (!ready || !l || !g) return;
    g.clearLayers();
    if (!on.hindcast) return;
    const od = hindcast.origin_distribution;
    l.rectangle(
      [
        [od.latitude_min, od.longitude_min],
        [od.latitude_max, od.longitude_max],
      ],
      {
        color: "#7ae0ff",
        weight: 1.5,
        dashArray: "4 4",
        fillColor: "#3ec6ff",
        fillOpacity: 0.08,
      },
    ).addTo(g);

    if (mode === "hindcast-figure") {
      hindcastSteps.forEach((step, i) => {
        const opacity = 0.06 + (i / hindcastSteps.length) * 0.12;
        step.particles.forEach((p) => {
          l.circleMarker([p.latitude, p.longitude], {
            radius: 1.4,
            stroke: false,
            fillColor: "#7ae0ff",
            fillOpacity: opacity,
            interactive: false,
          }).addTo(g);
        });
      });
    } else {
      const currentStep = hindcastSteps[Math.min(hindcastStep, hindcastSteps.length - 1)];
      if (currentStep) {
        currentStep.particles.forEach((p) => {
          l.circleMarker([p.latitude, p.longitude], {
            radius: 2.4,
            stroke: false,
            fillColor: "#7ae0ff",
            fillOpacity: 0.7,
            interactive: false,
          }).addTo(g);
        });
      }
    }

    hindcast.origin_points.forEach((p) => {
      l.circleMarker([p.latitude, p.longitude], {
        radius: 1.6,
        stroke: false,
        fillColor: "#c4f1ff",
        fillOpacity: 0.5,
        interactive: false,
      }).addTo(g);
    });
    l.circleMarker([od.center.latitude, od.center.longitude], {
      radius: 5,
      color: "#7ae0ff",
      weight: 2,
      fillColor: "#ffffff",
      fillOpacity: 1,
    })
      .bindTooltip("Estimated origin region centre", { direction: "top" })
      .addTo(g);
  }, [ready, on.hindcast, hindcastStep, mode]);

  useEffect(() => {
    const l = LRef.current;
    const g = groups.current.forecast;
    if (!ready || !l || !g) return;
    g.clearLayers();
    if (!on.forecast) return;
    const list: Horizon[] = mode === "forecast-figure" ? HORIZONS : [horizon];
    list.forEach((h) => {
      const f = forecast.horizons[h];
      l.circle([f.latitude, f.longitude], {
        radius: f.uncertainty_p95_km * 1000,
        color: "#ffb020",
        weight: 1.4,
        fillColor: "#ffc857",
        fillOpacity: 0.12,
        interactive: false,
      }).addTo(g);
      l.circleMarker([f.latitude, f.longitude], {
        radius: 4,
        color: "#ffb020",
        weight: 2,
        fillColor: "#fff7ed",
        fillOpacity: 1,
      })
        .bindTooltip(`${h} · P95 ${f.uncertainty_p95_km.toFixed(2)} km`, {
          direction: "top",
          permanent: mode === "forecast-figure",
          className: "num",
        })
        .addTo(g);
    });
  }, [ready, on.forecast, horizon, mode]);

  useEffect(() => {
    const l = LRef.current;
    const g = groups.current.vessels;
    if (!ready || !l || !g) return;
    g.clearLayers();
    if (!on.vessels) return;
    vessels.forEach((v) => {
      const active = v.id === selectedVesselId || v.id === hoveredVesselId;
      const traffic = v.kind === "traffic";
      let color = "#38bdf8";
      if (!traffic) {
        if (v.score >= 80) color = "#ff3b30";
        else if (v.score >= 60) color = "#ff9f0a";
        else color = "#bf5af2";
      }

      const size = active ? 26 : 20;
      const icon = l.divIcon({
        className: "",
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        html: `<div style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;transform:rotate(${v.cogDeg}deg);transition:transform .6s linear;filter:drop-shadow(0 0 4px ${color})">
          <svg width="${size}" height="${size}" viewBox="0 0 24 24"><path d="M12 2 L16 8 L16 22 L8 22 L8 8 Z" fill="${color}" stroke="#ffffff" stroke-width="${active ? 2 : 1.3}" stroke-linejoin="round"/></svg></div>`,
      });
      const m = l.marker([v.latitude, v.longitude], { icon, riseOnHover: true, zIndexOffset: active ? 800 : traffic ? 100 : 400 }).addTo(g);
      m.bindTooltip(`${v.name} · ${v.sogKn.toFixed(1)} kn`, { direction: "top" });
      m.on("click", () => onSelectVessel?.(v.id));
      m.on("mouseover", () => onHoverVessel?.(v.id));
      m.on("mouseout", () => onHoverVessel?.(null));
    });
  }, [ready, on.vessels, vessels, selectedVesselId, hoveredVesselId, onSelectVessel, onHoverVessel]);

  return (
    <div className={`relative h-full w-full ${className}`}>
      <div ref={containerRef} className="h-full w-full" />
      {cursor && (
        <div
          className="pointer-events-none absolute z-[650] -translate-x-1/2 rounded-md border border-white/20 bg-ink/80 px-2 py-1 num text-[11px] text-white shadow-lg"
          style={{ left: cursor.x, top: cursor.y + 18 }}
        >
          {cursor.lat.toFixed(6)}° N, {cursor.lng.toFixed(6)}° E
        </div>
      )}
    </div>
  );
}
