import { ImageResponse } from "next/og";

export const dynamic = "force-static";
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
          alignItems: "center",
          justifyContent: "center",
          background: "#fff8ed",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 130, marginBottom: 16, display: "flex" }}>🍚</div>
        <div style={{ fontSize: 96, fontWeight: 700, color: "#171717", display: "flex" }}>Makan Angin</div>
        <div style={{ fontSize: 36, color: "#e62b20", marginTop: 12, display: "flex" }}>
          Pesan makanan Indonesia. Ga bakal dateng. Resepnya iya.
        </div>
      </div>
    ),
    { ...size }
  );
}
