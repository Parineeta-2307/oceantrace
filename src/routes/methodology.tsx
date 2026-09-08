import { createFileRoute } from "@tanstack/react-router";
import { hindcast, forecast, HORIZONS } from "@/data/investigation";
import sarImage from "@/assets/sar-detection.png";
import lookalike from "@/assets/lookalike_low_wind_false_positive.jpg";
import hindcastPlot from "@/assets/hindcast_opendrift.png";
import aisGfw from "@/assets/ais_gfw_correlation.png";
import evidenceDash from "@/assets/evidence_dashboard.png";
import forecastPlot from "@/assets/forward_forecast_plot.png";

export const Route = createFileRoute("/methodology")({
  head: () => ({
    meta: [
      { title: "Methodology — OceanTrace oil spill investigation" },
      {
        name: "description",
        content:
          "How OceanTrace detects slicks in SAR imagery, reconstructs origin by backward particle drift, correlates AIS tracks and forecasts spill movement.",
      },
    ],
  }),
  component: Methodology,
});

function Figure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
      <img src={src} alt={alt} className="w-full bg-[#111] object-contain" />
      <figcaption className="px-4 py-3 text-[13px] leading-relaxed text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}

function Methodology() {
  return (
    <div className="mx-auto max-w-3xl px-8 py-8">
      <h1>Methodology</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
        How a dark patch in a radar image becomes an origin region, a ranked list
        of candidate vessels and a coastal advisory.
      </p>

      <section className="mt-10">
        <h2>1. SAR detection</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          Sentinel-1 synthetic aperture radar measures sea-surface roughness. Oil
          damps capillary waves, so a slick appears as a dark, low-backscatter
          patch. Scenes are calibrated, speckle-filtered and land-masked before
          dark-patch segmentation runs.
        </p>
        <Figure
          src={sarImage}
          alt="Sentinel-1 SAR detection patch of the confirmed slick"
          caption="Confirmed SAR detection patch at 20.125331° N, 72.732091° E — dark, coherent low-backscatter anomaly used as the slick seed."
        />
      </section>

      <section className="mt-12">
        <h2>2. Look-alike confirmation</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          Low-wind shadows, algal blooms and rain cells produce similar dark patches.
          Shape, gradient sharpness, wind-field context and persistence across the
          scene are screened before an anomaly is confirmed as an oil slick.
        </p>
        <Figure
          src={lookalike}
          alt="SAR dark anomaly caused by surface smoothing / low-wind conditions; rejected during look-alike confirmation, not classified as oil"
          caption="lookalike_low_wind_false_positive — SAR dark anomaly caused by surface smoothing / low-wind conditions. The dark region is broad and diffuse, without coherent slick-like morphology. Treated as a candidate dark anomaly, not confirmed oil."
        />
      </section>

      <section className="mt-12">
        <h2>3. Backward reconstruction (hindcast)</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          Particles are seeded across the confirmed slick and advected backwards
          through ocean current and wind fields for {hindcast.duration_hours} hours —{" "}
          {hindcast.particle_count} particles across {hindcast.time_steps} time steps.
          Where those particles converge defines the origin distribution rather than a
          single point.
        </p>
        <Figure
          src={hindcastPlot}
          alt="24-hour backward OpenDrift hindcast trajectories and candidate origins"
          caption="24-hour backward OpenDrift hindcast: detected slick (star) and the origin-point cloud ~17 km west after reverse advection."
        />
      </section>

      <section className="mt-12">
        <h2>4. AIS correlation</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          Vessel tracks are intersected with the origin distribution and the drift
          corridor in space and time. A vessel is a candidate only when its track
          plausibly occupied the origin region within the reconstruction window.
        </p>
        <Figure
          src={aisGfw}
          alt="GFW AIS candidate vessel records pulled for the reconstruction window"
          caption="Global Fishing Watch AIS pull for 2026-07-31 to 2026-08-01 — candidate vessel identity records used for correlation (HTTP 200, 7 records)."
        />
      </section>

      <section className="mt-12">
        <h2>5. Relative Evidence Score</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          Spatial proximity, trajectory consistency, temporal consistency, persistence
          and evidence quality are fused into a relative ranking of the returned
          candidate set. The score orders candidates for investigation. It is not a
          probability and it is not a determination of legal responsibility.
        </p>
        <Figure
          src={evidenceDash}
          alt="Evidence dashboard combining SAR, hindcast, forecast and ranked suspect vessels"
          caption="Evidence dashboard: SAR location, origin reconstruction, forecast horizons and relative ranking (STAR CAPOEIRA 99.331, ZHONG GU KUN MING 0.669)."
        />
      </section>

      <section className="mt-12">
        <h2>6. Forward forecast</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          The same drift model runs forward from the confirmed slick, producing centre
          positions and P95 uncertainty radii at {HORIZONS.join(", ")}. Uncertainty
          grows with lead time, reaching{" "}
          {forecast.horizons["+48h"].uncertainty_p95_km.toFixed(2)} km at +48h.
        </p>
        <Figure
          src={forecastPlot}
          alt="Forward oil-slick drift forecast with P95 uncertainty envelopes"
          caption="Forward forecast centre track and expanding P95 envelopes at +6h, +12h, +24h and +48h from the confirmed SAR slick."
        />
      </section>

      <section className="mt-12">
        <h2>7. Limitations</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          Drift reconstruction is only as good as the current and wind fields behind
          it. AIS can be switched off, spoofed or simply unavailable for small craft.
          Slick-age estimation is still being integrated. Outputs support human
          investigation; they do not replace it.
        </p>
      </section>

      <footer className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">
        OceanTrace presents evidence for human investigation. Relative Evidence Scores
        rank candidates; they are not probabilities and not determinations of legal
        responsibility.
      </footer>
    </div>
  );
}
