import AuthGuard from "@/src/components/Auth/AuthGuard";
import DashboardLayout from "@/src/components/Layout/DashboardLayout";
import DriverManagement from "@/src/components/Drivers/DriverManagement";

export default function DriversPage() {
	return (
		<AuthGuard>
			<DashboardLayout currentPage="drivers">
				<DriverManagement />
			</DashboardLayout>
		</AuthGuard>
	);
}