import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "alexendros.pro — Plataforma de Alexendros. En construcción.";
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
          backgroundColor: "#080c14",
          backgroundImage:
            "radial-gradient(ellipse 70% 60% at 15% 10%, rgba(58,125,198,0.22), transparent 62%), radial-gradient(ellipse 55% 50% at 90% 95%, rgba(122,169,212,0.12), transparent 62%)",
          fontFamily: '"Geist", system-ui, sans-serif',
          color: "#eff3f7",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#7aa9d4",
            marginBottom: 32,
            fontFamily: "monospace",
          }}
        >
          alexendros.pro · by Alexendros
        </div>
        <div
          style={{
            fontSize: 120,
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
            marginBottom: 24,
          }}
        >
          En construcción.
        </div>
        <div
          style={{
            fontSize: 40,
            lineHeight: 1.3,
            color: "#b7bcc4",
            maxWidth: 900,
          }}
        >
          Plataforma de Alexendros.
        </div>
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 24,
            color: "#eff3f7",
            fontFamily: "monospace",
            letterSpacing: "0.06em",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 9999,
              backgroundColor: "#4c8bd1",
              boxShadow: "0 0 24px #3a7dc6",
            }}
          />
          Próximamente · alexendros.pro
        </div>
      </div>
    ),
    { ...size },
  );
}
