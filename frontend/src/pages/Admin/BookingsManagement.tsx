import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Typography, Space, Tag, message } from 'antd';
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { Booking } from '@/services/mockData';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export const BookingsManagement: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    setLoading(true);
    api.bookings.getAll().then(res => {
      setBookings(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await api.bookings.updateStatus(id, 'Đang thuê', 'Đã thanh toán');
      message.success('Đã phê duyệt đơn hàng & xác nhận thanh toán!');
      fetchBookings();
    } catch (e) {
      message.error('Thực hiện thất bại!');
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await api.bookings.updateStatus(id, 'Đã hủy', 'Hoàn tiền');
      message.success('Đã hủy đơn thuê và lên lịch hoàn tiền cọc!');
      fetchBookings();
    } catch (e) {
      message.error('Thực hiện thất bại!');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price);
  };

  const columns = [
    {
      title: 'Mã đơn thuê',
      dataIndex: 'bookingCode',
      key: 'bookingCode',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'customerPhone',
      key: 'customerPhone',
    },
    {
      title: 'Dòng xe',
      dataIndex: 'vehicleName',
      key: 'vehicleName',
    },
    {
      title: 'Giá trị đơn',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => <Text strong style={{ color: '#0053d0' }}>{formatPrice(amount)}</Text>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: any) => <StatusBadge status={status} />
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record: Booking) => (
        <Space size={12}>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => navigate(`/admin/bookings/${record.id}`)}
          >
            Chi tiết
          </Button>

          {record.status === 'Chờ xác nhận' && (
            <>
              <Button 
                type="text" 
                icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />} 
                onClick={() => handleApprove(record.id)}
              >
                Duyệt
              </Button>
              <Button 
                type="text" 
                danger 
                icon={<CloseCircleOutlined />} 
                onClick={() => handleCancel(record.id)}
              >
                Hủy
              </Button>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Quản lý hợp đồng & đơn thuê</Title>
        <Text type="secondary">Phê duyệt đơn đặt xe mới, theo dõi trạng thái thanh toán và bàn giao xe.</Text>
      </div>

      <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Table 
          loading={loading}
          dataSource={bookings} 
          columns={columns} 
          rowKey="id"
        />
      </Card>
    </div>
  );
};
