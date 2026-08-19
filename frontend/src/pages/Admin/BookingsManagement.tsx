import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Typography, Space, Tag, message, Segmented, Badge } from 'antd';
import {
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  AppstoreOutlined,
  BarsOutlined,
  UserOutlined,
  CalendarOutlined,
  CarOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';
import { StatusBadge } from '@/components/common/StatusBadge';
import { FilterBar } from '@/components/common/FilterBar';
import { TableSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export const BookingsManagement: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const fetchBookings = () => {
    setLoading(true);
    api.bookings.getAll({ limit: 100 }).then((res: any) => {
      const list = Array.isArray(res) ? res : (res?.items || res?.data || []);
      setBookings(list);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await api.bookings.updateStatus(id, 'CONFIRMED');
      message.success('Đã phê duyệt đơn hàng & chuẩn bị bàn giao!');
      fetchBookings();
    } catch (e) {
      message.error('Thực hiện thất bại!');
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await api.bookings.updateStatus(id, 'CANCELLED');
      message.success('Đã hủy đơn thuê và hoàn cọc!');
      fetchBookings();
    } catch (e) {
      message.error('Thực hiện thất bại!');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price || 0);
  };

  const filtered = bookings.filter(b => {
    const matchSearch = search ? (
      (b.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.customerName || b.customer?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.vehicleName || b.vehicle?.name || '').toLowerCase().includes(search.toLowerCase())
    ) : true;
    const matchStatus = statusFilter ? b.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const kanbanColumns = [
    { key: 'PENDING', title: 'Chờ duyệt', color: '#f59e0b', bg: '#fffbeb' },
    { key: 'CONFIRMED', title: 'Đã duyệt', color: '#2563eb', bg: '#eff6ff' },
    { key: 'ACTIVE', title: 'Đang thuê', color: '#16a34a', bg: '#f0fdf4' },
    { key: 'COMPLETED', title: 'Hoàn thành', color: '#64748b', bg: '#f8fafc' },
    { key: 'CANCELLED', title: 'Đã hủy', color: '#dc2626', bg: '#fef2f2' }
  ];

  const columns = [
    {
      title: 'Mã đơn thuê',
      dataIndex: 'id',
      key: 'id',
      render: (id: string, r: any) => (
        <Text strong style={{ color: '#1e3a8a' }}>
          #{r.bookingCode || (id ? id.slice(0, 8) : 'BK-001')}
        </Text>
      )
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (_: any, r: any) => (
        <div>
          <div style={{ fontWeight: 600 }}>{r.customerName || r.customer?.name || 'Khách vãng lai'}</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>{r.customerPhone || r.customer?.phone || '0901234567'}</div>
        </div>
      )
    },
    {
      title: 'Dòng xe thuê',
      key: 'vehicle',
      render: (_: any, r: any) => (
        <div>
          <div style={{ fontWeight: 600 }}>{r.vehicleName || r.vehicle?.name || 'VinFast VF8'}</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>{r.vehicle?.licensePlate || '30A-999.88'}</div>
        </div>
      )
    },
    {
      title: 'Giá trị đơn',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => <Text strong style={{ color: '#0f172a' }}>{formatPrice(amount)}</Text>
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
      render: (_, record: any) => (
        <Space size={8}>
          <Button 
            type="link" 
            size="small"
            icon={<EyeOutlined />} 
            onClick={() => navigate(`/admin/bookings/${record.id}`)}
          >
            Chi tiết
          </Button>

          {(record.status === 'PENDING' || record.status === 'Chờ xác nhận') && (
            <>
              <Button 
                type="primary" 
                size="small" 
                onClick={() => handleApprove(record.id)}
                style={{ borderRadius: '6px', background: '#16a34a', borderColor: '#16a34a' }}
              >
                Duyệt
              </Button>
              <Button 
                danger 
                size="small" 
                onClick={() => handleCancel(record.id)}
                style={{ borderRadius: '6px' }}
              >
                Hủy
              </Button>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <Title level={4} style={{ margin: 0, fontWeight: 800 }}>Quản lý Đơn thuê & Giám sát Vận hành</Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>Phê duyệt đơn đặt xe, theo dõi thanh toán và kiểm soát vòng đời hợp đồng</Text>
        </div>

        <Segmented
          value={viewMode}
          onChange={(val) => setViewMode(val as 'table' | 'kanban')}
          options={[
            { label: 'Danh sách Table', value: 'table', icon: <BarsOutlined /> },
            { label: 'Kanban Board', value: 'kanban', icon: <AppstoreOutlined /> }
          ]}
          style={{ background: '#e2e8f0', padding: '3px', borderRadius: '8px' }}
        />
      </div>

      <FilterBar
        searchPlaceholder="Tìm theo mã đơn, tên khách hàng, tên xe..."
        searchValue={search}
        onSearchChange={setSearch}
        statusOptions={[
          { label: 'Tất cả trạng thái', value: '' },
          { label: 'Chờ duyệt (PENDING)', value: 'PENDING' },
          { label: 'Đã duyệt (CONFIRMED)', value: 'CONFIRMED' },
          { label: 'Đang thuê (ACTIVE)', value: 'ACTIVE' },
          { label: 'Hoàn thành (COMPLETED)', value: 'COMPLETED' },
          { label: 'Đã hủy (CANCELLED)', value: 'CANCELLED' }
        ]}
        statusValue={statusFilter}
        onStatusChange={setStatusFilter}
        onReset={() => { setSearch(''); setStatusFilter(undefined); }}
      />

      {loading ? (
        <TableSkeleton rows={6} />
      ) : filtered.length === 0 ? (
        <EmptyState title="Không có đơn thuê phù hợp" description="Thử thay đổi bộ lọc tìm kiếm." />
      ) : viewMode === 'table' ? (
        <Card style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} bodyStyle={{ padding: 0 }}>
          <Table 
            dataSource={filtered} 
            columns={columns} 
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      ) : (
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
          {kanbanColumns.map(col => {
            const items = filtered.filter(b => b.status === col.key || (col.key === 'PENDING' && b.status === 'Chờ xác nhận'));

            return (
              <div 
                key={col.key} 
                style={{
                  flex: '0 0 280px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  maxHeight: '75vh',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{
                  padding: '12px 16px',
                  background: col.bg,
                  borderTopLeftRadius: '12px',
                  borderTopRightRadius: '12px',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontWeight: 700, fontSize: '13px' }}>{col.title}</span>
                  <Badge count={items.length} style={{ backgroundColor: col.color }} />
                </div>

                <div style={{ padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {items.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8', fontSize: '12px' }}>Trống</div>
                  ) : (
                    items.map(item => (
                      <Card
                        key={item.id}
                        hoverable
                        size="small"
                        onClick={() => navigate(`/admin/bookings/${item.id}`)}
                        style={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      >
                        <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '12px', marginBottom: '4px' }}>
                          #{item.bookingCode || item.id.slice(0, 8)}
                        </div>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.vehicleName || item.vehicle?.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', margin: '4px 0' }}>
                          <UserOutlined style={{ marginRight: '4px' }} />
                          {item.customerName || item.customer?.name}
                        </div>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '13px', marginTop: '6px' }}>
                          {formatPrice(item.totalAmount)}
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
