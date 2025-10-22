import React, { ReactNode } from "react";
import satori from "satori";

type ExportableProps = {
  element: HTMLElement | null;
  filename?: string;
  title?: string;
  dateRange?: string | null;
  selectedFilters?: Record<string, string>;
  legend?: ReactNode;
  width?: number;
  height?: number;
  backgroundColor?: string;
};

export async function exportAsSvg({
  element,
  filename = "graph",
  title = "",
  dateRange = null,
  legend = null,
  width = 1000,
  height = 700,
  backgroundColor = "#ffffff",
}: ExportableProps) {
  if (!element) {
    console.error("No element provided for export.");
    return;
  }

  try {
    const fontResp = await fetch(
      "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxM.woff"
    );
    const fontData = await fontResp.arrayBuffer();

    const clonedNode = element.cloneNode(true) as HTMLElement;

    const exportDom = (
      <div
        style={{
          boxSizing: "border-box",
          width: `${width}px`,
          height: `${height}px`,
          padding: "28px",
          background: backgroundColor,
          fontFamily: "Roboto, Arial, sans-serif",
          display: "flex",
          flexDirection: "column",
          color: "#0b0b0b",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 26, fontWeight: 700 }}>{title}</div>
          {dateRange && (
            <div style={{ fontSize: 16, color: "#444" }}>{dateRange}</div>
          )}
        </div>

        <div
          style={{
            flex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
          dangerouslySetInnerHTML={{ __html: clonedNode.innerHTML }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 14,
            fontSize: 14,
          }}
        >
          {legend}
        </div>
      </div>
    );

    const svg = await satori(exportDom, {
      width,
      height,
      fonts: [
        {
          name: "Roboto",
          data: fontData,
          weight: 400,
          style: "normal",
        },
      ],
    });

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
