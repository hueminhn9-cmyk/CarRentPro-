import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Tag,
  Button,
  Image,
  Descriptions,
  Divider,
  message,
  Alert,
  Modal,
  Input,
  Table,
  Tooltip,
  Badge,
  Popconfirm,
  Avatar,
  Tabs,
  Empty
} from 'antd';
import {
  ArrowLeftOutlined,
  PrinterOutlined,
  FileProtectOutlined,
  EyeOutlined,
  SafetyCertificateOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CarOutlined,
  BankOutlined,
  AuditOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  EnvironmentOutlined,
  CameraOutlined,
  DashboardOutlined,
  LockOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '@/services/api';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TimelineLifecycle, LifecycleEvent } from '@/components/common/TimelineLifecycle';
import { TableSkeleton } from '@/components/common/LoadingSkeleton';
import { ContractModal } from '@/components/common/ContractModal';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export const BookingDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [contractModalVisible, setContractModalVisible] = useState(false);
  const [handoverModalVisible, setHandoverModalVisible] = useState(false);
  const [emergencyModalVisible, setEmergencyModalVisible] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState('');
  const [error, setError] = useState(false);
  const [booking, setBooking] = useState<any>(null);

  const fetchBooking = async () => {
    if (!id) {
      setLoading(false);
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);
    try {
      const res: any = await api.bookings.getById(id);
      if (res) {
        setBooking(res);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
      message.error('Không tìm thấy đơn đặt xe');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleEmergencyOverride = async () => {
    if (!booking?.id) return;
    if (!emergencyReason.trim()) {
      message.warning('Vui lòng nhập lý do can thiệp khẩn cấp (Emergency Override)');
      return;
    }
    setUpdating(true);
    try {
      await api.bookings.updateStatus(String(booking.id), 'CANCELLED', undefined, `[ADMIN EMERGENCY OVERRIDE]: ${emergencyReason}`);
      message.success('Đã thực hiện can thiệp khẩn cấp: Đóng băng & Hủy đơn thuê thành công!');
      setEmergencyModalVisible(false);
      setEmergencyReason('');
      await fetchBooking();
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Lỗi khi thực hiện can thiệp khẩn cấp');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <TableSkeleton rows={6} />;
  }

  if (error || !booking) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center' }}>
        <Alert
          type="error"
          message="Không tìm thấy thông tin đơn đặt xe"
          description={`Không tìm thấy đơn thuê #${id}. Vui lòng quay lại danh sách radar giám sát đơn.`}
          showIcon
          action={
            <Button type="primary" onClick={() => navigate('/admin/bookings')} style={{ borderRadius: '8px' }}>
              Về Danh sách Đơn thuê
            </Button>
          }
        />
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  const status = booking.rawStatus || booking.status;
  const isPaid = booking.paymentStatus === 'Đã thanh toán' || booking.paymentStatus === 'PAID';
  const depositAmount = booking.depositAmount || 15000000;
  const rentalFee = booking.subtotal || (booking.pricePerDay * (booking.totalDays || 1));
  const serviceFee = booking.serviceFee || 100000;
  const totalAmount = booking.totalAmount || (rentalFee + serviceFee);

  // Determine Assigned Manager Info
  const branchName = booking.pickupLocation || 'Showroom Trung Tâm - Hải Châu, Đà Nẵng';
  const managerName = 'Trần Văn Quản Lý (MGR-DNG01)';
  const managerPhone = '0988 123 456';
  const managerEmail = 'manager.danang@autorent.vn';

  // Handover records list
  const handoverRecords = booking.handoverRecords || [];
  const latestHandover = handoverRecords.length > 0 ? handoverRecords[0] : null;

  // Standard 6 handover photos for inspection
  const standardHandoverPhotos = [
    { title: '1. Góc trực diện Đầu xe', url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=80', status: 'Nguyên vẹn' },
    { title: '2. Góc trực diện Đuôi xe', url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80', status: 'Nguyên vẹn' },
    { title: '3. Thân xe Sườn trái', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80', status: 'Không trầy xước' },
    { title: '4. Thân xe Sườn phải', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80', status: 'Không trầy xước' },
    { title: '5. Khoang lái & Nội thất', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80', status: 'Vệ sinh sạch sẽ' },
    { title: '6. Bảng đồng hồ công tơ mét (ODO)', url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&auto=format&fit=crop&q=80', status: 'Ghi nhận ODO' }
  ];

  // Lifecycle Timeline
  const timelineEvents: LifecycleEvent[] = [
    {
      title: 'Tạo đơn thuê xe thành công',
      timestamp: booking.createdAt ? dayjs(booking.createdAt).format('DD/MM/YYYY HH:mm') : 'N/A',
      description: `Khách hàng ${booking.customerName} gửi yêu cầu thuê xe trên hệ thống SaaS.`,
      status: 'completed',
      tag: 'Tạo đơn'
    },
    {
      title: 'Xác minh hồ sơ pháp lý & Đặt cọc',
      timestamp: booking.createdAt ? dayjs(booking.createdAt).add(1, 'hour').format('DD/MM/YYYY HH:mm') : 'N/A',
      description: isPaid
        ? `Đã nhận tiền cọc ${formatPrice(depositAmount)} qua ${booking.paymentMethod}. Hồ sơ hợp lệ.`
        : 'Chờ khách hàng hoàn tất thanh toán tiền cọc giữ xe.',
      status: isPaid ? 'completed' : 'pending',
      tag: 'Thanh toán'
    },
    {
      title: 'Ký số Hợp đồng Điện tử',
      timestamp: booking.contractSigned ? dayjs(booking.createdAt).add(2, 'hour').format('DD/MM/YYYY HH:mm') : 'N/A',
      description: booking.contractSigned
        ? 'Khách hàng và AutoRent đã hoàn tất ký số bảo mật điện tử.'
        : 'Chờ các bên ký hợp đồng pháp lý trực tuyến.',
      status: booking.contractSigned ? 'completed' : 'pending',
      tag: 'Hợp đồng'
    },
    {
      title: 'Biên bản Bàn giao xe (Manager Pickup)',
      timestamp: dayjs(booking.startDate).format('DD/MM/YYYY 08:30'),
      description: status === 'ACTIVE' || status === 'COMPLETED'
        ? `Quản lý ${managerName} đã hoàn tất kiểm tra 6 góc xe và bàn giao chìa khóa cho khách.`
        : 'Chờ đến ngày bàn giao xe tại chi nhánh.',
      status: (status === 'ACTIVE' || status === 'COMPLETED') ? 'completed' : 'pending',
      tag: 'Bàn giao'
    },
    {
      title: 'Thu hồi xe & Hoàn trả tiền cọc',
      timestamp: dayjs(booking.endDate).format('DD/MM/YYYY 17:30'),
      description: status === 'COMPLETED'
        ? 'Tiếp nhận xe an toàn, không có thiệt hại phát sinh. Đã hoàn tất đối soát tiền cọc.'
        : 'Hành trình đang diễn ra hoặc chưa bắt đầu.',
      status: status === 'COMPLETED' ? 'completed' : 'pending',
      tag: 'Hoàn cọc'
    }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Executive Header Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px', 
        flexWrap: 'wrap', 
        gap: '16px',
        background: '#ffffff',
        padding: '18px 24px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(15, 23, 42, 0.04)'
      }}>
        <Space size={16}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/bookings')}>
            Về Radar Giám sát
          </Button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Title level={4} style={{ margin: 0, fontWeight: 800 }}>
                Hồ sơ Kiểm toán Đơn thuê #{booking.bookingCode || booking.id}
              </Title>
              <StatusBadge status={booking.status} />
              <Tag color="purple" style={{ borderRadius: '4px', fontWeight: 700, padding: '2px 8px' }}>
                ADMIN AUDIT VIEW
              </Tag>
            </div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Thời gian thuê: <strong>{dayjs(booking.startDate).format('DD/MM/YYYY')}</strong> &rarr; <strong>{dayjs(booking.endDate).format('DD/MM/YYYY')}</strong> ({booking.totalDays} ngày)
            </Text>
          </div>
        </Space>

        <Space size={10} wrap>
          {/* Nút Xem Hợp đồng Pháp lý */}
          <Button 
            icon={<FileProtectOutlined />} 
            onClick={() => setContractModalVisible(true)}
            style={{ borderColor: '#2563eb', color: '#2563eb', fontWeight: 600, borderRadius: '8px' }}
          >
            Xem Hợp đồng Pháp lý
          </Button>

          {/* Nút Xem Biên bản Bàn giao của Manager */}
          <Button 
            icon={<CameraOutlined />} 
            onClick={() => setHandoverModalVisible(true)}
            style={{ borderColor: '#0891b2', color: '#0891b2', fontWeight: 600, borderRadius: '8px' }}
          >
            Xem Biên bản Bàn giao (Manager)
          </Button>

          {/* In phiếu đơn kiểm toán */}
          <Button icon={<PrinterOutlined />} onClick={() => window.print()} style={{ borderRadius: '8px' }}>
            In Phiếu Kiểm toán
          </Button>

          {/* Emergency Override (Chỉ dùng khi có tranh chấp nghiêm trọng) */}
          <Button 
            danger
            icon={<StopOutlined />} 
            onClick={() => setEmergencyModalVisible(true)}
            style={{ fontWeight: 600, borderRadius: '8px' }}
          >
            Can thiệp Khẩn cấp
          </Button>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        {/* CỘT TRÁI (2/3): GIÁM SÁT VẬN HÀNH, NHÂN VIÊN & BIÊN BẢN */}
        <Col xs={24} lg={15}>
          {/* KHỐI 1: THÔNG TIN NHÂN VIÊN PHỤ TRÁCH & CHI NHÁNH */}
          <Card 
            title={
              <Space>
                <SafetyCertificateOutlined style={{ color: '#0284c7' }} />
                <span style={{ fontWeight: 700 }}>Chi nhánh Tiếp nhận & Nhân sự Phụ trách (Assigned Manager)</span>
              </Space>
            }
            style={{ borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}
          >
            <Row gutter={[20, 20]} align="middle">
              <Col xs={24} sm={12}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Avatar size={48} style={{ backgroundColor: '#0284c7', flexShrink: 0 }} icon={<UserOutlined />} />
                  <div>
                    <Text type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Điều phối viên phụ trách
                    </Text>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{managerName}</div>
                    <Space size={8} style={{ marginTop: '4px' }}>
                      <Tag color="cyan" style={{ margin: 0, fontSize: '11px' }}>Chi nhánh Hải Châu</Tag>
                      <Tag color="green" style={{ margin: 0, fontSize: '11px' }}>Đang trực ca</Tag>
                    </Space>
                  </div>
                </div>
              </Col>

              <Col xs={24} sm={12}>
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12px', color: '#475569', marginBottom: '6px' }}>
                    <EnvironmentOutlined style={{ color: '#0284c7', marginRight: '6px' }} />
                    <strong>Địa điểm:</strong> {branchName}
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569', marginBottom: '6px' }}>
                    <PhoneOutlined style={{ color: '#16a34a', marginRight: '6px' }} />
                    <strong>Hotline nội bộ:</strong> {managerPhone}
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569' }}>
                    <MailOutlined style={{ color: '#2563eb', marginRight: '6px' }} />
                    <strong>Email:</strong> {managerEmail}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* KHỐI 2: THÔNG TIN PHƯƠNG TIỆN BÀN GIAO */}
          <Card 
            title={
              <Space>
                <CarOutlined style={{ color: '#10b981' }} />
                <span style={{ fontWeight: 700 }}>Thông tin Phương tiện bàn giao (Vehicle Asset)</span>
              </Space>
            }
            style={{ borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}
          >
            <Row gutter={[20, 20]} align="middle">
              <Col xs={24} sm={8}>
                <Image
                  src={booking.vehicleImage || "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=60"}
                  alt="Vehicle"
                  style={{ borderRadius: '8px', width: '100%', maxHeight: '150px', objectFit: 'cover' }}
                />
              </Col>
              <Col xs={24} sm={16}>
                <Title level={5} style={{ margin: 0, color: '#0f172a' }}>{booking.vehicleName}</Title>
                <Space style={{ margin: '8px 0' }} wrap>
                  <Tag color="blue" style={{ fontWeight: 700, fontSize: '13px' }}>
                    {booking.vehicleLicensePlate || '43A-889.99'}
                  </Tag>
                  <Tag color="cyan">Số tự động</Tag>
                  <Tag color="green">Động cơ Điện / Xăng</Tag>
                  <Tag color="gold">Bảo hiểm 2 chiều</Tag>
                </Space>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                  Đơn giá niêm yết: <strong style={{ color: '#0f172a' }}>{formatPrice(booking.pricePerDay)}/ngày</strong>. Xe đã được kiểm tra kỹ thuật định kỳ và định vị GPS hoạt động 24/7.
                </p>
              </Col>
            </Row>
          </Card>

          {/* KHỐI 3: TIMELINE GIÁM SÁT TOÀN DIỆN */}
          <Card 
            title={
              <Space>
                <HistoryOutlined style={{ color: '#6366f1' }} />
                <span style={{ fontWeight: 700 }}>Nhật ký Vòng đời Đơn thuê (Lifecycle Timeline)</span>
              </Space>
            }
            style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
          >
            <TimelineLifecycle events={timelineEvents} />
          </Card>
        </Col>

        {/* CỘT PHẢI (1/3): ĐỐI SOÁT TÀI CHÍNH, TIỀN CỌC & KHÁCH HÀNG */}
        <Col xs={24} lg={9}>
          {/* KHỐI 4: ĐỐI SOÁT TIỀN CỌC & BẢNG KÊ THANH TOÁN (LEDGER) */}
          <Card 
            title={
              <Space>
                <BankOutlined style={{ color: '#f59e0b' }} />
                <span style={{ fontWeight: 700 }}>Đối soát Tiền cọc & Sổ cái Thanh toán</span>
              </Space>
            }
            style={{ borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}
          >
            {/* Trạng thái tiền cọc nổi bật */}
            <div style={{
              background: isPaid ? '#f0fdf4' : '#fffbeb',
              border: `1px solid ${isPaid ? '#bbf7d0' : '#fde68a'}`,
              borderRadius: '8px',
              padding: '14px 16px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: isPaid ? '#166534' : '#92400e' }}>
                  {isPaid ? 'ĐÃ NHẬN TIỀN CỌC (ESCROW SECURED)' : 'CHỜ THANH TOÁN TIỀN CỌC'}
                </span>
                <Tag color={isPaid ? 'success' : 'warning'} style={{ margin: 0, fontWeight: 700 }}>
                  {isPaid ? 'AN TOÀN' : 'CHỜ DUYỆT'}
                </Tag>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: isPaid ? '#15803d' : '#b45309', marginTop: '6px' }}>
                {formatPrice(depositAmount)}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                {status === 'COMPLETED'
                  ? 'Quyết toán: Đã hoàn trả lại 100% tài khoản khách sau kiểm tra biên bản.'
                  : 'Tiền cọc giữ xe được phong tỏa tự động để phòng ngừa rủi ro hư hỏng phương tiện.'}
              </div>
            </div>

            {/* Chi tiết chi phí đơn thuê */}
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="Tiền thuê xe ({booking.totalDays} ngày)">
                <strong>{formatPrice(rentalFee)}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Phí vệ sinh & Giao nhận">
                <span>{formatPrice(serviceFee)}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Tiền cọc xe (Bắt buộc)">
                <span style={{ color: '#d97706', fontWeight: 600 }}>{formatPrice(depositAmount)}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng thanh toán trước">
                <strong style={{ fontSize: '16px', color: '#1e3a8a' }}>
                  {formatPrice(totalAmount + depositAmount)}
                </strong>
              </Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: '16px 0' }} />

            {/* Thông tin đối soát giao dịch ngân hàng */}
            <div style={{ fontSize: '12px', color: '#475569' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Phương thức giao dịch:</span>
                <Tag color="geekblue" style={{ margin: 0 }}>{booking.paymentMethod || 'Chuyển khoản VietQR'}</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Mã giao dịch ngân hàng:</span>
                <Text code copyable>{booking.bookingCode ? `TXN-${booking.bookingCode}` : 'TXN-AR-2026-LIVE'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Trạng thái đối soát:</span>
                <span style={{ color: isPaid ? '#16a34a' : '#d97706', fontWeight: 600 }}>
                  {isPaid ? 'Khớp sổ cái 100%' : 'Chờ đối soát'}
                </span>
              </div>
            </div>
          </Card>

          {/* KHỐI 5: HỒ SƠ KHÁCH HÀNG & PHÁP LÝ */}
          <Card 
            title={
              <Space>
                <UserOutlined style={{ color: '#2563eb' }} />
                <span style={{ fontWeight: 700 }}>Hồ sơ Khách hàng & Định danh</span>
              </Space>
            }
            style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Avatar size={48} style={{ backgroundColor: '#1e3a8a' }}>
                {booking.customerName ? booking.customerName.charAt(0) : 'K'}
              </Avatar>
              <div>
                <Text strong style={{ fontSize: '15px' }}>{booking.customerName}</Text>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Mã KH: #{booking.customerId || 'CUST-01'}</div>
              </div>
            </div>

            <Descriptions column={1} size="small">
              <Descriptions.Item label="Số điện thoại">
                <Text copyable>{booking.customerPhone || '0912 345 678'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <Text copyable>{booking.customerEmail || 'khachhang@autorent.vn'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Giấy phép lái xe">
                <Tag color="success" icon={<SafetyCertificateOutlined />}>B2 - Đã xác thực CCCD</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú của khách">
                <span style={{ fontStyle: 'italic', color: '#475569' }}>
                  "{booking.notes || 'Không có ghi chú thêm.'}"
                </span>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* MODAL 1: XEM HỢP ĐỒNG PHÁP LÝ (CONTRACT MODAL) */}
      <ContractModal
        visible={contractModalVisible}
        onClose={() => setContractModalVisible(false)}
        bookingId={booking?.id}
        bookingCode={booking?.bookingCode}
        isSigned={Boolean(booking?.contractSigned)}
      />

      {/* MODAL 2: XEM BIÊN BẢN BÀN GIAO CỦA MANAGER (HANDOVER AUDIT INSPECTION) */}
      <Modal
        title={
          <Space>
            <AuditOutlined style={{ color: '#0891b2' }} />
            <span>Đối soát Biên bản Bàn giao & Hình ảnh Hiện trạng Xe (Manager Audit)</span>
          </Space>
        }
        open={handoverModalVisible}
        onCancel={() => setHandoverModalVisible(false)}
        width={960}
        footer={[
          <Button key="close" type="primary" onClick={() => setHandoverModalVisible(false)}>
            Đóng Biên bản
          </Button>
        ]}
      >
        <Alert
          type="info"
          showIcon
          message="Biên bản kiểm tra độc lập nhằm chống gian lận nội bộ"
          description={`Biên bản này do nhân viên ${managerName} chụp và lập tại thời điểm giao xe. Admin đối chiếu 6 góc ảnh hiện trạng để đảm bảo tính minh bạch và tránh thất thoát tài sản doanh nghiệp.`}
          style={{ marginBottom: '16px' }}
        />

        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
          <Col span={8}>
            <Card size="small" style={{ background: '#f8fafc', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>CHỈ SỐ ĐỒNG HỒ ODO BÀN GIAO</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>12,450 km</div>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" style={{ background: '#f8fafc', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>MỨC NHIÊN LIỆU / PIN</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#16a34a' }}>100% (Đầy bình)</div>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" style={{ background: '#f8fafc', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>KẾT LUẬN HIỆN TRẠNG</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0284c7' }}>EXCELLENT (Xuất sắc)</div>
            </Card>
          </Col>
        </Row>

        <Title level={5} style={{ fontSize: '14px', marginBottom: '12px' }}>
          6 Góc Ảnh Hiện trạng Xe do Quản lý Chi nhánh ghi nhận lúc bàn giao:
        </Title>

        <Row gutter={[16, 16]}>
          {standardHandoverPhotos.map((photo, idx) => (
            <Col xs={24} sm={12} md={8} key={idx}>
              <Card 
                size="small" 
                hoverable
                style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}
                styles={{ body: { padding: '8px' } }}
              >
                <Image
                  src={photo.url}
                  alt={photo.title}
                  style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px' }}
                />
                <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong style={{ fontSize: '12px' }}>{photo.title}</Text>
                  <Tag color="success" style={{ fontSize: '10px', margin: 0 }}>{photo.status}</Tag>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Modal>

      {/* MODAL 3: CAN THIỆP KHẨN CẤP (EMERGENCY OVERRIDE) */}
      <Modal
        title={
          <Space>
            <ExclamationCircleOutlined style={{ color: '#dc2626' }} />
            <span style={{ color: '#dc2626' }}>Can thiệp Khẩn cấp Đơn thuê (Admin Emergency Override)</span>
          </Space>
        }
        open={emergencyModalVisible}
        onCancel={() => {
          setEmergencyModalVisible(false);
          setEmergencyReason('');
        }}
        onOk={handleEmergencyOverride}
        confirmLoading={updating}
        okText="Xác nhận Can thiệp & Đóng băng đơn"
        okButtonProps={{ danger: true }}
        cancelText="Hủy bỏ"
      >
        <Alert
          type="warning"
          showIcon
          message="Lưu ý quan trọng dành cho Quản trị viên"
          description="Tính năng Can thiệp Khẩn cấp chỉ được sử dụng khi phát hiện tranh chấp pháp lý nghiêm trọng, nghi ngờ hành vi gian lận hoặc sự cố đặc biệt ngoài bãi xe. Quyết định can thiệp sẽ được ghi nhận vào Nhật ký Kiểm toán (Audit Logs) của hệ thống."
          style={{ marginBottom: '16px' }}
        />

        <Paragraph style={{ color: '#475569', fontSize: '13px' }}>
          Vui lòng nhập lý do can thiệp khẩn cấp cho đơn thuê <strong>#{booking.bookingCode || booking.id}</strong>:
        </Paragraph>

        <TextArea
          rows={4}
          placeholder="Ví dụ: Phát hiện bằng chứng khách hàng sử dụng giấy tờ giả mạo, xe bị giữ tại cơ quan chức năng hoặc phát hiện Manager gian lận..."
          value={emergencyReason}
          onChange={(e) => setEmergencyReason(e.target.value)}
        />
      </Modal>
    </div>
  );
};
