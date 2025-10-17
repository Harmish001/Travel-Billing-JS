"use client";

import React, { useState, useEffect } from "react";
import {
	Form,
	Input,
	Button,
	Row,
	Col,
	Select,
	DatePicker,
	Table,
	Typography,
	Divider,
	Alert,
	message,
	Flex,
	Switch
} from "antd";
import {
	PlusOutlined,
	DeleteOutlined,
	FieldNumberOutlined,
	BankOutlined,
	UserOutlined,
	EyeOutlined
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useSettings } from "@/src/hooks/settingsHook";
import { useVehicles } from "@/src/hooks/vehicleHook";
import { useCreateBilling } from "@/src/hooks/billingHook";
import { IBillingItem, IBillingRequest } from "@/src/types/iBilling";
import { Vehicle } from "@/src/types/iVehicle";
import { Settings } from "@/src/types/iSettings";
import Loader from "@/src/ui/Loader";
import InvoicePreview from "./InvoicePreview";
import { themeColors } from "@/src/styles/theme";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

// Helper function to calculate total amount
const calculateTotalAmount = (quantity: number, rate: number): number => {
	return parseFloat((quantity * rate).toFixed(2));
};

interface InvoiceFormValues extends IBillingRequest {
	billingItems: IBillingItem[];
}

const Invoice: React.FC = () => {
	const [form] = Form.useForm();
	const router = useRouter();
	const [view, setView] = useState<"form" | "preview">("form");
	const [previewData, setPreviewData] = useState<any>(null);
	const [billingItems, setBillingItems] = useState<IBillingItem[]>([
		{
			description: "Hiring Charges for",
			hsnSac: "996601",
			unit: "Trip",
			quantity: 1,
			rate: 0,
			totalAmount: 0
		}
	]);
	const { data: settingsData, isLoading: isSettingsLoading } = useSettings();
	const { data: vehiclesData, isLoading: isVehiclesLoading } = useVehicles();
	const {
		mutate: createBilling,
		isPending: isCreating,
		data: createdBilling
	} = useCreateBilling();

	// Set default values when settings or vehicles data loads
	useEffect(() => {
		if (settingsData?.data) {
			form.setFieldsValue({
				companyName: (settingsData.data as Settings).companyName,
				bankDetails: (settingsData.data as Settings).bankDetails
			});
		}
	}, [settingsData, form]);

	// Prefill form with duty data if available
	useEffect(() => {
		const dutyInvoiceData = localStorage.getItem("dutyInvoiceData");
		if (dutyInvoiceData) {
			try {
				const data = JSON.parse(dutyInvoiceData);
				const vehicles = vehiclesData?.data?.vehicles.find(
					(vehicle) => vehicle._id === data.vehicleId._id
				);
				// Create a billing item based on duty data
				const billingItem = {
					description: `Hiring Charges for ${vehicles?.vehicleType}`,
					hsnSac: "996601",
					unit: "Km",
					quantity: 1,
					rate: (data.distanceTraveled || 0) * (data.ratePerKm || 0),
					totalAmount: (data.distanceTraveled || 0) * (data.ratePerKm || 0)
				};

				// Update form fields
				form.setFieldsValue({
					companyName: data.companyName,
					recipientName: data.clientName,
					projectLocation: `${data.pickupLocation} to ${data.dropLocation}`,
					billingItems: [billingItem],
					vehicleIds: { label: vehicles?.vehicleNumber, value: vehicles?._id }
				});
				// Remove the data from localStorage
				localStorage.removeItem("dutyInvoiceData");
			} catch (error) {
				console.error("Error parsing duty invoice data:", error);
			}
		}
	}, [form]);

	// sets all vehicles default
	// useEffect(() => {
	// 	if (vehiclesData?.data?.vehicles && vehiclesData.data.vehicles.length > 0) {
	// 		const defaultVehicleIds = vehiclesData.data.vehicles.map(
	// 			(vehicle) => vehicle._id
	// 		);

	// 		form.setFieldValue("vehicleIds", defaultVehicleIds);
	// 	}
	// }, [vehiclesData, form]);

	// Handle form submission
	const onFinish = (values: InvoiceFormValues) => {
		// Filter out items with no description
		const validItems = values.billingItems.filter(
			(item) => item.description.trim() !== ""
		);

		if (validItems.length === 0) {
			message.error("Please add at least one billing item");
			return;
		}

		const billingData: IBillingRequest = {
			...values,
			billingItems: validItems,
			// @ts-ignore // DO NOT CHANGE
			billingDate: dayjs(values.billingDate).format("DD/MM/YYYY"),
			bankDetails: {
				...values.bankDetails,
				// @ts-ignore // DO NOT CHANGE
				branch: values.bankDetails.branchName
			},
			gstEnabled: values.gstEnabled ?? true // Default to true if not set
		};

		createBilling(billingData, {
			onSuccess: () => {
				// Navigate back to the invoice list page after successful creation
				message.success("Invoice created successfully!");
				router.push("/invoice");
			}
		});
	};

	// Handle preview
	const handlePreview = async () => {
		try {
			const values = await form.validateFields();
			setPreviewData(values);
			setView("preview");
		} catch (error) {
			message.error("Please fill all required fields before previewing");
		}
	};

	// Handle back to form
	const handleBackToForm = () => {
		setView("form");
	};

	// Handle item changes
	const handleItemChange = (
		index: number,
		field: keyof IBillingItem,
		value: any
	) => {
		const newItems = [...billingItems];
		newItems[index] = { ...newItems[index], [field]: value };

		// Calculate total amount when quantity or rate changes
		if (field === "quantity" || field === "rate") {
			const quantity = field === "quantity" ? value : newItems[index].quantity;
			const rate = field === "rate" ? value : newItems[index].rate;
			newItems[index].totalAmount = calculateTotalAmount(quantity, rate);
		}

		setBillingItems(newItems);
		form.setFieldValue("billingItems", newItems);
	};

	// Add new billing item
	const addBillingItem = () => {
		setBillingItems([
			...billingItems,
			{
				description: "",
				hsnSac: "",
				unit: "Nos",
				quantity: 0,
				rate: 0,
				totalAmount: 0
			}
		]);
	};

	// Remove billing item
	const removeBillingItem = (index: number) => {
		if (billingItems.length <= 1) {
			message.warning("At least one billing item is required");
			return;
		}

		const newItems = billingItems.filter((_, i) => i !== index);
		setBillingItems(newItems);
		form.setFieldValue("billingItems", newItems);
	};

	// Calculate grand total
	const calculateGrandTotal = () => {
		const subtotal = billingItems.reduce(
			(sum, item) => sum + (item.totalAmount || 0),
			0
		);

		// Get GST status from form
		const isGstEnabled = form.getFieldValue("gstEnabled") ?? true;

		// If GST is enabled, add 18% GST to the subtotal
		if (isGstEnabled) {
			const gstAmount = subtotal * 0.18;
			return subtotal + gstAmount;
		}

		return subtotal;
	};

	// Billing items table columns
	const columns: ColumnsType<IBillingItem> = [
		{
			title: "Description",
			dataIndex: "description",
			render: (_, __, index) => (
				<Form.Item
					name={["billingItems", index, "description"]}
					rules={[{ required: true, message: "Description is required" }]}
					noStyle
				>
					<Input
						placeholder="Item description"
						onChange={(e) =>
							handleItemChange(index, "description", e.target.value)
						}
					/>
				</Form.Item>
			)
		},
		{
			title: "HSN/SAC",
			dataIndex: "hsnSac",
			width: 150,
			render: (_, __, index) => (
				<Form.Item name={["billingItems", index, "hsnSac"]} noStyle>
					<Input
						placeholder="HSN/SAC"
						onChange={(e) => handleItemChange(index, "hsnSac", e.target.value)}
					/>
				</Form.Item>
			)
		},
		{
			title: "Unit",
			dataIndex: "unit",
			width: 150,
			render: (_, __, index) => (
				<Form.Item name={["billingItems", index, "unit"]} noStyle>
					<Select
						onChange={(value) => handleItemChange(index, "unit", value)}
						style={{ width: 100 }}
						options={[
							{ value: "Km", label: "Km" },
							{ value: "Meter", label: "Meter" },
							{ value: "Hours", label: "Hours" },
							{ value: "Day", label: "Day" },
							{ value: "Trip", label: "Trip" }
						]}
					/>
				</Form.Item>
			)
		},
		{
			title: "Qty",
			dataIndex: "quantity",
			width: 100,
			render: (_, __, index) => (
				<Form.Item
					name={["billingItems", index, "quantity"]}
					rules={[{ required: true, message: "Qty required" }]}
					noStyle
				>
					<Input
						type="number"
						placeholder="0"
						onChange={(e) =>
							handleItemChange(
								index,
								"quantity",
								parseFloat(e.target.value) || 0
							)
						}
					/>
				</Form.Item>
			)
		},
		{
			title: "Rate",
			dataIndex: "rate",
			width: 140,
			render: (_, __, index) => (
				<Form.Item
					name={["billingItems", index, "rate"]}
					rules={[{ required: true, message: "Rate required" }]}
					noStyle
				>
					<Input
						type="number"
						placeholder="0.00"
						onChange={(e) =>
							handleItemChange(index, "rate", parseFloat(e.target.value) || 0)
						}
						prefix="₹"
					/>
				</Form.Item>
			)
		},
		{
			title: "Total",
			dataIndex: "totalAmount",
			width: 120,
			render: (_, record) => (
				<Text strong>₹{record.totalAmount?.toFixed(2) || "0.00"}</Text>
			)
		},
		{
			title: "Action",
			key: "action",
			width: 40,
			render: (_, __, index) => (
				<Button
					type="text"
					danger
					icon={<DeleteOutlined />}
					onClick={() => removeBillingItem(index)}
				/>
			)
		}
	];

	// Show loading state while fetching data
	if (isSettingsLoading || isVehiclesLoading) {
		return <Loader />;
	}

	// Render preview view
	if (view === "preview") {
		return (
			<div style={{ position: "relative" }}>
				<div style={{ position: "absolute", top: 16, left: 16, zIndex: 1000 }}>
					<Button type="default" onClick={handleBackToForm}>
						Back to Form
					</Button>
				</div>
				<InvoicePreview
					visible={true}
					onClose={handleBackToForm}
					formData={previewData}
					selectedVehicles={
						vehiclesData?.data?.vehicles?.filter((v: Vehicle) =>
							previewData?.vehicleIds?.includes(v._id)
						) || []
					}
					companyName={previewData?.companyName}
					billingDate={previewData?.billingDate}
					settings={settingsData?.data as Settings}
				/>
			</div>
		);
	}

	// Render form view
	return (
		<div style={{ margin: "0 auto" }}>
			<Form
				form={form}
				layout="vertical"
				onFinish={onFinish}
				autoComplete="off"
				initialValues={{
					billingDate: dayjs(),
					workingTime: "9:00 AM to 6:00 PM",
					period: "Monthly",
					placeOfSupply: "Maharashtra",
					billingItems: billingItems,
					gstEnabled: true // Default GST is true
				}}
			>
				<Row gutter={24}>
					{/* Company Details */}
					<Col span={24}>
						<Divider>
							<Title
								level={4}
								style={{
									textAlign: "center",
									margin: 0,
									color: themeColors.primary
								}}
							>
								Company Details
							</Title>
						</Divider>
						<Row gutter={16}>
							<Col xs={24} md={12}>
								<Form.Item
									label="Company Name"
									name="companyName"
									rules={[
										{ required: true, message: "Company name is required" }
									]}
								>
									<Input
										placeholder="Enter company name"
										prefix={<BankOutlined />}
									/>
								</Form.Item>
							</Col>
						</Row>
					</Col>

					{/* Recipient Details */}
					<Col span={24}>
						<Divider>
							<Title
								level={4}
								style={{
									textAlign: "center",
									margin: 0,
									color: themeColors.primary
								}}
							>
								Recipient Details
							</Title>
						</Divider>
						<Row gutter={16}>
							<Col xs={24} md={12}>
								<Form.Item
									label="Recipient Name"
									name="recipientName"
									rules={[
										{ required: true, message: "Recipient name is required" }
									]}
								>
									<Input
										placeholder="Enter recipient name"
										prefix={<UserOutlined />}
									/>
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item
									label="Recipient Address"
									name="recipientAddress"
									rules={[
										{ required: true, message: "Recipient address is required" }
									]}
								>
									<Input.TextArea
										placeholder="Enter recipient address"
										autoSize={{ minRows: 2, maxRows: 4 }}
									/>
								</Form.Item>
							</Col>
						</Row>
					</Col>

					{/* Project Details */}
					<Col span={24}>
						<Divider>
							<Title
								level={4}
								style={{
									textAlign: "center",
									margin: 0,
									color: themeColors.primary
								}}
							>
								Project Details
							</Title>
						</Divider>
						<Row gutter={16}>
							<Col xs={24} md={8}>
								<Form.Item
									label="Billing Date"
									name="billingDate"
									rules={[
										{ required: true, message: "Billing date is required" }
									]}
								>
									<DatePicker
										style={{ width: "100%" }}
										placeholder="Select date"
									/>
								</Form.Item>
							</Col>
							<Col xs={24} md={8}>
								<Form.Item
									label="Working Time"
									name="workingTime"
									rules={[
										{ required: true, message: "Working time is required" }
									]}
								>
									<Input
										placeholder="e.g., 9:00 AM to 6:00 PM"
										prefix={<FieldNumberOutlined />}
									/>
								</Form.Item>
							</Col>
							<Col xs={24} md={8}>
								<Form.Item
									label="Period"
									name="period"
									rules={[{ required: true, message: "Period is required" }]}
								>
									<Input
										placeholder="e.g., Monthly"
										prefix={<FieldNumberOutlined />}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col xs={24} md={8}>
								<Form.Item
									label="Project Location"
									name="projectLocation"
									rules={[
										{ required: true, message: "Project location is required" }
									]}
								>
									<Input placeholder="Enter project location" />
								</Form.Item>
							</Col>
							<Col xs={24} md={8}>
								<Form.Item
									label="Place of Supply"
									name="placeOfSupply"
									rules={[
										{ required: true, message: "Place of supply is required" }
									]}
								>
									<Input placeholder="Enter place of supply" />
								</Form.Item>
							</Col>
							<Col xs={24} md={8}>
								<Form.Item
									label="Vehicles"
									name="vehicleIds"
									rules={[
										{
											required: true,
											message: "Please select at least one vehicle"
										}
									]}
								>
									<Select
										mode="multiple"
										maxTagCount={1}
										placeholder="Select vehicles"
										loading={isVehiclesLoading}
										options={
											vehiclesData?.data?.vehicles?.map((vehicle: Vehicle) => ({
												label: `${vehicle.vehicleNumber} (${vehicle.vehicleType})`,
												value: vehicle._id
											})) || []
										}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col xs={24} md={8}>
								<Form.Item
									label="GST"
									name="gstEnabled"
									valuePropName="checked"
								>
									<Switch defaultChecked />
								</Form.Item>
							</Col>
						</Row>
					</Col>

					{/* Billing Items */}
					<Col span={24}>
						<Divider>
							<Title
								level={4}
								style={{
									textAlign: "center",
									margin: 0,
									color: themeColors.primary
								}}
							>
								Billing Items
							</Title>
						</Divider>
						<Table
							dataSource={billingItems}
							columns={columns}
							pagination={false}
							rowKey={(_, index) => index?.toString() || "0"}
							scroll={{ x: 800 }}
							locale={{
								emptyText: "No billing items added"
							}}
						/>

						<Divider style={{ margin: "8px 0" }} />

						<div style={{ textAlign: "right" }}>
							<Text strong style={{ fontSize: 18 }}>
								Grand Total{" "}
								{form.getFieldValue("gstEnabled") ? "Inclusive of Tax" : ""} : ₹
								{calculateGrandTotal().toFixed(2)}
							</Text>
						</div>

						<Flex justify="center" style={{ margin: "16px 0" }}>
							<Button
								type="default"
								onClick={addBillingItem}
								icon={<PlusOutlined />}
							>
								Add Item
							</Button>
						</Flex>
					</Col>

					{/* Bank Details */}
					<Col span={24}>
						<Divider>
							<Title
								level={4}
								style={{
									textAlign: "center",
									margin: 0,
									color: themeColors.primary
								}}
							>
								Bank Details
							</Title>
						</Divider>
						<Row gutter={16}>
							<Col xs={24} md={12}>
								<Form.Item
									label="Bank Name"
									name={["bankDetails", "bankName"]}
									rules={[{ required: true, message: "Bank name is required" }]}
								>
									<Input placeholder="Enter bank name" />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item
									label="Branch"
									name={["bankDetails", "branchName"]}
									rules={[{ required: true, message: "Branch is required" }]}
								>
									<Input placeholder="Enter branch name" />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col xs={24} md={12}>
								<Form.Item
									label="Account Number"
									name={["bankDetails", "accountNumber"]}
									rules={[
										{ required: true, message: "Account number is required" }
									]}
								>
									<Input placeholder="Enter account number" />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item
									label="IFSC Code"
									name={["bankDetails", "ifscCode"]}
									rules={[{ required: true, message: "IFSC code is required" }]}
								>
									<Input placeholder="Enter IFSC code" />
								</Form.Item>
							</Col>
						</Row>
					</Col>

					{/* Submit Button */}
					<Col span={24}>
						<Flex justify="center" gap="large">
							<Button
								type="default"
								icon={<EyeOutlined />}
								onClick={handlePreview}
							>
								Preview Invoice
							</Button>
							<Button type="primary" htmlType="submit" loading={isCreating}>
								Generate Invoice
							</Button>
						</Flex>
					</Col>
				</Row>
			</Form>

			{/* Success Message */}
			{createdBilling && createdBilling.status && (
				<Alert
					message="Success"
					description={createdBilling.message}
					type="success"
					showIcon
					style={{ marginTop: 24 }}
				/>
			)}
		</div>
	);
};

export default Invoice;
