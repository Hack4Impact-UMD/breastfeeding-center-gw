import { useQuery } from "@tanstack/react-query";
import { getAllJaneApptsForClient } from "@/services/janeService";
import { JaneAppt } from "@/types/JaneType";
import queries from "@/queries";

export function useJaneApptsForClient(clientId?: string) {
  return useQuery<JaneAppt[]>({
    ...queries.janeData.appts(clientId),
    queryFn: () => getAllJaneApptsForClient(clientId),
  });
}
