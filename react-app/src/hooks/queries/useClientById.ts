import { useQuery } from "@tanstack/react-query";
import { getClientByPatientId } from "@/services/janeService";
import { Client } from "@/types/ClientType";
import queries from "@/queries";

export function useClientByPatientId(patientId: string) {
  return useQuery<Client>({
    ...queries.janeData.patientId(patientId),
    queryFn: () => getClientByPatientId(patientId),
  });
}
