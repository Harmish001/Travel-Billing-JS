"use client";

import React from "react";
import { Table, Tag, Button, Space, Tooltip, Typography, Select, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { 
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	FileTextOutlined,
	EditOutlined,
	DeleteOutlined
} from "@ant-design/icons";
import { IDuty } from "@/src/types/iDuty";
import { useUpdateDutyStatus } from "@/src/hooks/dutyHook";
import dayjs from "dayjs";

const { Text } = Typography;
const { Option } = Select;

interface DutyTableProps {
	duties: IDuty[];
	loading: boolean;
	onEdit: (duty: IDuty) => void;
	onDelete: (id: string) => void;
	onGenerateInvoice: (duty: IDuty) => void;
}

const DutyTable: React.FC<DutyTableProps> = ({ duties, loading, onEdit, onDelete, onGenerateInvoice }) => {
	const { mutate: updateStatus, isPending: isUpdating } = useUpdateDutyStatus();

	const getStatusTag = (status: string) => {
		switch (status) {
			case "Scheduled":
				return <Tag icon={<ClockCircleOutlined />} color="blue">{status}</Tag>;
			case "In Progress":
				return <Tag icon={<ClockCircleOutlined />} color="orange">{status}</Tag>;
			case "Completed":
				return <Tag icon={<CheckCircleOutlined />} color="green">{status}</Tag>;
			case "Cancelled":
				return <Tag icon={<CloseCircleOutlined />} color="red">{status}</Tag>;
			default:
				return <Tag>{status}</Tag>;
		}
	};

	const formatCurrency = (amount: number | undefined) => {
		return amount ? `₹${amount.toFixed(2)}` : "₹0.00";
	};

	const formatDate = (date: string) => {
		return dayjs(date).format("DD/MM/YYYY");
	};

	const handleStatusChange = (id: string, value: "Scheduled" | "In Progress" | "Completed" | "Cancelled") => {
		updateStatus({ id, data: { status: value } }, {
			onSuccess: () => {
				message.success("Duty status updated successfully");
			},
			onError: (error: any) => {
				message.error(error?.response?.data?.message || "Failed to update duty status");
			}
		});
	};

	const statusOptions = [
		{ value: "Scheduled", label: "Scheduled" },
		{ value: "In Progress", label: "In Progress" },
		{ value: "Completed", label: "Completed" },
		{ value: "Cancelled", label: "Cancelled" }
	];

	const columns: ColumnsType<IDuty> = [
		{
			title: "Company",
			dataIndex: "companyName",
			key: "companyName",
			render: (text, record) => (
				<div>
					<div>{text || "N/A"}</div>
					<Text type="secondary" style={{ fontSize: "12px" }}>
						{record.clientName || "No Client"}
					</Text>
				</div>
			),
			sorter: (a, b) => (a.companyName || "").localeCompare(b.companyName || ""),
		},
		{
			title: "Driver",
			dataIndex: "driverId",
			key: "driverId",
			render: (driver) => driver.driverName,
			sorter: (a, b) => a.driverId.driverName.localeCompare(b.driverId.driverName),
		},
		{
			title: "Vehicle",
			dataIndex: "vehicleId",
			key: "vehicleId",
			render: (vehicle) => `${vehicle.vehicleNumber} (${vehicle.vehicleType})`,
			sorter: (a, b) => a.vehicleId.vehicleNumber.localeCompare(b.vehicleId.vehicleNumber),
		},
		{
			title: "Route",
			dataIndex: "pickupLocation",
			key: "route",
			render: (_, record) => (
				<div>
					<div>{record.pickupLocation}</div>
					<div>→ {record.dropLocation}</div>
				</div>
			),
		},
		{
			title: "Dates",
			dataIndex: "startDate",
			key: "dates",
			render: (_, record) => (
				<div>
					<div>{formatDate(record.startDate)}</div>
					{record.endDate && (
						<div style={{ fontSize: "12px" }}>
							to {formatDate(record.endDate)}
						</div>
					)}
				</div>
			),
			sorter: (a, b) => a.startDate.localeCompare(b.startDate),
		},
		{
			title: "Type",
			dataIndex: "dutyType",
			key: "dutyType",
			sorter: (a, b) => a.dutyType.localeCompare(b.dutyType),
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			render: (status, record) => (
				<Space>
					<Select
						value={status}
						onChange={(value) => handleStatusChange(record._id, value)}
						disabled={isUpdating || record.isBilled}
						size="small"
						style={{ width: 120 }}
					>
						{statusOptions.map(option => (
							<Option key={option.value} value={option.value}>
								{option.label}
							</Option>
						))}
					</Select>
					{record.isBilled && <Tag color="green">Billed</Tag>}
				</Space>
			),
			sorter: (a, b) => a.status.localeCompare(b.status),
		},
		{
			title: "Amount",
			dataIndex: "finalAmount",
			key: "finalAmount",
			render: (amount) => <Text strong>{formatCurrency(amount)}</Text>,
			sorter: (a, b) => (a.finalAmount || 0) - (b.finalAmount || 0),
		},
		{
			title: "Actions",
			key: "actions",
			render: (_, record) => (
				<Space size="middle">
					<Tooltip title="Generate Invoice">
						<Button
							type="primary"
							icon={<FileTextOutlined />}
							onClick={() => onGenerateInvoice(record)}
							disabled={record.isBilled || record.status !== "Completed"}
							size="small"
						/>
					</Tooltip>
					<Tooltip title="Edit">
						<Button
							icon={<EditOutlined />}
							onClick={() => onEdit(record)}
							disabled={record.isBilled}
							size="small"
						/>
					</Tooltip>
					<Tooltip title="Delete">
						<Button
							icon={<DeleteOutlined />}
							onClick={() => onDelete(record._id)}
							danger
							disabled={record.isBilled}
							size="small"
						/>
					</Tooltip>
				</Space>
			),
		},
	];

	return (
		<Table
			dataSource={duties}
			columns={columns}
			rowKey="_id"
			loading={loading}
			pagination={{
				pageSize: 10,
				showSizeChanger: true,
				pageSizeOptions: ["10", "20", "50"],
			}}
			scroll={{ x: "max-content" }}
		/>
	);
};

export default DutyTable;