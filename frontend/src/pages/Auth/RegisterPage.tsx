import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Row, Col, Tag } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, CarOutlined, SafetyCertificateOutlined, EnvironmentOutlined, StarFilled, ThunderboltOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';

const { Title, Text, Paragraph } = Typography;

const FEATURED_CARS = [
  {
    name: 'VinFast VF8',
    category: 'Xe Điện Hạng Sang',
    price: '1.200.000đ',
    tag: 'Clean & Green',
    tagColor: 'green',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&auto=format&fit=crop&q=60',
    specs: '5 Chỗ • Tự Động • Pin 400km'
  },
  {
    name: 'Toyota Camry 2.5Q',
    category: 'Sedan Doanh Nhân',
    price: '1.100.000đ',
    tag: 'Sang Trọng',
    tagColor: 'gold',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&auto=format&fit=crop&q=60',
    specs: '5 Chỗ • Tự Động • Êm Ái'
  },
  {
    name: 'Mazda CX-5',
    category: 'SUV Crossover',
    price: '900.000đ',
    tag: 'Hot Pick',
    tagColor: 'blue',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&auto=format&fit=crop&q=60',
    specs: '5 Chỗ • Tự Động • Thể Thao'
  },
  {
    name: 'Ford Everest',
    category: 'SUV 7 Chỗ Đa Địa Hình',
    price: '1.300.000đ',
    tag: 'Rộng Rãi',
    tagColor: 'purple',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&auto=format&fit=crop&q=60',
    specs: '7 Chỗ • 2 Cầu • Mạnh Mẽ'
  }
];

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await api.auth.register(values.fullName, values.email, values.phone, values.password);
      message.success(`Đăng ký tài khoản thành công! Xin chào ${values.fullName}. Đăng nhập để trải nghiệm.`);
      navigate('/auth/login');
    } catch (err: any) {
      message.error(err?.message || 'Đăng ký thất bại. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f8fafc' }}>
      <Row style={{ width: '100%' }}>
        {/* Left Side: Register Form */}
        <Col xs={24} md={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '32px 24px' }}>
          <div style={{ width: '100%', maxWidth: '440px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', cursor: 'pointer' }} onClick={() => navigate('/')}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <CarOutlined style={{ fontSize: '22px', color: '#ffffff' }} />
              </div>
              <Title level={3} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>AutoRent</Title>
            </div>

            <Title level={2} style={{ marginBottom: '8px', fontWeight: 800, color: '#0f172a' }}>Đăng ký Tài khoản</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: '24px', fontSize: '14px' }}>
              Tạo tài khoản để trải nghiệm đặt xe tự lái.
            </Text>

            <Form
              form={form}
              name="register_form"
              onFinish={onFinish}
              layout="vertical"
              requiredMark={false}
            >
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#64748b' }} />}
                  placeholder="Nhập họ và tên"
                  style={{ height: '42px', borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Địa chỉ Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không đúng định dạng!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: '#64748b' }} />}
                  placeholder="Nhập email"
                  style={{ height: '42px', borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input
                  prefix={<PhoneOutlined style={{ color: '#64748b' }} />}
                  placeholder="Nhập số điện thoại"
                  style={{ height: '42px', borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 6, message: 'Mật khẩu phải từ 6 ký tự trở lên!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#64748b' }} />}
                  placeholder="Nhập mật khẩu"
                  style={{ height: '42px', borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item style={{ marginTop: '12px' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{
                    width: '100%',
                    height: '44px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '15px',
                    backgroundColor: '#2563eb',
                    borderColor: '#2563eb'
                  }}
                >
                  Tạo Tài Khoản
                </Button>
              </Form.Item>
            </Form>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <Text type="secondary" style={{ fontSize: '13px' }}>Đã có tài khoản? </Text>
              <Button
                type="link"
                style={{ padding: 0, fontSize: '13px', fontWeight: 600, color: '#2563eb' }}
                onClick={() => navigate('/auth/login')}
              >
                Quay lại Đăng nhập
              </Button>
            </div>
          </div>
        </Col>

        {/* Right Side: Professional Fleet Showcase & Promo */}
        <Col xs={0} md={12} style={{
          background: 'linear-gradient(135deg, #0b1329 0%, #1e3a8a 50%, #0f172a 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 36px',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle Ambient Background Lighting */}
          <div style={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, rgba(0,0,0,0) 70%)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }} />

          <div style={{ maxWidth: '520px', width: '100%', zIndex: 2 }}>
            <div style={{ marginBottom: '20px' }}>
              <Tag color="blue" style={{ borderRadius: '20px', padding: '4px 12px', fontWeight: 700, fontSize: '12px', border: 'none', background: 'rgba(37,99,235,0.3)', color: '#60a5fa', marginBottom: '12px' }}>
                <StarFilled style={{ color: '#fbbf24', marginRight: '6px' }} /> ĐỘI XE TỰ LÁI HÀNG ĐẦU ĐÀ NẴNG
              </Tag>
              <Title level={2} style={{ color: '#ffffff', margin: '4px 0 8px', fontSize: '26px', fontWeight: 800, lineHeight: 1.3 }}>
                Khám Phá Dàn Xe Sang Trọng & Đa Dạng
              </Title>
              <Paragraph style={{ color: '#94a3b8', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>
                Đội xe đời mới 2024-2026 được bảo dưỡng định kỳ, giao xe tận nơi 24/7 và miễn phí thủ tục xác minh.
              </Paragraph>
            </div>

            {/* 2x2 Grid Car Showcase Cards */}
            <Row gutter={[12, 12]} style={{ marginBottom: '24px' }}>
              {FEATURED_CARS.map((car, idx) => (
                <Col span={12} key={idx}>
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '14px',
                    padding: '10px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
                  }}>
                    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px', marginBottom: '8px' }}>
                      <img
                        src={car.image}
                        alt={car.name}
                        style={{ width: '100%', height: '95px', objectFit: 'cover', display: 'block', borderRadius: '8px' }}
                      />
                      <Tag color={car.tagColor} style={{ position: 'absolute', top: '6px', right: '6px', margin: 0, fontSize: '10px', fontWeight: 700, borderRadius: '4px' }}>
                        {car.tag}
                      </Tag>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <Text style={{ color: '#ffffff', fontWeight: 700, fontSize: '13px', display: 'block', lineHeight: 1.2 }}>{car.name}</Text>
                        <Text style={{ color: '#94a3b8', fontSize: '10px', display: 'block' }}>{car.specs}</Text>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <Text style={{ color: '#60a5fa', fontWeight: 800, fontSize: '12px', display: 'block' }}>{car.price}</Text>
                        <Text style={{ color: '#64748b', fontSize: '9px' }}>/ngày</Text>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

            {/* Feature Highlights Bar */}
            <div style={{
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center'
            }}>
              <div style={{ textAlign: 'center' }}>
                <ThunderboltOutlined style={{ color: '#38bdf8', fontSize: '18px', display: 'block', marginBottom: '2px' }} />
                <Text style={{ color: '#e2e8f0', fontSize: '11px', fontWeight: 600, display: 'block' }}>Duyệt Xe 3 Phút</Text>
              </div>
              <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />
              <div style={{ textAlign: 'center' }}>
                <SafetyCertificateOutlined style={{ color: '#4ade80', fontSize: '18px', display: 'block', marginBottom: '2px' }} />
                <Text style={{ color: '#e2e8f0', fontSize: '11px', fontWeight: 600, display: 'block' }}>Bảo Hiểm 100%</Text>
              </div>
              <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />
              <div style={{ textAlign: 'center' }}>
                <EnvironmentOutlined style={{ color: '#f43f5e', fontSize: '18px', display: 'block', marginBottom: '2px' }} />
                <Text style={{ color: '#e2e8f0', fontSize: '11px', fontWeight: 600, display: 'block' }}>Giao Tận Nơi 24/7</Text>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
