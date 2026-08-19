import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Form, DatePicker, Select, Button, Space, Row, Col, Typography, message, Divider } from 'antd';
import { InfoCircleOutlined, CarOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { Vehicle } from '@/services/mockData';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export const BookingStep1: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const vehicleId = searchParams.get('vehicleId');
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    if (vehicleId) {
      api.vehicles.getById(vehicleId).then(res => {
        if (res) {
          setVehicle(res);
        } else {
          message.error('Không tìm thấy xe yêu cầu!');
          navigate('/customer/vehicles');
        }
      });
    } else {
      navigate('/customer/vehicles');
    }
  }, [vehicleId, navigate]);

  const onFinish = (values: any) => {
    const start = dayjs(values.dates[0]);
    const end = dayjs(values.dates[1]);
    const days = end.diff(start, 'day') || 1;

    // Navigate to checkout with query params
    navigate(`/customer/booking/checkout?vehicleId=${vehicleId}&pickup=${values.pickup}&dropoff=${values.dropoff}&startDate=${start.format('YYYY-MM-DD')}&endDate=${end.format('YYYY-MM-DD')}&days=${days}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (!vehicle) return <div style={{ textAlign: 'center', padding: '100px 0' }}>Đang tải...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Đặt xe - Bước 1: Thời gian & Địa điểm</Title>
        <Text type="secondary">Cung cấp thông tin lịch trình di chuyển của bạn để hoàn tất đặt xe.</Text>
      </div>

      <Card variant="borderless" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={10} style={{ textAlign: 'center', borderRight: '1px solid #f0eded', paddingRight: '24px' }}>
            <img 
              src={vehicle.image} 
              alt={vehicle.name} 
              style={{ width: '100%', borderRadius: '6px', marginBottom: '16px', height: '120px', objectFit: 'cover' }}
            />
            <Title level={4} style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{vehicle.name}</Title>
            <Text type="secondary" style={{ display: 'block', fontSize: '13px' }}>{vehicle.type} • {vehicle.transmission}</Text>
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ fontSize: '13px', color: '#414755' }}>Đơn giá thuê</div>
            <Text strong style={{ fontSize: '20px', color: '#0053d0' }}>{formatPrice(vehicle.pricePerDay)}/ngày</Text>
          </Col>

          <Col xs={24} md={14} style={{ paddingLeft: '24px' }}>
            <Form
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                pickup: 'Hà Nội',
                dropoff: 'Hà Nội'
              }}
              requiredMark={false}
            >
              <Form.Item
                name="pickup"
                label="Địa điểm nhận xe"
                rules={[{ required: true, message: 'Chọn nơi nhận xe!' }]}
              >
                <Select options={[
                  { value: 'Hà Nội', label: 'Hà Nội (Showroom Cầu Giấy)' },
                  { value: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh (Showroom Quận 3)' },
                  { value: 'Đà Nẵng', label: 'Đà Nẵng (Showroom Hải Châu)' }
                ]} style={{ height: '40px' }} />
              </Form.Item>

              <Form.Item
                name="dropoff"
                label="Địa điểm trả xe"
                rules={[{ required: true, message: 'Chọn nơi trả xe!' }]}
              >
                <Select options={[
                  { value: 'Hà Nội', label: 'Hà Nội (Showroom Cầu Giấy)' },
                  { value: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh (Showroom Quận 3)' },
                  { value: 'Đà Nẵng', label: 'Đà Nẵng (Showroom Hải Châu)' }
                ]} style={{ height: '40px' }} />
              </Form.Item>

              <Form.Item
                name="dates"
                label="Thời gian thuê (Nhận - Trả)"
                rules={[{ required: true, message: 'Vui lòng chọn khoảng thời gian!' }]}
              >
                <DatePicker.RangePicker 
                  showTime 
                  style={{ width: '100%', height: '40px' }} 
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                  placeholder={['Ngày nhận', 'Ngày trả']}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  size="large" 
                  block 
                  style={{ height: '44px', borderRadius: '6px', fontWeight: 600 }}
                >
                  Tiếp tục đặt xe
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
