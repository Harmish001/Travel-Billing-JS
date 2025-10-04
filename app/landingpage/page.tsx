"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import React, { useState, useEffect } from "react";
import {
	Card,
	Row,
	Col,
	Typography,
	Space,
	Divider,
	Badge,
	Collapse,
	Rate,
	Avatar,
	Button
} from "antd";
import {
	CheckCircleOutlined,
	RocketOutlined,
	ShoppingFilled,
	TeamOutlined,
	CreditCardOutlined,
	MobileOutlined,
	BarChartOutlined,
	QuestionCircleOutlined
} from "@ant-design/icons";

const { Panel } = Collapse;
const { Title, Paragraph, Text } = Typography;

const InvoiceLandingPage = () => {
	const router = useRouter();
	const { isAuthenticated } = useAuth();

	// If user is authenticated, redirect to dashboard
	React.useEffect(() => {
		if (isAuthenticated) {
			router.push("/");
		}
	}, [isAuthenticated, router]);

	const handleGetStarted = () => {
		router.push("/login");
	};

	// If authenticated, don't show anything while redirecting
	if (isAuthenticated) {
		return null;
	}
	const [animationClass, setAnimationClass] = useState("");

	useEffect(() => {
		setAnimationClass("animate-fade-in");
	}, []);

	const features = [
		{
			icon: <RocketOutlined style={{ fontSize: "2rem", color: "#009688" }} />,
			title: "Lightning Fast Creation",
			description:
				"Create professional invoices in under 2 minutes with our intuitive interface and smart templates."
		},
		{
			icon: <ShoppingFilled style={{ fontSize: "2rem", color: "#009688" }} />,
			title: "Secure & Compliant",
			description:
				"Bank-level security with SSL encryption and compliance with international tax regulations."
		},
		{
			icon: <TeamOutlined style={{ fontSize: "2rem", color: "#009688" }} />,
			title: "Client Management",
			description:
				"Organize your clients, track payment history, and manage relationships all in one place."
		},
		{
			icon: (
				<CreditCardOutlined style={{ fontSize: "2rem", color: "#009688" }} />
			),
			title: "Multiple Payment Options",
			description:
				"Accept payments via credit cards, PayPal, Stripe, bank transfers, and cryptocurrency."
		},
		{
			icon: <MobileOutlined style={{ fontSize: "2rem", color: "#009688" }} />,
			title: "Mobile Optimized",
			description:
				"Create and manage invoices on the go with our fully responsive mobile interface."
		},
		{
			icon: <BarChartOutlined style={{ fontSize: "2rem", color: "#009688" }} />,
			title: "Analytics & Reports",
			description:
				"Track your business performance with detailed analytics and generate financial reports."
		}
	];

	const steps = [
		{
			step: "1",
			title: "Create Your Invoice",
			description:
				"Choose from professional templates and add your business client information, and invoice items."
		},
		{
			step: "2",
			title: "Customize & Preview",
			description:
				"Personalize your invoice with your branding, adjust layouts, and preview before sending."
		},
		{
			step: "3",
			title: "Send & Get Paid",
			description:
				"Send directly via email, text, or download as PDF. Track views and receive payments instantly."
		}
	];

	const plans = [
		{
			name: "Starter",
			price: "$9",
			period: "/month",
			description: "Perfect for freelancers and small businesses",
			features: [
				"5 invoices per month",
				"Basic templates",
				"Email support",
				"Payment tracking",
				"Client management"
			],
			popular: false
		},
		{
			name: "Professional",
			price: "$19",
			period: "/month",
			description: "Best for growing businesses",
			features: [
				"Unlimited invoices",
				"Premium templates",
				"Priority support",
				"Advanced analytics",
				"Multi-currency support",
				"Custom branding"
			],
			popular: true
		},
		{
			name: "Enterprise",
			price: "$49",
			period: "/month",
			description: "For large teams and businesses",
			features: [
				"Everything in Professional",
				"Team collaboration",
				"Advanced integrations",
				"Dedicated support",
				"Custom workflows",
				"White-label solution"
			],
			popular: false
		}
	];

	const testimonials = [
		{
			name: "Sarah Johnson",
			role: "Freelance Designer",
			rating: 5,
			comment:
				"InvoiceFlow has transformed how I handle my invoices. The templates are beautiful and professional.",
			avatar: "SJ"
		},
		{
			name: "Mike Chen",
			role: "Tech Startup CEO",
			rating: 5,
			comment:
				"The analytics dashboard helped us identify payment trends and cash flow. Highly recommended!",
			avatar: "MC"
		},
		{
			name: "Emily Rodriguez",
			role: "Marketing Agency Owner",
			rating: 5,
			comment:
				"Client management and payment tracking features are top-notch. Our invoices look amazing!",
			avatar: "ER"
		}
	];

	const faqs = [
		{
			question: "How quickly can I create my first invoice?",
			answer:
				"You can create and send your first professional invoice in under 2 minutes using our intuitive templates and smart autofill features."
		},
		{
			question: "What payment methods can I accept?",
			answer:
				"We support all major payment methods including credit cards, PayPal, Stripe, bank transfers, and even cryptocurrency payments."
		},
		{
			question: "Is my data secure?",
			answer:
				"Yes, we use bank-level SSL encryption and comply with international security standards to keep your data completely safe."
		},
		{
			question: "Can I customize invoice templates?",
			answer:
				"Absolutely! You can customize colors, fonts, layouts, add your logo, and create templates that match your brand perfectly."
		},
		{
			question: "Do you offer customer support?",
			answer:
				"Yes, we provide 24/7 customer support via email, chat, and phone. Premium users get priority support with faster response times."
		}
	];

	return (
		<div style={{ minHeight: "100vh" }}>
			<style jsx>{`
				.animate-fade-in {
					animation: fadeIn 0.8s ease-in-out;
				}

				.animate-slide-up {
					animation: slideUp 0.6s ease-out;
				}

				.animate-bounce {
					animation: bounce 2s infinite;
				}

				.hover-scale {
					transition: transform 0.3s ease;
				}

				.hover-scale:hover {
					transform: scale(1.05);
				}

				.gradient-bg {
					background: linear-gradient(135deg, #009688 0%, #00796b 100%);
				}

				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes slideUp {
					from {
						opacity: 0;
						transform: translateY(40px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes bounce {
					0%,
					20%,
					50%,
					80%,
					100% {
						transform: translateY(0);
					}
					40% {
						transform: translateY(-10px);
					}
					60% {
						transform: translateY(-5px);
					}
				}

				.pricing-card-popular {
					border: 2px solid #009688;
					position: relative;
				}

				.popular-badge {
					position: absolute;
					top: -10px;
					right: 20px;
					background: #009688;
					padding: 4px 12px;
					border-radius: 12px;
					font-size: 12px;
					font-weight: bold;
				}
			`}</style>

			{/* Hero Section */}
			<div
				className="gradient-bg"
				style={{ padding: "80px 0", color: "white" }}
			>
				<div
					style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}
				>
					<div className={`text-center ${animationClass}`}>
						<Badge.Ribbon
							text="Trusted by 50,000+ businesses worldwide"
							color="#ff6b35"
							style={{ fontSize: "14px" }}
						>
							<div style={{ padding: "20px 0" }}>
								<Title
									level={1}
									style={{
										color: "white",
										fontSize: "3.5rem",
										marginBottom: "20px",
										fontWeight: "700"
									}}
								>
									Create Professional
									<br />
									Invoices in Minutes
								</Title>
								<Paragraph
									style={{
										color: "rgba(255,255,255,0.9)",
										fontSize: "1.2rem",
										maxWidth: "600px",
										margin: "0 auto 40px"
									}}
								>
									Streamline your billing process with our intuitive invoice
									generator. Create, customize, and send professional invoices
									that get you paid faster.
								</Paragraph>
								<Space size="large">
									<Button type="primary" size="large" className="hover-scale">
										Start Your Free Trial
									</Button>
									<Button
										size="large"
										className="hover-scale"
										type="default"
										onClick={handleGetStarted}
									>
										Login
									</Button>
								</Space>
								<Paragraph
									style={{
										color: "rgba(255,255,255,0.7)",
										marginTop: "20px"
									}}
								>
									No credit card required • 30-day free trial
								</Paragraph>
							</div>
						</Badge.Ribbon>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div style={{ padding: "80px 0", backgroundColor: "white" }}>
				<div
					style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}
				>
					<div className="text-center animate-slide-up">
						<Title level={2} style={{ marginBottom: "20px" }}>
							Everything You Need to Get Paid
						</Title>
						<Paragraph
							style={{
								fontSize: "1.1rem",
								color: "#666",
								maxWidth: "600px",
								margin: "0 auto 60px"
							}}
						>
							Powerful features designed to make invoicing simple, professional,
							and efficient
						</Paragraph>
					</div>

					<Row gutter={[32, 32]}>
						{features.map((feature, index) => (
							<Col xs={24} md={8} key={index}>
								<Card
									className="hover-scale animate-slide-up"
									style={{
										height: "100%",
										textAlign: "center",
										border: "1px solid #f0f0f0",
										borderRadius: "12px",
										boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
									}}
								>
									<div
										style={{ marginBottom: "20px" }}
										className="animate-bounce"
									>
										{feature.icon}
									</div>
									<Title level={4} style={{ marginBottom: "15px" }}>
										{feature.title}
									</Title>
									<Paragraph style={{ color: "#666" }}>
										{feature.description}
									</Paragraph>
								</Card>
							</Col>
						))}
					</Row>
				</div>
			</div>

			{/* Process Section */}
			<div style={{ padding: "80px 0", backgroundColor: "#fafafa" }}>
				<div
					style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}
				>
					<div className="text-center">
						<Title level={2} style={{ marginBottom: "20px" }}>
							Simple 3-Step Process
						</Title>
						<Paragraph
							style={{
								fontSize: "1.1rem",
								color: "#666",
								marginBottom: "60px"
							}}
						>
							Get your first invoice sent in under 3 minutes
						</Paragraph>
					</div>

					<Row gutter={[32, 32]} align="middle">
						{steps.map((step, index) => (
							<Col xs={24} md={8} key={index}>
								<Card style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
									<div className="text-center animate-slide-up">
										<div
											style={{
												width: "60px",
												height: "60px",
												backgroundColor: "#009688",
												color: "white",
												borderRadius: "50%",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												fontSize: "24px",
												fontWeight: "bold",
												margin: "0 auto 20px"
											}}
											className="animate-bounce"
										>
											{step.step}
										</div>
										<Title level={4} style={{ marginBottom: "15px" }}>
											{step.title}
										</Title>
										<Paragraph style={{ color: "#666" }}>
											{step.description}
										</Paragraph>
									</div>
								</Card>
							</Col>
						))}
					</Row>
				</div>
			</div>

			{/* Pricing Section */}
			<div style={{ padding: "80px 0", backgroundColor: "white" }}>
				<div
					style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}
				>
					<div className="text-center">
						<Title level={2} style={{ marginBottom: "20px" }}>
							Simple, Transparent Pricing
						</Title>
						<Paragraph
							style={{
								fontSize: "1.1rem",
								color: "#666",
								marginBottom: "60px"
							}}
						>
							Choose the plan that's right for your business
						</Paragraph>
					</div>

					<Row gutter={[32, 32]} justify="center">
						{plans.map((plan, index) => (
							<Col xs={24} md={8} key={index}>
								<Card
									className={`hover-scale animate-slide-up ${
										plan.popular ? "pricing-card-popular" : ""
									}`}
									style={{
										height: "100%",
										textAlign: "center",
										borderRadius: "12px",
										position: "relative",
										boxShadow: plan.popular
											? "0 8px 24px rgba(0,150,136,0.2)"
											: "0 4px 12px rgba(0,0,0,0.1)"
									}}
								>
									{plan.popular && (
										<div className="popular-badge">Most Popular</div>
									)}
									<div style={{ padding: "20px 0" }}>
										<Title level={4} style={{ marginBottom: "10px" }}>
											{plan.name}
										</Title>
										<div style={{ marginBottom: "15px" }}>
											<Text
												style={{
													fontSize: "2.5rem",
													fontWeight: "bold",
													color: "#009688"
												}}
											>
												{plan.price}
											</Text>
											<Text style={{ color: "#666" }}>{plan.period}</Text>
										</div>
										<Paragraph style={{ color: "#666", marginBottom: "30px" }}>
											{plan.description}
										</Paragraph>

										<div style={{ textAlign: "left", marginBottom: "30px" }}>
											{plan.features.map((feature, fIndex) => (
												<div key={fIndex} style={{ marginBottom: "8px" }}>
													<CheckCircleOutlined
														style={{ color: "#009688", marginRight: "8px" }}
													/>
													<Text>{feature}</Text>
												</div>
											))}
										</div>

										<Button
											type={plan.popular ? "primary" : "default"}
											size="large"
											style={{
												width: "100%",
												height: "45px",
												backgroundColor: plan.popular ? "#009688" : undefined
											}}
										>
											{plan.popular ? "Start Free Trial" : "Contact Sales"}
										</Button>
									</div>
								</Card>
							</Col>
						))}
					</Row>
				</div>
			</div>

			{/* Testimonials Section */}
			<div style={{ padding: "80px 0", backgroundColor: "#fafafa" }}>
				<div
					style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}
				>
					<div className="text-center">
						<Title level={2} style={{ marginBottom: "60px" }}>
							What Our Customers Say
						</Title>
					</div>

					<Row gutter={[32, 32]}>
						{testimonials.map((testimonial, index) => (
							<Col xs={24} md={8} key={index}>
								<Card
									className="hover-scale animate-slide-up"
									style={{
										height: "100%",
										borderRadius: "12px",
										boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
									}}
								>
									<div
										style={{
											textAlign: "center",
											marginBottom: "20px",
											display: "flex",
											flexDirection: "column",
											justifyContent: "center",
											alignItems: "center"
										}}
									>
										<Avatar
											size={64}
											style={{
												backgroundColor: "#009688",
												marginBottom: "15px"
											}}
										>
											{testimonial.avatar}
										</Avatar>
										<Rate
											disabled
											defaultValue={testimonial.rating}
											style={{ color: "#009688" }}
										/>
									</div>
									<Paragraph
										style={{
											fontStyle: "italic",
											marginBottom: "20px",
											textAlign: "center"
										}}
									>
										"{testimonial.comment}"
									</Paragraph>
									<div style={{ textAlign: "center" }}>
										<Text strong>{testimonial.name}</Text>
										<br />
										<Text style={{ color: "#666" }}>{testimonial.role}</Text>
									</div>
								</Card>
							</Col>
						))}
					</Row>
				</div>
			</div>

			{/* FAQ Section */}
			{/* <div style={{ padding: "80px 0", backgroundColor: "white" }}>
				<div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px" }}>
					<div className="text-center">
						<Title level={2} style={{ marginBottom: "20px" }}>
							Frequently Asked Questions
						</Title>
						<Paragraph
							style={{
								fontSize: "1.1rem",
								color: "#666",
								marginBottom: "60px"
							}}
						>
							Got questions? We've got answers. If you can't find what you're
							looking for, feel free to contact our support team!
						</Paragraph>
					</div>

					<Collapse
						ghost
						expandIcon={({ isActive }) => (
							<QuestionCircleOutlined rotate={isActive ? 90 : 0} />
						)}
						className="animate-slide-up"
					>
						{faqs.map((faq, index) => (
							<Panel
								header={
									<Text strong style={{ fontSize: "16px" }}>
										{faq.question}
									</Text>
								}
								key={index}
							>
								<Paragraph style={{ color: "#666", paddingLeft: "24px" }}>
									{faq.answer}
								</Paragraph>
							</Panel>
						))}
					</Collapse>
				</div>
			</div> */}

			{/* CTA Section */}
			<div
				className="gradient-bg"
				style={{ padding: "80px 0", color: "white" }}
			>
				<div
					style={{
						maxWidth: "800px",
						margin: "0 auto",
						padding: "0 20px",
						textAlign: "center"
					}}
				>
					<Title level={2} style={{ color: "white", marginBottom: "20px" }}>
						Ready to Get Paid Faster?
					</Title>
					<Paragraph
						style={{
							color: "rgba(255,255,255,0.9)",
							fontSize: "1.2rem",
							marginBottom: "40px"
						}}
					>
						Join thousands of businesses that trust InvoiceFlow for their
						billing needs.
					</Paragraph>
					<Space size="large">
						<Button type="primary" size="large" className="hover-scale">
							Start Your Free Trial
						</Button>
						<Button type="default" size="large" className="hover-scale">
							Contact Sales
						</Button>
					</Space>
				</div>
			</div>

			{/* Footer */}
			<div
				style={{
					padding: "40px 0",
					backgroundColor: "#1f1f1f",
					color: "white"
				}}
			>
				<div
					style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}
				>
					<Row gutter={[32, 32]}>
						<Col xs={24} md={6}>
							<Title level={4} style={{ color: "white", marginBottom: "20px" }}>
								InvoiceFlow
							</Title>
							<Paragraph style={{ color: "rgba(255,255,255,0.7)" }}>
								Create beautiful invoices and get paid faster with our
								professional service.
							</Paragraph>
						</Col>
						<Col xs={12} md={6}>
							<Title level={5} style={{ color: "white", marginBottom: "15px" }}>
								Product
							</Title>
							<div style={{ color: "rgba(255,255,255,0.7)" }}>
								<div style={{ marginBottom: "8px" }}>Features</div>
								<div style={{ marginBottom: "8px" }}>Pricing</div>
								<div style={{ marginBottom: "8px" }}>Templates</div>
								<div style={{ marginBottom: "8px" }}>Integrations</div>
							</div>
						</Col>
						<Col xs={12} md={6}>
							<Title level={5} style={{ color: "white", marginBottom: "15px" }}>
								Support
							</Title>
							<div style={{ color: "rgba(255,255,255,0.7)" }}>
								<div style={{ marginBottom: "8px" }}>Help Center</div>
								<div style={{ marginBottom: "8px" }}>Contact Us</div>
								<div style={{ marginBottom: "8px" }}>API Docs</div>
								<div style={{ marginBottom: "8px" }}>Status</div>
							</div>
						</Col>
						<Col xs={24} md={6}>
							<Title level={5} style={{ color: "white", marginBottom: "15px" }}>
								Contact
							</Title>
							<div style={{ color: "rgba(255,255,255,0.7)" }}>
								<div style={{ marginBottom: "8px" }}>hello@invoiceflow.com</div>
								<div style={{ marginBottom: "8px" }}>+1 (555) 123-4567</div>
								<div style={{ marginBottom: "8px" }}>San Francisco, CA</div>
							</div>
						</Col>
					</Row>
					<Divider style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
					<div style={{ textAlign: "center", color: "rgba(255,255,255,0.7)" }}>
						© 2024 InvoiceFlow. All rights reserved. | Privacy Policy | Terms of
						Service | Cookie Policy
					</div>
				</div>
			</div>
		</div>
	);
};

export default InvoiceLandingPage;
