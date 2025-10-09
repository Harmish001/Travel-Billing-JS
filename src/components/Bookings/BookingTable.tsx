import React from "react";
import { Table, Tag, Dropdown, MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { IBooking } from "@/src/types";
import dayjs from "dayjs";

interface BookingTableProps {
	bookings: IBooking[];
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

const BookingTable: React.FC<BookingTableProps> = ({
	bookings,
	onUpdateStatus,
	isUpdating
}) => {
	const columns = [
		{
			title: "Customer",
			dataIndex: "name",
			key: "name"
		},
		{
			title: "Date & Time",
			dataIndex: "date",
			key: "date",
			render: (_: any, record: IBooking) => (
				<div>
					<div>{dayjs(record.date).format("DD MMM, YYYY")}</div>
					<div>{record.time}</div>
				</div>
			)
		},
		{
			title: "Pickup",
			dataIndex: "pickup",
			key: "pickup"
		},
		{
			title: "Drop",
			dataIndex: "drop",
			key: "drop"
		},
		{
			title: "Vehicle",
			dataIndex: "vehicle",
			key: "vehicle"
		},
		{
			title: "Phone",
			dataIndex: "phoneNumber",
			key: "phoneNumber"
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			render: (_: any, record: IBooking) => {
				const handleStatusChange = (status: string) => {
					onUpdateStatus(
						record._id,
						status as "Pending" | "Completed" | "inProgress"
					);
				};

				const menuItems: MenuProps["items"] = statusOptions.map((option) => ({
					key: option.value,
					label: option.label,
					onClick: () => handleStatusChange(option.value)
				}));

				return (
					<Dropdown
						menu={{ items: menuItems }}
						trigger={["click"]}
						disabled={isUpdating}
					>
						<Tag
							color={statusColors[record.status] || "default"}
							style={{ cursor: "pointer" }}
						>
							{record.status} <DownOutlined style={{ fontSize: "10px" }} />
						</Tag>
					</Dropdown>
				);
			}
		}
	];

	return (
		<Table
			dataSource={bookings}
			columns={columns}
			rowKey="_id"
			pagination={false}
			scroll={{ x: true }}
		/>
	);
};

export default BookingTable;
