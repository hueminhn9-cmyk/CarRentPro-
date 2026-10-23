import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Tag, Space, Row, Col, Button, message, Empty, Tooltip } from 'antd';
import {
  HistoryOutlined,
  UserOutlined,
  ReloadOutlined,
  GlobalOutlined,
  LaptopOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';
import { FilterBar } from '@/components/common/FilterBar';
import { TableSkeleton } from '@/components/common/LoadingSkeleton';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export const AuditLogs: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [logs, setLogs] = useState<any[]>([]);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const data = await api.auditLogs.getAll({ limit: 100 });
      const formatted = (data || []).map((l: any) => {
        const parseJson = (val: any) => {
          if (!val) return {};
          if (typeof val === 'object') return val;
          try {
            return JSON.parse(val);
          } catch {
            return val;
          }
        };

        return {
          id: String(l.id),
          timestamp: l.created_at ? dayjs(l.created_at).format('YYYY-MM-DD HH:mm:ss') : 'N/A',
          actor: l.users?.full_name ? `${l.users.full_name} (${l.users.email})` : `User #${l.user_id || 'System'}`,
          action: l.action || 'UNKNOWN_ACTION',
          resource: l.entity_name ? `${l.entity_name} #${l.entity_id || ''}` : `ID: ${l.entity_id || 'N/A'}`,
          ipAddress: l.ip_address || '127.0.0.1',
          userAgent: l.user_agent || '',
          before: parseJson(l.old_values),
          after: parseJson(l.new_values)
        };
      });
      setLogs(formatted);
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Không thể tải nhật ký hoạt động hệ thống');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const filteredLogs = logs.filter(item => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.actor.toLowerCase().includes(q) ||
      item.action.toLowerCase().includes(q) ||
      item.resource.toLowerCase().includes(q) ||
      item.ipAddress.toLowerCase().includes(q)
    );
  });

  const getActionColor = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes('DELETE') || act.includes('REJECT')) return 'red';
    if (act.includes('CREATE') || act.includes('CONFIRM') || act.includes('APPROVE')) return 'green';
    if (act.includes('UPDATE') || act.includes('VERIFY')) return 'blue';
    if (act.includes('LOGIN') || act.includes('AUTH')) return 'purple';
    return 'default';
  };

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 170,
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
      width: 200,
      render: (act: string) => <Tag color={getActionColor(act)}>{act}</Tag>
    },
    {
      title: 'Đối tượng tác động',
      dataIndex: 'resource',
      key: 'resource',
      width: 200,
      render: (res: string) => <Text strong style={{ color: '#0369a1' }}>{res}</Text>
    },
    {
      title: 'Địa chỉ IP',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 140,
      render: (ip: string) => (
        <Space size={4}>
          <GlobalOutlined style={{ color: '#94a3b8', fontSize: '12px' }} />
          <Tag color="default" style={{ margin: 0 }}>{ip}</Tag>
        </Space>
      )
    }
  ];

  const expandedRowRender = (record: any) => {
    const hasBefore = record.before && Object.keys(record.before).length > 0;
    const hasAfter = record.after && Object.keys(record.after).length > 0;

    return (
      <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <Title level={5} style={{ fontSize: '13px', margin: 0, color: '#0f172a' }}>
            Chi tiết Thay đổi Dữ liệu (Before vs After Diff View)
          </Title>
          {record.userAgent && (
            <Tooltip title={record.userAgent}>
              <Space style={{ fontSize: '12px', color: '#64748b' }}>
                <LaptopOutlined />
                <span style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
                  {record.userAgent}
                </span>
              </Space>
            </Tooltip>
          )}
        </div>

        <Row gutter={[20, 16]}>
          <Col span={12}>
            <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '6px', border: '1px solid #fecaca' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#991b1b', marginBottom: '4px' }}>
                - TRƯỚC KHI THAY ĐỔI (BEFORE):
              </div>
              <pre style={{ margin: 0, fontSize: '12px', color: '#b91c1c', maxHeight: '180px', overflow: 'auto' }}>
                {hasBefore ? JSON.stringify(record.before, null, 2) : '(Không có dữ liệu trước thay đổi)'}
              </pre>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#166534', marginBottom: '4px' }}>
                + SAU KHI THAY ĐỔI (AFTER):
              </div>
              <pre style={{ margin: 0, fontSize: '12px', color: '#15803d', maxHeight: '180px', overflow: 'auto' }}>
                {hasAfter ? JSON.stringify(record.after, null, 2) : '(Không có dữ liệu sau thay đổi)'}
              </pre>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <Title level={4} style={{ margin: 0, fontWeight: 800 }}>Nhật ký Hoạt động Hệ thống (Audit Logs)</Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>Theo dõi lịch sử truy cập, thay đổi dữ liệu và đảm bảo tính minh bạch bảo mật</Text>
        </div>

        <Button icon={<ReloadOutlined />} onClick={fetchAuditLogs} loading={loading}>
          Làm mới
        </Button>
      </div>

      <FilterBar
        searchPlaceholder="Tìm theo người thực hiện, hành động, đối tượng, IP..."
        searchValue={search}
        onSearchChange={setSearch}
        onReset={() => setSearch('')}
      />

      <Card style={{ borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '16px' }} styles={{ body: { padding: 0 } }}>
        {loading ? (
          <div style={{ padding: '20px' }}>
            <TableSkeleton rows={8} />
          </div>
        ) : (
          <Table
            dataSource={filteredLogs}
            columns={columns}
            rowKey="id"
            expandable={{ expandedRowRender, defaultExpandAllRows: false }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '25', '50'],
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bản ghi`
            }}
            locale={{
              emptyText: <Empty description="Chưa có dữ liệu nhật ký kiểm toán" style={{ padding: '32px 0' }} />
            }}
          />
        )}
      </Card>
    </div>
  );
};
