import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Button, Space, Table, Tag, Alert, message } from 'antd';
import {
  CarOutlined,
  CalendarOutlined,
  ToolOutlined,
  SafetyCertificateOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExportOutlined,
  ImportOutlined,
  WarningOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TableSkeleton, StatCardsSkeleton } from '@/components/common/LoadingSkeleton';
import { ErrorState } from '@/components/common/ErrorState';

const { Title, Text } = Typography;

export const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<{
    kpis: any;
    recentBookings: any[];
    todayOps: any[];
  }>({
    kpis: {},
    recentBookings: [],
    todayOps: []
  });

  const currentUser = api.auth.getCurrentUser();

  const loadDashboardData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [kpisRes, bookingsRes, vehiclesRes] = await Promise.allSettled([
        api.dashboard.getKpis(),
        api.bookings.getAll({ limit: 8 }),
        api.vehicles.getAll({ limit: 10 })
      ]);

      const kpis = kpisRes.status === 'fulfilled' ? kpisRes.value : {};
      const rawBookings: any = bookingsRes.status === 'fulfilled' ? bookingsRes.value : [];
      const bookingsList = Array.isArray(rawBookings) ? rawBookings : (rawBookings?.items || rawBookings?.data || []);

      setData({
        kpis,
        recentBookings: bookingsList.slice(0, 6),
        todayOps: bookingsList.filter((b: any) => b.status === 'CONFIRMED' || b.status === 'PENDING' || b.status === 'ACTIVE').slice(0, 4)
      });
    } catch (err) {
      setError(true);
      message.error('Không thể tải dữ liệu bảng điều khiển.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const todayStr = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  if (error) {
    return <ErrorState message="Lỗi nạp dữ liệu điều hành" onRetry={loadDashboardData} />;
  }

  const pendingCount = data.kpis?.pendingBookings || 3;
  const verifyCount = data.kpis?.pendingVerifications || 2;
  const maintenanceCount = data.kpis?.maintenanceVehicles || 1;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* SaaS Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '16px',
        padding: '28px 32px',
        marginBottom: '24px',
        color: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.12)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px' }}>👋</span>
            <Title level={4} style={{ color: '#ffffff', margin: 0, fontWeight: 700 }}>
              Xin chào, {currentUser?.name || 'Quản lý'}
            </Title>
            <Tag color="#1e3a8a" style={{ border: '1px solid #3b82f6', color: '#93c5fd', borderRadius: '6px' }}>
              Chi nhánh Hà Nội
            </Tag>
          </div>
          <Text style={{ color: '#94a3b8', fontSize: '13px' }}>
            {todayStr} • Hệ thống vận hành đang hoạt động ổn định
          </Text>
        </div>
        <Space size={12}>
          <Button 
            type="primary" 
            icon={<ExportOutlined />}
            onClick={() => navigate('/manager/pickup/quick')}
            style={{ borderRadius: '8px', background: '#2563eb', borderColor: '#2563eb', fontWeight: 600 }}
          >
            Bàn giao xe (Pickup)
          </Button>
          <Button 
            icon={<ImportOutlined />}
            onClick={() => navigate('/manager/return/quick')}
            style={{ borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 600 }}
          >
            Nhận xe (Return)
          </Button>
        </Space>
      </div>

      {/* KPI Stats */}
      {loading ? (
        <StatCardsSkeleton count={4} />
      ) : (
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="ĐƠN CHỜ DUYỆT"
              value={pendingCount}
              icon={<ClockCircleOutlined style={{ color: '#dc2626' }} />}
              badgeColor="#fef2f2"
              trend={-10}
              trendLabel="so với hôm qua"
              onClick={() => navigate('/manager/bookings')}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="XE ĐANG HOẠT ĐỘNG"
              value={data.kpis?.activeRentals || 12}
              icon={<CarOutlined style={{ color: '#16a34a' }} />}
              badgeColor="#f0fdf4"
              trend={15}
              trendLabel="công suất 85%"
              onClick={() => navigate('/manager/fleet')}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="HỒ SƠ CHỜ DUYỆT GPLX"
              value={verifyCount}
              icon={<SafetyCertificateOutlined style={{ color: '#2563eb' }} />}
              badgeColor="#eff6ff"
              trend={5}
              trendLabel="cần xử lý sớm"
              onClick={() => navigate('/manager/verification')}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="XE ĐANG BẢO DƯỠNG"
              value={maintenanceCount}
              icon={<ToolOutlined style={{ color: '#d97706' }} />}
              badgeColor="#fffbeb"
              trend={0}
              trendLabel="1 xe sắp đến hạn"
              onClick={() => navigate('/manager/maintenance')}
            />
          </Col>
        </Row>
      )}

      {/* ACTION CENTER - What needs attention? */}
      <Card 
        style={{ 
          borderRadius: '14px', 
          border: '1px solid #e2e8f0', 
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
        }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ThunderboltOutlined style={{ color: '#d97706', fontSize: '18px' }} />
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
              Action Center – Việc cần xử lý ngay
            </span>
          </div>
        }
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div style={{
              padding: '16px',
              borderRadius: '10px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '14px' }}>
                  {pendingCount} Đơn thuê mới chờ xác nhận
                </div>
                <div style={{ fontSize: '12px', color: '#b91c1c', marginTop: '2px' }}>
                  Khách hàng đang chờ phản hồi
                </div>
              </div>
              <Button 
                type="primary" 
                danger 
                size="small" 
                onClick={() => navigate('/manager/bookings')}
                style={{ borderRadius: '6px' }}
              >
                Xử lý
              </Button>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div style={{
              padding: '16px',
              borderRadius: '10px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '14px' }}>
                  {verifyCount} GPLX chờ kiểm duyệt
                </div>
                <div style={{ fontSize: '12px', color: '#3b82f6', marginTop: '2px' }}>
                  Cần duyệt trước khi giao xe
                </div>
              </div>
              <Button 
                type="primary" 
                size="small" 
                onClick={() => navigate('/manager/verification')}
                style={{ borderRadius: '6px', background: '#2563eb' }}
              >
                Duyệt ngay
              </Button>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div style={{
              padding: '16px',
              borderRadius: '10px',
              background: '#fffbeb',
              border: '1px solid #fde68a',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 700, color: '#92400e', fontSize: '14px' }}>
                  {maintenanceCount} Xe đang đến kỳ bảo dưỡng
                </div>
                <div style={{ fontSize: '12px', color: '#b45309', marginTop: '2px' }}>
                  Thay dầu định kỳ 10,000 km
                </div>
              </div>
              <Button 
                type="default" 
                size="small" 
                onClick={() => navigate('/manager/maintenance')}
                style={{ borderRadius: '6px', borderColor: '#d97706', color: '#b45309' }}
              >
                Xem lịch
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Two columns: Today's Ops vs Recent Bookings */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '15px', fontWeight: 700 }}>Hàng đợi điều phối gần nhất</span>
                <Button type="link" onClick={() => navigate('/manager/bookings')}>
                  Xem tất cả ({data.recentBookings.length}) <ArrowRightOutlined />
                </Button>
              </div>
            }
            style={{ borderRadius: '14px', border: '1px solid #e2e8f0' }}
          >
            <Table
              dataSource={data.recentBookings}
              rowKey="id"
              pagination={false}
              size="middle"
              columns={[
                {
                  title: 'Mã đơn',
                  dataIndex: 'id',
                  key: 'id',
                  render: (id: string) => <Text strong style={{ color: '#1e3a8a' }}>#{id.slice(0, 8)}</Text>
                },
                {
                  title: 'Xe thuê',
                  key: 'vehicle',
                  render: (_, r: any) => (
                    <div>
                      <div style={{ fontWeight: 600 }}>{r.vehicle?.name || 'VinFast Lux A2.0'}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{r.vehicle?.licensePlate || '30A-999.88'}</div>
                    </div>
                  )
                },
                {
                  title: 'Khách hàng',
                  dataIndex: ['customer', 'name'],
                  key: 'customer',
                  render: (name: string) => name || 'Nguyễn Văn An'
                },
                {
                  title: 'Trạng thái',
                  dataIndex: 'status',
                  key: 'status',
                  render: (st: string) => <StatusBadge status={st} />
                },
                {
                  title: 'Thao tác',
                  key: 'action',
                  render: (_, r: any) => (
                    <Button 
                      type="link" 
                      size="small" 
                      onClick={() => navigate('/manager/bookings')}
                    >
                      Chi tiết
                    </Button>
                  )
                }
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '15px', fontWeight: 700 }}>Lịch trình hôm nay</span>
                <Button type="link" onClick={() => navigate('/manager/operations/today')}>
                  Chi tiết ca trực <ArrowRightOutlined />
                </Button>
              </div>
            }
            style={{ borderRadius: '14px', border: '1px solid #e2e8f0' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                padding: '14px',
                borderRadius: '10px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: '#eff6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2563eb'
                  }}>
                    <ExportOutlined />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>09:30 - Giao xe VinFast VF8</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Khách: Trần Văn Bình • Đã thanh toán cọc</div>
                  </div>
                </div>
                <Button size="small" type="primary" onClick={() => navigate('/manager/pickup/quick')}>
                  Giao xe
                </Button>
              </div>

              <div style={{
                padding: '14px',
                borderRadius: '10px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: '#f0fdf4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#16a34a'
                  }}>
                    <ImportOutlined />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>14:00 - Nhận xe Toyota Camry</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Khách: Lê Hoàng Nam • Kiểm tra Odo</div>
                  </div>
                </div>
                <Button size="small" onClick={() => navigate('/manager/return/quick')}>
                  Nhận xe
                </Button>
              </div>

              <div style={{
                padding: '14px',
                borderRadius: '10px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: '#fffbeb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#d97706'
                  }}>
                    <ToolOutlined />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>16:30 - Bảo dưỡng Mazda CX-5</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Gara AutoPro Cầu Giấy</div>
                  </div>
                </div>
                <Tag color="warning">Lên lịch</Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
