import {
  SENTINEL_WATCH_EVENTS,
  SENTINEL_WATCH_EVENT_COUNT,
  SENTINEL_WATCH_WINDOW,
} from "@/data/sentinelWatch";

export default function WatchRankingTable() {
  return (
    <div className="border-t border-border bg-card">
      <div className="flex flex-wrap items-end justify-between gap-3 px-6 py-4">
        <div>
          <h2 className="text-[17px]">AIS-disabling watch events</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {SENTINEL_WATCH_EVENT_COUNT} real GFW presence gap(s) flagged in window{" "}
            {SENTINEL_WATCH_WINDOW.from} → {SENTINEL_WATCH_WINDOW.to}, across three
            historical high-risk zones. Independent of SAR detection — runs even
            without a confirmed slick.
          </p>
        </div>
      </div>
      <div className="overflow-x-auto px-6 pb-5">
        <table className="w-full min-w-[920px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="py-2 pr-3 font-medium">Rank</th>
              <th className="py-2 pr-3 font-medium">Ship</th>
              <th className="py-2 pr-3 font-medium">Type</th>
              <th className="py-2 pr-3 font-medium">Zone</th>
              <th className="py-2 pr-3 font-medium">Gap start (UTC)</th>
              <th className="py-2 pr-3 font-medium">Gap duration</th>
              <th className="py-2 pr-3 font-medium">Watch score</th>
              <th className="py-2 font-medium">MMSI</th>
            </tr>
          </thead>
          <tbody>
            {SENTINEL_WATCH_EVENTS.map((e) => (
              <tr
                key={`${e.ssvid}-${e.gapStartUtc}`}
                className="border-b border-border last:border-0 hover:bg-accent/50"
              >
                <td className="num py-2.5 pr-3 text-ink">{e.rank}</td>
                <td className="py-2.5 pr-3 font-medium text-ink">{e.shipName}</td>
                <td className="py-2.5 pr-3 text-muted-foreground">{e.vesselType}</td>
                <td className="py-2.5 pr-3 text-muted-foreground">{e.zoneName}</td>
                <td className="num py-2.5 pr-3">
                  {new Date(e.gapStartUtc).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
                <td className="num py-2.5 pr-3">{e.gapDurationHours.toFixed(1)}h</td>
                <td className="py-2.5 pr-3">
                  <span
                    className={
                      e.watchScore >= 0.7
                        ? "text-[var(--lime)]"
                        : e.watchScore >= 0.4
                          ? "text-ink"
                          : "text-muted-foreground"
                    }
                  >
                    {e.watchScore.toFixed(3)}
                  </span>
                </td>
                <td className="num py-2.5">{e.ssvid}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 max-w-3xl text-[12px] leading-relaxed text-muted-foreground">
          Watch score combines gap duration, zone risk, vessel-type risk, and
          recency. This is an early-warning signal, not a confirmed attribution —
          it flags vessels worth checking before any slick has been detected.
        </p>
      </div>
    </div>
  );
}
