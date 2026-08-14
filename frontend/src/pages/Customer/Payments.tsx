import React, { useEffect, useState } from 'react';
import { Card, Table, Typography, Button, Space, message } from 'antd';
import { CreditCardOutlined, DownloadOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { Booking } from '@/services/mockData';
import { StatusBadge } from '@/components/common/StatusBadge';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export const CustomerPayments: React.FC = () => {
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

  const columns = [
    {
      title: 'Mã đơn thuê',
      dataIndex: 'bookingCode',
      key: 'bookingCode',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Xe thuê',
      dataIndex: 'vehicleName',
      key: 'vehicleName',
    },
    {
      title: 'Thời gian',
      key: 'dates',
      render: (_, record: Booking) => (
        <span>{dayjs(record.startDate).format('DD/MM/YYYY')} - {dayjs(record.endDate).format('DD/MM/YYYY')}</span>
      )
    },
    {
      title: 'Phương thức',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Tổng số tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => <Text strong style={{ color: '#0053d0' }}>{formatPrice(amount)}</Text>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: any) => <StatusBadge status={status} />
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: () => (
        <Button 
          type="text" 
          icon={<DownloadOutlined />} 
          style={{ color: '#1677ff' }}
          onClick={() => message.success('Đang chuẩn bị tải xuống hóa đơn PDF...')}
        >
          Hóa đơn
        </Button>
      )
    }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Lịch sử thanh toán</Title>
        <Text type="secondary">Quản lý hóa đơn điện tử, lịch sử giao dịch và biên lai cọc của bạn.</Text>
      </div>

      <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Table 
          loading={loading}
          dataSource={bookings} 
          columns={columns} 
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};
