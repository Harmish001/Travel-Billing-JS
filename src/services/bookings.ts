import axiosInstance from "@/src/lib/axios";
import { IGetBookingsResponse } from "@/src/types";

export const bookingsService = {
  // Get bookings by date range with pagination
  getBookingsByRange: async (
    startDate?: string,
    endDate?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<IGetBookingsResponse> => {
    try {
      const params: Record<string, string | number> = {
        page,
        limit,
      };

      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const { data } = await axiosInstance.get<IGetBookingsResponse>(
        "/bookings/range",
        { params }
      );
      return data;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  },

  // Get all bookings
  getAllBookings: async (): Promise<IGetBookingsResponse> => {
    try {
      const { data } = await axiosInstance.get<IGetBookingsResponse>(
        "/bookings"
      );
      return data;
    } catch (error) {
      console.error("Error fetching all bookings:", error);
      throw error;
    }
  },

  // Get bookings for a specific month
  getBookingsByMonth: async (
    monthYear: string
  ): Promise<IGetBookingsResponse> => {
    try {
      const { data } = await axiosInstance.get<IGetBookingsResponse>(
        `/bookings/month/${monthYear}`
      );
      return data;
    } catch (error) {
      console.error("Error fetching monthly bookings:", error);
      throw error;
    }
  },

  // Update booking status
  updateBookingStatus: async (
    id: string,
    status: "Pending" | "Completed" | "inProgress"
  ): Promise<IGetBookingsResponse> => {
    try {
      const { data } = await axiosInstance.patch<IGetBookingsResponse>(
        `/bookings/${id}/status`,
        { status }
      );
      return data;
    } catch (error) {
      console.error("Error updating booking status:", error);
      throw error;
    }
  },
};