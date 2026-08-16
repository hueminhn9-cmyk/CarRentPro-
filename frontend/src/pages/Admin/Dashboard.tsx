import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Space, Table, Button, Tag, message } from 'antd';
import {
  CarOutlined,
  DollarOutlined,
  CalendarOutlined,
  ToolOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
  FileDoneOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatCardsSkeleton } from '@/components/common/LoadingSkeleton';
import { RevenueChart, FleetPieChart } from '@/components/charts/ReportChart';

const { Title, Text } = Typography;

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      api.stats.getAdminStats(),
      api.bookings.getAll({ limit: 6 })
    ]).then(([statsRes, bookingsRes]) => {
      if (statsRes.status === 'fulfilled') setStats(statsRes.value);
      if (bookingsRes.status === 'fulfilled') {
        const raw: any = bookingsRes.value;
        setRecentBookings(Array.isArray(raw) ? raw.slice(0, 5) : (raw?.items || []).slice(0, 5));
      }
    }).finally(() => setLoading(false));
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price || 0);
  };

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'id',
      key: 'id',
      render: (id: string, r: any) => (
        <Text strong style={{ color: '#1e3a8a' }}>
          #{r.bookingCode || (id ? id.slice(0, 8) : 'BK-001')}
        </Text>
      )
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (_: any, r: any) => <span>{r.customer?.name || r.customerName || 'Khách hàng'}</span>
    },
    {
      title: 'Xe thuê',
      key: 'vehicle',
      render: (_: any, r: any) => <span>{r.vehicle?.name || r.vehicleName || 'VinFast VF8'}</span>
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => <Text strong>{formatPrice(amount)}</Text>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: any) => <StatusBadge status={status} />
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button type="link" size="small" onClick={() => navigate(`/admin/bookings/${record.id || '1'}`)}>
          Chi tiết
        </Button>
      )
    }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={4} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>
            Bảng điều hành Tổng giám đốc (Executive Dashboard)
          </Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>
            Theo dõi chỉ số kinh doanh, hiệu suất đội xe và các hành động cần can thiệp
          </Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => navigate('/admin/vehicles/new')}
          style={{ borderRadius: '8px', background: '#0f172a', borderColor: '#0f172a', fontWeight: 600 }}
        >
          Thêm xe mới vào đội
        </Button>
      </div>

      {/* KPI StatCards */}
      {loading ? (
        <StatCardsSkeleton count={4} />
      ) : (
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="DOANH THU LŨY KẾ"
              value={formatPrice(stats?.revenue?.total || 842500000)}
              icon={<DollarOutlined style={{ color: '#16a34a' }} />}
              badgeColor="#f0fdf4"
              trend={18.4}
              trendLabel="so với tháng trước"
              onClick={() => navigate('/admin/revenue')}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="TỔNG ĐỘI XE DOANH NGHIỆP"
              value={stats?.vehicles?.total || 36}
              icon={<CarOutlined style={{ color: '#1e3a8a' }} />}
              badgeColor="#eff6ff"
              trend={8.2}
              trendLabel="3 xe mới trong tháng"
              onClick={() => navigate('/admin/vehicles')}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="XE ĐANG CHO THUÊ"
              value={stats?.vehicles?.rented || 28}
              icon={<CalendarOutlined style={{ color: '#2563eb' }} />}
              badgeColor="#eff6ff"
              trend={12.0}
              trendLabel="công suất 78%"
              onClick={() => navigate('/admin/bookings')}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="XE ĐANG BẢO DƯỠNG"
              value={stats?.vehicles?.maintenance || 3}
              icon={<ToolOutlined style={{ color: '#d97706' }} />}
              badgeColor="#fffbeb"
              trend={-2.5}
              trendLabel="tất cả có lịch rõ ràng"
              onClick={() => navigate('/admin/maintenance')}
            />
          </Col>
        </Row>
      )}

      {/* ACTION CENTER - WHAT NEEDS ATTENTION (Spec 30 & 61) */}
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
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              Action Center – Danh mục cần xử lý ưu tiên
            </span>
          </div>
        }
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
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
                  8 GPLX cần xác minh
                </div>
                <div style={{ fontSize: '11px', color: '#b91c1c', marginTop: '2px' }}>
                  Khách hàng mới tạo đơn
                </div>
              </div>
              <Button 
                type="primary" 
                danger 
                size="small" 
                onClick={() => navigate('/admin/customers')}
                style={{ borderRadius: '6px' }}
              >
                Xử lý →
              </Button>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
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
                  3 Xe cần bảo dưỡng
                </div>
                <div style={{ fontSize: '11px', color: '#b45309', marginTop: '2px' }}>
                  Đã đến hạn định kỳ
                </div>
              </div>
              <Button 
                size="small" 
                onClick={() => navigate('/admin/maintenance')}
                style={{ borderRadius: '6px', borderColor: '#d97706', color: '#b45309' }}
              >
                Xem →
              </Button>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <div style={{
              padding: '16px',
              borderRadius: '10px',
              background: '#faf5ff',
              border: '1px solid #e9d5ff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 700, color: '#6b21a8', fontSize: '14px' }}>
                  4 Hợp đồng chưa ký
                </div>
                <div style={{ fontSize: '11px', color: '#7e22ce', marginTop: '2px' }}>
                  Chờ chữ ký điện tử
                </div>
              </div>
              <Button 
                size="small" 
                onClick={() => navigate('/admin/contracts')}
                style={{ borderRadius: '6px', borderColor: '#9333ea', color: '#9333ea' }}
              >
                Xem →
              </Button>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
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
                  12 Đơn thuê chờ duyệt
                </div>
                <div style={{ fontSize: '11px', color: '#2563eb', marginTop: '2px' }}>
                  Từ các chi nhánh
                </div>
              </div>
              <Button 
                type="primary" 
                size="small" 
                onClick={() => navigate('/admin/bookings')}
                style={{ borderRadius: '6px', background: '#2563eb' }}
              >
                Xử lý →
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Analytics Charts */}
      <Row gutter={[20, 20]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card 
            title={<span style={{ fontWeight: 700, fontSize: '15px' }}>Xu hướng Doanh thu (7 tháng gần nhất)</span>}
            style={{ borderRadius: '14px', border: '1px solid #e2e8f0' }}
          >
            <RevenueChart data={stats?.revenue?.monthly} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={<span style={{ fontWeight: 700, fontSize: '15px' }}>Phân bổ Trạng thái Đội xe</span>}
            style={{ borderRadius: '14px', border: '1px solid #e2e8f0' }}
          >
            <FleetPieChart data={stats?.revenue?.fleetStatus} />
          </Card>
        </Col>
      </Row>

      {/* Recent Bookings Table */}
      <Card 
        title={<span style={{ fontWeight: 700, fontSize: '15px' }}>Đơn thuê mới tiếp nhận</span>}
        style={{ borderRadius: '14px', border: '1px solid #e2e8f0' }}
        extra={<Button type="link" onClick={() => navigate('/admin/bookings')}>Xem toàn bộ đơn ({recentBookings.length}) <ArrowRightOutlined /></Button>}
      >
        <Table
          dataSource={recentBookings}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  );
};
