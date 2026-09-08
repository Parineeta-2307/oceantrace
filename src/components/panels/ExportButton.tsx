import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import {
  DETECTION,
  INVESTIGATION_COORDS,
  INVESTIGATION_ID,
  evidenceReport,
  forecast,
  hindcast,
  pipelineStatus,
  HORIZONS,
  fmtCoord,
} from "@/data/investigation";
import { GFW_RANKING } from "@/data/gfwAttribution";
import { snapshot } from "@/data/vesselSimulation";

function triggerDownload(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function evidencePayload() {
  return {
    ...evidenceReport,
    investigation_id: INVESTIGATION_ID,
    generated_at: new Date().toISOString(),
    detection: {
      latitude: INVESTIGATION_COORDS.lat,
      longitude: INVESTIGATION_COORDS.lng,
      timestamp: DETECTION.timestamp,
      confirmation: DETECTION.confirmation,
    },
    pipeline_status: pipelineStatus,
    backward_hindcast: {
      status: hindcast.status,
      duration_hours: hindcast.duration_hours,
      particle_count: hindcast.particle_count,
      time_steps: hindcast.time_steps,
      origin_distribution: hindcast.origin_distribution,
    },
    forward_forecast: forecast,
    vessel_attribution: {
      score_type: "Relative Evidence Score",
      disclaimer:
        "Relative ranking within the returned candidate set. Not a calibrated probability of responsibility.",
      vessels: GFW_RANKING,
    },
  };
}

function downloadJSON() {
  triggerDownload(
    `${INVESTIGATION_ID}-evidence-report.json`,
    new Blob([JSON.stringify(evidencePayload(), null, 2)], { type: "application/json" }),
  );
}

function downloadCSV() {
  const header = [
    "rank",
    "shipName",
    "vesselId",
    "relative_evidence_score",
    "confidence",
    "fusion_score",
    "matched_observations",
    "min_distance_km",
    "median_distance_km",
    "mmsi",
    "imo",
    "callsign",
    "flag",
  ];
  const rows = GFW_RANKING.map((v) =>
    [
      v.rank,
      v.shipName,
      v.vesselId,
      v.relative_evidence_score,
      v.confidence,
      v.fusion_score,
      v.matched_observations,
      v.min_distance_km,
      v.median_distance_km,
      v.mmsi,
      v.imo,
      v.callsign,
      v.flag,
    ].join(","),
  );
  const live = snapshot(Date.now());
  const liveHeader = ["name", "imo", "mmsi", "callsign", "latitude", "longitude", "sog_kn", "distance_km"];
  const liveRows = live.map((v) =>
    [v.name, v.imo, v.mmsi, v.callsign, v.latitude.toFixed(6), v.longitude.toFixed(6), v.sogKn.toFixed(1), v.distanceKm.toFixed(3)].join(","),
  );
  triggerDownload(
    `${INVESTIGATION_ID}-vessels.csv`,
    new Blob(
      [[header.join(","), ...rows].join("\n") + "\n\n" + [liveHeader.join(","), ...liveRows].join("\n")],
      { type: "text/csv" },
    ),
  );
}

function downloadReport() {
  const od = hindcast.origin_distribution;
  const horizons = HORIZONS.map((h) => {
    const fh = forecast.horizons[h];
    return `<tr><td>${h}</td><td>${fh.time}</td><td>${fmtCoord(fh.latitude, fh.longitude)}</td><td>${fh.uncertainty_p95_km.toFixed(3)} km</td></tr>`;
  }).join("");
  const vessels = GFW_RANKING.map(
    (v) =>
      `<tr><td>${v.rank}</td><td>${v.shipName}</td><td>${v.relative_evidence_score.toFixed(3)}</td><td>${v.confidence}</td><td>${v.imo}</td></tr>`,
  ).join("");
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${INVESTIGATION_ID} report</title>
<style>
  body { font: 15px/1.55 system-ui, sans-serif; color: #12222A; max-width: 720px; margin: 40px auto; }
  h1 { font-size: 22px; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0 28px; }
  th, td { text-align: left; border-bottom: 1px solid #c9dce1; padding: 8px 6px; font-size: 13px; }
</style></head><body>
<h1>OceanTrace investigation report</h1>
<p>${INVESTIGATION_ID}</p>
<p>Detection ${fmtCoord(INVESTIGATION_COORDS.lat, INVESTIGATION_COORDS.lng)} · ${DETECTION.timestamp} · ${DETECTION.confirmation}</p>
<h2>Origin distribution</h2>
<p>Centre ${fmtCoord(od.center.latitude, od.center.longitude)} · ${hindcast.particle_count} particles · ${hindcast.time_steps} steps</p>
<h2>Forecast</h2>
<table><thead><tr><th>Horizon</th><th>Time</th><th>Centre</th><th>P95</th></tr></thead><tbody>${horizons}</tbody></table>
<h2>GFW relative ranking</h2>
<table><thead><tr><th>Rank</th><th>Ship</th><th>Score</th><th>Confidence</th><th>IMO</th></tr></thead><tbody>${vessels}</tbody></table>
<p>These are relative scores within the returned candidate set, not calibrated probabilities of responsibility.</p>
</body></html>`;
  const w = window.open("", "_blank");
  if (!w) {
    triggerDownload(
      `${INVESTIGATION_ID}-report.html`,
      new Blob([html], { type: "text/html" }),
    );
    return;
  }
  w.document.write(html);
  w.document.close();
  w.focus();
  w.print();
}

function downloadMapSnapshot() {
  const w = 900;
  const h = 640;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const od = hindcast.origin_distribution;
  const lats = [INVESTIGATION_COORDS.lat, od.latitude_min, od.latitude_max, ...HORIZONS.map((hz) => forecast.horizons[hz].latitude)];
  const lngs = [INVESTIGATION_COORDS.lng, od.longitude_min, od.longitude_max, ...HORIZONS.map((hz) => forecast.horizons[hz].longitude)];
  const minLat = Math.min(...lats) - 0.02;
  const maxLat = Math.max(...lats) + 0.02;
  const minLng = Math.min(...lngs) - 0.04;
  const maxLng = Math.max(...lngs) + 0.04;
  const sx = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * w;
  const sy = (lat: number) => h - ((lat - minLat) / (maxLat - minLat)) * h;
  ctx.fillStyle = "#073042";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#7ae0ff";
  ctx.strokeRect(sx(od.longitude_min), sy(od.latitude_max), sx(od.longitude_max) - sx(od.longitude_min), sy(od.latitude_min) - sy(od.latitude_max));
  ctx.fillStyle = "#e10600";
  ctx.beginPath();
  ctx.arc(sx(INVESTIGATION_COORDS.lng), sy(INVESTIGATION_COORDS.lat), 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "14px ui-monospace, monospace";
  ctx.fillText(`${INVESTIGATION_ID}  ${fmtCoord(INVESTIGATION_COORDS.lat, INVESTIGATION_COORDS.lng)}`, 24, 28);
  canvas.toBlob((blob) => {
    if (blob) triggerDownload(`${INVESTIGATION_ID}-map-snapshot.png`, blob);
  });
}

const ACTIONS = [
  { label: "PDF report…", run: downloadReport },
  { label: "JSON evidence", run: downloadJSON },
  { label: "CSV vessel data", run: downloadCSV },
  { label: "Map snapshot", run: downloadMapSnapshot },
];

export default function ExportButton() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={wrapRef} className="relative z-[2000]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-ink hover:bg-accent"
      >
        <Download className="size-3.5" /> Export
      </button>
      {open && (
        <div className="absolute right-0 top-full z-[2000] mt-1 w-52 overflow-hidden rounded-md border border-border bg-card py-1 shadow-lg">
          {ACTIONS.map((a) => (
            <button
              key={a.label}
              type="button"
              className="block w-full px-3 py-2 text-left text-[13px] text-ink hover:bg-accent"
              onClick={() => {
                a.run();
                setOpen(false);
              }}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
