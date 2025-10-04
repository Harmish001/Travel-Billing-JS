import React from "react";
import { Card, Button, Space, Tag, Typography, Popconfirm, Flex } from "antd";
import {
	EditOutlined,
	DeleteOutlined,
	CalendarOutlined
} from "@ant-design/icons";
import { Vehicle } from "@/src/types/iVehicle";

const { Text, Title } = Typography;

interface VehicleCardProps {
	vehicle: Vehicle;
	onEdit: (vehicle: Vehicle) => void;
	onDelete: (vehicleId: string) => void;
	isDeleting: boolean;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
	vehicle,
	onEdit,
	onDelete,
	isDeleting
}) => {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric"
		});
	};

	return (
		<Card
			size="small"
			style={{
				boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
				width: "100%"
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "flex-start"
				}}
			>
				<div style={{ flex: 1 }}>
					<div style={{ display: "flex", alignItems: "start", gap: "4px" }}>
						<Title level={5} style={{ margin: "0 0 8px 0" }}>
							{vehicle.vehicleNumber}
						</Title>
						<Tag color="blue" style={{ marginLeft: 8 }}>
							{vehicle.vehicleType}
						</Tag>
					</div>
					<Space size="small" style={{ marginBottom: "8px" }}></Space>
					<div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
						<CalendarOutlined style={{ color: "#666", fontSize: "12px" }} />
						<Text type="secondary" style={{ fontSize: "12px" }}>
							Created: {formatDate(vehicle.createdAt)}
						</Text>
					</div>
					<Space style={{ paddingTop: 8 }}>
						<EditOutlined
							style={{ marginRight: 8 }}
							onClick={() => onEdit(vehicle)}
						/>
						<Popconfirm
							title="Delete Vehicle"
							description="Are you sure you want to delete this vehicle?"
							onConfirm={() => onDelete(vehicle._id)}
							okText="Delete"
							cancelText="Cancel"
							okButtonProps={{
								danger: true,
								loading: isDeleting,
								style: { borderRadius: "20px" }
							}}
							cancelButtonProps={{
								style: { borderRadius: "20px" }
							}}
							placement="topRight"
						>
							<DeleteOutlined style={{ color: "red" }} />
						</Popconfirm>
					</Space>
				</div>
			</div>
		</Card>
	);
};

export default VehicleCard;
