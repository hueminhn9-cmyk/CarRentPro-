import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Typography, Space, message, Popconfirm } from 'antd';
import { ToolOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { MaintenanceRecord } from '@/services/mockData';
import { StatusBadge } from '@/components/common/StatusBadge';

const { Title, Text } = Typography;

export const MaintenanceManagement: React.FC = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = () => {
    setLoading(true);
    api.maintenance.getAll().then(res => {
      setRecords(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleComplete = async (id: string) => {
    try {
      await api.maintenance.complete(id);
      message.success('Bảo dưỡng phương tiện hoàn thành, xe đã sẵn sàng cho thuê!');
      fetchRecords();
    } catch (e) {
      message.error('Thao tác thất bại!');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price);
  };

  const columns = [
    {
      title: 'Mã số',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <Text strong>{id}</Text>
    },
    {
      title: 'Tên xe',
      dataIndex: 'vehicleName',
      key: 'vehicleName',
    },
    {
      title: 'Biển kiểm soát',
      dataIndex: 'licensePlate',
      key: 'licensePlate',
    },
    {
      title: 'Mô tả bảo dưỡng',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'Chi phí (VND)',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost: number) => <Text strong>{formatPrice(cost)}</Text>
    },
    {
      title: 'Thời gian',
      key: 'dates',
      render: (_, record: MaintenanceRecord) => (
        <span>{record.startDate} đến {record.endDate}</span>
      )
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record: MaintenanceRecord) => (
        <StatusBadge status={record.status === 'Đang bảo dưỡng' ? 'Bảo dưỡng' : 'Hoàn thành'} />
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record: MaintenanceRecord) => (
        <Space size={12}>
          {record.status === 'Đang bảo dưỡng' ? (
            <Popconfirm
              title="Xác nhận hoàn thành bảo dưỡng?"
              description="Bảo dưỡng đã hoàn thành và xe sẽ chuyển về trạng thái 'Có sẵn'?"
              onConfirm={() => handleComplete(record.id)}
              okText="Hoàn thành"
              cancelText="Hủy"
            >
              <Button 
                type="text" 
                icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              >
                Xong
              </Button>
            </Popconfirm>
          ) : (
            <Text type="secondary" style={{ fontSize: '13px' }}>Đã hoàn tất</Text>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Quản lý bảo dưỡng hạm đội</Title>
        <Text type="secondary">Theo dõi lịch bảo dưỡng sửa chữa định kỳ, chi phí kỹ thuật phương tiện.</Text>
      </div>

      <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Table 
          loading={loading}
          dataSource={records} 
          columns={columns} 
          rowKey="id"
        />
      </Card>
    </div>
  );
};
