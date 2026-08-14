import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Space, Table, Alert, Button, Statistic } from 'antd';
import { CarOutlined, DollarOutlined, CalendarOutlined, ToolOutlined, HistoryOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { Booking } from '@/services/mockData';
import { StatusBadge } from '@/components/common/StatusBadge';
import { RevenueChart, FleetPieChart } from '@/components/charts/ReportChart';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  useEffect(() => {
    api.stats.getAdminStats().then(res => setStats(res));
    api.bookings.getAll().then(res => {
      // Sort bookings by creation date descending, show top 5
      setRecentBookings(res.slice(0, 5));
    });
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price);
  };

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'bookingCode',
      key: 'bookingCode',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Xe thuê',
      dataIndex: 'vehicleName',
      key: 'vehicleName',
    },
    {
      title: 'Ngày thuê',
      key: 'dates',
      render: (_, record: Booking) => (
        <span>{record.startDate} - {record.endDate}</span>
      )
    },
    {
      title: 'Thanh toán',
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
      render: (_, record: Booking) => (
        <Button type="link" onClick={() => navigate(`/admin/bookings/${record.id}`)}>
          Quản lý
        </Button>
      )
    }
  ];

  if (!stats) return <div style={{ textAlign: 'center', padding: '100px 0' }}>Đang tải bảng điều khiển...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Bảng quản trị hệ thống</Title>
          <Text type="secondary">Theo dõi hoạt động kinh doanh, trạng thái đội xe và đơn hàng.</Text>
        </div>
        <Button type="primary" icon={<CarOutlined />} onClick={() => navigate('/admin/vehicles/new')}>
          Thêm xe mới
        </Button>
      </div>

      {/* KPI Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Statistic
              title="Tổng số xe trong hạm đội"
              value={stats.vehicles.total}
              prefix={<CarOutlined style={{ color: '#1677ff', marginRight: '8px' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Statistic
              title="Đang cho thuê"
              value={stats.vehicles.rented}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CalendarOutlined style={{ color: '#52c41a', marginRight: '8px' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Statistic
              title="Đang bảo dưỡng"
              value={stats.vehicles.maintenance}
              valueStyle={{ color: '#faad14' }}
              prefix={<ToolOutlined style={{ color: '#faad14', marginRight: '8px' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Statistic
              title="Doanh thu lũy kế"
              value={stats.revenue.total}
              formatter={(value) => formatPrice(Number(value))}
              prefix={<DollarOutlined style={{ color: '#0053d0', marginRight: '8px' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Xu hướng doanh thu (7 tháng qua)</Title>} 
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            <RevenueChart data={stats.revenue.monthly} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Trạng thái phân bổ xe</Title>} 
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            <FleetPieChart data={stats.revenue.fleetStatus} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Left Side: Recent Bookings */}
        <Col xs={24} lg={16}>
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Đơn thuê mới cập nhật</Title>} 
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            extra={<Button type="link" onClick={() => navigate('/admin/bookings')}>Tất cả đơn hàng</Button>}
          >
            <Table
              dataSource={recentBookings}
              columns={columns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Right Side: Maintenance alerts */}
        <Col xs={24} lg={8}>
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Thông báo hạm đội</Title>} 
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <Alert
                message="Xe cần bảo dưỡng"
                description="Ford Ranger (29H-123.45) đã đến hạn thay nhớt định kỳ và bảo dưỡng định kỳ."
                type="warning"
                showIcon
                action={
                  <Button size="small" type="primary" onClick={() => navigate('/admin/maintenance')}>
                    Xem lịch
                  </Button>
                }
              />
              <Alert
                message="Xác minh GPLX mới"
                description="Khách hàng Trần Thị B đã tải lên GPLX. Cần admin phê duyệt hồ sơ."
                type="info"
                showIcon
                action={
                  <Button size="small" type="primary" onClick={() => navigate('/admin/customers')}>
                    Phê duyệt
                  </Button>
                }
              />
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
