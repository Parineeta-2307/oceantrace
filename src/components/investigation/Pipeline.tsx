import { useState } from "react";
import { PIPELINE_STAGES, isStageComplete } from "@/data/investigation";

const statusColor = (status: string) => {
  if (status === "READY") return "text-[var(--amber)]";
  if (status === "EVIDENCE AVAILABLE") return "text-[var(--amber)]";
  if (status === "CONFIRMED") return "text-[var(--lime)]";
  return "text-[var(--lime)]";
};

export default function Pipeline({ expanded = false }: { expanded?: boolean }) {
  const [openStage, setOpenStage] = useState<string | null>(null);
  const lastCompletedIdx = PIPELINE_STAGES.reduce(
    (acc, s, i) => (isStageComplete(s.status) ? i : acc),
    -1,
  );
  const progressPct =
    ((lastCompletedIdx + 0.5) / (PIPELINE_STAGES.length - 1)) * 100;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto px-5 pb-5 pt-6">
        <div className="relative min-w-[720px]">
          <div className="relative flex items-center justify-between">
            <div className="absolute left-4 right-4 top-1/2 h-[2px] -translate-y-1/2">
              <div
                className="absolute inset-y-0 left-0 bg-[var(--lime)]"
                style={{ width: `${progressPct}%` }}
              />
              <div
                className="absolute inset-y-0 right-0"
                style={{
                  left: `${progressPct}%`,
                  backgroundImage:
                    "linear-gradient(to right, var(--border) 40%, transparent 50%)",
                  backgroundSize: "8px 2px",
                  backgroundRepeat: "repeat-x",
                }}
              />
            </div>
            {PIPELINE_STAGES.map((s) => {
              const completed = isStageComplete(s.status);
              const isOpen = openStage === s.key;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setOpenStage(isOpen ? null : s.key)}
                  className="relative z-10 flex size-8 items-center justify-center rounded-full border-2 bg-card transition-transform hover:scale-110"
                  aria-label={s.key}
                >
                  <span
                    className={`flex size-8 items-center justify-center rounded-full border-2 ${
                      completed
                        ? "border-[var(--lime)] bg-[var(--lime)]"
                        : "border-border bg-card"
                    } ${isOpen ? "ring-2 ring-[var(--coral)]/30" : ""}`}
                  >
                    {completed ? (
                      <svg
                        className="size-3.5 text-white"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="3,8 7,12 13,4" />
                      </svg>
                    ) : (
                      <span className="size-2 rounded-full bg-border" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex justify-between">
            {PIPELINE_STAGES.map((s) => (
              <div key={s.key} className="w-8 min-w-[72px] text-center">
                <div className="text-[10px] font-semibold leading-tight tracking-wide text-ink">
                  {s.key}
                </div>
                <div className={`num mt-0.5 text-[9px] leading-tight ${statusColor(s.status)}`}>
                  {s.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="divide-y divide-border border-t border-border">
          {PIPELINE_STAGES.map((s) => (
            <div key={s.key} className="px-6 py-3.5">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[15px] font-medium text-ink">{s.key}</span>
                <span className={`num text-[11px] ${statusColor(s.status)}`}>{s.status}</span>
              </div>
              <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{s.note}</p>
            </div>
          ))}
        </div>
      )}

      {!expanded && openStage && (
        <div className="border-t border-border px-6 py-4">
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            <span className="font-medium text-ink">{openStage}.</span>{" "}
            {PIPELINE_STAGES.find((s) => s.key === openStage)?.note}
          </p>
        </div>
      )}
    </div>
  );
}
