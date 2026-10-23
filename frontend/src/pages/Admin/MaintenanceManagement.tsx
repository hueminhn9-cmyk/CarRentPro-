import React, { useEffect, useState } from 'react';
import { Card, Table, Typography, Space, Tag, Row, Col, Statistic } from 'antd';
import { ToolOutlined, CheckCircleOutlined, ClockCircleOutlined, DollarOutlined, CarOutlined } from '@ant-design/icons';
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price || 0);
  };

  const totalCost = records.reduce((sum, r) => sum + (Number(r.cost) || 0), 0);
  const inProgressCount = records.filter(r => r.status === 'Đang bảo dưỡng').length;
  const completedCount = records.filter(r => r.status !== 'Đang bảo dưỡng').length;

  const columns = [
    {
      title: 'Mã số',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <Text strong>#{id}</Text>
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
      render: (plate: string) => <Tag color="blue" style={{ fontWeight: 600 }}>{plate}</Tag>
    },
    {
      title: 'Hạng mục kỹ thuật',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'Chi phí OPEX',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost: number) => <Text strong style={{ color: '#0f172a' }}>{formatPrice(cost)}</Text>
    },
    {
      title: 'Thời gian thực hiện',
      key: 'dates',
      render: (_, record: MaintenanceRecord) => (
        <span style={{ fontSize: '13px', color: '#475569' }}>{record.startDate} &rarr; {record.endDate}</span>
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
      title: 'Giám sát chi nhánh',
      key: 'monitoring',
      render: (_, record: MaintenanceRecord) => (
        record.status === 'Đang bảo dưỡng' ? (
          <Tag color="warning" icon={<ClockCircleOutlined />}>
            Đang xử lý tại xưởng
          </Tag>
        ) : (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Đã nghiệm thu vào đội xe
          </Tag>
        )
      )
    }
  ];

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={4} style={{ margin: 0, fontWeight: 800 }}>Báo cáo & Giám sát Chi phí Bảo dưỡng Hạm đội</Title>
        <Text type="secondary" style={{ fontSize: '13px' }}>
          Đối soát ngân sách OPEX kỹ thuật, kiểm soát tiến độ sửa chữa từ các chi nhánh (Dành riêng cho Quản trị & Giám đốc)
        </Text>
      </div>

      {/* OPEX KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <Statistic
              title={<span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>TỔNG NGÂN SÁCH OPEX ĐÃ CHI</span>}
              value={totalCost}
              formatter={(val) => formatPrice(Number(val))}
              prefix={<DollarOutlined style={{ color: '#0284c7' }} />}
              valueStyle={{ fontWeight: 800, color: '#0f172a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fffbeb' }}>
            <Statistic
              title={<span style={{ fontSize: '12px', fontWeight: 600, color: '#92400e' }}>XE ĐANG NẰM XƯỞNG BẢO DƯỠNG</span>}
              value={inProgressCount}
              suffix="xe"
              prefix={<ToolOutlined style={{ color: '#d97706' }} />}
              valueStyle={{ fontWeight: 800, color: '#b45309' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f0fdf4' }}>
            <Statistic
              title={<span style={{ fontSize: '12px', fontWeight: 600, color: '#166534' }}>LƯỢT BẢO DƯỠNG HOÀN TẤT</span>}
              value={completedCount}
              suffix="lượt"
              prefix={<CarOutlined style={{ color: '#16a34a' }} />}
              valueStyle={{ fontWeight: 800, color: '#15803d' }}
            />
          </Card>
        </Col>
      </Row>

      <Card variant="borderless" style={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <Table 
          loading={loading}
          dataSource={records} 
          columns={columns} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};
