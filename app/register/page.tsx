"use client";

import React from "react";
import { Card, Typography, Form, Input, Button, Alert, Space } from "antd";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useRegister } from "@/src/hooks";

const { Title, Text, Link } = Typography;

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const registerMutation = useRegister();

  const handleSubmit = async (values: {
    email: string;
    password: string;
    confirmPassword: string;
    businessName: string;
  }) => {
    // Basic validation
    if (values.password !== values.confirmPassword) {
      return;
    }

    if (values.password.length < 6) {
      return;
    }

    try {
      const response = await registerMutation.mutateAsync({
        email: values.email,
        password: values.password,
        businessName: values.businessName,
      });
      
      // Store token in localStorage
      localStorage.setItem('token', response.token);
      
      // Redirect to dashboard on successful registration
      router.push('/dashboard');
    } catch (error) {
      // Error is handled by the mutation
      console.error('Registration failed:', error);
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
            Create Your Account
          </Title>
          <Text type="secondary">
            Join OrderFlow and start managing your business
          </Text>
        </div>

        {registerMutation.error && (
          <Alert
            message={(registerMutation.error as any)?.response?.data?.message || 'Registration failed. Please try again.'}
            type="error"
            style={{ marginBottom: "24px", borderRadius: "8px" }}
            showIcon
          />
        )}

        <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <Form.Item
            label="Business Name"
            name="businessName"
            rules={[
              { required: true, message: "Please input your business name!" },
            ]}
          >
            <Input
              placeholder="Enter your business name"
              size="large"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

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
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password
              placeholder="Enter your password"
              size="large"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm your password"
              size="large"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={registerMutation.isPending}
              size="large"
              block
              style={{
                borderRadius: "8px",
                fontWeight: 600,
                height: "48px",
              }}
            >
              {registerMutation.isPending ? "Creating account..." : "Create Account"}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center" }}>
          <Text type="secondary">
            Already have an account?{" "}
            <NextLink href="/login">
              <Link style={{ fontWeight: 600 }}>Sign in here</Link>
            </NextLink>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
