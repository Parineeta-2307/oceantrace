import { useState } from "react";
import { Bell } from "lucide-react";
import { relativeTime } from "@/data/investigation";

const NOTES = [
  { t: "2026-08-01T02:22:03Z", title: "Fisher alert package ready", body: "Advisory prepared for three harbour clusters." },
  { t: "2026-08-01T02:18:47Z", title: "Forecast complete", body: "+6h, +12h, +24h and +48h horizons published." },
  { t: "2026-08-01T02:05:10Z", title: "Evidence available", body: "Relative evidence scores computed for correlated vessels." },
  { t: "2026-08-01T01:31:55Z", title: "Origin region resolved", body: "24h backward hindcast completed with 100 particles." },
];

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-md border border-border p-1.5 text-muted-foreground hover:bg-accent"
        aria-label="Notifications"
      >
        <Bell className="size-4" />
        <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-[var(--coral)]" />
      </button>
      {open && (
        <div className="absolute right-0 z-[1000] mt-2 w-80 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
          <div className="border-b border-border px-3 py-2 label-xs">Notifications</div>
          <ul className="max-h-80 overflow-y-auto">
            {NOTES.map((n) => (
              <li key={n.title} className="border-b border-border px-3 py-2.5 last:border-0">
                <div className="text-sm font-medium text-ink">{n.title}</div>
                <div className="text-xs text-muted-foreground">{n.body}</div>
                <div className="num mt-1 text-[10px] text-muted-foreground">
                  {relativeTime(n.t)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
