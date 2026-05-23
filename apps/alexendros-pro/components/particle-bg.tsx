"use client";

import { useEffect, useRef, useState } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  hue: 0 | 1;
};

const TARGET_FPS = 20;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

export function ParticleBg() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cleanup: (() => void) | undefined;
    if (typeof requestIdleCallback === "function") {
      const id = requestIdleCallback(() => setMounted(true), { timeout: 3000 });
      cleanup = () => cancelIdleCallback(id);
    } else {
      const id = window.setTimeout(() => setMounted(true), 1500);
      cleanup = () => clearTimeout(id);
    }
    return cleanup;
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const styles = getComputedStyle(document.documentElement);
    const primary =
      styles.getPropertyValue("--color-brand-primary").trim() ||
      "oklch(0.52 0.14 245)";
    const accent =
      styles.getPropertyValue("--color-brand-accent").trim() ||
      "oklch(0.68 0.09 230)";

    let particles: Particle[] = [];
    let raf = 0;
    let lastFrame = 0;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = w < 640 ? 0.000025 : 0.00005;
      const minCount = w < 640 ? 12 : 24;
      const maxCount = w < 640 ? 35 : 70;
      const count = Math.max(
        minCount,
        Math.min(maxCount, Math.floor(w * h * density)),
      );
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        r: Math.random() * 1.1 + 0.35,
        a: Math.random() * 0.22 + 0.08,
        hue: Math.random() < 0.78 ? 0 : 1,
      }));
    };

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (now - lastFrame < FRAME_INTERVAL) return;
      lastFrame = now;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -2) p.x = w + 2;
        else if (p.x > w + 2) p.x = -2;
        if (p.y < -2) p.y = h + 2;
        else if (p.y > h + 2) p.y = -2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const color = p.hue === 0 ? primary : accent;
        if (color.startsWith("oklch")) {
          ctx.fillStyle = color.replace(/\)$/, ` / ${p.a})`);
          ctx.globalAlpha = 1;
        } else {
          ctx.fillStyle = color;
          ctx.globalAlpha = p.a;
        }
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ willChange: "transform" }}
    />
  );
}
