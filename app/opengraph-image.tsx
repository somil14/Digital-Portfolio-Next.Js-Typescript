import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";
import { clusters, endpoints } from "@/content/syntheticData";
import { buildConstellation } from "@/lib/constellation";
import { imageColors, loadImageFonts } from "@/lib/ogFonts";

export const dynamic = "force-static";
export const alt = `${profile.name} — ${profile.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const { nodes } = buildConstellation(endpoints, clusters);
const [firstName, lastName] = profile.name.split(" ");

export default async function OpengraphImage() {
  const { bg, line, text, muted, signal, warn } = imageColors;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: bg,
        backgroundImage: `linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
        backgroundSize: "64px 64px",
        color: text,
      }}
    >
      {/* A few constellation dots on the right half. */}
      {nodes.map((node) => (
        <div
          key={node.endpoint.id}
          style={{
            position: "absolute",
            left: 870 + node.x * 300,
            top: 315 + node.y * 290,
            width: node.hub ? 12 : 7,
            height: node.hub ? 12 : 7,
            borderRadius: 999,
            backgroundColor: node.endpoint.documented ? signal : warn,
            opacity: node.endpoint.documented ? 0.75 : 1,
          }}
        />
      ))}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 72px",
          width: 760,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Geist Mono",
            fontSize: 22,
            letterSpacing: 2,
            color: muted,
          }}
        >
          <span style={{ color: signal, marginRight: 12 }}>GET</span>/ · 200 OK
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Instrument Serif",
            fontSize: 132,
            lineHeight: 1,
            marginTop: 22,
          }}
        >
          {firstName}
          <span style={{ fontStyle: "italic", marginLeft: 28 }}>
            {lastName}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Geist Mono",
            fontSize: 24,
            letterSpacing: 1.5,
            color: signal,
            marginTop: 30,
            textTransform: "uppercase",
          }}
        >
          {profile.headline}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Instrument Serif",
            fontSize: 40,
            marginTop: 26,
            color: text,
          }}
        >
          {profile.oneLiner}
        </div>
      </div>
    </div>,
    { ...size, fonts: await loadImageFonts() },
  );
}
