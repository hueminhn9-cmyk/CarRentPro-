import React, { useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Tabs, Space, Typography, message } from 'antd';
import { SettingOutlined, SaveOutlined, LockOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const AdminSettings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      message.success('Cập nhật cấu hình hệ thống thành công!');
    } catch (e) {
      message.error('Lưu cài đặt thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const renderGeneralSettings = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
      initialValues={{
        companyName: 'Công ty Cổ phần AutoRent Việt Nam',
        hotline: '1900 6868',
        email: 'info@autorent.vn',
        address: 'Lô C15, Đường Nguyễn Văn Linh, Phường Nam Dương, Quận Hải Châu, Đà Nẵng'
      }}
    >
      <Form.Item
        name="companyName"
        label="Tên doanh nghiệp / Nền tảng"
        rules={[{ required: true, message: 'Nhập tên doanh nghiệp!' }]}
      >
        <Input style={{ height: '40px', borderRadius: '6px' }} />
      </Form.Item>

      <Form.Item
        name="hotline"
        label="Hotline chăm sóc khách hàng"
        rules={[{ required: true }]}
      >
        <Input style={{ height: '40px', borderRadius: '6px' }} />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email liên hệ nghiệp vụ"
        rules={[{ required: true, type: 'email' }]}
      >
        <Input style={{ height: '40px', borderRadius: '6px' }} />
      </Form.Item>

      <Form.Item
        name="address"
        label="Địa chỉ trụ sở chính"
        rules={[{ required: true }]}
      >
        <TextArea rows={3} style={{ borderRadius: '6px' }} />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Button 
          type="primary" 
          htmlType="submit" 
          icon={<SaveOutlined />} 
          loading={loading}
          style={{ height: '40px', borderRadius: '6px', fontWeight: 600 }}
        >
          Lưu cấu hình
        </Button>
      </Form.Item>
    </Form>
  );

  const renderRentalSettings = () => (
    <Form
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
      initialValues={{
        insuranceFee: 100000,
        serviceFee: 100000,
        depositRate: 15000000,
        cancelPenaltyRate: 30
      }}
    >
      <Form.Item
        name="insuranceFee"
        label="Phí bảo hiểm vật chất mặc định (/ngày) (VND)"
        rules={[{ required: true }]}
      >
        <InputNumber min={0} style={{ width: '100%', height: '40px', lineHeight: '38px', borderRadius: '6px' }} />
      </Form.Item>

      <Form.Item
        name="serviceFee"
        label="Phí bàn giao xe & Rửa dọn mặc định (VND)"
        rules={[{ required: true }]}
      >
        <InputNumber min={0} style={{ width: '100%', height: '40px', lineHeight: '38px', borderRadius: '6px' }} />
      </Form.Item>

      <Form.Item
        name="depositRate"
        label="Số tiền cọc giữ xe tối thiểu (VND)"
        rules={[{ required: true }]}
      >
        <InputNumber min={0} style={{ width: '100%', height: '40px', lineHeight: '38px', borderRadius: '6px' }} />
      </Form.Item>

      <Form.Item
        name="cancelPenaltyRate"
        label="Tỷ lệ phí phạt hủy đơn trong 24h (%)"
        rules={[{ required: true }]}
      >
        <InputNumber min={0} max={100} style={{ width: '100%', height: '40px', lineHeight: '38px', borderRadius: '6px' }} />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Button 
          type="primary" 
          htmlType="submit" 
          icon={<SaveOutlined />} 
          loading={loading}
          style={{ height: '40px', borderRadius: '6px', fontWeight: 600 }}
        >
          Lưu chính sách
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Cài đặt hệ thống</Title>
        <Text type="secondary">Cấu hình các tham số kinh doanh, chính sách thuê xe và thông tin doanh nghiệp.</Text>
      </div>

      <Card variant="borderless" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Tabs 
          defaultActiveKey="general"
          items={[
            { key: 'general', label: 'Thông tin chung', children: renderGeneralSettings() },
            { key: 'rental', label: 'Cấu hình chi phí & Chính sách', children: renderRentalSettings() }
          ]}
        />
      </Card>
    </div>
  );
};
