import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Select, Card, Typography, Row, Col, Avatar, message } from 'antd';
import { PlusOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { api } from '@/services/api';

const { Title, Text } = Typography;

interface Manager {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  joinedDate: string;
  role: string;
}

export const ManagerManagement: React.FC = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const fetchManagers = async () => {
    setLoading(true);
    try {
      const usersList = await api.managers.getAll();
      const managersList = usersList.map((u: any) => ({
        id: u.id?.toString(),
        name: u.full_name || u.fullName || u.email,
        email: u.email,
        phone: u.phone || 'N/A',
        status: u.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm khóa',
        joinedDate: u.created_at ? u.created_at.split('T')[0] : '',
        role: u.role,
      }));
      setManagers(managersList);
    } catch (err) {
      console.error('Failed to fetch managers:', err);
      message.error('Không thể tải danh sách Manager!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleCreateManager = async (values: any) => {
    setSubmitting(true);
    try {
      await api.managers.create(values);
      message.success(`Đã cấp tài khoản Manager thành công cho ${values.name}. Mật khẩu mặc định: manager123`);
      setIsModalOpen(false);
      form.resetFields();
      fetchManagers();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Tạo tài khoản thất bại!');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'Đang hoạt động' ? 'INACTIVE' : 'ACTIVE';
      await api.managers.update(id, { status: newStatus });
      const label = newStatus === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm khóa';
      message.success(`Đã đổi trạng thái tài khoản thành ${label}`);
      fetchManagers();
    } catch (err) {
      message.error('Cập nhật trạng thái thất bại!');
    }
  };

  const activeCount = managers.filter(m => m.status === 'Đang hoạt động').length;

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 800 }}>Quản lý Nhân sự (Managers)</Title>
          <Text type="secondary">Cấp quyền và quản lý tài khoản nhân viên vận hành doanh nghiệp</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ backgroundColor: '#2563eb', borderRadius: '8px', height: '40px', fontWeight: 600 }}
          onClick={() => setIsModalOpen(true)}
        >
          Cấp tài khoản Manager mới
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card variant="borderless" style={{ borderRadius: '12px', borderLeft: '4px solid #2563eb' }}>
            <Text type="secondary">Tổng số Manager</Text>
            <Title level={2} style={{ margin: '8px 0 0 0', fontWeight: 800 }}>{managers.length}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant="borderless" style={{ borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
            <Text type="secondary">Đang hoạt động</Text>
            <Title level={2} style={{ margin: '8px 0 0 0', color: '#10b981', fontWeight: 800 }}>
              {activeCount}
            </Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant="borderless" style={{ borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
            <Text type="secondary">Tạm khóa</Text>
            <Title level={2} style={{ margin: '8px 0 0 0', color: '#f59e0b', fontWeight: 800 }}>
              {managers.length - activeCount}
            </Title>
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: '12px' }}>
        <Table
          loading={loading}
          dataSource={managers}
          rowKey="id"
          tableLayout="fixed"
          columns={[
            {
              title: <span style={{ fontWeight: 700, color: '#334155' }}>Nhân viên Manager</span>,
              dataIndex: 'name',
              width: '30%',
              onHeaderCell: () => ({ style: { textAlign: 'center' } }),
              onCell: () => ({ style: { textAlign: 'left' } }),
              render: (name, record: Manager) => (
                <Space size={12}>
                  <Avatar style={{ backgroundColor: '#f59e0b' }} icon={<SafetyCertificateOutlined />} />
                  <div>
                    <Text strong style={{ display: 'block', color: '#0f172a', whiteSpace: 'nowrap' }}>{name}</Text>
                    <Text type="secondary" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>{record.email}</Text>
                  </div>
                </Space>
              )
            },
            {
              title: <span style={{ fontWeight: 700, color: '#334155' }}>Số điện thoại</span>,
              dataIndex: 'phone',
              width: '20%',
              align: 'center' as const,
              render: (phone: string) => <span style={{ whiteSpace: 'nowrap' }}>{phone}</span>
            },
            {
              title: <span style={{ fontWeight: 700, color: '#334155' }}>Ngày tham gia</span>,
              dataIndex: 'joinedDate',
              width: '18%',
              align: 'center' as const,
              render: (date: string) => <span style={{ whiteSpace: 'nowrap' }}>{date || 'N/A'}</span>,
            },
            {
              title: <span style={{ fontWeight: 700, color: '#334155' }}>Trạng thái</span>,
              dataIndex: 'status',
              width: '16%',
              align: 'center' as const,
              render: (status: string) => (
                <Tag color={status === 'Đang hoạt động' ? 'green' : 'red'} style={{ borderRadius: '6px', fontWeight: 600, margin: 0 }}>
                  {status}
                </Tag>
              )
            },
            {
              title: <span style={{ fontWeight: 700, color: '#334155' }}>Hành động Admin</span>,
              width: '16%',
              align: 'center' as const,
              render: (_, record: Manager) => (
                <Button
                  size="small"
                  type={record.status === 'Đang hoạt động' ? 'default' : 'primary'}
                  danger={record.status === 'Đang hoạt động'}
                  style={{ borderRadius: '6px' }}
                  onClick={() => toggleStatus(record.id, record.status)}
                >
                  {record.status === 'Đang hoạt động' ? 'Khóa tài khoản' : 'Kích hoạt lại'}
                </Button>
              )
            }
          ]}
        />
      </Card>

      {/* Modal Add Manager */}
      <Modal
        title="Tạo mới Tài khoản Manager (Vận hành)"
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
        onOk={() => form.submit()}
        okText="Tạo mới"
        cancelText="Hủy"
        confirmLoading={submitting}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateManager}>
          <Form.Item name="name" label="Họ và tên Manager" rules={[{ required: true, message: 'Nhập họ tên!' }]}>
            <Input placeholder="Nguyễn Văn B" />
          </Form.Item>
          <Form.Item name="email" label="Email doanh nghiệp" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="manager.name@autorent.vn" />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
            <Input placeholder="0988776655" />
          </Form.Item>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            * Mật khẩu mặc định sau khi tạo: <strong>manager123</strong> (nhắc Manager đổi mật khẩu sau khi đăng nhập lần đầu)
          </Text>
        </Form>
      </Modal>
    </div>
  );
};
