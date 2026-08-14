import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Result, Button, Descriptions, Space, Typography, Alert, Divider } from 'antd';
import { CheckCircleFilled, FileTextOutlined, HomeOutlined, CarOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { Booking } from '@/services/mockData';

const { Title, Text } = Typography;

export const BookingReceipt: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (id) {
      api.bookings.getById(id).then(res => res && setBooking(res));
    }
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (!booking) return <div style={{ textAlign: 'center', padding: '100px 0' }}>Đang tải...</div>;

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
        <Result
          status="success"
          title="Đặt xe thành công!"
          subTitle={`Mã giao dịch: ${booking.bookingCode}`}
          extra={[
            <Button type="primary" key="dashboard" onClick={() => navigate('/customer/dashboard')} style={{ borderRadius: '6px' }}>
              Về Trang chủ Dashboard
            </Button>,
            <Button key="rentals" onClick={() => navigate('/customer/rentals')} style={{ borderRadius: '6px' }}>
              Lịch sử đơn hàng
            </Button>
          ]}
        />

        <Alert
          message="Hợp đồng điện tử chờ ký"
          description="Vui lòng kiểm tra email hoặc nhấn nút ký hợp đồng điện tử để xác nhận các điều khoản dịch vụ cho chuyến đi của bạn."
          type="info"
          showIcon
          style={{ marginBottom: '24px', borderRadius: '6px' }}
          action={
            <Button size="small" type="primary" icon={<FileTextOutlined />} onClick={() => navigate(`/customer/rentals/${booking.id}`)}>
              Ký hợp đồng
            </Button>
          }
        />

        <Divider style={{ margin: '24px 0' }} />

        <Title level={5} style={{ marginBottom: '16px' }}>Thông tin đơn đặt xe</Title>
        <Descriptions column={1} bordered size="small" labelStyle={{ width: '200px', fontWeight: 500 }}>
          <Descriptions.Item label="Khách hàng">{booking.customerName}</Descriptions.Item>
          <Descriptions.Item label="Dòng xe thuê">{booking.vehicleName}</Descriptions.Item>
          <Descriptions.Item label="Thời gian thuê">{booking.startDate} đến {booking.endDate} ({booking.totalDays} ngày)</Descriptions.Item>
          <Descriptions.Item label="Địa điểm nhận">{booking.pickupLocation}</Descriptions.Item>
          <Descriptions.Item label="Địa điểm trả">{booking.dropoffLocation}</Descriptions.Item>
          <Descriptions.Item label="Hình thức thanh toán">{booking.paymentMethod}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái thanh toán">{booking.paymentStatus}</Descriptions.Item>
          <Descriptions.Item label="Tổng chi phí"><Text strong style={{ color: '#0053d0', fontSize: '16px' }}>{formatPrice(booking.totalAmount)}</Text></Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f6f3f2', borderRadius: '6px', fontSize: '13px', color: '#414755' }}>
          <strong>Hướng dẫn nhận xe:</strong><br />
          1. Khi đến nhận xe, quý khách vui lòng mang theo GPLX (bản gốc) đã tải lên hệ thống.<br />
          2. Nhân viên showroom sẽ bàn giao xe, kiểm tra tình trạng thân vỏ và chụp ảnh biên bản bàn giao.<br />
          3. Chúc quý khách thượng lộ bình an cùng AutoRent!
        </div>
      </Card>
    </div>
  );
};
