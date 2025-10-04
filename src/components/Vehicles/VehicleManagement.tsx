"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { PlusOutlined, SearchOutlined, CarOutlined } from "@ant-design/icons";
import { useVehicles } from "@/src/hooks/vehicleHook";
import { Vehicle } from "@/src/types/iVehicle";
import VehicleStats from "./VehicleStats";
import VehicleTable from "./VehicleTable";
import AddEditVehicleModal from "./AddEditVehicleModal";

const { Title } = Typography;
const { Search } = Input;

const VehicleManagement: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize] = useState(12);
	const [modalOpen, setModalOpen] = useState(false);
	const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
	const [modalMode, setModalMode] = useState<"create" | "edit">("create");

	const { data, isLoading, error } = useVehicles({
		search: searchTerm,
		page: currentPage,
		limit: pageSize
	});

	const handleSearch = (value: string) => {
		setSearchTerm(value);
		setCurrentPage(1); // Reset to first page when searching
	};

	const handleAddVehicle = () => {
		setEditingVehicle(null);
		setModalMode("create");
		setModalOpen(true);
	};

	const handleEditVehicle = (vehicle: Vehicle) => {
		setEditingVehicle(vehicle);
		setModalMode("edit");
		setModalOpen(true);
	};

	const handleModalClose = () => {
		setModalOpen(false);
		setEditingVehicle(null);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	if (isLoading) {
		return <Spin />;
	}

	if (error) {
		return (
			<div style={{ padding: "24px" }}>
				<Empty description="Failed to load vehicles" />
			</div>
		);
	}

	const vehicles = data?.data?.vehicles || [];
	const pagination = data?.data?.pagination;

	return (
		<div>
			{/* Header */}
			<Flex
				justify="end"
				align="center"
				wrap="wrap"
				gap="16px"
			>
				<Button type="primary" onClick={handleAddVehicle}>
					Add Vehicle
				</Button>
			</Flex>

			<Row gutter={[24, 24]}>
				{/* Main Content */}
				<Col xs={24}>
					<Space direction="vertical" style={{ width: "100%" }}>
						{/* Vehicle Table */}
						{vehicles.length > 0 ? (
							<>
								<VehicleTable
									vehicles={vehicles}
									loading={isLoading}
									onEdit={handleEditVehicle}
								/>

								{/* Pagination */}
								{pagination && pagination.totalPages > 1 && (
									<Flex justify="center" style={{ marginTop: "32px" }}>
										<Pagination
											current={currentPage}
											total={pagination.totalVehicles}
											pageSize={pageSize}
											onChange={handlePageChange}
											showSizeChanger={false}
											showQuickJumper
											showTotal={(total, range) =>
												`${range[0]}-${range[1]} of ${total} vehicles`
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
											? `No vehicles found for "${searchTerm}"`
											: "No vehicles yet"
									}
									image={Empty.PRESENTED_IMAGE_SIMPLE}
								>
									{!searchTerm && (
										<Button
											type="primary"
											onClick={handleAddVehicle}
											icon={<PlusOutlined />}
											style={{ borderRadius: "20px" }}
										>
											Add Your First Vehicle
										</Button>
									)}
								</Empty>
							</Card>
						)}
					</Space>
				</Col>
			</Row>

			{/* Add/Edit Modal */}
			<AddEditVehicleModal
				open={modalOpen}
				onClose={handleModalClose}
				vehicle={editingVehicle}
				mode={modalMode}
			/>

			<style jsx global>{`
				/* Mobile optimizations for vehicle management */
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

export default VehicleManagement;
