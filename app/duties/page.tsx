"use client";

import React from "react";
import { Card } from "antd";
import Duties from "@/src/components/Duties/Duties";
import DashboardLayout from "@/src/components/Layout/DashboardLayout";

const DutiesPage = () => {
	return (
		<DashboardLayout currentPage="duties">
			<Duties />
		</DashboardLayout>
	);
};

export default DutiesPage;
