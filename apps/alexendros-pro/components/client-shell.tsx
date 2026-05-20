"use client";

import dynamic from "next/dynamic";

const ParticleBg = dynamic(
  () => import("./particle-bg").then((m) => m.ParticleBg),
  { ssr: false },
);

const Analytics = dynamic(
  () => import("@vercel/analytics/next").then((m) => m.Analytics),
  { ssr: false },
);

const SpeedInsights = dynamic(
  () => import("@vercel/speed-insights/next").then((m) => m.SpeedInsights),
  { ssr: false },
);

export function ClientShell() {
  return (
    <>
      <ParticleBg />
      <SpeedInsights />
      <Analytics />
    </>
  );
}
