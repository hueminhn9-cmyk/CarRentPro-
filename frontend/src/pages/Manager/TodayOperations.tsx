import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Tag, Button, Row, Col, Empty, message } from 'antd';
import {
  ClockCircleOutlined,
  ExportOutlined,
  ImportOutlined,
  CarOutlined,
  UserOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { TableSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export const TodayOperations: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [operations, setOperations] = useState<any[]>([]);

  const fetchOperations = async () => {
    setLoading(true);
    try {
      const res: any = await api.bookings.getAll({ limit: 100 });
      const list = Array.isArray(res) ? res : (res?.items || res?.data || []);
      
      const todayStr = dayjs().format('YYYY-MM-DD');

      // Filter and map operational items:
      // 1. Pickups: bookings that are CONFIRMED or READY_FOR_PICKUP (or PENDING)
      // 2. Returns: bookings that are ACTIVE (currently on trip)
      const mappedItems: any[] = [];

      list.forEach((b: any) => {
        const startDate = b.startDate ? dayjs(b.startDate).format('YYYY-MM-DD') : '';
        const endDate = b.endDate ? dayjs(b.endDate).format('YYYY-MM-DD') : '';

        // Check for Pickup: Ready to deliver vehicle
        if (b.status === 'CONFIRMED' || b.status === 'READY_FOR_PICKUP' || (b.status === 'Chờ xác nhận' && startDate <= todayStr)) {
          mappedItems.push({
            id: b.id,
            bookingCode: b.bookingCode || `AR-${b.id}`,
            type: 'PICKUP',
            time: '09:00',
            date: b.startDate,
            vehicle: b.vehicleName || 'Xe AutoRent',
            plate: b.vehiclePlate || 'Biển số đang cấp',
            customer: b.customerName || 'Khách hàng',
            phone: b.customerPhone || 'N/A',
            pickupLocation: b.pickupLocation || 'Showroom AutoRent',
            docStatus: b.contractSigned ? 'Hợp đồng đã ký điện tử' : 'Chờ xác minh & ký hợp đồng',
            paymentStatus: b.paymentStatus || 'Đã cọc',
            rawBooking: b
          });
        }
        // Check for Return: Vehicle is currently rented out and needs to be returned
        else if (b.status === 'ACTIVE' || b.status === 'Đang thuê') {
          mappedItems.push({
            id: b.id,
            bookingCode: b.bookingCode || `AR-${b.id}`,
            type: 'RETURN',
            time: '17:30',
            date: b.endDate,
            vehicle: b.vehicleName || 'Xe AutoRent',
            plate: b.vehiclePlate || 'Biển số xe',
            customer: b.customerName || 'Khách hàng',
            phone: b.customerPhone || 'N/A',
            dropoffLocation: b.dropoffLocation || 'Showroom AutoRent',
            docStatus: 'Hợp đồng đang có hiệu lực',
            paymentStatus: b.paymentStatus || 'Đã thanh toán',
            rawBooking: b
          });
        }
      });

      // Sort: Prioritize today's items first, then by date
      mappedItems.sort((a, b) => {
        if (a.type === 'PICKUP' && b.type === 'RETURN') return -1;
        if (a.type === 'RETURN' && b.type === 'PICKUP') return 1;
        return a.date?.localeCompare(b.date || '') || 0;
      });

      setOperations(mappedItems);
    } catch (err) {
      message.error('Không thể tải lịch trình điều hành trong ngày');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperations();
  }, []);

  const todayStr = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const pickupCount = operations.filter(o => o.type === 'PICKUP').length;
  const returnCount = operations.filter(o => o.type === 'RETURN').length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Title level={4} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>
            Lịch trình Vận hành trong ngày (Today's Operations)
          </Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>
            <CalendarOutlined style={{ marginRight: '6px' }} />
            {todayStr} • Ca trực Showroom Điều hành
          </Text>
        </div>

        <Space size={12}>
          <Tag color="blue" style={{ padding: '4px 12px', fontSize: '13px', borderRadius: '6px' }}>
            {pickupCount} Lượt Giao xe (Pickup)
          </Tag>
          <Tag color="purple" style={{ padding: '4px 12px', fontSize: '13px', borderRadius: '6px' }}>
            {returnCount} Lượt Nhận xe (Return)
          </Tag>
          <Button icon={<ReloadOutlined />} onClick={fetchOperations} size="small" style={{ borderRadius: '6px' }}>
            Làm mới
          </Button>
        </Space>
      </div>

      {loading ? (
        <TableSkeleton rows={4} />
      ) : operations.length === 0 ? (
        <EmptyState 
          title="Không có lịch giao nhận xe cần xử lý" 
          description="Hiện tại không có đơn thuê xe nào ở trạng thái cần bàn giao hoặc hoàn trả trong ca này."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {operations.map((item) => {
            const isPickup = item.type === 'PICKUP';

            return (
              <Card
                key={`${item.type}-${item.id}`}
                style={{
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                  overflow: 'hidden'
                }}
                styles={{ body: { padding: '20px 24px' } }}
              >
                <Row gutter={[20, 16]} align="middle">
                  {/* Time / Type badge */}
                  <Col xs={24} sm={4}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '12px',
                      borderRadius: '10px',
                      background: isPickup ? '#eff6ff' : '#faf5ff',
                      border: `1px solid ${isPickup ? '#bfdbfe' : '#e9d5ff'}`
                    }}>
                      <ClockCircleOutlined style={{ fontSize: '18px', color: isPickup ? '#2563eb' : '#9333ea', marginBottom: '4px' }} />
                      <div style={{ fontSize: '16px', fontWeight: 800, color: isPickup ? '#1e3a8a' : '#581c87' }}>
                        {item.time}
                      </div>
                      <Tag color={isPickup ? 'blue' : 'purple'} style={{ margin: '4px 0 0 0', fontSize: '11px', fontWeight: 600 }}>
                        {isPickup ? 'BÀN GIAO' : 'NHẬN TRẢ'}
                      </Tag>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                        {item.date ? dayjs(item.date).format('DD/MM/YYYY') : 'Hôm nay'}
                      </div>
                    </div>
                  </Col>

                  {/* Vehicle & Customer Info */}
                  <Col xs={24} sm={14}>
                    <div style={{ marginBottom: '8px' }}>
                      <Space size={8} align="center" wrap>
                        <Text strong style={{ fontSize: '16px', color: '#0f172a' }}>{item.vehicle}</Text>
                        <Tag color="geekblue" style={{ borderRadius: '4px', fontWeight: 600 }}>{item.plate}</Tag>
                        <Tag color="default" style={{ borderRadius: '4px', fontSize: '12px' }}>#{item.bookingCode}</Tag>
                      </Space>
                    </div>

                    <Row gutter={[16, 8]}>
                      <Col xs={24} sm={12}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569' }}>
                          <UserOutlined style={{ color: '#94a3b8' }} />
                          <Text strong>{item.customer}</Text>
                          <Text type="secondary">({item.phone})</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={12}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                          <CheckCircleOutlined style={{ color: isPickup ? '#16a34a' : '#9333ea' }} />
                          <Text style={{ color: isPickup ? '#16a34a' : '#9333ea', fontWeight: 500 }}>{item.docStatus}</Text>
                        </div>
                      </Col>
                    </Row>

                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
                      <strong>Địa điểm:</strong> {isPickup ? item.pickupLocation : item.dropoffLocation} • <strong>Thanh toán:</strong> {item.paymentStatus}
                    </div>
                  </Col>

                  {/* Action Button */}
                  <Col xs={24} sm={6} style={{ textAlign: 'right' }}>
                    {isPickup ? (
                      <Button
                        type="primary"
                        icon={<ExportOutlined />}
                        onClick={() => navigate(`/manager/pickup/${item.id}`)}
                        style={{ borderRadius: '8px', background: '#2563eb', borderColor: '#2563eb', fontWeight: 600 }}
                      >
                        Bắt đầu Bàn giao
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        icon={<ImportOutlined />}
                        onClick={() => navigate(`/manager/return/${item.id}`)}
                        style={{ borderRadius: '8px', background: '#9333ea', borderColor: '#9333ea', fontWeight: 600 }}
                      >
                        Tiến hành Nhận xe
                      </Button>
                    )}
                  </Col>
                </Row>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
