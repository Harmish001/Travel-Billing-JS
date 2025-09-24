import AuthGuard from "@/src/components/Auth/AuthGuard";
import DashboardLayout from "@/src/components/Layout/DashboardLayout";
import Dashboard from "@/src/components/Dashboard/Dashboard";

export default function Home() {
  return (
    <AuthGuard>
      <DashboardLayout currentPage="dashboard">
        <Dashboard />
      </DashboardLayout>
    </AuthGuard>
  );
}
