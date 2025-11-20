import { useQuery } from "@tanstack/react-query";
import { getAllClients } from "@/services/clientService";
import { Client } from "@/types/ClientType";
import queries from "@/queries";
import { DateTime } from "luxon";
import { getAllJaneApptsInRange } from "@/services/janeService";
import { JaneAppt } from "@/types/JaneType";
import { ClientTableRow } from "@/pages/ClientListPage/ClientListTableColumns";

export function useClientListRows() {
  return useQuery<ClientTableRow[]>({
    ...queries.janeData.clientListRows(),
    queryFn: async (): Promise<ClientTableRow[]> => {
      const now = DateTime.now();
      const oneMonthAgo = now.minus({ months: 1 });
      const startDate = oneMonthAgo.startOf("day").toISO();
      const endDate = now.endOf("day").toISO();

      const appointments = await getAllJaneApptsInRange(startDate!, endDate!);
      // map matching client ids to their list of jane appts
      const clientAppts: Map<string, JaneAppt[]> = new Map();
      for (const appt of appointments) {
        if (!clientAppts.get(appt.clientId)) {
          clientAppts.set(appt.clientId, []);
        }

        clientAppts.get(appt.clientId)!.push(appt);
      }

      const clients = await getAllClients();

      return clients.map((client: Client) => ({
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        acuityClasses: 0,
        janeConsults: client.janeId
          ? (clientAppts.get(client.id)?.length ?? 0)
          : "N/A",
        rentals: 0,
        purchases: 0,
      }));
    },
  });
}
