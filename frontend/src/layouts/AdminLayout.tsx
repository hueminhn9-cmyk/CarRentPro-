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
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  SwapOutlined,
  StarOutlined,
  HistoryOutlined,
  CrownFilled,
  DatabaseOutlined,
  UserOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [stats, setStats] = useState<{ pendingBookings?: number; pendingVerifications?: number; maintenanceCars?: number }>({
    pendingBookings: 0,
    pendingVerifications: 0,
    maintenanceCars: 0
  });
  const currentUser = api.auth.getCurrentUser();

  // Route protection
  useEffect(() => {
    if (!currentUser) {
      navigate('/auth/login');
    } else if (currentUser.role?.toLowerCase() !== 'admin') {
      navigate('/customer/dashboard');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    api.dashboard.getKpis()
      .then((data: any) => {
        if (data) {
          setStats({
            pendingBookings: data.pendingBookings ?? 0,
            pendingVerifications: data.pendingVerifications ?? 0,
            maintenanceCars: data.maintenanceVehicles ?? 0
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

  // Grouped Menu Items - Logical Workflow, Crisp and Elegant
  const menuItems = [
    {
      key: 'grp-executive',
      type: 'group' as const,
      label: (
        <span style={{ color: '#4f46e5', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em' }}>
          👑 TỔNG QUAN CHIẾN LƯỢC
        </span>
      ),
      children: [
        {
          key: '/admin/dashboard',
          icon: <DashboardOutlined style={{ fontSize: '16px', color: '#4f46e5' }} />,
          label: 'Executive Dashboard',
        }
      ]
    },
    {
      key: 'grp-business',
      type: 'group' as const,
      label: (
        <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em' }}>
          💼 QUẢN TRỊ KINH DOANH & XE
        </span>
      ),
      children: [
        {
          key: '/admin/bookings',
          icon: <CalendarOutlined style={{ fontSize: '16px', color: '#0284c7' }} />,
          label: (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Đơn thuê toàn quốc</span>
              {stats.pendingBookings ? <Badge count={stats.pendingBookings} size="small" style={{ backgroundColor: '#dc2626' }} /> : null}
            </div>
          ),
        },
        {
          key: '/admin/vehicles',
          icon: <CarOutlined style={{ fontSize: '16px', color: '#16a34a' }} />,
          label: 'Đội xe toàn hệ thống',
        },
        {
          key: '/admin/contracts',
          icon: <FileDoneOutlined style={{ fontSize: '16px', color: '#9333ea' }} />,
          label: 'Kho Hợp đồng pháp lý',
        }
      ]
    },
    {
      key: 'grp-customers',
      type: 'group' as const,
      label: (
        <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em' }}>
          👥 KHÁCH HÀNG & PHẢN HỒI
        </span>
      ),
      children: [
        {
          key: '/admin/customers',
          icon: <UserOutlined style={{ fontSize: '16px', color: '#2563eb' }} />,
          label: (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Hồ sơ Khách & GPLX</span>
              {stats.pendingVerifications ? <Badge count={stats.pendingVerifications} size="small" style={{ backgroundColor: '#2563eb' }} /> : null}
            </div>
          ),
        },
        {
          key: '/admin/reviews',
          icon: <StarOutlined style={{ fontSize: '16px', color: '#d97706' }} />,
          label: 'Kiểm duyệt Đánh giá',
        }
      ]
    },
    {
      key: 'grp-finance-tech',
      type: 'group' as const,
      label: (
        <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em' }}>
          📈 TÀI CHÍNH & VẬN HÀNH
        </span>
      ),
      children: [
        {
          key: '/admin/revenue',
          icon: <LineChartOutlined style={{ fontSize: '16px', color: '#ea580c' }} />,
          label: 'Báo cáo Doanh thu & P&L',
        },
        {
          key: '/admin/maintenance',
          icon: <ToolOutlined style={{ fontSize: '16px', color: '#b45309' }} />,
          label: (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Kế hoạch Bảo dưỡng xe</span>
              {stats.maintenanceCars ? <Badge count={stats.maintenanceCars} size="small" style={{ backgroundColor: '#ea580c' }} /> : null}
            </div>
          ),
        }
      ]
    },
    {
      key: 'grp-governance',
      type: 'group' as const,
      label: (
        <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em' }}>
          🛡️ GIÁM SÁT NỘI BỘ & HỆ THỐNG
        </span>
      ),
      children: [
        {
          key: '/admin/managers',
          icon: <TeamOutlined style={{ fontSize: '16px', color: '#0284c7' }} />,
          label: 'Nhân sự Quản lý Chi nhánh',
        },
        {
          key: '/admin/notifications',
          icon: <BellOutlined style={{ fontSize: '16px', color: '#e11d48' }} />,
          label: 'Trung tâm Thông báo',
        },
        {
          key: '/admin/audit-logs',
          icon: <HistoryOutlined style={{ fontSize: '16px', color: '#7c3aed' }} />,
          label: 'Nhật ký Audit Logs',
        },
        {
          key: '/admin/settings',
          icon: <SettingOutlined style={{ fontSize: '16px', color: '#475569' }} />,
          label: 'Cài đặt Hệ thống',
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
        width={275}
        theme="light"
        className="admin-sider"
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
        <div 
          style={{ 
            height: '68px', 
            display: 'flex', 
            alignItems: 'center', 
            padding: collapsed ? '0' : '0 20px', 
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderBottom: '1px solid #f1f5f9',
            background: '#ffffff',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/admin/dashboard')}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: collapsed ? 0 : '12px',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
            flexShrink: 0
          }}>
            <CrownFilled style={{ fontSize: '20px', color: '#fbbf24' }} />
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                  AutoRent
                </span>
                <Tag color="gold" style={{ fontSize: '9px', fontWeight: 800, padding: '0 5px', borderRadius: '4px', margin: 0 }}>
                  ENTERPRISE
                </Tag>
              </div>
              <Text style={{ fontSize: '11px', color: '#64748b', fontWeight: 500, display: 'block' }}>Quản Trị Toàn Cục</Text>
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
        {/* Top Header - Executive Style */}
        <Header style={{ 
          padding: '0 28px', 
          background: '#ffffff', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #e2e8f0',
          borderTop: '3px solid #4f46e5',
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
                background: '#eef2ff', 
                color: '#4338ca', 
                border: '1px solid #c7d2fe', 
                borderRadius: '6px', 
                fontWeight: 700, 
                padding: '4px 12px',
                fontSize: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <CrownFilled style={{ color: '#d97706' }} /> PHÂN HỆ QUẢN TRỊ TOÀN QUYỀN
            </Tag>
            <Tag color="success" icon={<DatabaseOutlined />} style={{ borderRadius: '6px', fontWeight: 600, padding: '4px 10px' }}>
              MySQL 8.4: Trực tiếp
            </Tag>
          </Space>

          <Space size={16}>
            {/* Quick Switcher to Manager Operations */}
            <Button 
              icon={<SwapOutlined />} 
              onClick={() => navigate('/manager/dashboard')}
              style={{ 
                background: '#f0fdf4', 
                borderColor: '#86efac', 
                color: '#15803d', 
                fontWeight: 600, 
                borderRadius: '8px',
                height: '38px'
              }}
            >
              Chuyển sang Bàn Vận hành
            </Button>

            <Tooltip title="Trung tâm Thông báo Quản trị">
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
              <Space style={{ cursor: 'pointer', padding: '5px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <Avatar style={{ backgroundColor: '#4f46e5' }} icon={<CrownFilled style={{ color: '#fbbf24' }} />} />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                  <Text strong style={{ fontSize: '13px', color: '#0f172a' }}>{currentUser.name || 'Quản trị viên'}</Text>
                  <Text style={{ fontSize: '11px', color: '#4f46e5', fontWeight: 700 }}>Tổng Quản Trị Hệ Thống</Text>
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
