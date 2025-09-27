"use client";

import React from "react";
import {
	Table,
	Button,
	Space,
	Popconfirm,
	Tag,
	Typography,
	Tooltip,
	Card
} from "antd";
import {
	EditOutlined,
	DeleteOutlined,
	CalendarOutlined
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Vehicle } from "@/src/types/iVehicle";
import { useDeleteVehicle } from "@/src/hooks/vehicleHook";

const { Text } = Typography;

interface VehicleTableProps {
	vehicles: Vehicle[];
	loading?: boolean;
	onEdit: (vehicle: Vehicle) => void;
}

const VehicleTable: React.FC<VehicleTableProps> = ({
	vehicles,
	loading = false,
	onEdit
}) => {
	const {
		mutate: deleteVehicle,
		isPending: isDeleting,
		contextHolder
	} = useDeleteVehicle();

	const handleDelete = (vehicleId: string) => {
		deleteVehicle(vehicleId);
	};

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

	const columns: ColumnsType<Vehicle> = [
		{
			title: "Vehicle Number",
			dataIndex: "vehicleNumber",
			key: "vehicleNumber",
			fixed: "left",
			width: 150,
			render: (text: string) => (
				<Text strong style={{ fontSize: "14px" }}>
					{text}
				</Text>
			),
			sorter: (a, b) => a.vehicleNumber.localeCompare(b.vehicleNumber)
		},
		{
			title: "Vehicle Type",
			dataIndex: "vehicleType",
			key: "vehicleType",
			width: 120,
			render: (type: string) => (
				<Tag color="blue" style={{ borderRadius: "12px" }}>
					{type || "Standard"}
				</Tag>
			)
		},
		{
			title: "Status",
			key: "status",
			width: 100,
			render: () => (
				<Tag color="green" style={{ borderRadius: "12px" }}>
					Active
				</Tag>
			)
		},
		{
			title: "Created",
			dataIndex: "createdAt",
			key: "createdAt",
			width: 120,
			render: (date: string) => (
				<Tooltip title={formatDateTime(date)}>
					<Space size="small">
						<CalendarOutlined style={{ color: "#666" }} />
						<Text type="secondary" style={{ fontSize: "12px" }}>
							{formatDate(date)}
						</Text>
					</Space>
				</Tooltip>
			),
			sorter: (a, b) =>
				new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
		},
		{
			title: "Updated",
			dataIndex: "updatedAt",
			key: "updatedAt",
			width: 120,
			render: (date: string, record: Vehicle) => {
				if (date === record.createdAt) {
					return (
						<Text type="secondary" style={{ fontSize: "12px" }}>
							-
						</Text>
					);
				}
				return (
					<Tooltip title={formatDateTime(date)}>
						<Space size="small">
							<CalendarOutlined style={{ color: "#666" }} />
							<Text type="secondary" style={{ fontSize: "12px" }}>
								{formatDate(date)}
							</Text>
						</Space>
					</Tooltip>
				);
			},
			sorter: (a, b) =>
				new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
		},
		{
			title: "Actions",
			key: "actions",
			fixed: "right",
			width: 120,
			render: (_, record: Vehicle) => (
				<Space size="middle">
					<Tooltip title="Edit Vehicle">
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
					<Tooltip title="Delete Vehicle">
						<Popconfirm
							title="Delete Vehicle"
							description="Are you sure you want to delete this vehicle?"
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
				dataSource={vehicles}
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
				className="vehicle-table"
			/>
		</div>
	);
};

export default VehicleTable;
