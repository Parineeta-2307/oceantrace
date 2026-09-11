import { createFileRoute } from "@tanstack/react-router";
import WatchRankingTable from "@/components/watch/WatchRankingTable";
import { SENTINEL_WATCH_EVENT_COUNT, SENTINEL_WATCH_WINDOW } from "@/data/sentinelWatch";

export const Route = createFileRoute("/watch")({
  head: () => ({
    meta: [
      { title: "Sentinel Watch — AIS-disabling early warning | OceanTrace" },
      {
        name: "description",
        content:
          "Real-time AIS-disabling event monitor across India's west-coast high-risk zones, independent of satellite detection.",
      },
    ],
  }),
  component: WatchPage,
});

function WatchPage() {
  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <div className="border-b border-border bg-card px-8 py-5">
        <h1>Sentinel Watch</h1>
        <p className="mt-1 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Prevention layer: monitors AIS-disabling behavior in three historically
          high-risk zones on India's west coast, independent of satellite pass
          timing. Sentinel-1 revisits any given point roughly every 6 days — this
          runs continuously in between, so a suspicious vessel doesn't have to
          wait for the next overpass to be flagged.
        </p>
      </div>

      <div className="grid shrink-0 grid-cols-3 gap-4 border-b border-border bg-card px-8 py-5">
        <StatCard label="Watch zones" value="3" />
        <StatCard
          label="Window"
          value={`${SENTINEL_WATCH_WINDOW.from} → ${SENTINEL_WATCH_WINDOW.to}`}
        />
        <StatCard label="Flagged events" value={String(SENTINEL_WATCH_EVENT_COUNT)} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <WatchRankingTable />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background px-4 py-3">
      <p className="text-[12px] text-muted-foreground">{label}</p>
      <p className="num mt-1 text-[20px] text-ink">{value}</p>
    </div>
  );
}
