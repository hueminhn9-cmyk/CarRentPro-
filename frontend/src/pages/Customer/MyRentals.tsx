import React, { useEffect, useState } from 'react';
import { Card, Tabs, List, Button, Typography, Space, Empty } from 'antd';
import { CarOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { Booking } from '@/services/mockData';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export const MyRentals: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = api.auth.getCurrentUser();
    if (user) {
      api.bookings.getByCustomer(user.id).then(res => {
        setBookings(res);
        setLoading(false);
      });
    }
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getFilteredBookings = (statusTab: string) => {
    if (statusTab === 'all') return bookings;
    if (statusTab === 'active') return bookings.filter(b => b.status === 'Đang thuê' || b.status === 'Chờ xác nhận');
    if (statusTab === 'completed') return bookings.filter(b => b.status === 'Hoàn thành');
    if (statusTab === 'cancelled') return bookings.filter(b => b.status === 'Đã hủy');
    return bookings;
  };

  const renderBookingList = (statusTab: string) => {
    const listData = getFilteredBookings(statusTab);

    return (
      <List
        loading={loading}
        dataSource={listData}
        renderItem={(booking) => (
          <Card 
            style={{ marginBottom: '16px', borderRadius: '8px', border: '1px solid #f0eded' }}
            bodyStyle={{ padding: '16px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <img 
                  src={booking.vehicleImage} 
                  alt={booking.vehicleName} 
                  style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '6px' }}
                />
                <div>
                  <Title level={5} style={{ margin: '0 0 4px 0', fontSize: '15px' }}>{booking.vehicleName}</Title>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>Mã đơn: {booking.bookingCode}</Text>
                  <div style={{ fontSize: '13px', color: '#414755' }}>
                    Thời gian: {dayjs(booking.startDate).format('DD/MM/YYYY')} - {dayjs(booking.endDate).format('DD/MM/YYYY')} ({booking.totalDays} ngày)
                  </div>
                  <div style={{ fontSize: '13px', color: '#414755', marginTop: '4px' }}>
                    Tổng chi phí: <Text strong style={{ color: '#0053d0' }}>{formatPrice(booking.totalAmount)}</Text>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <StatusBadge status={booking.status} />
                <Button 
                  type="primary" 
                  onClick={() => navigate(`/customer/rentals/${booking.id}`)}
                  style={{ borderRadius: '6px', fontSize: '13px', marginTop: '12px' }}
                >
                  Chi tiết đơn thuê
                </Button>
              </div>
            </div>
          </Card>
        )}
        locale={{
          emptyText: (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#727786' }}>
              <CarOutlined style={{ fontSize: '48px', opacity: 0.3, marginBottom: '16px' }} />
              <div>Không tìm thấy đơn hàng nào.</div>
            </div>
          )
        }}
      />
    );
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Đơn thuê của tôi</Title>
        <Text type="secondary">Theo dõi tiến độ, xem hóa đơn và ký hợp đồng các xe tự lái của bạn.</Text>
      </div>

      <Tabs 
        defaultActiveKey="all"
        style={{ marginBottom: '24px' }}
        items={[
          { key: 'all', label: 'Tất cả', children: renderBookingList('all') },
          { key: 'active', label: 'Đang hoạt động / Chờ duyệt', children: renderBookingList('active') },
          { key: 'completed', label: 'Đã hoàn thành', children: renderBookingList('completed') },
          { key: 'cancelled', label: 'Đã hủy', children: renderBookingList('cancelled') }
        ]}
      />
    </div>
  );
};
