"use client";

import { useState, useEffect } from "react";
import { Button, Modal, Space, Typography } from "antd";
import { MobileOutlined, DownloadOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

declare global {
	interface Window {
		deferredPrompt: any;
	}
}

const InstallPrompt = () => {
	const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const handler = (e: Event) => {
			// Prevent Chrome 67 and earlier from automatically showing the prompt
			e.preventDefault();
			// Stash the event so it can be triggered later.
			setDeferredPrompt(e);
			// Show the install prompt modal
			setIsVisible(true);
		};

		window.addEventListener("beforeinstallprompt", handler as any);

		return () => {
			window.removeEventListener("beforeinstallprompt", handler as any);
		};
	}, []);

	const handleInstall = async () => {
		if (!deferredPrompt) return;

		// Show the install prompt
		deferredPrompt.prompt();

		// Wait for the user to respond to the prompt
		const { outcome } = await deferredPrompt.userChoice;

		// We've used the prompt, and can't use it again, throw it away
		setDeferredPrompt(null);

		// Hide the modal
		setIsVisible(false);

		// Optionally, send analytics event
		console.log(`User response to the install prompt: ${outcome}`);
	};

	const handleCancel = () => {
		setIsVisible(false);
		// Optionally, send analytics event
		console.log("User dismissed the install prompt");
	};

	// Don't render anything if not on client or no prompt available
	if (
		typeof window === "undefined" ||
		!deferredPrompt ||
		window.innerWidth >= 768
	) {
		return null;
	}

	return (
		<Modal
			open={isVisible}
			onCancel={handleCancel}
			footer={[
				<Button key="cancel" onClick={handleCancel}>
					Not Now
				</Button>,
				<Button
					key="install"
					type="primary"
					onClick={handleInstall}
					icon={<DownloadOutlined />}
				>
					Install App
				</Button>
			]}
		>
			<Space
				direction="vertical"
				style={{ width: "100%", textAlign: "center" }}
			>
				<MobileOutlined style={{ fontSize: "48px", color: "#1677ff" }} />
				<Title level={3}>Install Travel Billing App</Title>
				<Text>
					Add Travel Billing to your home screen for faster access and improved
					experience.
				</Text>
			</Space>
		</Modal>
	);
};

export default InstallPrompt;
