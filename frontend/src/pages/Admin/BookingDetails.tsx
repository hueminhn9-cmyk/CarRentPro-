import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Space, Button, Descriptions, Divider, Timeline, message } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined, CarOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { Booking, Customer } from '@/services/mockData';
import { StatusBadge } from '@/components/common/StatusBadge';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export const AdminBookingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      api.bookings.getById(id).then(res => {
        if (res) {
          setBooking(res);
          api.customers.getById(res.customerId).then(cust => cust && setCustomer(cust));
        }
      });
    }
  }, [id]);

  const handleStatusChange = async (status: Booking['status'], paymentStatus?: Booking['paymentStatus']) => {
    if (!booking) return;
    setLoading(true);
    try {
      await api.bookings.updateStatus(booking.id, status, paymentStatus);
      message.success('Cập nhật trạng thái đơn thuê thành công!');
      // Refresh details
      api.bookings.getById(booking.id).then(res => {
        res && setBooking(res);
      });
    } catch (e) {
      message.error('Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (!booking) return <div style={{ textAlign: 'center', padding: '100px 0' }}>Đang tải...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/admin/bookings')}
          style={{ padding: 0, marginBottom: '8px' }}
        >
          Quay lại danh sách đơn thuê
        </Button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Đơn thuê: {booking.bookingCode}</Title>
            <Text type="secondary">Tạo lúc: {dayjs(booking.createdAt).format('HH:mm DD/MM/YYYY')}</Text>
          </div>
          <StatusBadge status={booking.status} />
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column: Client & Cost specifications */}
        <Col xs={24} md={16}>
          {/* Customer info card */}
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Thông tin khách hàng</Title>} 
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '24px' }}
          >
            <Descriptions column={2} size="small">
              <Descriptions.Item label="Họ tên">{booking.customerName}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{booking.customerPhone}</Descriptions.Item>
              <Descriptions.Item label="Email">{booking.customerEmail}</Descriptions.Item>
              <Descriptions.Item label="CCCD">{customer?.idCard || 'Đang cập nhật'}</Descriptions.Item>
              <Descriptions.Item label="Xác minh GPLX">
                <StatusBadge status={customer?.licenseStatus || 'Chưa cập nhật'} />
              </Descriptions.Item>
              <Descriptions.Item label="Hạng thành viên">{customer?.tier || 'Bạc'}</Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Pricing detail */}
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Chi tiết thanh toán</Title>} 
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '24px' }}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label={`Giá thuê (${booking.totalDays} ngày)`}>
                {formatPrice(booking.pricePerDay * booking.totalDays)}
              </Descriptions.Item>
              <Descriptions.Item label="Phí bảo hiểm vật chất">
                {formatPrice(booking.insuranceFee)}
              </Descriptions.Item>
              <Descriptions.Item label="Phí dịch vụ">
                {formatPrice(booking.serviceFee)}
              </Descriptions.Item>
              <Descriptions.Item label={<span style={{ fontWeight: 600 }}>Tổng tiền thanh toán</span>}>
                <span style={{ fontWeight: 700, fontSize: '18px', color: '#0053d0' }}>{formatPrice(booking.totalAmount)}</span>
              </Descriptions.Item>
            </Descriptions>
            
            <Divider style={{ margin: '16px 0' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text type="secondary">Trạng thái thanh toán:</Text>
                <div style={{ marginTop: '4px' }}>
                  <StatusBadge status={booking.paymentStatus} />
                </div>
              </div>
              <div style={{ fontSize: '13px' }}>
                Phương thức: <strong>{booking.paymentMethod}</strong>
              </div>
            </div>
          </Card>

          {/* Admin Operations Board */}
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Thao tác nghiệp vụ</Title>} 
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            <Space size={16} wrap>
              {booking.status === 'Chờ xác nhận' && (
                <>
                  <Button 
                    type="primary" 
                    icon={<CheckCircleOutlined />} 
                    onClick={() => handleStatusChange('Đang thuê', 'Đã thanh toán')}
                    loading={loading}
                    style={{ borderRadius: '6px' }}
                  >
                    Duyệt đơn & Giao xe
                  </Button>
                  <Button 
                    type="default" 
                    danger 
                    icon={<CloseCircleOutlined />} 
                    onClick={() => handleStatusChange('Đã hủy', 'Hoàn tiền')}
                    loading={loading}
                    style={{ borderRadius: '6px' }}
                  >
                    Từ chối đơn đặt
                  </Button>
                </>
              )}

              {booking.status === 'Đang thuê' && (
                <>
                  <Button 
                    type="primary" 
                    icon={<CheckCircleOutlined />} 
                    onClick={() => handleStatusChange('Hoàn thành')}
                    loading={loading}
                    style={{ borderRadius: '6px' }}
                  >
                    Hoàn thành thuê & Nhận xe
                  </Button>
                  
                  <Button
                    type="dashed"
                    icon={<CarOutlined />}
                    onClick={() => navigate(`/admin/handover/${booking.id}`)}
                    style={{ borderRadius: '6px' }}
                  >
                    Biên bản bàn giao xe (Checklist)
                  </Button>
                </>
              )}

              {booking.status === 'Hoàn thành' && (
                <div style={{ color: '#52c41a', fontWeight: 600 }}>
                  ✓ Đơn hàng đã kết thúc, phương tiện đã được bàn giao an toàn về showroom.
                </div>
              )}

              {booking.status === 'Đã hủy' && (
                <div style={{ color: '#ff4d4f', fontWeight: 600 }}>
                  ✗ Đơn hàng đã bị hủy. Trạng thái cọc: {booking.paymentStatus}.
                </div>
              )}
            </Space>
          </Card>
        </Col>

        {/* Right Column: Vehicle Assigned & Progress */}
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '24px' }}>
            <img 
              src={booking.vehicleImage} 
              alt={booking.vehicleName} 
              style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px', marginBottom: '16px' }}
            />
            <Title level={5} style={{ margin: '0 0 4px 0' }}>{booking.vehicleName}</Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>Mã xe phân phối: {booking.vehicleId}</Text>
            
            <Divider style={{ margin: '16px 0' }} />
            
            <Space direction="vertical" size={8} style={{ width: '100%', fontSize: '13px' }}>
              <div><strong>Showroom giao xe:</strong> {booking.pickupLocation}</div>
              <div><strong>Thời gian nhận:</strong> {booking.startDate}</div>
              <div><strong>Thời gian trả:</strong> {booking.endDate}</div>
              <div><strong>Hợp đồng ký kết:</strong> {booking.contractSigned ? 'Đã ký điện tử' : 'Chưa ký'}</div>
            </Space>
          </Card>

          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Title level={5} style={{ fontSize: '14px', marginBottom: '16px' }}>Hành trình thủ tục</Title>
            <Timeline
              items={[
                { color: 'green', children: 'Đơn đặt cọc được tạo' },
                { color: booking.contractSigned ? 'green' : 'blue', children: 'Khách ký hợp đồng điện tử' },
                { color: booking.paymentStatus === 'Đã thanh toán' ? 'green' : 'gray', children: 'Xác nhận nhận cọc' },
                { color: booking.status === 'Đang thuê' || booking.status === 'Hoàn thành' ? 'green' : 'gray', children: 'Đã bàn giao xe cho khách' }
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
