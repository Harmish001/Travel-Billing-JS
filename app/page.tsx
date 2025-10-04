"use client"
import AuthGuard from "@/src/components/Auth/AuthGuard";
import DashboardLayout from "@/src/components/Layout/DashboardLayout";
import Dashboard from "@/src/components/Dashboard/Dashboard";
import "antd/dist/reset.css";
import { useEffect, useState } from "react";
import Loader from "@/src/ui/Loader";

export default function Home() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <Loader />;
	}

	return (
		<AuthGuard redirectTo="/landingpage">
			<DashboardLayout currentPage="dashboard">
				<Dashboard />
			</DashboardLayout>
		</AuthGuard>
	);
}
