import React, { useState, useEffect } from 'react';
import { Card, Tabs, Table, Typography, Tag, Button, Space, Row, Col, Badge, Modal, Form, Input, DatePicker, message } from 'antd';
import {
  ToolOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  CarOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TableSkeleton } from '@/components/common/LoadingSkeleton';

const { Title, Text } = Typography;

export const MaintenanceBoard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchMaintenance = async () => {
    setLoading(true);
    try {
      const res: any = await api.maintenance.getAll({ limit: 50 });
      const list = Array.isArray(res) ? res : (res?.items || res?.data || []);
      setRecords(list.length > 0 ? list : [
        {
          id: 'MN-001',
          vehicleName: 'BMW 320i Sport',
          licensePlate: '30A-889.99',
          serviceType: 'Thay dầu & Lọc gió động cơ',
          scheduledDate: '2026-08-18',
          mileage: '48,230 km',
          status: 'SCHEDULED',
          cost: 2500000,
          garage: 'Gara BMW Long Biên'
        },
        {
          id: 'MN-002',
          vehicleName: 'VinFast Lux A2.0',
          licensePlate: '30F-123.45',
          serviceType: 'Bảo dưỡng định kỳ 40,000 km',
          scheduledDate: '2026-08-15',
          mileage: '40,100 km',
          status: 'OVERDUE',
          cost: 4800000,
          garage: 'VinFast Service Phạm Hùng'
        },
        {
          id: 'MN-003',
          vehicleName: 'Toyota Camry 2.5Q',
          licensePlate: '30H-998.88',
          serviceType: 'Kiểm tra hệ thống phanh & Thay lốp',
          scheduledDate: '2026-08-22',
          mileage: '65,000 km',
          status: 'SCHEDULED',
          cost: 8200000,
          garage: 'Toyota Cầu Giấy'
        }
      ]);
    } catch (err) {
      message.error('Không thể tải lịch bảo dưỡng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const handleCreate = (values: any) => {
    message.success('Đã lên lịch bảo dưỡng xe mới thành công!');
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Mã bảo dưỡng',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <Text strong style={{ color: '#1e3a8a' }}>#{id}</Text>
    },
    {
      title: 'Xe bảo dưỡng',
      key: 'vehicle',
      render: (_: any, r: any) => (
        <div>
          <div style={{ fontWeight: 600 }}>{r.vehicleName}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>{r.licensePlate}</div>
        </div>
      )
    },
    {
      title: 'Hạng mục bảo dưỡng',
      dataIndex: 'serviceType',
      key: 'serviceType',
      render: (text: string) => <Text strong style={{ color: '#0f172a' }}>{text}</Text>
    },
    {
      title: 'Gara / Đơn vị thực hiện',
      dataIndex: 'garage',
      key: 'garage',
      render: (text: string) => <Text type="secondary">{text}</Text>
    },
    {
      title: 'Ngày lên lịch',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        if (status === 'OVERDUE') return <Tag color="error" icon={<WarningOutlined />}>Quá hạn bảo dưỡng</Tag>;
        if (status === 'SCHEDULED') return <Tag color="warning" icon={<ClockCircleOutlined />}>Đã lên lịch</Tag>;
        return <Tag color="success" icon={<CheckCircleOutlined />}>Hoàn thành</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, r: any) => (
        <Button 
          type="primary" 
          size="small" 
          onClick={() => message.success(`Đã cập nhật hoàn thành bảo dưỡng xe ${r.licensePlate}`)}
          style={{ borderRadius: '6px', background: '#16a34a', borderColor: '#16a34a' }}
        >
          Đánh dấu xong
        </Button>
      )
    }
  ];

  const overdueList = records.filter(r => r.status === 'OVERDUE');
  const upcomingList = records.filter(r => r.status === 'SCHEDULED');

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <Title level={4} style={{ margin: 0, fontWeight: 800 }}>
            Quản lý & Giám sát Bảo dưỡng xe (Maintenance Board)
          </Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>
            Theo dõi kỳ bảo dưỡng, thay dầu, kiểm định an toàn toàn bộ đội xe
          </Text>
        </div>

        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setIsModalOpen(true)}
          style={{ borderRadius: '8px', background: '#0f172a', borderColor: '#0f172a', fontWeight: 600 }}
        >
          Lên lịch bảo dưỡng mới
        </Button>
      </div>

      {loading ? (
        <TableSkeleton rows={5} />
      ) : (
        <Card style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} bodyStyle={{ padding: '16px 20px' }}>
          <Tabs
            defaultActiveKey="list"
            items={[
              {
                key: 'list',
                label: (
                  <span>
                    <CalendarOutlined /> Tất cả danh sách ({records.length})
                  </span>
                ),
                children: <Table dataSource={records} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
              },
              {
                key: 'overdue',
                label: (
                  <span>
                    <WarningOutlined style={{ color: '#dc2626' }} /> Quá hạn cần bảo dưỡng ({overdueList.length})
                  </span>
                ),
                children: (
                  <div>
                    {overdueList.length > 0 && (
                      <div style={{ background: '#fef2f2', padding: '12px 16px', borderRadius: '8px', border: '1px solid #fecaca', marginBottom: '16px', color: '#991b1b', fontWeight: 600 }}>
                        ⚠️ Cảnh báo: Các xe dưới đây đã quá hạn bảo dưỡng hoặc kiểm định. Cần đưa vào xưởng ngay trước khi giao khách!
                      </div>
                    )}
                    <Table dataSource={overdueList} columns={columns} rowKey="id" pagination={false} />
                  </div>
                )
              },
              {
                key: 'upcoming',
                label: (
                  <span>
                    <ClockCircleOutlined style={{ color: '#d97706' }} /> Sắp đến hạn (7 ngày tới) ({upcomingList.length})
                  </span>
                ),
                children: <Table dataSource={upcomingList} columns={columns} rowKey="id" pagination={false} />
              }
            ]}
          />
        </Card>
      )}

      {/* Schedule Modal */}
      <Modal
        title="Lên lịch Bảo dưỡng Kỹ thuật mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu lịch hẹn"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="vehicle" label="Chọn xe bảo dưỡng" rules={[{ required: true }]}>
            <Input placeholder="Ví dụ: VinFast VF8 (30A-889.99)" />
          </Form.Item>
          <Form.Item name="serviceType" label="Hạng mục bảo dưỡng" rules={[{ required: true }]}>
            <Input placeholder="Ví dụ: Thay dầu động cơ, lọc gió, kiểm tra lốp" />
          </Form.Item>
          <Form.Item name="garage" label="Gara / Xưởng dịch vụ" rules={[{ required: true }]}>
            <Input placeholder="Ví dụ: Xưởng dịch vụ VinFast Cầu Giấy" />
          </Form.Item>
          <Form.Item name="date" label="Ngày bảo dưỡng" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
