import { axiosClient } from "@/lib/utils";
import { AcuityAppointment } from "@/types/AcuityType";

export async function getAllAcuityApptsInRange(
  start?: string,
  end?: string,
  category?: string,
): Promise<AcuityAppointment[]> {
  try {
    const axios = await axiosClient();

    const params = new URLSearchParams();
    if (start) params.append("startDate", start);
    if (end) params.append("endDate", end);
    if (category) params.append("classCategory", category);

    const queryString = params.toString();
    const url = `/acuity/appointments${queryString ? `?${queryString}` : ""}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching Acuity appointments:", error);
    throw error;
  }
}

export async function getAllAcuityApptsForClient(
  email: string
): Promise<AcuityAppointment[]> {
  const axios = await axiosClient();
  const response = await axios.get("/acuity/appointments/client", {
    params: { email }
  });
  return response.data as AcuityAppointment[];
}
