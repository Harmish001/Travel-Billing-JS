"use client";

import React, { useState } from "react";
import {
	Card,
	Typography,
	Form,
	Input,
	Button,
	Alert,
	Space,
	Result
} from "antd";
import NextLink from "next/link";
import { useForgotPassword } from "@/src/hooks/usePasswordReset";

const { Title, Text, Link } = Typography;

const ForgotPasswordPage: React.FC = () => {
	const [success, setSuccess] = useState(false);
	const [email, setEmail] = useState("");
	const forgotPasswordMutation = useForgotPassword();

	const handleSubmit = async (values: { email: string }) => {
		setEmail(values.email);

		try {
			await forgotPasswordMutation.mutateAsync(values.email);
			setSuccess(true);
		} catch (error) {
			// Error is handled by the mutation
		}
	};

	if (success) {
		return (
			<div
				style={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "#f5f5f5",
					padding: "24px"
				}}
			>
				<Card
					style={{
						width: "100%",
						maxWidth: "500px",
						borderRadius: "12px",
						boxShadow: "0 4px 16px rgba(0,0,0,0.1)"
					}}
				>
					<Result
						status="success"
						title="Reset Email Sent!"
						subTitle={
							<div style={{ textAlign: "center" }}>
								<Text type="secondary" style={{ fontSize: "16px" }}>
									We've sent a password reset link to:
								</Text>
								<br />
								<Text strong style={{ fontSize: "16px", color: "#1677ff" }}>
									{email}
								</Text>
								<br />
								<br />
								<Text type="secondary">
									Please check your email and follow the instructions to reset
									your password. The link will expire in 24 hours.
								</Text>
							</div>
						}
						extra={[
							<NextLink href="/login" key="login">
								<Button type="primary">Back to Login</Button>
							</NextLink>,
							<Button
								key="resend"
								onClick={() => setSuccess(false)}
								style={{ marginLeft: "8px" }}
							>
								Send Again
							</Button>
						]}
					/>
				</Card>
			</div>
		);
	}

	return (
		<div
			style={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#f5f5f5",
				padding: "24px"
			}}
		>
			<Card
				style={{
					width: "100%",
					maxWidth: "400px",
					borderRadius: "12px",
					boxShadow: "0 4px 16px rgba(0,0,0,0.1)"
				}}
			>
				{/* Header */}
				<div style={{ textAlign: "center", marginBottom: "32px" }}>
					<div style={{ marginBottom: "16px" }}>
						<div style={{ fontSize: "48px", color: "#1677ff" }}>📧</div>
					</div>
					<Title level={2} style={{ color: "#1677ff", marginBottom: "8px" }}>
						Forgot Password?
					</Title>
					<Text type="secondary" style={{ fontSize: "16px" }}>
						Enter your email address and we'll send you a link to reset your
						password.
					</Text>
				</div>

				{forgotPasswordMutation.error && (
					<Alert
						message={
							(forgotPasswordMutation.error as any)?.response?.data?.message ||
							"Failed to send reset email. Please try again."
						}
						type="error"
						style={{ marginBottom: "24px", borderRadius: "8px" }}
						showIcon
					/>
				)}

				<Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
					<Form.Item
						label="Email Address"
						name="email"
						rules={[
							{ required: true, message: "Please input your email!" },
							{ type: "email", message: "Please enter a valid email!" }
						]}
					>
						<Input
							placeholder="Enter your email address"
							style={{ borderRadius: "8px" }}
						/>
					</Form.Item>

					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							loading={forgotPasswordMutation.isPending}
							block
							style={{
								borderRadius: "8px",
								fontWeight: 600,
								height: "48px",
								marginBottom: "16px"
							}}
						>
							{forgotPasswordMutation.isPending
								? "Sending..."
								: "Send Reset Link"}
						</Button>
					</Form.Item>
				</Form>

				{/* Footer */}
				<div style={{ textAlign: "center" }}>
					<Space direction="vertical" size="small">
						<NextLink href="/login">← Back to Login</NextLink>
						<Text type="secondary" style={{ fontSize: "14px" }}>
							Don't have an account?{" "}
							<NextLink href="/register">Sign up here</NextLink>
						</Text>
					</Space>
				</div>
			</Card>
		</div>
	);
};

export default ForgotPasswordPage;
