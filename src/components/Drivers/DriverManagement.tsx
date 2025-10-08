"use client";
import { useState } from "react";
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
	Grid
} from "antd";
import { PlusOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { useDrivers } from "@/src/hooks/driverHook";
import { Driver } from "@/src/types/iDriver";
import DriverTable from "./DriverTable";
import AddEditDriverDrawer from "./AddEditDriverDrawer";
import Loader from "@/src/ui/Loader";

const { Title } = Typography;
const { Search } = Input;

const DriverManagement: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize] = useState(12);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
	const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");

	const { data, isLoading, error } = useDrivers({
		search: searchTerm,
		page: currentPage,
		limit: pageSize
	});

	const { useBreakpoint } = Grid;
	const screens = useBreakpoint();
	const isMobile = !screens.md;

	const handleSearch = (value: string) => {
		setSearchTerm(value);
		setCurrentPage(1); // Reset to first page when searching
	};

	const handleAddDriver = () => {
		setEditingDriver(null);
		setDrawerMode("create");
		setDrawerOpen(true);
	};

	const handleEditDriver = (driver: Driver) => {
		setEditingDriver(driver);
		setDrawerMode("edit");
		setDrawerOpen(true);
	};

	const handleDrawerClose = () => {
		setDrawerOpen(false);
		setEditingDriver(null);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	if (isLoading) {
		return <Loader />;
	}

	if (error) {
		return (
			<div style={{ padding: "24px" }}>
				<Empty description="Failed to load drivers" />
			</div>
		);
	}

	const drivers = data?.data?.drivers || [];
	const pagination = data?.data?.pagination;

	return (
		<div>
			{/* Header */}
			<Flex justify="space-between" align="center" wrap="wrap" gap="16px">
				<Title level={isMobile ? 5 : 4} style={{ margin: 0 }}>
					Drivers
				</Title>
				{/* <Flex gap="12px" wrap="wrap"> */}
				{/* <Search
						placeholder="Search drivers..."
						onSearch={handleSearch}
						allowClear
						style={{ width: isMobile ? 150 : 250 }}
					/> */}
				<Button type="primary" onClick={handleAddDriver}>
					Add Driver
				</Button>
				{/* </Flex> */}
			</Flex>

			<Row gutter={[24, 24]} style={{ marginTop: 24 }}>
				{/* Main Content */}
				<Col xs={24}>
					<Space direction="vertical" style={{ width: "100%" }}>
						{/* Driver Table */}
						{drivers.length > 0 ? (
							<>
								<DriverTable
									drivers={drivers}
									loading={isLoading}
									onEdit={handleEditDriver}
								/>

								{/* Pagination */}
								{pagination && pagination.totalPages > 1 && (
									<Flex justify="center" style={{ marginTop: "32px" }}>
										<Pagination
											current={currentPage}
											total={pagination.totalDrivers}
											pageSize={pageSize}
											onChange={handlePageChange}
											showSizeChanger={false}
											showQuickJumper
											showTotal={(total, range) =>
												`${range[0]}-${range[1]} of ${total} drivers`
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
										? `No drivers found for "${searchTerm}"`
										: "No drivers yet"
								}
								image={Empty.PRESENTED_IMAGE_SIMPLE}
							>
								{!searchTerm && (
									<Button type="primary" onClick={handleAddDriver}>
										Add Your First Driver
									</Button>
								)}
							</Empty>
						)}
					</Space>
				</Col>
			</Row>

			{/* Add/Edit Drawer */}
			<AddEditDriverDrawer
				open={drawerOpen}
				onClose={handleDrawerClose}
				driver={editingDriver}
				mode={drawerMode}
			/>
		</div>
	);
};

export default DriverManagement;
