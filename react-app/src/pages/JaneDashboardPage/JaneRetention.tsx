import { useState, useMemo } from "react";
import ClientLostPopup from "./ClientLostPopup.tsx";
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
import { Export } from "@/components/export/Export.tsx";
import ExportContent from "@/components/export/ExportContent.tsx";
import ExportTrigger from "@/components/export/ExportTrigger.tsx";
import ExportOnly from "@/components/export/ExportOnly.tsx";
import { formatDate } from "@/lib/utils.ts";
import type { Client } from "@/types/ClientType";
import { hasRecentBirth } from "@/lib/clientUtils.ts";
import { exportCsv } from "@/lib/tableExportUtils.ts";
import FunnelChart from "@/components/FunnelChart/FunnelChart.tsx";

//TODO: recent childbirth should use the appt time as the ref date
function filterClients(
  clientsByNumVisits: { [key: number]: Client[] } | undefined,
  endDate?: Date,
  mode: "ALL CLIENTS" | "RECENT CHILDBIRTH" = "ALL CLIENTS",
): { [key: number]: Client[] } | undefined {
  if (!clientsByNumVisits) return undefined;
  if (mode !== "RECENT CHILDBIRTH") return clientsByNumVisits;
  if (!endDate) return clientsByNumVisits;

  const refDate = endDate;
  const result: { [key: number]: Client[] } = {};

  Object.entries(clientsByNumVisits).forEach(([visitStr, clients]) => {
    const visit = Number(visitStr);
    result[visit] = clients.filter((client) => hasRecentBirth(client, refDate));
  });

  return result;
}

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

const JaneRetention = ({ startDate, endDate }: JaneRetentionProps) => {
  const [selectedDropdown, setSelectedDropdown] = useState<
    "ALL CLIENTS" | "RECENT CHILDBIRTH"
  >("ALL CLIENTS");

  const graphTableButtonStyle =
    "py-1 px-4 text-center shadow-sm bg-[#f5f5f5] hover:shadow-md text-black cursor-pointer border border-gray-300";
  const centerItemsInDiv = "flex justify-between items-center";
  const chartDiv =
    "flex flex-col items-center justify-center bg-white min-h-116 border-2 border-black p-5 mt-5 rounded-2xl";

  const [retentionDisplay, setRetentionDisplay] = useState<"graph" | "table">(
    "graph",
  );
  const [openRow, setOpenRow] = useState<RetentionRate | null>(null);

  const dateRangeLabel =
    startDate && endDate
      ? formatDate(startDate) + " - " + formatDate(endDate)
      : "All Data";

  const {
    data: rawRetentionData,
    isLoading: isRetentionLoading,
    error: retentionError,
  } = useRetentionData(startDate, endDate);

  const filteredRetentionSource = useMemo(
    () =>
      filterClients(
        rawRetentionData as { [key: number]: Client[] } | undefined,
        endDate,
        selectedDropdown,
      ),
    [rawRetentionData, endDate, selectedDropdown],
  );

  const processedData = useMemo(
    () =>
      filteredRetentionSource
        ? processRetentionData(filteredRetentionSource)
        : [],
    [filteredRetentionSource],
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

  const noData = useMemo(
    () => !funnelData.some((d) => d.data > 0),
    [funnelData],
  );

  if (retentionError) return <div>Error loading retention data</div>;

  return (
    <div className="flex-[0_0_48%] w-full lg:w-1/2">
      <Export title={`RetentionRate${dateRangeLabel}`}>
        {/* toggle + export */}
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
          {retentionDisplay === "table" ? (
            <Button
              variant={"outlineGray"}
              className={
                "text-md rounded-full border-2 py-4 px-6 shadow-md hover:bg-bcgw-gray-light"
              }
              onClick={() =>
                exportCsv(
                  retentionData,
                  `jane_retention_${startDate?.toISOString()}_${endDate?.toISOString()}_${selectedDropdown}`,
                )
              }
            >
              Export
            </Button>
          ) : (
            <ExportTrigger
              disabled={retentionDisplay !== "graph" || noData}
              asChild
            >
              <Button
                variant={"outlineGray"}
                className={
                  "text-md rounded-full border-2 py-4 px-6 shadow-md hover:bg-bcgw-gray-light"
                }
              >
                Export
              </Button>
            </ExportTrigger>
          )}
        </div>

        <span className="self-start font-semibold text-2xl">
          Retention Rate: {dateRangeLabel}
        </span>

        <div className={retentionDisplay === "graph" ? chartDiv : ""}>
          {isRetentionLoading ? (
            <Loading />
          ) : retentionDisplay === "graph" ? (
            noData ? (
              <div className="w-full flex grow items-center justify-center p-2">
                <p className="text-center">
                  No data. Check the selected date range.
                </p>
              </div>
            ) : (
              <>
                {/* GRAPH VIEW – keep dropdown top-right in card */}
                <div className="self-end mb-4">
                  <SelectDropdown
                    options={["ALL CLIENTS", "RECENT CHILDBIRTH"]}
                    selected={selectedDropdown}
                    onChange={(val) =>
                      setSelectedDropdown(
                        val as "ALL CLIENTS" | "RECENT CHILDBIRTH",
                      )
                    }
                  />
                </div>
                <ExportContent className="w-full h-92">
                  <ExportOnly className="mb-5">
                    <h1 className="text-xl font-bold text-black">
                      Client Retention
                    </h1>
                    <p className="text-base text-black">{dateRangeLabel}</p>
                    <p className="text-gray-800 text-sm">{selectedDropdown}</p>
                  </ExportOnly>
                  <FunnelChart data={funnelData.map(d => ({
                    label: d.key,
                    value: d.data,
                    backgroundColor: colors[d.key],
                    labelColor: "#FFFFFF"
                  }))} />
                </ExportContent>
              </>
            )
          ) : (
            <>
              {/* TABLE VIEW */}
              <div className="[&_td]:py-3 [&_th]:py-3">
                <DataTable
                  columns={makeRetentionRateColumns((row) => setOpenRow(row))}
                  data={retentionData}
                  tableType="default"
                  className="h-128"
                  rowClassName="h-16"
                  tableHeaderExtras={
                    <div className="flex w-full h-full items-center justify-end px-2">
                      <SelectDropdown
                        options={["ALL CLIENTS", "RECENT CHILDBIRTH"]}
                        selected={selectedDropdown}
                        onChange={(val) =>
                          setSelectedDropdown(
                            val as "ALL CLIENTS" | "RECENT CHILDBIRTH",
                          )
                        }
                      />
                    </div>
                  }
                />
              </div>

              {openRow && (
                <ClientLostPopup openRow={openRow} setOpenRow={setOpenRow} />
              )}
            </>
          )}
        </div>
      </Export>
    </div>
  );
};

export default JaneRetention;
