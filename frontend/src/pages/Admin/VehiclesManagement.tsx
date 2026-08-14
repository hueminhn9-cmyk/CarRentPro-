import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Typography, Space, Popconfirm, message, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ToolOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { Vehicle } from '@/services/mockData';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export const VehiclesManagement: React.FC = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = () => {
    setLoading(true);
    api.vehicles.getAll().then(res => {
      setVehicles(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.vehicles.delete(id);
      message.success('Xóa xe thành công!');
      fetchVehicles();
    } catch (e) {
      message.error('Không thể xóa xe lúc này!');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price);
  };

  const columns = [
    {
      title: 'Ảnh xe',
      dataIndex: 'image',
      key: 'image',
      render: (imgUrl: string, record: Vehicle) => (
        <Image 
          src={imgUrl} 
          alt={record.name} 
          width={80} 
          height={50}
          style={{ objectFit: 'cover', borderRadius: '4px' }} 
        />
      )
    },
    {
      title: 'Tên xe',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>
    },
    {
      title: 'Biển kiểm soát',
      dataIndex: 'licensePlate',
      key: 'licensePlate',
    },
    {
      title: 'Phân loại',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Giá thuê / ngày',
      dataIndex: 'pricePerDay',
      key: 'pricePerDay',
      render: (price: number) => <Text strong style={{ color: '#0053d0' }}>{formatPrice(price)}</Text>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: any) => <StatusBadge status={status} />
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record: Vehicle) => (
        <Space size={12}>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => navigate(`/admin/vehicles/edit/${record.id}`)}
          >
            Sửa
          </Button>
          
          <Popconfirm
            title="Xóa phương tiện này?"
            description="Bạn có chắc chắn muốn xóa xe này khỏi hạm đội không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa xe"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Quản lý phương tiện</Title>
          <Text type="secondary">Danh sách tất cả các xe trong hạm đội AutoRent.</Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => navigate('/admin/vehicles/new')}
          style={{ borderRadius: '6px' }}
        >
          Thêm xe mới
        </Button>
      </div>

      <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Table 
          loading={loading}
          dataSource={vehicles} 
          columns={columns} 
          rowKey="id"
        />
      </Card>
    </div>
  );
};
