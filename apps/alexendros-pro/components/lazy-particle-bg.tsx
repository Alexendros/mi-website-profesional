"use client";

import dynamic from "next/dynamic";

const ParticleBg = dynamic(
  () => import("./particle-bg").then((m) => m.ParticleBg),
  { ssr: false },
);

export function LazyParticleBg() {
  return <ParticleBg />;
}
