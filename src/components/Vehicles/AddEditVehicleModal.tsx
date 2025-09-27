"use client";
import {
	Modal,
	Form,
	Input,
	Typography,
	Select,
	Drawer,
	Button,
	Dropdown
} from "antd";
import { useEffect } from "react";
import {
	Vehicle,
	VehicleCreateRequest,
	VehicleUpdateRequest
} from "@/src/types/iVehicle";
import { useCreateVehicle, useUpdateVehicle } from "@/src/hooks/vehicleHook";
import { VEHICLE_TYPES } from "@/src/constants/vehicles";
import { PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface AddEditVehicleModalProps {
	open: boolean;
	onClose: () => void;
	vehicle?: Vehicle | null;
	mode: "create" | "edit";
}

const AddEditVehicleModal: React.FC<AddEditVehicleModalProps> = ({
	open,
	onClose,
	vehicle,
	mode
}) => {
	const [form] = Form.useForm();
	const {
		mutate: createVehicle,
		isPending: isCreating,
		contextHolder: createContextHolder
	} = useCreateVehicle();
	const {
		mutate: updateVehicle,
		isPending: isUpdating,
		contextHolder: updateContextHolder
	} = useUpdateVehicle();

	const isLoading = isCreating || isUpdating;
	const isEditMode = mode === "edit";

	useEffect(() => {
		if (open) {
			if (isEditMode && vehicle) {
				form.setFieldsValue({
					vehicleNumber: vehicle.vehicleNumber,
					vehicleType: vehicle.vehicleType
				});
			} else {
				form.resetFields();
			}
		}
	}, [open, isEditMode, vehicle, form]);

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();

			if (isEditMode && vehicle) {
				updateVehicle(
					{ id: vehicle._id, data: values as VehicleUpdateRequest },
					{
						onSuccess: () => {
							form.resetFields();
							onClose();
						}
					}
				);
			} else {
				createVehicle(values as VehicleCreateRequest, {
					onSuccess: () => {
						form.resetFields();
						onClose();
					}
				});
			}
		} catch (error) {
			console.error("Form validation failed:", error);
		}
	};

	return (
		<>
			{createContextHolder}
			{updateContextHolder}
			<Drawer
				title={
					<Title level={4} style={{ margin: 0 }}>
						{isEditMode ? "Edit Vehicle" : "Add New Vehicle"}
					</Title>
				}
				open={open}
                onClose={onClose}
				width={400}
			>
				<Form form={form} layout="vertical" size="large">
					<Form.Item
						name="vehicleNumber"
						label="Vehicle Number"
						rules={[
							{ required: true, message: "Vehicle number is required" },
							{
								min: 1,
								max: 20,
								message: "Vehicle number must be between 1 and 20 characters"
							},
							{
								pattern: /^[A-Za-z0-9\s-]+$/,
								message:
									"Only alphanumeric characters, spaces, and hyphens are allowed"
							}
						]}
					>
						<Input
							placeholder="e.g., MH12AB1234"
							size="large"
							maxLength={20}
							showCount
							onChange={(e) =>
								form.setFieldValue(
									"vehicleNumber",
									e.target.value.toUpperCase()
								)
							}
						/>
					</Form.Item>
					<Form.Item
						name="vehicleType"
						label="Vehicle Type"
						rules={[{ required: true, message: "Vehicle type is required" }]}
					>
						<Select
							options={VEHICLE_TYPES}
							placeholder="Select vehicle type"
							size="large"
						/>
					</Form.Item>
				</Form>
				<Button type="primary" onClick={handleSubmit}>
					{isEditMode ? "Update" : "Save"}
				</Button>
			</Drawer>
		</>
	);
};

export default AddEditVehicleModal;
