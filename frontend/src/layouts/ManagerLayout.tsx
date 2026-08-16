import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Badge, Button, Typography, Tag, Tooltip } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  CalendarOutlined,
  SwapOutlined,
  ToolOutlined,
  SafetyCertificateOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  CarOutlined,
  ClockCircleOutlined,
  CheckSquareOutlined,
  ExportOutlined,
  ImportOutlined,
  UserSwitchOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

export const ManagerLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [stats, setStats] = useState<{ pendingBookings?: number; pendingVerifications?: number; maintenanceCars?: number }>({
    pendingBookings: 3,
    pendingVerifications: 2,
    maintenanceCars: 1
  });
  const currentUser = api.auth.getCurrentUser();

  // Route protection
  useEffect(() => {
    if (!currentUser) {
      navigate('/auth/login');
    } else if (currentUser.role !== 'manager' && currentUser.role !== 'admin') {
      navigate('/customer/dashboard');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    // Quick ops count
    api.dashboard.getKpis()
      .then((data: any) => {
        if (data) {
          setStats({
            pendingBookings: data.pendingBookings ?? 3,
            pendingVerifications: data.pendingVerifications ?? 2,
            maintenanceCars: data.maintenanceVehicles ?? 1
          });
        }
      })
      .catch(() => {});
  }, []);

  if (!currentUser) return null;

  const handleLogout = async () => {
    await api.auth.logout();
    navigate('/auth/login');
  };

  // Grouped Menu Items per AutoRent 2.0 Spec (Section 11.2 & Section 59)
  const menuItems = [
    {
      key: 'grp-mgr-overview',
      type: 'group' as const,
      label: <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>TỔNG QUAN VẬN HÀNH</span>,
      children: [
        {
          key: '/manager/dashboard',
          icon: <DashboardOutlined />,
          label: 'Operations Center',
        }
      ]
    },
    {
      key: 'grp-mgr-operations',
      type: 'group' as const,
      label: <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>ĐIỀU PHỐI & GIAO NHẬN</span>,
      children: [
        {
          key: '/manager/bookings',
          icon: <CalendarOutlined />,
          label: (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Booking Queue</span>
              {stats.pendingBookings ? <Badge count={stats.pendingBookings} size="small" style={{ backgroundColor: '#dc2626' }} /> : null}
            </div>
          ),
        },
        {
          key: '/manager/operations/today',
          icon: <ClockCircleOutlined />,
          label: "Lịch trình hôm nay (Today's Ops)",
        },
        {
          key: '/manager/pickup/quick',
          icon: <ExportOutlined />,
          label: 'Bàn giao xe (Pickup Wizard)',
        },
        {
          key: '/manager/return/quick',
          icon: <ImportOutlined />,
          label: 'Nhận xe trả (Return Wizard)',
        }
      ]
    },
    {
      key: 'grp-mgr-customers',
      type: 'group' as const,
      label: <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>HỒ SƠ KHÁCH HÀNG</span>,
      children: [
        {
          key: '/manager/verification',
          icon: <SafetyCertificateOutlined />,
          label: (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Duyệt GPLX / Verification</span>
              {stats.pendingVerifications ? <Badge count={stats.pendingVerifications} size="small" style={{ backgroundColor: '#2563eb' }} /> : null}
            </div>
          ),
        }
      ]
    },
    {
      key: 'grp-mgr-fleet',
      type: 'group' as const,
      label: <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>ĐỘI XE CHI NHÁNH</span>,
      children: [
        {
          key: '/manager/fleet',
          icon: <CarOutlined />,
          label: 'Tình trạng Đội xe',
        },
        {
          key: '/manager/maintenance',
          icon: <ToolOutlined />,
          label: (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Lịch Bảo dưỡng xe</span>
              {stats.maintenanceCars ? <Badge count={stats.maintenanceCars} size="small" style={{ backgroundColor: '#f59e0b' }} /> : null}
            </div>
          ),
        }
      ]
    }
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const getSelectedKeys = () => {
    return [location.pathname];
  };

  const userDropdownItems = [
    { key: 'role-switch', label: 'Chi nhánh Đống Đa - Hà Nội', icon: <SafetyCertificateOutlined />, disabled: true },
    { type: 'divider' as const },
    { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, onClick: handleLogout }
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={260}
        theme="dark"
        style={{ 
          position: 'sticky',
          top: 0,
          height: '100vh',
          left: 0,
          backgroundColor: '#0f172a',
          boxShadow: '2px 0 12px rgba(15, 23, 42, 0.12)',
          zIndex: 100,
          overflowY: 'auto'
        }}
      >
        {/* Brand Header */}
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          padding: collapsed ? '0' : '0 20px', 
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)',
          cursor: 'pointer'
        }}
        onClick={() => navigate('/manager/dashboard')}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: collapsed ? 0 : '12px',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}>
            <SafetyCertificateOutlined style={{ fontSize: '20px', color: '#60a5fa' }} />
          </div>
          {!collapsed && (
            <div>
              <Title level={5} style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                AutoRent <span style={{ color: '#60a5fa' }}>Ops</span>
              </Title>
              <Text style={{ fontSize: '11px', color: '#94a3b8' }}>Operations Workspace</Text>
            </div>
          )}
        </div>
        
        {/* Grouped Navigation Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          onClick={handleMenuClick}
          style={{ borderRight: 'none', marginTop: '8px', backgroundColor: '#0f172a' }}
          items={menuItems}
        />
      </Sider>

      <Layout>
        {/* Top Header */}
        <Header style={{ 
          padding: '0 28px', 
          background: '#ffffff', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #e2e8f0',
          height: '64px',
          position: 'sticky',
          top: 0,
          zIndex: 99,
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)'
        }}>
          <Space size={16}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: '40px', height: '40px' }}
            />
            <Tag color="blue" style={{ borderRadius: '6px', fontWeight: 600, border: 'none', padding: '4px 10px' }}>
              OPERATIONS WORKSPACE
            </Tag>
          </Space>

          <Space size={20}>
            <Tooltip title="Nhiệm vụ cần xử lý">
              <Badge count={(stats.pendingBookings || 0) + (stats.pendingVerifications || 0)} size="small" style={{ backgroundColor: '#dc2626' }}>
                <Button 
                  type="text" 
                  icon={<BellOutlined style={{ fontSize: '18px', color: '#475569' }} />} 
                  onClick={() => navigate('/manager/bookings')}
                  style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                />
              </Badge>
            </Tooltip>

            <Dropdown menu={{ items: userDropdownItems }} placement="bottomRight" trigger={['click']}>
              <Space style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <Avatar style={{ backgroundColor: '#1e3a8a' }} icon={<SafetyCertificateOutlined />} />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                  <Text strong style={{ fontSize: '13px', color: '#0f172a' }}>{currentUser.name}</Text>
                  <Text type="secondary" style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600 }}>Quản lý Chi nhánh</Text>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ 
          margin: '24px 28px', 
          minHeight: 280,
          overflow: 'initial'
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
