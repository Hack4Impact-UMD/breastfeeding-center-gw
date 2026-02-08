import { axiosClient } from "@/lib/utils";

export type BooqableRental = {
  order: string;
  customerId: string;
  customerEmail?: string;
  firstPayDate: string;
  returnDate?: string;
  amount: number;
  customerName?: string
};

export async function getAllBooqableRentalsInRange(startDate: string, endDate: string) {
  const axios = await axiosClient();
  const resp = await axios.get<BooqableRental[]>(`/booqable/rentals`, {
    params: {
      startDate,
      endDate
    }
  });

  return resp.data;
}

export async function getAllBooqableRentalsForClientByEmail(email: string) {
  const axios = await axiosClient();
  const resp = await axios.get<BooqableRental[]>(`/booqable/rentals/customer`, {
    params: {
      email
    }
  });

  return resp.data;
}
export async function getAllBooqableRentalsForClientById(id: string) {
  const axios = await axiosClient();
  const resp = await axios.get<BooqableRental[]>(`/booqable/rentals/customer`, {
    params: {
      stripeId: id
    }
  });

  return resp.data;
}
