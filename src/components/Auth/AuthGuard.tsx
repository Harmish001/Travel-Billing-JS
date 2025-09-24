"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spin, Typography, Space } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useAuth } from "@/src/context/AuthContext";
import { useCurrentUser } from "@/src/hooks/useAuth";
import { themeColors } from "@/src/styles/theme";

const { Title, Text } = Typography;

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  redirectTo = "/login",
  requireAuth = true,
}) => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, updateUser } = useAuth();
  const {
    data: currentUser,
    isLoading: isUserLoading,
    error,
  } = useCurrentUser();

  useEffect(() => {
    // If we have user data from the API, update the auth context
    if (currentUser && !user) {
      updateUser(currentUser);
    }
  }, [currentUser, user, updateUser]);

  useEffect(() => {
    // Only redirect if we're done loading and authentication is required
    if (!isLoading && !isUserLoading && requireAuth) {
      // Check if we have a valid token
      const token = localStorage.getItem("token");

      if (!token || error || (!isAuthenticated && !currentUser)) {
        router.push(redirectTo);
        return;
      }
    }
  }, [
    isLoading,
    isUserLoading,
    isAuthenticated,
    currentUser,
    requireAuth,
    error,
    router,
    redirectTo,
  ]);

  // Show loading state while checking authentication
  if (isLoading || isUserLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: themeColors.neutralLight,
        }}
      >
        <Space direction="vertical" align="center" size="large">
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 48,
                  color: themeColors.primary,
                }}
                spin
              />
            }
            size="large"
          />
          <div style={{ textAlign: "center" }}>
            <Title
              level={4}
              style={{ color: themeColors.neutralDark, marginBottom: 8 }}
            >
              Loading...
            </Title>
            <Text type="secondary">
              Please wait while we verify your authentication
            </Text>
          </div>
        </Space>
      </div>
    );
  }

  // If authentication is required but user is not authenticated, don't render children
  if (requireAuth && !isAuthenticated && !currentUser) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: themeColors.neutralLight,
        }}
      >
        <Space direction="vertical" align="center" size="large">
          <div style={{ textAlign: "center" }}>
            <Title
              level={4}
              style={{ color: themeColors.neutralDark, marginBottom: 8 }}
            >
              Access Denied
            </Title>
            <Text type="secondary">Redirecting to login...</Text>
          </div>
        </Space>
      </div>
    );
  }

  // If authentication is not required, or user is authenticated, render children
  return <>{children}</>;
};

export default AuthGuard;
