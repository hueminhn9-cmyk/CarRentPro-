import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Rate, Tag, Button, Space, message, Popconfirm } from 'antd';
import {
  StarOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  UserOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';
import { TableSkeleton } from '@/components/common/LoadingSkeleton';

const { Title, Text } = Typography;

export const Reviews: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const list: any[] = await api.reviews.getAll();
      const formatted = (list || []).map(r => ({
        id: String(r.id),
        customerName: r.users?.full_name || 'Khách hàng',
        vehicleName: r.vehicles?.name ? `${r.vehicles.name} (${r.vehicles.license_plate})` : 'Xe AutoRent',
        rating: r.rating,
        comment: r.content || r.comment || '',
        date: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : 'N/A',
        status: r.status || 'APPROVED'
      }));
      setReviews(formatted);
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Không thể tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await api.reviews.updateStatus(id, 'APPROVED');
      message.success('Đã duyệt hiển thị đánh giá này trên website!');
      fetchReviews();
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Lỗi khi duyệt đánh giá');
    }
  };

  const handleHide = async (id: string) => {
    try {
      await api.reviews.updateStatus(id, 'HIDDEN');
      message.warning('Đã ẩn đánh giá khỏi trang chủ.');
      fetchReviews();
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Lỗi khi ẩn đánh giá');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.reviews.delete(id);
      message.success('Đã xóa đánh giá thành công khỏi hệ thống!');
      fetchReviews();
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Lỗi khi xóa đánh giá');
    }
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
              Duyệt hiển thị
            </Button>
          )}
          {r.status !== 'HIDDEN' && (
            <Button 
              size="small" 
              icon={<CloseOutlined />} 
              onClick={() => handleHide(r.id)}
              style={{ borderRadius: '6px' }}
            >
              Ẩn đánh giá
            </Button>
          )}
          <Popconfirm
            title="Xóa đánh giá này?"
            description="Bạn có chắc chắn muốn xóa vĩnh viễn đánh giá này không?"
            onConfirm={() => handleDelete(r.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button 
              size="small" 
              danger 
              icon={<DeleteOutlined />} 
              style={{ borderRadius: '6px' }}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Title level={4} style={{ margin: 0, fontWeight: 800 }}>Kiểm duyệt Đánh giá Khách hàng</Title>
        <Text type="secondary" style={{ fontSize: '13px' }}>Quản lý phản hồi, xếp hạng sao của người dùng để nâng cao chất lượng dịch vụ</Text>
      </div>

      {loading ? (
        <TableSkeleton rows={6} />
      ) : (
        <Card style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} styles={{ body: { padding: 0 } }}>
          <Table dataSource={reviews} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
        </Card>
      )}
    </div>
  );
};
