import { useState, useRef, useMemo } from "react";
import ClientLostPopup from "./ClientLostPopup.tsx";
import { BarChart, BarSeries, BarProps, Bar, BarLabel } from "reaviz";
import { toPng } from "html-to-image";
import download from "downloadjs";
import {
  LostClient,
  RetentionRate,
  makeRetentionRateColumns,
} from "./JaneTableColumns";
import { useRetentionData } from "@/hooks/queries/useRetentionData.ts";
import { processRetentionData } from "@/services/janeService.ts";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button.tsx";
import SelectDropdown from "@/components/SelectDropdown.tsx";
import Loading from "@/components/Loading.tsx";

type JaneRetentionProps = {
  startDate?: Date | undefined;
  endDate?: Date | undefined;
};

const colors: Record<string, string> = {
  "Week 1": "#05182A",
  "Week 2": "#092D4F",
  "Week 3": "#0A3863",
  "Week 4": "#0A3863",
  "Week 5": "#0F4374",
  "Week 6": "#0F4374",
};

function CustomBar(props: Partial<BarProps>) {
  const label = props.data?.key as string | undefined;
  const fillColor = label && colors[label] ? colors[label] : "#000000";
  return (
    <Bar
      {...props}
      style={{
        fill: fillColor,
      }}
      label={<BarLabel />}
    />
  );
}

const JaneRetention = ({ startDate, endDate }: JaneRetentionProps) => {
  const [selectedDropdown, setSelectedDropdown] = useState("ALL CLIENTS");
  const funnelChartRef = useRef<HTMLDivElement>(null);

  const graphTableButtonStyle =
    "py-1 px-4 text-center shadow-sm bg-[#f5f5f5] hover:shadow-md text-black cursor-pointer border border-gray-300";
  const centerItemsInDiv = "flex justify-between items-center";
  const chartDiv =
    "flex flex-col items-center justify-start bg-white min-h-[400px] border-2 border-black p-5 mt-5 rounded-2xl";

  const [retentionDisplay, setRetentionDisplay] = useState<string>("graph");
  const [openRow, setOpenRow] = useState<RetentionRate | null>(null);

  const handleExport = async (
    ref: React.RefObject<HTMLDivElement | null>,
    filename: string,
  ) => {
    const element = ref.current;
    if (!element) {
      return;
    }
    try {
      const dataUrl = await toPng(element);
      download(dataUrl, `${filename}.png`);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });

  const {
    data: rawRetentionData,
    isLoading: isRetentionLoading,
    error: retentionError,
  } = useRetentionData(startDate, endDate);

  const processedData = useMemo(
    () => (rawRetentionData ? processRetentionData(rawRetentionData) : []),
    [rawRetentionData],
  );

  const funnelData = useMemo(
    () =>
      processedData.map((row) => ({
        data: row.numberVisited,
        key: `Week ${row.visit}`,
      })),
    [processedData],
  );

  const retentionData = useMemo(
    () =>
      processedData.map((row) => ({
        visit: `${row.visit} Visit${row.visit > 1 ? "s" : ""}`,
        numberVisited: row.numberVisited,
        percent: Number(row.percentTotal.toFixed(2)),
        loss: typeof row.numberLost === "number" ? row.numberLost : 0,
        clientsLostNames: row.clientsLost
          .map((client) => `${client.firstName} ${client.lastName}`)
          .join(", "),
        clients: row.clientsLost.map(
          (client): LostClient => ({
            first: client.firstName,
            last: client.lastName,
            email: client.email,
          }),
        ),
      })),
    [processedData],
  );

  if (retentionError) return <div>Error loading retention data</div>;

  return (
    <div className="flex-[0_0_48%] w-full lg:w-1/2">
      <div className={`${centerItemsInDiv} pt-4 mb-6`}>
        <div className="flex flex-row">
          <button
            className={`${graphTableButtonStyle} ${
              retentionDisplay === "graph"
                ? "bg-bcgw-gray-light"
                : "bg-[#CED8E1]"
            }`}
            onClick={() => setRetentionDisplay("graph")}
          >
            Graph
          </button>
          <button
            className={`${graphTableButtonStyle} ${
              retentionDisplay === "table"
                ? "bg-bcgw-gray-light"
                : "bg-[#CED8E1]"
            }`}
            onClick={() => setRetentionDisplay("table")}
          >
            Table
          </button>
        </div>
        <Button
          variant={"outlineGray"}
          className={
            "text-md rounded-full border-2 py-4 px-6 shadow-md hover:bg-bcgw-gray-light"
          }
          onClick={() => handleExport(funnelChartRef, "visit_breakdown")}
        >
          Export
        </Button>
      </div>
      <span className="self-start font-semibold text-2xl">
        Retention Rate:{" "}
        {startDate && endDate
          ? formatDate(startDate) + " - " + formatDate(endDate)
          : "All Data"}
      </span>
      <div
        className={retentionDisplay === "graph" ? chartDiv : ""}
        ref={funnelChartRef}
      >
        {isRetentionLoading ? (
          <Loading />
        ) : retentionDisplay === "graph" ? (
          <>
            <div className="self-end">
              <SelectDropdown
                options={["ALL CLIENTS", "RECENT CHILDBIRTH"]}
                selected={selectedDropdown}
                onChange={setSelectedDropdown}
              />
            </div>
            <div className="w-full">
              <BarChart
                height={300}
                data={funnelData}
                series={<BarSeries layout="vertical" bar={<CustomBar />} />}
              />
            </div>
          </>
        ) : (
          <>
            <div className="[&_td]:py-3 [&_th]:py-3">
              <DataTable
                columns={makeRetentionRateColumns((row) => setOpenRow(row))}
                data={retentionData}
                tableType="default"
              />
            </div>

            {openRow && (
              <ClientLostPopup openRow={openRow!} setOpenRow={setOpenRow} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JaneRetention;
