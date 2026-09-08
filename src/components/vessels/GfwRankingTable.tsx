import { GFW_MATCH_COUNT, GFW_RANKING, GFW_WINDOW } from "@/data/gfwAttribution";
import { useLiveFleet } from "@/data/liveFleet";

export default function GfwRankingTable() {
  const { setSelectedId, selectedId } = useLiveFleet();

  return (
    <div className="border-t border-border bg-card">
      <div className="flex flex-wrap items-end justify-between gap-3 px-6 py-4">
        <div>
          <h2 className="text-[17px]">GFW vessel attribution</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Real GFW / OpenDrift matches: {GFW_MATCH_COUNT} in window {GFW_WINDOW.from} →{" "}
            {GFW_WINDOW.to}. Relative ranking of the returned candidate set.
          </p>
        </div>
      </div>
      <div className="overflow-x-auto px-6 pb-5">
        <table className="w-full min-w-[920px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="py-2 pr-3 font-medium">Rank</th>
              <th className="py-2 pr-3 font-medium">Ship</th>
              <th className="py-2 pr-3 font-medium">Score</th>
              <th className="py-2 pr-3 font-medium">Confidence</th>
              <th className="py-2 pr-3 font-medium">Fusion</th>
              <th className="py-2 pr-3 font-medium">Obs.</th>
              <th className="py-2 pr-3 font-medium">Min km</th>
              <th className="py-2 pr-3 font-medium">Median km</th>
              <th className="py-2 pr-3 font-medium">IMO</th>
              <th className="py-2 font-medium">Flag</th>
            </tr>
          </thead>
          <tbody>
            {GFW_RANKING.map((v) => (
              <tr
                key={v.vesselId}
                className={`cursor-pointer border-b border-border last:border-0 ${
                  selectedId === v.vesselId || selectedId === slug(v.shipName)
                    ? "bg-accent"
                    : "hover:bg-accent/50"
                }`}
                onClick={() => setSelectedId(slug(v.shipName))}
              >
                <td className="num py-2.5 pr-3 text-ink">{v.rank}</td>
                <td className="py-2.5 pr-3 font-medium text-ink">{v.shipName}</td>
                <td className="num py-2.5 pr-3 text-ink">{v.relative_evidence_score.toFixed(3)}</td>
                <td className="py-2.5 pr-3">
                  <span
                    className={
                      v.confidence === "Very High"
                        ? "text-[var(--lime)]"
                        : "text-muted-foreground"
                    }
                  >
                    {v.confidence}
                  </span>
                </td>
                <td className="num py-2.5 pr-3">{v.fusion_score.toFixed(1)}</td>
                <td className="num py-2.5 pr-3">{v.matched_observations}</td>
                <td className="num py-2.5 pr-3">{v.min_distance_km.toFixed(3)}</td>
                <td className="num py-2.5 pr-3">{v.median_distance_km.toFixed(3)}</td>
                <td className="num py-2.5 pr-3">{v.imo}</td>
                <td className="num py-2.5">{v.flag}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 max-w-3xl text-[12px] leading-relaxed text-muted-foreground">
          These are relative scores within the returned candidate set, not calibrated
          probabilities of responsibility.
        </p>
      </div>
    </div>
  );
}

function slug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}
