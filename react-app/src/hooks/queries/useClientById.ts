import { useQuery } from "@tanstack/react-query";
import { getClientById } from "@/services/clientService";
import { Client } from "@/types/ClientType";
import queries from "@/queries";

export function useClientByPatientId(patientId: string) {
  return useQuery<Client>({
    ...queries.janeData.patientId(patientId),
    queryFn: () => getClientById(patientId),
  });
}
