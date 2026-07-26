import { ImageResponse } from "next/og";

export const alt = "NUNBIT — Every eye sees a different light.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ alignItems: "stretch", background: "#F7F7FC", color: "#2D2330", display: "flex", height: "100%", padding: 48, width: "100%" }}>
      <div style={{ alignItems: "stretch", background: "#FFFFFF", border: "2px solid #DED7E2", borderRadius: 44, display: "flex", height: "100%", overflow: "hidden", padding: "72px 78px", position: "relative", width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "62%" }}>
          <div style={{ alignItems: "center", display: "flex", fontSize: 26, fontWeight: 700, letterSpacing: -1.4 }}>
            <div style={{ alignItems: "center", background: "#F7F7FC", borderRadius: 18, display: "flex", height: 46, justifyContent: "center", marginRight: 16, width: 46 }}>
              <div style={{ color: "#2D2330", fontSize: 28, fontWeight: 800 }}>N</div>
            </div>
            NUNBIT
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#6E6474", fontSize: 22, letterSpacing: 1.5, marginBottom: 22 }}>COLOR, SHARED MORE CLEARLY</div>
            <div style={{ display: "flex", flexDirection: "column", fontSize: 62, fontWeight: 700, letterSpacing: -3.6, lineHeight: 1.05 }}>
              <span>Every eye sees</span>
              <span>a different light.</span>
            </div>
          </div>
          <div style={{ color: "#6E6474", fontSize: 22 }}>Photo translation · Color-vision simulation · HEX &amp; RGB</div>
        </div>
        <div style={{ alignItems: "center", display: "flex", flex: 1, justifyContent: "center", position: "relative" }}>
          <div style={{ alignItems: "center", background: "#F7F7FC", borderRadius: 999, display: "flex", height: 320, justifyContent: "center", position: "relative", width: 320 }}>
            <div style={{ border: "36px solid #2D2330", borderRadius: 999, height: 190, position: "absolute", transform: "rotate(-32deg)", width: 190 }} />
            <div style={{ background: "#9B4A76", borderRadius: 999, height: 58, left: 196, position: "absolute", top: 59, width: 58 }} />
            <div style={{ background: "#FFFFFF", borderRadius: 999, height: 84, width: 84 }} />
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
