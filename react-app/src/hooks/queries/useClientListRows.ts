import { useQuery } from "@tanstack/react-query";
import { getAllClients } from "@/services/clientService";
import { Client } from "@/types/ClientType";
import queries from "@/queries";
import { DateTime } from "luxon";
import { getAllJaneApptsInRange } from "@/services/janeService";
import { JaneAppt } from "@/types/JaneType";
import { ClientTableRow } from "@/pages/ClientListPage/ClientListTableColumns";
import { getAllAcuityApptsInRange } from "@/services/acuityService";

export function useClientListRows() {
  return useQuery<ClientTableRow[]>({
    ...queries.clients.clientListRows(),
    queryFn: async (): Promise<ClientTableRow[]> => {
      const now = DateTime.now();
      const oneMonthAgo = now.minus({ months: 1 });
      const startDate = oneMonthAgo.startOf("day").toISO();
      const endDate = now.endOf("day").toISO();

      const [janeAppointments, acuityAppoinments] = await Promise.all([
        getAllJaneApptsInRange(startDate!, endDate!),
        getAllAcuityApptsInRange(startDate!, endDate!),
      ]);

      // map matching client ids to their list of jane appts
      const clientAppts: Map<string, JaneAppt[]> = new Map();
      for (const appt of janeAppointments) {
        if (!clientAppts.get(appt.clientId)) {
          clientAppts.set(appt.clientId, []);
        }

        clientAppts.get(appt.clientId)!.push(appt);
      }

      const acuityClassCounts: Map<string, number> = new Map();
      for (const appt of acuityAppoinments) {
        if (!appt.email) continue;
        const email = appt.email.toLowerCase();
        const currentCount = acuityClassCounts.get(email) || 0;
        acuityClassCounts.set(email, currentCount + 1);
      }

      const clients = await getAllClients();

      return clients.map((client: Client) => ({
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        acuityClasses: client.email
          ? (acuityClassCounts.get(client.email.toLowerCase()) ?? 0)
          : "N/A",
        janeConsults: client.janeId
          ? (clientAppts.get(client.id)?.length ?? 0)
          : "N/A",
        rentals: 0,
        purchases: 0,
      }));
    },
  });
}
