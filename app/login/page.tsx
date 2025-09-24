"use client";

import React from "react";
import { Card, Typography, Form, Input, Button, Alert, Space } from "antd";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useLogin } from "@/src/hooks";

const { Title, Text, Link } = Typography;

const LoginPage: React.FC = () => {
  const router = useRouter();
  const loginMutation = useLogin();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const response = await loginMutation.mutateAsync(values);

      // Store token in localStorage
      localStorage.setItem("token", response.token);

      // Redirect to dashboard on successful login
      router.push("/");
    } catch (error) {
      // Error is handled by the mutation
      console.error("Login failed:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        padding: "24px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "12px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Title level={2} style={{ color: "#1677ff", marginBottom: "8px" }}>
            Welcome Back
          </Title>
          <Text type="secondary">Sign in to your OrderFlow account</Text>
        </div>

        {loginMutation.error && (
          <Alert
            message={
              (loginMutation.error as any)?.response?.data?.message ||
              "Login failed. Please try again."
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
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              placeholder="Enter your email"
              size="large"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Enter your password"
              size="large"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loginMutation.isPending}
              size="large"
              block
              style={{
                borderRadius: "8px",
                fontWeight: 600,
                height: "48px",
              }}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center" }}>
          <Space direction="vertical" size="small">
            <Text type="secondary">
              Don&apos;t have an account?{" "}
              <NextLink href="/register">
                <Link style={{ fontWeight: 600 }}>Sign up here</Link>
              </NextLink>
            </Text>
            <NextLink href="/forgot-password">
              <Link style={{ fontSize: "14px" }}>Forgot your password?</Link>
            </NextLink>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
