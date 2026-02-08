import queries from "@/queries";
import { getAllBooqableRentalsInRange } from "@/services/booqableService";
import { useQuery } from "@tanstack/react-query";

export function useBooqableRentalsInRange(startDate?: string, endDate?: string) {
  const startDateDefault = startDate ?? new Date().toISOString();
  const endDateDefault = endDate ?? new Date().toISOString();
  return useQuery({
    ...queries.booqable.rentals(startDate ?? startDateDefault, endDate ?? endDateDefault),
    queryFn: () => getAllBooqableRentalsInRange(startDate ?? startDateDefault, endDate ?? endDateDefault),
    enabled: !!startDate
  })
}
