import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Button, Space, Typography, Progress, Avatar, Alert, Spin } from 'antd';
import {
  FileDoneOutlined,
  CalendarOutlined,
  CarOutlined,
  UserSwitchOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SwapOutlined,
  RightOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { Booking, Customer, Vehicle } from '@/services/mockData';

const { Title, Text, Paragraph } = Typography;

export const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.bookings.getAll(),
      api.customers.getAll(),
      api.vehicles.getAll()
    ])
      .then(([bRes, cRes, vRes]) => {
        setBookings(bRes);
        setCustomers(cRes);
        setVehicles(vRes);
      })
      .catch((err) => console.error('Failed to load manager dashboard data', err))
      .finally(() => setLoading(false));
  }, []);

  const pendingBookings = bookings.filter(b => b.status === 'Chờ xác nhận');
  const activeBookings = bookings.filter(b => b.status === 'Đang thuê');
  const pendingCustomers = customers.filter(c => c.licenseStatus === 'Chờ duyệt');
  const availableVehicles = vehicles.filter(v => v.status === 'Có sẵn');
  const readyRate = vehicles.length > 0 ? Math.round((availableVehicles.length / vehicles.length) * 100) : 100;

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="Đang tải dữ liệu vận hành..." />
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Top Banner Alert for Manager */}
      <Alert
        message={
          <Space>
            <Tag color="#f59e0b" style={{ fontWeight: 700 }}>BẢNG ĐIỀU HÀNH VẬN HÀNH MANAGER</Tag>
            <Text strong>Hôm nay có {pendingBookings.length} đơn cần làm hợp đồng bàn giao & {pendingCustomers.length} hồ sơ GPLX chờ duyệt.</Text>
          </Space>
        }
        type="warning"
        showIcon
        icon={<ExclamationCircleOutlined style={{ color: '#d97706' }} />}
        style={{ marginBottom: '24px', borderRadius: '8px', border: '1px solid #fde68a', backgroundColor: '#fffbeb' }}
      />

      {/* KPI Stats Header */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="hover-lift" style={{ borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '13px' }}>Đơn thuê chờ duyệt & tạo HĐ</Text>}
              value={pendingBookings.length}
              prefix={<CalendarOutlined style={{ color: '#f59e0b', marginRight: '8px' }} />}
              valueStyle={{ fontWeight: 800, color: '#0f172a' }}
            />
            <Text style={{ fontSize: '12px', color: '#d97706', marginTop: '4px', display: 'block' }}>Cần xử lý sớm</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="hover-lift" style={{ borderRadius: '12px', borderLeft: '4px solid #2563eb' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '13px' }}>Xe đang lưu hành hôm nay</Text>}
              value={activeBookings.length}
              prefix={<CarOutlined style={{ color: '#2563eb', marginRight: '8px' }} />}
              valueStyle={{ fontWeight: 800, color: '#0f172a' }}
            />
            <Text style={{ fontSize: '12px', color: '#2563eb', marginTop: '4px', display: 'block' }}>Theo dõi hành trình trả xe</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="hover-lift" style={{ borderRadius: '12px', borderLeft: '4px solid #dc2626' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '13px' }}>GPLX Khách hàng chờ duyệt</Text>}
              value={pendingCustomers.length}
              prefix={<UserSwitchOutlined style={{ color: '#dc2626', marginRight: '8px' }} />}
              valueStyle={{ fontWeight: 800, color: '#0f172a' }}
            />
            <Text style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px', display: 'block' }}>Cần kiểm tra đối chiếu</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="hover-lift" style={{ borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
            <Statistic
              title={<Text type="secondary" style={{ fontSize: '13px' }}>Tỷ lệ xe sẵn sàng vận hành</Text>}
              value={readyRate}
              suffix="%"
              prefix={<CheckCircleOutlined style={{ color: '#10b981', marginRight: '8px' }} />}
              valueStyle={{ fontWeight: 800, color: '#0f172a' }}
            />
            <Text style={{ fontSize: '12px', color: '#10b981', marginTop: '4px', display: 'block' }}>{availableVehicles.length}/{vehicles.length} xe sẵn sàng phục vụ</Text>
          </Card>
        </Col>
      </Row>

      {/* Quick Operational Actions */}
      <Card title={<Title level={4} style={{ margin: 0, fontWeight: 700 }}>Nghiệp vụ Xử lý Nhanh của Manager</Title>} style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <div 
              onClick={() => navigate('/manager/contracts')}
              style={{ 
                padding: '16px', 
                borderRadius: '10px', 
                backgroundColor: '#eff6ff', 
                border: '1px solid #bfdbfe',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              className="hover-lift"
            >
              <FileDoneOutlined style={{ fontSize: '24px', color: '#2563eb', marginBottom: '8px' }} />
              <Title level={5} style={{ margin: 0, color: '#1e40af' }}>Soạn & Ký Hợp đồng</Title>
              <Text type="secondary" style={{ fontSize: '12px' }}>Tạo hợp đồng thuê xe điện tử cho khách hàng</Text>
            </div>
          </Col>

          <Col xs={24} sm={8}>
            <div 
              onClick={() => navigate(`/manager/handover/${bookings[0]?.id || '1'}`)}
              style={{ 
                padding: '16px', 
                borderRadius: '10px', 
                backgroundColor: '#fffbeb', 
                border: '1px solid #fde68a',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              className="hover-lift"
            >
              <SwapOutlined style={{ fontSize: '24px', color: '#f59e0b', marginBottom: '8px' }} />
              <Title level={5} style={{ margin: 0, color: '#92400e' }}>Lập Biên bản Bàn giao / Nhận xe</Title>
              <Text type="secondary" style={{ fontSize: '12px' }}>Ghi nhận số km, mức xăng/pin, tình trạng xe</Text>
            </div>
          </Col>

          <Col xs={24} sm={8}>
            <div 
              onClick={() => navigate('/manager/customers')}
              style={{ 
                padding: '16px', 
                borderRadius: '10px', 
                backgroundColor: '#fef2f2', 
                border: '1px solid #fecaca',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              className="hover-lift"
            >
              <UserSwitchOutlined style={{ fontSize: '24px', color: '#dc2626', marginBottom: '8px' }} />
              <Title level={5} style={{ margin: 0, color: '#991b1b' }}>Duyệt Hồ sơ GPLX Khách hàng</Title>
              <Text type="secondary" style={{ fontSize: '12px' }}>Xác minh GPLX và CCCD trước khi giao xe</Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Main Operational Tables */}
      <Row gutter={[24, 24]}>
        {/* Pending Bookings requiring Manager Action */}
        <Col xs={24} lg={14}>
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <CalendarOutlined style={{ color: '#f59e0b' }} />
                  <span>Đơn Thuê Xe Chờ Xử Lý & Tạo Hợp Đồng</span>
                </Space>
                <Button type="link" size="small" onClick={() => navigate('/manager/bookings')}>Xem tất cả</Button>
              </div>
            } 
            style={{ borderRadius: '12px' }}
          >
            <Table
              dataSource={bookings}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="middle"
              columns={[
                {
                  title: 'Mã đơn',
                  dataIndex: 'bookingCode',
                  render: text => <Text strong style={{ color: '#2563eb' }}>{text}</Text>
                },
                {
                  title: 'Khách hàng',
                  dataIndex: 'customerName',
                  render: (text, r) => (
                    <div>
                      <Text strong style={{ display: 'block' }}>{text}</Text>
                      <Text type="secondary" style={{ fontSize: '11px' }}>{r.customerPhone}</Text>
                    </div>
                  )
                },
                {
                  title: 'Xe thuê',
                  dataIndex: 'vehicleName',
                  render: text => <Tag color="blue">{text}</Tag>
                },
                {
                  title: 'Trạng thái',
                  dataIndex: 'status',
                  render: status => (
                    <Tag color={status === 'Chờ xác nhận' ? 'warning' : (status === 'Đang thuê' ? 'processing' : 'success')}>
                      {status}
                    </Tag>
                  )
                },
                {
                  title: 'Hành động Manager',
                  render: (_, r) => (
                    <Button 
                      type="primary" 
                      size="small" 
                      style={{ backgroundColor: '#f59e0b', borderColor: '#f59e0b' }}
                      onClick={() => navigate('/manager/contracts')}
                    >
                      Duyệt & Tạo HĐ
                    </Button>
                  )
                }
              ]}
            />
          </Card>
        </Col>

        {/* Customer License Verification Queue */}
        <Col xs={24} lg={10}>
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <UserSwitchOutlined style={{ color: '#dc2626' }} />
                  <span>Hồ sơ Khách hàng Chờ Duyệt</span>
                </Space>
                <Button type="link" size="small" onClick={() => navigate('/manager/customers')}>Quản lý</Button>
              </div>
            }
            style={{ borderRadius: '12px' }}
          >
            {customers.slice(0, 5).map(cust => (
              <div key={cust.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid #f1f5f9'
              }}>
                <Space size={12}>
                  <Avatar style={{ backgroundColor: cust.licenseStatus === 'Đã xác minh' ? '#10b981' : '#f59e0b' }}>
                    {cust.name.charAt(0)}
                  </Avatar>
                  <div>
                    <Text strong style={{ display: 'block', fontSize: '13px' }}>{cust.name}</Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>GPLX: {cust.driverLicense}</Text>
                  </div>
                </Space>
                <Tag color={cust.licenseStatus === 'Đã xác minh' ? 'green' : (cust.licenseStatus === 'Chờ duyệt' ? 'gold' : 'default')}>
                  {cust.licenseStatus}
                </Tag>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};
