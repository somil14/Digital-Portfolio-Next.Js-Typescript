import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";
import { imageColors, loadImageFonts } from "@/lib/ogFonts";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: imageColors.bg,
        color: imageColors.signal,
        fontFamily: "Geist Mono",
        fontSize: 84,
        letterSpacing: 4,
      }}
    >
      {profile.monogram}
    </div>,
    { ...size, fonts: await loadImageFonts() },
  );
}
