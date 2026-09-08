import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { DEMO_VESSELS } from "@/data/demoVessels";
import { useLiveFleet } from "@/data/liveFleet";

const PAGES = [
  { to: "/", label: "Overview" },
  { to: "/investigation", label: "Investigation" },
  { to: "/reconstruction", label: "Reconstruction" },
  { to: "/forecast", label: "Forecast" },
  { to: "/vessels", label: "Vessels" },
  { to: "/analytics", label: "Analytics" },
  { to: "/alerts", label: "Alerts" },
  { to: "/history", label: "History" },
  { to: "/methodology", label: "Methodology" },
] as const;

export default function CommandPalette({ onSelectVessel }: { onSelectVessel?: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { setSelectedId } = useLiveFleet();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const query = q.trim().toLowerCase();
  const pages = useMemo(
    () => PAGES.filter((p) => !query || p.label.toLowerCase().includes(query)),
    [query],
  );
  const vessels = useMemo(
    () =>
      DEMO_VESSELS.filter(
        (v) =>
          !query ||
          v.name.toLowerCase().includes(query) ||
          v.imo.includes(query) ||
          v.mmsi.includes(query),
      ),
    [query],
  );

  const go = (fn: () => void) => {
    setOpen(false);
    setQ("");
    fn();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent"
      >
        Search
        <kbd className="num rounded border border-border px-1 text-[10px]">⌘K</kbd>
      </button>
      {open && (
        <div className="fixed inset-0 z-[2500] flex items-start justify-center bg-ink/40 p-4 pt-[12vh]">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close search"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search pages and vessels…"
              className="w-full border-b border-border bg-transparent px-4 py-3 text-[15px] outline-none"
            />
            <div className="max-h-80 overflow-y-auto p-2">
              <div className="label-xs px-2 py-1">Pages</div>
              {pages.map((p) => (
                <button
                  key={p.to}
                  type="button"
                  className="block w-full rounded-md px-3 py-2 text-left text-[15px] text-ink hover:bg-accent"
                  onClick={() => go(() => navigate({ to: p.to }))}
                >
                  {p.label}
                </button>
              ))}
              <div className="label-xs mt-3 px-2 py-1">Vessels</div>
              {vessels.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className="block w-full rounded-md px-3 py-2 text-left text-[15px] text-ink hover:bg-accent"
                  onClick={() =>
                    go(() => {
                      setSelectedId(v.id);
                      onSelectVessel?.(v.id);
                    })
                  }
                >
                  {v.name}{" "}
                  <span className="num text-xs text-muted-foreground">{v.imo}</span>
                </button>
              ))}
              {pages.length === 0 && vessels.length === 0 && (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">No results.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
