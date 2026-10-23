import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Space, Button, Divider, message, Tag, Image, Spin, Alert } from 'antd';
import {
  FileTextOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TimelineLifecycle, LifecycleEvent } from '@/components/common/TimelineLifecycle';
import { PriceBreakdown } from '@/components/common/PriceBreakdown';
import { ContractModal } from '@/components/common/ContractModal';

const { Title, Text } = Typography;

export const RentalDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [contractModalVisible, setContractModalVisible] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchBooking = () => {
    if (id) {
      setLoading(true);
      setError(false);
      api.bookings.getById(id).then((res: any) => {
        if (res) {
          setBooking(res);
        } else {
          setError(true);
        }
      }).catch((err) => {
        setError(true);
        message.error('Không tìm thấy thông tin đơn đặt xe');
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px', color: '#64748b' }}>Đang nạp chi tiết chuyến đi...</div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center' }}>
        <Alert
          type="error"
          message="Không tìm thấy thông tin chuyến đi"
          description={`Không tìm thấy mã đơn #${id}. Vui lòng kiểm tra lại danh sách đơn thuê của bạn.`}
          showIcon
          action={
            <Button type="primary" onClick={() => navigate('/customer/my-rentals')} style={{ borderRadius: '8px' }}>
              Về Danh sách chuyến đi
            </Button>
          }
        />
      </div>
    );
  }

  const timelineEvents: LifecycleEvent[] = [
    {
      title: 'Đặt xe & Đặt cọc thành công',
      timestamp: booking.createdAt ? new Date(booking.createdAt).toLocaleString('vi-VN') : 'Mới đây',
      description: 'Hệ thống đã ghi nhận thông tin và đặt cọc.',
      status: 'completed',
      tag: 'Xong'
    },
    {
      title: 'Ký Hợp đồng điện tử',
      timestamp: booking.contractSigned ? 'Đã ký điện tử' : 'Đang chờ ký',
      description: booking.contractSigned ? 'Hợp đồng điện tử đã được ký số hợp lệ.' : 'Vui lòng mở Hợp đồng để ký tên điện tử.',
      status: booking.contractSigned ? 'completed' : 'in_progress',
      tag: booking.contractSigned ? 'Đã ký' : 'Cần xử lý'
    },
    {
      title: 'Nhận bàn giao xe (Pickup)',
      timestamp: `${booking.startDate || '20/08/2026'} (Dự kiến)`,
      description: `Nhận xe tại ${booking.pickupLocation || 'Showroom Sân Bay Đà Nẵng'}.`,
      status: 'pending',
      tag: 'Sắp tới'
    },
    {
      title: 'Hoàn trả xe & Thanh lý cọc (Return)',
      timestamp: `${booking.endDate || '24/08/2026'} (Dự kiến)`,
      description: `Bàn giao trả xe tại ${booking.dropoffLocation || booking.pickupLocation}.`,
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
            <Title level={3} style={{ margin: 0, fontWeight: 800 }}>Chuyến đi #{booking.bookingCode || booking.id}</Title>
            <Text type="secondary">Phương tiện: {booking.vehicleName} ({booking.licensePlate || 'Xe AutoRent'})</Text>
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
                Vui lòng xem và ký tên điện tử vào bản hợp đồng trước ngày nhận xe.
              </Text>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setContractModalVisible(true)}
                style={{ borderRadius: '6px', background: '#d97706', borderColor: '#d97706' }}
              >
                Xem & Ký hợp đồng ngay
              </Button>
            </Card>
          )}

          <TimelineLifecycle events={timelineEvents} style={{ marginBottom: '24px' }} />

          {/* Showroom & Location Info */}
          <Card title={<span style={{ fontWeight: 700 }}>Địa điểm bàn giao & hoàn trả xe</span>} style={{ borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.8 }}>
              <div><strong>Điểm lấy xe:</strong> {booking.pickupLocation || 'Showroom Sân Bay Đà Nẵng'}</div>
              <div><strong>Điểm trả xe:</strong> {booking.dropoffLocation || booking.pickupLocation || 'Showroom Chi Nhánh Trung Tâm - Hải Châu'}</div>
              <div><strong>Thời gian nhận xe:</strong> 09:00 ngày {booking.startDate}</div>
              <div><strong>Hotline chi nhánh 24/7:</strong> 1900 6868 (Phím 1)</div>
            </div>
          </Card>

          {/* Vehicle Images loaded from DB */}
          <Card title={<span style={{ fontWeight: 700 }}>Hình ảnh phương tiện thực tế</span>} style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <Row gutter={[12, 12]}>
              {(booking.vehicleGallery && booking.vehicleGallery.length > 0 ? booking.vehicleGallery : [booking.vehicleImage]).map((img: string, idx: number) => (
                <Col span={12} key={idx}>
                  <Image
                    src={img}
                    alt={`Car image ${idx + 1}`}
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </Col>
              ))}
            </Row>
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
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="dashed"
                block
                icon={<FileTextOutlined />}
                onClick={() => setContractModalVisible(true)}
                style={{ borderRadius: '8px' }}
              >
                Xem & Ký Hợp đồng Điện tử
              </Button>
              <Button
                type="primary"
                ghost
                block
                icon={<DownloadOutlined />}
                onClick={() => setContractModalVisible(true)}
                style={{ borderRadius: '8px' }}
              >
                Tải về bản Hợp đồng (PDF/HTML)
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Contract Modal */}
      <ContractModal
        visible={contractModalVisible}
        onClose={() => setContractModalVisible(false)}
        bookingId={booking.id}
        bookingCode={booking.bookingCode}
        isSigned={booking.contractSigned}
        onSignedSuccess={() => {
          setBooking({ ...booking, contractSigned: true });
          fetchBooking();
        }}
      />
    </div>
  );
};
