"use client";

import React from "react";
import { Typography, Card, Row, Col, Statistic, Space, Button } from "antd";
import { FileTextOutlined, CarOutlined, PlusOutlined } from "@ant-design/icons";
import { useAuth } from "@/src/context/AuthContext";
import { themeColors } from "@/src/styles/theme";
import { useRouter } from "next/navigation";
import { useBillingAnalytics } from "@/src/hooks/billingHook";
import { useVehicles } from "@/src/hooks/vehicleHook";
import Loader from "@/src/ui/Loader";
import { FaRupeeSign } from "react-icons/fa";

const { Title, Paragraph } = Typography;

const Dashboard: React.FC = () => {
	const { user } = useAuth();
	const router = useRouter();

	const { data: analyticsData, isLoading: isAnalyticsLoading } =
		useBillingAnalytics();
	const { data: vehiclesData, isLoading: isVehiclesLoading } = useVehicles({
		page: 1,
		limit: 100
	});

	// Use API data or fallback to mock data
	const stats = [
		{
			title: "Total Invoices",
			value: analyticsData?.data?.totalInvoices || 0,
			prefix: <FileTextOutlined style={{ color: themeColors.primary }} />,
			suffix: "",
			loading: isAnalyticsLoading
		},
		{
			title: "Revenue This Month",
			value: analyticsData?.data?.revenueThisMonth || 0,
			prefix: <FaRupeeSign style={{ color: themeColors.secondary }} />,
			suffix: "",
			precision: 2,
			loading: isAnalyticsLoading
		},
		{
			title: "Total Vehicles",
			value:
				analyticsData?.data?.totalVehicles ||
				vehiclesData?.data?.pagination?.totalVehicles ||
				0,
			prefix: <CarOutlined style={{ color: themeColors.accent1 }} />,
			suffix: "",
			loading: isAnalyticsLoading || isVehiclesLoading
		}
	];

	// Show loading state if critical data is loading
	if (isAnalyticsLoading) {
		return <Loader />;
	}

	return (
		<div>
			{/* Welcome Section */}
			<div style={{ marginBottom: 24 }}>
				<Title
					level={2}
					style={{
						color: themeColors.neutralDark,
						marginBottom: 8,
						display: "flex"
					}}
				>
					Welcome back&nbsp;
					<strong style={{ color: themeColors.primary }}>
						{user?.user?.businessName}
					</strong>
				</Title>
				<Paragraph
					style={{ fontSize: 16, color: themeColors.neutralDark, opacity: 0.8 }}
				>
					Here's what's happening with your travel business.
				</Paragraph>
			</div>

			{/* Statistics Cards */}
			<Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
				{stats.map((stat, index) => (
					<Col xs={24} sm={12} lg={8} key={index}>
						<Card
							style={{
								background: themeColors.white,
								border: `1px solid ${themeColors.neutralLight}`,
								borderRadius: 12,
								boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
								transition: "all 0.3s ease"
							}}
							hoverable
							bodyStyle={{ padding: "20px" }}
						>
							{stat.loading ? (
								<div style={{ textAlign: "center", padding: "20px 0" }}>
									<Loader size="small" />
								</div>
							) : (
								<Statistic
									title={
										<span
											style={{ color: themeColors.neutralDark, fontSize: 14 }}
										>
											{stat.title}
										</span>
									}
									value={stat.value}
									precision={stat.precision || 0}
									prefix={stat.prefix}
									suffix={stat.suffix}
									valueStyle={{
										color: themeColors.neutralDark,
										fontSize: 24,
										fontWeight: "bold"
									}}
								/>
							)}
						</Card>
					</Col>
				))}
			</Row>

			<div
				style={{
					textAlign: "center",
					padding: "40px 20px",
					color: themeColors.neutralDark
				}}
			>
				<FileTextOutlined style={{ fontSize: 48, marginBottom: 16 }} />
				<Paragraph>
					No recent activity to show. Start by creating your first invoice!
				</Paragraph>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={() => router.push("/invoice/add")}
				>
					Create Invoice
				</Button>
			</div>
		</div>
	);
};

export default Dashboard;
