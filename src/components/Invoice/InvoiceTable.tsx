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
			title: "Invoice No",
			dataIndex: "invoiceNumber",
			key: "invoiceNumber",
			fixed: "left",
			width: 150,
			render: (text: string) => (
				<Text strong style={{ fontSize: "14px" }}>
					{text}
				</Text>
			),
			sorter: (a, b) => a.invoiceNumber.localeCompare(b.invoiceNumber)
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
			title: "Vehicle No",
			dataIndex: "vehicleId",
			key: "vehicleId",
			width: 150,
			render: (text: string) => (
				<Text style={{ fontSize: "13px" }}>
					{text}
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
			dataIndex: "totalAmount",
			key: "totalAmount",
			width: 120,
			align: "right",
			render: (amount: number) => (
				<Text strong style={{ fontSize: "13px" }}>
					₹{amount?.toLocaleString("en-IN") || 0}
				</Text>
			),
			sorter: (a, b) => (a.totalAmount || 0) - (b.totalAmount || 0)
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
							onConfirm={() => handleDelete(record.id)}
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
			<Card 
				style={{ borderRadius: "12px" }}
				bodyStyle={{ padding: 0 }}
			>
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
			</Card>

			<style jsx global>{`
				.invoice-table .ant-table {
					border-radius: 12px;
				}

				.invoice-table .ant-table-thead > tr > th {
					background-color: #fafafa;
					font-weight: 600;
					border-bottom: 2px solid #f0f0f0;
					padding: 16px 12px;
				}

				.invoice-table .ant-table-tbody > tr > td {
					padding: 12px;
					border-bottom: 1px solid #f0f0f0;
				}

				.invoice-table .ant-table-tbody > tr:hover > td {
					background-color: #f9f9f9;
				}

				/* Mobile optimizations */
				@media (max-width: 768px) {
					.invoice-table .ant-table-thead > tr > th,
					.invoice-table .ant-table-tbody > tr > td {
						padding: 8px 6px;
						font-size: 12px;
					}

					.invoice-table .ant-btn {
						padding: 2px 6px;
						font-size: 12px;
					}

					.invoice-table .ant-tag {
						padding: 2px 6px;
						font-size: 11px;
						margin: 0;
					}

					.invoice-table .ant-table-container {
						border-radius: 12px;
					}

					.invoice-table .ant-table-body {
						overflow-x: auto;
					}
				}

				/* Custom scrollbar for mobile table */
				@media (max-width: 768px) {
					.invoice-table .ant-table-body::-webkit-scrollbar {
						height: 4px;
					}

					.invoice-table .ant-table-body::-webkit-scrollbar-track {
						background: #f1f1f1;
						border-radius: 2px;
					}

					.invoice-table .ant-table-body::-webkit-scrollbar-thumb {
						background: #c1c1c1;
						border-radius: 2px;
					}

					.invoice-table .ant-table-body::-webkit-scrollbar-thumb:hover {
						background: #a8a8a8;
					}
				}

				/* Hide less important columns on small screens */
				@media (max-width: 576px) {
					.invoice-table .ant-table-tbody .ant-table-cell:nth-child(3),
					.invoice-table .ant-table-thead .ant-table-cell:nth-child(3),
					.invoice-table .ant-table-tbody .ant-table-cell:nth-child(5),
					.invoice-table .ant-table-thead .ant-table-cell:nth-child(5) {
						display: none;
					}
				}

				/* Mobile responsive text and spacing */
				@media (max-width: 480px) {
					.invoice-table .ant-table-thead > tr > th,
					.invoice-table .ant-table-tbody > tr > td {
						padding: 6px 4px !important;
						font-size: 11px !important;
					}

					.invoice-table .ant-btn {
						padding: 1px 4px !important;
						font-size: 10px !important;
						min-width: 28px;
						height: 28px;
					}

					.invoice-table .ant-tag {
						padding: 1px 4px !important;
						font-size: 10px !important;
						line-height: 1.2;
					}

					.invoice-table .ant-space {
						gap: 2px !important;
					}

					/* Adjust fixed column widths for very small screens */
					.invoice-table .ant-table {
						font-size: 11px;
					}
				}
			`}</style>
		</div>
	);
};

export default InvoiceTable;