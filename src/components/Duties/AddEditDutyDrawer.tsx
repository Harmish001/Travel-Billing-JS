"use client";

import React, { useEffect } from "react";
import {
	Drawer,
	Form,
	Input,
	Button,
	Select,
	DatePicker,
	message,
	Row,
	Col,
	Divider,
	Typography
} from "antd";
import { useCreateDuty, useUpdateDuty } from "@/src/hooks/dutyHook";
import { useDrivers } from "@/src/hooks/driverHook";
import { useVehicles } from "@/src/hooks/vehicleHook";
import {
	IDutyCreateRequest,
	IDuty,
	IDutyUpdateRequest
} from "@/src/types/iDuty";
import dayjs from "dayjs";
import { themeColors } from "@/src/styles/theme";

interface AddEditDutyDrawerProps {
	visible: boolean;
	onClose: () => void;
	onSuccess?: () => void;
	duty?: IDuty | null;
}

const { Option } = Select;
const { Title } = Typography;

const AddEditDutyDrawer: React.FC<AddEditDutyDrawerProps> = ({
	visible,
	onClose,
	onSuccess,
	duty
}) => {
	const [form] = Form.useForm();
	const isEditing = !!duty;

	const { data: driversData, isLoading: isDriversLoading } = useDrivers();
	const { data: vehiclesData, isLoading: isVehiclesLoading } = useVehicles();

	const { mutate: createDuty, isPending: isCreating } = useCreateDuty();
	const { mutate: updateDuty, isPending: isUpdating } = useUpdateDuty();

	// Set form values when editing
	useEffect(() => {
		if (visible && duty) {
			form.setFieldsValue({
				...duty,
				driverId: duty.driverId._id,
				vehicleId: duty.vehicleId._id,
				startDate: duty.startDate ? dayjs(duty.startDate) : null,
				endDate: duty.endDate ? dayjs(duty.endDate) : null
			});
		} else if (visible) {
			form.resetFields();
		}
	}, [visible, duty, form]);

	const handleSubmit = (values: any) => {
		if (isEditing && duty) {
			const updateData: IDutyUpdateRequest = {
				...values,
				startDate: values.startDate
					? dayjs(values.startDate).format("YYYY-MM-DD")
					: undefined,
				endDate: values.endDate
					? dayjs(values.endDate).format("YYYY-MM-DD")
					: undefined
			};

			updateDuty(
				{ id: duty._id, data: updateData },
				{
					onSuccess: () => {
						message.success("Duty updated successfully");
						form.resetFields();
						onClose();
						onSuccess?.();
					},
					onError: (error: any) => {
						message.error(
							error?.response?.data?.message || "Failed to update duty"
						);
					}
				}
			);
		} else {
			const dutyData: IDutyCreateRequest = {
				...values,
				startDate: values.startDate
					? dayjs(values.startDate).format("YYYY-MM-DD")
					: "",
				endDate: values.endDate
					? dayjs(values.endDate).format("YYYY-MM-DD")
					: undefined
			};

			createDuty(dutyData, {
				onSuccess: () => {
					message.success("Duty created successfully");
					form.resetFields();
					onClose();
					onSuccess?.();
				},
				onError: (error: any) => {
					message.error(
						error?.response?.data?.message || "Failed to create duty"
					);
				}
			});
		}
	};

	const dutyTypes = [
		"Outstation",
		"Local",
		"Corporate",
		"Airport Transfer",
		"Event",
		"Other"
	];

	return (
		<Drawer
			title={isEditing ? "Edit Duty" : "Add New Duty"}
			width={720}
			onClose={onClose}
			open={visible}
			footer={
				<div style={{ textAlign: "right" }}>
					<Button onClick={onClose} style={{ marginRight: 8 }}>
						Cancel
					</Button>
					<Button
						onClick={() => form.submit()}
						type="primary"
						loading={isCreating || isUpdating}
					>
						{isEditing ? "Update" : "Submit"}
					</Button>
				</div>
			}
		>
			<Form
				form={form}
				layout="vertical"
				onFinish={handleSubmit}
				requiredMark={false}
				initialValues={{
					dutyType: "Outstation",
					startDate: dayjs()
				}}
			>
				<Divider>
					<Title
						level={4}
						style={{
							textAlign: "center",
							margin: 0,
							color: themeColors.primary
						}}
					>
						Vehicle Information
					</Title>
				</Divider>
				<Row gutter={24}>
					<Col xs={24} md={12}>
						<Form.Item
							name="driverId"
							label="Driver"
							rules={[{ required: true, message: "Please select a driver" }]}
						>
							<Select
								showSearch
								placeholder="Select a driver"
								optionFilterProp="children"
								loading={isDriversLoading}
								disabled={isDriversLoading}
							>
								{driversData?.data?.drivers.map((driver) => (
									<Option key={driver._id} value={driver._id}>
										{driver.driverName} ({driver.driverPhoneNumber})
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item
							name="vehicleId"
							label="Vehicle"
							rules={[{ required: true, message: "Please select a vehicle" }]}
						>
							<Select
								showSearch
								placeholder="Select a vehicle"
								optionFilterProp="children"
								loading={isVehiclesLoading}
								disabled={isVehiclesLoading}
							>
								{vehiclesData?.data?.vehicles.map((vehicle) => (
									<Option key={vehicle._id} value={vehicle._id}>
										{vehicle.vehicleNumber} ({vehicle.vehicleType})
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
				</Row>

				<Divider>
					<Title
						level={4}
						style={{
							textAlign: "center",
							margin: 0,
							color: themeColors.primary
						}}
					>
						Basic Information
					</Title>
				</Divider>

				<Row gutter={24}>
					{isEditing && (
						<Col xs={24} md={12}>
							<Form.Item name="companyName" label="Company Name">
								<Input placeholder="Enter company name" />
							</Form.Item>
						</Col>
					)}

					<Col xs={24} md={12}>
						<Form.Item name="clientName" label="Client Name">
							<Input placeholder="Enter client name" />
						</Form.Item>
					</Col>

					{isEditing && (
						<Col xs={24} md={12}>
							<Form.Item name="clientPhoneNumber" label="Client Phone Number">
								<Input placeholder="Enter client phone number" />
							</Form.Item>
						</Col>
					)}

					<Col xs={24} md={12}>
						<Form.Item
							name="dutyType"
							label="Duty Type"
							rules={[{ required: true, message: "Please select a duty type" }]}
						>
							<Select placeholder="Select a duty type">
								{dutyTypes.map((type) => (
									<Option key={type} value={type}>
										{type}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
				</Row>

				<Divider>
					<Title
						level={4}
						style={{
							textAlign: "center",
							margin: 0,
							color: themeColors.primary
						}}
					>
						Schedule
					</Title>
				</Divider>

				<Row gutter={24}>
					<Col xs={24} md={12}>
						<Form.Item
							name="startDate"
							label="Start Date"
							rules={[
								{ required: true, message: "Please select a start date" }
							]}
						>
							<DatePicker style={{ width: "100%" }} />
						</Form.Item>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item name="endDate" label="End Date">
							<DatePicker style={{ width: "100%" }} />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={24}>
					<Col xs={24} lg={12}>
						<Form.Item
							name="pickupLocation"
							label="Pickup Location"
							rules={[
								{ required: true, message: "Please enter pickup location" }
							]}
						>
							<Input placeholder="Enter pickup location" />
						</Form.Item>
					</Col>

					<Col xs={24} lg={12}>
						<Form.Item
							name="dropLocation"
							label="Drop Location"
							rules={[
								{ required: true, message: "Please enter drop location" }
							]}
						>
							<Input placeholder="Enter drop location" />
						</Form.Item>
					</Col>
				</Row>

				{isEditing && (
					<Divider>
						{" "}
						<Title
							level={4}
							style={{
								textAlign: "center",
								margin: 0,
								color: themeColors.primary
							}}
						>
							Financial Details
						</Title>
					</Divider>
				)}

				{isEditing && (
					<Row gutter={24}>
						<Col xs={24} md={12}>
							<Form.Item name="distanceTraveled" label="Distance Traveled (km)">
								<Input type="number" placeholder="Enter distance traveled" />
							</Form.Item>
						</Col>

						<Col xs={24} md={12}>
							<Form.Item name="ratePerKm" label="Rate per Km">
								<Input type="number" placeholder="Enter rate per km" />
							</Form.Item>
						</Col>
					</Row>
				)}

				{isEditing && (
					<Row gutter={24}>
						<Col xs={24} md={12}>
							<Form.Item name="baseRate" label="Base Rate">
								<Input type="number" placeholder="Enter base rate" />
							</Form.Item>
						</Col>

						<Col xs={24} md={12}>
							<Form.Item name="extraCharges" label="Extra Charges">
								<Input type="number" placeholder="Enter extra charges" />
							</Form.Item>
						</Col>
					</Row>
				)}
			</Form>
		</Drawer>
	);
};

export default AddEditDutyDrawer;
