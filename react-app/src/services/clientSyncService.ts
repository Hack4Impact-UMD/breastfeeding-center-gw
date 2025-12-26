import { axiosClient } from "@/lib/utils";

export type SyncAcuityClientsResult = {
  status: "OK" | "ERROR";
  stats?: {
    newClients: number;
    updatedClients: number;
  };
  message?: string;
};

export async function syncAcuityClients(
  startDate?: string,
  endDate?: string,
): Promise<SyncAcuityClientsResult> {
  try {
    const axios = await axiosClient();
    const response = await axios.post("/clients/sync/acuity", {
      startDate,
      endDate,
    });
    return response.data as SyncAcuityClientsResult;
  } catch (error) {
    console.error("Error syncing Acuity clients:", error);
    throw error;
  }
}
