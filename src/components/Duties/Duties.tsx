"use client";

import React, { useState, useEffect } from "react";
import {
	Button,
	Flex,
	Input,
	Select,
	DatePicker,
	Space,
	message,
	Card,
	Typography,
	Divider
} from "antd";
import {
	PlusOutlined,
	SearchOutlined,
	FilterOutlined,
	DeleteOutlined
} from "@ant-design/icons";
import { useDuties, useDeleteDuty } from "@/src/hooks/dutyHook";
import AddEditDutyDrawer from "./AddEditDutyDrawer";
import DutyCard from "./DutyCard";
import DutyTable from "./DutyTable";
import { IDuty, IDutySearchParams } from "@/src/types/iDuty";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const Duties: React.FC = () => {
    const router = useRouter();
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);
	const [editingDuty, setEditingDuty] = useState<IDuty | null>(null);
	const [searchParams, setSearchParams] = useState<IDutySearchParams>({
		page: 1,
		limit: 10
	});
	const [searchText, setSearchText] = useState("");
	const [dateRange, setDateRange] = useState<any>([null, null]);
	const [statusFilter, setStatusFilter] = useState<
		"Scheduled" | "In Progress" | "Completed" | "Cancelled" | undefined
	>(undefined);
	const [isBilledFilter, setIsBilledFilter] = useState<boolean | undefined>(
		undefined
	);

	const { data: dutiesData, isLoading, refetch } = useDuties(searchParams);
	const { mutate: deleteDuty } = useDeleteDuty();

	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIsMobile = () => {
			if (typeof window !== "undefined") {
				setIsMobile(window.innerWidth < 768);
			}
		};

		// Check on mount
		checkIsMobile();

		// Add event listener
		if (typeof window !== "undefined") {
			window.addEventListener("resize", checkIsMobile);
		}

		// Cleanup
		return () => {
			if (typeof window !== "undefined") {
				window.removeEventListener("resize", checkIsMobile);
			}
		};
	}, []);

	// Apply filters when they change
	useEffect(() => {
		const params: IDutySearchParams = {
			page: 1,
			limit: 10,
			search: searchText || undefined,
			status: statusFilter,
			isBilled: isBilledFilter
		};

		if (dateRange[0] && dateRange[1]) {
			params.startDate = dateRange[0]?.format("YYYY-MM-DD") || "";
			params.endDate = dateRange[1]?.format("YYYY-MM-DD") || "";
		}

		setSearchParams(params);
	}, [searchText, dateRange, statusFilter, isBilledFilter]);

	const handleAddNew = () => {
		setEditingDuty(null);
		setIsDrawerVisible(true);
	};

	const handleEdit = (duty: IDuty) => {
		setEditingDuty(duty);
		setIsDrawerVisible(true);
	};

	const handleDelete = (id: string) => {
		deleteDuty(id, {
			onSuccess: () => {
				message.success("Duty deleted successfully");
				refetch();
			},
			onError: (error: any) => {
				message.error(
					error?.response?.data?.message || "Failed to delete duty"
				);
			}
		});
	};

	const handleGenerateInvoice = (duty: IDuty) => {
		// Navigate to invoice creation page with duty data
		const invoiceData = {
			dutyId: duty._id,
			companyName: duty.companyName || "",
			clientName: duty.clientName || "",
			pickupLocation: duty.pickupLocation,
			dropLocation: duty.dropLocation,
			distanceTraveled: duty.distanceTraveled,
			ratePerKm: duty.ratePerKm,
			baseRate: duty.baseRate,
			extraCharges: duty.extraCharges,
			startDate: duty.startDate,
			vehicleId: duty.vehicleId,
			endDate: duty.endDate
		};

		// Store data in localStorage to pass to invoice page
		localStorage.setItem("dutyInvoiceData", JSON.stringify(invoiceData));

		// Navigate to invoice creation page
		router.push("/invoice/add");
	};

	const handleDrawerClose = () => {
		setIsDrawerVisible(false);
		setEditingDuty(null);
	};

	const handleSearch = (value: string) => {
		setSearchText(value);
	};

	const handleDateRangeChange = (
		dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
	) => {
		if (dates) {
			setDateRange(dates);
		} else {
			setDateRange([null, null]);
		}
	};

	const clearFilters = () => {
		setSearchText("");
		setDateRange([null, null]);
		setStatusFilter(undefined);
		setIsBilledFilter(undefined);
	};

	const duties = dutiesData?.data?.duties || [];

	return (
		<div>
			<Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
				<Title level={3} style={{ margin: 0 }}>
					Duties
				</Title>
				<Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
					Add New Duty
				</Button>
			</Flex>

			<Flex justify="space-between" align="center" wrap="wrap" gap={12}>
				<Space wrap>
					{/* <Input
						placeholder="Search duties..."
						prefix={<SearchOutlined />}
						allowClear
						onChange={(e) => handleSearch(e.target.value)}
						style={{ width: 200 }}
					/> */}
					<RangePicker
						onChange={handleDateRangeChange}
						value={dateRange}
						placeholder={["Start Date", "End Date"]}
					/>
					{/* <Select
						placeholder="Status"
						style={{ width: 120 }}
						allowClear
						onChange={setStatusFilter}
						value={statusFilter}
					>
						<Select.Option value="Scheduled">Scheduled</Select.Option>
						<Select.Option value="In Progress">In Progress</Select.Option>
						<Select.Option value="Completed">Completed</Select.Option>
						<Select.Option value="Cancelled">Cancelled</Select.Option>
					</Select> */}
					<Select
						placeholder="Billed Status"
						style={{ width: 120 }}
						allowClear
						onChange={(value) =>
							setIsBilledFilter(
								value === "true" ? true : value === "false" ? false : undefined
							)
						}
						value={
							isBilledFilter === true
								? "true"
								: isBilledFilter === false
								? "false"
								: undefined
						}
					>
						<Select.Option value="true">Billed</Select.Option>
						<Select.Option value="false">Not Billed</Select.Option>
					</Select>
				</Space>
				<Button
					icon={<DeleteOutlined />}
					onClick={clearFilters}
					style={{ marginBottom: 16 }}
				>
					Clear Filters
				</Button>
			</Flex>

			{isMobile ? (
				<div>
					{duties.map((duty) => (
						<DutyCard
							key={duty._id}
							duty={duty}
							onEdit={handleEdit}
							onDelete={handleDelete}
							onGenerateInvoice={handleGenerateInvoice}
						/>
					))}
				</div>
			) : (
				<DutyTable
					duties={duties}
					loading={isLoading}
					onEdit={handleEdit}
					onDelete={handleDelete}
					onGenerateInvoice={handleGenerateInvoice}
				/>
			)}

			<AddEditDutyDrawer
				visible={isDrawerVisible}
				onClose={handleDrawerClose}
				onSuccess={refetch}
				duty={editingDuty}
			/>
		</div>
	);
};

export default Duties;
