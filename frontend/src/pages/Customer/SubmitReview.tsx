import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Rate, Input, Button, Typography, Space, message } from 'antd';
import { StarOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { Booking } from '@/services/mockData';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const SubmitReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      api.bookings.getById(id).then(res => {
        if (res) {
          setBooking(res);
        } else {
          message.error('Không tìm thấy đơn hàng!');
          navigate('/customer/rentals');
        }
      });
    }
  }, [id, navigate]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      // Simulate submission
      await new Promise(resolve => setTimeout(resolve, 800));
      message.success('Cảm ơn bạn đã gửi đánh giá cho chiếc xe này!');
      navigate(`/customer/rentals/${id}`);
    } catch (e) {
      message.error('Gửi đánh giá thất bại!');
    } finally {
      setSubmitting(false);
    }
  };

  if (!booking) return <div style={{ textAlign: 'center', padding: '100px 0' }}>Đang tải...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(`/customer/rentals/${id}`)}
          style={{ padding: 0, marginBottom: '8px' }}
        >
          Quay lại đơn thuê
        </Button>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Đánh giá dịch vụ</Title>
        <Text type="secondary">Chia sẻ trải nghiệm thuê xe tự lái cùng chiếc {booking.vehicleName}.</Text>
      </div>

      <Card variant="borderless" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ rating: 5 }}
          requiredMark={false}
        >
          <Form.Item
            name="rating"
            label="Đánh giá tổng quan chiếc xe"
            rules={[{ required: true }]}
          >
            <Rate style={{ fontSize: '28px' }} />
          </Form.Item>

          <Form.Item
            name="comment"
            label="Chia sẻ thêm cảm nhận của bạn"
            rules={[{ required: true, message: 'Nhập nội dung đánh giá!' }]}
          >
            <TextArea 
              rows={5} 
              placeholder="Xe hoạt động tốt không? Nội thất sạch sẽ không? Thái độ nhân viên showroom thế nào?..." 
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block 
              loading={submitting}
              style={{ height: '44px', borderRadius: '6px', fontWeight: 600 }}
            >
              Gửi đánh giá
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
