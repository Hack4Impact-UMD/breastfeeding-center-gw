import { axiosClient } from "@/lib/utils";
import { JaneAppt } from "../types/JaneType";
import { Client } from "../types/ClientType";

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
    
    const response = await axios.get(url);
    return response.data as JaneAppt[];
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
