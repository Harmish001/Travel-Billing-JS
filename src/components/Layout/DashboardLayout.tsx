"use client";

import React, { useState, useEffect } from "react";
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
  Spin,
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
  CarOutlined,
  CloseOutlined
} from "@ant-design/icons";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { themeColors } from "@/src/styles/theme";
import InstallPrompt from "@/src/components/PWA/InstallPrompt";
import Loader from "@/src/ui/Loader";

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

interface DashboardLayoutProps {
	children?: React.ReactNode;
	currentPage?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
	children,
	currentPage = "dashboard"
}) => {
	const [collapsed, setCollapsed] = useState(false);
	const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const { user, logout } = useAuth();
	const router = useRouter();
	const pathname = usePathname();

	// Handle route changes
	useEffect(() => {
		const handleRouteChange = () => {
			setLoading(false);
		};

		// Simulate route change completion
		const timer = setTimeout(handleRouteChange, 500);
		return () => clearTimeout(timer);
	}, [pathname]);

	// Menu items for navigation
	const menuItems = [
		{
			key: "dashboard",
			icon: <DashboardOutlined />,
			label: "Dashboard",
			onClick: () => {
				setLoading(true);
				router.push("/");
				setMobileMenuVisible(false);
			}
		},
		{
			key: "invoice",
			icon: <FileTextOutlined />,
			label: "Invoice",
			onClick: () => {
				setLoading(true);
				router.push("/invoice");
				setMobileMenuVisible(false);
			}
		},
		{
			key: "vehicles",
			icon: <CarOutlined />,
			label: "Vehicles",
			onClick: () => {
				setLoading(true);
				router.push("/vehicles");
				setMobileMenuVisible(false);
			}
		},
		{
			key: "settings",
			icon: <SettingOutlined />,
			label: "Settings",
			onClick: () => {
				setLoading(true);
				router.push("/settings");
				setMobileMenuVisible(false);
			}
		}
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
			}
		},
		{
			type: "divider"
		},
		{
			key: "logout",
			icon: <LogoutOutlined />,
			label: "Logout",
			onClick: () => {
				logout();
				router.push("/login");
			},
			danger: true
		}
	];

	const handleLogout = () => {
		logout();
		router.push("/login");
	};

	// Sidebar content component
	const SidebarContent = () => (
		<div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
			{/* Logo/Brand Section */}
			{user && user.user.businessName && (
				<div
					style={{
						padding: "16px",
            textAlign: "center",
						borderBottom: `1px solid ${themeColors.neutralLight}`
					}}
					className="desktopview-logo"
				>
					<div style={{ display: "flex", justifyContent: "start" }}></div>
					<Title
						level={4}
						style={{
							color: themeColors.primary,
							fontWeight: "bold",
							margin: 0
						}}
					>
						{user?.user.businessName.toUpperCase()}
					</Title>
				</div>
			)}

			{/* Navigation Menu */}
			<Menu
				mode="inline"
				selectedKeys={[currentPage]}
				items={menuItems}
				style={{
					border: "none",
					flex: 1,
					backgroundColor: "transparent"
				}}
			/>
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
					boxShadow: "2px 0 8px rgba(0,0,0,0.1)"
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
						justifyContent: "space-between"
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
							color: themeColors.primary
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
							display: "none"
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
										shape="square"
										style={{
											backgroundColor: themeColors.primary,
											color: themeColors.white,
											minWidth: "32px",
											minHeight: "32px",
											display: "flex",
											alignItems: "center",
											justifyContent: "center"
										}}
									>
										{user?.user.businessName?.charAt(0)?.toUpperCase()}
									</Avatar>
									<div style={{ textAlign: "left" }}>
										<Text
											strong
											style={{
												fontSize: "14px",
												color: themeColors.neutralDark
											}}
										>
											{user?.user.businessName}
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
						boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
					}}
				>
					{loading ? <Loader /> : children}
				</Content>
			</Layout>

			{/* Mobile Drawer */}
			<Drawer
				title={
					<div>
						<div style={{ display: "flex", justifyContent: "start" }}></div>
						<Title
							level={4}
							style={{
								color: themeColors.primary,
								fontWeight: "bold",
								margin: 0
							}}
						>
							{user?.user.businessName.toUpperCase()}
						</Title>
					</div>
				}
				placement="left"
				closeIcon={false}
				onClose={() => setMobileMenuVisible(false)}
				open={mobileMenuVisible}
				width={280}
				className="mobile-drawer"
				extra={<CloseOutlined onClick={() => setMobileMenuVisible(false)} />}
			>
				<SidebarContent />
			</Drawer>

			{/* PWA Install Prompt */}
			<InstallPrompt />
		</Layout>
	);
};

export default DashboardLayout;
