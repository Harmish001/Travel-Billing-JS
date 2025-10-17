"use client";

import React from "react";
import { Card, Button, Tag, Space, Typography, Divider, Select, message } from "antd";
import { 
	EditOutlined, 
	DeleteOutlined, 
	FileTextOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	CarOutlined,
	UserOutlined
} from "@ant-design/icons";
import { IDuty } from "@/src/types/iDuty";
import { useUpdateDutyStatus } from "@/src/hooks/dutyHook";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const { Option } = Select;

interface DutyCardProps {
	duty: IDuty;
	onEdit: (duty: IDuty) => void;
	onDelete: (id: string) => void;
	onGenerateInvoice: (duty: IDuty) => void;
}

const DutyCard: React.FC<DutyCardProps> = ({ duty, onEdit, onDelete, onGenerateInvoice }) => {
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

	const handleStatusChange = (value: "Scheduled" | "In Progress" | "Completed" | "Cancelled") => {
		updateStatus({ id: duty._id, data: { status: value } }, {
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

	return (
		<Card 
			size="small" 
			style={{ marginBottom: 16 }}
			actions={[
				<Button 
					type="link" 
					icon={<FileTextOutlined />} 
					onClick={() => onGenerateInvoice(duty)}
					disabled={duty.isBilled || duty.status !== "Completed"}
				>
					Generate Invoice
				</Button>,
				<Button 
					type="link" 
					icon={<EditOutlined />} 
					onClick={() => onEdit(duty)}
					disabled={duty.isBilled}
				>
					Edit
				</Button>,
				<Button 
					type="link" 
					icon={<DeleteOutlined />} 
					onClick={() => onDelete(duty._id)}
					danger
					disabled={duty.isBilled}
				>
					Delete
				</Button>
			]}
		>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
				<div>
					<Title level={5} style={{ margin: "0 0 8px 0" }}>
						{duty.companyName || "No Company"}
					</Title>
					<Space direction="vertical" size={2}>
						<Text type="secondary">
							<UserOutlined /> {duty.driverId.driverName}
						</Text>
						<Text type="secondary">
							<CarOutlined /> {duty.vehicleId.vehicleNumber} ({duty.vehicleId.vehicleType})
						</Text>
						<Text type="secondary">
							{duty.pickupLocation} → {duty.dropLocation}
						</Text>
						<Text type="secondary">
							{formatDate(duty.startDate)}
							{duty.endDate && ` - ${formatDate(duty.endDate)}`}
						</Text>
					</Space>
				</div>
				<div style={{ textAlign: "right" }}>
					{getStatusTag(duty.status)}
					{duty.isBilled && <Tag color="green">Billed</Tag>}
					<div style={{ marginTop: 8 }}>
						<Text strong>{formatCurrency(duty.finalAmount)}</Text>
					</div>
				</div>
			</div>
			
			<Divider style={{ margin: "12px 0" }} />
			
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<Text type="secondary">Type: {duty.dutyType}</Text>
				<Text type="secondary">
					Distance: {duty.distanceTraveled || 0} km
				</Text>
			</div>
			
			<div style={{ marginTop: 12 }}>
				<Text strong>Status: </Text>
				<Select
					value={duty.status}
					onChange={handleStatusChange}
					disabled={isUpdating || duty.isBilled}
					size="small"
					style={{ width: 120 }}
				>
					{statusOptions.map(option => (
						<Option key={option.value} value={option.value}>
							{option.label}
						</Option>
					))}
				</Select>
			</div>
		</Card>
	);
};

export default DutyCard;