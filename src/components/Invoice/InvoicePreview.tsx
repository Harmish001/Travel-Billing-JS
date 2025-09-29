"use client";

import React from "react";
import { Button, Space, Drawer } from "antd";
import { 
	FilePdfOutlined, 
	FileExcelOutlined, 
	PrinterOutlined,
	CloseOutlined
} from "@ant-design/icons";
import { useSettings } from "@/src/hooks/settingsHook";
import { IBillingResponse } from "@/src/types/iBilling";
import { Settings } from "@/src/types/iSettings";
import { Vehicle } from "@/src/types/iVehicle";

interface InvoicePreviewProps {
	visible: boolean;
	onClose: () => void;
	formData?: {
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
	};
	selectedVehicles?: Vehicle[];
	companyName?: string;
	billingDate?: Date | null;
	settings?: Settings | null;
	existingInvoice?: IBillingResponse;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
	visible,
	onClose,
	formData,
	selectedVehicles = [],
	companyName,
	billingDate,
	settings: externalSettings,
	existingInvoice
}) => {
	const { data: settingsData } = useSettings();
	const settings: Settings | null = externalSettings || settingsData?.data || null;

	// Use existing invoice data if available, otherwise use form data
	const isExistingInvoice = !!existingInvoice;
	
	const displayData = isExistingInvoice ? {
		recipientName: existingInvoice.recipientName,
		recipientAddress: existingInvoice.recipientAddress,
		projectLocation: existingInvoice.projectLocation || existingInvoice.recipientAddress,
		workingTime: existingInvoice.workingTime,
		period: existingInvoice.period || "",
		placeOfSupply: existingInvoice.placeOfSupply || "",
		billingItems: existingInvoice.billingItems || [],
		invoiceDate: new Date(existingInvoice.createdAt).toLocaleDateString(),
		supplierGstin: settings?.gstNumber || "24ELVPV5086R1ZB",
		supplierPan: settings?.panNumber || "ELVPV5086R",
		taxInvoiceNo: existingInvoice._id || "INV-" + new Date().getTime()
	} : {
		recipientName: formData?.recipientName || "",
		recipientAddress: formData?.recipientAddress || "",
		projectLocation: formData?.projectLocation || "",
		workingTime: formData?.workingTime || "",
		period: formData?.period || "",
		placeOfSupply: formData?.placeOfSupply || "",
		billingItems: formData?.billingItems || [],
		invoiceDate: billingDate ? new Date(billingDate).toLocaleDateString() : new Date().toLocaleDateString(),
		supplierGstin: settings?.gstNumber || "24ELVPV5086R1ZB",
		supplierPan: settings?.panNumber || "ELVPV5086R",
		taxInvoiceNo: "INV-" + new Date().getTime()
	};

	const displayVehicles = isExistingInvoice ? 
		(existingInvoice.vehicleIds?.map(v => ({ 
			_id: v._id, 
			vehicleNumber: v.vehicleNumber,
			vehicleType: "Vehicle"
		})) || []) : 
		selectedVehicles;

	const calculateItemTotal = (quantity: number, rate: number) => {
		return Math.round(quantity * rate * 100) / 100;
	};

	const calculateSubtotal = () => {
		if (isExistingInvoice && existingInvoice) {
			return existingInvoice.totalInvoiceValue;
		}
		
		return displayData.billingItems.reduce((sum, item) => {
			return sum + calculateItemTotal(item.quantity, item.rate);
		}, 0);
	};

	const calculateGst = () => Math.round(calculateSubtotal() * 0.09);
	const calculateTotal = () => calculateSubtotal() + calculateGst() * 2;

	const handleExportPDF = async () => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const html2canvas = ((await import("html2canvas")) as any).default;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const jsPDF = ((await import("jspdf")) as any).jsPDF;

			const element = document.getElementById("invoice-preview-content");
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

				pdf.save(`invoice-${displayData?.taxInvoiceNo || "preview"}.pdf`);
			}
		} catch (error) {
			console.error("Error exporting PDF:", error);
		}
	};

	const handleExportExcel = async () => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const XLSX = (await import("xlsx")) as any;

			const vehicleInfo = displayVehicles.map(vehicle => 
				`${vehicle.vehicleNumber} (${vehicle.vehicleType})`
			).join(", ");

			// Create data rows for billing items
			const billingItemRows = displayData.billingItems.map((item, index) => [
				index + 1,
				item.description,
				item.hsnSac,
				item.unit,
				item.quantity,
				item.rate,
				calculateItemTotal(item.quantity, item.rate)
			]);

			const data = [
				[settings?.companyName || "SAI TRAVELS"],
				[`(PROP. ${settings?.proprietorName || "RUJALVIMALBHAI PATEL"})`],
				[
					settings?.companyAddress ||
						"A - 402, SANT SHIRE ASHRAMJI COMPLEX, NR. SARITA DAIRY, HONEY PARK ROAD, ADAJAN, SURAT - 395009"
				],
				["MOBILE NO.", settings?.contactNumber || "7041168505"],
				[""],
				["SUPPLIER'S GSTN:", displayData?.supplierGstin],
				["SUPPLIER'S PAN:", displayData?.supplierPan],
				[
					"TAX INVOICE NO.:",
					displayData?.taxInvoiceNo,
					"INVOICE Date:",
					displayData?.invoiceDate
				],
				[""],
				[
					"Recipient Name & Address",
					"",
					"Vehicles",
					vehicleInfo
				],
				["TO,", "", "Working Time", displayData?.workingTime],
				[
					displayData?.recipientName,
					"",
					"Period",
					displayData?.period
				],
				[displayData?.recipientAddress, "", "", ""],
				[""],
				["Project Location"],
				["TO,"],
				[displayData?.projectLocation],
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
				...billingItemRows,
				["", "", "", "", "", "SGST 9%", calculateGst()],
				["", "", "", "", "", "CGST 9%", calculateGst()],
				["", "", "", "", "", "IGST 18%", 0],
				["", "", "", "", "", "Total Invoice Value in Rs.", calculateTotal()],
				["RUPEES FOURTY THOUSAND ONE HUNDRED TWENTY ONLY"]
			];

			const worksheet = XLSX.utils.aoa_to_sheet(data);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, "Invoice");
			XLSX.writeFile(workbook, `invoice-${displayData?.taxInvoiceNo || "preview"}.xlsx`);
		} catch (error) {
			console.error("Error exporting Excel:", error);
		}
	};

	const handlePrint = () => {
		const element = document.getElementById("invoice-preview-content");
		if (element) {
			const printWindow = window.open("", "_blank");
			if (printWindow) {
				printWindow.document.write(`
					<html>
						<head>
							<title>Invoice Print</title>
							<style>
								body { 
									font-family: Arial, sans-serif; 
									margin: 20px;
									font-size: 12px;
								}
								table { 
									width: 100%; 
									border-collapse: collapse; 
									margin-bottom: 10px; 
								}
								td, th { 
									border: 1px solid #000; 
									padding: 5px; 
								}
								.text-center { text-align: center; }
								.text-right { text-align: right; }
								.font-bold { font-weight: bold; }
								.bg-gray { background-color: #f0f0f0; }
							</style>
						</head>
						<body>
							${element.innerHTML}
						</body>
					</html>
				`);
				printWindow.document.close();
				printWindow.focus();
				printWindow.print();
			}
		}
	};

	if (!displayData) {
		return null;
	}

	return (
		<Drawer
			title={
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<span>Invoice Preview</span>
					<Button 
						type="text" 
						icon={<CloseOutlined />} 
						onClick={onClose}
						style={{ fontSize: "16px" }}
					/>
				</div>
			}
			placement="right"
			onClose={onClose}
			open={visible}
			width={500}
			bodyStyle={{ padding: 0 }}
			headerStyle={{ padding: "16px" }}
			maskClosable={true}
			destroyOnClose={true}
		>
			<div style={{ 
				display: "flex", 
				flexDirection: "column", 
				height: "100%" 
			}}>
				{/* Action Buttons */}
				<div style={{ 
					padding: "16px", 
					borderBottom: "1px solid #f0f0f0",
					background: "#fafafa"
				}}>
					<Space size="middle">
						<Button 
							type="primary" 
							icon={<FilePdfOutlined />}
							onClick={handleExportPDF}
						>
							Export PDF
						</Button>
						<Button 
							icon={<FileExcelOutlined />}
							onClick={handleExportExcel}
						>
							Export Excel
						</Button>
						<Button 
							icon={<PrinterOutlined />}
							onClick={handlePrint}
						>
							Print
						</Button>
					</Space>
				</div>

				{/* Invoice Preview Content */}
				<div style={{ 
					flex: 1, 
					overflow: "auto", 
					padding: "20px" 
				}}>
					<div 
						id="invoice-preview-content"
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
										{settings?.companyName || companyName || "SAI TRAVELS"}
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
										(PROP. {settings?.proprietorName || "RUJALVIMALBHAI PATEL"})
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
										{settings?.companyAddress ||
											"A - 402, SANT SHIRE ASHRAMJI COMPLEX, NR. SARITA DAIRY, HONEY PARK ROAD, ADAJAN, SURAT - 395009"}
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
										MOBILE NO. {settings?.contactNumber || "7041168505"}
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
										{displayData.supplierGstin}
										<br />
										{displayData.supplierPan}
										<br />
										{displayData.taxInvoiceNo}
									</td>
									<td
										style={{
											border: "1px solid #000",
											padding: "5px",
											fontSize: "10px"
										}}
									>
										INVOICE Date: {displayData.invoiceDate}
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
										{displayData.recipientName}
										<br />
										{displayData.recipientAddress.split("\n").map((line, i) => (
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
										Vehicles
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
										{/* Display selected vehicles */}
										{displayVehicles.map((vehicle, index) => (
											<span key={vehicle._id}>
												{vehicle.vehicleNumber} ({vehicle.vehicleType})
												{index < displayVehicles.length - 1 ? <br /> : null}
											</span>
										))}
										<br />
										{displayData.workingTime}
										<br />
										<br />
										{displayData.period.split("\n").map((line, i) => (
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
										{displayData.projectLocation.split("\n").map((line, i) => (
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
										Place of Supply of Service : {displayData.placeOfSupply}
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
								{displayData.billingItems.map((item, index) => (
									<tr key={index}>
										<td
											style={{
												border: "1px solid #000",
												padding: "5px",
												fontSize: "10px",
												textAlign: "center"
											}}
										>
											{index + 1}
										</td>
										<td
											style={{
												border: "1px solid #000",
												padding: "5px",
												fontSize: "10px"
											}}
										>
											{item.description.split("\n").map((line, i) => (
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
											{item.hsnSac}
										</td>
										<td
											style={{
												border: "1px solid #000",
												padding: "5px",
												fontSize: "10px",
												textAlign: "center"
											}}
										>
											{item.unit}
										</td>
										<td
											style={{
												border: "1px solid #000",
												padding: "5px",
												fontSize: "10px",
												textAlign: "center"
											}}
										>
											{item.quantity}
										</td>
										<td
											style={{
												border: "1px solid #000",
												padding: "5px",
												fontSize: "10px",
												textAlign: "right"
											}}
										>
											{item.rate.toFixed(2)}
										</td>
										<td
											style={{
												border: "1px solid #000",
												padding: "5px",
												fontSize: "10px",
												textAlign: "right"
											}}
										>
											{calculateItemTotal(item.quantity, item.rate).toFixed(2)}
										</td>
									</tr>
								))}
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
										BANK NAME :{" "}
										{settings?.bankDetails?.bankName || "BANK OF BARODA"}
										<br />
										BRANCH :{" "}
										{settings?.bankDetails?.branchName || "BHULKA BHAVAN"}
										<br />
										ACCOUNT NO. :{" "}
										{settings?.bankDetails?.accountNumber || "27380260001538"}
										<br />
										IFSC CODE :{" "}
										{settings?.bankDetails?.ifscCode ||
											"BARB0BHULKA ( FIFTH CHARACTER IS ZERO )"}
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
										FOR {settings?.companyName || "SAI TRAVELS"}
										<br />
										<span style={{ fontStyle: "italic", fontSize: "18px" }}>
											For {settings?.companyName || "Sai Travels"}
										</span>
										<br />
										<span style={{ fontSize: "12px" }}>
											{settings?.proprietorName || "R.J. Patel"}
										</span>
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
		</Drawer>
	);
};

export default InvoicePreview;