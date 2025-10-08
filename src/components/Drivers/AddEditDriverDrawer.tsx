"use client";
import { Drawer, Form, Input, Typography, Button, Space } from "antd";
import { useEffect } from "react";
import {
	Driver,
	DriverCreateRequest,
	DriverUpdateRequest
} from "@/src/types/iDriver";
import { useCreateDriver, useUpdateDriver } from "@/src/hooks/driverHook";
import { PhoneOutlined, UserOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface AddEditDriverDrawerProps {
	open: boolean;
	onClose: () => void;
	driver?: Driver | null;
	mode: "create" | "edit";
}

const AddEditDriverDrawer: React.FC<AddEditDriverDrawerProps> = ({
	open,
	onClose,
	driver,
	mode
}) => {
	const [form] = Form.useForm();
	const {
		mutate: createDriver,
		isPending: isCreating,
		contextHolder: createContextHolder
	} = useCreateDriver();
	const {
		mutate: updateDriver,
		isPending: isUpdating,
		contextHolder: updateContextHolder
	} = useUpdateDriver();

	const isLoading = isCreating || isUpdating;
	const isEditMode = mode === "edit";

	useEffect(() => {
		if (open) {
			if (isEditMode && driver) {
				form.setFieldsValue({
					driverName: driver.driverName,
					driverPhoneNumber: driver.driverPhoneNumber
				});
			} else {
				form.resetFields();
			}
		}
	}, [open, isEditMode, driver, form]);

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();

			if (isEditMode && driver) {
				updateDriver(
					{ id: driver._id, data: values as DriverUpdateRequest },
					{
						onSuccess: () => {
							form.resetFields();
							onClose();
						}
					}
				);
			} else {
				createDriver(values as DriverCreateRequest, {
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
						{isEditMode ? "Edit Driver" : "Add New Driver"}
					</Title>
				}
				open={open}
				onClose={onClose}
				width={400}
				styles={{
					body: {
						display: "flex",
						flexDirection: "column",
						height: "calc(100% - 55px)"
					}
				}}
			>
				<Form form={form} layout="vertical" style={{ flex: 1 }}>
					<Form.Item
						name="driverName"
						label="Driver Name"
						rules={[
							{ required: true, message: "Driver name is required" },
							{
								min: 2,
								max: 50,
								message: "Driver name must be between 2 and 50 characters"
							},
							{
								pattern: /^[A-Za-z\s]+$/,
								message: "Only alphabetic characters and spaces are allowed"
							}
						]}
					>
						<Input
							placeholder="Enter driver name"
							maxLength={50}
							showCount
							prefix={<UserOutlined />}
						/>
					</Form.Item>
					<Form.Item
						name="driverPhoneNumber"
						label="Phone Number"
						rules={[
							{ required: true, message: "Phone number is required" },
							{
								pattern: /^[0-9]{10}$/,
								message: "Please enter a valid 10-digit phone number"
							}
						]}
					>
						<Input
							placeholder="Enter 10-digit phone number"
							maxLength={10}
							showCount
							prefix={<PhoneOutlined />}
						/>
					</Form.Item>
					<Space>
						<Button type="primary" onClick={handleSubmit} loading={isLoading}>
							{isEditMode ? "Update" : "Save"}
						</Button>
					</Space>
				</Form>
			</Drawer>
		</>
	);
};

export default AddEditDriverDrawer;
