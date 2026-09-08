import { X } from "lucide-react";
import type { LiveVessel } from "@/data/vesselSimulation";
import { relativeTime } from "@/data/investigation";

const SIGNALS: { key: keyof LiveVessel["signals"]; label: string }[] = [
  { key: "spatialProximity", label: "Spatial proximity" },
  { key: "trajectoryConsistency", label: "Trajectory consistency" },
  { key: "temporalConsistency", label: "Temporal consistency" },
  { key: "persistence", label: "Persistence" },
  { key: "evidenceQuality", label: "Evidence quality" },
];

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-1.5 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="num text-sm text-ink">{value}</span>
    </div>
  );
}

export function VesselBody({ v }: { v: LiveVessel }) {
  const traffic = v.kind === "traffic";
  return (
    <div className="space-y-6">
      <div>
        <div className="label-xs mb-1">Identity</div>
        <Row label="Vessel name" value={v.name} />
        <Row label="IMO" value={v.imo} />
        <Row label="MMSI" value={v.mmsi} />
        <Row label="Callsign" value={v.callsign} />
        <Row label="Vessel type" value={v.type} />
        <Row label="Flag" value={v.flag} />
      </div>
      <div>
        <div className="label-xs mb-1">AIS position data</div>
        <Row label="Last known position" value={`${v.latitude.toFixed(5)}, ${v.longitude.toFixed(5)}`} />
        <Row label="Speed over ground (SOG)" value={`${v.sogKn.toFixed(1)} kn`} />
        <Row label="Course over ground (COG)" value={`${v.cogDeg}°`} />
        <Row label="Navigational status" value={v.navStatus} />
        <Row label="Distance to slick" value={`${v.distanceKm.toFixed(2)} km`} />
        <Row
          label="Last reported"
          value={relativeTime(new Date(v.lastReported).toISOString())}
        />
      </div>
      {traffic ? (
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          This track is live AIS outside the origin corridor. It is not ranked as a
          correlated suspect.
        </p>
      ) : (
        <div>
          <div className="label-xs mb-2">Evidence signals</div>
          <div className="mb-3 flex items-baseline gap-2">
            <span className="num text-3xl text-ink">{v.score.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">Relative Evidence Score</span>
          </div>
          <div className="space-y-2">
            {SIGNALS.map((s) => (
              <div key={s.key}>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="num text-ink">{v.signals[s.key]}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-[var(--violet)]"
                    style={{ width: `${v.signals[s.key]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function VesselDetail({
  vessel,
  onClose,
}: {
  vessel: LiveVessel;
  onClose: () => void;
}) {
  return (
    <aside className="fixed right-0 top-0 z-[900] flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-xl">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <div className="label-xs">
            {vessel.kind === "traffic" ? "Regional AIS" : "Suspect vessel"}
          </div>
          <div className="text-lg font-semibold text-ink" style={{ fontFamily: "var(--font-display)" }}>
            {vessel.name}
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-md border border-border p-1.5 text-muted-foreground hover:bg-accent"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <VesselBody v={vessel} />
      </div>
    </aside>
  );
}
