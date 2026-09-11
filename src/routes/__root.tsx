import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { LiveFleetProvider, useLiveFleet } from "@/data/liveFleet";
import VesselDetail from "@/components/vessels/VesselDetail";
import CommandPalette from "@/components/panels/CommandPalette";
import ExportButton from "@/components/panels/ExportButton";
import NotificationCenter from "@/components/panels/NotificationCenter";

import appCss from "../styles.css?url";
import "leaflet/dist/leaflet.css";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "OceanTrace" },
        {
          name: "description",
          content:
            "OceanTrace: SAR-based oil slick detection, drift reconstruction, vessel attribution and coastal forecast.",
        },
        { property: "og:title", content: "OceanTrace" },
        {
          property: "og:description",
          content:
            "Confirmed oil slick investigation console — detection, reconstruction, vessel evidence and forecast.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap",
        },
        { rel: "stylesheet", href: appCss },
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
        { rel: "apple-touch-icon", href: "/favicon.svg" },
      ],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
  },
);

const NAV_ITEMS = [
  { to: "/", label: "Overview", icon: "◉" },
  { to: "/investigation", label: "Investigation", icon: "◫" },
  { to: "/reconstruction", label: "Reconstruction", icon: "↺" },
  { to: "/forecast", label: "Forecast", icon: "→" },
  { to: "/vessels", label: "Vessels", icon: "▲" },
  { to: "/watch", label: "Sentinel Watch", icon: "⚠" },
  { to: "/analytics", label: "Analytics", icon: "◧" },
  { to: "/alerts", label: "Alerts", icon: "◈" },
  { to: "/history", label: "History", icon: "◔" },
  { to: "/methodology", label: "Methodology", icon: "◎" },
] as const;

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LiveFleetProvider>
        <AppShell />
      </LiveFleetProvider>
    </QueryClientProvider>
  );
}

function AppShell() {
  const location = useRouterState({ select: (s) => s.location.pathname });
  const [navOpen, setNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { selected, setSelectedId } = useLiveFleet();

  useEffect(() => {
    const stored = window.localStorage.getItem("oceantrace-nav-collapsed");
    if (stored === "1") setCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      window.localStorage.setItem("oceantrace-nav-collapsed", next ? "1" : "0");
      return next;
    });
  };

  const nav = (
    <nav className="flex-1 space-y-0.5 px-2 py-2">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.to === "/" ? location === "/" : location.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setNavOpen(false)}
            title={item.label}
            className={`nav-link ${isActive ? "active" : ""} ${collapsed ? "justify-center px-2" : ""}`}
          >
            <span className="w-4 text-center text-xs opacity-80">{item.icon}</span>
            {!collapsed && item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex h-screen min-h-0 bg-background">
      <aside
        className={`hidden h-full shrink-0 flex-col bg-[#0B3A48] text-white lg:flex ${
          collapsed ? "w-[72px]" : "w-[212px]"
        }`}
      >
        <div className={`flex items-center gap-2 px-3 py-4 ${collapsed ? "justify-center" : ""}`}>
          <img src="/favicon.svg" alt="" className="size-8 rounded-md" />
          {!collapsed && (
            <span
              style={{ fontFamily: "var(--font-display)" }}
              className="text-[15px] font-semibold tracking-tight text-white"
            >
              OceanTrace
            </span>
          )}
        </div>
        {nav}
        <div className="border-t border-white/10 p-2">
          <button
            type="button"
            onClick={toggleCollapsed}
            className="flex w-full items-center justify-center gap-2 rounded-md px-2 py-2 text-[12px] text-white/80 hover:bg-white/10"
            aria-label={collapsed ? "Open navigation" : "Close navigation"}
          >
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {navOpen && (
        <div className="fixed inset-0 z-[800] lg:hidden">
          <button
            className="absolute inset-0 bg-ink/40"
            aria-label="Close navigation"
            onClick={() => setNavOpen(false)}
          />
          <aside className="relative flex h-full w-[220px] flex-col bg-[#0B3A48] shadow-xl">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-2">
                <img src="/favicon.svg" alt="" className="size-8 rounded-md" />
                <span
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-[15px] font-semibold tracking-tight text-white"
                >
                  OceanTrace
                </span>
              </div>
              <button
                className="rounded-md border border-white/20 px-2 py-1 text-xs text-white/80"
                onClick={() => setNavOpen(false)}
              >
                Close
              </button>
            </div>
            <nav className="flex-1 space-y-0.5 px-2 py-2">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.to === "/" ? location === "/" : location.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setNavOpen(false)}
                    className={`nav-link ${isActive ? "active" : ""}`}
                  >
                    <span className="w-4 text-center text-xs opacity-80">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-border bg-[#0B3A48] px-4 py-2.5 lg:hidden">
          <button
            onClick={() => setNavOpen(true)}
            className="rounded-md border border-white/20 px-2.5 py-1 text-[13px] font-medium text-white"
          >
            Menu
          </button>
          <img src="/favicon.svg" alt="" className="size-7 rounded-md" />
          <span
            style={{ fontFamily: "var(--font-display)" }}
            className="text-[15px] font-semibold text-white"
          >
            OceanTrace
          </span>
          <div className="ml-auto flex items-center gap-2">
            <CommandPalette />
            <ExportButton />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-b border-border bg-card px-4 py-1.5">
          <CommandPalette />
          <ExportButton />
          <NotificationCenter />
        </div>
        <main className="relative min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {selected && (
        <VesselDetail vessel={selected} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
