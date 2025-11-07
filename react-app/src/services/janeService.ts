import { axiosClient } from "@/lib/utils";
import { JaneAppt } from "../types/JaneType";
import { Client } from "../types/ClientType";

export async function getAllJaneApptsForClient(
  clientId?: string,
  startDate?: string,
  endDate?: string
): Promise<JaneAppt[]> {
  try {
    const axios = await axiosClient();

    // Build query parameters
    const params = new URLSearchParams();
    if (clientId) params.append("clientId", clientId);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const queryString = params.toString();
    const url = `/jane/appointments${queryString ? `?${queryString}` : ""}`;

    console.log(url);

    const response = await axios.get(url);
    return response.data as JaneAppt[];
  } catch (error) {
    console.error("Error fetching Jane appointments:", error);
    throw error;
  }
}

export async function getAllJaneApptsInRange(
  startDate?: string,
  endDate?: string,
): Promise<JaneAppt[]> {
  try {
    const axios = await axiosClient();

    // Build query parameters
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const queryString = params.toString();
    const url = `/jane/appointments${queryString ? `?${queryString}` : ""}`;

    console.log(url);

    const response = await axios.get(url);
    return response.data as JaneAppt[];
  } catch (error) {
    console.error("Error fetching Jane appointments:", error);
    throw error;
  }
}

export async function getAllJaneApptsInRangeWithClient(
  startDate?: string,
  endDate?: string,
): Promise<(JaneAppt & { client?: Client })[]> {
  try {
    const axios = await axiosClient();

    // Build query parameters
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    params.append("includeClient", "true");

    const queryString = params.toString();
    const url = `/jane/appointments${queryString ? `?${queryString}` : ""}`;

    console.log(url);

    const response = await axios.get(url);
    return response.data as (JaneAppt & { client?: Client })[];
  } catch (error) {
    console.error("Error fetching Jane appointments:", error);
    throw error;
  }
}

export async function getClientByPatientId(patientId: string): Promise<Client> {
  try {
    const axios = await axiosClient();
    const response = await axios.get(`/jane/client/${patientId}`);
    return response.data as Client;
  } catch (error) {
    console.error("Error fetching client by patient ID:", error);
    throw error;
  }
}

export async function deleteJaneApptById(id: string) {
  const axios = await axiosClient();
  await axios.delete("/jane/appointments/" + id);
}

export async function deleteJaneApptsByIds(ids: string[]) {
  const axios = await axiosClient();
  await axios.post("/jane/bulk/appointments/delete", { ids });
}
