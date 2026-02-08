import { axiosClient } from "@/lib/utils";

export type BooqableRental = {
  order: string;
  customerId: string;
  customerEmail?: string;
  firstPayDate: string;
  returnDate?: string;
  amount: number;
};

export async function getAllBooqableRentalsInRange(startDate: string, endDate: string) {
  const axios = await axiosClient();
  const resp = await axios.get<BooqableRental[]>(`/booqable/rentals?startDate=${startDate}&endDate=${endDate}`);

  return resp.data;
}

export async function getAllBooqableRentalsForClientByEmail(email: string) {
  const axios = await axiosClient();
  const resp = await axios.get<BooqableRental[]>(`/booqable/rentals/customer?email=${email}`);

  return resp.data;
}
export async function getAllBooqableRentalsForClientById(id: string) {
  const axios = await axiosClient();
  const resp = await axios.get<BooqableRental[]>(`/booqable/rentals/customer?stripeId=${id}`);

  return resp.data;
}
