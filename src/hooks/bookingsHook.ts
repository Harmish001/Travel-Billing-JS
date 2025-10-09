import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingsService } from "@/src/services/bookings";
import { QUERY_KEYS } from "@/src/constants/queryKey";

export const useBookingsQuery = (
  startDate?: string,
  endDate?: string,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOOKINGS.ALL, startDate, endDate, page, limit],
    queryFn: () => bookingsService.getBookingsByRange(startDate, endDate, page, limit),
    placeholderData: (previousData) => previousData,
  });
};

export const useAllBookingsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOOKINGS.ALL],
    queryFn: () => bookingsService.getAllBookings(),
  });
};

export const useBookingsByMonthQuery = (monthYear: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOOKINGS.MONTH, monthYear],
    queryFn: () => bookingsService.getBookingsByMonth(monthYear),
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "Pending" | "Completed" | "inProgress" }) => 
      bookingsService.updateBookingStatus(id, status),
    onSuccess: () => {
      // Invalidate and refetch bookings queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKINGS.ALL] });
    },
  });
};