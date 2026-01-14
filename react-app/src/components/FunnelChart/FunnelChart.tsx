import { useMemo } from "react";

type FunnelChartDataPoint = {
  label: string;
  value: number;
  backgroundColor: string;
  labelColor: string;
};

type FunnelChartProps = {
  data: FunnelChartDataPoint[];
  leftPadding?: number;
  spacing?: number;
};

function FunnelChartBlock({
  offset,
  width,
  next,
  pt,
  max,
  spacing,
}: {
  offset: number;
  width: number;
  max: number;
  next: FunnelChartDataPoint;
  pt: FunnelChartDataPoint;
  spacing: number;
}) {
  const nextVal = max > 0 ? (23 * next.value) / max : 0;
  const currVal = max > 0 ? (23 * pt.value) / max : 0;
  const padding = 7;
  const pts = [
    [offset + width - spacing, nextVal + padding],
    [offset + spacing, currVal + padding],
    [offset + spacing, -currVal - padding],
    [offset + width - spacing, -nextVal - padding],
  ];

  const center = [offset + width / 2, 0];

  const ptsString = pts.map((pt) => pt.join(",")).join(" ");
  const formattedLabel = pt.value.toLocaleString();

  return (
    <g>
      <polygon fill={pt.backgroundColor} points={ptsString} />
      <text
        x={`${center[0]}`}
        y={`${center[1]}`}
        textAnchor="middle"
        fontSize={formattedLabel.length <= 5 ? 4.5 : 3}
        fontWeight={"bold"}
        fill={pt.labelColor}
      >
        {formattedLabel}
      </text>
      <text
        x={`${center[0]}`}
        y={`${center[1] + 5}`}
        textAnchor="middle"
        fontSize={3}
        fill={pt.labelColor}
      >
        {pt.label}
      </text>
    </g>
  );
}

export default function FunnelChart({
  data,
  spacing = 0.2,
  leftPadding = 6,
}: FunnelChartProps) {
  const max = useMemo(() => {
    if (data.length === 0) return 0;

    let max = data[0].value;
    data.forEach((pt) => {
      max = Math.max(pt.value, max);
    });
    return max;
  }, [data]);

  return (
    <svg
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 -15 100 30"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full min-h-92 max-w-xl"
    >
      <text
        x={0.5 + leftPadding / 2}
        y="0"
        textAnchor="middle"
        transform={`rotate(270, ${0.5 + leftPadding / 2}, 0)`}
        fontSize={4.5}
        fontWeight={"bold"}
        className="fill-black"
      >
        Number of Clients
      </text>
      {data.map((d, index) => {
        const next = data[index + 1] ?? data[data.length - 1];
        return (
          <FunnelChartBlock
            key={index}
            spacing={spacing}
            max={max}
            width={(100 - leftPadding) / data.length}
            offset={leftPadding + index * ((100 - leftPadding) / data.length)}
            next={next}
            pt={d}
          />
        );
      })}
    </svg>
  );
}
