import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Tag, Button, Row, Col, Divider, Badge } from 'antd';
import {
  ClockCircleOutlined,
  ExportOutlined,
  ImportOutlined,
  CarOutlined,
  UserOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TableSkeleton } from '@/components/common/LoadingSkeleton';

const { Title, Text } = Typography;

export const TodayOperations: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [operations, setOperations] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    api.bookings.getAll({ limit: 20 })
      .then((res: any) => {
        const list = Array.isArray(res) ? res : (res?.items || res?.data || []);
        setOperations(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const todayStr = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  // Mock operational schedule timeline for demonstration
  const scheduleItems = [
    {
      time: '08:30',
      type: 'PICKUP',
      vehicle: 'BMW 320i Sport-Line',
      plate: '30A-889.99',
      customer: 'Nguyễn Văn Hùng',
      phone: '0987 654 321',
      bookingId: 'BK-2026-081',
      docStatus: 'Đã xác minh GPLX',
      paymentStatus: 'Đã cọc 15.000.000đ',
      status: 'READY_FOR_PICKUP'
    },
    {
      time: '10:00',
      type: 'PICKUP',
      vehicle: 'VinFast VF8 Plus',
      plate: '29E-123.45',
      customer: 'Trần Thị Thu Trang',
      phone: '0912 345 678',
      bookingId: 'BK-2026-082',
      docStatus: 'Đã xác minh GPLX',
      paymentStatus: 'Đã thanh toán 100%',
      status: 'CONFIRMED'
    },
    {
      time: '14:30',
      type: 'RETURN',
      vehicle: 'Toyota Camry 2.5Q',
      plate: '30H-998.88',
      customer: 'Lê Hoàng Long',
      phone: '0934 567 890',
      bookingId: 'BK-2026-079',
      docStatus: 'Hợp đồng hoàn tất',
      paymentStatus: 'Cọc 20.000.000đ',
      status: 'ACTIVE'
    },
    {
      time: '17:00',
      type: 'RETURN',
      vehicle: 'Mercedes C300 AMG',
      plate: '30F-666.88',
      customer: 'Phạm Minh Đức',
      phone: '0978 112 233',
      bookingId: 'BK-2026-075',
      docStatus: 'Kiểm tra hư hại Odo',
      paymentStatus: 'Cọc 25.000.000đ',
      status: 'ACTIVE'
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <Title level={4} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>
            Lịch trình Vận hành trong ngày (Today's Operations)
          </Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>
            <CalendarOutlined style={{ marginRight: '6px' }} />
            {todayStr} • Ca trực Chi nhánh Đống Đa
          </Text>
        </div>

        <Space size={12}>
          <Tag color="blue" style={{ padding: '4px 12px', fontSize: '13px', borderRadius: '6px' }}>
            2 Lượt Giao xe (Pickup)
          </Tag>
          <Tag color="purple" style={{ padding: '4px 12px', fontSize: '13px', borderRadius: '6px' }}>
            2 Lượt Nhận xe (Return)
          </Tag>
        </Space>
      </div>

      {loading ? (
        <TableSkeleton rows={4} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {scheduleItems.map((item, index) => {
            const isPickup = item.type === 'PICKUP';

            return (
              <Card
                key={index}
                style={{
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                  overflow: 'hidden'
                }}
                bodyStyle={{ padding: '20px 24px' }}
              >
                <Row gutter={[20, 16]} align="middle">
                  {/* Time badge */}
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
                      <Tag color={isPickup ? 'blue' : 'purple'} style={{ margin: '4px 0 0 0', fontSize: '10px' }}>
                        {isPickup ? 'BÀN GIAO' : 'NHẬN TRẢ'}
                      </Tag>
                    </div>
                  </Col>

                  {/* Vehicle & Customer Info */}
                  <Col xs={24} sm={14}>
                    <div style={{ marginBottom: '8px' }}>
                      <Space size={8} align="center">
                        <Text strong style={{ fontSize: '16px', color: '#0f172a' }}>{item.vehicle}</Text>
                        <Tag color="geekblue" style={{ borderRadius: '4px' }}>{item.plate}</Tag>
                        <Text type="secondary" style={{ fontSize: '12px' }}>({item.bookingId})</Text>
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
                          <CheckCircleOutlined style={{ color: '#16a34a' }} />
                          <Text style={{ color: '#16a34a' }}>{item.docStatus}</Text>
                        </div>
                      </Col>
                    </Row>
                  </Col>

                  {/* Action Button */}
                  <Col xs={24} sm={6} style={{ textAlign: 'right' }}>
                    {isPickup ? (
                      <Button
                        type="primary"
                        icon={<ExportOutlined />}
                        onClick={() => navigate(`/manager/pickup/${item.bookingId}`)}
                        style={{ borderRadius: '8px', background: '#2563eb', borderColor: '#2563eb', fontWeight: 600 }}
                      >
                        Bắt đầu Bàn giao
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        icon={<ImportOutlined />}
                        onClick={() => navigate(`/manager/return/${item.bookingId}`)}
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
