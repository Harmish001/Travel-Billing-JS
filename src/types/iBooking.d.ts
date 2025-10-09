export interface IBooking {
  _id: string;
  name: string;
  email?: string;
  phoneNumber: string;
  date: string;
  time: string;
  pickup: string;
  drop: string;
  description?: string;
  vehicle: string;
  status: "Pending" | "Completed" | "inProgress";
  createdAt: string;
  updatedAt: string;
}

export interface IBookingPagination {
  currentPage: number;
  totalPages: number;
  totalBookings: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IGetBookingsResponse {
  status: boolean;
  message: string;
  data: {
    bookings: IBooking[];
    pagination: IBookingPagination;
  };
}