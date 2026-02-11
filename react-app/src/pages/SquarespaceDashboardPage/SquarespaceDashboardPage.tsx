import {
  DateRangePicker,
  defaultDateRange,
  defaultPresets,
} from "@/components/DateRangePicker/DateRangePicker.tsx";
import { useSquarespaceOrdersInRangeWithProfiles } from "@/hooks/queries/useAllSquarespaceOrdersInRangeWithProfiles.ts";
import Loading from "@/components/Loading.tsx";
import { DataTable } from "@/components/DataTable/DataTable.tsx";
import {
  SquarespaceOrder,
  squarespaceColumns,
} from "./SquarespaceTableColumns.tsx";
import { DateRange } from "react-day-picker";
import { useMemo, useState } from "react";

const SquarespaceDashboardPage = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    defaultDateRange,
  );

  const {
    data: squarespaceOrders,
    isPending,
    error,
  } = useSquarespaceOrdersInRangeWithProfiles(
    dateRange?.from?.toISOString(),
    dateRange?.to?.toISOString(),
  );

  const orders: SquarespaceOrder[] = useMemo(
    () =>
      squarespaceOrders?.flatMap((order) =>
        order.lineItems.map((item) => ({
          name: `${order.customerProfile?.firstName ?? "In-Person Client"} ${order.customerProfile?.lastName ?? ""}`,
          email: order.customerProfile?.email ?? "N/A",
          item: `${item.productName} x${item.quantity}`,
          cost: parseFloat(item.unitPricePaid.value) * item.quantity,
          date: order.fulfilledOn,
          channel: `${order.channel === "pos" ? "In-person" : "Online"}`,
          id: order.client?.id ?? undefined,
        })),
      ) ?? [],
    [squarespaceOrders],
  );

  return (
    <>
      <div className="flex flex-col py-14">
        <div className="flex flex-col-reverse gap-4 md:flex-row md:items-center justify-between mb-4">
          <h1 className="w-full font-semibold text-3xl sm:text-4xl lg:text-5xl">
            Squarespace
          </h1>
          <div className="flex justify-end">
            <DateRangePicker
              enableYearNavigation
              value={dateRange}
              onChange={(range) => setDateRange(range)}
              presets={defaultPresets}
              className="w-60"
            />
          </div>
        </div>

        {/* DATA TABLE OR LOADING */}
        {isPending ? (
          <div className="flex justify-center items-center">
            <Loading />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center p-8">
            <p className="text-red-600">
              Failed to load Squarespace data: {error.message}
            </p>
          </div>
        ) : (
          <DataTable
            columns={squarespaceColumns}
            data={orders}
            tableType="squarespaceData"
            pageSize={10}
          />
        )}
      </div>
    </>
  );
};

export default SquarespaceDashboardPage;
