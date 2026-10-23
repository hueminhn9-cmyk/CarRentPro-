import React, { useState, useEffect } from 'react';
import { Card, Form, Input, InputNumber, Button, Tabs, Space, Typography, message, Spin } from 'antd';
import { SettingOutlined, SaveOutlined, LockOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { api } from '@/services/api';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const AdminSettings: React.FC = () => {
  const [generalForm] = Form.useForm();
  const [rentalForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchSettings = async () => {
    setFetching(true);
    try {
      const list: any[] = await api.settings.getAll();
      const map: Record<string, any> = {};
      (list || []).forEach((item: any) => {
        map[item.key] = item.value;
      });

      generalForm.setFieldsValue({
        companyName: map.companyName || map.company_name || 'AutoRent Việt Nam - Nền tảng Cho thuê xe Tự lái SaaS',
        hotline: map.hotline || '1900 6868',
        email: map.email || 'info@autorent.vn',
        address: map.address || 'Lô C15, Đường Nguyễn Văn Linh, Phường Nam Dương, Quận Hải Châu, Đà Nẵng'
      });

      rentalForm.setFieldsValue({
        insuranceFee: map.insuranceFee ? Number(map.insuranceFee) : (map.insurance_fee_daily ? Number(map.insurance_fee_daily) : 100000),
        serviceFee: map.serviceFee ? Number(map.serviceFee) : 100000,
        depositRate: map.depositRate ? Number(map.depositRate) : (map.deposit_minimum ? Number(map.deposit_minimum) : 15000000),
        cancelPenaltyRate: map.cancelPenaltyRate ? Number(map.cancelPenaltyRate) : (map.cancellation_penalty_rate ? Number(map.cancellation_penalty_rate) : 30)
      });
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Không thể nạp cài đặt hệ thống');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload: Record<string, any> = { ...values };
      if (values.companyName) payload.company_name = values.companyName;
      if (values.insuranceFee !== undefined) payload.insurance_fee_daily = values.insuranceFee;
      if (values.depositRate !== undefined) payload.deposit_minimum = values.depositRate;
      if (values.cancelPenaltyRate !== undefined) payload.cancellation_penalty_rate = values.cancelPenaltyRate;

      await api.settings.saveBulk(payload);
      message.success('Cập nhật cấu hình hệ thống thành công vào cơ sở dữ liệu!');
      await fetchSettings();
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Lưu cài đặt thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const renderGeneralSettings = () => (
    <Form
      form={generalForm}
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
        rules={[{ required: true, message: 'Nhập hotline!' }]}
      >
        <Input style={{ height: '40px', borderRadius: '6px' }} />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email liên hệ nghiệp vụ"
        rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}
      >
        <Input style={{ height: '40px', borderRadius: '6px' }} />
      </Form.Item>

      <Form.Item
        name="address"
        label="Địa chỉ trụ sở chính"
        rules={[{ required: true, message: 'Nhập địa chỉ!' }]}
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
      form={rentalForm}
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
        rules={[{ required: true, message: 'Nhập phí bảo hiểm!' }]}
      >
        <InputNumber min={0} style={{ width: '100%', height: '40px', lineHeight: '38px', borderRadius: '6px' }} />
      </Form.Item>

      <Form.Item
        name="serviceFee"
        label="Phí bàn giao xe & Rửa dọn mặc định (VND)"
        rules={[{ required: true, message: 'Nhập phí dịch vụ!' }]}
      >
        <InputNumber min={0} style={{ width: '100%', height: '40px', lineHeight: '38px', borderRadius: '6px' }} />
      </Form.Item>

      <Form.Item
        name="depositRate"
        label="Số tiền cọc giữ xe tối thiểu (VND)"
        rules={[{ required: true, message: 'Nhập số tiền cọc!' }]}
      >
        <InputNumber min={0} style={{ width: '100%', height: '40px', lineHeight: '38px', borderRadius: '6px' }} />
      </Form.Item>

      <Form.Item
        name="cancelPenaltyRate"
        label="Tỷ lệ phí phạt hủy đơn trong 24h (%)"
        rules={[{ required: true, message: 'Nhập tỷ lệ phạt hủy!' }]}
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
        {fetching ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}><Spin tip="Đang nạp cấu hình hệ thống..." /></div>
        ) : (
          <Tabs 
            defaultActiveKey="general"
            items={[
              { key: 'general', label: 'Thông tin chung', children: renderGeneralSettings() },
              { key: 'rental', label: 'Cấu hình chi phí & Chính sách', children: renderRentalSettings() }
            ]}
          />
        )}
      </Card>
    </div>
  );
};
