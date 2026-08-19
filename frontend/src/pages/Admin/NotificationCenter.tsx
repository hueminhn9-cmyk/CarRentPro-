import React, { useState } from 'react';
import { Card, Tabs, List, Typography, Badge, Button, Space, Tag, message } from 'antd';
import {
  BellOutlined,
  CalendarOutlined,
  DollarOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  SafetyCertificateOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export const NotificationCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState<any[]>([
    {
      id: 'NTF-01',
      type: 'VERIFICATION',
      title: 'Hồ sơ GPLX mới chờ xác minh',
      content: 'Khách hàng Nguyễn Văn Hùng đã gửi ảnh CCCD và GPLX hạng B2.',
      time: '10 phút trước',
      read: false
    },
    {
      id: 'NTF-02',
      type: 'BOOKING',
      title: 'Đơn thuê xe mới #BK-2026-081',
      content: 'Khách hàng đặt xe BMW 320i (4 ngày) từ ngày 20/08 đến 24/08.',
      time: '25 phút trước',
      read: false
    },
    {
      id: 'NTF-03',
      type: 'PAYMENT',
      title: 'Nhận thành công tiền cọc 15.000.000đ',
      content: 'Giao dịch VNPay thành công cho đơn thuê #BK-2026-081.',
      time: '30 phút trước',
      read: true
    },
    {
      id: 'NTF-04',
      type: 'SYSTEM',
      title: 'Nhắc nhở bảo dưỡng xe định kỳ',
      content: 'Xe VinFast Lux A2.0 (30F-123.45) đã vượt 40,000 km cần lên lịch bảo dưỡng.',
      time: '2 giờ trước',
      read: true
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    message.success('Đã đánh dấu tất cả thông báo là đã đọc');
  };

  const clearAll = () => {
    setNotifications([]);
    message.info('Đã xóa tất cả thông báo');
  };

  const getFilteredList = () => {
    if (activeTab === 'unread') return notifications.filter(n => !n.read);
    if (activeTab === 'booking') return notifications.filter(n => n.type === 'BOOKING');
    if (activeTab === 'payment') return notifications.filter(n => n.type === 'PAYMENT');
    if (activeTab === 'system') return notifications.filter(n => n.type === 'SYSTEM' || n.type === 'VERIFICATION');
    return notifications;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'BOOKING':
        return <CalendarOutlined style={{ color: '#2563eb', fontSize: '18px' }} />;
      case 'PAYMENT':
        return <DollarOutlined style={{ color: '#16a34a', fontSize: '18px' }} />;
      case 'VERIFICATION':
        return <SafetyCertificateOutlined style={{ color: '#d97706', fontSize: '18px' }} />;
      default:
        return <BellOutlined style={{ color: '#64748b', fontSize: '18px' }} />;
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <Title level={4} style={{ margin: 0, fontWeight: 800 }}>Trung tâm Thông báo (Notification Center)</Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>Cập nhật các sự kiện quan trọng về đơn hàng, thanh toán và kiểm định hệ thống</Text>
        </div>

        <Space>
          <Button icon={<CheckCircleOutlined />} onClick={markAllAsRead}>
            Đánh dấu đã đọc tất cả
          </Button>
          <Button icon={<DeleteOutlined />} danger onClick={clearAll}>
            Xóa tất cả
          </Button>
        </Space>
      </div>

      <Card style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'all', label: `Tất cả (${notifications.length})` },
            { key: 'unread', label: `Chưa đọc (${notifications.filter(n => !n.read).length})` },
            { key: 'booking', label: 'Đơn thuê' },
            { key: 'payment', label: 'Thanh toán' },
            { key: 'system', label: 'Hệ thống & GPLX' }
          ]}
        />

        <List
          itemLayout="horizontal"
          dataSource={getFilteredList()}
          renderItem={(item) => (
            <List.Item
              style={{
                padding: '16px 20px',
                borderRadius: '8px',
                marginBottom: '8px',
                background: item.read ? '#ffffff' : '#f0f7ff',
                border: `1px solid ${item.read ? '#f1f5f9' : '#bfdbfe'}`
              }}
            >
              <List.Item.Meta
                avatar={
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: item.read ? '#f1f5f9' : '#eff6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getIcon(item.type)}
                  </div>
                }
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong style={{ fontSize: '14px', color: item.read ? '#0f172a' : '#1e3a8a' }}>
                      {item.title}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>{item.time}</Text>
                  </div>
                }
                description={
                  <div style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>
                    {item.content}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};
