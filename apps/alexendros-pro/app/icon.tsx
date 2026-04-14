import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          borderRadius: 6,
        }}
      >
        A
      </div>
    ),
    { ...size },
  );
}
