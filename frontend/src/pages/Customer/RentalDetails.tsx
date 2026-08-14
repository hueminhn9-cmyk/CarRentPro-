import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Space, Timeline, Button, Descriptions, Divider, message, Modal } from 'antd';
import { FileTextOutlined, EditOutlined, BankOutlined, CheckCircleOutlined, ArrowLeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { Booking } from '@/services/mockData';
import { StatusBadge } from '@/components/common/StatusBadge';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

export const RentalDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    if (id) {
      api.bookings.getById(id).then(res => res && setBooking(res));
    }
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleSignContract = () => {
    if (!booking) return;
    setSigning(true);
    Modal.confirm({
      title: 'Xác nhận ký hợp đồng điện tử',
      icon: <ExclamationCircleOutlined />,
      content: 'Bằng việc xác nhận, bạn đồng ý ký tên điện tử vào hợp đồng cho thuê xe tự lái và cam kết tuân thủ các nghĩa vụ bảo quản phương tiện của AutoRent.',
      okText: 'Ký hợp đồng',
      cancelText: 'Hủy bỏ',
      onOk: async () => {
        try {
          await api.bookings.signContract(booking.bookingCode);
          message.success('Ký hợp đồng điện tử thành công!');
          // Refresh booking details
          api.bookings.getById(booking.id).then(res => res && setBooking(res));
        } catch (e) {
          message.error('Ký hợp đồng thất bại!');
        } finally {
          setSigning(false);
        }
      },
      onCancel: () => {
        setSigning(false);
      }
    });
  };

  if (!booking) return <div style={{ textAlign: 'center', padding: '100px 0' }}>Đang tải...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/customer/rentals')}
          style={{ padding: 0, marginBottom: '8px' }}
        >
          Quay lại đơn thuê của tôi
        </Button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Chi tiết đơn thuê: {booking.bookingCode}</Title>
            <Text type="secondary">Tạo lúc: {dayjs(booking.createdAt).format('HH:mm DD/MM/YYYY')}</Text>
          </div>
          <StatusBadge status={booking.status} />
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column: Progress Timeline and Actions */}
        <Col xs={24} md={16}>
          {/* Contract Sign Alert Card */}
          {!booking.contractSigned && booking.status !== 'Đã hủy' && (
            <Card bordered={false} style={{ backgroundColor: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '8px', marginBottom: '24px' }}>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>Hợp đồng thuê xe điện tử chưa ký</div>
                <Text style={{ fontSize: '13px' }}>
                  Hợp đồng cho thuê xe số {booking.bookingCode} đã sẵn sàng. Vui lòng kiểm tra kỹ điều khoản và ký điện tử để nhân viên showroom chuẩn bị bàn giao xe.
                </Text>
                <Button 
                  type="primary" 
                  icon={<EditOutlined />} 
                  onClick={handleSignContract}
                  loading={signing}
                  style={{ borderRadius: '6px' }}
                >
                  Ký điện tử ngay
                </Button>
              </Space>
            </Card>
          )}

          {/* Timeline Card */}
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Tiến trình bàn giao xe</Title>} 
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '24px' }}
          >
            <Timeline
              items={[
                {
                  color: 'green',
                  children: (
                    <div>
                      <div style={{ fontWeight: 600 }}>Tạo đơn đặt xe thành công</div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Lúc {dayjs(booking.createdAt).format('HH:mm DD/MM/YYYY')}</Text>
                    </div>
                  )
                },
                {
                  color: booking.contractSigned ? 'green' : 'blue',
                  children: (
                    <div>
                      <div style={{ fontWeight: 600 }}>Hợp đồng thuê xe điện tử</div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {booking.contractSigned ? 'Khách hàng đã ký lúc ' + dayjs(booking.createdAt).format('DD/MM/YYYY') : 'Đang chờ khách hàng ký tên'}
                      </Text>
                    </div>
                  )
                },
                {
                  color: booking.paymentStatus === 'Đã thanh toán' ? 'green' : 'gray',
                  children: (
                    <div>
                      <div style={{ fontWeight: 600 }}>Thanh toán đặt cọc</div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {booking.paymentStatus === 'Đã thanh toán' ? 'Đã hoàn tất thanh toán cọc' : 'Đang chờ xử lý thanh toán'}
                      </Text>
                    </div>
                  )
                },
                {
                  color: booking.status === 'Đang thuê' || booking.status === 'Hoàn thành' ? 'green' : 'gray',
                  children: (
                    <div>
                      <div style={{ fontWeight: 600 }}>Showroom bàn giao xe</div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {booking.status === 'Đang thuê' ? 'Đã nhận xe tự lái' : 'Chưa bàn giao xe'}
                      </Text>
                    </div>
                  )
                },
                {
                  color: booking.status === 'Hoàn thành' ? 'green' : 'gray',
                  children: (
                    <div>
                      <div style={{ fontWeight: 600 }}>Hoàn trả xe & Thanh lý hợp đồng</div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {booking.status === 'Hoàn thành' ? 'Đã hoàn trả xe sạch sẽ, an toàn' : 'Hành trình chưa kết thúc'}
                      </Text>
                    </div>
                  )
                }
              ]}
            />
          </Card>

          {/* Cost breakdown */}
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Hóa đơn thanh toán</Title>} 
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            <Descriptions column={1} size="small" labelStyle={{ color: '#414755' }}>
              <Descriptions.Item label={`Đơn giá thuê (${booking.totalDays} ngày)`}>
                {formatPrice(booking.pricePerDay * booking.totalDays)}
              </Descriptions.Item>
              <Descriptions.Item label="Bảo hiểm vật chất xe tự lái">
                {formatPrice(booking.insuranceFee)}
              </Descriptions.Item>
              <Descriptions.Item label="Phí dịch vụ & Vệ sinh bàn giao">
                {formatPrice(booking.serviceFee)}
              </Descriptions.Item>
              <Descriptions.Item label={<span style={{ fontWeight: 600, fontSize: '14px' }}>Tổng chi phí</span>}>
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
              {booking.status === 'Hoàn thành' && (
                <Button 
                  type="primary" 
                  icon={<CheckCircleOutlined />} 
                  onClick={() => navigate(`/customer/rentals/${booking.id}/review`)}
                  style={{ borderRadius: '6px' }}
                >
                  Gửi đánh giá xe
                </Button>
              )}
            </div>
          </Card>
        </Col>

        {/* Right Column: Vehicle Details and Contract Status */}
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '24px' }}>
            <img 
              src={booking.vehicleImage} 
              alt={booking.vehicleName} 
              style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px', marginBottom: '16px' }}
            />
            <Title level={5} style={{ margin: '0 0 4px 0' }}>{booking.vehicleName}</Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>Dòng xe tự lái chất lượng cao</Text>
            
            <Divider style={{ margin: '16px 0' }} />
            
            <Space direction="vertical" size={8} style={{ width: '100%', fontSize: '13px' }}>
              <div><strong>Nhận xe tại:</strong> {booking.pickupLocation}</div>
              <div><strong>Trả xe tại:</strong> {booking.dropoffLocation}</div>
              <div><strong>Từ:</strong> {booking.startDate}</div>
              <div><strong>Đến:</strong> {booking.endDate}</div>
            </Space>
          </Card>

          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Title level={5} style={{ fontSize: '14px', marginBottom: '12px' }}>Hợp đồng thuê xe</Title>
            <Space size={8} direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                <Text type="secondary">Trạng thái:</Text>
                <Text strong>{booking.contractSigned ? 'Đã ký tên điện tử' : 'Chờ khách hàng ký'}</Text>
              </div>
              <Button 
                type="dashed" 
                block 
                disabled={!booking.contractSigned}
                icon={<FileTextOutlined />}
                style={{ borderRadius: '6px', fontSize: '13px' }}
                onClick={() => message.success('Đang tải tệp PDF bản hợp đồng...')}
              >
                Tải bản hợp đồng (PDF)
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
