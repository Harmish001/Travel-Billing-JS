"use client";

import React from "react";
import { Button, Space } from "antd";
import { FilePdfOutlined, PrinterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useSettings } from "@/src/hooks/settingsHook";
import { IBillingResponse } from "@/src/types/iBilling";
import { Settings } from "@/src/types/iSettings";
import { Vehicle } from "@/src/types/iVehicle";
import { toWords } from "number-to-words";

// Add this helper function for date formatting using Day.js
const formatDate = (date: Date | string | null): string => {
	if (!date) return "";

	// Format as DD/MM/YYYY using Day.js
	return dayjs(date).format("DD/MM/YYYY");
};

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
		gstEnabled?: boolean;
	};
	selectedVehicles?: Vehicle[];
	companyName?: string;
	billingDate?: Date | null;
	settings?: Settings | null;
	existingInvoice?: IBillingResponse;
	gstEnabled?: boolean;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
	visible,
	onClose,
	formData,
	selectedVehicles = [],
	companyName,
	billingDate,
	settings: externalSettings,
	existingInvoice,
	gstEnabled
}) => {
	const { data: settingsData } = useSettings();
	const settings: Settings | null =
		externalSettings || settingsData?.data || null;

	// Use existing invoice data if available, otherwise use form data
	const isExistingInvoice = !!existingInvoice;

	const displayData = isExistingInvoice
		? {
				recipientName: existingInvoice.recipientName,
				recipientAddress: existingInvoice.recipientAddress,
				projectLocation:
					existingInvoice.projectLocation || existingInvoice.recipientAddress,
				workingTime: existingInvoice.workingTime,
				period: existingInvoice.period || "",
				placeOfSupply: existingInvoice.placeOfSupply || "",
				billingItems: existingInvoice.billingItems || [],
				invoiceDate: formatDate(new Date(existingInvoice.createdAt)),
				supplierGstin: settings?.gstNumber || "24ELVPV5086R1ZB",
				supplierPan: settings?.panNumber || "ELVPV5086R",
				taxInvoiceNo: existingInvoice._id || "INV-" + new Date().getTime(),
				gstEnabled: existingInvoice.gstEnabled
		  }
		: {
				recipientName: formData?.recipientName || "",
				recipientAddress: formData?.recipientAddress || "",
				projectLocation: formData?.projectLocation || "",
				workingTime: formData?.workingTime || "",
				period: formData?.period || "",
				placeOfSupply: formData?.placeOfSupply || "",
				billingItems: formData?.billingItems || [],
				invoiceDate: billingDate
					? formatDate(billingDate)
					: formatDate(new Date()),
				supplierGstin: settings?.gstNumber || "24ELVPV5086R1ZB",
				supplierPan: settings?.panNumber || "ELVPV5086R",
				taxInvoiceNo: "INV-" + new Date().getTime(),
				gstEnabled: formData?.gstEnabled
		  };

	// For existing invoices, get vehicles from the invoice data
	const displayVehicles = isExistingInvoice
		? existingInvoice.vehicleIds?.map((v) => ({
				_id: v._id,
				vehicleNumber: v.vehicleNumber,
				vehicleType: v.vehicleType || "Vehicle"
		  })) || []
		: selectedVehicles;

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

	const calculateGst = () => {
			const isGstEnabled = isExistingInvoice ? (existingInvoice as any).gstEnabled ?? true : gstEnabled ?? formData?.gstEnabled ?? true;
			return isGstEnabled ? Math.round(calculateSubtotal() * 0.09) : 0;
		};
		
		const calculateTotal = () => {
			const isGstEnabled = isExistingInvoice ? (existingInvoice as any).gstEnabled ?? true : gstEnabled ?? formData?.gstEnabled ?? true;
			const subtotal = calculateSubtotal();
			const gstAmount = calculateGst();
			return isGstEnabled ? subtotal + gstAmount * 2 : subtotal;
		};

	const handleExportPDF = async () => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const html2canvas = ((await import("html2canvas")) as any).default;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const jsPDF = ((await import("jspdf")) as any).jsPDF;

			const element = document.getElementById("invoice-preview-content");
			if (element) {
				// Set explicit dimensions for A4 (210mm x 297mm)
				element.style.width = "210mm";
				element.style.minHeight = "297mm";
				element.style.margin = "0 auto";
				element.style.padding = "10mm";

				const canvas = await html2canvas(element, {
					scale: 1.5, // Higher quality
					useCORS: true,
					logging: false
				});

				const imgData = canvas.toDataURL("image/png", 0.85);
				const pdf = new jsPDF("p", "mm", "a4");
				const pageHeight = 277; // A4 height minus margins
				const imgWidth = 190; // A4 width minus margins
				const imgHeight = (canvas.height * imgWidth) / canvas.width;
				let heightLeft = imgHeight;
				let position = 0;

				pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
				heightLeft -= pageHeight;

				while (heightLeft >= 0) {
					position = heightLeft - imgHeight;
					pdf.addPage();
					pdf.addImage(imgData, "PNG", 10, position + 10, imgWidth, imgHeight);
					heightLeft -= pageHeight;
				}

				pdf.save(`invoice-${displayData?.taxInvoiceNo || "preview"}.pdf`);

				// Reset styles after PDF generation
				element.style.width = "";
				element.style.minHeight = "";
				element.style.margin = "";
				element.style.padding = "";
			}
		} catch (error) {
			console.error("Error exporting PDF:", error);
		}
	};

	const handleExportExcel = async () => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const XLSX = (await import("xlsx")) as any;

			const vehicleInfo = displayVehicles
				.map((vehicle) => `${vehicle.vehicleNumber} (${vehicle.vehicleType})`)
				.join(", ");

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
				["Recipient Name & Address", "", "Vehicles", vehicleInfo],
				["TO,", "", "Working Time", displayData?.workingTime],
				[displayData?.recipientName, "", "Period", displayData?.period],
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
			XLSX.writeFile(
				workbook,
				`invoice-${displayData?.taxInvoiceNo || "preview"}.xlsx`
			);
		} catch (error) {
			console.error("Error exporting Excel:", error);
		}
	};

	const handlePrint = () => {
		const element = document.getElementById("invoice-preview-content");
		if (element) {
			// Set explicit dimensions for printing
			element.style.width = "210mm";
			element.style.minHeight = "297mm";
			element.style.margin = "0 auto";
			element.style.padding = "10mm";

			const printWindow = window.open("", "_blank");
			if (printWindow) {
				printWindow.document.write(`
					<html>
						<head>
							<title>Invoice Print</title>
							<style>
								@page {
									size: A4;
									margin: 10mm;
								}
								body { 
									font-family: Arial, sans-serif; 
									margin: 0;
									padding: 10mm;
									width: 210mm;
									min-height: 297mm;
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
							${element.outerHTML}
						</body>
					</html>
				`);
				printWindow.document.close();
				printWindow.focus();

				// Reset styles after printing
				setTimeout(() => {
					element.style.width = "";
					element.style.minHeight = "";
					element.style.margin = "";
					element.style.padding = "";
					printWindow.print();
				}, 500);
			}
		}
	};

	if (!displayData) {
		return null;
	}

	// Don't render if not visible
	if (!visible) {
		return null;
	}

	return (
		<div>
			{/* Action Buttons - Positioned in the top right corner as requested */}
			<div style={{ position: "absolute", top: 16, right: 16, zIndex: 1000 }}>
				<Space size="middle">
					<Button
						type="primary"
						icon={<FilePdfOutlined />}
						onClick={handleExportPDF}
					>
						Export PDF
					</Button>
					{/* <Button 
						icon={<FileExcelOutlined />}
						onClick={handleExportExcel}
					>
						Export Excel
					</Button> */}
					{/* <Button icon={<PrinterOutlined />} onClick={handlePrint}>
						Print
					</Button> */}
				</Space>
			</div>

			{/* Invoice Preview Content */}
			<div
				id="invoice-preview-content"
				className="invoice-preview-container"
				style={{
					backgroundColor: "white",
					padding: "10mm",
					fontFamily: "Arial, sans-serif",
					fontSize: "12px",
					width: "210mm",
					minHeight: "297mm",
					margin: "0 auto",
					boxShadow: "0 0 10px rgba(0,0,0,0.1)"
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
									padding: "6px",
									textAlign: "center",
									fontSize: "18px",
									fontWeight: "bold",
									backgroundColor: "#f0f0f0"
								}}
							>
								{settings?.companyName.toUpperCase() || companyName}
							</td>
						</tr>
						<tr>
							<td
								style={{
									border: "1px solid #000",
									padding: "6px",
									textAlign: "center",
									fontSize: "14px"
								}}
							>
								(PROP. {settings?.proprietorName.toUpperCase()})
							</td>
						</tr>
						<tr>
							<td
								style={{
									border: "1px solid #000",
									padding: "6px",
									textAlign: "center",
									fontSize: "12px"
								}}
							>
								{settings?.companyAddress.toUpperCase()}
							</td>
						</tr>
						<tr>
							<td
								style={{
									border: "1px solid #000",
									padding: "6px",
									textAlign: "center",
									fontSize: "12px"
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
									padding: "8px",
									fontSize: "12px",
									width: "15%",
									fontWeight: "bold"
								}}
							>
								ORIGINAL FOR
								<br />
								RECEIPT
							</td>
							<td
								style={{
									border: "1px solid #000",
									padding: "8px",
									fontSize: "12px",
									width: "35%"
								}}
							>
								<tr>
									<td>
										<span>
											SUPPLIER&apos;S GSTN: &nbsp;
											{displayData.supplierGstin.toUpperCase()}
										</span>
									</td>
								</tr>
								<br />
								<tr>
									<td>
										<span>
											SUPPLIER&apos;S PAN: &nbsp;
											{displayData.supplierPan.toUpperCase()}
										</span>
									</td>
								</tr>
								<br />
								<tr>
									<td>
										<span>
											TAX INVOICE NO.:&nbsp;
											{displayData.taxInvoiceNo.toUpperCase()}
										</span>
									</td>
								</tr>
							</td>
							<td
								style={{
									border: "1px solid #000",
									padding: "8px",
									fontSize: "12px",
									width: "20%"
								}}
							>
								INVOICE Date: {displayData.invoiceDate.toUpperCase()}
							</td>
						</tr>
					</tbody>
				</table>

				{/* Recipient and Vehicle Details */}
				<table
					style={{
						width: "100%",
						borderCollapse: "collapse",
						marginBottom: "10px",
						textAlign: "start"
					}}
				>
					<tbody>
						<tr>
							<td
								style={{
									border: "1px solid #000",
									padding: "0 8px",
									fontSize: "12px",
									width: "50%",
									textAlign: "start"
								}}
							>
								<strong>Recipient Name & Address</strong>
								<br />
								TO,
								<br />
								{displayData.recipientName.toUpperCase()}
								<br />
								{displayData.recipientAddress.split("\n").map((line, i) => (
									<span key={i}>
										{line.toUpperCase()}
										<br />
									</span>
								))}
							</td>
							<td
								style={{
									border: "1px solid #000",
									padding: "8px",
									fontSize: "12px",
									width: "30%"
								}}
							>
								<tr>
									<td>
										<span>
											VehicleType: &nbsp;
											{displayVehicles.map((vehicle, index) => (
												<span key={vehicle._id}>
													{vehicle.vehicleType.toUpperCase()}
													{index < displayVehicles.length - 1 ? " & " : null}
												</span>
											))}
										</span>
									</td>
								</tr>
								<br />
								<tr>
									<td>
										<span>
											Vehicle No.: &nbsp;
											{displayVehicles.map((vehicle, index) => (
												<span key={vehicle._id}>
													{vehicle.vehicleNumber.toUpperCase()}
													{index < displayVehicles.length - 1 ? " & " : null}
												</span>
											))}
										</span>
									</td>
								</tr>
								<br />
								<tr>
									<td>
										<span>
											Working Time: &nbsp;
											{displayData.workingTime.toUpperCase()}
										</span>
									</td>
								</tr>
								<br />
								<tr>
									<td>
										<span>
											Period: &nbsp;
											{displayData.period.split("\n").map((line, i) => (
												<span key={i}>
													{line.toUpperCase()}
													<br />
												</span>
											))}
										</span>
									</td>
								</tr>
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
									padding: "8px",
									fontSize: "12px"
								}}
							>
								<strong>Project Location</strong>
								<br />
								TO,
								<br />
								{displayData.projectLocation.split("\n").map((line, i) => (
									<span key={i}>
										{line.toUpperCase()}
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
									padding: "8px",
									fontSize: "12px"
								}}
							>
								Place of Supply of Service :{" "}
								{displayData.placeOfSupply.toUpperCase()}
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
									padding: "8px",
									fontSize: "12px",
									backgroundColor: "#f0f0f0",
									width: "8%"
								}}
							>
								Sr. No.
							</th>
							<th
								style={{
									border: "1px solid #000",
									padding: "8px",
									fontSize: "12px",
									backgroundColor: "#f0f0f0",
									width: "35%"
								}}
							>
								DESCRIPTION
							</th>
							<th
								style={{
									border: "1px solid #000",
									padding: "8px",
									fontSize: "12px",
									backgroundColor: "#f0f0f0",
									width: "12%"
								}}
							>
								HSN \ SAC
							</th>
							<th
								style={{
									border: "1px solid #000",
									padding: "8px",
									fontSize: "12px",
									backgroundColor: "#f0f0f0",
									width: "8%"
								}}
							>
								UNIT
							</th>
							<th
								style={{
									border: "1px solid #000",
									padding: "8px",
									fontSize: "12px",
									backgroundColor: "#f0f0f0",
									width: "8%"
								}}
							>
								QTY.
							</th>
							<th
								style={{
									border: "1px solid #000",
									padding: "8px",
									fontSize: "12px",
									backgroundColor: "#f0f0f0",
									width: "12%"
								}}
							>
								RATE
							</th>
							<th
								style={{
									border: "1px solid #000",
									padding: "8px",
									fontSize: "12px",
									backgroundColor: "#f0f0f0",
									width: "17%"
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
										padding: "8px",
										fontSize: "12px",
										textAlign: "center"
									}}
								>
									{index + 1}
								</td>
								<td
									style={{
										border: "1px solid #000",
										padding: "8px",
										fontSize: "12px"
									}}
								>
									{item.description.split("\n").map((line, i) => (
										<span key={i}>
											{line.toUpperCase()}
											<br />
										</span>
									))}
								</td>
								<td
									style={{
										border: "1px solid #000",
										padding: "8px",
										fontSize: "12px",
										textAlign: "center"
									}}
								>
									{item.hsnSac}
								</td>
								<td
									style={{
										border: "1px solid #000",
										padding: "8px",
										fontSize: "12px",
										textAlign: "center"
									}}
								>
									{item.unit.toUpperCase()}
								</td>
								<td
									style={{
										border: "1px solid #000",
										padding: "8px",
										fontSize: "12px",
										textAlign: "center"
									}}
								>
									{item.quantity}
								</td>
								<td
									style={{
										border: "1px solid #000",
										padding: "8px",
										fontSize: "12px",
										textAlign: "right"
									}}
								>
									{item.rate.toFixed(2)}
								</td>
								<td
									style={{
										border: "1px solid #000",
										padding: "8px",
										fontSize: "12px",
										textAlign: "right"
									}}
								>
									{calculateItemTotal(item.quantity, item.rate).toFixed(2)}
								</td>
							</tr>
						))}
						{displayData.gstEnabled && <tr>
							<td
								colSpan={6}
								style={{
									border: "1px solid #000",
									padding: "8px",
									fontSize: "12px",
									textAlign: "right"
								}}
							>
								SGST 9%
							</td>
							<td
								style={{
									border: "1px solid #000",
									padding: "8px",
									fontSize: "12px",
									textAlign: "right"
								}}
							>
								{calculateGst()}
							</td>
						</tr>}
						{displayData.gstEnabled &&<tr>
							<td
								colSpan={6}
								style={{
									border: "1px solid #000",
									padding: "8px",
									fontSize: "12px",
									textAlign: "right"
								}}
							>
								CGST 9%
							</td>
							<td
								style={{
									border: "1px solid #000",
									padding: "8px",
									fontSize: "12px",
									textAlign: "right"
								}}
							>
								{calculateGst()}
							</td>
						</tr>}
						{displayData.gstEnabled &&<tr>
							<td
								colSpan={6}
								style={{
									border: "1px solid #000",
									padding: "8px",
									fontSize: "12px",
									textAlign: "right"
								}}
							>
								IGST 18%
							</td>
							<td
								style={{
									border: "1px solid #000",
									padding: "8px",
									fontSize: "12px",
									textAlign: "right"
								}}
							>
								0
							</td>
						</tr>}
						<tr>
							<td
								colSpan={6}
								style={{
									border: "1px solid #000",
									padding: "8px",
									fontSize: "12px",
									textAlign: "right",
									fontWeight: "bold"
								}}
							>
								Total Invoice Value in Rs.
							</td>
							<td
								style={{
									border: "1px solid #000",
									padding: "8px",
									fontSize: "12px",
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
									padding: "8px",
									fontSize: "12px",
									fontWeight: "bold"
								}}
							>
								{toWords(calculateTotal()).toUpperCase() + " ONLY"}
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
					<tbody style={{ width: "100%" }}>
						<tr style={{ width: "100%" }}>
							<td
								style={{
									border: "1px solid #000",
									padding: "8px",
									fontSize: "12px",
									width: "100%"
								}}
							>
								GST ON CASH TO REVERSE CHARGES BASIS WILL BE PAYABLE BY
								CONSIGNOR OR CONSIGNEE
								<br />
								RCM AS PER NOTIFICATION NO. 29/2018 CENTRAL TAX RATE ( RATE )
								DATED 31ST DEC,2018
							</td>
						</tr>
						<tr
							style={{
								height: "100%",
								width: "100%",
								display: "flex",
								alignItems: "start"
							}}
						>
							<td
								style={{
									border: "1px solid #000",
									padding: "8px",
									// width: "50%",
									fontSize: "12px",
									flex: 3,
									display: "flex",
									flexDirection: "column",
									gap: 8
								}}
							>
								<strong>BANK DETAILS :</strong>
								<span>
									{" "}
									BANK NAME : {settings?.bankDetails?.bankName.toUpperCase()}
								</span>
								<span>
									BRANCH : {settings?.bankDetails?.branchName.toUpperCase()}
								</span>
								<span>
									ACCOUNT NO. :{" "}
									{settings?.bankDetails?.accountNumber.toUpperCase()}
								</span>
								<span>
									IFSC CODE : {settings?.bankDetails?.ifscCode.toUpperCase()}
								</span>
							</td>
							<td
								style={{
									borderTop: "none",
									border: "1px solid #000",
									padding: "8px 5px",
									fontSize: "12px",
									textAlign: "center",
									flex: 1,
									height: "117.5px",
									display: "flex",
									position: "relative"
								}}
							>
								FOR {settings?.companyName.toUpperCase()}
								<br />
								<span
									style={{
										position: "absolute",
										bottom: "6px",
										right: "6px",
										fontSize: "12px"
										// color: "#6600cc"
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
	);
};

export default InvoicePreview;
