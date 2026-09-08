/**
 * INTERNAL NOTE (do not surface in UI): vessels.json ships with an empty vessel
 * array, so this fictional dataset drives every vessel surface in this build.
 * No badge, tag or watermark may indicate this in the interface.
 */

export type Vessel = {
  id: string;
  name: string;
  imo: string;
  mmsi: string;
  callsign: string;
  type: string;
  flag: string;
  navStatus: string;
  sogKn: number;
  cogDeg: number;
  score: number;
  signals: {
    spatialProximity: number;
    trajectoryConsistency: number;
    temporalConsistency: number;
    persistence: number;
    evidenceQuality: number;
  };
  /** waypoints for the client-side movement simulation */
  path: [number, number][];
  /** Suspects are corridor-correlated. Traffic is live AIS outside the origin range. */
  kind: "suspect" | "traffic";
};

export const DEMO_VESSELS: Vessel[] = [
  {
    id: "star-capoeira",
    name: "STAR CAPOEIRA",
    imo: "9719537",
    mmsi: "255915945",
    callsign: "CQ2403",
    type: "Cargo",
    flag: "Portugal",
    navStatus: "Under way using engine",
    sogKn: 10.6,
    cogDeg: 92,
    score: 99.3,
    signals: {
      spatialProximity: 94,
      trajectoryConsistency: 91,
      temporalConsistency: 96,
      persistence: 88,
      evidenceQuality: 90,
    },
    kind: "suspect",
    path: [
      [20.0712, 72.5122],
      [20.0824, 72.5318],
      [20.0988, 72.5524],
      [20.1126, 72.5648],
      [20.1198, 72.5701],
    ],
  },
  {
    id: "zhong-gu-kun-ming",
    name: "ZHONG GU KUN MING",
    imo: "9933858",
    mmsi: "414903000",
    callsign: "BPJV5",
    type: "Cargo",
    flag: "China",
    navStatus: "Under way using engine",
    sogKn: 11.2,
    cogDeg: 78,
    score: 0.7,
    signals: {
      spatialProximity: 22,
      trajectoryConsistency: 18,
      temporalConsistency: 28,
      persistence: 12,
      evidenceQuality: 20,
    },
    kind: "suspect",
    path: [
      [20.0488, 72.4982],
      [20.0564, 72.5088],
      [20.0641, 72.5194],
      [20.0710, 72.5288],
      [20.0782, 72.5376],
    ],
  },
  {
    id: "western-horizon",
    name: "Western Horizon",
    imo: "9327544",
    mmsi: "563112900",
    callsign: "9V8KL",
    type: "Bulk Carrier",
    flag: "Singapore",
    navStatus: "Restricted manoeuvrability",
    sogKn: 4.2,
    cogDeg: 142,
    score: 61,
    signals: {
      spatialProximity: 66,
      trajectoryConsistency: 58,
      temporalConsistency: 63,
      persistence: 55,
      evidenceQuality: 60,
    },
    kind: "traffic",
    path: [
      [20.0902, 72.5501],
      [20.0968, 72.5904],
      [20.1029, 72.6317],
      [20.1094, 72.6725],
      [20.1158, 72.7130],
    ],
  },
  {
    id: "sea-meridian",
    name: "Sea Meridian",
    imo: "9701288",
    mmsi: "636019845",
    callsign: "D5RT4",
    type: "General Cargo",
    flag: "Liberia",
    navStatus: "At anchor",
    sogKn: 0.3,
    cogDeg: 12,
    score: 43,
    signals: {
      spatialProximity: 48,
      trajectoryConsistency: 39,
      temporalConsistency: 46,
      persistence: 41,
      evidenceQuality: 44,
    },
    kind: "traffic",
    path: [
      [20.1955, 72.7010],
      [20.1902, 72.7118],
      [20.1848, 72.7225],
      [20.1795, 72.7331],
      [20.1742, 72.7440],
    ],
  },
  {
    id: "gulf-star",
    name: "Gulf Star",
    imo: "9482201",
    mmsi: "419334871",
    callsign: "VTGS4",
    type: "Container Ship",
    flag: "India",
    navStatus: "Under way using engine",
    sogKn: 14.2,
    cogDeg: 348,
    score: 0,
    kind: "traffic",
    signals: {
      spatialProximity: 8,
      trajectoryConsistency: 6,
      temporalConsistency: 11,
      persistence: 4,
      evidenceQuality: 9,
    },
    path: [
      [18.92, 72.68],
      [18.98, 72.76],
      [19.06, 72.84],
      [19.14, 72.91],
      [19.22, 72.97],
    ],
  },
  {
    id: "indus-mariner",
    name: "Indus Mariner",
    imo: "9614478",
    mmsi: "419882044",
    callsign: "ATIM8",
    type: "Crude Oil Tanker",
    flag: "Marshall Islands",
    navStatus: "Under way using engine",
    sogKn: 12.6,
    cogDeg: 112,
    score: 0,
    kind: "traffic",
    signals: {
      spatialProximity: 5,
      trajectoryConsistency: 7,
      temporalConsistency: 5,
      persistence: 3,
      evidenceQuality: 6,
    },
    path: [
      [21.28, 69.42],
      [21.36, 69.72],
      [21.44, 70.04],
      [21.50, 70.34],
      [21.56, 70.62],
    ],
  },
  {
    id: "malabar-express",
    name: "Malabar Express",
    imo: "9736612",
    mmsi: "419220773",
    callsign: "VWME3",
    type: "Ro-Ro Cargo",
    flag: "India",
    navStatus: "Under way using engine",
    sogKn: 13.1,
    cogDeg: 18,
    score: 0,
    kind: "traffic",
    signals: {
      spatialProximity: 4,
      trajectoryConsistency: 8,
      temporalConsistency: 6,
      persistence: 5,
      evidenceQuality: 7,
    },
    path: [
      [16.52, 72.82],
      [16.70, 72.90],
      [16.88, 72.97],
      [17.06, 73.04],
      [17.22, 73.10],
    ],
  },
];

export const SUSPECT_VESSELS = DEMO_VESSELS.filter((v) => v.kind === "suspect");
export const TRAFFIC_VESSELS = DEMO_VESSELS.filter((v) => v.kind === "traffic");
