import React, { useState, useEffect } from "react";
import { Button, Space, Input, InputNumber, message, Spin, Select } from "antd";
import { useCreateBilling } from "@/src/hooks/billingHook";
import { useSettings } from "@/src/hooks/settingsHook";
import { useVehicles } from "@/src/hooks/vehicleHook";
import { IBillingRequest } from "@/src/types/iBilling";
import { Settings } from "@/src/types/iSettings";
import { Vehicle } from "@/src/types/iVehicle";
import { useRouter } from "next/navigation";
import InvoicePreview from "./InvoicePreview"; // Import the new preview component

const { TextArea } = Input;
const { Option } = Select;

interface InvoiceData {
	recipientName: string;
	recipientAddress: string;
	projectLocation: string;
	workingTime: string;
	period: string;
	quantity: number;
	rate: number;
	description: string;
	invoiceNo: string;
	invoiceDate: string;
	supplierGstin: string;
	supplierPan: string;
	taxInvoiceNo: string;
	hsnSac: string;
	unit: string;
}

export const InvoiceGenerator: React.FC = () => {
	const router = useRouter();
	// Fetch settings data
	const { data: settingsData } = useSettings();
	const settings: Settings | null = settingsData?.data || null;

	// Fetch vehicles data
	const { data: vehiclesData } = useVehicles();
	const vehicles = vehiclesData?.data?.vehicles || [];

	const [invoiceData, setInvoiceData] = useState<InvoiceData>({
		recipientName: "",
		recipientAddress: "",
		projectLocation: "",
		workingTime: "",
		period: "",
		quantity: 2,
		rate: 10500,
		description: "",
		invoiceNo: "SAI/",
		invoiceDate: "",
		supplierGstin: settings?.gstNumber || "",
		supplierPan: settings?.panNumber || "",
		taxInvoiceNo: "SAI/",
		hsnSac: "996601",
		unit: "TRIP"
	});

	// API integration
	const createBillingMutation = useCreateBilling();
	const [companyName, setCompanyName] = useState<string>(
		settingsData?.data?.companyName || ""
	);
	const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
	const [isPreviewVisible, setIsPreviewVisible] = useState(false); // State for preview visibility

	const handleInputChange = (
		field: keyof InvoiceData,
		value: string | number
	) => {
		setInvoiceData((prev) => ({
			...prev,
			[field]: value
		}));
	};

	const handleVehicleChange = (vehicleIds: string[]) => {
		setSelectedVehicleIds(vehicleIds);
	};

	const calculateSubtotal = () => invoiceData.quantity * invoiceData.rate;
	const calculateGst = () => Math.round(calculateSubtotal() * 0.09);
	const calculateTotal = () => calculateSubtotal() + calculateGst() * 2;

	// Function to show preview
	const showPreview = () => {
		if (!companyName.trim()) {
			message.error("Please enter company name");
			return;
		}
		if (selectedVehicleIds.length === 0) {
			message.error("Please select at least one vehicle");
			return;
		}
		setIsPreviewVisible(true);
	};

	// Function to hide preview
	const hidePreview = () => {
		setIsPreviewVisible(false);
	};

	const saveBillingToAPI = async () => {
		if (!companyName.trim()) {
			message.error("Please enter company name");
			return;
		}
		if (selectedVehicleIds.length === 0) {
			message.error("Please select at least one vehicle");
			return;
		}

		const billingData: IBillingRequest = {
			companyName: companyName.trim(),
			vehicleIds: selectedVehicleIds,
			recipientName: invoiceData.recipientName,
			recipientAddress: invoiceData.recipientAddress,
			workingTime: invoiceData.workingTime,
			hsnCode: invoiceData.hsnSac,
			quantity: invoiceData.quantity,
			rate: invoiceData.rate
		};

		createBillingMutation.mutate(billingData, {
			onSuccess: () => {
				// Navigate back to the invoice list page after successful creation
				router.push("/invoice");
			}
		});
	};

	// Get selected vehicles for preview
	const selectedVehicles = vehicles.filter((vehicle) =>
		selectedVehicleIds.includes(vehicle._id)
	);

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
						Recipient Name:
					</label>
					<Input
						value={invoiceData.recipientName}
						onChange={(e) => handleInputChange("recipientName", e.target.value)}
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
						value={invoiceData.recipientAddress}
						onChange={(e) =>
							handleInputChange("recipientAddress", e.target.value)
						}
						rows={3}
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
						value={invoiceData.projectLocation}
						onChange={(e) =>
							handleInputChange("projectLocation", e.target.value)
						}
						rows={3}
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
						value={invoiceData.workingTime}
						onChange={(e) => handleInputChange("workingTime", e.target.value)}
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
					<TextArea
						value={invoiceData.period}
						onChange={(e) => handleInputChange("period", e.target.value)}
						rows={3}
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
						Description:
					</label>
					<TextArea
						value={invoiceData.description}
						onChange={(e) => handleInputChange("description", e.target.value)}
						rows={3}
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
						Quantity:
					</label>
					<InputNumber
						value={invoiceData.quantity}
						onChange={(value) => handleInputChange("quantity", value || 0)}
						style={{ width: "100%" }}
						min={0}
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
						Rate:
					</label>
					<InputNumber
						value={invoiceData.rate}
						onChange={(value) => handleInputChange("rate", value || 0)}
						style={{ width: "100%" }}
						min={0}
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
						Invoice No:
					</label>
					<Input
						value={invoiceData.invoiceNo}
						onChange={(e) => handleInputChange("invoiceNo", e.target.value)}
					/>
				</div>

				<div style={{ marginBottom: "20px" }}>
					<label
						style={{
							display: "block",
							marginBottom: "5px",
							fontWeight: "bold"
						}}
					>
						Invoice Date:
					</label>
					<Input
						value={invoiceData.invoiceDate}
						onChange={(e) => handleInputChange("invoiceDate", e.target.value)}
					/>
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
				invoiceData={invoiceData}
				selectedVehicles={selectedVehicles}
				companyName={companyName}
			/>
		</div>
	);
};

export default InvoiceGenerator;
