"use client";

import React from "react";
import {
	Card,
	Typography,
	Button,
	Space,
	Popconfirm,
	Tag,
	Tooltip,
	Row,
	Col
} from "antd";
import {
	EyeOutlined,
	DeleteOutlined,
	FilePdfOutlined,
	FileExcelOutlined
} from "@ant-design/icons";
import { IBillingResponse } from "@/src/types/iBilling";
import { useDeleteBilling } from "@/src/hooks/billingHook";
import { notification } from "antd";

const { Text, Title } = Typography;

interface InvoiceCardProps {
	invoice: IBillingResponse;
	onView: (invoice: IBillingResponse) => void;
	onExportPDF: (invoice: IBillingResponse) => void;
	onExportExcel: (invoice: IBillingResponse) => void;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({
	invoice,
	onView,
	onExportPDF,
	onExportExcel
}) => {
	const {
		mutate: deleteBilling,
		isPending: isDeleting,
	} = useDeleteBilling();
	const [api, contextHolder] = notification.useNotification();

	const handleDelete = () => {
		deleteBilling(invoice.id);
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

	return (
		<>
			{contextHolder}
			<Card
				size="small"
				style={{ 
					height: "100%",
					borderRadius: "12px",
					boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
				}}
				bodyStyle={{ padding: "16px" }}
				actions={[
					<Tooltip key="view" title="View Invoice">
						<Button
							type="text"
							icon={<EyeOutlined />}
							onClick={() => onView(invoice)}
							style={{ 
								border: "none",
								borderRadius: "20px",
								width: "100%",
								height: "40px"
							}}
						/>
					</Tooltip>,
					<Tooltip key="pdf" title="Export PDF">
						<Button
							type="text"
							icon={<FilePdfOutlined />}
							onClick={() => onExportPDF(invoice)}
							style={{ 
								border: "none",
								borderRadius: "20px",
								width: "100%",
								height: "40px"
							}}
						/>
					</Tooltip>,
					<Tooltip key="excel" title="Export Excel">
						<Button
							type="text"
							icon={<FileExcelOutlined />}
							onClick={() => onExportExcel(invoice)}
							style={{ 
								border: "none",
								borderRadius: "20px",
								width: "100%",
								height: "40px"
							}}
						/>
					</Tooltip>,
					<Tooltip key="delete" title="Delete Invoice">
						<Popconfirm
							title="Delete Invoice"
							description="Are you sure you want to delete this invoice?"
							onConfirm={handleDelete}
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
									border: "none",
									borderRadius: "20px",
									width: "100%",
									height: "40px"
								}}
							/>
						</Popconfirm>
					</Tooltip>
				]}
			>
				<Space direction="vertical" style={{ width: "100%" }} size="middle">
					<div>
						<Title level={4} style={{ margin: 0, fontSize: "18px" }}>
							{invoice.invoiceNumber}
						</Title>
						<Text type="secondary" style={{ fontSize: "13px" }}>
							{invoice.companyName}
						</Text>
					</div>

					<Row gutter={[8, 8]}>
						<Col span={12}>
							<Text strong style={{ fontSize: "12px" }}>Vehicle:</Text>
							<br />
							<Text style={{ fontSize: "13px" }}>{invoice.vehicleId}</Text>
						</Col>
						<Col span={12}>
							<Text strong style={{ fontSize: "12px" }}>Recipient:</Text>
							<br />
							<Text style={{ fontSize: "13px" }}>{invoice.recipientName}</Text>
						</Col>
					</Row>

					<Row gutter={[8, 8]}>
						<Col span={12}>
							<Text strong style={{ fontSize: "12px" }}>Amount:</Text>
							<br />
							<Text strong style={{ fontSize: "14px", color: "#52c41a" }}>
								₹{invoice.totalAmount?.toLocaleString("en-IN") || 0}
							</Text>
						</Col>
						<Col span={12}>
							<Text strong style={{ fontSize: "12px" }}>Created:</Text>
							<br />
							<Tooltip title={formatDateTime(invoice.createdAt.toString())}>
								<Text type="secondary" style={{ fontSize: "12px" }}>
									{formatDate(invoice.createdAt.toString())}
								</Text>
							</Tooltip>
						</Col>
					</Row>
				</Space>
			</Card>
		</>
	);
};

export default InvoiceCard;