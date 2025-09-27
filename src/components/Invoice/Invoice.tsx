import React, { useState } from "react";
import { Button, Space, Input, InputNumber, message, Spin } from "antd";
import { useCreateBilling } from "@/src/hooks/billingHook";
import { IBillingRequest } from "@/src/types/iBilling";

const { TextArea } = Input;

interface InvoiceData {
	vehicleType: string;
	vehicleNo: string;
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
	const [invoiceData, setInvoiceData] = useState<InvoiceData>({
		vehicleType: "TEMPO TRAVELER",
		vehicleNo: "GJ-05-BV-6417 & GJ-05-BZ-8082",
		recipientName: "SNEHA",
		recipientAddress: "NAGAPATTINAM\nTAMILNADU",
		projectLocation: "SNEHA\nNAGAPATTINAM\nTAMILNADU",
		workingTime: "ONE DAY",
		period: "5/26/2025\nTO\n5/27/2025",
		quantity: 2,
		rate: 10500,
		description: "Hiring Charges for Car\nTEMPO TRAVELER\nTEMPO TRAVELER",
		invoiceNo: "SAI/46/25-26",
		invoiceDate: "27.09.2025",
		supplierGstin: "24ELVPV5086R1ZB",
		supplierPan: "ELVPV5086R",
		taxInvoiceNo: "SAI/46/25-26",
		hsnSac: "996601",
		unit: "TRIP"
	});

	// API integration
	const createBillingMutation = useCreateBilling();
	const [companyName, setCompanyName] = useState<string>("");
	const [vehicleId, setVehicleId] = useState<string>("");

	const handleInputChange = (
		field: keyof InvoiceData,
		value: string | number
	) => {
		setInvoiceData((prev) => ({
			...prev,
			[field]: value
		}));
	};

	const calculateSubtotal = () => invoiceData.quantity * invoiceData.rate;
	const calculateGst = () => Math.round(calculateSubtotal() * 0.09);
	const calculateTotal = () => calculateSubtotal() + calculateGst() * 2;

	const exportToPDF = async () => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const html2canvas = ((await import("html2canvas")) as any).default;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const jsPDF = ((await import("jspdf")) as any).jsPDF;

			const element = document.getElementById("invoice-preview");
			if (element) {
				const canvas = await html2canvas(element, { scale: 2 });
				const imgData = canvas.toDataURL("image/png");
				const pdf = new jsPDF("p", "mm", "a4");
				const imgWidth = 210;
				const pageHeight = 295;
				const imgHeight = (canvas.height * imgWidth) / canvas.width;
				let heightLeft = imgHeight;
				let position = 0;

				pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
				heightLeft -= pageHeight;

				while (heightLeft >= 0) {
					position = heightLeft - imgHeight;
					pdf.addPage();
					pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
					heightLeft -= pageHeight;
				}

				pdf.save(`invoice-${invoiceData.invoiceNo}.pdf`);
			}
		} catch (error) {
			console.error("Error exporting PDF:", error);
		}
	};

	const exportToExcel = async () => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const XLSX = (await import("xlsx")) as any;

			const data = [
				["SAI TRAVELS"],
				["(PROP. RUJALVIMALBHAI PATEL)"],
				[
					"A - 402, SANT SHIRE ASHRAMJI COMPLEX, NR. SARITA DAIRY, HONEY PARK ROAD, ADAJAN, SURAT - 395009"
				],
				["MOBILE NO. 7041168505"],
				[""],
				["SUPPLIER'S GSTN:", invoiceData.supplierGstin],
				["SUPPLIER'S PAN:", invoiceData.supplierPan],
				[
					"TAX INVOICE NO.:",
					invoiceData.taxInvoiceNo,
					"INVOICE Date:",
					invoiceData.invoiceDate
				],
				[""],
				[
					"Recipient Name & Address",
					"",
					"Type of Vehicle",
					invoiceData.vehicleType
				],
				["TO,", "", "Vehicle No.", invoiceData.vehicleNo],
				[
					invoiceData.recipientName,
					"",
					"Working Time",
					invoiceData.workingTime
				],
				[invoiceData.recipientAddress, "", "Period", invoiceData.period],
				[""],
				["Project Location"],
				["TO,"],
				[invoiceData.projectLocation],
				[""],
				[
					"Sr. No.",
					"DESCRIPTION",
					"HSN\\SAC",
					"UNIT",
					"QTY.",
					"RATE",
					"TOTAL AMOUNT"
				],
				[
					"1",
					invoiceData.description,
					invoiceData.hsnSac,
					invoiceData.unit,
					invoiceData.quantity,
					invoiceData.rate,
					calculateSubtotal()
				],
				["", "", "", "", "", "SGST 9%", calculateGst()],
				["", "", "", "", "", "CGST 9%", calculateGst()],
				["", "", "", "", "", "IGST 18%", 0],
				["", "", "", "", "", "Total Invoice Value in Rs.", calculateTotal()],
				["RUPEES FOURTY THOUSAND ONE HUNDRED TWENTY ONLY"]
			];

			const worksheet = XLSX.utils.aoa_to_sheet(data);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, "Invoice");
			XLSX.writeFile(workbook, `invoice-${invoiceData.invoiceNo}.xlsx`);
		} catch (error) {
			console.error("Error exporting Excel:", error);
		}
	};

	const saveBillingToAPI = async () => {
		if (!companyName.trim()) {
			message.error("Please enter company name");
			return;
		}
		if (!vehicleId.trim()) {
			message.error("Please enter vehicle ID");
			return;
		}

		const billingData: IBillingRequest = {
			companyName: companyName.trim(),
			vehicleId: vehicleId.trim(),
			recipientName: invoiceData.recipientName,
			recipientAddress: invoiceData.recipientAddress,
			workingTime: invoiceData.workingTime,
			hsnCode: invoiceData.hsnSac,
			quantity: invoiceData.quantity,
			rate: invoiceData.rate
		};

		createBillingMutation.mutate(billingData);
	};

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
				<h2 style={{ marginBottom: "20px", color: "#333" }}>
					Invoice Generator
				</h2>

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
						Vehicle ID (Required for API):
					</label>
					<Input
						value={vehicleId}
						onChange={(e) => setVehicleId(e.target.value)}
						placeholder="Enter vehicle ID (MongoDB ObjectId)"
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
						Vehicle Type:
					</label>
					<Input
						value={invoiceData.vehicleType}
						onChange={(e) => handleInputChange("vehicleType", e.target.value)}
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
						Vehicle No:
					</label>
					<Input
						value={invoiceData.vehicleNo}
						onChange={(e) => handleInputChange("vehicleNo", e.target.value)}
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
							onClick={exportToPDF}
							type="primary"
							style={{
								flex: 1,
								padding: "10px 20px",
								borderRadius: "4px"
							}}
						>
							Export as PDF
						</Button>
						<Button
							onClick={exportToExcel}
							style={{
								flex: 1,
								padding: "10px 20px",
								borderRadius: "4px"
							}}
						>
							Export as Excel
						</Button>
					</div>
					<Button
						onClick={saveBillingToAPI}
						loading={createBillingMutation.isPending}
						type="default"
						style={{
							width: "100%",
							padding: "10px 20px",
							borderRadius: "4px",
							backgroundColor: "#52c41a",
							color: "white",
							borderColor: "#52c41a"
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

			{/* Invoice Preview Section */}
			<div style={{ flex: "1", minWidth: "400px" }}>
				<div
					id="invoice-preview"
					style={{
						backgroundColor: "white",
						border: "2px solid #000",
						padding: "20px",
						fontFamily: "Arial, sans-serif",
						fontSize: "12px"
					}}
				>
					{/* Header */}
					<table
						style={{
							width: "100%",
							borderCollapse: "collapse",
							marginBottom: "10px"
						}}
					>
						<tbody>
							<tr>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										textAlign: "center",
										fontSize: "18px",
										fontWeight: "bold",
										backgroundColor: "#f0f0f0"
									}}
								>
									SAI TRAVELS
								</td>
							</tr>
							<tr>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										textAlign: "center",
										fontSize: "12px"
									}}
								>
									(PROP. RUJALVIMALBHAI PATEL)
								</td>
							</tr>
							<tr>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										textAlign: "center",
										fontSize: "10px"
									}}
								>
									A - 402, SANT SHIRE ASHRAMJI COMPLEX, NR. SARITA DAIRY, HONEY
									PARK ROAD, ADAJAN, SURAT - 395009
								</td>
							</tr>
							<tr>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										textAlign: "center",
										fontSize: "10px"
									}}
								>
									MOBILE NO. 7041168505
								</td>
							</tr>
						</tbody>
					</table>

					{/* GSTN and Invoice Details */}
					<table
						style={{
							width: "100%",
							borderCollapse: "collapse",
							marginBottom: "10px"
						}}
					>
						<tbody>
							<tr>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px"
									}}
								>
									ORIGINAL FOR
									<br />
									RECEIPT
								</td>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px"
									}}
								>
									SUPPLIER&apos;S GSTN:
									<br />
									SUPPLIER&apos;S PAN:
									<br />
									TAX INVOICE NO.:
								</td>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px"
									}}
								>
									{invoiceData.supplierGstin}
									<br />
									{invoiceData.supplierPan}
									<br />
									{invoiceData.taxInvoiceNo}
								</td>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px"
									}}
								>
									INVOICE Date: {invoiceData.invoiceDate}
								</td>
							</tr>
						</tbody>
					</table>

					{/* Recipient and Vehicle Details */}
					<table
						style={{
							width: "100%",
							borderCollapse: "collapse",
							marginBottom: "10px"
						}}
					>
						<tbody>
							<tr>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px",
										width: "50%"
									}}
								>
									<strong>Recipient Name & Address</strong>
									<br />
									TO,
									<br />
									{invoiceData.recipientName}
									<br />
									{invoiceData.recipientAddress.split("\n").map((line, i) => (
										<span key={i}>
											{line}
											<br />
										</span>
									))}
								</td>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px"
									}}
								>
									Type of Vehicle
									<br />
									Vehicle No.
									<br />
									Working Time
									<br />
									<br />
									Period
								</td>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px"
									}}
								>
									{invoiceData.vehicleType}
									<br />
									{invoiceData.vehicleNo}
									<br />
									{invoiceData.workingTime}
									<br />
									<br />
									{invoiceData.period.split("\n").map((line, i) => (
										<span key={i}>
											{line}
											<br />
										</span>
									))}
								</td>
							</tr>
						</tbody>
					</table>

					{/* Project Location */}
					<table
						style={{
							width: "100%",
							borderCollapse: "collapse",
							marginBottom: "10px"
						}}
					>
						<tbody>
							<tr>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px"
									}}
								>
									<strong>Project Location</strong>
									<br />
									TO,
									<br />
									{invoiceData.projectLocation.split("\n").map((line, i) => (
										<span key={i}>
											{line}
											<br />
										</span>
									))}
								</td>
							</tr>
						</tbody>
					</table>

					{/* Service Details */}
					<table
						style={{
							width: "100%",
							borderCollapse: "collapse",
							marginBottom: "10px"
						}}
					>
						<tbody>
							<tr>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px"
									}}
								>
									Place of Supply of Service : SURAT TO HAZIRA & SURAT TO DAHEJ
								</td>
							</tr>
						</tbody>
					</table>

					{/* Invoice Table */}
					<table
						style={{
							width: "100%",
							borderCollapse: "collapse",
							marginBottom: "10px"
						}}
					>
						<thead>
							<tr>
								<th
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px",
										backgroundColor: "#f0f0f0"
									}}
								>
									Sr. No.
								</th>
								<th
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px",
										backgroundColor: "#f0f0f0"
									}}
								>
									DESCRIPTION
								</th>
								<th
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px",
										backgroundColor: "#f0f0f0"
									}}
								>
									HSN \ SAC
								</th>
								<th
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px",
										backgroundColor: "#f0f0f0"
									}}
								>
									UNIT
								</th>
								<th
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px",
										backgroundColor: "#f0f0f0"
									}}
								>
									QTY.
								</th>
								<th
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px",
										backgroundColor: "#f0f0f0"
									}}
								>
									RATE
								</th>
								<th
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px",
										backgroundColor: "#f0f0f0"
									}}
								>
									TOTAL AMOUNT
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px",
										textAlign: "center"
									}}
								>
									1
								</td>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px"
									}}
								>
									{invoiceData.description.split("\n").map((line, i) => (
										<span key={i}>
											{line}
											<br />
										</span>
									))}
								</td>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px",
										textAlign: "center"
									}}
								>
									{invoiceData.hsnSac}
								</td>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px",
										textAlign: "center"
									}}
								>
									{invoiceData.unit}
								</td>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px",
										textAlign: "center"
									}}
								>
									{invoiceData.quantity}
								</td>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px",
										textAlign: "right"
									}}
								>
									{invoiceData.rate}
								</td>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px",
										textAlign: "right"
									}}
								>
									{calculateSubtotal()}
								</td>
							</tr>
							<tr>
								<td
									colSpan={6}
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px",
										textAlign: "right"
									}}
								>
									SGST 9%
								</td>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px",
										textAlign: "right"
									}}
								>
									{calculateGst()}
								</td>
							</tr>
							<tr>
								<td
									colSpan={6}
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px",
										textAlign: "right"
									}}
								>
									CGST 9%
								</td>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px",
										textAlign: "right"
									}}
								>
									{calculateGst()}
								</td>
							</tr>
							<tr>
								<td
									colSpan={6}
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px",
										textAlign: "right"
									}}
								>
									IGST 18%
								</td>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px",
										textAlign: "right"
									}}
								>
									0
								</td>
							</tr>
							<tr>
								<td
									colSpan={6}
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px",
										textAlign: "right",
										fontWeight: "bold"
									}}
								>
									Total Invoice Value in Rs.
								</td>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px",
										textAlign: "right",
										fontWeight: "bold"
									}}
								>
									{calculateTotal()}
								</td>
							</tr>
						</tbody>
					</table>

					{/* Total in Words */}
					<table
						style={{
							width: "100%",
							borderCollapse: "collapse",
							marginBottom: "10px"
						}}
					>
						<tbody>
							<tr>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px"
									}}
								>
									RUPEES FOURTY THOUSAND ONE HUNDRED TWENTY ONLY
								</td>
							</tr>
						</tbody>
					</table>

					{/* Bank Details */}
					<table
						style={{
							width: "100%",
							borderCollapse: "collapse",
							marginBottom: "10px"
						}}
					>
						<tbody>
							<tr>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px"
									}}
								>
									GST ON CASH TO REVERSE CHARGES BASIS WILL BE PAYABLE BY
									CONSIGNOR OR CONSIGNEE
									<br />
									RCM AS PER NOTIFICATION NO. 29/2018 CENTRAL TAX RATE ( RATE )
									DATED 31ST DEC,2018
								</td>
							</tr>
							<tr>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "10px"
									}}
								>
									<strong>BANK DETAILS :</strong>
									<br />
									BANK NAME : BANK OF BARODA
									<br />
									BRANCH : BHULKA BHAVAN
									<br />
									ACCOUNT NO. : 27380260001538
									<br />
									IFSC CODE : BARB0BHULKA ( FIFTH CHARACTER IS ZERO )
								</td>
								<td
									style={{
										border: "1px solid #000",
										padding: "5px",
										fontSize: "14px",
										textAlign: "center",
										color: "#6600cc"
									}}
								>
									FOR SAI TRAVELS
									<br />
									<span style={{ fontStyle: "italic", fontSize: "18px" }}>
										For Sai Travels
									</span>
									<br />
									<span style={{ fontSize: "12px" }}>R.J. Patel</span>
									<br />
									<span
										style={{
											fontWeight: "bold",
											fontSize: "16px",
											color: "#6600cc"
										}}
									>
										Proprietor
									</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default InvoiceGenerator;
