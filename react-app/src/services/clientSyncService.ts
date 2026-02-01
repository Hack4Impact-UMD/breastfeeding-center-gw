import { axiosClient } from "@/lib/utils";

export type ClientSyncResult = {
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
): Promise<ClientSyncResult> {
  try {
    const axios = await axiosClient();
    const response = await axios.post("/clients/sync/acuity", {
      startDate,
      endDate,
    });
    return response.data as ClientSyncResult;
  } catch (error) {
    console.error("Error syncing Acuity clients:", error);
    throw error;
  }
}

export async function syncSquarespaceClients(
  startDate?: string,
  endDate?: string,
): Promise<ClientSyncResult> {
  try {
    const axios = await axiosClient();
    const response = await axios.post("/clients/sync/squarespace", {
      startDate,
      endDate,
    });
    return response.data as ClientSyncResult;
  } catch (error) {
    console.error("Error syncing Squarespace clients:", error);
    throw error;
  }
}
