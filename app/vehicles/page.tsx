import AuthGuard from "@/src/components/Auth/AuthGuard";
import DashboardLayout from "@/src/components/Layout/DashboardLayout";
import VehicleManagement from "@/src/components/Vehicles/VehicleManagement";

export default function VehiclesPage() {
	return (
		<AuthGuard>
			<DashboardLayout currentPage="vehicles">
				<VehicleManagement />
			</DashboardLayout>
		</AuthGuard>
	);
}
