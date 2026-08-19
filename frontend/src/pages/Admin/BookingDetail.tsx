import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Space, Button, Tag, Divider, message, Popconfirm, Image } from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  PrinterOutlined,
  DownloadOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CarOutlined,
  CalendarOutlined,
  DollarCircleOutlined,
  FileDoneOutlined,
  FilePdfOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TimelineLifecycle, LifecycleEvent } from '@/components/common/TimelineLifecycle';
import { PriceBreakdown } from '@/components/common/PriceBreakdown';
import { TableSkeleton } from '@/components/common/LoadingSkeleton';

const { Title, Text, Paragraph } = Typography;

export const BookingDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    // Fetch booking details or fallback to enriched mock
    api.bookings.getById(id || '1')
      .then((res: any) => {
        setBooking(res);
      })
      .catch(() => {
        setBooking({
          id: id || 'BK-2026-0816',
          vehicle: {
            name: 'BMW 320i Sport-Line',
            licensePlate: '30A-889.99',
            brand: 'BMW',
            imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=60',
            pricePerDay: 1500000,
            seats: 5,
            transmission: 'Tự động'
          },
          customer: {
            name: 'Nguyễn Văn Hùng',
            phone: '0987 654 321',
            email: 'hung.nguyen@example.com',
            cccd: '001095012345',
            licenseStatus: 'Đã xác minh'
          },
          startDate: '2026-08-20',
          endDate: '2026-08-24',
          totalDays: 4,
          pricePerDay: 1500000,
          depositAmount: 15000000,
          services: [
            { label: 'Thiết bị định vị GPS dẫn đường', amount: 200000 },
            { label: 'Gói Bảo hiểm thân vỏ cao cấp', amount: 400000 }
          ],
          discountAmount: 100000,
          totalAmount: 6500000,
          status: 'CONFIRMED',
          contractSigned: true,
          depositPaid: true
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !booking) {
    return <TableSkeleton rows={5} />;
  }

  const timelineEvents: LifecycleEvent[] = [
    {
      title: 'Tạo đơn thuê xe trực tuyến',
      timestamp: '16/08/2026 09:15',
      description: 'Khách hàng tạo đơn thuê trên website portal.',
      status: 'completed',
      tag: 'Tạo đơn'
    },
    {
      title: 'Thanh toán tiền đặt cọc giữ xe',
      timestamp: '16/08/2026 09:20',
      description: 'Đã nhận chuyển khoản cọc 15.000.000đ qua VNPay.',
      status: 'completed',
      tag: 'Đã thanh toán'
    },
    {
      title: 'Xác thực GPLX & Duyệt đơn thuê',
      timestamp: '16/08/2026 10:00',
      description: 'Quản lý duyệt hồ sơ và phân bổ xe sẵn sàng.',
      status: 'completed',
      tag: 'Đã duyệt'
    },
    {
      title: 'Ký Hợp đồng điện tử',
      timestamp: '16/08/2026 10:15',
      description: 'Hợp đồng số HD-2026-081 đã được ký số OTP bởi 2 bên.',
      status: 'completed',
      tag: 'Đã ký số'
    },
    {
      title: 'Bàn giao xe (Pickup)',
      timestamp: '20/08/2026 09:00 (Dự kiến)',
      description: 'Kiểm tra checklist 6 hạng mục và ký biên bản giao xe.',
      status: 'in_progress',
      tag: 'Tiếp theo'
    },
    {
      title: 'Nhận lại xe & Hoàn trả cọc (Return)',
      timestamp: '24/08/2026 17:00 (Dự kiến)',
      description: 'Kiểm tra odo, xăng và hoàn trả số dư cọc.',
      status: 'pending',
      tag: 'Chưa diễn ra'
    }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#ffffff',
        padding: '20px 24px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        marginBottom: '24px'
      }}>
        <Space size={16}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            Quay lại
          </Button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Title level={4} style={{ margin: 0, fontWeight: 800 }}>
                Chi tiết Đơn thuê #{booking.id?.slice(0, 12) || 'BK-2026-081'}
              </Title>
              <StatusBadge status={booking.status || 'CONFIRMED'} />
            </div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Ngày tạo đơn: 16/08/2026 • Kênh đặt: Trực tuyến
            </Text>
          </div>
        </Space>

        <Space size={10}>
          <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
            In phiếu đơn
          </Button>
          <Button type="primary" icon={<FilePdfOutlined />} style={{ borderRadius: '8px', background: '#0f172a', borderColor: '#0f172a' }}>
            Xem Hợp đồng PDF
          </Button>
        </Space>
      </div>

      {/* 2/3 (Timeline + Activity) and 1/3 (Info + Price) Layout */}
      <Row gutter={[24, 24]}>
        {/* Left 2/3: Lifecycle Timeline & Activity */}
        <Col xs={24} lg={15}>
          <TimelineLifecycle events={timelineEvents} style={{ marginBottom: '24px' }} />

          {/* Vehicle info card */}
          <Card 
            title={<span style={{ fontWeight: 700 }}>Thông tin Phương tiện bàn giao</span>}
            style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
          >
            <Row gutter={[20, 20]} align="middle">
              <Col xs={24} sm={8}>
                <Image
                  src={booking.vehicle?.imageUrl || "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=60"}
                  alt="Vehicle"
                  style={{ borderRadius: '8px', width: '100%', maxHeight: '160px', objectFit: 'cover' }}
                />
              </Col>
              <Col xs={24} sm={16}>
                <Title level={5} style={{ margin: '0 0 8px 0', color: '#0f172a' }}>
                  {booking.vehicle?.name || 'BMW 320i Sport-Line'}
                </Title>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <Tag color="geekblue">{booking.vehicle?.licensePlate || '30A-889.99'}</Tag>
                  <Tag color="default">5 Chỗ ngồi</Tag>
                  <Tag color="default">Số tự động</Tag>
                </div>
                <div style={{ fontSize: '13px', color: '#475569' }}>
                  <strong>Địa điểm nhận/trả xe:</strong> Chi nhánh AutoRent Đống Đa - Hà Nội
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Right 1/3: Customer & Payment Breakdown */}
        <Col xs={24} lg={9}>
          {/* Customer info */}
          <Card 
            title={<span style={{ fontWeight: 700 }}>Khách hàng thuê xe</span>}
            style={{ borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserOutlined style={{ color: '#64748b' }} />
                <Text strong>{booking.customer?.name || 'Nguyễn Văn Hùng'}</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PhoneOutlined style={{ color: '#64748b' }} />
                <Text>{booking.customer?.phone || '0987 654 321'}</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MailOutlined style={{ color: '#64748b' }} />
                <Text type="secondary">{booking.customer?.email || 'hung.nguyen@example.com'}</Text>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">Xác minh GPLX:</Text>
                <Tag color="success">ĐÃ XÁC MINH ✓</Tag>
              </div>
            </div>
          </Card>

          {/* Price Breakdown Component */}
          <PriceBreakdown
            vehicleName={booking.vehicle?.name || 'BMW 320i Sport-Line'}
            days={booking.totalDays || 4}
            pricePerDay={booking.pricePerDay || 1500000}
            services={booking.services}
            depositAmount={booking.depositAmount || 15000000}
            discountAmount={booking.discountAmount || 100000}
          />
        </Col>
      </Row>
    </div>
  );
};
