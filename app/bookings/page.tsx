import AuthGuard from "@/src/components/Auth/AuthGuard";
import DashboardLayout from "@/src/components/Layout/DashboardLayout";
import BookingManagement from "@/src/components/Bookings/BookingManagement";

export default function BookingsPage() {
  return (
    <AuthGuard>
      <DashboardLayout currentPage="bookings">
        <BookingManagement />
      </DashboardLayout>
    </AuthGuard>
  );
}