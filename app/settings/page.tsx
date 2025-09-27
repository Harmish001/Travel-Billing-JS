"use client";

import React from "react";
import DashboardLayout from "@/src/components/Layout/DashboardLayout";
import Settings from "@/src/components/Settings/Settings";

const SettingsPage: React.FC = () => {
	return (
		<DashboardLayout currentPage="settings">
			<Settings />
		</DashboardLayout>
	);
};

export default SettingsPage;