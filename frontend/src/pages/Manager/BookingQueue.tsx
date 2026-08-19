import React, { useState, useEffect } from 'react';
import { Table, Card, Segmented, Button, Space, Typography, Tag, Modal, message, Popconfirm, Row, Col, Badge } from 'antd';
import {
  AppstoreOutlined,
  BarsOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  CarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  SwapOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { StatusBadge } from '@/components/common/StatusBadge';
import { FilterBar } from '@/components/common/FilterBar';
import { TableSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';

const { Title, Text } = Typography;

export const BookingQueue: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res: any = await api.bookings.getAll({ limit: 100 });
      const list = Array.isArray(res) ? res : (res?.items || res?.data || []);
      setBookings(list);
    } catch (err) {
      message.error('Không thể tải danh sách đơn thuê.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.bookings.updateStatus(id, newStatus);
      message.success(`Đã cập nhật trạng thái đơn #${id.slice(0, 8)} sang ${newStatus}`);
      fetchBookings();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Cập nhật trạng thái thất bại');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchSearch = search ? (
      (b.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.vehicle?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.customer?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.vehicle?.licensePlate || '').toLowerCase().includes(search.toLowerCase())
    ) : true;

    const matchStatus = statusFilter ? b.status === statusFilter : true;

    return matchSearch && matchStatus;
  });

  const kanbanColumns = [
    { key: 'PENDING', title: 'Chờ duyệt', color: '#f59e0b', bg: '#fffbeb' },
    { key: 'CONFIRMED', title: 'Đã duyệt', color: '#2563eb', bg: '#eff6ff' },
    { key: 'READY_FOR_PICKUP', title: 'Sẵn sàng giao', color: '#0891b2', bg: '#ecfeff' },
    { key: 'ACTIVE', title: 'Đang thuê', color: '#16a34a', bg: '#f0fdf4' },
    { key: 'WAITING_FOR_RETURN', title: 'Chờ nhận xe', color: '#9333ea', bg: '#faf5ff' },
    { key: 'COMPLETED', title: 'Hoàn thành', color: '#64748b', bg: '#f8fafc' }
  ];

  const renderKanban = () => {
    return (
      <div style={{
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
        paddingBottom: '16px',
        minHeight: '600px'
      }}>
        {kanbanColumns.map(col => {
          const colItems = filteredBookings.filter(b => b.status === col.key);

          return (
            <div 
              key={col.key} 
              style={{
                flex: '0 0 280px',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '75vh'
              }}
            >
              {/* Column Header */}
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: col.bg,
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }} />
                  <span style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>{col.title}</span>
                </div>
                <Badge count={colItems.length} style={{ backgroundColor: col.color }} />
              </div>

              {/* Column Cards */}
              <div style={{ padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                {colItems.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8', fontSize: '12px' }}>
                    Không có đơn
                  </div>
                ) : (
                  colItems.map(item => (
                    <Card
                      key={item.id}
                      hoverable
                      size="small"
                      style={{
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(15,23,42,0.04)'
                      }}
                      styles={{ body: { padding: '12px' } }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <Text strong style={{ fontSize: '12px', color: '#1e3a8a' }}>#{item.id.slice(0, 8)}</Text>
                        <Text type="secondary" style={{ fontSize: '11px' }}>
                          {item.totalDays || 3} ngày
                        </Text>
                      </div>

                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a', marginBottom: '2px' }}>
                        {item.vehicle?.name || 'VinFast VF8'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>
                        Biển số: {item.vehicle?.licensePlate || '30H-888.66'}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569', marginBottom: '10px' }}>
                        <UserOutlined style={{ fontSize: '11px', color: '#94a3b8' }} />
                        <span>{item.customer?.name || 'Nguyễn Văn An'}</span>
                      </div>

                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalAmount || 3500000)}
                        </span>

                        <Space size={4}>
                          {col.key === 'PENDING' && (
                            <>
                              <Button 
                                type="primary" 
                                size="small" 
                                icon={<CheckOutlined />} 
                                onClick={() => handleUpdateStatus(item.id, 'CONFIRMED')}
                                style={{ borderRadius: '4px', background: '#16a34a', borderColor: '#16a34a', fontSize: '11px', height: '24px', padding: '0 6px' }}
                              />
                              <Button 
                                danger 
                                size="small" 
                                icon={<CloseOutlined />} 
                                onClick={() => handleUpdateStatus(item.id, 'REJECTED')}
                                style={{ borderRadius: '4px', fontSize: '11px', height: '24px', padding: '0 6px' }}
                              />
                            </>
                          )}
                          {col.key === 'CONFIRMED' && (
                            <Button 
                              type="primary" 
                              size="small" 
                              onClick={() => handleUpdateStatus(item.id, 'READY_FOR_PICKUP')}
                              style={{ borderRadius: '4px', fontSize: '11px', height: '24px' }}
                            >
                              Sẵn sàng
                            </Button>
                          )}
                          {col.key === 'READY_FOR_PICKUP' && (
                            <Button 
                              type="primary" 
                              size="small" 
                              onClick={() => navigate(`/manager/pickup/${item.id}`)}
                              style={{ borderRadius: '4px', fontSize: '11px', height: '24px', background: '#2563eb' }}
                            >
                              Giao xe
                            </Button>
                          )}
                          {col.key === 'ACTIVE' && (
                            <Button 
                              size="small" 
                              onClick={() => navigate(`/manager/return/${item.id}`)}
                              style={{ borderRadius: '4px', fontSize: '11px', height: '24px', borderColor: '#9333ea', color: '#9333ea' }}
                            >
                              Nhận xe
                            </Button>
                          )}
                        </Space>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <Text strong style={{ color: '#1e3a8a' }}>#{id.slice(0, 8)}</Text>
    },
    {
      title: 'Xe thuê',
      key: 'vehicle',
      render: (_: any, r: any) => (
        <div>
          <div style={{ fontWeight: 600 }}>{r.vehicle?.name || 'Chưa gán xe'}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>{r.vehicle?.licensePlate || 'N/A'}</div>
        </div>
      )
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (_: any, r: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>{r.customer?.name || 'Khách vãng lai'}</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>{r.customer?.phone || '0901234567'}</div>
        </div>
      )
    },
    {
      title: 'Thời gian thuê',
      key: 'time',
      render: (_: any, r: any) => (
        <div style={{ fontSize: '12px' }}>
          <div>Nhận: {r.startDate ? new Date(r.startDate).toLocaleDateString('vi-VN') : '20/08/2026'}</div>
          <div>Trả: {r.endDate ? new Date(r.endDate).toLocaleDateString('vi-VN') : '24/08/2026'}</div>
        </div>
      )
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (val: number) => (
        <Text strong style={{ color: '#0f172a' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 3500000)}
        </Text>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => <StatusBadge status={st} />
    },
    {
      title: 'Thao tác xử lý',
      key: 'action',
      render: (_: any, r: any) => (
        <Space size={8}>
          {r.status === 'PENDING' && (
            <Button 
              type="primary" 
              size="small" 
              icon={<CheckOutlined />} 
              onClick={() => handleUpdateStatus(r.id, 'CONFIRMED')}
              style={{ borderRadius: '6px', background: '#16a34a', borderColor: '#16a34a' }}
            >
              Duyệt
            </Button>
          )}
          {r.status === 'READY_FOR_PICKUP' && (
            <Button 
              type="primary" 
              size="small" 
              onClick={() => navigate(`/manager/pickup/${r.id}`)}
              style={{ borderRadius: '6px', background: '#2563eb' }}
            >
              Bàn giao xe
            </Button>
          )}
          {r.status === 'ACTIVE' && (
            <Button 
              size="small" 
              onClick={() => navigate(`/manager/return/${r.id}`)}
              style={{ borderRadius: '6px', borderColor: '#9333ea', color: '#9333ea' }}
            >
              Nhận xe trả
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <Title level={4} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>
            Hàng đợi Đơn thuê (Booking Queue)
          </Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>
            Quản lý vòng đời đơn thuê từ tiếp nhận, duyệt đơn đến giao nhận xe
          </Text>
        </div>

        <Segmented
          value={viewMode}
          onChange={(val) => setViewMode(val as 'table' | 'kanban')}
          options={[
            { label: 'Kanban Board', value: 'kanban', icon: <AppstoreOutlined /> },
            { label: 'Danh sách Table', value: 'table', icon: <BarsOutlined /> }
          ]}
          style={{ background: '#e2e8f0', padding: '3px', borderRadius: '8px' }}
        />
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Tìm kiếm theo mã đơn, tên xe, khách hàng, biển số..."
        searchValue={search}
        onSearchChange={setSearch}
        statusOptions={[
          { label: 'Tất cả trạng thái', value: '' },
          { label: 'Chờ duyệt (PENDING)', value: 'PENDING' },
          { label: 'Đã duyệt (CONFIRMED)', value: 'CONFIRMED' },
          { label: 'Sẵn sàng giao (READY)', value: 'READY_FOR_PICKUP' },
          { label: 'Đang thuê (ACTIVE)', value: 'ACTIVE' },
          { label: 'Chờ nhận xe (RETURN)', value: 'WAITING_FOR_RETURN' },
          { label: 'Hoàn thành (COMPLETED)', value: 'COMPLETED' }
        ]}
        statusValue={statusFilter}
        onStatusChange={setStatusFilter}
        onReset={() => { setSearch(''); setStatusFilter(undefined); }}
      />

      {/* Main Content */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : filteredBookings.length === 0 ? (
        <EmptyState 
          title="Không tìm thấy đơn thuê nào" 
          description="Thử thay đổi bộ lọc trạng thái hoặc từ khóa tìm kiếm."
        />
      ) : viewMode === 'kanban' ? (
        renderKanban()
      ) : (
        <Card style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} styles={{ body: { padding: 0 } }}>
          <Table
            dataSource={filteredBookings}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10, showTotal: (t) => `Tổng cộng ${t} đơn thuê` }}
          />
        </Card>
      )}
    </div>
  );
};
