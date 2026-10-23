import React, { useEffect, useState } from 'react';
import { Card, Table, Typography, Button, Space, Tag, Row, Col, Input, Tooltip, Modal, message, Segmented, Spin, Divider } from 'antd';
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
  CarOutlined,
  QrcodeOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';
import { Booking } from '@/services/mockData';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

export const CustomerPayments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'transactions'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  // Payment QR Modal states
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const user = api.auth.getCurrentUser();
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const [bookingsRes, paymentsRes] = await Promise.allSettled([
        api.bookings.getByCustomer(user.id),
        api.payments.getAll({ limit: 100 })
      ]);

      if (bookingsRes.status === 'fulfilled') {
        setBookings(bookingsRes.value || []);
      }
      if (paymentsRes.status === 'fulfilled') {
        setPayments(paymentsRes.value || []);
      }
    } catch (err) {
      console.error('Failed to load payment history', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getMethodTag = (method: string) => {
    if (method === 'Thẻ tín dụng' || method === 'CREDIT_CARD') {
      return <Tag icon={<CreditCardOutlined />} color="purple" style={{ borderRadius: '6px', padding: '2px 8px', margin: 0 }}>Thẻ tín dụng</Tag>;
    }
    if (method === 'Chuyển khoản' || method === 'BANK_TRANSFER') {
      return <Tag icon={<BankOutlined />} color="blue" style={{ borderRadius: '6px', padding: '2px 8px', margin: 0 }}>Chuyển khoản</Tag>;
    }
    return <Tag icon={<WalletOutlined />} color="cyan" style={{ borderRadius: '6px', padding: '2px 8px', margin: 0 }}>{method || 'Chuyển khoản'}</Tag>;
  };

  const handleOpenQR = (record: any) => {
    setSelectedBooking(record);
    setQrModalVisible(true);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    message.success(`Đã sao chép ${label}!`);
  };

  const handleConfirmTransfer = async () => {
    if (!selectedBooking) return;
    setConfirmingPayment(true);
    try {
      await api.payments.create({
        booking_id: selectedBooking.id,
        transaction_type: 'RENTAL',
        amount: Number(selectedBooking.totalAmount || 0),
        payment_method: 'BANK_TRANSFER',
        payment_reference: `CK-${selectedBooking.bookingCode}`
      });

      message.success('Đã gửi thông tin xác nhận chuyển khoản tới bộ phận kế toán!');
      setQrModalVisible(false);
      loadData();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Lỗi gửi yêu cầu thanh toán';
      message.error(msg);
    } finally {
      setConfirmingPayment(false);
    }
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

  const filteredPayments = payments.filter((p: any) => {
    if (!searchText) return true;
    const q = searchText.toLowerCase();
    return (
      (p.transaction_code || '').toLowerCase().includes(q) ||
      (p.payment_reference || '').toLowerCase().includes(q) ||
      (p.payment_method || '').toLowerCase().includes(q)
    );
  });

  const bookingColumns = [
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
      render: (text: string) => (
        <Space size={8} align="center">
          <CarOutlined style={{ color: '#2563eb', fontSize: '14px', flexShrink: 0 }} />
          <Text strong style={{ color: '#0f172a', fontSize: '13px' }}>{text}</Text>
        </Space>
      )
    },
    {
      title: <span style={{ fontWeight: 700, color: '#334155' }}>Thời gian</span>,
      key: 'dates',
      width: '18%',
      align: 'center' as const,
      render: (_: any, record: Booking) => (
        <Text type="secondary" style={{ fontSize: '12px', whiteSpace: 'nowrap', fontWeight: 500 }}>
          <CalendarOutlined style={{ marginRight: '5px', color: '#64748b' }} />
          {dayjs(record.startDate).format('DD/MM/YYYY')} - {dayjs(record.endDate).format('DD/MM/YYYY')}
        </Text>
      )
    },
    {
      title: <span style={{ fontWeight: 700, color: '#334155' }}>Tổng chi phí</span>,
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
      title: <span style={{ fontWeight: 700, color: '#334155' }}>Trạng thái thanh toán</span>,
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: '16%',
      align: 'center' as const,
      render: (status: any) => <StatusBadge status={status} />
    },
    {
      title: <span style={{ fontWeight: 700, color: '#334155' }}>Hành động</span>,
      key: 'actions',
      width: '16%',
      align: 'center' as const,
      render: (_: any, record: Booking) => {
        const isPaid = record.paymentStatus === 'Đã thanh toán';
        return (
          <Space size={6}>
            {!isPaid && (
              <Button
                type="primary"
                size="small"
                icon={<QrcodeOutlined />}
                style={{ borderRadius: '6px', background: '#2563eb', fontWeight: 600, fontSize: '12px' }}
                onClick={() => handleOpenQR(record)}
              >
                Mã VietQR
              </Button>
            )}
            <Tooltip title="Tải hóa đơn điện tử">
              <Button 
                type="default"
                size="small"
                icon={<DownloadOutlined />} 
                style={{ borderRadius: '6px', fontSize: '12px' }}
                onClick={() => message.success(`Đang tải hóa đơn cho đơn #${record.bookingCode}...`)}
              />
            </Tooltip>
          </Space>
        );
      }
    }
  ];

  const transactionColumns = [
    {
      title: <span style={{ fontWeight: 700, color: '#334155' }}>Mã giao dịch</span>,
      dataIndex: 'transaction_code',
      key: 'transaction_code',
      width: '20%',
      render: (text: string) => <Tag color="blue" style={{ fontWeight: 700 }}>{text}</Tag>
    },
    {
      title: <span style={{ fontWeight: 700, color: '#334155' }}>Loại giao dịch</span>,
      dataIndex: 'transaction_type',
      key: 'transaction_type',
      width: '18%',
      render: (type: string) => {
        const map: Record<string, { label: string; color: string }> = {
          DEPOSIT: { label: 'Tiền cọc', color: 'orange' },
          RENTAL: { label: 'Tiền thuê xe', color: 'blue' },
          SURCHARGE: { label: 'Phụ phí', color: 'purple' },
          REFUND: { label: 'Hoàn cọc', color: 'green' }
        };
        const conf = map[type] || { label: type, color: 'default' };
        return <Tag color={conf.color}>{conf.label}</Tag>;
      }
    },
    {
      title: <span style={{ fontWeight: 700, color: '#334155' }}>Phương thức</span>,
      dataIndex: 'payment_method',
      key: 'payment_method',
      width: '18%',
      render: (method: string) => getMethodTag(method)
    },
    {
      title: <span style={{ fontWeight: 700, color: '#334155' }}>Số tiền</span>,
      dataIndex: 'amount',
      key: 'amount',
      width: '20%',
      render: (val: any) => (
        <Text strong style={{ color: '#16a34a', fontSize: '14px' }}>
          {formatPrice(Number(val))}
        </Text>
      )
    },
    {
      title: <span style={{ fontWeight: 700, color: '#334155' }}>Trạng thái</span>,
      dataIndex: 'status',
      key: 'status',
      width: '24%',
      render: (status: string) => {
        if (status === 'PAID') return <Tag color="success">Thành công</Tag>;
        if (status === 'PENDING') return <Tag color="processing">Chờ xử lý</Tag>;
        return <Tag color="default">{status}</Tag>;
      }
    }
  ];

  const bankName = 'Ngân hàng Quân Đội (MB Bank)';
  const bankAccount = '0987654321';
  const accountHolder = 'CONG TY CP AUTORENT';
  const qrTransferContent = selectedBooking ? `AUTORENT ${selectedBooking.bookingCode}` : 'AUTORENT';
  const qrAmount = selectedBooking ? Number(selectedBooking.totalAmount || 0) : 0;
  const vietQrUrl = `https://img.vietqr.io/image/MB-${bankAccount}-compact2.png?amount=${qrAmount}&addInfo=${encodeURIComponent(qrTransferContent)}&accountName=${encodeURIComponent(accountHolder)}`;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>Lịch sử & Cổng thanh toán</Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>Quản lý hóa đơn điện tử, giao dịch ngân hàng và quét mã VietQR chuyển khoản.</Text>
        </div>

        <Space size={12}>
          <Segmented
            value={activeTab}
            onChange={(val) => setActiveTab(val as any)}
            options={[
              { label: `Hóa đơn đơn thuê (${bookings.length})`, value: 'bookings' },
              { label: `Lịch sử giao dịch (${payments.length})`, value: 'transactions' }
            ]}
          />
          <Input 
            placeholder="Tìm theo mã đơn, mã giao dịch..." 
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            allowClear
            style={{ width: '240px', borderRadius: '8px' }}
          />
          <Button icon={<ReloadOutlined />} onClick={loadData} size="small" style={{ borderRadius: '6px' }} />
        </Space>
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
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', fontWeight: 500 }}>Tổng tiền đơn thuê</Text>
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
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', fontWeight: 500 }}>Đơn hoàn tất thanh toán</Text>
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
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', fontWeight: 500 }}>Cổng thanh toán & Cọc</Text>
                <Title level={4} style={{ margin: 0, fontWeight: 800, color: '#6b21a8' }}>VietQR Chuyển khoản tức thì</Title>
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
        {activeTab === 'bookings' ? (
          <Table 
            loading={loading}
            dataSource={filteredBookings} 
            columns={bookingColumns} 
            rowKey="id"
            pagination={{ pageSize: 8, showTotal: (total) => `Tổng cộng ${total} đơn thuê` }}
          />
        ) : (
          <Table 
            loading={loading}
            dataSource={filteredPayments} 
            columns={transactionColumns} 
            rowKey="id"
            pagination={{ pageSize: 8, showTotal: (total) => `Tổng cộng ${total} giao dịch` }}
          />
        )}
      </Card>

      {/* Dynamic VietQR Payment Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <QrcodeOutlined style={{ color: '#2563eb', fontSize: '20px' }} />
            <span style={{ fontWeight: 800 }}>Thanh toán qua mã VietQR Động</span>
          </div>
        }
        open={qrModalVisible}
        onCancel={() => setQrModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setQrModalVisible(false)} style={{ borderRadius: '6px' }}>
            Đóng
          </Button>,
          <Button
            key="confirm"
            type="primary"
            icon={<CheckCircleOutlined />}
            loading={confirmingPayment}
            onClick={handleConfirmTransfer}
            style={{ borderRadius: '6px', background: '#16a34a', borderColor: '#16a34a', fontWeight: 700 }}
          >
            Tôi đã chuyển khoản thành công
          </Button>
        ]}
        width={560}
      >
        {selectedBooking && (
          <div style={{ padding: '8px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <img 
                src={vietQrUrl} 
                alt="VietQR Payment Code" 
                style={{ width: '260px', height: '260px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
              />
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                Quét mã trên ứng dụng ngân hàng bất kỳ để tự động điền số tiền & nội dung
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text type="secondary">Ngân hàng thụ hưởng:</Text>
                <Text strong>{bankName}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <Text type="secondary">Số tài khoản:</Text>
                <Space>
                  <Text copyable={{ text: bankAccount }} strong style={{ fontSize: '15px', color: '#1e3a8a' }}>{bankAccount}</Text>
                </Space>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text type="secondary">Chủ tài khoản:</Text>
                <Text strong>{accountHolder}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <Text type="secondary">Số tiền thanh toán:</Text>
                <Text strong style={{ fontSize: '16px', color: '#dc2626' }}>{formatPrice(qrAmount)}</Text>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">Nội dung chuyển khoản:</Text>
                <Space>
                  <Tag color="magenta" style={{ fontWeight: 800, fontSize: '13px', padding: '2px 8px' }}>{qrTransferContent}</Tag>
                  <Button 
                    size="small" 
                    icon={<CopyOutlined />} 
                    onClick={() => handleCopy(qrTransferContent, 'nội dung chuyển khoản')}
                  >
                    Sao chép
                  </Button>
                </Space>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
