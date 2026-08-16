import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Space, Button, Tag, Divider, message, Alert } from 'antd';
import {
  CarOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
  SafetyCertificateOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [activeBooking, setActiveBooking] = useState<any>({
    id: 'BK-2026-0816',
    vehicleName: 'BMW 320i Sport-Line',
    vehicleImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=60',
    licensePlate: '30A-889.99',
    startDate: '20/08/2026',
    endDate: '24/08/2026',
    pickupTime: '09:00',
    pickupLocation: 'Showroom AutoRent Đống Đa - Hà Nội',
    status: 'CONFIRMED',
    totalAmount: 6500000,
    depositAmount: 15000000
  });

  const currentUser = api.auth.getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      api.customers.getById(currentUser.id).then(res => res && setCustomer(res));
    }
  }, [currentUser]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* SaaS Greeting Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>
            Xin chào, {currentUser?.name || 'Quý khách'}! 👋
          </Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>
            Quản lý hành trình, theo dõi bàn giao xe và kiểm tra hồ sơ cá nhân
          </Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => navigate('/customer/vehicles')}
          style={{ borderRadius: '8px', background: '#0f172a', borderColor: '#0f172a', fontWeight: 600 }}
        >
          Đặt xe mới
        </Button>
      </div>

      {/* ACTION CENTER - Urgent items for Customer (Spec 18 & 67) */}
      <div style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              padding: '14px 18px',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 700, color: '#166534', fontSize: '13px' }}>GPLX đã xác thực hợp lệ</div>
                <div style={{ fontSize: '11px', color: '#15803d' }}>Sẵn sàng nhận xe khi tới hẹn</div>
              </div>
              <CheckCircleOutlined style={{ color: '#16a34a', fontSize: '20px' }} />
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              padding: '14px 18px',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '13px' }}>Hợp đồng thuê #HD-081</div>
                <div style={{ fontSize: '11px', color: '#2563eb' }}>Đã ký số điện tử thành công</div>
              </div>
              <Button size="small" type="link" onClick={() => navigate('/customer/contracts')}>Xem HĐ</Button>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              padding: '14px 18px',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 700, color: '#92400e', fontSize: '13px' }}>Cọc xe an toàn 15.000.000đ</div>
                <div style={{ fontSize: '11px', color: '#b45309' }}>Hoàn trả ngay sau khi trả xe</div>
              </div>
              <Tag color="warning">ĐÃ CỌC</Tag>
            </div>
          </Col>
        </Row>
      </div>

      {/* UPCOMING TRIP HERO CARD (Spec 18 & 67) */}
      {activeBooking && (
        <Card
          style={{
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            marginBottom: '28px',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.06)'
          }}
          bodyStyle={{ padding: 0 }}
        >
          <div style={{ background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)', padding: '12px 24px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.05em', color: '#fbbf24' }}>
              CHUYẾN ĐI TIẾP THEO CỦA BẠN (UPCOMING TRIP)
            </span>
            <StatusBadge status={activeBooking.status} />
          </div>

          <div style={{ padding: '24px' }}>
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} md={10}>
                <div style={{ borderRadius: '12px', overflow: 'hidden', height: '200px' }}>
                  <img
                    src={activeBooking.vehicleImage}
                    alt={activeBooking.vehicleName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </Col>

              <Col xs={24} md={14}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <Title level={4} style={{ margin: '0 0 4px 0', color: '#0f172a', fontWeight: 800 }}>
                      {activeBooking.vehicleName}
                    </Title>
                    <Tag color="geekblue">{activeBooking.licensePlate}</Tag>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>TỔNG THANH TOÁN</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#1e3a8a' }}>
                      {formatPrice(activeBooking.totalAmount)}
                    </div>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                  <Row gutter={[16, 12]}>
                    <Col span={12}>
                      <div style={{ fontSize: '11px', color: '#64748b' }}><CalendarOutlined /> THỜI GIAN NHẬN XE</div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>{activeBooking.pickupTime} - {activeBooking.startDate}</div>
                    </Col>
                    <Col span={12}>
                      <div style={{ fontSize: '11px', color: '#64748b' }}><CalendarOutlined /> THỜI GIAN TRẢ XE</div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>17:00 - {activeBooking.endDate}</div>
                    </Col>
                    <Col span={24}>
                      <div style={{ fontSize: '11px', color: '#64748b' }}><EnvironmentOutlined /> ĐỊA ĐIỂM NHẬN XE</div>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: '#0f172a' }}>{activeBooking.pickupLocation}</div>
                    </Col>
                  </Row>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <Button 
                    type="primary" 
                    icon={<ArrowRightOutlined />}
                    onClick={() => navigate(`/customer/rentals/${activeBooking.id}`)}
                    style={{ borderRadius: '8px', background: '#0f172a', borderColor: '#0f172a', fontWeight: 600 }}
                  >
                    Xem chi tiết chuyến đi & Hợp đồng
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </Card>
      )}

      {/* Quick Access Grid */}
      <Row gutter={[20, 20]}>
        <Col xs={24} md={8}>
          <Card 
            hoverable 
            onClick={() => navigate('/customer/vehicles')}
            style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CarOutlined style={{ fontSize: '22px', color: '#2563eb' }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>Khám phá Đội xe</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Hơn 30 dòng xe tự lái cao cấp</div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card 
            hoverable 
            onClick={() => navigate('/customer/my-rentals')}
            style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CalendarOutlined style={{ fontSize: '22px', color: '#16a34a' }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>Lịch sử Đơn thuê</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Xem lại các chuyến đi đã hoàn tất</div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card 
            hoverable 
            onClick={() => navigate('/customer/documents')}
            style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SafetyCertificateOutlined style={{ fontSize: '22px', color: '#9333ea' }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>Hồ sơ & GPLX</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Quản lý thông tin định danh</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
