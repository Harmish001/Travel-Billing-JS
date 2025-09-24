'use client';

import React from 'react';
import { Typography, Card, Row, Col, Statistic, Space, Button } from 'antd';
import {
  FileTextOutlined,
  DollarOutlined,
  UserOutlined,
  TrophyOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/src/context/AuthContext';
import { themeColors } from '@/src/styles/theme';

const { Title, Paragraph } = Typography;

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data for dashboard statistics
  const stats = [
    {
      title: 'Total Invoices',
      value: 12,
      prefix: <FileTextOutlined style={{ color: themeColors.primary }} />,
      suffix: '',
    },
    {
      title: 'Revenue This Month',
      value: 24850,
      prefix: <DollarOutlined style={{ color: themeColors.secondary }} />,
      suffix: '',
      precision: 2,
    },
    {
      title: 'Active Clients',
      value: 8,
      prefix: <UserOutlined style={{ color: themeColors.accent1 }} />,
      suffix: '',
    },
    {
      title: 'Completion Rate',
      value: 95.5,
      prefix: <TrophyOutlined style={{ color: themeColors.accent2 }} />,
      suffix: '%',
    },
  ];

  const quickActions = [
    {
      title: 'Create New Invoice',
      description: 'Generate a new invoice for your clients',
      icon: <FileTextOutlined style={{ fontSize: 24, color: themeColors.primary }} />,
      action: () => {
        // TODO: Navigate to invoice creation
        console.log('Create new invoice');
      },
    },
    {
      title: 'View All Invoices',
      description: 'Manage and view all your invoices',
      icon: <FileTextOutlined style={{ fontSize: 24, color: themeColors.secondary }} />,
      action: () => {
        // TODO: Navigate to invoice list
        console.log('View all invoices');
      },
    },
  ];

  return (
    <div>
      {/* Welcome Section */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ color: themeColors.neutralDark, marginBottom: 8 }}>
          Welcome back, {user?.businessName || 'User'}! 👋
        </Title>
        <Paragraph style={{ fontSize: 16, color: themeColors.neutralDark, opacity: 0.8 }}>
          Here's what's happening with your travel business today.
        </Paragraph>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              style={{
                background: themeColors.white,
                border: `1px solid ${themeColors.neutralLight}`,
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
              }}
              hoverable
              bodyStyle={{ padding: '20px' }}
            >
              <Statistic
                title={
                  <span style={{ color: themeColors.neutralDark, fontSize: 14 }}>
                    {stat.title}
                  </span>
                }
                value={stat.value}
                precision={stat.precision || 0}
                prefix={stat.prefix}
                suffix={stat.suffix}
                valueStyle={{
                  color: themeColors.neutralDark,
                  fontSize: 24,
                  fontWeight: 'bold',
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <div style={{ marginBottom: 32 }}>
        <Title level={3} style={{ color: themeColors.neutralDark, marginBottom: 16 }}>
          Quick Actions
        </Title>
        <Row gutter={[16, 16]}>
          {quickActions.map((action, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <Card
                style={{
                  background: themeColors.white,
                  border: `1px solid ${themeColors.neutralLight}`,
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  height: '100%',
                }}
                hoverable
                bodyStyle={{ padding: '24px', height: '100%' }}
                actions={[
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={action.action}
                    style={{
                      backgroundColor: themeColors.primary,
                      borderColor: themeColors.primary,
                    }}
                    key="action"
                  >
                    Get Started
                  </Button>,
                ]}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ textAlign: 'center' }}>
                    {action.icon}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Title level={4} style={{ color: themeColors.neutralDark, marginBottom: 8 }}>
                      {action.title}
                    </Title>
                    <Paragraph
                      style={{
                        color: themeColors.neutralDark,
                        opacity: 0.7,
                        margin: 0,
                        fontSize: 14,
                      }}
                    >
                      {action.description}
                    </Paragraph>
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Recent Activity Placeholder */}
      <Card
        title={
          <span style={{ color: themeColors.neutralDark, fontSize: 18 }}>
            Recent Activity
          </span>
        }
        style={{
          background: themeColors.white,
          border: `1px solid ${themeColors.neutralLight}`,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: themeColors.neutralDark,
            opacity: 0.6,
          }}
        >
          <FileTextOutlined style={{ fontSize: 48, marginBottom: 16 }} />
          <Paragraph>
            No recent activity to show. Start by creating your first invoice!
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;