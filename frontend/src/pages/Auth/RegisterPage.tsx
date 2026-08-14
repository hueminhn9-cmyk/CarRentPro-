import React, { useState } from 'react';
import { Form, Input, Button, Typography, Space, message, Row, Col, Card } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, CarOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';

const { Title, Text, Paragraph } = Typography;

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
              Tạo tài khoản để trải nghiệm đặt xe tự lái hoặc được Admin duyệt cấp quyền Manager.
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
                  placeholder="Nguyễn Văn A" 
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
                  placeholder="nguyenvana@gmail.com" 
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
                  placeholder="0987654321" 
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
                  placeholder="••••••••" 
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

        {/* Right Side: Showcase */}
        <Col xs={0} md={12} style={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          padding: '48px',
          color: '#ffffff'
        }}>
          <div style={{ maxWidth: '440px' }}>
            <Title level={2} style={{ color: '#ffffff', fontWeight: 800, marginBottom: '16px' }}>
              Tham gia Hệ sinh thái AutoRent
            </Title>
            <Paragraph style={{ color: '#cbd5e1', fontSize: '15px', lineHeight: 1.6 }}>
              Khách hàng sau khi đăng ký có thể bắt đầu đặt xe ngay hoặc liên hệ Admin doanh nghiệp để được **Cấp quyền Manager** quản lý chi nhánh & hợp đồng.
            </Paragraph>
          </div>
        </Col>
      </Row>
    </div>
  );
};
