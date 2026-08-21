import React, { useEffect, useState } from 'react';
import { Card, Table, Typography, Button, Space, Tag, Row, Col, Input, Tooltip, message } from 'antd';
import {
  CreditCardOutlined,
  DownloadOutlined,
  BankOutlined,
  WalletOutlined,
  SearchOutlined,
  DollarOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  CalendarOutlined,
  CarOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';
import { Booking } from '@/services/mockData';
import { StatusBadge } from '@/components/common/StatusBadge';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export const CustomerPayments: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

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

  const getMethodTag = (method: string) => {
    if (method === 'Thẻ tín dụng') {
      return <Tag icon={<CreditCardOutlined />} color="purple" style={{ borderRadius: '6px', padding: '2px 8px', margin: 0 }}>{method}</Tag>;
    }
    if (method === 'Chuyển khoản') {
      return <Tag icon={<BankOutlined />} color="blue" style={{ borderRadius: '6px', padding: '2px 8px', margin: 0 }}>{method}</Tag>;
    }
    return <Tag icon={<WalletOutlined />} color="cyan" style={{ borderRadius: '6px', padding: '2px 8px', margin: 0 }}>{method || 'Chuyển khoản'}</Tag>;
  };

  const totalSpent = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const completedCount = bookings.filter(b => b.paymentStatus === 'Đã thanh toán' || b.status === 'Hoàn thành').length;

  const filteredBookings = bookings.filter(b => {
    if (!searchText) return true;
    const q = searchText.toLowerCase();
    return (
      (b.bookingCode || '').toLowerCase().includes(q) ||
      (b.vehicleName || '').toLowerCase().includes(q) ||
      (b.paymentMethod || '').toLowerCase().includes(q)
    );
  });

  const columns = [
    {
      title: <span style={{ fontWeight: 700, color: '#334155' }}>Mã đơn thuê</span>,
      dataIndex: 'bookingCode',
      key: 'bookingCode',
      width: '15%',
      align: 'center' as const,
      render: (text: string) => (
        <Tag color="geekblue" style={{ fontWeight: 700, borderRadius: '6px', padding: '3px 8px', fontSize: '12px', margin: 0 }}>
          #{text}
        </Tag>
      )
    },
    {
      title: <span style={{ fontWeight: 700, color: '#334155' }}>Xe thuê</span>,
      dataIndex: 'vehicleName',
      key: 'vehicleName',
      width: '24%',
      onHeaderCell: () => ({ style: { textAlign: 'center' } }),
      onCell: () => ({ style: { textAlign: 'left' } }),
      render: (text: string) => (
        <Space size={8} align="center">
          <CarOutlined style={{ color: '#2563eb', fontSize: '14px', flexShrink: 0 }} />
          <Text strong style={{ color: '#0f172a', fontSize: '13px', whiteSpace: 'nowrap' }}>{text}</Text>
        </Space>
      )
    },
    {
      title: <span style={{ fontWeight: 700, color: '#334155' }}>Thời gian</span>,
      key: 'dates',
      width: '20%',
      align: 'center' as const,
      render: (_, record: Booking) => (
        <Text type="secondary" style={{ fontSize: '12px', whiteSpace: 'nowrap', fontWeight: 500 }}>
          <CalendarOutlined style={{ marginRight: '5px', color: '#64748b' }} />
          {dayjs(record.startDate).format('DD/MM/YYYY')} - {dayjs(record.endDate).format('DD/MM/YYYY')}
        </Text>
      )
    },
    {
      title: <span style={{ fontWeight: 700, color: '#334155' }}>Phương thức</span>,
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: '15%',
      align: 'center' as const,
      render: (text: string) => getMethodTag(text)
    },
    {
      title: <span style={{ fontWeight: 700, color: '#334155' }}>Tổng số tiền</span>,
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: '15%',
      align: 'center' as const,
      render: (amount: number) => (
        <Text strong style={{ color: '#1e40af', fontSize: '13px', whiteSpace: 'nowrap' }}>
          {formatPrice(amount)}
        </Text>
      )
    },
    {
      title: <span style={{ fontWeight: 700, color: '#334155' }}>Trạng thái</span>,
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: '14%',
      align: 'center' as const,
      render: (status: any) => <StatusBadge status={status} />
    },
    {
      title: <span style={{ fontWeight: 700, color: '#334155' }}>Thao tác</span>,
      key: 'actions',
      width: '12%',
      align: 'center' as const,
      render: () => (
        <Tooltip title="Tải xuống hóa đơn PDF">
          <Button 
            type="primary"
            ghost
            size="small"
            icon={<DownloadOutlined />} 
            style={{ borderRadius: '6px', fontWeight: 600, fontSize: '12px' }}
            onClick={() => message.success('Đang chuẩn bị tải xuống hóa đơn PDF...')}
          >
            Hóa đơn
          </Button>
        </Tooltip>
      )
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>Lịch sử thanh toán</Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>Quản lý hóa đơn điện tử, lịch sử giao dịch và biên lai cọc của bạn.</Text>
        </div>
        <Input 
          placeholder="Tìm theo mã đơn, tên xe, phương thức..." 
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          allowClear
          style={{ width: '280px', borderRadius: '8px' }}
        />
      </div>

      {/* Summary KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card 
            style={{ borderRadius: '12px', border: '1px solid #e2e8f0', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }} 
            styles={{ body: { padding: '16px 20px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarOutlined style={{ fontSize: '20px', color: '#2563eb' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', fontWeight: 500 }}>Tổng tiền đã giao dịch</Text>
                <Title level={4} style={{ margin: 0, fontWeight: 800, color: '#1e3a8a' }}>{formatPrice(totalSpent)}</Title>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card 
            style={{ borderRadius: '12px', border: '1px solid #e2e8f0', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }} 
            styles={{ body: { padding: '16px 20px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileTextOutlined style={{ fontSize: '20px', color: '#16a34a' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', fontWeight: 500 }}>Hóa đơn / Giao dịch</Text>
                <Title level={4} style={{ margin: 0, fontWeight: 800, color: '#166534' }}>{completedCount} / {bookings.length} Thành công</Title>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card 
            style={{ borderRadius: '12px', border: '1px solid #e2e8f0', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }} 
            styles={{ body: { padding: '16px 20px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SafetyCertificateOutlined style={{ fontSize: '20px', color: '#9333ea' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', fontWeight: 500 }}>Bảo mật & Cọc an toàn</Text>
                <Title level={4} style={{ margin: 0, fontWeight: 800, color: '#6b21a8' }}>100% Đã xác thực</Title>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card 
        style={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)' }} 
        styles={{ body: { padding: 0 } }}
      >
        <Table 
          loading={loading}
          dataSource={filteredBookings} 
          columns={columns} 
          rowKey="id"
          tableLayout="fixed"
          pagination={{ pageSize: 5, showTotal: (total) => `Tổng cộng ${total} giao dịch` }}
        />
      </Card>
    </div>
  );
};

