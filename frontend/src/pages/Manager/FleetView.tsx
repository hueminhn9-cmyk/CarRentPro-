import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Tag, Space, Button, message } from 'antd';
import {
  CarOutlined,
  ToolOutlined,
  CalendarOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';
import { StatusBadge } from '@/components/common/StatusBadge';
import { FilterBar } from '@/components/common/FilterBar';
import { TableSkeleton } from '@/components/common/LoadingSkeleton';

const { Title, Text } = Typography;

export const FleetView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res: any = await api.vehicles.getAll({ limit: 50 });
      const list = Array.isArray(res) ? res : (res?.items || res?.data || []);
      setVehicles(list);
    } catch (err) {
      message.error('Không thể tải danh sách đội xe.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter(v => {
    const matchSearch = search ? (
      (v.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (v.licensePlate || '').toLowerCase().includes(search.toLowerCase()) ||
      (v.brand || '').toLowerCase().includes(search.toLowerCase())
    ) : true;

    const matchStatus = statusFilter ? v.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const columns = [
    {
      title: 'Xe & Hình ảnh',
      key: 'name',
      render: (_: any, r: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src={r.image || r.imageUrl || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&auto=format&fit=crop&q=60"} 
            alt={r.name} 
            style={{ width: '64px', height: '44px', objectFit: 'cover', borderRadius: '6px' }}
          />
          <div>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>{r.name}</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Hãng: {r.brand || 'VinFast'} • Đời 2024</div>
          </div>
        </div>
      )
    },
    {
      title: 'Biển kiểm soát',
      dataIndex: 'licensePlate',
      key: 'licensePlate',
      render: (plate: string) => <Tag color="geekblue" style={{ fontWeight: 700 }}>{plate || '30A-999.88'}</Tag>
    },
    {
      title: 'Trạng thái đội xe',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusBadge status={status} />
    },
    {
      title: 'Odometer (Km)',
      dataIndex: 'mileage',
      key: 'mileage',
      render: (m: number) => <span>{(m || 24500).toLocaleString()} km</span>
    },
    {
      title: 'Đơn giá thuê/ngày',
      dataIndex: 'pricePerDay',
      key: 'pricePerDay',
      render: (p: number) => (
        <Text strong style={{ color: '#0f172a' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 1500000)}
        </Text>
      )
    },
    {
      title: 'Chi nhánh hiện tại',
      key: 'location',
      render: () => <span>Chi nhánh Hà Nội</span>
    }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Title level={4} style={{ margin: 0, fontWeight: 800 }}>
          Tình trạng Đội xe Chi nhánh (Branch Fleet View)
        </Title>
        <Text type="secondary" style={{ fontSize: '13px' }}>
          Kiểm tra tình trạng sẵn sàng, bảo dưỡng và số kilomet của từng phương tiện
        </Text>
      </div>

      <FilterBar
        searchPlaceholder="Tìm kiếm theo tên xe, biển số, thương hiệu..."
        searchValue={search}
        onSearchChange={setSearch}
        statusOptions={[
          { label: 'Tất cả trạng thái', value: '' },
          { label: 'Có sẵn (AVAILABLE)', value: 'AVAILABLE' },
          { label: 'Đang cho thuê (RENTED)', value: 'RENTED' },
          { label: 'Đang bảo dưỡng (MAINTENANCE)', value: 'MAINTENANCE' }
        ]}
        statusValue={statusFilter}
        onStatusChange={setStatusFilter}
        onReset={() => { setSearch(''); setStatusFilter(undefined); }}
      />

      {loading ? (
        <TableSkeleton rows={6} />
      ) : (
        <Card style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} styles={{ body: { padding: 0 } }}>
          <Table
            dataSource={filteredVehicles}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      )}
    </div>
  );
};
