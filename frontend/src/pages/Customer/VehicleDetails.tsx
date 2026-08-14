import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Space, Button, Divider, List, Rate, Tag, message } from 'antd';
import { StarFilled, EnvironmentOutlined, InfoCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { Vehicle } from '@/services/mockData';
import { StatusBadge } from '@/components/common/StatusBadge';

const { Title, Text, Paragraph } = Typography;

export const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    if (id) {
      api.vehicles.getById(id).then(res => {
        if (res) {
          setVehicle(res);
        } else {
          message.error('Không tìm thấy xe yêu cầu!');
          navigate('/vehicles');
        }
      });
    }
  }, [id, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleBooking = () => {
    if (!vehicle) return;
    const currentUser = api.auth.getCurrentUser();
    if (currentUser) {
      navigate(`/customer/booking/step1?vehicleId=${vehicle.id}`);
    } else {
      message.warning('Vui lòng đăng nhập để tiến hành đặt xe!');
      navigate(`/auth/login?redirect=${encodeURIComponent(`/customer/booking/step1?vehicleId=${vehicle.id}`)}`);
    }
  };

  if (!vehicle) return <div style={{ textAlign: 'center', padding: '100px 0' }}>Đang tải thông tin xe...</div>;

  const mockReviews = [
    { name: 'Nguyễn Minh Quân', rating: 5, date: '2026-06-28', comment: 'Xe đi cực kỳ êm và tiết kiệm pin. Chủ xe giao nhận rất đúng giờ và thân thiện. Sẽ tiếp tục ủng hộ!' },
    { name: 'Phan Hoàng Nam', rating: 4, date: '2026-05-14', comment: 'Nội thất sạch sẽ, đời mới. Điều hòa mát sâu. Thủ tục nhận xe nhanh chóng.' }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Space size={8} style={{ fontSize: '13px', marginBottom: '8px' }}>
          <a onClick={() => navigate('/vehicles')}>Danh sách xe</a>
          <span>/</span>
          <Text type="secondary">{vehicle.name}</Text>
        </Space>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <Title level={2} style={{ margin: 0, fontWeight: 700 }}>{vehicle.name}</Title>
            <Space size={12} style={{ marginTop: '4px' }}>
              <Space size={4}>
                <StarFilled style={{ color: '#faad14' }} />
                <Text strong>{vehicle.rating}</Text>
                <Text type="secondary">({vehicle.reviewsCount} đánh giá)</Text>
              </Space>
              <span>•</span>
              <Space size={4}>
                <EnvironmentOutlined />
                <Text>{vehicle.location}</Text>
              </Space>
            </Space>
          </div>
          <StatusBadge status={vehicle.status} />
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column: Image, Description, Features, Reviews */}
        <Col xs={24} lg={16}>
          {/* Main Image */}
          <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ overflow: 'hidden', borderRadius: '8px', marginBottom: '24px' }}>
            <img 
              alt={vehicle.name} 
              src={vehicle.image} 
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
          </Card>

          {/* Specifications Grid */}
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Thông số kỹ thuật</Title>} 
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '24px' }}
          >
            <Row gutter={[16, 24]}>
              {[
                { label: 'Số chỗ ngồi', value: `${vehicle.seats} chỗ` },
                { label: 'Hộp số', value: vehicle.transmission },
                { label: 'Nhiên liệu', value: vehicle.fuel },
                { label: 'Mức tiêu hao', value: vehicle.fuelConsumption },
                { label: 'Năm sản xuất', value: vehicle.year },
                { label: 'Màu sắc', value: vehicle.color }
              ].map((spec, idx) => (
                <Col xs={12} sm={8} key={idx}>
                  <Text type="secondary" style={{ fontSize: '13px', display: 'block' }}>{spec.label}</Text>
                  <Text strong style={{ fontSize: '15px' }}>{spec.value}</Text>
                </Col>
              ))}
            </Row>
          </Card>

          {/* Description */}
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Mô tả chi tiết</Title>} 
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '24px' }}
          >
            <Paragraph style={{ fontSize: '14px', lineHeight: 1.6, color: '#414755' }}>
              {vehicle.description}
            </Paragraph>
          </Card>

          {/* Features */}
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Tính năng nổi bật</Title>} 
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '24px' }}
          >
            <Row gutter={[16, 16]}>
              {vehicle.features.map((feat, idx) => (
                <Col xs={12} sm={8} key={idx}>
                  <Space>
                    <CheckOutlined style={{ color: '#52c41a' }} />
                    <Text>{feat}</Text>
                  </Space>
                </Col>
              ))}
            </Row>
          </Card>

          {/* Reviews */}
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Đánh giá từ khách hàng ({vehicle.reviewsCount})</Title>} 
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            <List
              dataSource={mockReviews}
              renderItem={(item) => (
                <List.Item style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '16px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '8px' }}>
                    <Text strong>{item.name}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{item.date}</Text>
                  </div>
                  <Rate disabled defaultValue={item.rating} style={{ fontSize: '14px', marginBottom: '8px' }} />
                  <Paragraph style={{ color: '#414755', fontSize: '13px', margin: 0 }}>{item.comment}</Paragraph>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Right Column: Pricing & Booking Panel */}
        <Col xs={24} lg={8}>
          <Card 
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', position: 'sticky', top: '88px' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Text type="secondary">Giá thuê</Text>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#0053d0', marginTop: '4px' }}>
                {formatPrice(vehicle.pricePerDay)}
                <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#414755' }}> /ngày</span>
              </div>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <div style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', padding: '12px', borderRadius: '6px' }}>
                <Space align="start">
                  <InfoCircleOutlined style={{ color: '#52c41a', marginTop: '3px' }} />
                  <div style={{ fontSize: '12px', color: '#414755' }}>
                    <strong>Bảo hiểm thuê xe:</strong> {vehicle.insurance}
                  </div>
                </Space>
              </div>

              <Button 
                type="primary" 
                size="large" 
                block 
                disabled={vehicle.status !== 'Có sẵn'}
                onClick={handleBooking}
                style={{ height: '48px', borderRadius: '8px', fontWeight: 600 }}
              >
                {vehicle.status === 'Có sẵn' ? 'Đặt xe ngay' : `Xe đang ${vehicle.status.toLowerCase()}`}
              </Button>

              <div style={{ textAlign: 'center', fontSize: '12px', color: '#727786' }}>
                Không hủy ngang trong vòng 24h trước khi khởi hành.
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
