import { axiosClient } from "@/lib/utils";
import { Client } from "../types/ClientType";

export async function getAllClients(): Promise<Client[]> {
  try {
    const axios = await axiosClient();
    const response = await axios.get("/jane/clients");
    return response.data as Client[];
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
}
