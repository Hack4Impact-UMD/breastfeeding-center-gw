// Exportable.tsx  (REPLACE FILE CONTENTS)

import React from "react";
import satori from "satori";

type ExportAsSvgProps = {
  /** The chart + any extra elements (axis label, etc.) */
  content: React.ReactElement;
  filename?: string;
  title?: string;
  /** e.g. "2/19/25 – 3/19/25" or "All Data" */
  dateRange?: string | null;
  /** e.g., { Clients: "All Clients", Clinicians: "All Clinicians" } */
  selectedFilters?: Record<string, string>;
  /** Optional extra node under chart (usually not used for funnel) */
  legend?: React.ReactNode;
  /** Final exported canvas size (match Figma) */
  width?: number;   // default 1200
  height?: number;  // default 760
  backgroundColor?: string; // default '#ffffff'
};

// in Exportable.tsx
let inter400: ArrayBuffer | null = null;
let inter600: ArrayBuffer | null = null;

async function tryLoadFonts() {
  try {
    if (!inter400) {
      inter400 = await fetch(
        "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.1.0/files/inter-latin-400-normal.woff"
      ).then(r => r.arrayBuffer());
    }
    if (!inter600) {
      inter600 = await fetch(
        "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.1.0/files/inter-latin-600-normal.woff"
      ).then(r => r.arrayBuffer());
    }
    return [
      { name: "Inter", data: inter400!, weight: 400, style: "normal" },
      { name: "Inter", data: inter600!, weight: 600, style: "normal" }
    ];
  } catch {
    console.warn("Font load failed. Falling back to default.");
    return []; // satori will use default built-in font
  }
}
export async function exportAsSvg({
  content,
  filename = "graph",
  title = "",
  dateRange = null,
  selectedFilters,
  legend = null,
  width = 1200,
  height = 760,
  backgroundColor = "#ffffff",
}: ExportAsSvgProps) {
  try {

    const exportDom = (
      <div
        style={{
          boxSizing: "border-box",
          width,
          height,
          padding: 24,
          background: backgroundColor,
          fontFamily: "Inter",
          display: "flex",
          flexDirection: "column",
          color: "#0f172a",
          borderRadius: 16,
          border: "1px solid #D1D5DB",
        }}
      >
        {/* Title + date range */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 28, fontWeight: 600 }}>{title}</div>
          {dateRange ? (
            <div style={{ marginTop: 6, fontSize: 16, color: "#374151" }}>
              {dateRange}
            </div>
          ) : null}
          {selectedFilters && Object.keys(selectedFilters).length > 0 ? (
            <div style={{ marginTop: 4, fontSize: 16, color: "#6B7280" }}>
              {Object.values(selectedFilters).join(", ")}
            </div>
          ) : null}
        </div>

        {/* Chart area */}
        <div
          style={{
            flex: 1,
            position: "relative",
            marginTop: 12,
            display: "flex",          // 👈 add this
            flexDirection: "column",  // optional, but safe
          }}
        >
          {content}
        </div>

        {/* Optional legend */}
        {legend ? (
          <div
            style={{
              marginTop: 10,
              display: "flex",
              justifyContent: "center",
              fontSize: 14,
              color: "#111827",
            }}
          >
            {legend}
          </div>
        ) : null}
      </div>
    );

    const fonts = await tryLoadFonts();

    const svg = await satori(exportDom, { width, height, fonts });

    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Export failed", err);
    alert("Export failed. See console for details.");
  }
}
