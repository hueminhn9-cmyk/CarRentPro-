import React, { useState, useEffect } from 'react';
import { Card, Tabs, Table, Typography, Tag, Button, Row, Col, Badge, Modal, Form, Input, InputNumber, DatePicker, Select, message } from 'antd';
import {
  ToolOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  SyncOutlined,
  CarOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';
import { TableSkeleton } from '@/components/common/LoadingSkeleton';

const { Title, Text } = Typography;

export const MaintenanceBoard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchMaintenance = async () => {
    setLoading(true);
    try {
      const res: any = await api.maintenance.getAll({ limit: 50 });
      const list = Array.isArray(res) ? res : (res?.items || res?.data || []);
      setRecords(list);
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Không thể tải lịch bảo dưỡng.');
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const res: any = await api.vehicles.getAll();
      const list = Array.isArray(res) ? res : (res?.vehicles || res?.items || []);
      setVehicles(list);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchMaintenance();
    fetchVehicles();
  }, []);

  const handleCreate = async (values: any) => {
    setSubmitting(true);
    try {
      const startDate = values.date ? values.date.format('YYYY-MM-DD') : new Date().toISOString().split('T')[0];
      const endDate = values.endDate ? values.endDate.format('YYYY-MM-DD') : startDate;
      const desc = `${values.serviceType || 'Bảo dưỡng định kỳ'} | ${values.garage || 'Gara ủy quyền'}`;
      const cost = Number(values.cost) || 0;

      await api.maintenance.schedule(String(values.vehicleId), desc, cost, startDate, endDate);
      message.success('Đã lên lịch bảo dưỡng xe thành công! Xe đã chuyển sang trạng thái Bảo dưỡng.');
      setIsModalOpen(false);
      form.resetFields();
      await fetchMaintenance();
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Lỗi khi lên lịch bảo dưỡng');
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async (id: string, licensePlate: string) => {
    try {
      await api.maintenance.complete(id);
      message.success(`Đã hoàn tất bảo dưỡng xe ${licensePlate}. Xe đã tự động chuyển về trạng thái Sẵn sàng (AVAILABLE)!`);
      await fetchMaintenance();
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Lỗi khi cập nhật trạng thái bảo dưỡng');
    }
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
          <div style={{ fontWeight: 600 }}>{r.vehicleName || 'Xe không tên'}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>{r.licensePlate || 'N/A'}</div>
        </div>
      )
    },
    {
      title: 'Hạng mục bảo dưỡng',
      dataIndex: 'serviceType',
      key: 'serviceType',
      render: (text: string, r: any) => <Text strong style={{ color: '#0f172a' }}>{text || r.description || 'Bảo dưỡng'}</Text>
    },
    {
      title: 'Gara / Đơn vị thực hiện',
      dataIndex: 'garage',
      key: 'garage',
      render: (text: string, r: any) => <Text type="secondary">{text || r.description || 'Xưởng dịch vụ'}</Text>
    },
    {
      title: 'Chi phí (VNĐ)',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost: number) => <Text style={{ color: '#0284c7', fontWeight: 600 }}>{cost ? cost.toLocaleString('vi-VN') + ' đ' : '0 đ'}</Text>
    },
    {
      title: 'Ngày lên lịch',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate',
      render: (d: string, r: any) => d || r.startDate || 'N/A'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        if (status === 'OVERDUE') return <Tag color="error" icon={<WarningOutlined />}>Quá hạn bảo dưỡng</Tag>;
        if (status === 'SCHEDULED') return <Tag color="warning" icon={<ClockCircleOutlined />}>Đã lên lịch</Tag>;
        if (status === 'IN_PROGRESS') return <Tag color="processing" icon={<SyncOutlined spin />}>Đang bảo dưỡng</Tag>;
        return <Tag color="success" icon={<CheckCircleOutlined />}>Hoàn thành</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, r: any) => {
        if (r.status === 'COMPLETED') {
          return <Tag color="success">Đã hoàn tất</Tag>;
        }
        return (
          <Button 
            type="primary" 
            size="small" 
            onClick={() => handleComplete(r.id, r.licensePlate)}
            style={{ borderRadius: '6px', background: '#16a34a', borderColor: '#16a34a' }}
          >
            Đánh dấu xong
          </Button>
        );
      }
    }
  ];

  const overdueList = records.filter(r => r.status === 'OVERDUE');
  const upcomingList = records.filter(r => r.status === 'SCHEDULED');
  const inProgressList = records.filter(r => r.status === 'IN_PROGRESS');

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
        <Card style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} styles={{ body: { padding: '16px 20px' } }}>
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
                key: 'in_progress',
                label: (
                  <span>
                    <SyncOutlined style={{ color: '#0284c7' }} /> Đang trong xưởng ({inProgressList.length})
                  </span>
                ),
                children: <Table dataSource={inProgressList} columns={columns} rowKey="id" pagination={false} />
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
                    <ClockCircleOutlined style={{ color: '#d97706' }} /> Sắp đến hạn ({upcomingList.length})
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
        confirmLoading={submitting}
        okText="Lưu lịch hẹn"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="vehicleId" label="Chọn xe bảo dưỡng" rules={[{ required: true, message: 'Vui lòng chọn xe' }]}>
            <Select 
              showSearch 
              placeholder="Chọn xe từ danh mục"
              optionFilterProp="children"
              filterOption={(input, option: any) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={vehicles.map(v => ({
                value: v.id,
                label: `${v.name} (${v.licensePlate || v.license_plate}) - Trạng thái: ${v.status}`
              }))}
            />
          </Form.Item>
          <Form.Item name="serviceType" label="Hạng mục bảo dưỡng" rules={[{ required: true, message: 'Vui lòng nhập hạng mục' }]}>
            <Input placeholder="Ví dụ: Thay dầu động cơ, lọc gió, kiểm tra lốp" />
          </Form.Item>
          <Form.Item name="garage" label="Gara / Xưởng dịch vụ" rules={[{ required: true, message: 'Vui lòng nhập tên gara' }]}>
            <Input placeholder="Ví dụ: Xưởng dịch vụ VinFast Cầu Giấy" />
          </Form.Item>
          <Form.Item name="cost" label="Chi phí dự kiến (VNĐ)">
            <InputNumber 
              style={{ width: '100%' }} 
              placeholder="Ví dụ: 2500000" 
              formatter={val => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={val => val!.replace(/\$\s?|(,*)/g, '') as any}
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="date" label="Ngày bắt đầu" rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endDate" label="Ngày hoàn thành dự kiến">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
