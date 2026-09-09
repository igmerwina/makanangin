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
          justifyContent: "center",
          padding: "0 96px",
          background: "#fbf8f5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 128, fontWeight: 700, color: "#211a16", lineHeight: 1 }}>
          Makan
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <span style={{ fontSize: 128, fontWeight: 700, color: "#bf3222", lineHeight: 1 }}>Angin</span>
          <svg width="120" height="60" viewBox="0 0 64 32" fill="none">
            <path d="M2 8 H38 a6 6 0 1 0 -6 -6" stroke="#d9931b" strokeWidth="3" strokeLinecap="round" />
            <path d="M10 16 H54" stroke="#d9931b" strokeWidth="3" strokeLinecap="round" />
            <path d="M4 24 H44 a5 5 0 1 1 -5 5" stroke="#d9931b" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ display: "flex", fontSize: 38, color: "#6d5f55", marginTop: 28 }}>
          Pesan makanan Indonesia. Ga bakal dateng. Resepnya iya.
        </div>
      </div>
    ),
    { ...size }
  );
}
