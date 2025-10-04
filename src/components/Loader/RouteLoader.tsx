import React from "react";
import { Spin, Flex } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const RouteLoader: React.FC = () => {
  return (
    <Flex 
      justify="center" 
      align="center" 
      style={{ 
        height: "100%", 
        width: "100%",
        minHeight: "200px"
      }}
    >
      <Spin 
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} 
        size="large" 
      />
    </Flex>
  );
};

export default RouteLoader;