# Ocean Trace

OceanTrace — Final Build Prompt v2 (Frontend-Only)

Paste this whole document into Lovable. Upload the 5 JSON files (pipeline_status.json, backward_hindcast.json, forecast.json, vessels.json, evidence_report.json) directly into the project instead of pasting their contents — reference them by filename below.

What changed from v1 — read this first

No backend. This is a frontend-only build. No FastAPI, no live external API calls. Live vessel movement is simulated client-side.

Nothing about the pipeline is animated except vessel positions. Oil spill, hindcast, forecast — all static, step-controlled by the user, never auto-playing.

Oil slick must look like a real SAR detection, not an animated shape. Use a real static image from your own CSIRO SAR training dataset.

"Last reported" timestamp added next to the slick at the top of the page.

Hindcast and forecast maps now also appear on the full investigation report page, as static reference figures — not dropped like in the earlier draft.

Vessel detail now explicitly surfaces AIS-style fields (MMSI, callsign, SOG, COG, nav status), not just identity fields.

Demo data stays fully invisible in the UI — no tag, no badge, anywhere. Internal code labeling only.

MOTION POLICY (read this before building anything — Lovable should treat this as a hard constraint)

Vessel markers: the only thing allowed to move on its own. Simulate smooth position updates every few seconds along a plausible short track, with the "last reported" timestamp ticking forward accordingly. This is a functional representation of live tracking, not decoration.

Oil slick overlay: static. No pulse, no glow, no shape animation. Should read as a real satellite radar detection, not an icon.

Backward hindcast: static by default. The time slider is user-controlled (drag or click a step) — moving the slider updates the particle positions instantly, no auto-play, no easing/tweening between frames.

Forward forecast: static by default. Switching the +6h/+12h/+24h/+48h tab updates the marker and uncertainty circle instantly — no radius-growth animation, no transition.

Everything else (panel opens, page loads, hover states): keep normal, minimal UI transitions — that's fine, it's the flashy "look at this move" motion on the data itself that's banned.

0. THE EXPERIENCE THIS SHOULD CREATE

A user lands, sees the name for under two seconds, and is inside the app. The map fills the center of the screen immediately. On it: a real-looking SAR detection — dark, textured, radar-grey, not a cartoon shape — sitting at a clearly marked coordinate, with "Last reported: [timestamp]" right beside it. Anyone should be able to say "there's an oil spill there, and it was seen recently" without reading a word of copy.

A thin pipeline strip shows the investigation is mostly done, not in progress — that builds trust before anyone explains anything.

The user steps through the backward reconstruction manually — drag the slider, watch the origin region appear, static and precise, like a figure out of a real report. Same for the forecast horizons. Nothing plays by itself; everything responds to being touched, which reads as more credible, not less.

Then vessels — the one part of the screen that's actually alive. Markers drift slightly, positions update, "last reported" times tick forward. Click one and it opens straight into real AIS-style data: MMSI, callsign, speed and course over ground, nav status, last position — the way a real maritime intelligence tool would show it.

Then NOTIFY FISHERS — one button, one confirmation, done.

Anyone who wants the full record clicks through to a full page: pure white, tables, the backward and forward reconstruction shown as static reference maps, nothing moving, reads like a document you'd actually submit as evidence.

A judge should be able to explain the whole thing back to you after ninety seconds of silently clicking around.

1. IMPLEMENTATION DISCIPLINE

Do NOT waste tokens explaining your reasoning. Inspect the existing project first. Reuse existing code/components/dependencies wherever possible. Make changes directly. Do not repeatedly restate requirements. Do not generate unnecessary documentation. Do not add libraries unless genuinely necessary. Prioritize UI quality, functionality, responsiveness, implementation. Keep responses after implementation extremely short: summarize changes + blockers only.

2. PRODUCT VISION

World-class commercial maritime intelligence product, not a student dashboard. Inspiration: ElevenLabs, Linear, Vercel, Raycast, Claude, Emergent — do not copy their interfaces.

Visual language: premium, editorial, restrained, data-dense without feeling cluttered, light/bright, map/data as the primary source of color.

Avoid: generic admin-dashboard look, navy maritime theme, neon/cyberpunk, excessive gradients/glow, huge decorative cards, default fonts (no untouched Inter), giant globe hero, decorative motion on data (see Motion Policy above).

Typography:

Headings/display: Fraunces (Google Fonts, variable serif, "soft" optical size, semi-bold/medium)

Body/UI: General Sans (Fontshare, free, humanist grotesk)

Numeric/technical (coordinates, IMO, MMSI, timestamps, scores): JetBrains Mono (Google Fonts, tabular figures on)

Palette: warm white/ivory, white, soft neutral backgrounds, charcoal, near-black, restrained coral/orange, muted violet, sophisticated green/lime, warm yellow. Color comes mainly from the map, status indicators, and data — not UI chrome.

Basemap: Leaflet.js + CARTO Positron ("light_all") tiles. OpenStreetMap data, restyled light/minimal, no API key required. Fall back to standard OSM tiles only if Positron requests fail.

3. OPENING EXPERIENCE

Minimal opening sequence — "OCEANTRACE" / "MARITIME INTELLIGENCE," ~1.5–2s, skippable, not cinematic. Returning users shouldn't be forced through it again.

4. CORE INVESTIGATION CONCEPT

One active investigation only — no global map of every spill.

Display at the top:

ACTIVE INVESTIGATION

Oil spill investigation

Detection location: 20.125331° N, 72.732091° E

Detection timestamp: 2026-08-01 01:02:11 UTC

Last reported: [same timestamp, formatted as relative time — e.g. "6 days ago" — directly next to the slick image/marker, not buried in a sidebar]

This coordinate is permanent, fixed, primary — it does not get replaced by a "real" detection later (there is no live ML detection feeding this app; treat these values as final for this build, not placeholder).

5. MAP — PRIMARY EXPERIENCE

Map occupies the visual center. Leaflet + CARTO Positron. No globe.

Layer toggle control: small, collapsible, docked corner — Slick / Backward Hindcast / Forecast / Vessels, independently toggleable.

Map legend: small, collapsible — explains slick texture, hindcast trajectory color, forecast/uncertainty color, vessel marker tiers.

Observed slick — must look real, must be static

Use a real static image from your CSIRO Sentinel-1 SAR training dataset (pick one clean patch that clearly shows a dark oil-look patch against sea clutter) as the visual for the detected slick. Two placements, use whichever reads better once built, ideally both:

Draped as a static, grayscale, radar-textured overlay on the map at the detection coordinate (not a flat color polygon — actual image texture)

A dedicated small "SAR Detection" card near the Investigation header showing that same image at a larger size, captioned with the coordinate and "Last reported: [timestamp]"

No pulsing, no glow, no shape animation on this element under any circumstance.

Backward reconstruction (real data: backward_hindcast.json)

Status COMPLETED, 24 hours, 100 particles, 25 time steps. origin_distribution center: 20.119809° N, 72.569782° E, bounding box lat 20.089344°–20.156815°, lon 72.536400°–72.621521° — roughly 17km west of the detection point. origin_points: 100 lat/lon pairs, the origin candidate cloud.

Data quirk to handle correctly: the trajectory step at the detection time is labeled hours_from_detection: 24; the step 24h earlier is labeled 0. Translate this into intuitive labels for the slider ("24h before detection" → "Now"), don't expose the raw numbering.

Time slider is drag/click-to-step, static rendering per step, no auto-play, no tweening.

Forward forecast (real data: forecast.json)

Horizon Time (UTC) Latitude Longitude P95 uncertainty +6h 2026-08-01T07:02:11 20.127090° N 72.737381° E 0.855 km +12h 2026-08-01T13:02:11 20.127626° N 72.737473° E 0.910 km +24h 2026-08-02T01:02:11 20.129244° N 72.737580° E 1.085 km +48h 2026-08-03T01:02:11 20.136042° N 72.737946° E 1.972 km

100 particles per horizon. Tabs switch instantly between horizons — no growth animation on the uncertainty circle, it just renders at its correct size for the selected horizon. A small static chart showing uncertainty vs. horizon is fine (that's a chart, not the map animating).

Vessels — the one moving thing on the map

See Section 8 for the simulation approach. Markers show smoothly-updating positions, "last reported" ticking. Clicking a marker opens the vessel detail drawer (same as clicking a table row — shared selection state, hover on one highlights the other).

Coordinate-first UI

LAT/LON always visible in JetBrains Mono, copy-coordinates button, "open in external map" (new tab), cursor coordinate readout on hover.

6. PIPELINE NAVIGATOR (real data: pipeline_status.json)

ACQUIRE → PREPROCESS → DETECT → CONFIRM → RECONSTRUCT → CORRELATE → ATTRIBUTE → FORECAST → ALERT

Acquire — COMPLETED · Preprocess — COMPLETED · Detect (sar_detection) — COMPLETED · Confirm (oil_spill_confirmation) — CONFIRMED · Reconstruct (backward_hindcast, origin_distribution) — COMPLETED/AVAILABLE · Correlate (gfw_ais) — COMPLETED · Attribute (vessel_attribution) — EVIDENCE AVAILABLE · Forecast (forward_forecast) — COMPLETED, horizons +6h/+12h/+24h/+48h · Alert — READY

Short one-line explanations per stage, expandable for more. Static — no motion.

7. DATA FILES

Upload these 5 into the Lovable project (e.g. src/data/) rather than pasting contents:

pipeline_status.json — Section 6

backward_hindcast.json — Section 5, 24h/25-step/100-particle + origin_distribution + origin_points

forecast.json — Section 5, 4 horizons

vessels.json — currently vessels: [], see Section 10

evidence_report.json — bundled export combining detection (empty {}), backward_hindcast, forecast, vessel_intelligence, pipeline_status. This is what "Export → JSON Evidence" downloads and its section order is what the full Investigation Report page follows (Section 21).

detection being empty in evidence_report.json is expected and permanent for this build — the fixed values in Section 4 are the source of truth, there is no future real detection feed to wire in.

8. VESSEL INTELLIGENCE — FRONTEND-ONLY, SIMULATED LIVE

No backend for this build. No live external API calls from the browser.

Live movement is simulated client-side: each demo vessel gets a short, smooth, plausible path (a handful of waypoints near the investigation area). On an interval (every few seconds), interpolate the vessel marker slightly along its path and update its "last reported" timestamp to now. This is what makes the map feel alive without wiring in real external data or exposing any API key in the browser.

Why not call the real APIs directly from the frontend: the Kpler key, GFW Vessels/Events API, and aisstream.io are real, legitimate integration paths — but calling them straight from browser JS would (a) expose the key in the network tab / bundle, and (b) risk pulling in a real ship's real identity next to a fictional spill narrative, which is a bad look regardless of intent. Keep those documented as the real integration path (table below) but not wired in here.

For reference / to mention in your pitch as the real integration plan:

Need Option Free tier Vessel identity (name, type, flag, IMO) by MMSI GFW Vessels API 50K req/day Behavioral anomalies (loitering, encounters, AIS gaps, port visits) GFW Events API 50K req/day Live vessel positions aisstream.io Unlimited Live vessel positions (alternative, key already held) Kpler for Developers per plan SAR slick detection (future real pipeline) SpaceShift SateAIs 500 credits/mo Current/wind vectors for hindcast/forecast Open-Meteo Marine API Unlimited, no key Satellite imagery search/download CDSE OData API Free Basemap tiles CARTO Positron (via Leaflet) Free, no key

9. VESSEL RANKING

Compact sortable/filterable table: name, IMO, MMSI, vessel type, flag, last known position, distance to slick, relative evidence score. Advanced columns (temporal/spatial/trajectory consistency, persistence, evidence quality) via column controls, expandable rows, or the detail drawer — not a giant spreadsheet by default.

10. VESSEL DETAIL — INCLUDE REAL AIS-STYLE FIELDS

Clicking a vessel (map marker or table row) opens a detail drawer, and on the full page (Section 21) a dedicated page. Include, clearly grouped:

Identity: vessel name, IMO, MMSI, vessel type, flag, callsign AIS position data: last known lat/lon, SOG (speed over ground), COG (course over ground), navigational status (e.g. "Under way using engine"), last reported time (ticking, per the simulation in Section 8) Evidence: relative evidence score, spatial proximity, trajectory consistency, temporal consistency, persistence, evidence quality — as a clear signal breakdown, not a spreadsheet dump

11. DEMO VESSEL FALLBACK — INVISIBLE, NO EXCEPTIONS

vessels.json has vessels: []. Build a fallback dataset at src/data/demoVessels.ts: professional fictional names (OCEAN SENTINEL, ARABIAN TRADER, WESTERN HORIZON, SEA MERIDIAN), relative evidence scores (e.g. 87, 74, 61, 43 — not probabilities, that framing already reads as decisive and professional without overclaiming certainty).

No tag, badge, watermark, or label anywhere in the UI indicates this is demo data. Labeling is strictly internal (source code comment, dev-only console flag). This data drives every vessel-related screen in this build — there is no "real" data to swap in later for this competition, so it should look and behave exactly like the finished product's real data would.

12. ANALYTICS

Evidence analytics (ranking, signal contribution chart, spatial/temporal consistency), Forecast analytics (displacement/uncertainty vs. horizon), Investigation analytics (stage completion). Sparse, beautiful, no chart spam. Static charts, no auto-animating chart entrances.

13. IMPACT / RESPONSE ECONOMICS

Scenario estimates: response cost, delayed-response cost, avoided cost, response-time advantage. Labeled ESTIMATED / SCENARIO MODEL — small, not a disclaimer banner. Communicates earlier detection → smaller spread → lower cost, without claiming verified savings.

14. FISHERMAN / FISHER ALERT

NOTIFY FISHERS button. Confirmation panel: investigation ID, slick coordinates, forecast risk area, relevant horizon, timestamp, warning preview. CANCEL / CONFIRM ALERT → "ALERT QUEUED." Frontend-only workflow. Reachable as a floating action button on mobile.

15. SPILL AGE

Do NOT invent a number. Display SPILL AGE — IN PROGRESS with: "Automated slick-age estimation is being integrated into the investigation pipeline." Not "coming soon." Looks complete either way.

16. NOTIFICATION CENTER

Realistic events with timestamps relative to the investigation: New slick detected, Confirmation completed, Backward reconstruction completed, Forecast updated, Vessel entered investigation area, Vessel evidence updated, Fisher alert ready, Analysis complete. Useful, not decorative — no notification "slides in" animation loop.

17. INVESTIGATION HISTORY

Timeline: Detection → Confirmation → Ocean validation → Backward reconstruction → AIS correlation → Vessel attribution → Forecast → Response readiness. Expandable events.

18. DEFINITIONS / METHODOLOGY

Dedicated nav item. SAR, Backward Hindcast, Forward Forecast, P95 Uncertainty, Relative Evidence Score (explicitly: not probability, does not establish legal responsibility), AIS, Spatial Consistency, Temporal Consistency — concise, one paragraph each.

19. NAVIGATION

Overview, Investigation, Reconstruction, Vessels, Forecast, Analytics, Alerts, History, Methodology. Command palette (Cmd/Ctrl+K) for quick jump. Thin always-visible context strip: "Investigation — Confirmed — Last reported [time]."

20. DATA FRESHNESS

Small indicators: SAR observation, AIS data, Forecast run, Last investigation update. States: LIVE, RECENT, 6 DAYS AGO, UPDATED. Small badges, not loud.

21. EXPORT

EXPORT INVESTIGATION: PDF Investigation Report, JSON Evidence (matches evidence_report.json structure exactly), CSV Vessel Data, Map Snapshot. Lightweight preview modal before download.

22. FULL-PAGE VIEWS ("open in new page")

Every drawer (Vessel Detail, Investigation Report, Methodology) gets an "expand ↗" icon → dedicated route, real link behavior (opens correctly in a new tab):

/vessels/:id

/investigation/:id

/methodology

Style: pure white background, no motion beyond an instant page load, structured tables and clean typographic hierarchy — reads like a professional document, not the live dashboard.

/investigation/:id (Investigation Report page) includes, in this order, matching evidence_report.json:

Detection — the SAR image (same real CSIRO patch used on the dashboard), coordinates, timestamp

Backward Reconstruction — a static map figure showing the full 24h trajectory (all particle paths layered as one composite, or the origin region shaded) with the origin coordinates and bounding box printed as text below it

Forward Forecast — a static map figure showing all 4 horizon points and their uncertainty circles together on one map, with the table of values (Section 5) printed below it

Vessel Intelligence — the full ranked table

Pipeline Status — the stage list

None of these map figures are interactive or animated on this page — they're reference figures, like what you'd put in a report appendix.

23. VISUAL HIERARCHY

WHERE IS THE SPILL? → coordinates · WHAT HAPPENED? → confirmed SAR detection · WHERE DID IT COME FROM? → backward reconstruction · WHERE IS IT GOING? → forward forecast · WHO MAY BE RELEVANT? → vessel intelligence · WHAT SHOULD WE DO? → fisherman alert

24. RESPONSIVE DESIGN

Desktop-first, usable on laptop/tablet/mobile. Mobile: map stays central, panels become drawers/bottom sheets, tables scroll/card-based, coordinates stay prominent, Notify Fishers stays as a FAB.

25. COMPONENT ARCHITECTURE

src/
  components/
    map/
      InvestigationMap, SlickOverlay (static image-based), HindcastLayer (stepped, no autoplay),
      ForecastLayer (stepped), VesselLayer (simulated movement), CoordinateReadout,
      MapLegend, LayerToggleControl
    investigation/
      IncidentHeader (incl. Last Reported), IncidentMetrics, Pipeline, InvestigationTimeline
    vessels/
      VesselList, VesselCard, VesselDetail (AIS fields), VesselRanking, VesselSignals
    forecast/
      ForecastControls, ForecastSummary, UncertaintyDisplay
    analytics/
      EvidenceChart, ForecastChart, ImpactPanel
    alerts/
      NotificationCenter, FisherAlert
    methodology/
      Definitions
    shell/
      CommandPalette, ContextStrip
  data/
    demoVessels.ts
    vesselSimulation.ts   ← interval-based position updates, Section 8
  pages/
    VesselFullPage, InvestigationReportPage, MethodologyPage


Clean data/service layer so JSON stays swappable without touching components, even though no backend is wired in for this build.

26. FINAL QUALITY BAR

Should feel plausibly used by maritime authorities, coast guards, environmental agencies, response teams, insurers, port operators, fisheries authorities. Commercial, credible, polished. Not a college dashboard, not over-designed. Sophistication from typography, spatial visualization, real data, restrained interaction, and — critically this time — restraint on motion: the platform should feel alive because of live vessel tracking, not because everything is animated.

BUILD ORDER

P0: App shell, opening animation, investigation header with Last Reported, coordinate-first map with layer toggles/legend, static real SAR slick image, backward hindcast (stepped, static), forward forecast (stepped, static), pipeline navigator, vessel intelligence with simulated live movement, vessel detail with AIS fields, invisible demo fallback, map↔table linkage, responsive layout.

P1: Analytics, timeline, notification center, fisher alert, impact section, methodology, export (JSON matching evidence_report.json), data freshness, command palette, context strip, full-page routes with static hindcast/forecast figures.

P2: Advanced table customization, further visual refinement.

Now inspect the existing project and implement. Do not spend the response explaining the plan.

This project is OceanTrace — SIH 2026, problem statement 26143.

## Development

```sh
npm i
npm run dev
```
