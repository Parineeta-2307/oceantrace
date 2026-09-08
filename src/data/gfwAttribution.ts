/** Real GFW/OpenDrift candidate ranking for this investigation window. */

export type GfwRankedVessel = {
  rank: number;
  shipName: string;
  vesselId: string;
  relative_evidence_score: number;
  confidence: "Very High" | "Very Low";
  fusion_score: number;
  matched_observations: number;
  min_distance_km: number;
  median_distance_km: number;
  min_temporal_gap_hours: number;
  median_temporal_gap_hours: number;
  observations_within_5km: number;
  observations_within_10km: number;
  observations_within_1h: number;
  fraction_within_5km: number;
  fraction_within_10km: number;
  mmsi: string;
  imo: string;
  callsign: string;
  flag: string;
  vesselType: string;
  geartype: string;
};

export const GFW_WINDOW = { from: "2026-07-31", to: "2026-08-01" };
export const GFW_MATCH_COUNT = 7;

export const GFW_RANKING: GfwRankedVessel[] = [
  {
    rank: 1,
    shipName: "STAR CAPOEIRA",
    vesselId: "88ff050de-e346-2697-299e-ccd3f88e103e",
    relative_evidence_score: 99.331,
    confidence: "Very High",
    fusion_score: 1.0,
    matched_observations: 4,
    min_distance_km: 9.269,
    median_distance_km: 10.149,
    min_temporal_gap_hours: 0.036522,
    median_temporal_gap_hours: 0.036522,
    observations_within_5km: 0,
    observations_within_10km: 2,
    observations_within_1h: 4,
    fraction_within_5km: 0,
    fraction_within_10km: 0.5,
    mmsi: "255915945",
    imo: "9719537",
    callsign: "CQ2403",
    flag: "PRT",
    vesselType: "CARGO",
    geartype: "CARGO",
  },
  {
    rank: 2,
    shipName: "ZHONG GU KUN MING",
    vesselId: "eb6abecd2-2800-e929-636f-f2238d338ed3",
    relative_evidence_score: 0.669,
    confidence: "Very Low",
    fusion_score: 0.0,
    matched_observations: 3,
    min_distance_km: 16.275,
    median_distance_km: 20.694,
    min_temporal_gap_hours: 0.036522,
    median_temporal_gap_hours: 0.036522,
    observations_within_5km: 0,
    observations_within_10km: 0,
    observations_within_1h: 3,
    fraction_within_5km: 0,
    fraction_within_10km: 0,
    mmsi: "414903000",
    imo: "9933858",
    callsign: "BPJV5",
    flag: "CHN",
    vesselType: "CARGO",
    geartype: "CARGO",
  },
];
