import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/utils";
import { Client } from "@/types/ClientType";
import queries from "@/queries";

export function useRetentionData(startDate?: Date, endDate?: Date, recentChildbirth: boolean = false) {
  return useQuery<{ [key: number]: Client[] }>({
    ...queries.janeData.retention(startDate?.toISOString(), endDate?.toISOString(), recentChildbirth),
    queryFn: async () => {
      const axiosInstance = await axiosClient();
      const response = await axiosInstance.get("/jane/retention", {
        params: { startDate, endDate, recentChildbirth },
      });
      return response.data;
    },
  });
}
