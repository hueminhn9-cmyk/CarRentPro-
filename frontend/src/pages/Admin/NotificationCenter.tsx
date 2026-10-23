import React, { useState, useEffect } from 'react';
import { Card, Tabs, List, Typography, Badge, Button, Space, Tag, Popconfirm, message, Skeleton, Empty } from 'antd';
import {
  BellOutlined,
  CalendarOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  SafetyCertificateOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CheckOutlined,
  InfoCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

export const NotificationCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await api.notifications.getAll({ limit: 100 });
      setNotifications(data);
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Không thể tải danh sách thông báo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      await api.notifications.markAllAsRead();
      message.success('Đã đánh dấu tất cả thông báo là đã đọc');
      fetchNotifications();
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const markAsRead = async (id: string | number) => {
    try {
      await api.notifications.markAsRead(id);
      message.success('Đã đánh dấu thông báo là đã đọc');
      fetchNotifications();
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await api.notifications.delete(id);
      message.success('Đã xóa thông báo');
      fetchNotifications();
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Xóa thông báo thất bại');
    }
  };

  const getFilteredList = () => {
    return notifications.filter(n => {
      const isRead = n.is_read ?? n.read;
      const type = (n.type || '').toUpperCase();

      if (activeTab === 'unread') return !isRead;
      if (activeTab === 'booking') return type === 'BOOKING';
      if (activeTab === 'payment') return type === 'PAYMENT';
      if (activeTab === 'system') return type === 'SYSTEM' || type === 'VERIFICATION';
      return true;
    });
  };

  const getIcon = (type: string = '') => {
    const t = type.toUpperCase();
    switch (t) {
      case 'BOOKING':
        return <CalendarOutlined style={{ color: '#2563eb', fontSize: '18px' }} />;
      case 'PAYMENT':
        return <DollarOutlined style={{ color: '#16a34a', fontSize: '18px' }} />;
      case 'VERIFICATION':
        return <SafetyCertificateOutlined style={{ color: '#d97706', fontSize: '18px' }} />;
      case 'WARNING':
        return <WarningOutlined style={{ color: '#eab308', fontSize: '18px' }} />;
      case 'SUCCESS':
        return <CheckCircleOutlined style={{ color: '#10b981', fontSize: '18px' }} />;
      case 'INFO':
        return <InfoCircleOutlined style={{ color: '#06b6d4', fontSize: '18px' }} />;
      default:
        return <BellOutlined style={{ color: '#64748b', fontSize: '18px' }} />;
    }
  };

  const filteredList = getFilteredList();
  const unreadCount = notifications.filter(n => !(n.is_read ?? n.read)).length;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <Title level={4} style={{ margin: 0, fontWeight: 800 }}>Trung tâm Thông báo</Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>Cập nhật các sự kiện quan trọng về đơn hàng, thanh toán và kiểm định hệ thống</Text>
        </div>

        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchNotifications} loading={loading}>
            Làm mới
          </Button>
          <Button icon={<CheckCircleOutlined />} onClick={markAllAsRead} disabled={unreadCount === 0}>
            Đánh dấu đã đọc tất cả
          </Button>
        </Space>
      </div>

      <Card style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'all', label: `Tất cả (${notifications.length})` },
            { key: 'unread', label: `Chưa đọc (${unreadCount})` },
            { key: 'booking', label: 'Đơn thuê' },
            { key: 'payment', label: 'Thanh toán' },
            { key: 'system', label: 'Hệ thống & GPLX' }
          ]}
        />

        {loading ? (
          <div style={{ padding: '24px' }}>
            <Skeleton active avatar paragraph={{ rows: 2 }} />
            <Skeleton active avatar paragraph={{ rows: 2 }} style={{ marginTop: '20px' }} />
            <Skeleton active avatar paragraph={{ rows: 2 }} style={{ marginTop: '20px' }} />
          </div>
        ) : filteredList.length === 0 ? (
          <Empty description="Không có thông báo nào" style={{ padding: '40px 0' }} />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={filteredList}
            renderItem={(item) => {
              const isRead = item.is_read ?? item.read;
              const formattedTime = item.created_at ? dayjs(item.created_at).format('DD/MM/YYYY HH:mm') : item.time || '';

              return (
                <List.Item
                  style={{
                    padding: '16px 20px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    background: isRead ? '#ffffff' : '#f0f7ff',
                    border: `1px solid ${isRead ? '#f1f5f9' : '#bfdbfe'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  actions={[
                    !isRead && (
                      <Button
                        type="text"
                        size="small"
                        icon={<CheckOutlined />}
                        title="Đánh dấu đã đọc"
                        onClick={() => markAsRead(item.id)}
                        key="read"
                      />
                    ),
                    <Popconfirm
                      key="delete"
                      title="Xóa thông báo"
                      description="Bạn có chắc chắn muốn xóa thông báo này?"
                      onConfirm={() => handleDelete(item.id)}
                      okText="Xóa"
                      cancelText="Hủy"
                      okButtonProps={{ danger: true }}
                    >
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        title="Xóa thông báo"
                      />
                    </Popconfirm>
                  ].filter(Boolean)}
                >
                  <List.Item.Meta
                    avatar={
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: isRead ? '#f1f5f9' : '#eff6ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {getIcon(item.type)}
                      </div>
                    }
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Space>
                          <Text strong style={{ fontSize: '14px', color: isRead ? '#0f172a' : '#1e3a8a' }}>
                            {item.title}
                          </Text>
                          {item.users && (
                            <Tag color="cyan" style={{ fontSize: '11px', margin: 0 }}>
                              {item.users.full_name || item.users.email}
                            </Tag>
                          )}
                          {!isRead && <Badge status="processing" color="#2563eb" />}
                        </Space>
                        <Text type="secondary" style={{ fontSize: '11px' }}>{formattedTime}</Text>
                      </div>
                    }
                    description={
                      <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
                        {item.content}
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
          />
        )}
      </Card>
    </div>
  );
};
