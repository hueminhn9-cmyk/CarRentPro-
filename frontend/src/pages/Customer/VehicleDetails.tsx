import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Space, Button, Divider, List, Rate, Tag, DatePicker, message } from 'antd';
import {
  StarFilled,
  EnvironmentOutlined,
  InfoCircleOutlined,
  CheckOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';
import { StatusBadge } from '@/components/common/StatusBadge';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

export const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<any>(null);
  const [dates, setDates] = useState<any>([dayjs().add(1, 'day'), dayjs().add(5, 'day')]);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    if (id) {
      api.vehicles.getById(id).then((res: any) => {
        if (res) {
          setVehicle(res);
          setSelectedImage(res.imageUrl || res.image || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=60');
        } else {
          message.error('Không tìm thấy xe yêu cầu!');
          navigate('/vehicles');
        }
      });
    }
  }, [id, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  const days = dates && dates[0] && dates[1] ? dates[1].diff(dates[0], 'day') : 4;
  const pricePerDay = vehicle?.pricePerDay || 1500000;
  const rentalTotal = days * pricePerDay;
  const depositAmount = 15000000;
  const totalPayment = rentalTotal + depositAmount;

  const handleBooking = () => {
    if (!vehicle) return;
    const currentUser = api.auth.getCurrentUser();
    if (currentUser) {
      navigate(`/customer/checkout?vehicleId=${vehicle.id}&days=${days}`);
    } else {
      message.warning('Vui lòng đăng nhập để tiếp tục!');
      navigate(`/auth/login?redirect=${encodeURIComponent(`/customer/checkout?vehicleId=${vehicle.id}&days=${days}`)}`);
    }
  };

  if (!vehicle) return <div style={{ textAlign: 'center', padding: '100px 0' }}>Đang tải thông tin xe...</div>;

  const galleryImages = [
    selectedImage,
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=60'
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
      {/* Breadcrumb & Title */}
      <div style={{ marginBottom: '20px' }}>
        <Space size={8} style={{ fontSize: '13px', marginBottom: '8px' }}>
          <a onClick={() => navigate('/vehicles')} style={{ color: '#64748b' }}>Đội xe cho thuê</a>
          <span>/</span>
          <Text strong>{vehicle.name}</Text>
        </Space>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>{vehicle.name}</Title>
            <Space size={14} style={{ marginTop: '6px', fontSize: '13px', color: '#64748b' }}>
              <Space size={4}>
                <StarFilled style={{ color: '#f59e0b' }} />
                <Text strong>4.9</Text>
                <span>(38 đánh giá thực tế)</span>
              </Space>
              <span>•</span>
              <Space size={4}>
                <EnvironmentOutlined />
                <span>Showroom Đống Đa - Hà Nội</span>
              </Space>
            </Space>
          </div>
          <StatusBadge status={vehicle.status || 'AVAILABLE'} />
        </div>
      </div>

      <Row gutter={[28, 28]}>
        {/* Left Column: Gallery, Specs, Description, Reviews (2/3) */}
        <Col xs={24} lg={15}>
          {/* Gallery Main */}
          <Card styles={{ body: { padding: 0 } }} style={{ overflow: 'hidden', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
            <img 
              alt={vehicle.name} 
              src={selectedImage} 
              style={{ width: '100%', height: '420px', objectFit: 'cover' }}
            />
          </Card>

          {/* Thumbnails */}
          <Row gutter={[10, 10]} style={{ marginBottom: '24px' }}>
            {galleryImages.map((img, idx) => (
              <Col span={6} key={idx}>
                <div 
                  onClick={() => setSelectedImage(img)}
                  style={{
                    height: '80px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedImage === img ? '2px solid #0f172a' : '1px solid #e2e8f0',
                    opacity: selectedImage === img ? 1 : 0.7,
                    transition: 'all 0.2s'
                  }}
                >
                  <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </Col>
            ))}
          </Row>

          {/* Specifications */}
          <Card 
            title={<span style={{ fontWeight: 700, fontSize: '15px' }}>Thông số Kỹ thuật & Trang bị</span>}
            style={{ borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}
          >
            <Row gutter={[16, 20]}>
              {[
                { label: 'Số chỗ ngồi', value: `${vehicle.seats || 5} chỗ tiêu chuẩn` },
                { label: 'Hộp số', value: vehicle.transmission || 'Số tự động' },
                { label: 'Loại nhiên liệu', value: vehicle.fuel || 'Xăng / Điện' },
                { label: 'Tiêu hao nhiên liệu', value: '7.5 L / 100km' },
                { label: 'Đời xe (Năm SX)', value: '2024 (Đời mới)' },
                { label: 'Bảo hiểm thân vỏ', value: 'Gói VIP 2 chiều' }
              ].map((spec, idx) => (
                <Col xs={12} sm={8} key={idx}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>{spec.label}</Text>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a', marginTop: '2px' }}>{spec.value}</div>
                </Col>
              ))}
            </Row>
          </Card>

          {/* Policy & Checklist */}
          <Card 
            title={<span style={{ fontWeight: 700, fontSize: '15px' }}>Chính sách & Thủ tục Nhận xe</span>}
            style={{ borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#475569' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckOutlined style={{ color: '#16a34a' }} />
                <span>Xuất trình bản gốc CCCD gắn chip và Giấy phép lái xe (hạng B1 trở lên).</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckOutlined style={{ color: '#16a34a' }} />
                <span>Đặt cọc thế chấp an toàn 15.000.000đ (Hoàn trả 100% khi thanh lý hợp đồng).</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckOutlined style={{ color: '#16a34a' }} />
                <span>Giới hạn 300 km/ngày, phụ phí vượt km chỉ 5.000đ/km.</span>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right Column: Sticky Booking Panel (1/3) */}
        <Col xs={24} lg={9}>
          <Card
            style={{
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08)',
              position: 'sticky',
              top: '88px'
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>GIÁ THUÊ TỰ LÁI</span>
              <div>
                <span style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{formatPrice(pricePerDay)}</span>
                <span style={{ fontSize: '13px', color: '#64748b' }}> /ngày</span>
              </div>
            </div>

            <Divider style={{ margin: '14px 0' }} />

            {/* Date Selector */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                CHỌN NGÀY NHẬN & TRẢ XE:
              </div>
              <RangePicker
                value={dates}
                onChange={setDates}
                style={{ width: '100%', height: '42px', borderRadius: '8px' }}
                format="DD/MM/YYYY"
              />
            </div>

            {/* Instant Calculation */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <Text type="secondary">Tiền thuê ({days} ngày):</Text>
                <Text strong>{formatPrice(rentalTotal)}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <Text type="secondary">Bảo hiểm 2 chiều:</Text>
                <Text strong style={{ color: '#16a34a' }}>Miễn phí</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <Text type="secondary">Tiền cọc thế chấp:</Text>
                <Text strong style={{ color: '#d97706' }}>{formatPrice(depositAmount)}</Text>
              </div>
              <Divider style={{ margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong style={{ fontSize: '13px' }}>TỔNG THANH TOÁN (GỒM CỌC):</Text>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#1e3a8a' }}>
                  {formatPrice(totalPayment)}
                </span>
              </div>
            </div>

            {/* Action CTA */}
            <Button
              type="primary"
              size="large"
              block
              onClick={handleBooking}
              style={{
                height: '48px',
                borderRadius: '8px',
                background: '#0f172a',
                borderColor: '#0f172a',
                fontWeight: 700,
                fontSize: '15px'
              }}
            >
              TIẾN HÀNH ĐẶT XE NGAY
            </Button>

            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11px', color: '#94a3b8' }}>
              ✓ Hủy miễn phí trước 24h • Hỗ trợ giao xe tận nơi
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
