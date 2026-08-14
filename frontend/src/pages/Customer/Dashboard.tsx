import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Statistic, Space, Timeline, List, Button, Avatar } from 'antd';
import { TrophyOutlined, CarOutlined, DollarOutlined, ClockCircleOutlined, RightOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { Booking, Customer } from '@/services/mockData';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const user = api.auth.getCurrentUser();
    if (user) {
      api.customers.getById(user.id).then(res => res && setCustomer(res));
      api.bookings.getByCustomer(user.id).then(res => {
        setActiveBookings(res.filter(b => b.status === 'Đang thuê' || b.status === 'Chờ xác nhận'));
        setPastBookings(res.filter(b => b.status === 'Hoàn thành' || b.status === 'Đã hủy'));
      });
    }
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Chào mừng trở lại, {customer?.name}!</Title>
        <Text type="secondary">Quản lý các chuyến đi của bạn và xem thông tin tài khoản.</Text>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Statistic
              title="Tổng đơn thuê"
              value={customer?.bookingCount || 0}
              prefix={<CarOutlined style={{ color: '#1677ff', marginRight: '8px' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Statistic
              title="Điểm tích lũy"
              value={customer?.loyaltyPoints || 0}
              prefix={<TrophyOutlined style={{ color: '#faad14', marginRight: '8px' }} />}
              suffix={<span style={{ fontSize: '13px', fontWeight: 'normal', marginLeft: '4px' }}>({customer?.tier} member)</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Statistic
              title="Hạng thành viên"
              value={customer?.tier || 'Bạc'}
              valueStyle={{ color: customer?.tier === 'Kim cương' ? '#722ed1' : customer?.tier === 'Vàng' ? '#faad14' : '#8c8c8c' }}
              prefix={<TrophyOutlined style={{ marginRight: '8px' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Left Column: Active Rentals */}
        <Col xs={24} lg={16}>
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Đơn thuê hiện tại & Chờ duyệt</Title>}
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '24px' }}
          >
            {activeBookings.length > 0 ? (
              <List
                itemLayout="vertical"
                dataSource={activeBookings}
                renderItem={(booking) => (
                  <List.Item
                    key={booking.id}
                    actions={[
                      <Button key="details" type="link" onClick={() => navigate(`/customer/rentals/${booking.id}`)}>
                        Chi tiết đơn hàng
                      </Button>
                    ]}
                    extra={
                      <img
                        width={200}
                        alt={booking.vehicleName}
                        src={booking.vehicleImage}
                        style={{ borderRadius: '6px', objectFit: 'cover' }}
                      />
                    }
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <Text strong style={{ fontSize: '16px' }}>{booking.vehicleName}</Text>
                          <StatusBadge status={booking.status} />
                        </Space>
                      }
                      description={`Mã đơn: ${booking.bookingCode}`}
                    />
                    <Space direction="vertical" size={4} style={{ marginTop: '8px', fontSize: '13px', color: '#414755' }}>
                      <div><strong>Thời gian nhận:</strong> {dayjs(booking.startDate).format('DD/MM/YYYY')} - <strong>Trả:</strong> {dayjs(booking.endDate).format('DD/MM/YYYY')} ({booking.totalDays} ngày)</div>
                      <div><strong>Nơi nhận:</strong> {booking.pickupLocation}</div>
                      <div><strong>Tổng thanh toán:</strong> <Text strong style={{ color: '#0053d0' }}>{formatPrice(booking.totalAmount)}</Text> ({booking.paymentStatus})</div>
                    </Space>
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#727786' }}>
                <CarOutlined style={{ fontSize: '48px', opacity: 0.3, marginBottom: '16px' }} />
                <div>Bạn không có đơn thuê xe hoạt động nào hiện tại.</div>
                <Button type="primary" style={{ marginTop: '16px', borderRadius: '6px' }} onClick={() => navigate('/customer/vehicles')}>
                  Đặt xe ngay
                </Button>
              </div>
            )}
          </Card>

          {/* Past Bookings */}
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Lịch sử chuyến đi</Title>}
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            {pastBookings.length > 0 ? (
              <List
                dataSource={pastBookings}
                renderItem={(booking) => (
                  <List.Item
                    key={booking.id}
                    actions={[
                      <Button key="details" type="link" onClick={() => navigate(`/customer/rentals/${booking.id}`)}>
                        Xem lại
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={booking.vehicleImage} shape="square" size={64} style={{ borderRadius: '6px' }} />}
                      title={<Text strong>{booking.vehicleName}</Text>}
                      description={
                        <Space direction="vertical" size={0}>
                          <Text type="secondary" style={{ fontSize: '12px' }}>Chuyến đi hoàn thành vào {dayjs(booking.endDate).format('DD/MM/YYYY')}</Text>
                          <Text style={{ fontSize: '13px' }}>Tổng thanh toán: {formatPrice(booking.totalAmount)}</Text>
                        </Space>
                      }
                    />
                    <StatusBadge status={booking.status} />
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#727786' }}>
                Không tìm thấy lịch sử chuyến đi nào.
              </div>
            )}
          </Card>
        </Col>

        {/* Right Column: Steps/Timeline & Account Status */}
        <Col xs={24} lg={8}>
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Trạng thái tài liệu</Title>}
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '24px' }}
          >
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>Giấy phép lái xe (GPLX)</Text>
                <StatusBadge status={customer?.licenseStatus || 'Chưa cập nhật'} />
              </div>
              
              {customer?.licenseStatus !== 'Đã xác minh' && (
                <Button type="primary" block style={{ borderRadius: '6px' }} onClick={() => navigate('/customer/documents')}>
                  Cập nhật tài liệu lái xe
                </Button>
              )}
            </Space>
          </Card>

          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Tiến trình hành trình tiếp theo</Title>}
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            <Timeline
              items={[
                {
                  color: 'green',
                  children: 'Chọn dòng xe & Đặt cọc thành công',
                },
                {
                  color: 'blue',
                  children: 'Ký hợp đồng thuê xe điện tử',
                },
                {
                  color: 'gray',
                  children: 'Xác nhận thông tin & GPLX của khách hàng',
                },
                {
                  color: 'gray',
                  children: 'Nhận xe tự lái tại Showroom',
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
