import { Client, clientListColumns } from "./ClientListTableColumns.tsx";
import { DataTable } from "@/components/DataTable/DataTable.tsx";
import { useAllClients } from "@/hooks/queries/useAllClients";
import { useJaneAppts } from "@/hooks/queries/useJaneData";
import { DateTime } from "luxon";
import { useMemo } from "react";

const ClientList = () => {
  //styles
  const centerItemsInDiv = "flex justify-between items-center";

  const now = DateTime.now();
  const oneMonthAgo = now.minus({ months: 1 });
  const startDate = oneMonthAgo.startOf("day").toISO();
  const endDate = now.endOf("day").toISO();

  const { data: clients, isLoading: clientsLoading } = useAllClients();

  const { data: appointments, isLoading: appointmentsLoading } = useJaneAppts(
    startDate || undefined,
    endDate || undefined,
  );

  const clientData: Client[] = useMemo(() => {
    if (!clients || !appointments) {
      return [];
    }

    const appointmentCounts = new Map<string, number>();
    appointments.forEach((appt) => {
      const count = appointmentCounts.get(appt.patientId) || 0;
      appointmentCounts.set(appt.patientId, count + 1);
    });

    return clients.map((client) => ({
      firstName: client.firstName || "N/A",
      lastName: client.lastName || "N/A",
      email: client.email || "N/A",
      acuityClasses: 0,
      janeConsults: appointmentCounts.get(client.id) || 0,
      rentals: 0,
      purchases: 0,
    }));
  }, [clients, appointments]);

  const isLoading = clientsLoading || appointmentsLoading;

  return (
    <>
      <div className="flex flex-col py-14 px-10 sm:px-20">
        {/*headings*/}
        <div className={centerItemsInDiv}>
          <div>
            <h1 className="font-bold text-4xl lg:text-5xl">Client List</h1>
          </div>
        </div>

        {/*table section*/}
        <div className="mt-5">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <DataTable
              columns={clientListColumns}
              data={clientData}
              tableType="clientList"
              pageSize={10}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ClientList;
