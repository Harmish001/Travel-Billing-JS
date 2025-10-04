import React, { useState, useEffect } from "react";
import {
	Button,
	Input,
	InputNumber,
	message,
	Spin,
	Select,
	DatePicker,
	Form,
	Row,
	Col,
	Card,
	Divider,
	Space
} from "antd";
import dayjs from "dayjs";
import { useCreateBilling } from "@/src/hooks/billingHook";
import { useSettings } from "@/src/hooks/settingsHook";
import { useVehicles } from "@/src/hooks/vehicleHook";
import { IBillingRequest, IBankDetails } from "@/src/types/iBilling";
import { Settings } from "@/src/types/iSettings";
import { useRouter } from "next/navigation";
import InvoicePreview from "./InvoicePreview";

const { TextArea } = Input;
const { Option } = Select;

export const InvoiceGenerator: React.FC = () => {
	const router = useRouter();
	const [form] = Form.useForm();
	// Fetch settings data
	const { data: settingsData, isLoading: isSettingsLoading } = useSettings();
	const settings: Settings | null = settingsData?.data || null;

	// Fetch vehicles data
	const { data: vehiclesData, isLoading: isVehiclesLoading } = useVehicles();
	const vehicles = vehiclesData?.data?.vehicles || [];

	const [companyName, setCompanyName] = useState<string>(
		settingsData?.data?.companyName || "HEllo"
	);
	const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
	const [billingDate, setBillingDate] = useState<Date | null>(null);

	// View state - 'form' or 'preview'
	const [view, setView] = useState<"form" | "preview">("form");
	const [previewData, setPreviewData] = useState<any>(null);

	// API integration
	const createBillingMutation = useCreateBilling();

	// Set default values from settings when they load
	useEffect(() => {
		if (settings) {
			form.setFieldsValue({
				companyName: settingsData?.data?.companyName
			});
		}
	}, [settings, form]);

	const handleVehicleChange = (vehicleIds: string[]) => {
		setSelectedVehicleIds(vehicleIds);
	};

	// Function to show preview
	const showPreview = () => {
		form
			.validateFields()
			.then((values) => {
				// Format the billing date for preview
				const formattedValues = {
					...values
				};
				setBillingDate(new Date());
				setPreviewData(formattedValues);
				setView("preview");
			})
			.catch((errorInfo) => {
				console.log("Validation failed:", errorInfo);
				message.error("Please fill in all required fields");
			});
	};

	// Function to go back to form view
	const showForm = () => {
		setView("form");
	};

	const saveBillingToAPI = async () => {
		form
			.validateFields()
			.then(async (values) => {
				// Prepare bank details from settings
				const bankDetails: IBankDetails = {
					bankName: settings?.bankDetails?.bankName || "",
					branch: settings?.bankDetails?.branchName || "",
					accountNumber: settings?.bankDetails?.accountNumber || "",
					ifscCode: settings?.bankDetails?.ifscCode || ""
				};

				const billingData: IBillingRequest = {
					companyName: companyName.trim(),
					vehicleIds: selectedVehicleIds,
					billingDate: billingDate || new Date(), // Keep as Date object for API
					recipientName: values.recipientName,
					recipientAddress: values.recipientAddress,
					workingTime: values.workingTime,
					period: values.period,
					projectLocation: values.projectLocation,
					placeOfSupply: values.placeOfSupply,
					billingItems: values.billingItems,
					bankDetails
				};

				createBillingMutation.mutate(billingData, {
					onSuccess: () => {
						// Navigate back to the invoice list page after successful creation
						message.success("Invoice created successfully!");
						router.push("/invoice");
					}
				});
			})
			.catch((errorInfo) => {
				console.log("Validation failed:", errorInfo);
				message.error("Please fill in all required fields");
			});
	};

	// Get selected vehicles for preview
	const selectedVehicles = vehicles.filter((vehicle) =>
		selectedVehicleIds.includes(vehicle._id)
	);

	if (isSettingsLoading || isVehiclesLoading) {
		return (
			<div style={{ padding: "24px", textAlign: "center" }}>
				<Spin size="large" />
				<p>Loading invoice data...</p>
			</div>
		);
	}

	// Render preview view
	if (view === "preview" && previewData) {
		return (
			<div>
				<Space style={{ marginBottom: 16 }}>
					<Button type="default" onClick={showForm}>
						Back to Form
					</Button>
					<Button
						type="primary"
						onClick={saveBillingToAPI}
						loading={createBillingMutation.isPending}
					>
						Save Invoice
					</Button>
				</Space>
				<InvoicePreview
					visible={true}
					onClose={showForm}
					formData={previewData}
					selectedVehicles={selectedVehicles}
					companyName={companyName}
					billingDate={billingDate}
					settings={settings}
				/>
			</div>
		);
	}

	// Render form view
	return (
		<div>
			<Form
				form={form}
				layout="vertical"
				initialValues={{
					recipientName: "",
					recipientAddress: "",
					projectLocation: "",
					workingTime: "",
					period: "",
					placeOfSupply: "Maharashtra",
					billingItems: [
						{
							description: "",
							hsnSac: "996601",
							unit: "Day",
							quantity: 1,
							rate: 0
						}
					]
				}}
			>
				{/* Company and Vehicle Selection */}
				<Row gutter={16}>
					<Col xs={24} sm={12} md={8}>
						<Form.Item
							label="Company Name"
							name="companyName"
							rules={[{ required: true, message: "Please enter company name" }]}
						>
							<Input
								value={companyName}
								onChange={(e) => setCompanyName(e.target.value)}
								placeholder="Enter company name"
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={12} md={8}>
						<Form.Item
							label="Select Vehicles"
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
								placeholder="Select vehicles"
								value={selectedVehicleIds}
								onChange={handleVehicleChange}
								showSearch
								optionFilterProp="label"
								filterOption={(input, option) =>
									(option?.label?.toString().toLowerCase() ?? "").includes(
										input.toLowerCase()
									)
								}
								getPopupContainer={(trigger) =>
									trigger.parentElement || document.body
								} // Fix for large screen date picker
							>
								{vehicles.map((vehicle) => (
									<Option
										key={vehicle._id}
										value={vehicle._id}
										label={`${vehicle.vehicleNumber} (${vehicle.vehicleType})`}
									>
										{vehicle.vehicleNumber} ({vehicle.vehicleType})
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col xs={24} sm={12} md={8}>
						<Form.Item label="Billing Date" name="billingDate">
							<DatePicker
								style={{ width: "100%" }}
								onChange={(date) => setBillingDate(date ? date.toDate() : null)}
								placeholder="Select billing date"
								value={billingDate ? dayjs(billingDate) : null}
								getPopupContainer={(trigger) =>
									trigger.parentElement || document.body
								} // Fix for large screen date picker
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}></Row>

				<Divider>Recipient Details</Divider>

				<Row gutter={16}>
					<Col xs={24} sm={12} md={12}>
						<Form.Item
							label="Recipient Name"
							name="recipientName"
							rules={[
								{ required: true, message: "Please enter recipient name" }
							]}
						>
							<Input placeholder="Enter recipient name" />
						</Form.Item>
					</Col>
					<Col xs={24} sm={12} md={12}>
						<Form.Item
							label="Working Time"
							name="workingTime"
							rules={[{ required: true, message: "Please enter working time" }]}
						>
							<Input placeholder="e.g., Two Days" />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col xs={24} sm={12} md={12}>
						<Form.Item
							label="Period"
							name="period"
							rules={[{ required: true, message: "Please enter period" }]}
						>
							<Input placeholder="e.g., September 2025" />
						</Form.Item>
					</Col>
					<Col xs={24} sm={12} md={12}>
						<Form.Item
							label="Place of Supply"
							name="placeOfSupply"
							rules={[
								{ required: true, message: "Please enter place of supply" }
							]}
						>
							<Input placeholder="e.g., Maharashtra" />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col xs={24} md={12}>
						<Form.Item
							label="Recipient Address"
							name="recipientAddress"
							rules={[
								{ required: true, message: "Please enter recipient address" }
							]}
						>
							<TextArea rows={3} placeholder="Enter recipient address" />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							label="Project Location"
							name="projectLocation"
							rules={[
								{ required: true, message: "Please enter project location" }
							]}
						>
							<TextArea rows={3} placeholder="Enter project location" />
						</Form.Item>
					</Col>
				</Row>
				<Divider>Billing Items</Divider>

				<Form.List name="billingItems">
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name, ...restField }) => (
								<Card
									key={key}
									size="small"
									title={`Item ${name + 1}`}
									extra={
										fields.length > 1 && (
											<Button type="link" danger onClick={() => remove(name)}>
												Remove
											</Button>
										)
									}
									style={{ marginBottom: 16 }}
								>
									<Row gutter={16}>
										<Col xs={24}>
											<Form.Item
												{...restField}
												name={[name, "description"]}
												label="Description"
												rules={[
													{
														required: true,
														message: "Please enter description"
													}
												]}
											>
												<TextArea
													rows={2}
													placeholder="Enter service description"
												/>
											</Form.Item>
										</Col>
									</Row>

									<Row gutter={16}>
										<Col xs={24} sm={6}>
											<Form.Item
												{...restField}
												name={[name, "hsnSac"]}
												label="HSN/SAC"
												rules={[
													{ required: true, message: "Please enter HSN/SAC" }
												]}
											>
												<Input placeholder="e.g., 996601" />
											</Form.Item>
										</Col>
										<Col xs={24} sm={6}>
											<Form.Item
												{...restField}
												name={[name, "unit"]}
												label="Unit"
												rules={[
													{ required: true, message: "Please enter unit" }
												]}
											>
												<Input placeholder="e.g., Day" />
											</Form.Item>
										</Col>
										<Col xs={24} sm={6}>
											<Form.Item
												{...restField}
												name={[name, "quantity"]}
												label="Quantity"
												rules={[
													{ required: true, message: "Please enter quantity" }
												]}
											>
												<InputNumber
													style={{ width: "100%" }}
													min={0.01}
													step={0.01}
													placeholder="Enter quantity"
												/>
											</Form.Item>
										</Col>
										<Col xs={24} sm={6}>
											<Form.Item
												{...restField}
												name={[name, "rate"]}
												label="Rate"
												rules={[
													{ required: true, message: "Please enter rate" }
												]}
											>
												<InputNumber
													style={{ width: "100%" }}
													min={0.01}
													step={0.01}
													placeholder="Enter rate"
												/>
											</Form.Item>
										</Col>
									</Row>

									<Row gutter={16}></Row>
								</Card>
							))}

							<Form.Item>
								<Button
									type="dashed"
									onClick={() => add()}
									style={{ width: "100%" }}
								>
									+ Add Another Item
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>

				<Divider />

				<Row gutter={16}>
					<Col>
						<Button type="default" onClick={showPreview}>
							Preview Invoice
						</Button>
						<Button
							type="primary"
							onClick={saveBillingToAPI}
							loading={createBillingMutation.isPending}
							style={{ marginLeft: "10px" }}
						>
							{createBillingMutation.isPending ? "Saving..." : "Save Invoice"}
						</Button>
					</Col>
				</Row>
			</Form>
		</div>
	);
};

export default InvoiceGenerator;
