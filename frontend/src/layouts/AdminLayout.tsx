import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Badge, Button, Typography, Tag, Tooltip } from 'antd';
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
  BellOutlined,
  SwapOutlined,
  SafetyCertificateOutlined,
  StarOutlined,
  DollarOutlined,
  FileTextOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

export const AdminLayout: React.FC = () => {
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
    } else if (currentUser.role !== 'admin') {
      navigate('/customer/dashboard');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    // Fetch quick stats for badge notification
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
      .catch(() => {
        // Fallback gracefully
      });
  }, []);

  if (!currentUser) return null;

  const handleLogout = async () => {
    await api.auth.logout();
    navigate('/auth/login');
  };

  // Grouped Menu Items per AutoRent 2.0 Spec (Section 11.3 & Section 59)
  const menuItems = [
    {
      key: 'grp-overview',
      type: 'group' as const,
      label: <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>TỔNG QUAN</span>,
      children: [
        {
          key: '/admin/dashboard',
          icon: <DashboardOutlined />,
          label: 'Executive Dashboard',
        }
      ]
    },
    {
      key: 'grp-operations',
      type: 'group' as const,
      label: <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>VẬN HÀNH</span>,
      children: [
        {
          key: '/admin/bookings',
          icon: <CalendarOutlined />,
          label: (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Đơn thuê xe</span>
              {stats.pendingBookings ? <Badge count={stats.pendingBookings} size="small" style={{ backgroundColor: '#dc2626' }} /> : null}
            </div>
          ),
        },
        {
          key: '/admin/vehicles',
          icon: <CarOutlined />,
          label: 'Quản lý Đội xe (Fleet)',
        },
        {
          key: '/admin/handover/B001',
          icon: <SwapOutlined />,
          label: 'Bàn giao & Nhận xe',
        },
        {
          key: '/admin/maintenance',
          icon: <ToolOutlined />,
          label: (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Bảo dưỡng kỹ thuật</span>
              {stats.maintenanceCars ? <Badge count={stats.maintenanceCars} size="small" style={{ backgroundColor: '#f59e0b' }} /> : null}
            </div>
          ),
        }
      ]
    },
    {
      key: 'grp-customers',
      type: 'group' as const,
      label: <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>KHÁCH HÀNG</span>,
      children: [
        {
          key: '/admin/customers',
          icon: <UserOutlined />,
          label: (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Khách hàng & GPLX</span>
              {stats.pendingVerifications ? <Badge count={stats.pendingVerifications} size="small" style={{ backgroundColor: '#2563eb' }} /> : null}
            </div>
          ),
        },
        {
          key: '/admin/reviews',
          icon: <StarOutlined />,
          label: 'Đánh giá & Phản hồi',
        }
      ]
    },
    {
      key: 'grp-finance',
      type: 'group' as const,
      label: <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>TÀI CHÍNH</span>,
      children: [
        {
          key: '/admin/revenue',
          icon: <LineChartOutlined />,
          label: 'Báo cáo Doanh thu',
        },
        {
          key: '/admin/contracts',
          icon: <FileDoneOutlined />,
          label: 'Kho Hợp đồng',
        }
      ]
    },
    {
      key: 'grp-system',
      type: 'group' as const,
      label: <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>HỆ THỐNG</span>,
      children: [
        {
          key: '/admin/managers',
          icon: <TeamOutlined />,
          label: 'Nhân sự Quản lý',
        },
        {
          key: '/admin/notifications',
          icon: <BellOutlined />,
          label: 'Trung tâm Thông báo',
        },
        {
          key: '/admin/audit-logs',
          icon: <HistoryOutlined />,
          label: 'Nhật ký Audit Logs',
        },
        {
          key: '/admin/settings',
          icon: <SettingOutlined />,
          label: 'Cài đặt Hệ thống',
        }
      ]
    }
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const getSelectedKeys = () => {
    const pathname = location.pathname;
    return [pathname];
  };

  const userDropdownItems = [
    { key: 'settings', label: 'Cài đặt hệ thống', icon: <SettingOutlined />, onClick: () => navigate('/admin/settings') },
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
        onClick={() => navigate('/admin/dashboard')}
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
            border: '1px solid rgba(251, 191, 36, 0.3)'
          }}>
            <CarOutlined style={{ fontSize: '20px', color: '#fbbf24' }} />
          </div>
          {!collapsed && (
            <div>
              <Title level={5} style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                AutoRent <span style={{ color: '#fbbf24' }}>Admin</span>
              </Title>
              <Text style={{ fontSize: '11px', color: '#94a3b8' }}>Business Platform</Text>
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
        {/* Modern SaaS Header */}
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
            <Tag color="gold" style={{ borderRadius: '6px', fontWeight: 600, border: 'none', padding: '4px 10px' }}>
              ADMIN WORKSPACE
            </Tag>
          </Space>

          <Space size={20}>
            <Tooltip title="Trung tâm thông báo">
              <Badge count={(stats.pendingBookings || 0) + (stats.pendingVerifications || 0)} size="small" style={{ backgroundColor: '#dc2626' }}>
                <Button 
                  type="text" 
                  icon={<BellOutlined style={{ fontSize: '18px', color: '#475569' }} />} 
                  onClick={() => navigate('/admin/notifications')}
                  style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                />
              </Badge>
            </Tooltip>

            <Dropdown menu={{ items: userDropdownItems }} placement="bottomRight" trigger={['click']}>
              <Space style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <Avatar style={{ backgroundColor: '#1e3a8a' }} icon={<UserOutlined />} />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                  <Text strong style={{ fontSize: '13px', color: '#0f172a' }}>{currentUser.name}</Text>
                  <Text type="secondary" style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Giám đốc Hệ thống</Text>
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
