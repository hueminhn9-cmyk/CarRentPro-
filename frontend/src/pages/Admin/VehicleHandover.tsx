import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Checkbox, Button, Typography, Space, Row, Col, Divider, message } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined, CarOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { Booking } from '@/services/mockData';

const { Title, Text } = Typography;

export const VehicleHandover: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [checklist, setChecklist] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      api.bookings.getById(id).then(res => {
        if (res) {
          setBooking(res);
        } else {
          message.error('Không tìm thấy đơn hàng!');
          navigate('/admin/bookings');
        }
      });
    }
  }, [id, navigate]);

  const items = [
    { key: '1', label: 'Đối chiếu CCCD và GPLX bản gốc của khách hàng (Trùng khớp 100%)' },
    { key: '2', label: 'Kiểm tra ngoại thất: Thân vỏ, gương, kính lái không trầy xước nặng' },
    { key: '3', label: 'Kiểm tra nội thất: Ghế da sạch sẽ, bảng điều khiển hoạt động bình thường' },
    { key: '4', label: 'Mức pin / Nhiên liệu đạt tiêu chuẩn bàn giao (>80%)' },
    { key: '5', label: 'Kiểm tra lốp xe, lốp dự phòng, kích lốp và hộp dụng cụ sửa chữa đi kèm' },
    { key: '6', label: 'Bàn giao chìa khóa xe, giấy tờ xe gốc (Đăng ký xe bản sao công chứng, bảo hiểm, đăng kiểm)' },
    { key: '7', label: 'Khách hàng ký tên xác nhận vào Biên bản bàn giao xe' }
  ];

  const handleCheckboxChange = (checkedValues: any) => {
    setChecklist(checkedValues);
  };

  const handleCompleteHandover = async () => {
    if (checklist.length < items.length) {
      message.warning('Vui lòng hoàn thành đầy đủ tất cả các bước trong danh mục kiểm tra!');
      return;
    }
    setSubmitting(true);
    try {
      if (booking) {
        await api.bookings.updateStatus(booking.id, 'Đang thuê');
        message.success('Đã bàn giao xe cho khách hàng thành công!');
        navigate(`/admin/bookings/${booking.id}`);
      }
    } catch (e) {
      message.error('Thao tác thất bại!');
    } finally {
      setSubmitting(false);
    }
  };

  if (!booking) return <div style={{ textAlign: 'center', padding: '100px 0' }}>Đang tải...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(`/admin/bookings/${booking.id}`)}
          style={{ padding: 0, marginBottom: '8px' }}
        >
          Quay lại chi tiết đơn thuê
        </Button>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Biên bản bàn giao xe tự lái</Title>
        <Text type="secondary">Danh mục kiểm tra kỹ thuật phương tiện trước khi giao cho khách hàng.</Text>
      </div>

      <Card variant="borderless" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={16}>
            <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '8px' }}>{booking.vehicleName}</div>
            <Text type="secondary">Biển kiểm soát: {booking.vehicleId} • Mã đơn: {booking.bookingCode}</Text>
          </Col>
          <Col xs={24} sm={8} style={{ textAlign: 'right' }}>
            <Text type="secondary">Khách nhận xe:</Text>
            <div style={{ fontWeight: 600 }}>{booking.customerName}</div>
          </Col>
        </Row>

        <Divider style={{ margin: '16px 0' }} />

        <div style={{ marginBottom: '20px', fontWeight: 600 }}>Danh mục kiểm tra (Bắt buộc):</div>
        
        <Checkbox.Group style={{ width: '100%' }} onChange={handleCheckboxChange} value={checklist}>
          <Space direction="vertical" style={{ width: '100%' }} size={16}>
            {items.map(item => (
              <Checkbox key={item.key} value={item.key} style={{ fontSize: '14px', alignItems: 'flex-start' }}>
                <span style={{ marginLeft: '4px', display: 'inline-block', marginTop: '-2px' }}>{item.label}</span>
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>

        <Divider style={{ margin: '24px 0' }} />

        <Button 
          type="primary" 
          icon={<CheckCircleOutlined />} 
          disabled={checklist.length < items.length}
          onClick={handleCompleteHandover}
          loading={submitting}
          size="large"
          block
          style={{ height: '48px', borderRadius: '8px', fontWeight: 600 }}
        >
          Xác nhận hoàn thành bàn giao xe
        </Button>
      </Card>
    </div>
  );
};
