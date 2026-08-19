import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Input, InputNumber, Select, Button, Space, Typography, Row, Col, message } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { api } from '@/services/api';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const VehicleForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode && id) {
      api.vehicles.getById(id).then(res => {
        if (res) {
          form.setFieldsValue({
            ...res,
            featuresString: res.features.join(', ')
          });
        } else {
          message.error('Không tìm thấy xe yêu cầu!');
          navigate('/admin/vehicles');
        }
      });
    }
  }, [id, form, isEditMode, navigate]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const features = values.featuresString 
        ? values.featuresString.split(',').map((f: string) => f.trim()) 
        : [];
      
      const vehiclePayload = {
        name: values.name,
        type: values.type,
        licensePlate: values.licensePlate,
        pricePerDay: values.pricePerDay,
        status: values.status || 'Có sẵn',
        image: values.image || 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=600&auto=format&fit=crop&q=60',
        transmission: values.transmission,
        fuel: values.fuel,
        seats: values.seats,
        location: values.location,
        color: values.color || 'Trắng',
        year: values.year || 2023,
        fuelConsumption: values.fuelConsumption || '7.0 l/100km',
        description: values.description || '',
        features,
        insurance: values.insurance || 'Bảo hiểm vật chất 2 chiều tiêu chuẩn'
      };

      if (isEditMode && id) {
        await api.vehicles.update(id, vehiclePayload);
        message.success('Cập nhật thông tin xe thành công!');
      } else {
        await api.vehicles.create(vehiclePayload);
        message.success('Thêm xe mới thành công!');
      }
      navigate('/admin/vehicles');
    } catch (e) {
      message.error('Lưu thông tin thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/admin/vehicles')}
          style={{ padding: 0, marginBottom: '8px' }}
        >
          Quay lại danh sách xe
        </Button>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
          {isEditMode ? 'Chỉnh sửa thông tin xe' : 'Thêm phương tiện mới'}
        </Title>
        <Text type="secondary">Cung cấp các thông số kỹ thuật và hình ảnh mô tả cho xe.</Text>
      </div>

      <Card variant="borderless" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          initialValues={{
            status: 'Có sẵn',
            transmission: 'Tự động',
            fuel: 'Xăng',
            seats: 5,
            location: 'Hà Nội'
          }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label="Tên xe"
                rules={[{ required: true, message: 'Nhập tên phương tiện!' }]}
              >
                <Input placeholder="Ví dụ: VinFast VF 8 Plus" style={{ height: '40px', borderRadius: '6px' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="licensePlate"
                label="Biển kiểm soát"
                rules={[{ required: true, message: 'Nhập biển số xe!' }]}
              >
                <Input placeholder="Ví dụ: 30K-123.45" style={{ height: '40px', borderRadius: '6px' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="type"
                label="Phân loại dòng xe"
                rules={[{ required: true }]}
              >
                <Select style={{ height: '40px' }} options={[
                  { value: 'Sedan', label: 'Sedan' },
                  { value: 'SUV', label: 'SUV' },
                  { value: 'Bán tải', label: 'Bán tải' },
                  { value: 'Hatchback', label: 'Hatchback' },
                  { value: 'Xe điện', label: 'Xe điện' }
                ]} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="transmission"
                label="Hộp số"
                rules={[{ required: true }]}
              >
                <Select style={{ height: '40px' }} options={[
                  { value: 'Tự động', label: 'Tự động' },
                  { value: 'Số sàn', label: 'Số sàn' }
                ]} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="fuel"
                label="Nhiên liệu"
                rules={[{ required: true }]}
              >
                <Select style={{ height: '40px' }} options={[
                  { value: 'Xăng', label: 'Xăng' },
                  { value: 'Dầu', label: 'Dầu' },
                  { value: 'Điện', label: 'Điện' }
                ]} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="seats"
                label="Số chỗ ngồi"
                rules={[{ required: true }]}
              >
                <InputNumber min={2} max={16} style={{ width: '100%', height: '40px', lineHeight: '38px', borderRadius: '6px' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="pricePerDay"
                label="Giá thuê / ngày (VND)"
                rules={[{ required: true, message: 'Nhập đơn giá thuê!' }]}
              >
                <InputNumber min={100000} style={{ width: '100%', height: '40px', lineHeight: '38px', borderRadius: '6px' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="location"
                label="Địa điểm đỗ xe (Khu vực)"
                rules={[{ required: true }]}
              >
                <Select style={{ height: '40px' }} options={[
                  { value: 'Hà Nội', label: 'Hà Nội' },
                  { value: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
                  { value: 'Đà Nẵng', label: 'Đà Nẵng' }
                ]} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="image"
                label="Liên kết ảnh xe (Image URL)"
              >
                <Input placeholder="https://..." style={{ height: '40px', borderRadius: '6px' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="status"
                label="Trạng thái hiện tại"
              >
                <Select style={{ height: '40px' }} options={[
                  { value: 'Có sẵn', label: 'Có sẵn' },
                  { value: 'Đang thuê', label: 'Đang thuê' },
                  { value: 'Bảo dưỡng', label: 'Bảo dưỡng' }
                ]} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="featuresString"
            label="Tính năng nổi bật (Cách nhau bằng dấu phẩy)"
          >
            <Input placeholder="Ví dụ: Bản đồ GPS, Camera 360, Cửa sổ trời, Ghế da..." style={{ height: '40px', borderRadius: '6px' }} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả chi tiết về xe"
          >
            <TextArea rows={4} placeholder="Nhập giới thiệu chi tiết về ngoại thất, nội thất và các tiện ích khác của xe..." style={{ borderRadius: '6px' }} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SaveOutlined />} 
              loading={loading}
              style={{ height: '40px', borderRadius: '6px', fontWeight: 600, padding: '0 24px' }}
            >
              Lưu thông tin phương tiện
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
