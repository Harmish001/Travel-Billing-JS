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
	Card,
	notification
} from "antd";
import {
	EyeOutlined,
	DeleteOutlined,
	FilePdfOutlined,
	FileExcelOutlined
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { IBillingResponse } from "@/src/types/iBilling";
import { useDeleteBilling } from "@/src/hooks/billingHook";

const { Text } = Typography;

interface InvoiceTableProps {
	invoices: IBillingResponse[];
	loading?: boolean;
	onView: (invoice: IBillingResponse) => void;
	onExportPDF: (invoice: IBillingResponse) => void;
	onExportExcel: (invoice: IBillingResponse) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
	invoices,
	loading = false,
	onView,
	onExportPDF,
	onExportExcel
}) => {
	const {
		mutate: deleteBilling,
		isPending: isDeleting,
	} = useDeleteBilling();
	const [api, contextHolder] = notification.useNotification();

	const handleDelete = (invoiceId: string) => {
		deleteBilling(invoiceId);
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

	const columns: ColumnsType<IBillingResponse> = [
		{
			title: "Invoice ID",
			dataIndex: "_id",
			key: "_id",
			fixed: "left",
			width: 150,
			render: (text: string) => (
				<Text strong style={{ fontSize: "14px" }}>
					{text.substring(0, 8)}
				</Text>
			),
			sorter: (a, b) => a._id.localeCompare(b._id)
		},
		{
			title: "Company Name",
			dataIndex: "companyName",
			key: "companyName",
			width: 180,
			render: (text: string) => (
				<Text style={{ fontSize: "13px" }}>
					{text}
				</Text>
			)
		},
		{
			title: "Vehicles",
			dataIndex: "vehicleIds",
			key: "vehicleIds",
			width: 150,
			render: (vehicles: { _id: string; vehicleNumber: string }[]) => (
				<Text style={{ fontSize: "13px" }}>
					{vehicles.map(v => v.vehicleNumber).join(", ")}
				</Text>
			)
		},
		{
			title: "Recipient",
			dataIndex: "recipientName",
			key: "recipientName",
			width: 150,
			render: (text: string) => (
				<Text style={{ fontSize: "13px" }}>
					{text}
				</Text>
			)
		},
		{
			title: "Amount",
			dataIndex: "totalInvoiceValue",
			key: "totalInvoiceValue",
			width: 120,
			align: "right",
			render: (amount: number) => (
				<Text strong style={{ fontSize: "13px" }}>
					₹{amount?.toLocaleString("en-IN") || 0}
				</Text>
			),
			sorter: (a, b) => (a.totalInvoiceValue || 0) - (b.totalInvoiceValue || 0)
		},
		{
			title: "Created",
			dataIndex: "createdAt",
			key: "createdAt",
			width: 120,
			render: (date: string) => (
				<Tooltip title={formatDateTime(date)}>
					<Space size="small">
						<Text type="secondary" style={{ fontSize: "12px" }}>
							{formatDate(date)}
						</Text>
					</Space>
				</Tooltip>
			),
			sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
		},
		{
			title: "Actions",
			key: "actions",
			fixed: "right",
			width: 150,
			render: (_, record: IBillingResponse) => (
				<Space size="middle">
					<Tooltip title="View Invoice">
						<Button
							type="text"
							icon={<EyeOutlined />}
							onClick={() => onView(record)}
							style={{ 
								borderRadius: "20px",
								padding: "4px 8px"
							}}
						/>
					</Tooltip>
					<Tooltip title="Export PDF">
						<Button
							type="text"
							icon={<FilePdfOutlined />}
							onClick={() => onExportPDF(record)}
							style={{ 
								borderRadius: "20px",
								padding: "4px 8px"
							}}
						/>
					</Tooltip>
					<Tooltip title="Export Excel">
						<Button
							type="text"
							icon={<FileExcelOutlined />}
							onClick={() => onExportExcel(record)}
							style={{ 
								borderRadius: "20px",
								padding: "4px 8px"
							}}
						/>
					</Tooltip>
					<Tooltip title="Delete Invoice">
						<Popconfirm
							title="Delete Invoice"
							description="Are you sure you want to delete this invoice?"
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
					dataSource={invoices}
					rowKey="_id"
					loading={loading}
					pagination={false}
					scroll={{ x: 1000 }}
					size="middle"
					style={{
						borderRadius: "12px",
						overflow: "hidden"
					}}
					rowHoverable
					showSorterTooltip
					className="invoice-table"
				/>
		</div>
	);
};

export default InvoiceTable;