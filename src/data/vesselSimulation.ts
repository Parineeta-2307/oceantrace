import { useEffect, useState } from "react";
import { DEMO_VESSELS, type Vessel } from "./demoVessels";
import { INVESTIGATION_COORDS } from "./investigation";

export type LiveVessel = Vessel & {
  latitude: number;
  longitude: number;
  lastReported: number;
  distanceKm: number;
};

const TICK_MS = 4000;
const CYCLE_MS = 240000; // full traverse of the waypoint path

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function positionAt(path: [number, number][], progress: number): [number, number] {
  const segments = path.length - 1;
  const scaled = Math.min(0.999999, Math.max(0, progress)) * segments;
  const i = Math.floor(scaled);
  const t = scaled - i;
  const a = path[i] ?? path[0]!;
  const b = path[i + 1] ?? path[path.length - 1]!;
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
}

export function haversineKm(aLat: number, aLon: number, bLat: number, bLon: number) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLon = ((bLon - aLon) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function snapshot(now: number): LiveVessel[] {
  return DEMO_VESSELS.map((v, idx) => {
    const offset = (idx * 0.17) % 1;
    const progress = (((now / CYCLE_MS) % 1) + offset) % 1;
    const [latitude, longitude] = positionAt(v.path, progress);
    return {
      ...v,
      latitude,
      longitude,
      lastReported: now - ((idx * 7000) % 21000),
      distanceKm: haversineKm(latitude, longitude, INVESTIGATION_COORDS.lat, INVESTIGATION_COORDS.lng),
    };
  });
}

/** Simulated live AIS feed: positions and "last reported" advance on an interval. */
export function useLiveVessels(): LiveVessel[] {
  const [vessels, setVessels] = useState<LiveVessel[]>(() => snapshot(Date.now()));

  useEffect(() => {
    const update = () => setVessels(snapshot(Date.now()));
    update();
    const id = setInterval(update, TICK_MS);
    return () => clearInterval(id);
  }, []);

  return vessels;
}
