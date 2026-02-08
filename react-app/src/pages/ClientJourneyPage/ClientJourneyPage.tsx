import {
  acuityColumns,
  AcuityData,
  JaneConsults,
  janeConsultsColumns,
  OneTimePurchase,
  oneTimePurchaseColumns,
  booqableColumns,
  BooqableRentals,
} from "./ClientJourneyTableColumns.tsx";
import { DataTable } from "../../components/DataTable/DataTable.tsx";
import { Navigate, useParams } from "react-router";
import { useClientByPatientId } from "@/hooks/queries/useClientById.ts";
import Loading from "@/components/Loading.tsx";
import { useJaneApptsForClient } from "@/hooks/queries/useJaneApptsForClient.ts";
import { useAcuityApptsForClients } from "@/hooks/queries/useAcuityApptsForClient.ts";
import { useMemo } from "react";
import { useSquarespaceOrdersForClients } from "@/hooks/queries/useSquarespaceOrdersForClient.ts";
import { useBooqableRentalsForClients } from "@/hooks/queries/useBooqableRentalsForClient.ts";

const ClientJourney = () => {
  //styles
  const centerItemsInDiv = "flex justify-between items-center";
  const tableSection = "py-3 space-y-3";

  const { id: clientId } = useParams();

  // get client info
  const {
    data: clientInfo,
    isPending: isClientInfoPending,
    error: clientInfoError,
  } = useClientByPatientId(clientId ?? "");

  const associatedClients = useMemo(
    () => (clientInfo ? [clientInfo, ...clientInfo.associatedClients] : []),
    [clientInfo],
  );

  // get appointments for the specific client
  const {
    data: clientApptData,
    isPending: janePending,
    error: janeError,
  } = useJaneApptsForClient(clientId ?? "");

  // get Acuity appts for the specific client
  const {
    data: acuityApptData,
    isPending: isAcuityPending,
    error: acuityError,
  } = useAcuityApptsForClients(associatedClients.map((c) => c.email));

  // get squarespace data
  const {
    data: squarespaceOrders,
    isPending: squarespacePending,
    error: squarespaceError,
  } = useSquarespaceOrdersForClients(associatedClients);

  // get booqable data
  const {
    data: booqableRentals,
    isPending: booqablePending,
    error: booqableError,
  } = useBooqableRentalsForClients(associatedClients);

  const sampleBooqable: BooqableRentals[] = [
    {
      item: "Item A",
      totalCost: 20,
      rate: 10,
      startDate: "2/2/2024",
      endDate: "2/9/2024",
      rentalLength: 7,
    },
    {
      item: "Item B",
      totalCost: 30,
      rate: 10,
      startDate: "2/2/2024",
      endDate: "2/9/2024",
      rentalLength: 14,
    },
  ];

  const otps: OneTimePurchase[] = useMemo(
    () =>
      squarespaceOrders?.flatMap((order) =>
        order.lineItems.map((item) => ({
          item: `${item.productName} x${item.quantity}`,
          cost: parseFloat(item.unitPricePaid.value) * item.quantity,
          date: order.fulfilledOn,
          platform: `Squarespace (${order.channel === "pos" ? "In-person" : "Online"})`,
        })),
      ) ?? [],
    [squarespaceOrders],
  );

  const janeConsultsData: JaneConsults[] =
    clientApptData?.map((appt) => ({
      clinician: appt.clinician,
      date: appt.startAt,
      service: appt.service,
      visitType: appt.visitType,
      insurance: clientInfo?.insurance || "",
    })) ?? [];

  const formattedJaneConsultsData: JaneConsults[] =
    janeConsultsData?.map((consult) => {
      const [firstName, lastName] = consult.clinician.split(" ");
      return {
        ...consult,
        clinician:
          firstName && lastName ? `${firstName[0]}. ${lastName}` : "N/A",
      };
    }) ?? [];

  const acuityData: AcuityData[] =
    acuityApptData?.map((appt) => ({
      class: appt.class,
      instructor: appt.instructor,
      date: appt.datetime,
    })) ?? [];

  if (!clientId) return <Navigate to="/" />;

  return (
    <>
      <div className="flex flex-col py-14">
        {/*headings*/}
        <div className={centerItemsInDiv}>
          <div>
            <h1 className="font-semibold text-3xl sm:text-4xl lg:text-5xl">
              Client Journey
            </h1>
          </div>
        </div>

        {/*info section*/}
        <div className="flex flex-col space-y-1 pt-1">
          {isClientInfoPending ? (
            <div className="min-h-[200px] flex items-center justify-center">
              <Loading />
            </div>
          ) : clientInfoError ? (
            <p className="text-red-600">
              Failed to load client info: {clientInfoError.message}
            </p>
          ) : (
            <div className="text-left space-y-2 py-2 w-full text-sm sm:text-base pt-3 pb-4">
              <div>
                <strong className="pr-2">NAME:</strong> {clientInfo?.firstName}{" "}
                {clientInfo?.lastName}
              </div>
              {clientInfo.baby.length > 0 && (
                <div>
                  <strong className="pr-2">CHILDREN:</strong>
                  {clientInfo?.baby.map((child, index) => (
                    <span key={index}>
                      {child.firstName} {child.lastName}
                      {index < clientInfo.baby.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              )}
              {clientInfo.associatedClients.length > 0 && (
                <div>
                  <strong className="pr-2">ASSOCIATED CLIENTS:</strong>
                  {clientInfo?.associatedClients.map((client, index) => (
                    <span key={index}>
                      {client.firstName} {client.lastName}
                      {index < clientInfo.associatedClients.length - 1
                        ? ", "
                        : ""}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/*tables section*/}
        <div>
          <div className={tableSection}>
            <h2 className="font-bold text-base sm:text-3xl">Acuity Classes</h2>
            {isAcuityPending ? (
              <div className="min-h-[200px] flex items-center justify-center">
                <Loading />
              </div>
            ) : acuityError ? (
              <p className="text-red-600">
                Failed to load acuity data: {acuityError.message}
              </p>
            ) : (
              <DataTable
                columns={acuityColumns}
                data={acuityData}
                tableType="default"
                pageSize={5}
              />
            )}
          </div>

          <div className={tableSection}>
            <h2 className="font-bold text-base sm:text-3xl">Jane Consults</h2>
            {janePending ? (
              <div className="min-h-[200px] flex items-center justify-center">
                <Loading />
              </div>
            ) : janeError ? (
              <p className="text-red-600">
                Failed to load Jane appointments: {janeError.message}
              </p>
            ) : (
              <DataTable
                columns={janeConsultsColumns}
                data={formattedJaneConsultsData}
                tableType="default"
                pageSize={5}
              />
            )}
          </div>

          <div className={tableSection}>
            <h2 className="font-bold text-base sm:text-3xl">
              Booqable Rentals
            </h2>
            {booqablePending ? (
              <Loading />
            ) : booqableError ? (
              <p className="text-red-600">
                Failed to load Booqable rentals: {booqableError.message}
              </p>
            ) : (
              <DataTable
                columns={booqableColumns}
                data={booqableRentals}
                tableType="default"
                pageSize={5}
              />
            )

            }
          </div>

          <div className={tableSection}>
            <h2 className="font-bold text-base sm:text-3xl">
              One-Time Purchases
            </h2>
            {squarespacePending ? (
              <Loading />
            ) : squarespaceError ? (
              <p className="text-red-600">
                Failed to load Squarespace orders: {squarespaceError.message}
              </p>
            ) : (
              <DataTable
                columns={oneTimePurchaseColumns}
                data={otps}
                tableType="default"
                pageSize={5}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientJourney;
