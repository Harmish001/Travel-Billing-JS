"use client";
import { Card, Statistic, List, Typography, Space, Empty, Spin } from "antd";
import { CarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useVehicleStats } from "@/src/hooks/vehicleHook";

const { Title, Text } = Typography;

const VehicleStats: React.FC = () => {
	const { data, isLoading, error } = useVehicleStats();

	if (isLoading) {
		return <Spin />;
	}

	if (error || !data?.status) {
		return (
			<Card>
				<Empty description="Failed to load vehicle statistics" />
			</Card>
		);
	}

	const stats = data.data;

	return (
		<Space direction="vertical" style={{ width: "100%" }} size="large">
			<Card>
				<Statistic
					title="Total Vehicles"
					value={stats?.totalVehicles || 0}
					prefix={<CarOutlined />}
					valueStyle={{ color: "#1890ff" }}
				/>
			</Card>

			<Card title={<Title level={4}>Recent Vehicles</Title>}>
				{stats?.recentVehicles && stats.recentVehicles.length > 0 ? (
					<List
						itemLayout="horizontal"
						dataSource={stats.recentVehicles}
						renderItem={(vehicle) => (
							<List.Item>
								<List.Item.Meta
									avatar={
										<CarOutlined
											style={{ fontSize: "16px", color: "#1890ff" }}
										/>
									}
									title={vehicle.vehicleNumber}
									description={
										<Space>
											<ClockCircleOutlined style={{ fontSize: "12px" }} />
											<Text type="secondary" style={{ fontSize: "12px" }}>
												Added {new Date(vehicle.createdAt).toLocaleDateString()}
											</Text>
										</Space>
									}
								/>
							</List.Item>
						)}
					/>
				) : (
					<Empty description="No recent vehicles" />
				)}
			</Card>
		</Space>
	);
};

export default VehicleStats;
