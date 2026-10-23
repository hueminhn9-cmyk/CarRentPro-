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
  ExportOutlined,
  ImportOutlined,
  CrownOutlined
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
    } else if (currentUser.role?.toLowerCase() !== 'manager' && currentUser.role?.toLowerCase() !== 'admin') {
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
      .catch(() => { });
  }, []);

  if (!currentUser) return null;

  const handleLogout = async () => {
    await api.auth.logout();
    navigate('/auth/login');
  };

  // Natural Operational Flow: Step-by-step from Overview -> Daily Workflow -> Compliance & Fleet
  const menuItems = [
    {
      key: 'grp-mgr-dashboard',
      type: 'group' as const,
      label: (
        <span style={{ color: '#0284c7', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em' }}>
          🏢 TỔNG QUAN SHOWROOM
        </span>
      ),
      children: [
        {
          key: '/manager/dashboard',
          icon: <DashboardOutlined style={{ fontSize: '16px', color: '#0284c7' }} />,
          label: 'Bàn Điều phối Vận hành',
        }
      ]
    },
    {
      key: 'grp-mgr-workflow',
      type: 'group' as const,
      label: (
        <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em' }}>
          ⚡ QUY TRÌNH GIAO NHẬN HÀNG NGÀY
        </span>
      ),
      children: [
        {
          key: '/manager/bookings',
          icon: <CalendarOutlined style={{ fontSize: '16px', color: '#2563eb' }} />,
          label: (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>1. Hàng đợi Đơn thuê</span>
              {stats.pendingBookings ? <Badge count={stats.pendingBookings} size="small" style={{ backgroundColor: '#dc2626' }} /> : null}
            </div>
          ),
        },
        {
          key: '/manager/operations/today',
          icon: <ClockCircleOutlined style={{ fontSize: '16px', color: '#0d9488' }} />,
          label: "2. Lịch trình hôm nay",
        },
        {
          key: '/manager/pickup/quick',
          icon: <ExportOutlined style={{ fontSize: '16px', color: '#16a34a' }} />,
          label: '3. Giao xe',
        },
        {
          key: '/manager/return/quick',
          icon: <ImportOutlined style={{ fontSize: '16px', color: '#ea580c' }} />,
          label: '4. Nhận xe trả',
        }
      ]
    },
    {
      key: 'grp-mgr-compliance',
      type: 'group' as const,
      label: (
        <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em' }}>
          📋 KIỂM SOÁT HỒ SƠ & BẰNG LÁI
        </span>
      ),
      children: [
        {
          key: '/manager/verification',
          icon: <SafetyCertificateOutlined style={{ fontSize: '16px', color: '#7c3aed' }} />,
          label: (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Duyệt GPLX & Danh tính</span>
              {stats.pendingVerifications ? <Badge count={stats.pendingVerifications} size="small" style={{ backgroundColor: '#2563eb' }} /> : null}
            </div>
          ),
        }
      ]
    },
    {
      key: 'grp-mgr-fleet',
      type: 'group' as const,
      label: (
        <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em' }}>
          🚗 ĐỘI XE TẠI SHOWROOM
        </span>
      ),
      children: [
        {
          key: '/manager/fleet',
          icon: <CarOutlined style={{ fontSize: '16px', color: '#0891b2' }} />,
          label: 'Tình trạng Đội xe tại bãi',
        },
        {
          key: '/manager/maintenance',
          icon: <ToolOutlined style={{ fontSize: '16px', color: '#d97706' }} />,
          label: (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Lịch Kỹ thuật & Bảo dưỡng</span>
              {stats.maintenanceCars ? <Badge count={stats.maintenanceCars} size="small" style={{ backgroundColor: '#ea580c' }} /> : null}
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
    { key: 'role-switch', label: 'Chi nhánh Hải Châu - Đà Nẵng', icon: <SafetyCertificateOutlined />, disabled: true },
    ...(currentUser.role === 'admin' ? [{ key: 'switch-admin', label: 'Chuyển sang Bàn Quản trị', icon: <CrownOutlined />, onClick: () => navigate('/admin/dashboard') }] : []),
    { type: 'divider' as const },
    { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, onClick: handleLogout }
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={275}
        theme="light"
        className="manager-sider"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          left: 0,
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          boxShadow: '2px 0 12px rgba(15, 23, 42, 0.04)',
          zIndex: 100,
          overflowY: 'auto'
        }}
      >
        {/* Brand Header */}
        <div style={{
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          padding: collapsed ? '0' : '0 20px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderBottom: '1px solid #f1f5f9',
          background: '#ffffff',
          cursor: 'pointer'
        }}
          onClick={() => navigate('/manager/dashboard')}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: collapsed ? 0 : '12px',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
            flexShrink: 0
          }}>
            <CarOutlined style={{ fontSize: '20px', color: '#ffffff' }} />
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                  AutoRent
                </span>
                <Tag color="cyan" style={{ fontSize: '9px', fontWeight: 800, padding: '0 5px', borderRadius: '4px', margin: 0 }}>
                  SHOWROOM OPS
                </Tag>
              </div>
              <Text style={{ fontSize: '11px', color: '#64748b', fontWeight: 500, display: 'block' }}>Vận Hành Chi Nhánh</Text>
            </div>
          )}
        </div>

        {/* Grouped Navigation Menu */}
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          onClick={handleMenuClick}
          style={{ borderRight: 'none', padding: '6px 0 20px 0' }}
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
          borderTop: '3px solid #0284c7',
          height: '68px',
          position: 'sticky',
          top: 0,
          zIndex: 99,
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)'
        }}>
          <Space size={14}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: '40px', height: '40px' }}
            />
            <Tag 
              style={{ 
                background: '#f0f9ff', 
                color: '#0369a1', 
                border: '1px solid #bae6fd', 
                borderRadius: '6px', 
                fontWeight: 700, 
                padding: '4px 12px',
                fontSize: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <CarOutlined style={{ color: '#0284c7' }} /> ĐIỀU PHỐI VẬN HÀNH SHOWROOM
            </Tag>
            <Tag color="cyan" style={{ borderRadius: '6px', fontWeight: 600, padding: '4px 10px' }}>
              📍 Chi nhánh Hải Châu - Đà Nẵng
            </Tag>
          </Space>

          <Space size={16}>
            {/* Quick Switcher back to Admin Suite for Admin users */}
            {currentUser.role === 'admin' && (
              <Button 
                icon={<CrownOutlined />} 
                onClick={() => navigate('/admin/dashboard')}
                style={{ 
                  background: '#f5f3ff', 
                  borderColor: '#c4b5fd', 
                  color: '#6d28d9', 
                  fontWeight: 600, 
                  borderRadius: '8px',
                  height: '38px'
                }}
              >
                Chuyển sang Bàn Quản trị
              </Button>
            )}

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
              <Space style={{ cursor: 'pointer', padding: '5px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <Avatar style={{ backgroundColor: '#0284c7' }} icon={<SafetyCertificateOutlined />} />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                  <Text strong style={{ fontSize: '13px', color: '#0f172a' }}>{currentUser.name || 'Quản lý Showroom'}</Text>
                  <Text style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700 }}>Giám Đốc Chi Nhánh</Text>
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
