import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const fontData = await readFile(
    path.join(process.cwd(), "src/fonts/EBGaramond-Medium.woff")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#1E2B24",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontFamily: "EB Garamond",
            fontSize: 72,
            fontWeight: 500,
            color: "#EDEAE0",
          }}
        >
          Prannoy Nambiar
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 28,
            color: "#8C968F",
          }}
        >
          Essays, poems, a corkboard, and projects.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "EB Garamond",
          data: fontData,
          style: "normal",
          weight: 500,
        },
      ],
    }
  );
}
