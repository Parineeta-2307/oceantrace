import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useLiveVessels, type LiveVessel } from "./vesselSimulation";

type FleetContextValue = {
  vessels: LiveVessel[];
  selectedId: string | null;
  hoveredId: string | null;
  selected: LiveVessel | null;
  setSelectedId: (id: string | null) => void;
  setHoveredId: (id: string | null) => void;
};

const LiveFleetContext = createContext<FleetContextValue | null>(null);

export function LiveFleetProvider({ children }: { children: ReactNode }) {
  const vessels = useLiveVessels();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const selected = vessels.find((v) => v.id === selectedId) ?? null;

  const value = useMemo(
    () => ({
      vessels,
      selectedId,
      hoveredId,
      selected,
      setSelectedId,
      setHoveredId,
    }),
    [vessels, selectedId, hoveredId, selected],
  );

  return <LiveFleetContext.Provider value={value}>{children}</LiveFleetContext.Provider>;
}

export function useLiveFleet() {
  const ctx = useContext(LiveFleetContext);
  if (!ctx) throw new Error("useLiveFleet must be used inside LiveFleetProvider");
  return ctx;
}
