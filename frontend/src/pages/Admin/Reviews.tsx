import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Rate, Tag, Button, Space, message, Popconfirm } from 'antd';
import {
  StarOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  UserOutlined
} from '@ant-design/icons';
import { FilterBar } from '@/components/common/FilterBar';
import { TableSkeleton } from '@/components/common/LoadingSkeleton';

const { Title, Text } = Typography;

export const Reviews: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);
  const [reviews, setReviews] = useState<any[]>([
    {
      id: 'REV-001',
      customerName: 'Nguyễn Văn Hùng',
      vehicleName: 'BMW 320i Sport-Line',
      rating: 5,
      comment: 'Xe chạy rất đầm và êm ái, nội thất sạch bóng mùi hương dễ chịu. Thủ tục bàn giao rất nhanh chóng!',
      date: '2026-08-15',
      status: 'APPROVED'
    },
    {
      id: 'REV-002',
      customerName: 'Trần Thị Thu Trang',
      vehicleName: 'VinFast VF8 Plus',
      rating: 4,
      comment: 'Xe điện tăng tốc mượt, trạm sạc chi nhánh hỗ trợ sạc 100% trước khi giao xe. Sẽ tiếp tục ủng hộ!',
      date: '2026-08-14',
      status: 'APPROVED'
    },
    {
      id: 'REV-003',
      customerName: 'Lê Hoàng Long',
      vehicleName: 'Toyota Camry 2.5Q',
      rating: 2,
      comment: 'Xe giao trễ 15 phút do nhân viên rửa xe chưa kịp, mong gara cải thiện tiến độ chuẩn giờ hơn.',
      date: '2026-08-12',
      status: 'PENDING'
    }
  ]);

  const handleApprove = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
    message.success('Đã duyệt hiển thị đánh giá này trên website!');
  };

  const handleHide = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'HIDDEN' } : r));
    message.warning('Đã ẩn đánh giá khỏi trang chủ.');
  };

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserOutlined style={{ color: '#64748b' }} />
          <Text strong>{name}</Text>
        </div>
      )
    },
    {
      title: 'Xe thuê',
      dataIndex: 'vehicleName',
      key: 'vehicleName',
      render: (name: string) => <Tag color="geekblue">{name}</Tag>
    },
    {
      title: 'Số sao đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (stars: number) => <Rate disabled defaultValue={stars} style={{ fontSize: '13px' }} />
    },
    {
      title: 'Nội dung nhận xét',
      dataIndex: 'comment',
      key: 'comment',
      render: (text: string) => <Text style={{ fontSize: '13px', color: '#334155' }}>{text}</Text>
    },
    {
      title: 'Ngày đánh giá',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        if (status === 'APPROVED') return <Tag color="success">Đã duyệt hiển thị</Tag>;
        if (status === 'HIDDEN') return <Tag color="default">Đã ẩn</Tag>;
        return <Tag color="warning">Chờ kiểm duyệt</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, r: any) => (
        <Space size={8}>
          {r.status !== 'APPROVED' && (
            <Button 
              type="primary" 
              size="small" 
              icon={<CheckOutlined />} 
              onClick={() => handleApprove(r.id)}
              style={{ borderRadius: '6px', background: '#16a34a', borderColor: '#16a34a' }}
            >
              Duyệt
            </Button>
          )}
          {r.status !== 'HIDDEN' && (
            <Button 
              size="small" 
              icon={<CloseOutlined />} 
              onClick={() => handleHide(r.id)}
              style={{ borderRadius: '6px' }}
            >
              Ẩn
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Title level={4} style={{ margin: 0, fontWeight: 800 }}>Kiểm duyệt Đánh giá Khách hàng (Reviews Moderation)</Title>
        <Text type="secondary" style={{ fontSize: '13px' }}>Quản lý phản hồi, xếp hạng sao của người dùng để nâng cao chất lượng dịch vụ</Text>
      </div>

      <Card style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} styles={{ body: { padding: 0 } }}>
        <Table dataSource={reviews} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};
