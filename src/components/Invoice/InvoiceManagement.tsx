"use client";

import React, { useState } from "react";
import {
	Row,
	Col,
	Typography,
	Button,
	Input,
	Space,
	Pagination,
	Empty,
	Card,
	Flex,
	message,
	Drawer
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useGetAllBillings } from "@/src/hooks/billingHook";
import { useRouter } from "next/navigation";
import InvoiceTable from "./InvoiceTable";
import Loader from "@/src/ui/Loader";
import InvoicePreview from "./InvoicePreview";
import { IBillingResponse } from "@/src/types/iBilling";

const { Title } = Typography;
const { Search } = Input;

const InvoiceManagement: React.FC = () => {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize] = useState(10);
	const [previewVisible, setPreviewVisible] = useState(false);
	const [selectedInvoice, setSelectedInvoice] = useState<IBillingResponse | null>(null);

	const { data, isLoading, error, refetch } = useGetAllBillings();

	const handleSearch = (value: string) => {
		setSearchTerm(value);
		setCurrentPage(1); // Reset to first page when searching
	};

	const handleAddInvoice = () => {
		router.push("/invoice/add");
	};

	const handleViewInvoice = (invoice: IBillingResponse) => {
		setSelectedInvoice(invoice);
		setPreviewVisible(true);
	};

	const handleExportPDF = (invoice: IBillingResponse) => {
		// TODO: Implement PDF export functionality
		console.log("Export PDF", invoice);
	};

	const handleExportExcel = (invoice: IBillingResponse) => {
		// TODO: Implement Excel export functionality
		console.log("Export Excel", invoice);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const closePreview = () => {
		setPreviewVisible(false);
		setSelectedInvoice(null);
	};

	// Show loading state
	if (isLoading) {
		return <Loader />;
	}

	if (error) {
		return (
			<div style={{ padding: "24px" }}>
				<Empty description="Failed to load invoices" />
			</div>
		);
	}

	const billings = data?.data?.bills || [];
	const pagination = data?.data?.pagination;

	return (
		<div>
			{/* Header */}
			<Flex
				justify="space-between"
				align="center"
				wrap="wrap"
				gap="16px"
				style={{ marginBottom: "24px" }}
			>
				<Title level={3} style={{ margin: 0 }}>
					Invoices
				</Title>
				<Button
					type="primary"
					onClick={handleAddInvoice}
					icon={<PlusOutlined />}
				>
					Create Invoice
				</Button>
			</Flex>

			<Row gutter={[24, 24]}>
				{/* Main Content */}
				<Col xs={24}>
					<Space direction="vertical" style={{ width: "100%" }}>
						{/* Search Bar */}
						<Flex justify="space-between" align="center" wrap="wrap" gap="16px">
							<Search
								placeholder="Search invoices..."
								allowClear
								onSearch={handleSearch}
								style={{ width: 300 }}
								prefix={<SearchOutlined />}
							/>
						</Flex>

						{/* Invoice Table */}
						{billings.length > 0 ? (
							<>
								<InvoiceTable
									invoices={billings}
									loading={isLoading}
									onView={handleViewInvoice}
									onExportPDF={handleExportPDF}
									onExportExcel={handleExportExcel}
								/>

								{/* Pagination */}
								{pagination && pagination.totalPages > 1 && (
									<Flex justify="center" style={{ marginTop: "32px" }}>
										<Pagination
											current={currentPage}
											total={pagination.totalBills}
											pageSize={pageSize}
											onChange={handlePageChange}
											showSizeChanger={false}
											showQuickJumper
											showTotal={(total, range) =>
												`${range[0]}-${range[1]} of ${total} invoices`
											}
											style={{ borderRadius: "20px" }}
										/>
									</Flex>
								)}
							</>
						) : (
							<Empty
								description={
									searchTerm
										? `No invoices found for "${searchTerm}"`
										: "No invoices yet"
								}
								image={Empty.PRESENTED_IMAGE_SIMPLE}
							>
								{!searchTerm && (
									<Button
										type="primary"
										onClick={handleAddInvoice}
										icon={<PlusOutlined />}
										style={{ borderRadius: "20px" }}
									>
										Create Your First Invoice
									</Button>
								)}
							</Empty>
						)}
					</Space>
				</Col>
			</Row>

			{/* Invoice Preview Drawer */}
			<Drawer
				title="Invoice Preview"
				placement="right"
				onClose={closePreview}
				open={previewVisible}
				width="80%"
				destroyOnClose
				styles={{
					body: { padding: 0 }
				}}
			>
				{selectedInvoice && (
					<InvoicePreview
						visible={true}
						onClose={closePreview}
						existingInvoice={selectedInvoice}
					/>
				)}
			</Drawer>
		</div>
	);
};

export default InvoiceManagement;