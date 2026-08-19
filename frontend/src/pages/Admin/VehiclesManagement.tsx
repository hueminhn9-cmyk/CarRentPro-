import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Typography, Space, Tag, Segmented, Row, Col, message, Popconfirm } from 'antd';
import {
  CarOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  BarsOutlined,
  ToolOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';
import { StatusBadge } from '@/components/common/StatusBadge';
import { FilterBar } from '@/components/common/FilterBar';
import { CardGridSkeleton, TableSkeleton } from '@/components/common/LoadingSkeleton';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export const VehiclesManagement: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const fetchVehicles = () => {
    setLoading(true);
    api.vehicles.getAll({ limit: 50 }).then((res: any) => {
      const list = Array.isArray(res) ? res : (res?.items || res?.data || []);
      setVehicles(list);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.vehicles.delete(id);
      message.success('Đã xóa phương tiện khỏi đội xe!');
      fetchVehicles();
    } catch (e) {
      message.error('Không thể xóa xe đang trong hợp đồng thuê!');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price || 0);
  };

  const filtered = vehicles.filter(v => {
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
      key: 'vehicle',
      render: (_: any, r: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src={r.imageUrl || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&auto=format&fit=crop&q=60"} 
            alt={r.name} 
            style={{ width: '64px', height: '44px', objectFit: 'cover', borderRadius: '6px' }}
          />
          <div>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>{r.name}</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Hãng: {r.brand || 'VinFast'} • {r.transmission || 'Tự động'}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Biển số',
      dataIndex: 'licensePlate',
      key: 'licensePlate',
      render: (plate: string) => <Tag color="geekblue" style={{ fontWeight: 700 }}>{plate || '30A-999.88'}</Tag>
    },
    {
      title: 'Phân khúc',
      dataIndex: 'category',
      key: 'category',
      render: (cat: string) => <span>{cat || 'SUV 7 chỗ'}</span>
    },
    {
      title: 'Giá thuê / Ngày',
      dataIndex: 'pricePerDay',
      key: 'pricePerDay',
      render: (price: number) => <Text strong style={{ color: '#0f172a' }}>{formatPrice(price)}</Text>
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
      render: (_: any, r: any) => (
        <Space size={8}>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => navigate(`/admin/vehicles/${r.id}/edit`)}
          />
          <Popconfirm title="Xóa xe này khỏi hệ thống?" onConfirm={() => handleDelete(r.id)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <Title level={4} style={{ margin: 0, fontWeight: 800 }}>Chiến lược & Quản lý Đội xe (Fleet Strategy)</Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>Định cấu hình giá thuê, cập nhật thông số và theo dõi trạng thái phương tiện</Text>
        </div>

        <Space size={12}>
          <Segmented
            value={viewMode}
            onChange={(val) => setViewMode(val as 'table' | 'card')}
            options={[
              { label: 'Card View', value: 'card', icon: <AppstoreOutlined /> },
              { label: 'Table View', value: 'table', icon: <BarsOutlined /> }
            ]}
            style={{ background: '#e2e8f0', padding: '3px', borderRadius: '8px' }}
          />

          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => navigate('/admin/vehicles/new')}
            style={{ borderRadius: '8px', background: '#0f172a', borderColor: '#0f172a', fontWeight: 600 }}
          >
            Thêm xe mới
          </Button>
        </Space>
      </div>

      <FilterBar
        searchPlaceholder="Tìm theo tên xe, biển số, phân khúc..."
        searchValue={search}
        onSearchChange={setSearch}
        statusOptions={[
          { label: 'Tất cả trạng thái', value: '' },
          { label: 'Có sẵn (AVAILABLE)', value: 'AVAILABLE' },
          { label: 'Đang thuê (RENTED)', value: 'RENTED' },
          { label: 'Bảo dưỡng (MAINTENANCE)', value: 'MAINTENANCE' }
        ]}
        statusValue={statusFilter}
        onStatusChange={setStatusFilter}
        onReset={() => { setSearch(''); setStatusFilter(undefined); }}
      />

      {loading ? (
        viewMode === 'card' ? <CardGridSkeleton count={6} /> : <TableSkeleton rows={6} />
      ) : viewMode === 'table' ? (
        <Card style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} bodyStyle={{ padding: 0 }}>
          <Table dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
        </Card>
      ) : (
        <Row gutter={[20, 20]}>
          {filtered.map(v => (
            <Col xs={24} sm={12} md={8} lg={6} key={v.id}>
              <Card
                hoverable
                style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}
                cover={
                  <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                    <img 
                      src={v.imageUrl || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=60"} 
                      alt={v.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                      <StatusBadge status={v.status || 'AVAILABLE'} />
                    </div>
                  </div>
                }
                bodyStyle={{ padding: '16px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>{v.name}</div>
                    <Tag color="geekblue" style={{ marginTop: '4px' }}>{v.licensePlate || '30A-999.88'}</Tag>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>GIÁ THUÊ/NGÀY</div>
                    <div style={{ fontWeight: 800, fontSize: '15px', color: '#1e3a8a' }}>{formatPrice(v.pricePerDay)}</div>
                  </div>
                  <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => navigate(`/admin/vehicles/${v.id}/edit`)}>
                      Sửa
                    </Button>
                  </Space>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};
