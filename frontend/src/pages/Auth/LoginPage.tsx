import React, { useState } from 'react';
import { Form, Input, Button, Typography, Space, message, Row, Col, Tag } from 'antd';
import { UserOutlined, LockOutlined, CarOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '@/services/api';

const { Title, Text, Paragraph } = Typography;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const user = await api.auth.login(values.email, values.password);
      message.success(`Đăng nhập thành công! Chào mừng ${user.name}`);
      
      if (redirectUrl) {
        navigate(redirectUrl);
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'manager') {
        navigate('/manager/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err: any) {
      message.error(err?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email & mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f8fafc' }}>
      <Row style={{ width: '100%' }}>
        {/* Left Side: Standard Clean Login Form */}
        <Col xs={24} md={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '32px 24px' }}>
          <div style={{ width: '100%', maxWidth: '420px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px', cursor: 'pointer' }} onClick={() => navigate('/')}>
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '10px', 
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}>
                <CarOutlined style={{ fontSize: '24px', color: '#ffffff' }} />
              </div>
              <div>
                <Title level={3} style={{ margin: 0, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>AutoRent</Title>
                <Text type="secondary" style={{ fontSize: '12px' }}>Hệ thống Thuê Xe Doanh Nghiệp</Text>
              </div>
            </div>
            
            <Title level={2} style={{ marginBottom: '8px', fontWeight: 800, color: '#0f172a' }}>Đăng nhập</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: '28px', fontSize: '14px' }}>
              Nhập email & mật khẩu tài khoản của bạn để truy cập hệ thống.
            </Text>

            <Form
              form={form}
              name="login_form"
              onFinish={onFinish}
              layout="vertical"
              requiredMark={false}
            >
              <Form.Item
                name="email"
                label="Địa chỉ Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không đúng định dạng!' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined style={{ color: '#64748b' }} />} 
                  placeholder="name@company.com" 
                  style={{ height: '42px', borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              >
                <Input.Password 
                  prefix={<LockOutlined style={{ color: '#64748b' }} />} 
                  placeholder="••••••••" 
                  style={{ height: '42px', borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item style={{ marginTop: '8px' }}>
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
                    borderColor: '#2563eb',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
                  }}
                >
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
            
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <Text type="secondary" style={{ fontSize: '13px' }}>Chưa có tài khoản? </Text>
              <Button 
                type="link" 
                style={{ padding: 0, fontSize: '13px', fontWeight: 600, color: '#2563eb' }} 
                onClick={() => navigate('/auth/register')}
              >
                Đăng ký tài khoản ngay
              </Button>
            </div>
          </div>
        </Col>

        {/* Right Side: Visual Showcase Banner */}
        <Col xs={0} md={12} style={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)', 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          padding: '48px',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ maxWidth: '480px', zIndex: 2 }}>
            <Title level={1} style={{ color: '#ffffff', margin: 0, fontSize: '34px', fontWeight: 800, marginBottom: '16px', lineHeight: 1.25 }}>
              Hệ Thống Thuê Xe Doanh Nghiệp AutoRent
            </Title>
            <Paragraph style={{ color: '#cbd5e1', fontSize: '15px', marginBottom: '32px', lineHeight: 1.6 }}>
              Vận hành hiện đại, an toàn và tối ưu cho doanh nghiệp và khách hàng cá nhân trên toàn quốc.
            </Paragraph>

            <div style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.07)', 
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#fbbf24' }}>★ Đội xe Đạt Chuẩn 5 Sao</span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>VinFast, Toyota, Honda, Ford</span>
              </div>
              <img 
                alt="VinFast & Luxury Cars Fleet" 
                src="https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=60" 
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px' }}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

