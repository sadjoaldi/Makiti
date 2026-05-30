import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Makiti — Marketplace des petites annonces en Guinée";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Logo M dans rond */}
      <div
        style={{
          width: 140,
          height: 140,
          borderRadius: "50%",
          backgroundColor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 40,
        }}
      >
        <div style={{ fontSize: 90, fontWeight: 900, color: "#ffffff" }}>M</div>
      </div>
      <div style={{ fontSize: 72, fontWeight: 900, color: "#000000" }}>
        Makiti
      </div>
      <div style={{ fontSize: 32, color: "#666666", marginTop: 12 }}>
        Petites annonces en Guinée
      </div>
    </div>,
    { ...size },
  );
}
