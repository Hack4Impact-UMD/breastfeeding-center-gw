import { useQuery } from "@tanstack/react-query";
import { getAllJaneData } from "../../backend/FirestoreCalls";
import { DateTime } from "luxon";
import { JaneID } from "@/types/JaneType";

export function useJaneData() {
  return useQuery<JaneID[]>({
    queryKey: ["janeData"],
    queryFn: async () => {
      const data = await getAllJaneData();
      return data.map((entry) => ({
        ...entry,
        date: DateTime.fromISO(entry.date).toFormat("f"),
      }));
    },
  });
}
