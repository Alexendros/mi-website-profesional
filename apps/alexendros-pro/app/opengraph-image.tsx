import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "KitOS — Plataforma de kits digitales profesionales. En construcción.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "96px",
          backgroundColor: "#0a0b0d",
          backgroundImage:
            "radial-gradient(ellipse 65% 55% at 20% 0%, rgba(232,133,71,0.18), transparent 60%), radial-gradient(ellipse 55% 45% at 85% 100%, rgba(90,201,79,0.10), transparent 60%)",
          fontFamily: '"Geist", system-ui, sans-serif',
          color: "#f0f0f1",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#e88547",
            marginBottom: 32,
            fontFamily: "monospace",
          }}
        >
          KitOS · by Alexendros
        </div>
        <div
          style={{
            fontSize: 120,
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            marginBottom: 24,
          }}
        >
          En construcción.
        </div>
        <div
          style={{
            fontSize: 40,
            lineHeight: 1.3,
            color: "#a0a2a6",
            maxWidth: 900,
          }}
        >
          Plataforma de kits digitales profesionales.
        </div>
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 24,
            color: "#f0f0f1",
            fontFamily: "monospace",
            letterSpacing: "0.04em",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 9999,
              backgroundColor: "#e88547",
              boxShadow: "0 0 20px #e88547",
            }}
          />
          Próximamente · alexendros.pro
        </div>
      </div>
    ),
    { ...size },
  );
}
