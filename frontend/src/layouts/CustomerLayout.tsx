import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Badge, Button, Typography } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  CarOutlined,
  HistoryOutlined,
  CreditCardOutlined,
  UserOutlined,
  FileProtectOutlined,
  BellOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

export const CustomerLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const currentUser = api.auth.getCurrentUser();

  // If user is not authenticated or not a customer, redirect to appropriate portal
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/auth/login');
    } else if (currentUser.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (currentUser.role === 'manager') {
      navigate('/manager/dashboard');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleLogout = async () => {
    await api.auth.logout();
    navigate('/auth/login');
  };

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Tổng quan chuyến đi', path: '/customer/dashboard' },
    { key: 'vehicles', icon: <CarOutlined />, label: 'Tìm kiếm & Đặt xe', path: '/vehicles' },
    { key: 'rentals', icon: <HistoryOutlined />, label: 'Đơn thuê & Hợp đồng', path: '/customer/rentals' },
    { key: 'payments', icon: <CreditCardOutlined />, label: 'Lịch sử Thanh toán', path: '/customer/payments' },
    { key: 'profile', icon: <UserOutlined />, label: 'Hồ sơ cá nhân', path: '/customer/profile' },
    { key: 'documents', icon: <FileProtectOutlined />, label: 'Giấy tờ GPLX/CCCD', path: '/customer/documents' },
    { key: 'notifications', icon: <BellOutlined />, label: 'Thông báo', path: '/customer/notifications' },
    { key: 'support', icon: <QuestionCircleOutlined />, label: 'Hỗ trợ sự cố 24/7', path: '/customer/support' }
  ];

  const handleMenuClick = (e: { key: string }) => {
    const item = menuItems.find(i => i.key === e.key);
    if (item) {
      navigate(item.path);
    }
  };

  const getActiveKey = () => {
    const active = menuItems.find(item => location.pathname.startsWith(item.path));
    return active ? [active.key] : ['dashboard'];
  };

  const userDropdownItems = [
    { key: 'profile', label: 'Hồ sơ cá nhân', icon: <UserOutlined />, onClick: () => navigate('/customer/profile') },
    { key: 'rentals', label: 'Đơn thuê của tôi', icon: <HistoryOutlined />, onClick: () => navigate('/customer/rentals') },
    { type: 'divider' as const },
    { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, onClick: handleLogout }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="light"
        style={{ 
          borderRight: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          height: '100vh',
          left: 0
        }}
      >
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          padding: collapsed ? '0' : '0 20px', 
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: collapsed ? 0 : '10px'
          }}>
            <CarOutlined style={{ fontSize: '18px', color: '#fbbf24' }} />
          </div>
          {!collapsed && (
            <Title level={4} style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              AutoRent
            </Title>
          )}
        </div>
        
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={getActiveKey()}
          onClick={handleMenuClick}
          style={{ borderRight: 'none', marginTop: '16px' }}
          items={menuItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: item.label
          }))}
        />
      </Sider>

      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: '#ffffff', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #e2e8f0',
          height: '64px',
          position: 'sticky',
          top: 0,
          zIndex: 99
        }}>
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: '40px', height: '40px' }}
            />
          </Space>

          <Space size={20}>
            <Badge count={2} size="small" style={{ backgroundColor: '#d97706' }}>
              <Button 
                type="text" 
                icon={<BellOutlined style={{ fontSize: '18px' }} />} 
                onClick={() => navigate('/customer/notifications')}
                style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              />
            </Badge>

            <Dropdown menu={{ items: userDropdownItems }} placement="bottomRight" trigger={['click']}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#1e3a8a' }} icon={<UserOutlined />} />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                  <Text strong style={{ fontSize: '13px' }}>{currentUser.name}</Text>
                  <Text type="secondary" style={{ fontSize: '11px', color: '#d97706', fontWeight: 600 }}>Thành viên Vàng</Text>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ 
          margin: '24px', 
          minHeight: 280,
          overflow: 'initial'
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
