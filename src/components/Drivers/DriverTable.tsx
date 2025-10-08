"use client";

import React from "react";
import {
	Table,
	Button,
	Space,
	Popconfirm,
	Typography,
	Tooltip,
	Row,
	Grid
} from "antd";
import {
	EditOutlined,
	DeleteOutlined,
	PhoneOutlined,
	CalendarOutlined
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Driver } from "@/src/types/iDriver";
import { useDeleteDriver } from "@/src/hooks/driverHook";
import DriverCard from "./DriverCard";

const { Text } = Typography;

interface DriverTableProps {
	drivers: Driver[];
	loading?: boolean;
	onEdit: (driver: Driver) => void;
}

const DriverTable: React.FC<DriverTableProps> = ({
	drivers,
	loading = false,
	onEdit
}) => {
	const {
		mutate: deleteDriver,
		isPending: isDeleting,
		contextHolder
	} = useDeleteDriver();

	const { useBreakpoint } = Grid;
	const screens = useBreakpoint();
	const isMobile = !screens.md; // Mobile view for screens smaller than medium (768px)

	const handleDelete = (driverId: string) => {
		deleteDriver(driverId);
	};

	if (isMobile) {
		return (
			<div style={{ width: "100%" }}>
				{contextHolder}
				<Row gutter={[16, 16]}>
					{drivers.map((driver) => (
						<DriverCard
							driver={driver}
							onEdit={onEdit}
							onDelete={handleDelete}
							isDeleting={isDeleting}
						/>
					))}
				</Row>
			</div>
		);
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric"
		});
	};

	const formatDateTime = (dateString: string) => {
		return new Date(dateString).toLocaleString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		});
	};

	const columns: ColumnsType<Driver> = [
		{
			title: "Driver Name",
			dataIndex: "driverName",
			key: "driverName",
			fixed: "left",
			render: (text: string) => (
				<Text strong style={{ fontSize: "14px" }}>
					{text}
				</Text>
			),
			sorter: (a, b) => a.driverName.localeCompare(b.driverName)
		},
		{
			title: "Phone Number",
			dataIndex: "driverPhoneNumber",
			key: "driverPhoneNumber",
			render: (text: string) => (
				<Space size="small">
					<PhoneOutlined style={{ color: "#666" }} />
					<Text>{text}</Text>
				</Space>
			)
		},
		{
			title: "Actions",
			key: "actions",
			fixed: "right",
			render: (_, record: Driver) => (
				<Space size="middle">
					<Tooltip title="Edit Driver">
						<Button
							type="text"
							icon={<EditOutlined />}
							onClick={() => onEdit(record)}
							style={{
								borderRadius: "20px",
								padding: "4px 8px"
							}}
						/>
					</Tooltip>
					<Tooltip title="Delete Driver">
						<Popconfirm
							title="Delete Driver"
							description="Are you sure you want to delete this driver?"
							onConfirm={() => handleDelete(record._id)}
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
							<Button
								type="text"
								icon={<DeleteOutlined />}
								danger
								style={{
									borderRadius: "20px",
									padding: "4px 8px"
								}}
							/>
						</Popconfirm>
					</Tooltip>
				</Space>
			)
		}
	];

	return (
		<div style={{ width: "100%" }}>
			{contextHolder}
			<Table
				columns={columns}
				dataSource={drivers}
				rowKey="_id"
				loading={loading}
				pagination={false}
				scroll={{ x: 800 }}
				size="middle"
				style={{
					borderRadius: "12px",
					overflow: "hidden"
				}}
				rowHoverable
				showSorterTooltip
				className="driver-table"
			/>
		</div>
	);
};

export default DriverTable;
