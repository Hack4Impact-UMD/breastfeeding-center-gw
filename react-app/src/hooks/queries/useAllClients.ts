import { useQuery } from "@tanstack/react-query";
import { getAllClients } from "@/services/clientService";
import { Client } from "@/types/ClientType";
import queries from "@/queries";

export function useAllClients() {
  return useQuery<Client[]>({
    ...queries.clients.all(),
    queryFn: getAllClients,
  });
}
