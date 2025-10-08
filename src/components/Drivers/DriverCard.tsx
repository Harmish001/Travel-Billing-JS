import React from "react";
import {
	Card,
	Button,
	Space,
	Typography,
	Popconfirm,
	Flex,
	Avatar
} from "antd";
import {
	EditOutlined,
	DeleteOutlined,
	UserOutlined,
	PhoneOutlined,
	PhoneFilled
} from "@ant-design/icons";
import { Driver } from "@/src/types/iDriver";
import { themeColors } from "@/src/styles/theme";

const { Text, Title } = Typography;

interface DriverCardProps {
	driver: Driver;
	onEdit: (driver: Driver) => void;
	onDelete: (driverId: string) => void;
	isDeleting: boolean;
}

const DriverCard: React.FC<DriverCardProps> = ({
	driver,
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

	// Get the first letter of the driver's name for the avatar
	const getFirstLetter = (name: string) => {
		return name.charAt(0).toUpperCase();
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
				<div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
					<Avatar size="large" style={{ backgroundColor: "#1890ff" }}>
						{getFirstLetter(driver.driverName)}
					</Avatar>
					<div style={{ flex: 1 }}>
						<div style={{ display: "flex", alignItems: "start", gap: "4px" }}>
							<Title level={5} style={{ margin: "0 0 0px 0" }}>
								{driver.driverName.toUpperCase()}
							</Title>
						</div>
						<Space size="small">
							<div
								style={{ display: "flex", alignItems: "center", gap: "4px" }}
							>
								<PhoneOutlined style={{ color: themeColors.primary }} />
								<Text>{driver.driverPhoneNumber}</Text>
							</div>
						</Space>
					</div>
				</div>
				<div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
					<a
						href={`tel:${driver.driverPhoneNumber}`}
						style={{ color: themeColors.primary }}
					>
						<PhoneFilled style={{ fontSize: "16px" }} />
					</a>
					<EditOutlined
						style={{ fontSize: "16px", cursor: "pointer" }}
						onClick={() => onEdit(driver)}
					/>
					<Popconfirm
						title="Delete Driver"
						description="Are you sure you want to delete this driver?"
						onConfirm={() => onDelete(driver._id)}
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
						<DeleteOutlined
							style={{ color: "red", fontSize: "16px", cursor: "pointer" }}
						/>
					</Popconfirm>
				</div>
			</div>
		</Card>
	);
};

export default DriverCard;
