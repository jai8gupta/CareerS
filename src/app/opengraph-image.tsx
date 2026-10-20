import { ImageResponse } from "next/og";

export const alt = "CareerSpeak — practise career English and sound ready when it matters";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px", background: "#101828", color: "white", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 32, fontWeight: 800 }}><div style={{ width: 58, height: 58, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", background: "#c7f36b", color: "#101828" }}>C</div>CareerSpeak</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 980 }}><div style={{ color: "#c7f36b", fontSize: 26, fontWeight: 700, letterSpacing: 2 }}>AI CAREER-ENGLISH PRACTICE</div><div style={{ fontSize: 72, lineHeight: 1.05, fontWeight: 800, letterSpacing: -3 }}>Sound ready when it matters.</div><div style={{ color: "#cbd5e1", fontSize: 30 }}>Speak naturally. Get precise feedback. Retry with confidence.</div></div>
    </div>,
    size,
  );
}
