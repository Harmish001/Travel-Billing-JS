"use client";

import React from "react";
import { Card, Row, Col, Statistic, Typography } from "antd";
import { CarOutlined } from "@ant-design/icons";
import { useVehicleStats } from "@/src/hooks/vehicleHook";
import { themeColors } from "@/src/styles/theme";
import Loader from "@/src/ui/Loader";

const VehicleStats: React.FC = () => {
	const { data, isLoading, error } = useVehicleStats();

	if (isLoading) {
		return <Loader />;
	}

	if (error) {
		return null; // Don't show stats if there's an error
	}

	const stats = data?.data || {
		totalVehicles: 0,
		recentVehicles: [],
	};

	return (
		<Row gutter={[16, 16]}>
			<Col xs={24} sm={12} lg={6}>
				<Card
					style={{
						background: themeColors.white,
						border: `1px solid ${themeColors.neutralLight}`,
						borderRadius: 12,
						boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
						height: "100%"
					}}
				>
					<Statistic
						title={
							<span style={{ color: themeColors.neutralDark, fontSize: 14 }}>
								Total Vehicles
							</span>
						}
						value={stats.totalVehicles}
						prefix={<CarOutlined style={{ color: themeColors.primary }} />}
						valueStyle={{
							color: themeColors.neutralDark,
							fontSize: 24,
							fontWeight: "bold"
						}}
					/>
				</Card>
			</Col>
		</Row>
	);
};

export default VehicleStats;