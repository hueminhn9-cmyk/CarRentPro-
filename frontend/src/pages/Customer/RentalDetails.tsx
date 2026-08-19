import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Space, Button, Divider, message, Modal, Tag } from 'antd';
import {
  FileTextOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TimelineLifecycle, LifecycleEvent } from '@/components/common/TimelineLifecycle';
import { PriceBreakdown } from '@/components/common/PriceBreakdown';

const { Title, Text } = Typography;

export const RentalDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    if (id) {
      api.bookings.getById(id).then((res: any) => {
        if (res) setBooking(res);
      }).catch(() => {
        setBooking({
          id: id || 'BK-2026-0816',
          vehicleName: 'BMW 320i Sport-Line',
          vehicleImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=60',
          licensePlate: '30A-889.99',
          startDate: '2026-08-20',
          endDate: '2026-08-24',
          totalDays: 4,
          pricePerDay: 1500000,
          depositAmount: 15000000,
          services: [
            { label: 'Thiết bị định vị GPS & Vietmap', amount: 200000 },
            { label: 'Bảo hiểm thân vỏ cao cấp 2 chiều', amount: 400000 }
          ],
          totalAmount: 6600000,
          status: 'CONFIRMED',
          contractSigned: true,
          pickupLocation: 'Showroom AutoRent Đống Đa - Hà Nội'
        });
      });
    }
  }, [id]);

  const handleSignContract = () => {
    if (!booking) return;
    setSigning(true);
    Modal.confirm({
      title: 'Xác nhận Ký Hợp đồng Điện tử',
      icon: <ExclamationCircleOutlined />,
      content: 'Bằng việc xác nhận mã OTP, bạn đồng ý ký tên điện tử vào hợp đồng cho thuê xe tự lái và cam kết tuân thủ các quy chế bảo quản phương tiện của AutoRent.',
      okText: 'Ký tên OTP',
      cancelText: 'Hủy',
      onOk: async () => {
        message.success('Ký hợp đồng điện tử thành công!');
        setBooking({ ...booking, contractSigned: true });
        setSigning(false);
      },
      onCancel: () => setSigning(false)
    });
  };

  if (!booking) return <div style={{ textAlign: 'center', padding: '100px 0' }}>Đang tải thông tin chuyến đi...</div>;

  const timelineEvents: LifecycleEvent[] = [
    {
      title: 'Đặt xe & Đặt cọc thành công',
      timestamp: '16/08/2026 09:15',
      description: 'Hệ thống đã xác nhận tiền đặt cọc 15.000.000đ.',
      status: 'completed',
      tag: 'Xong'
    },
    {
      title: 'Ký Hợp đồng điện tử',
      timestamp: booking.contractSigned ? '16/08/2026 09:30' : 'Đang chờ ký',
      description: booking.contractSigned ? 'Hợp đồng số #HD-081 đã ký số thành công.' : 'Vui lòng nhấn Ký ngay bên dưới.',
      status: booking.contractSigned ? 'completed' : 'in_progress',
      tag: booking.contractSigned ? 'Đã ký' : 'Cần xử lý'
    },
    {
      title: 'Nhận bàn giao xe (Pickup)',
      timestamp: '20/08/2026 09:00 (Dự kiến)',
      description: 'Nhận xe tại Showroom Đống Đa, kiểm tra checklist 6 hạng mục.',
      status: 'pending',
      tag: 'Sắp tới'
    },
    {
      title: 'Hoàn trả xe & Thanh lý cọc (Return)',
      timestamp: '24/08/2026 17:00 (Dự kiến)',
      description: 'Nghiệm thu hoàn tất và nhận lại tiền cọc xe.',
      status: 'pending',
      tag: 'Chưa diễn ra'
    }
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/customer/my-rentals')}
          style={{ padding: 0, marginBottom: '8px' }}
        >
          Quay lại danh sách chuyến đi
        </Button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 800 }}>Chuyến đi #{booking.id}</Title>
            <Text type="secondary">Xe: {booking.vehicleName} ({booking.licensePlate || '30A-889.99'})</Text>
          </div>
          <StatusBadge status={booking.status} />
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column: Timeline & Contract */}
        <Col xs={24} md={14}>
          {!booking.contractSigned && (
            <Card style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', marginBottom: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#92400e', marginBottom: '6px' }}>
                Hợp đồng điện tử chưa ký
              </div>
              <Text style={{ fontSize: '13px', color: '#b45309', display: 'block', marginBottom: '14px' }}>
                Vui lòng ký điện tử để Showroom chuẩn bị xe sẵn sàng cho ngày 20/08 tới.
              </Text>
              <Button type="primary" icon={<EditOutlined />} onClick={handleSignContract} loading={signing} style={{ borderRadius: '6px', background: '#d97706', borderColor: '#d97706' }}>
                Ký điện tử ngay
              </Button>
            </Card>
          )}

          <TimelineLifecycle events={timelineEvents} style={{ marginBottom: '24px' }} />

          {/* Vehicle card */}
          <Card title={<span style={{ fontWeight: 700 }}>Thông tin Showroom bàn giao xe</span>} style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
              <div><strong>Địa điểm nhận & trả:</strong> {booking.pickupLocation}</div>
              <div><strong>Hotline hỗ trợ 24/7:</strong> 1900 8888 (Phím 1 gặp trực ca)</div>
              <div><strong>Thời gian nhận xe:</strong> 09:00 ngày {booking.startDate}</div>
            </div>
          </Card>
        </Col>

        {/* Right Column: Cost Breakdown & Actions */}
        <Col xs={24} md={10}>
          <PriceBreakdown
            vehicleName={booking.vehicleName}
            days={booking.totalDays || 4}
            pricePerDay={booking.pricePerDay || 1500000}
            services={booking.services}
            depositAmount={booking.depositAmount || 15000000}
            style={{ marginBottom: '20px' }}
          />

          <Card title={<span style={{ fontWeight: 700 }}>Hợp đồng thuê xe</span>} style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <Text type="secondary">Trạng thái hợp đồng:</Text>
              <Tag color={booking.contractSigned ? 'success' : 'warning'}>
                {booking.contractSigned ? 'ĐÃ KÝ ĐIỆN TỬ ✓' : 'CHỜ KÝ'}
              </Tag>
            </div>
            <Button
              type="dashed"
              block
              icon={<FileTextOutlined />}
              onClick={() => message.success('Đang mở file Hợp đồng điện tử PDF...')}
              style={{ borderRadius: '8px' }}
            >
              Xem bản Hợp đồng (PDF)
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
