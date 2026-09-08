import hindcastRaw from "./backward_hindcast.json";
import forecastRaw from "./forecast.json";
import pipelineRaw from "./pipeline_status.json";
import vesselsRaw from "./vessels.json";
import evidenceRaw from "./evidence_report.json";

/**
 * THE single coordinate constant. Used everywhere: header, SAR card, map marker,
 * every export. No rounded stand-ins (19.5, 71.5, etc.) anywhere.
 */
export const INVESTIGATION_COORDS = { lat: 20.125331, lng: 72.732091 } as const;

export const INVESTIGATION_ID = "OT-2026-0801-001";

export const DETECTION = {
  latitude: INVESTIGATION_COORDS.lat,
  longitude: INVESTIGATION_COORDS.lng,
  timestamp: "2026-08-01T01:02:11Z",
  confirmation: "CONFIRMED" as const,
};

export type LatLon = { latitude: number; longitude: number };

export type HindcastStep = {
  time: string;
  hours_from_detection: number;
  particle_count: number;
  particles: LatLon[];
};

// Read hindcast directly — no coordinate offsets
export const hindcast = hindcastRaw as unknown as {
  status: string;
  duration_hours: number;
  particle_count: number;
  time_steps: number;
  trajectory: HindcastStep[];
  origin_distribution: {
    center: LatLon;
    latitude_min: number;
    latitude_max: number;
    longitude_min: number;
    longitude_max: number;
    particle_count: number;
  };
  origin_points: LatLon[];
};

export type Horizon = "+6h" | "+12h" | "+24h" | "+48h";

// Read forecast directly — no coordinate offsets
export const forecast = forecastRaw as unknown as {
  status: string;
  particle_count: number;
  horizons: Record<
    Horizon,
    {
      time: string;
      latitude: number;
      longitude: number;
      uncertainty_p95_km: number;
      particle_count: number;
    }
  >;
};

export const HORIZONS: Horizon[] = ["+6h", "+12h", "+24h", "+48h"];

export const pipelineStatus = pipelineRaw as Record<string, unknown>;
export const vesselsFile = vesselsRaw as { status: string; score_type: string; vessels: unknown[] };
export const evidenceReport = evidenceRaw as Record<string, unknown>;

/**
 * Trajectory quirk: the step at detection time is labelled hours_from_detection = 24,
 * and the earliest step (24h before detection) is labelled 0. We present ordered steps
 * with intuitive labels instead of the raw numbering.
 */
export const hindcastSteps = [...hindcast.trajectory].sort(
  (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
);

export function stepLabel(index: number) {
  const hoursBefore = hindcastSteps.length - 1 - index;
  if (hoursBefore === 0) return "Now";
  if (hoursBefore === 24) return "24h before detection";
  return `${hoursBefore}h before detection`;
}

export function fmtCoord(lat: number, lon: number, digits = 6) {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(digits)}° ${ns}, ${Math.abs(lon).toFixed(digits)}° ${ew}`;
}

export function fmtUTC(iso: string) {
  const d = new Date(iso.endsWith("Z") ? iso : iso + "Z");
  return d.toISOString().replace("T", " ").slice(0, 19) + " UTC";
}

export function relativeTime(iso: string, now: number = Date.now()) {
  const t = new Date(iso.endsWith("Z") ? iso : iso + "Z").getTime();
  const diff = Math.max(0, now - t);
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}

export const PIPELINE_STAGES = [
  { key: "ACQUIRE", status: "COMPLETED", note: "Sentinel-1 SAR scene acquired over the Gulf of Khambhat approach." },
  { key: "PREPROCESS", status: "COMPLETED", note: "Calibration, speckle filtering and land masking applied to the scene." },
  { key: "DETECT", status: "COMPLETED", note: "Dark-patch segmentation flagged a low-backscatter anomaly at the detection coordinate." },
  { key: "CONFIRM", status: "CONFIRMED", note: "Anomaly confirmed as an oil slick, not a look-alike (wind shadow / algal)." },
  { key: "RECONSTRUCT", status: "COMPLETED", note: "24h backward particle hindcast, 100 particles, 25 steps. Origin distribution available." },
  { key: "CORRELATE", status: "COMPLETED", note: "AIS tracks correlated against the origin region and drift corridor." },
  { key: "ATTRIBUTE", status: "EVIDENCE AVAILABLE", note: "Relative evidence scores computed per vessel. Not a legal determination." },
  { key: "FORECAST", status: "COMPLETED", note: "Forward forecast at +6h, +12h, +24h and +48h with P95 uncertainty." },
  { key: "ALERT", status: "READY", note: "Fisher alert package prepared and ready to dispatch." },
];

/** Only ALERT remains pending. CONFIRMED / EVIDENCE AVAILABLE count as progressed. */
export const isStageComplete = (status: string) => status !== "READY";

export const completedStageCount = PIPELINE_STAGES.filter((s) =>
  isStageComplete(s.status),
).length;
