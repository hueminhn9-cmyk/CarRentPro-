import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Tag, Space, Row, Col, Badge } from 'antd';
import {
  HistoryOutlined,
  UserOutlined,
  SwapOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';
import { FilterBar } from '@/components/common/FilterBar';
import { TableSkeleton } from '@/components/common/LoadingSkeleton';

const { Title, Text } = Typography;

export const AuditLogs: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [logs] = useState<any[]>([
    {
      id: 'LOG-001',
      actor: 'Nguyễn Quản Trị (Admin)',
      action: 'UPDATE_BOOKING_STATUS',
      resource: 'Booking #BK-2026-081',
      ipAddress: '113.190.234.12',
      timestamp: '2026-08-16 10:00:24',
      before: { status: 'PENDING', verified: false },
      after: { status: 'CONFIRMED', verified: true }
    },
    {
      id: 'LOG-002',
      actor: 'Trần Văn Quản Lý (Manager)',
      action: 'VERIFY_CUSTOMER_LICENSE',
      resource: 'Customer #CUST-001',
      ipAddress: '14.162.88.90',
      timestamp: '2026-08-16 09:45:10',
      before: { licenseStatus: 'UNVERIFIED' },
      after: { licenseStatus: 'VERIFIED' }
    },
    {
      id: 'LOG-003',
      actor: 'Nguyễn Quản Trị (Admin)',
      action: 'UPDATE_VEHICLE_PRICE',
      resource: 'Vehicle VinFast VF8 (30A-889.99)',
      ipAddress: '113.190.234.12',
      timestamp: '2026-08-15 17:30:00',
      before: { pricePerDay: 1300000 },
      after: { pricePerDay: 1500000 }
    }
  ]);

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (t: string) => <span style={{ fontSize: '12px', color: '#64748b' }}>{t}</span>
    },
    {
      title: 'Người thực hiện',
      dataIndex: 'actor',
      key: 'actor',
      render: (actor: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <UserOutlined style={{ color: '#1e3a8a' }} />
          <Text strong style={{ fontSize: '13px' }}>{actor}</Text>
        </div>
      )
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      render: (act: string) => <Tag color="blue">{act}</Tag>
    },
    {
      title: 'Đối tượng tác động',
      dataIndex: 'resource',
      key: 'resource',
      render: (res: string) => <Text strong>{res}</Text>
    },
    {
      title: 'Địa chỉ IP',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      render: (ip: string) => <Tag color="default">{ip}</Tag>
    }
  ];

  const expandedRowRender = (record: any) => {
    return (
      <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <Title level={5} style={{ fontSize: '13px', margin: '0 0 12px 0', color: '#0f172a' }}>
          Chi tiết Thay đổi Dữ liệu (Before vs After Diff View)
        </Title>
        <Row gutter={[20, 16]}>
          <Col span={12}>
            <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '6px', border: '1px solid #fecaca' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#991b1b', marginBottom: '4px' }}>
                - TRƯỚC KHI THAY ĐỔI (BEFORE):
              </div>
              <pre style={{ margin: 0, fontSize: '12px', color: '#b91c1c' }}>
                {JSON.stringify(record.before, null, 2)}
              </pre>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#166534', marginBottom: '4px' }}>
                + SAU KHI THAY ĐỔI (AFTER):
              </div>
              <pre style={{ margin: 0, fontSize: '12px', color: '#15803d' }}>
                {JSON.stringify(record.after, null, 2)}
              </pre>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Title level={4} style={{ margin: 0, fontWeight: 800 }}>Nhật ký Hoạt động Hệ thống (Audit Logs)</Title>
        <Text type="secondary" style={{ fontSize: '13px' }}>Theo dõi lịch sử truy cập, thay đổi dữ liệu và đảm bảo tính minh bạch bảo mật</Text>
      </div>

      <FilterBar
        searchPlaceholder="Tìm theo người thực hiện, hành động, đối tượng..."
        searchValue={search}
        onSearchChange={setSearch}
        onReset={() => setSearch('')}
      />

      <Card style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} styles={{ body: { padding: 0 } }}>
        <Table
          dataSource={logs}
          columns={columns}
          rowKey="id"
          expandable={{ expandedRowRender, defaultExpandAllRows: true }}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};
