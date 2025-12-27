import { axiosClient } from "@/lib/utils";
import { Client } from "../types/ClientType";

export async function getAllClients(): Promise<Client[]> {
  try {
    const axios = await axiosClient();
    const response = await axios.get("/clients/all");
    return response.data as Client[];
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
}

export async function getClientById(id: string): Promise<Client> {
  try {
    const axios = await axiosClient();
    const response = await axios.get(`/clients/id/${id}`);
    return response.data as Client;
  } catch (error) {
    console.error("Error fetching client by patient ID:", error);
    throw error;
  }
}
