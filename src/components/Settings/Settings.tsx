"use client";

import React, { useEffect } from "react";
import {
	Form,
	Input,
	Button,
	Card,
	Row,
	Col,
	Space,
	Typography,
	Spin,
	Popconfirm
} from "antd";
import {
	SaveOutlined,
	ReloadOutlined,
	DeleteOutlined,
	EditOutlined
} from "@ant-design/icons";
import {
	useSettings,
	useCreateSettings,
	useUpdateSettings,
	useDeleteSettings
} from "@/src/hooks/settingsHook";
import { SettingsFormData } from "@/src/types/iSettings";

const { Title, Text } = Typography;
const { TextArea } = Input;

const Settings: React.FC = () => {
	const [form] = Form.useForm<SettingsFormData>();
	const { data: settingsData, isLoading, error, refetch } = useSettings();
	const {
		mutate: createSettings,
		isPending: isCreating,
		contextHolder: createContextHolder
	} = useCreateSettings();
	const {
		mutate: updateSettings,
		isPending: isUpdating,
		contextHolder: updateContextHolder
	} = useUpdateSettings();
	const {
		mutate: deleteSettings,
		isPending: isDeleting,
		contextHolder: deleteContextHolder
	} = useDeleteSettings();

	const hasSettings = settingsData?.data;
	const isFormLoading = isLoading || isCreating || isUpdating || isDeleting;

	// Fill form with existing data
	useEffect(() => {
		if (hasSettings) {
			form.setFieldsValue({
				companyName: hasSettings.companyName,
				gstNumber: hasSettings.gstNumber,
				panNumber: hasSettings.panNumber,
				proprietorName: hasSettings.proprietorName,
				bankName: hasSettings.bankDetails.bankName,
				ifscCode: hasSettings.bankDetails.ifscCode,
				accountNumber: hasSettings.bankDetails.accountNumber,
				branchName: hasSettings.bankDetails.branchName,
				contactNumber: hasSettings.contactNumber,
				companyAddress: hasSettings.companyAddress
			});
		}
	}, [hasSettings, form]);

	const handleSubmit = (values: SettingsFormData) => {
		const formData = {
			companyName: values.companyName,
			gstNumber: values.gstNumber,
			panNumber: values.panNumber,
			proprietorName: values.proprietorName,
			bankDetails: {
				bankName: values.bankName,
				ifscCode: values.ifscCode,
				accountNumber: values.accountNumber,
				branchName: values.branchName
			},
			contactNumber: values.contactNumber,
			companyAddress: values.companyAddress
		};

		if (hasSettings) {
			updateSettings(formData);
		} else {
			createSettings(formData);
		}
	};

	const handleReset = () => {
		if (hasSettings) {
			form.setFieldsValue({
				companyName: hasSettings.companyName,
				gstNumber: hasSettings.gstNumber,
				panNumber: hasSettings.panNumber,
				proprietorName: hasSettings.proprietorName,
				bankName: hasSettings.bankDetails.bankName,
				ifscCode: hasSettings.bankDetails.ifscCode,
				accountNumber: hasSettings.bankDetails.accountNumber,
				branchName: hasSettings.bankDetails.branchName,
				contactNumber: hasSettings.contactNumber,
				companyAddress: hasSettings.companyAddress
			});
		} else {
			form.resetFields();
		}
	};

	const handleDelete = () => {
		deleteSettings();
		form.resetFields();
	};

	const handleRefresh = () => {
		refetch();
	};

	return (
		<div>
			{createContextHolder}
			{updateContextHolder}
			{deleteContextHolder}

			<Row gutter={[24, 24]}>
				<Col xs={24}>
					{/* <Card
					
					> */}
					<Spin spinning={isFormLoading}>
						<Form
							form={form}
							layout="vertical"
							onFinish={handleSubmit}
							size="middle"
							style={{ padding: "8px 0" }}
						>
							{/* Company Information Section */}
							<Title level={5} style={{ color: "#1890ff" }}>
								Company Information
							</Title>

							<Row gutter={[16, 0]}>
								<Col xs={24} sm={24} md={12} lg={8}>
									<Form.Item
										label="Company Name"
										name="companyName"
										rules={[
											{ required: true, message: "Please enter company name" }
										]}
									>
										<Input placeholder="Enter company name" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={12} lg={8}>
									<Form.Item
										label="GST Number"
										name="gstNumber"
										rules={[
											{ required: true, message: "Please enter GST number" }
										]}
									>
										<Input placeholder="Enter GST number" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={12} lg={8}>
									<Form.Item
										label="PAN Number"
										name="panNumber"
										rules={[
											{ required: true, message: "Please enter PAN number" }
										]}
									>
										<Input placeholder="Enter PAN number" />
									</Form.Item>
								</Col>
							</Row>

							<Row gutter={[16, 0]}>
								<Col xs={24} sm={12} md={12} lg={8}>
									<Form.Item
										label="Proprietor Name"
										name="proprietorName"
										rules={[
											{
												required: true,
												message: "Please enter proprietor name"
											}
										]}
									>
										<Input placeholder="Enter proprietor name" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={12} lg={8}>
									<Form.Item
										label="Contact Number"
										name="contactNumber"
										rules={[
											{
												required: true,
												message: "Please enter contact number"
											}
										]}
									>
										<Input placeholder="Enter contact number" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={24} md={12} lg={8}>
									<Form.Item
										label="Company Address"
										name="companyAddress"
										rules={[
											{
												required: true,
												message: "Please enter company address"
											}
										]}
									>
										<TextArea placeholder="Enter company address" rows={3} />
									</Form.Item>
								</Col>
							</Row>

							{/* Bank Details Section */}
							<Title level={5} style={{ color: "#1890ff" }}>
								Bank Details
							</Title>

							<Row gutter={[16, 0]}>
								<Col xs={24} sm={12} md={12} lg={8}>
									<Form.Item
										label="Bank Name"
										name="bankName"
										rules={[
											{ required: true, message: "Please enter bank name" }
										]}
									>
										<Input placeholder="Enter bank name" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={12} lg={8}>
									<Form.Item
										label="IFSC Code"
										name="ifscCode"
										rules={[
											{ required: true, message: "Please enter IFSC code" }
										]}
									>
										<Input placeholder="Enter IFSC code" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12} md={12} lg={8}>
									<Form.Item
										label="Account Number"
										name="accountNumber"
										rules={[
											{
												required: true,
												message: "Please enter account number"
											}
										]}
									>
										<Input placeholder="Enter account number" />
									</Form.Item>
								</Col>
							</Row>

							<Row gutter={[16, 0]}>
								<Col xs={24} sm={12} md={12} lg={8}>
									<Form.Item
										label="Branch Name"
										name="branchName"
										rules={[
											{ required: true, message: "Please enter branch name" }
										]}
									>
										<Input placeholder="Enter branch name" />
									</Form.Item>
								</Col>
							</Row>

							{/* Action Buttons */}
							<Row gutter={[16, 16]}>
								<Col xs={24} sm={12} md={8} lg={6}>
									<Button
										type="primary"
										htmlType="submit"
										loading={isCreating || isUpdating}
										block
									>
										{hasSettings ? "Update Settings" : "Save Settings"}
									</Button>
								</Col>
							</Row>
						</Form>
					</Spin>
					{/* </Card> */}
				</Col>
			</Row>

			<style jsx global>{`
				/* Mobile optimizations */
				@media (max-width: 768px) {
					.ant-form-item {
						margin-bottom: 16px !important;
					}

					.ant-row {
						margin-bottom: 0 !important;
					}

					.ant-card-body {
						padding: 16px !important;
					}

					.ant-input,
					.ant-input-number,
					.ant-select-selector {
						height: 44px !important;
						border-radius: 12px !important;
					}

					.ant-btn {
						height: 44px !important;
						border-radius: 20px !important;
						font-size: 16px !important;
					}
				}

				/* Desktop optimizations */
				@media (min-width: 1200px) {
					.ant-col-lg-8:nth-child(3n + 1) {
						clear: left;
					}
				}

				/* Touch-friendly dropdowns for mobile */
				@media (max-width: 768px) {
					.ant-select-dropdown {
						max-height: 200px !important;
						overflow-y: auto !important;
					}
				}
			`}</style>
		</div>
	);
};

export default Settings;
