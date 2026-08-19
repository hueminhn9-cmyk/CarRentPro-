import React, { useEffect, useState } from 'react';
import { Card, List, Typography, Button, Badge, Space, message, Spin, Empty } from 'antd';
import { BellOutlined, CheckCircleOutlined, InfoCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { api } from '@/services/api';

const { Title, Text } = Typography;

export const CustomerNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    setLoading(true);
    api.notifications.getAll()
      .then(res => setNotifications(res))
      .catch(err => {
        console.error('Failed to load notifications:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.notifications.markAllAsRead();
      message.success('Đã đánh dấu tất cả thông báo là đã đọc!');
      fetchNotifications();
    } catch (e) {
      message.error('Thao tác thất bại!');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.notifications.delete(id);
      message.success('Đã xóa thông báo!');
      setNotifications(prev => prev.filter(item => item.id !== id));
    } catch (e) {
      message.error('Không thể xóa thông báo!');
    }
  };

  const getIcon = (type: string) => {
    if (type === 'success') return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} />;
    if (type === 'warning') return <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: '20px' }} />;
    return <InfoCircleOutlined style={{ color: '#1677ff', fontSize: '20px' }} />;
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Thông báo của tôi</Title>
          <Text type="secondary">Cập nhật những tin tức mới nhất về hành trình thuê xe và trạng thái hợp đồng.</Text>
        </div>
        <Button type="link" onClick={handleMarkAllRead}>Đánh dấu đã đọc tất cả</Button>
      </div>

      <Card variant="borderless" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        {loading ? (
          <div className="text-center py-10">
            <Spin size="large" tip="Đang tải thông báo...">
              <div className="pt-8" />
            </Spin>
          </div>
        ) : notifications.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                actions={[<Button type="text" danger style={{ fontSize: '12px' }} onClick={() => handleDelete(item.id)}>Xóa</Button>]}
                style={{ backgroundColor: item.read ? '#ffffff' : '#f9f9ff', padding: '16px' }}
              >
                <List.Item.Meta
                  avatar={
                    <Space size={12}>
                      <Badge dot={!item.read}>
                        {getIcon(item.type)}
                      </Badge>
                    </Space>
                  }
                  title={
                    <Space>
                      <Text strong={!item.read}>{item.title}</Text>
                      <Text type="secondary" style={{ fontSize: '11px' }}>
                        {dayjs(item.time).format('DD/MM/YYYY HH:mm')}
                      </Text>
                    </Space>
                  }
                  description={item.desc}
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="Bạn chưa có thông báo nào." style={{ padding: '30px 0' }} />
        )}
      </Card>
    </div>
  );
};
