import React from "react";
import {
	Card,
	Typography,
	Tag,
	Space,
	Row,
	Col,
	Dropdown,
	MenuProps
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { IBooking } from "@/src/types";

const { Title, Text } = Typography;

interface BookingCardProps {
	booking: IBooking;
	onUpdateStatus: (
		id: string,
		status: "Pending" | "Completed" | "inProgress"
	) => void;
	isUpdating: boolean;
}

const statusColors: Record<string, string> = {
	Pending: "orange",
	Completed: "green",
	inProgress: "blue"
};

const statusOptions = [
	{ label: "Pending", value: "Pending" },
	{ label: "In Progress", value: "inProgress" },
	{ label: "Completed", value: "Completed" }
];

const BookingCard: React.FC<BookingCardProps> = ({
	booking,
	onUpdateStatus,
	isUpdating
}) => {
	const handleStatusChange = (status: string) => {
		onUpdateStatus(
			booking._id,
			status as "Pending" | "Completed" | "inProgress"
		);
	};

	const menuItems: MenuProps["items"] = statusOptions.map((option) => ({
		key: option.value,
		label: option.label,
		onClick: () => handleStatusChange(option.value)
	}));

	return (
		<Card hoverable>
			<Space direction="vertical" style={{ width: "100%" }}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start"
					}}
				>
					<Title level={5} style={{ margin: 0 }}>
						{booking.name}
					</Title>
					<Dropdown
						menu={{ items: menuItems }}
						trigger={["click"]}
						disabled={isUpdating}
					>
						<Tag
							color={statusColors[booking.status] || "default"}
							style={{ cursor: "pointer" }}
						>
							{booking.status} <DownOutlined style={{ fontSize: "10px" }} />
						</Tag>
					</Dropdown>
				</div>

				<Row gutter={[8, 8]}>
					<Col span={12}>
						<Text type="secondary">Date: </Text>
						<Text>{new Date(booking.date).toLocaleDateString()}</Text>
					</Col>

					<Col span={12}>
						<Text type="secondary">Time: </Text>
						<Text>{booking.time}</Text>
					</Col>

					<Col span={12}>
						<Text type="secondary">Vehicle: </Text>
						<Text>{booking.vehicle}</Text>
					</Col>

					<Col span={12}>
						<Text type="secondary">Phone: </Text>
						<Text>{booking.phoneNumber}</Text>
					</Col>

					<Col span={24}>
						<Text type="secondary">Pickup: </Text>
						<Text>{booking.pickup}</Text>
					</Col>

					<Col span={24}>
						<Text type="secondary">Drop: </Text>
						<Text>{booking.drop}</Text>
					</Col>

					{booking.description && (
						<Col span={24}>
							<Text type="secondary">Description: </Text>
							<Text>{booking.description}</Text>
						</Col>
					)}
				</Row>
			</Space>
		</Card>
	);
};

export default BookingCard;
