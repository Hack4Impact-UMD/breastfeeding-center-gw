import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/utils";
import { Client } from "@/types/ClientType";

export function useRetention(startDate?: Date, endDate?: Date) {
  return useQuery<{ [key: number]: Client[] }>({
    queryKey: [startDate, endDate],
    queryFn: async () => {
      const axiosInstance = await axiosClient();
      const response = await axiosInstance.get("/jane/retention", {
        params: { startDate, endDate },
      });
      return response.data;
    },
  });
}
