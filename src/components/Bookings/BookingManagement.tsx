"use client";

import React, { useState } from "react";
import {
	Row,
	Col,
	Typography,
	Button,
	Space,
	Pagination,
	Empty,
	Flex,
	Grid,
	Card,
	DatePicker,
	message
} from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import {
	useBookingsQuery,
	useUpdateBookingStatus
} from "@/src/hooks/bookingsHook";
import { IBooking } from "@/src/types";
import BookingCard from "./BookingCard";
import BookingTable from "./BookingTable";
import Loader from "@/src/ui/Loader";

// Extend dayjs with plugins
dayjs.extend(weekday);
dayjs.extend(isoWeek);

const { Title } = Typography;
const { RangePicker } = DatePicker;

const BookingManagement: React.FC = () => {
	const [dateRange, setDateRange] = useState<any>([
		dayjs().startOf("week"),
		dayjs().endOf("week")
	]);
	const [page, setPage] = useState(1);
	const [limit] = useState(10);

	const { data, isLoading, error } = useBookingsQuery(
		dateRange[0]?.format("YYYY-MM-DD"),
		dateRange[1]?.format("YYYY-MM-DD"),
		page,
		limit
	);

	const { mutate: updateStatus, isPending: isUpdating } =
		useUpdateBookingStatus();

	const { useBreakpoint } = Grid;
	const screens = useBreakpoint();
	const isMobile = !screens.md;

	const handlePrevWeek = () => {
		const newStartDate = dateRange[0].subtract(1, "week");
		const newEndDate = dateRange[1].subtract(1, "week");
		setDateRange([newStartDate, newEndDate]);
		setPage(1);
	};

	const handleNextWeek = () => {
		const newStartDate = dateRange[0].add(1, "week");
		const newEndDate = dateRange[1].add(1, "week");
		setDateRange([newStartDate, newEndDate]);
		setPage(1);
	};

	const handleCurrentWeek = () => {
		const startOfWeek = dayjs().startOf("week");
		const endOfWeek = dayjs().endOf("week");
		setDateRange([startOfWeek, endOfWeek]);
		setPage(1);
	};

	const handleDateRangeChange = (dates: any) => {
		if (dates) {
			setDateRange(dates);
			setPage(1);
		}
	};

	const handlePageChange = (page: number) => {
		setPage(page);
	};

	const handleUpdateStatus = (
		id: string,
		status: "Pending" | "Completed" | "inProgress"
	) => {
		updateStatus(
			{ id, status },
			{
				onSuccess: () => {
					message.success("Booking status updated successfully");
				},
				onError: (error) => {
					message.error("Failed to update booking status");
					console.error("Error updating booking status:", error);
				}
			}
		);
	};

	if (isLoading) {
		return <Loader />;
	}

	if (error) {
		return (
			<div style={{ padding: "24px" }}>
				<Empty description="Failed to load bookings" />
			</div>
		);
	}

	const bookings = data?.data?.bookings || [];
	const pagination = data?.data?.pagination || {
		currentPage: 1,
		totalPages: 1,
		totalBookings: 0,
		hasNext: false,
		hasPrev: false
	};

	return (
		<div>
			{/* Header */}
			<Flex justify="space-between" align="center" wrap="wrap" gap="16px">
				<Title level={isMobile ? 5 : 4} style={{ margin: 0 }}>
					Bookings
				</Title>
				<Space>
					<Button icon={<LeftOutlined />} onClick={handlePrevWeek}>
						Previous
					</Button>
					<Button onClick={handleCurrentWeek}>Current Week</Button>
					<Button icon={<RightOutlined />} onClick={handleNextWeek}>
						Next
					</Button>
				</Space>
			</Flex>

			<div style={{ margin: "16px 0", fontSize: "14px", color: "#666" }}>
				Showing bookings from {dateRange[0]?.format("MMM D, YYYY") || ""} to{" "}
				{dateRange[1]?.format("MMM D, YYYY") || ""}
			</div>

			{/* Date Range Picker */}
			<Row gutter={[16, 16]} style={{ marginBottom: 8 }}>
				<Col xs={24} md={12}>
					<RangePicker
						value={dateRange}
						onChange={handleDateRangeChange}
						style={{ width: 250 }}
						placeholder={["Start Date", "End Date"]}
					/>
				</Col>
			</Row>

			<Row gutter={[24, 24]} style={{ marginTop: 8 }}>
				{/* Main Content */}
				<Col xs={24}>
					<Space direction="vertical" style={{ width: "100%" }}>
						{/* Booking Table/Cards */}
						{bookings.length > 0 ? (
							<>
								{/* Mobile View - Cards */}
								<div className="mobile-view">
									<Row gutter={[16, 16]}>
										{bookings.map((booking: IBooking) => (
											<Col xs={24} key={booking._id}>
												<BookingCard
													booking={booking}
													onUpdateStatus={handleUpdateStatus}
													isUpdating={isUpdating}
												/>
											</Col>
										))}
									</Row>
								</div>

								{/* Desktop View - Table */}
								<div className="desktop-view">
									<BookingTable
										bookings={bookings}
										onUpdateStatus={handleUpdateStatus}
										isUpdating={isUpdating}
									/>
								</div>

								{/* Pagination */}
								{pagination && pagination.totalPages > 1 && (
									<Flex justify="center" style={{ marginTop: "32px" }}>
										<Pagination
											current={pagination.currentPage}
											total={pagination.totalBookings}
											pageSize={limit}
											onChange={handlePageChange}
											showSizeChanger={false}
											showQuickJumper
											showTotal={(total, range) =>
												`${range[0]}-${range[1]} of ${total} bookings`
											}
											style={{ borderRadius: "20px" }}
										/>
									</Flex>
								)}
							</>
						) : (
							<Empty
								description={`No bookings found for the selected period`}
								image={Empty.PRESENTED_IMAGE_SIMPLE}
							/>
						)}
					</Space>
				</Col>
			</Row>
		</div>
	);
};

export default BookingManagement;
