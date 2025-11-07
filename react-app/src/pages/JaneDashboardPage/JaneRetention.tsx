import { useState, useRef } from "react";
import ClientLostPopup from "./ClientLostPopup.tsx";
import {
  FunnelChart,
  FunnelAxis,
  FunnelAxisLabel,
  FunnelArc,
  FunnelAxisLine,
  FunnelSeries,
} from "reaviz";
import { toPng } from "html-to-image";
import download from "downloadjs";
import {
  LostClient,
  RetentionRate,
  makeRetentionRateColumns,
} from "./JaneTableColumns";
import { useRetentionData } from "@/hooks/queries/useRetentionData.ts";
import { processRetentionData } from "@/backend/JaneFunctions.ts";
import { DataTable } from "@/components/DataTable/DataTable";

type JaneRetentionProps = {
  startDate?: Date | undefined;
  endDate?: Date | undefined;
};

const JaneRetention = ({ startDate, endDate }: JaneRetentionProps) => {
  const [selectedDropdown, setSelectedDropdown] = useState("ALL CLIENTS");
  const funnelChartRef = useRef<HTMLDivElement>(null);

  const transparentGrayButtonStyle =
    "bg-transparent hover:bg-bcgw-gray-light text-gray border-2 border-gray py-1 px-6 rounded-full cursor-pointer";
  const graphTableButtonStyle =
    "py-1 px-4 text-center shadow-sm bg-[#f5f5f5] hover:shadow-md text-black cursor-pointer border border-gray-300";
  const centerItemsInDiv = "flex justify-between items-center";
  const chartDiv =
    "flex flex-col items-center justify-start bg-white h-[370px] border-2 border-black p-5 mt-5 rounded-lg";

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

  const processedData = rawRetentionData
    ? processRetentionData(rawRetentionData)
    : [];

  const funnelData = processedData.map((row) => ({
    data: row.numberVisited,
    key: row.visit,
  }));

  const retentionData = processedData.map((row) => ({
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
  }));

  if (isRetentionLoading) return <div> Loading retention data... </div>;
  if (retentionError) return <div>Error loading retention data</div>;

  return (
    <div className="flex-[0_0_48%] max-w-[50%] min-w-[560px]">
      <div className={`${centerItemsInDiv} pt-4 mb-6`}>
        <div className="flex flex-row">
          <button
            className={`${graphTableButtonStyle} ${retentionDisplay === "graph"
                ? "bg-bcgw-gray-light"
                : "bg-[#CED8E1]"
              }`}
            onClick={() => setRetentionDisplay("graph")}
          >
            Graph
          </button>
          <button
            className={`${graphTableButtonStyle} ${retentionDisplay === "table"
                ? "bg-bcgw-gray-light"
                : "bg-[#CED8E1]"
              }`}
            onClick={() => setRetentionDisplay("table")}
          >
            Table
          </button>
        </div>
        <button
          className={transparentGrayButtonStyle}
          onClick={() => handleExport(funnelChartRef, "retention_rate")}
        >
          Export
        </button>
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
        {retentionDisplay === "graph" ? (
          <>
            <div className="self-end">
              <select
                className="border rounded-md px-2 py-1 text-sm"
                value={selectedDropdown}
                onChange={(e) => setSelectedDropdown(e.target.value)}
              >
                <option>ALL CLIENTS</option>
                <option>RECENT CHILDBIRTH</option>
              </select>
            </div>
            <div className="flex items-center">
              <span className="text-xl whitespace-nowrap -rotate-90 -mr-15 -ml-15">
                Number of Visits
              </span>

              <FunnelChart
                height={290}
                width={400}
                data={funnelData}
                series={
                  <FunnelSeries
                    arc={<FunnelArc colorScheme="#05182A" />}
                    axis={
                      <FunnelAxis
                        line={
                          <FunnelAxisLine
                            strokeColor="#FFFFFF"
                            strokeWidth={5}
                          ></FunnelAxisLine>
                        }
                        label={
                          <FunnelAxisLabel
                            className=""
                            labelVisibility="always"
                            fontSize={15}
                            position="middle"
                            fill="#FFFFFF"
                          />
                        }
                      />
                    }
                  />
                }
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
              //tableHeaderExtras={retentionHeaderExtras}
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
