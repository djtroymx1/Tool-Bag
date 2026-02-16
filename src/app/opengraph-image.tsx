import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const alt = "Tool Bag - Claude Code and Codex ecosystem tools";

export const contentType = "image/png";

export const runtime = "edge";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "sans-serif",
          background:
            "radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.35) 0%, rgba(24, 24, 27, 0) 45%), radial-gradient(circle at 85% 70%, rgba(14, 165, 233, 0.3) 0%, rgba(24, 24, 27, 0) 45%), #09090b",
          color: "#f4f4f5",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(to right, rgba(63, 63, 70, 0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(63, 63, 70, 0.22) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            opacity: 0.4,
          }}
        />

        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 64px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 999,
                background: "#10b981",
              }}
            />
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 999,
                background: "#0ea5e9",
              }}
            />
            <div
              style={{
                fontSize: 34,
                fontWeight: 700,
                letterSpacing: 0.2,
              }}
            >
              Tool Bag
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              maxWidth: 980,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 72,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: -1.5,
              }}
            >
              Claude Code + Codex
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 56,
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: -1,
                color: "#e4e4e7",
              }}
            >
              Skills, MCP Servers, and Config Exports
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 12,
              }}
            >
              {["55+ Tools", "7 Categories", "One-Click Exports"].map((label) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 16px",
                    borderRadius: 999,
                    border: "1px solid rgba(113, 113, 122, 0.55)",
                    background: "rgba(39, 39, 42, 0.6)",
                    fontSize: 24,
                    color: "#d4d4d8",
                    fontWeight: 600,
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 24,
                color: "#a1a1aa",
              }}
            >
              toolbag.digitalvisionworks.com
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
