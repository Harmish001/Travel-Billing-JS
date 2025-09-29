import React, { useState, useEffect } from "react";
import { Button, Space, Input, InputNumber, message, Spin, Select, DatePicker } from "antd";
import { useCreateBilling } from "@/src/hooks/billingHook";
import { useSettings } from "@/src/hooks/settingsHook";
import { useVehicles } from "@/src/hooks/vehicleHook";
import { IBillingRequest, IBillingItem, IBankDetails } from "@/src/types/iBilling";
import { Settings } from "@/src/types/iSettings";
import { Vehicle } from "@/src/types/iVehicle";
import { useRouter } from "next/navigation";
import InvoicePreview from "./InvoicePreview"; // Import the new preview component

const { TextArea } = Input;
const { Option } = Select;

interface InvoiceFormData {
	recipientName: string;
	recipientAddress: string;
	projectLocation: string;
	workingTime: string;
	period: string;
	placeOfSupply: string;
	description: string;
	hsnSac: string;
	unit: string;
	billingItems: Array<{
		description: string;
		hsnSac: string;
		unit: string;
		quantity: number;
		rate: number;
	}>;
}

export const InvoiceGenerator: React.FC = () => {
	const router = useRouter();
	// Fetch settings data
	const { data: settingsData, isLoading: isSettingsLoading } = useSettings();
	const settings: Settings | null = settingsData?.data || null;

	// Fetch vehicles data
	const { data: vehiclesData, isLoading: isVehiclesLoading } = useVehicles();
	const vehicles = vehiclesData?.data?.vehicles || [];

	const [formData, setFormData] = useState<InvoiceFormData>({
		recipientName: "",
		recipientAddress: "",
		projectLocation: "",
		workingTime: "",
		period: "",
		placeOfSupply: "",
		description: "",
		hsnSac: "996601",
		unit: "Day",
		billingItems: [
			{
				description: "",
				hsnSac: "996601",
				unit: "Day",
				quantity: 1,
				rate: 0
			}
		]
	});

	const [companyName, setCompanyName] = useState<string>("");
	const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
	const [billingDate, setBillingDate] = useState<Date | null>(null);
	const [isPreviewVisible, setIsPreviewVisible] = useState(false);

	// API integration
	const createBillingMutation = useCreateBilling();

	// Set default values from settings when they load
	useEffect(() => {
		if (settings) {
			setCompanyName(settings.companyName || "");
		}
	}, [settings]);

	const handleInputChange = (
		field: keyof InvoiceFormData,
		value: string
	) => {
		setFormData((prev) => ({
			...prev,
			[field]: value
		}));
	};

	const handleBillingItemChange = (
		index: number,
		field: keyof IBillingItem,
		value: string | number
	) => {
		setFormData((prev) => {
			const updatedItems = [...prev.billingItems];
			updatedItems[index] = {
				...updatedItems[index],
				[field]: value
			};
			return {
				...prev,
				billingItems: updatedItems
			};
		});
	};

	const addBillingItem = () => {
		setFormData((prev) => ({
			...prev,
			billingItems: [
				...prev.billingItems,
				{
					description: "",
					hsnSac: "996601",
					unit: "Day",
					quantity: 1,
					rate: 0
				}
			]
		}));
	};

	const removeBillingItem = (index: number) => {
		if (formData.billingItems.length <= 1) {
			message.warning("At least one billing item is required");
			return;
		}
		
		setFormData((prev) => {
			const updatedItems = [...prev.billingItems];
			updatedItems.splice(index, 1);
			return {
				...prev,
				billingItems: updatedItems
			};
		});
	};

	const handleVehicleChange = (vehicleIds: string[]) => {
		setSelectedVehicleIds(vehicleIds);
	};

	// Function to show preview
	const showPreview = () => {
		if (!validateForm()) return;
		setIsPreviewVisible(true);
	};

	// Function to hide preview
	const hidePreview = () => {
		setIsPreviewVisible(false);
	};

	const validateForm = (): boolean => {
		if (!companyName.trim()) {
			message.error("Company name is required");
			return false;
		}
		if (selectedVehicleIds.length === 0) {
			message.error("At least one vehicle must be selected");
			return false;
		}
		if (!formData.recipientName.trim()) {
			message.error("Recipient name is required");
			return false;
		}
		if (!formData.recipientAddress.trim()) {
			message.error("Recipient address is required");
			return false;
		}
		if (!formData.workingTime.trim()) {
			message.error("Working time is required");
			return false;
		}
		if (!formData.period.trim()) {
			message.error("Period is required");
			return false;
		}
		if (!formData.projectLocation.trim()) {
			message.error("Project location is required");
			return false;
		}
		if (!formData.placeOfSupply.trim()) {
			message.error("Place of supply is required");
			return false;
		}
		
		// Validate billing items
		for (let i = 0; i < formData.billingItems.length; i++) {
			const item = formData.billingItems[i];
			if (!item.description.trim()) {
				message.error(`Description is required for item ${i + 1}`);
				return false;
			}
			if (item.quantity <= 0) {
				message.error(`Quantity must be greater than 0 for item ${i + 1}`);
				return false;
			}
			if (item.rate <= 0) {
				message.error(`Rate must be greater than 0 for item ${i + 1}`);
				return false;
			}
		}
		
		return true;
	};

	const saveBillingToAPI = async () => {
		if (!validateForm()) return;

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
			billingDate: billingDate || new Date(),
			recipientName: formData.recipientName,
			recipientAddress: formData.recipientAddress,
			workingTime: formData.workingTime,
			period: formData.period,
			projectLocation: formData.projectLocation,
			placeOfSupply: formData.placeOfSupply,
			billingItems: formData.billingItems,
			bankDetails
		};

		createBillingMutation.mutate(billingData, {
			onSuccess: () => {
				// Navigate back to the invoice list page after successful creation
				message.success("Invoice created successfully!");
				router.push("/invoice");
			}
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

	return (
		<div
			style={{
				display: "flex",
				gap: "20px",
				padding: "20px",
				fontFamily: "Arial, sans-serif",
				flexWrap: "wrap"
			}}
		>
			{/* Form Section */}
			<div
				style={{
					flex: "1",
					minWidth: "300px",
					borderRadius: 16
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: "20px"
					}}
				>
					<h2 style={{ color: "#333" }}>Invoice Generator</h2>
					<Button
						type="primary"
						onClick={showPreview}
						disabled={!companyName.trim() || selectedVehicleIds.length === 0}
					>
						Preview
					</Button>
				</div>

				{/* API Required Fields */}
				<div style={{ marginBottom: "15px" }}>
					<label
						style={{
							display: "block",
							marginBottom: "5px",
							fontWeight: "bold",
							color: "#d32f2f"
						}}
					>
						Company Name (Required for API):
					</label>
					<Input
						value={companyName}
						onChange={(e) => setCompanyName(e.target.value)}
						placeholder="Enter company name"
					/>
				</div>

				<div style={{ marginBottom: "15px" }}>
					<label
						style={{
							display: "block",
							marginBottom: "5px",
							fontWeight: "bold",
							color: "#d32f2f"
						}}
					>
						Select Vehicles (Required for API):
					</label>
					<Select
						mode="multiple"
						placeholder="Select vehicles"
						value={selectedVehicleIds}
						onChange={handleVehicleChange}
						style={{ width: "100%" }}
						showSearch
						optionFilterProp="label"
						filterOption={(input, option) =>
							(option?.label?.toString().toLowerCase() ?? "").includes(
								input.toLowerCase()
							)
						}
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
				</div>

				<div style={{ marginBottom: "15px" }}>
					<label
						style={{
							display: "block",
							marginBottom: "5px",
							fontWeight: "bold"
						}}
					>
						Billing Date:
					</label>
					<DatePicker
						style={{ width: "100%" }}
						onChange={(date) => setBillingDate(date ? date.toDate() : null)}
					/>
				</div>

				<div style={{ marginBottom: "15px" }}>
					<label
						style={{
							display: "block",
							marginBottom: "5px",
							fontWeight: "bold"
						}}
					>
						Recipient Name:
					</label>
					<Input
						value={formData.recipientName}
						onChange={(e) => handleInputChange("recipientName", e.target.value)}
						placeholder="Enter recipient name"
					/>
				</div>

				<div style={{ marginBottom: "15px" }}>
					<label
						style={{
							display: "block",
							marginBottom: "5px",
							fontWeight: "bold"
						}}
					>
						Recipient Address:
					</label>
					<TextArea
						value={formData.recipientAddress}
						onChange={(e) =>
							handleInputChange("recipientAddress", e.target.value)
						}
						rows={3}
						placeholder="Enter recipient address"
					/>
				</div>

				<div style={{ marginBottom: "15px" }}>
					<label
						style={{
							display: "block",
							marginBottom: "5px",
							fontWeight: "bold"
						}}
					>
						Working Time:
					</label>
					<Input
						value={formData.workingTime}
						onChange={(e) => handleInputChange("workingTime", e.target.value)}
						placeholder="e.g., Two Days"
					/>
				</div>

				<div style={{ marginBottom: "15px" }}>
					<label
						style={{
							display: "block",
							marginBottom: "5px",
							fontWeight: "bold"
						}}
					>
						Period:
					</label>
					<Input
						value={formData.period}
						onChange={(e) => handleInputChange("period", e.target.value)}
						placeholder="e.g., September 2025"
					/>
				</div>

				<div style={{ marginBottom: "15px" }}>
					<label
						style={{
							display: "block",
							marginBottom: "5px",
							fontWeight: "bold"
						}}
					>
						Project Location:
					</label>
					<TextArea
						value={formData.projectLocation}
						onChange={(e) =>
							handleInputChange("projectLocation", e.target.value)
						}
						rows={3}
						placeholder="Enter project location"
					/>
				</div>

				<div style={{ marginBottom: "15px" }}>
					<label
						style={{
							display: "block",
							marginBottom: "5px",
							fontWeight: "bold"
						}}
					>
						Place of Supply:
					</label>
					<Input
						value={formData.placeOfSupply}
						onChange={(e) => handleInputChange("placeOfSupply", e.target.value)}
						placeholder="e.g., Maharashtra"
					/>
				</div>

				{/* Billing Items Section */}
				<div style={{ marginBottom: "20px" }}>
					<h3 style={{ color: "#333", marginBottom: "15px" }}>Billing Items</h3>
					{formData.billingItems.map((item, index) => (
						<div 
							key={index} 
							style={{ 
								border: "1px solid #e0e0e0", 
								borderRadius: "8px", 
								padding: "15px", 
								marginBottom: "15px",
								backgroundColor: "#fafafa"
							}}
						>
							<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
								<h4 style={{ margin: 0 }}>Item {index + 1}</h4>
								{formData.billingItems.length > 1 && (
									<Button 
										type="link" 
										danger
										onClick={() => removeBillingItem(index)}
									>
										Remove
									</Button>
								)}
							</div>
							
							<div style={{ marginBottom: "10px" }}>
								<label
									style={{
										display: "block",
										marginBottom: "5px",
										fontWeight: "bold"
									}}
								>
									Description:
								</label>
								<TextArea
									value={item.description}
									onChange={(e) =>
										handleBillingItemChange(index, "description", e.target.value)
									}
									rows={2}
									placeholder="Enter service description"
								/>
							</div>
							
							<div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
								<div style={{ flex: 1 }}>
									<label
										style={{
											display: "block",
											marginBottom: "5px",
											fontWeight: "bold"
										}}
									>
										HSN/SAC:
									</label>
									<Input
										value={item.hsnSac}
										onChange={(e) =>
											handleBillingItemChange(index, "hsnSac", e.target.value)
										}
										placeholder="e.g., 996601"
									/>
								</div>
								
								<div style={{ flex: 1 }}>
									<label
										style={{
											display: "block",
											marginBottom: "5px",
											fontWeight: "bold"
										}}
									>
										Unit:
									</label>
									<Input
										value={item.unit}
										onChange={(e) =>
											handleBillingItemChange(index, "unit", e.target.value)
										}
										placeholder="e.g., Day"
									/>
								</div>
							</div>
							
							<div style={{ display: "flex", gap: "10px" }}>
								<div style={{ flex: 1 }}>
									<label
										style={{
											display: "block",
											marginBottom: "5px",
											fontWeight: "bold"
										}}
									>
										Quantity:
									</label>
									<InputNumber
										value={item.quantity}
										onChange={(value) => 
											handleBillingItemChange(index, "quantity", value || 0)
										}
										style={{ width: "100%" }}
										min={0.01}
										step={0.01}
									/>
								</div>
								
								<div style={{ flex: 1 }}>
									<label
										style={{
											display: "block",
											marginBottom: "5px",
											fontWeight: "bold"
										}}
									>
										Rate:
									</label>
									<InputNumber
										value={item.rate}
										onChange={(value) => 
											handleBillingItemChange(index, "rate", value || 0)
										}
										style={{ width: "100%" }}
										min={0.01}
										step={0.01}
									/>
								</div>
							</div>
						</div>
					))}
					
					<Button 
						type="dashed" 
						onClick={addBillingItem}
						style={{ width: "100%", marginBottom: "15px" }}
					>
						+ Add Another Item
					</Button>
				</div>

				<div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
					<div style={{ display: "flex", gap: "10px" }}>
						<Button
							onClick={saveBillingToAPI}
							loading={createBillingMutation.isPending}
							type="primary"
							style={{
								flex: 1,
								padding: "10px 20px",
								borderRadius: "4px"
							}}
						>
							{createBillingMutation.isPending ? (
								<Space>
									<Spin />
									Saving...
								</Space>
							) : (
								"Save Invoice to Database"
							)}
						</Button>
					</div>
				</div>
			</div>

			{/* Invoice Preview Component */}
			<InvoicePreview
				visible={isPreviewVisible}
				onClose={hidePreview}
				formData={formData}
				selectedVehicles={selectedVehicles}
				companyName={companyName}
				billingDate={billingDate}
				settings={settings}
			/>
		</div>
	);
};

export default InvoiceGenerator;