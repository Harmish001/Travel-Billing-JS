"use client";

import React, { useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Drawer,
  Typography,
  Space,
  Avatar,
  Dropdown,
  MenuProps,
} from "antd";
import {
  MenuOutlined,
  FileTextOutlined,
  LogoutOutlined,
  UserOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  CarOutlined
} from "@ant-design/icons";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { themeColors } from "@/src/styles/theme";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface DashboardLayoutProps {
  children?: React.ReactNode;
  currentPage?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentPage = "dashboard",
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  // Menu items for navigation
  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => {
        router.push("/");
        setMobileMenuVisible(false);
      },
    },
    {
      key: "invoice",
      icon: <FileTextOutlined />,
      label: "Invoice",
      onClick: () => {
        router.push("/invoice");
        setMobileMenuVisible(false);
      },
    },
    {
      key: "vehicles",
      icon: <CarOutlined />,
      label: "Vehicles",
      onClick: () => {
        router.push("/vehicles");
        setMobileMenuVisible(false);
      },
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: () => {
        router.push("/settings");
        setMobileMenuVisible(false);
      },
    },
  ];

  // User dropdown menu
  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => {
        // TODO: Navigate to profile page
        console.log("Navigate to profile");
      },
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: () => {
        logout();
        router.push("/login");
      },
      danger: true,
    },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Sidebar content component
  const SidebarContent = () => (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo/Brand Section */}
      <div
        style={{
          padding: "16px",
          textAlign: "center",
          borderBottom: `1px solid ${themeColors.neutralLight}`,
        }}
      >
        <Typography.Title
          level={4}
          style={{ margin: 0, color: themeColors.primary }}
        >
          {collapsed ? "S" : "SAI TRAVEL"}
        </Typography.Title>
      </div>

      {/* Navigation Menu */}
      <Menu
        mode="inline"
        selectedKeys={[currentPage]}
        items={menuItems}
        style={{
          border: "none",
          flex: 1,
          backgroundColor: "transparent",
        }}
      />

      {/* Logout Button at Bottom */}
      <div
        style={{
          padding: "16px",
          borderTop: `1px solid ${themeColors.neutralLight}`,
        }}
      >
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{
            width: "100%",
            backgroundColor: themeColors.secondary,
            borderColor: themeColors.secondary,
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Desktop Sidebar */}
      <Sider
        collapsible={false}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={80}
        style={{
          background: themeColors.white,
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
        }}
        className="desktop-sider"
      >
        <SidebarContent />
      </Sider>

      <Layout>
        {/* Header */}
        <Header
          style={{
            background: themeColors.white,
            padding: "0 16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Desktop Collapse Button */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 40,
              height: 40,
              color: themeColors.primary,
            }}
            className="desktop-collapse-button"
          />

          {/* Mobile Menu Button */}
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuVisible(true)}
            style={{
              fontSize: "16px",
              width: 40,
              height: 40,
              display: "none",
            }}
            className="mobile-menu-button"
          />

          {/* Header Title */}
          <div style={{ flex: 1, marginLeft: 16 }}>
            <Typography.Title
              level={4}
              style={{ margin: 0, color: themeColors.neutralDark }}
            >
              {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
            </Typography.Title>
          </div>

          {/* User Info */}
          <Space>
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Button
                type="text"
                style={{ height: "auto", padding: "8px 12px" }}
              >
                <Space>
                  <Avatar
                    size="small"
                    style={{
                      backgroundColor: themeColors.primary,
                      color: themeColors.white,
                    }}
                  >
                    {user?.businessName?.charAt(0)?.toUpperCase() || "U"}
                  </Avatar>
                  <div style={{ textAlign: "left" }}>
                    <Text
                      strong
                      style={{
                        fontSize: "14px",
                        color: themeColors.neutralDark,
                      }}
                    >
                      {user?.businessName || "User"}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {user?.email}
                    </Text>
                  </div>
                </Space>
              </Button>
            </Dropdown>
          </Space>
        </Header>

        {/* Main Content */}
        <Content
          style={{
            margin: "16px",
            padding: "24px",
            background: themeColors.white,
            borderRadius: "8px",
            minHeight: "calc(100vh - 112px)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {children}
        </Content>
      </Layout>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <Typography.Title
            level={4}
            style={{ margin: 0, color: themeColors.primary }}
          >
            SAI Travel
          </Typography.Title>
        }
        placement="left"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={280}
        className="mobile-drawer"
      >
        <SidebarContent />
      </Drawer>

      <style jsx global>{`
        /* Mobile-specific styles */
        @media (max-width: 768px) {
          .desktop-sider {
            display: none !important;
          }

          .mobile-menu-button {
            display: flex !important;
          }

          .desktop-collapse-button {
            display: none !important;
          }
        }

        @media (min-width: 769px) {
          .desktop-collapse-button {
            display: flex !important;
          }

          .mobile-drawer .ant-drawer-content {
            display: none;
          }
        }

        /* Custom scrollbar for sidebar */
        .ant-layout-sider-children::-webkit-scrollbar {
          width: 4px;
        }

        .ant-layout-sider-children::-webkit-scrollbar-track {
          background: ${themeColors.neutralLight};
        }

        .ant-layout-sider-children::-webkit-scrollbar-thumb {
          background: ${themeColors.primary};
          border-radius: 2px;
        }

        /* Responsive adjustments */
        @media (max-width: 576px) {
          .ant-layout-content {
            margin: 8px !important;
            padding: 16px !important;
          }

          .ant-layout-header {
            padding: 0 12px !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default DashboardLayout;
