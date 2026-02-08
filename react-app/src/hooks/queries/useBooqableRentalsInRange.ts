import queries from "@/queries";
import { getAllBooqableRentalsInRange } from "@/services/booqableService";
import { useQuery } from "@tanstack/react-query";

export function useBooqableRentalsInRange(startDate?: string, endDate?: string) {
  return useQuery({
    ...queries.booqable.rentals(startDate ?? new Date().toISOString(), endDate ?? new Date().toISOString()),
    queryFn: () => getAllBooqableRentalsInRange(startDate ?? new Date().toISOString(), endDate ?? new Date().toISOString()),
    enabled: !!startDate
  })
}
