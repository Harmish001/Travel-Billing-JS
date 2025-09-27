"use client";

import React, { useState, useEffect } from "react";
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
	Spin
} from "antd";
import {
	PlusOutlined,
	SearchOutlined,
	EyeOutlined,
	FilePdfOutlined,
	FileExcelOutlined
} from "@ant-design/icons";
import { useGetAllBillings } from "@/src/hooks/billingHook";
import {
	IBillingResponse,
	IGetAllBillingsResponse
} from "@/src/types/iBilling";
import InvoiceTable from "./InvoiceTable";
import InvoiceCard from "./InvoiceCard";
import InvoicePreview from "./InvoicePreview"; // Import the preview component
import { useRouter } from 'next/navigation';

const { Title } = Typography;
const { Search } = Input;

const InvoiceManagement: React.FC = () => {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize] = useState(10);
	const [selectedInvoice, setSelectedInvoice] =
		useState<IBillingResponse | null>(null);
	const [isMobile, setIsMobile] = useState(false);
	const [viewMode, setViewMode] = useState<"table" | "card">("table");
	const [isPreviewVisible, setIsPreviewVisible] = useState(false); // State for preview visibility

	const { data: billingsData, isLoading, error, refetch } = useGetAllBillings();

	// Check screen size on mount and resize
	useEffect(() => {
		const checkScreenSize = () => {
			const mobile = window.innerWidth < 768;
			setIsMobile(mobile);
			setViewMode(mobile ? "card" : "table");
		};

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);
		return () => window.removeEventListener("resize", checkScreenSize);
	}, []);

	const handleSearch = (value: string) => {
		setSearchTerm(value);
		setCurrentPage(1); // Reset to first page when searching
	};

	const handleAddInvoice = () => {
		router.push('/invoice/add');
	};

	const handleViewInvoice = (invoice: IBillingResponse) => {
		setSelectedInvoice(invoice);
		setIsPreviewVisible(true);
	};

	const handleExportPDF = (invoice: IBillingResponse) => {
		// TODO: Implement PDF export functionality
		console.log("Export PDF for invoice:", invoice);
	};

	const handleExportExcel = (invoice: IBillingResponse) => {
		// TODO: Implement Excel export functionality
		console.log("Export Excel for invoice:", invoice);
	};

	// Function to hide preview
	const hidePreview = () => {
		setIsPreviewVisible(false);
		setSelectedInvoice(null);
		refetch(); // Refresh the list after closing preview
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	if (isLoading) {
		return (
			<div style={{ padding: "24px", textAlign: "center" }}>
				<Spin size="large" />
			</div>
		);
	}

	if (error) {
		return (
			<div style={{ padding: "24px" }}>
				<Empty
					description="Failed to load invoices"
					image={Empty.PRESENTED_IMAGE_SIMPLE}
				>
					<Button
						type="primary"
						onClick={() => refetch()}
						icon={<SearchOutlined />}
					>
						Retry
					</Button>
				</Empty>
			</div>
		);
	}

	// Filter and paginate invoices
	const bills = billingsData?.data?.bills || [];
	const pagination = billingsData?.data?.pagination;

	const filteredInvoices = bills.filter(
		(invoice) =>
			invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
			invoice.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			invoice.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			invoice.vehicleId.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const totalInvoices = filteredInvoices.length;
	const startIndex = (currentPage - 1) * pageSize;
	const paginatedInvoices = filteredInvoices.slice(
		startIndex,
		startIndex + pageSize
	);

	return (
		<div>
			{/* Header */}
			<Flex
				justify="space-between"
				align="center"
				style={{ marginBottom: "24px" }}
				wrap="wrap"
				gap="16px"
			>
				<Search
					placeholder="Search invoices..."
					allowClear
					onSearch={handleSearch}
					style={{
						width: "100%",
						maxWidth: 300,
						minWidth: 200,
						borderRadius: "12px"
					}}
					size="large"
					enterButton={<SearchOutlined />}
				/>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={handleAddInvoice}
					size="large"
					style={{ borderRadius: "20px", minWidth: "140px" }}
				>
					Create Invoice
				</Button>
			</Flex>

			<Row gutter={[24, 24]}>
				<Col xs={24}>
					<Space direction="vertical" style={{ width: "100%" }} size="large">
						{/* Invoice Display */}
						{paginatedInvoices.length > 0 ? (
							<>
								{viewMode === "table" ? (
									<InvoiceTable
										invoices={paginatedInvoices}
										loading={isLoading}
										onView={handleViewInvoice}
										onExportPDF={handleExportPDF}
										onExportExcel={handleExportExcel}
									/>
								) : (
									<Row gutter={[16, 16]}>
										{paginatedInvoices.map((invoice) => (
											<Col key={invoice.id} xs={24} sm={12} md={8} lg={6}>
												<InvoiceCard
													invoice={invoice}
													onView={handleViewInvoice}
													onExportPDF={handleExportPDF}
													onExportExcel={handleExportExcel}
												/>
											</Col>
										))}
									</Row>
								)}

								{/* Pagination */}
								{pagination && pagination.totalBills > pageSize && (
									<Flex justify="center" style={{ marginTop: "32px" }}>
										<Pagination
											current={pagination.currentPage}
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
							<Card style={{ borderRadius: "12px" }}>
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
							</Card>
						)}
					</Space>
				</Col>
			</Row>

			{/* Invoice Preview Component */}
			<InvoicePreview
				visible={isPreviewVisible}
				onClose={hidePreview}
				existingInvoice={selectedInvoice || undefined}
			/>

			<style jsx global>{`
				/* Mobile optimizations for invoice management */
				@media (max-width: 768px) {
					.ant-input-group .ant-input {
						border-radius: 12px 0 0 12px !important;
					}

					.ant-input-group .ant-btn {
						border-radius: 0 12px 12px 0 !important;
					}

					.ant-input-search .ant-input-group {
						display: flex;
					}

					.ant-input-search .ant-input {
						flex: 1;
					}
				}

				@media (max-width: 576px) {
					.ant-flex {
						flex-direction: column !important;
						align-items: stretch !important;
					}

					.ant-input-search {
						width: 100% !important;
						max-width: none !important;
						min-width: auto !important;
						margin-bottom: 12px;
					}

					.ant-btn {
						width: 100%;
						height: 44px !important;
						font-size: 16px !important;
					}
				}
			`}</style>
		</div>
	);
};

export default InvoiceManagement;