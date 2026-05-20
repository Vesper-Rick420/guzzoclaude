import { ImageResponse } from "next/og";

// Imagen que se muestra al compartir el sitio en redes sociales.
export const alt = "GUZZO — Date el gusto";
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
          backgroundColor: "#010101",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 32,
            letterSpacing: 14,
            color: "#f18a00",
            textTransform: "uppercase",
          }}
        >
          Menú Digital
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 220,
            fontWeight: 800,
            color: "#ffffff",
            marginTop: 8,
          }}
        >
          GUZZO
        </div>
        <div
          style={{
            display: "flex",
            width: 180,
            height: 12,
            backgroundColor: "#f18a00",
            borderRadius: 999,
            marginTop: 12,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 42,
            color: "rgba(255,255,255,0.6)",
            marginTop: 36,
          }}
        >
          Date el gusto
        </div>
      </div>
    ),
    { ...size },
  );
}
