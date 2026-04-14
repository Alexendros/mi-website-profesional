import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0b0d",
          color: "#e88547",
          fontFamily: '"Geist", system-ui, sans-serif',
          fontSize: 120,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          borderRadius: 32,
          boxShadow: "inset 0 0 80px rgba(232,133,71,0.15)",
        }}
      >
        A
      </div>
    ),
    { ...size },
  );
}
