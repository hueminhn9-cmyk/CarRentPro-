import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Badge, Button, Typography, Tag } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  FileDoneOutlined,
  CalendarOutlined,
  CarOutlined,
  UserOutlined,
  UserSwitchOutlined,
  ToolOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  SafetyCertificateOutlined,
  SwapOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

export const ManagerLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const currentUser = api.auth.getCurrentUser();

  React.useEffect(() => {
    if (!currentUser) {
      navigate('/auth/login');
    } else if (currentUser.role !== 'manager' && currentUser.role !== 'admin') {
      navigate('/customer/dashboard');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleLogout = async () => {
    await api.auth.logout();
    navigate('/auth/login');
  };

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Bảng vận hành', path: '/manager/dashboard' },
    { key: 'bookings', icon: <CalendarOutlined />, label: 'Duyệt & Quản lý Đơn thuê', path: '/manager/bookings' },
    { key: 'contracts', icon: <FileDoneOutlined />, label: 'Tạo & Ký Hợp đồng', path: '/manager/contracts' },
    { key: 'handover', icon: <SwapOutlined />, label: 'Bàn giao & Nhận xe', path: '/manager/handover/B001' },
    { key: 'customers', icon: <UserSwitchOutlined />, label: 'Duyệt GPLX / Khách hàng', path: '/manager/customers' },
    { key: 'maintenance', icon: <ToolOutlined />, label: 'Bảo dưỡng & Trạng thái xe', path: '/manager/maintenance' },
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
    { key: 'role-switch', label: 'Tài khoản Quản lý', icon: <SafetyCertificateOutlined />, disabled: true },
    { type: 'divider' as const },
    { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, onClick: handleLogout }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="dark"
        style={{ 
          position: 'sticky',
          top: 0,
          height: '100vh',
          left: 0,
          backgroundColor: '#0f172a',
          boxShadow: '2px 0 8px rgba(15, 23, 42, 0.15)'
        }}
      >
        {/* Brand Header */}
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          padding: collapsed ? '0' : '0 20px', 
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)'
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
            <SafetyCertificateOutlined style={{ fontSize: '18px', color: '#fbbf24' }} />
          </div>
          {!collapsed && (
            <div>
              <Title level={5} style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                AutoRent <span style={{ color: '#fbbf24' }}>Ops</span>
              </Title>
              <Text style={{ fontSize: '10px', color: '#94a3b8' }}>Khu vực Vận hành & Hợp đồng</Text>
            </div>
          )}
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getActiveKey()}
          onClick={handleMenuClick}
          style={{ borderRight: 'none', marginTop: '12px', backgroundColor: '#0f172a' }}
          items={menuItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: item.label
          }))}
        />
      </Sider>

      <Layout>
        {/* Top Header */}
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
            <Badge count={5} size="small" style={{ backgroundColor: '#dc2626' }}>
              <Button 
                type="text" 
                icon={<BellOutlined style={{ fontSize: '18px' }} />} 
                style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              />
            </Badge>

            <Dropdown menu={{ items: userDropdownItems }} placement="bottomRight" trigger={['click']}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#1e3a8a' }} icon={<SafetyCertificateOutlined />} />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                  <Text strong style={{ fontSize: '13px', color: '#0f172a' }}>{currentUser.name}</Text>
                  <Text type="secondary" style={{ fontSize: '11px', color: '#d97706', fontWeight: 600 }}>Chi nhánh Đống Đa</Text>
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
