import { useMemo } from "react"

type FunnelChartDataPoint = {
  label: string,
  value: number,
  backgroundColor: string
  labelColor: string
}

type FunnelChartProps = {
  data: FunnelChartDataPoint[]
}

function FunnelChartBlock({ offset, width, prev, pt, max }: { offset: number, width: number, max: number, prev: FunnelChartDataPoint, pt: FunnelChartDataPoint }) {
  const prevVal = 25 * prev.value / max;
  const currVal = 25 * pt.value / max;
  const padding = 10;
  const pts = [
    [offset + width, currVal + padding],
    [offset, prevVal + padding],
    [offset, -prevVal - padding],
    [offset + width, -currVal - padding],
  ];

  const center = [offset + width / 2, 0]

  const ptsString = pts.map(pt => pt.join(",")).join(" ")

  return <g>
    <polygon fill={pt.backgroundColor} points={ptsString} />
    <text x={`${center[0]}`} y={`${center[1]}`} textAnchor="middle" fontSize={4.5} fontWeight={"bold"} fill={pt.labelColor}>
      {pt.value.toLocaleString("en-us")}
    </text>
    <text x={`${center[0]}`} y={`${center[1] + 5}`} textAnchor="middle" fontSize={3} fill={pt.labelColor}>
      {pt.label}
    </text>
  </g>
}

export default function FunnelChart({ data }: FunnelChartProps) {
  console.log(data)
  const max = useMemo(() => {
    let max = data[0].value;
    data.forEach(pt => {
      max = Math.max(pt.value, max)
    });
    return max;
  }, [data])

  return <svg viewBox="0 -15 100 30" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <text x="4" y="0" textAnchor="middle" transform={"rotate(270, 4, 0)"} fontSize={4.5} fontWeight={"bold"} className="fill-black">Number of Clients</text>
    {data.map((d, index) => {
      const prev = data[index - 1] ?? data[0];
      return <FunnelChartBlock max={max} width={(100 - 6) / data.length} offset={6 + index * ((100 - 6) / data.length)} prev={prev} pt={d} />
    })}
  </svg>
}
