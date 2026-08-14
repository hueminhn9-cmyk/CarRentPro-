import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, Row, Col, Typography, Space, message, Avatar } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { Customer } from '@/services/mockData';

const { Title, Text } = Typography;

export const CustomerProfile: React.FC = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = api.auth.getCurrentUser();
    if (user) {
      api.customers.getById(user.id).then(res => {
        if (res) {
          setCustomer(res);
          form.setFieldsValue(res);
        }
      });
    }
  }, [form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await api.customers.updateProfile(values);
      message.success('Cập nhật thông tin hồ sơ thành công!');
      const user = api.auth.getCurrentUser();
      if (user) {
        if (values.name) {
          user.name = values.name;
          localStorage.setItem('autorent_user', JSON.stringify(user));
        }
        const res = await api.customers.getById(user.id);
        if (res) {
          setCustomer(res);
          form.setFieldsValue(res);
        }
      }
    } catch (e: any) {
      message.error(e.message || 'Có lỗi xảy ra khi cập nhật hồ sơ!');
    } finally {
      setLoading(false);
    }
  };

  if (!customer) return <div style={{ textAlign: 'center', padding: '100px 0' }}>Đang tải...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Hồ sơ cá nhân</Title>
        <Text type="secondary">Cập nhật thông tin liên hệ và chi tiết tài khoản của bạn.</Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Side: Avatar Panel */}
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center' }}>
            <Avatar size={96} style={{ backgroundColor: '#1677ff', marginBottom: '16px' }} icon={<UserOutlined />} />
            <Title level={4} style={{ margin: '0 0 4px 0' }}>{customer.name}</Title>
            <Text type="secondary" style={{ display: 'block', fontSize: '13px', marginBottom: '16px' }}>
              Thành viên hạng: <strong>{customer.tier}</strong>
            </Text>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', backgroundColor: '#e6f7ff', borderRadius: '20px', color: '#1677ff', fontSize: '12px', fontWeight: 500 }}>
              <SafetyCertificateOutlined /> GPLX: {customer.licenseStatus}
            </div>
          </Card>
        </Col>

        {/* Right Side: Details Form */}
        <Col xs={24} md={16}>
          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="name"
                    label="Họ và tên"
                    rules={[{ required: true, message: 'Nhập họ tên của bạn!' }]}
                  >
                    <Input prefix={<UserOutlined style={{ color: '#727786' }} />} style={{ height: '40px', borderRadius: '6px' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="email"
                    label="Địa chỉ Email"
                    rules={[
                      { required: true, message: 'Nhập email!' },
                      { type: 'email', message: 'Email không đúng định dạng!' }
                    ]}
                  >
                    <Input disabled prefix={<MailOutlined style={{ color: '#727786' }} />} style={{ height: '40px', borderRadius: '6px' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: 'Nhập số điện thoại!' }]}
                  >
                    <Input prefix={<PhoneOutlined style={{ color: '#727786' }} />} style={{ height: '40px', borderRadius: '6px' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="idCard"
                    label="Số CMND / CCCD"
                    rules={[{ required: true, message: 'Nhập số căn cước công dân!' }]}
                  >
                    <Input style={{ height: '40px', borderRadius: '6px' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="address"
                label="Địa chỉ cư trú"
                rules={[{ required: true, message: 'Nhập địa chỉ của bạn!' }]}
              >
                <Input prefix={<HomeOutlined style={{ color: '#727786' }} />} style={{ height: '40px', borderRadius: '6px' }} />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  style={{ height: '40px', borderRadius: '6px', fontWeight: 600, padding: '0 24px' }}
                >
                  Lưu thay đổi
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
