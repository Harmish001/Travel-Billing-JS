import React from "react";
import { Spin, Flex } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface LoaderProps {
	fullScreen?: boolean;
	size?: "small" | "default" | "large";
	tip?: string;
	style?: React.CSSProperties;
	spinning?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
	fullScreen = true,
	size = "large",
	tip,
	style,
	spinning = true
}) => {
	const loader = <Spin size={size} tip={tip} spinning={spinning} />;

	if (fullScreen) {
		return (
			<Flex
				justify="center"
				align="center"
				style={{
					height: "100vh",
					width: "100%",
					...style
				}}
			>
				{loader}
			</Flex>
		);
	}

	return (
		<Flex
			justify="center"
			align="center"
			style={{
				minHeight: "100px",
				width: "100%",
				...style
			}}
		>
			{loader}
		</Flex>
	);
};

export default Loader;
