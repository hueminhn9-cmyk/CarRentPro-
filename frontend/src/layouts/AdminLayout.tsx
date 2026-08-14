import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Badge, Button, Typography } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  CarOutlined,
  CalendarOutlined,
  TeamOutlined,
  LineChartOutlined,
  ToolOutlined,
  FileDoneOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const currentUser = api.auth.getCurrentUser();

  // If user is not authenticated or not an admin, redirect
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/auth/login');
    } else if (currentUser.role !== 'admin') {
      navigate('/customer/dashboard');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleLogout = async () => {
    await api.auth.logout();
    navigate('/auth/login');
  };

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Bảng quản trị hệ thống', path: '/admin/dashboard' },
    { key: 'managers', icon: <TeamOutlined />, label: 'Quản lý Nhân sự (Managers)', path: '/admin/managers' },
    { key: 'vehicles', icon: <CarOutlined />, label: 'Chiến lược & Giá đội xe', path: '/admin/vehicles' },
    { key: 'bookings', icon: <CalendarOutlined />, label: 'Giám sát Đơn thuê', path: '/admin/bookings' },
    { key: 'customers', icon: <UserOutlined />, label: 'Danh sách Khách hàng', path: '/admin/customers' },
    { key: 'revenue', icon: <LineChartOutlined />, label: 'Báo cáo Doanh thu & Lợi nhuận', path: '/admin/revenue' },
    { key: 'maintenance', icon: <ToolOutlined />, label: 'Thống kê Bảo dưỡng', path: '/admin/maintenance' },
    { key: 'contracts', icon: <FileDoneOutlined />, label: 'Kho Hợp đồng', path: '/admin/contracts' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Cài đặt Doanh nghiệp & Audit Logs', path: '/admin/settings' }
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
    { key: 'settings', label: 'Cài đặt hệ thống', icon: <SettingOutlined />, onClick: () => navigate('/admin/settings') },
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
            <CarOutlined style={{ fontSize: '18px', color: '#fbbf24' }} />
          </div>
          {!collapsed && (
            <div>
              <Title level={5} style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                AutoRent <span style={{ color: '#fbbf24' }}>Admin</span>
              </Title>
              <Text style={{ fontSize: '10px', color: '#94a3b8' }}>Quản trị Doanh nghiệp</Text>
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
                style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              />
            </Badge>

            <Dropdown menu={{ items: userDropdownItems }} placement="bottomRight" trigger={['click']}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#1e3a8a' }} icon={<UserOutlined />} />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                  <Text strong style={{ fontSize: '13px' }}>{currentUser.name}</Text>
                  <Text type="secondary" style={{ fontSize: '11px', color: '#1e3a8a', fontWeight: 600 }}>Quản trị hệ thống</Text>
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
