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
      // Get all users from API and filter for MANAGER role
      const res = await (api as any).axiosInstance?.get('/users?role=MANAGER') ||
        await fetch('http://localhost:5000/api/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('autorent_token')}`
          }
        }).then(r => r.json());
      
      // Use api.customers.getAll as a workaround then filter
      // Actually let's call the raw endpoint
      const token = localStorage.getItem('autorent_token');
      const response = await fetch('http://localhost:5000/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      const usersList = data?.data?.users || [];
      const managersList = usersList
        .filter((u: any) => u.role === 'MANAGER')
        .map((u: any) => ({
          id: u.id?.toString(),
          name: u.full_name || u.fullName,
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
      const token = localStorage.getItem('autorent_token');
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: values.email,
          password: 'manager123',
          full_name: values.name,
          phone: values.phone,
          role: 'MANAGER',
          status: 'ACTIVE'
        })
      });
      const data = await response.json();
      if (response.ok) {
        message.success(`Đã cấp tài khoản Manager thành công cho ${values.name}. Mật khẩu mặc định: manager123`);
        setIsModalOpen(false);
        form.resetFields();
        fetchManagers();
      } else {
        message.error(data?.message || 'Tạo tài khoản thất bại!');
      }
    } catch (err: any) {
      message.error('Lỗi kết nối đến server!');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const token = localStorage.getItem('autorent_token');
      const newStatus = currentStatus === 'Đang hoạt động' ? 'INACTIVE' : 'ACTIVE';
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        const label = newStatus === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm khóa';
        message.success(`Đã đổi trạng thái tài khoản thành ${label}`);
        fetchManagers();
      } else {
        message.error('Cập nhật trạng thái thất bại!');
      }
    } catch (err) {
      message.error('Lỗi kết nối đến server!');
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
          <Card bordered={false} style={{ borderRadius: '12px', borderLeft: '4px solid #2563eb' }}>
            <Text type="secondary">Tổng số Manager</Text>
            <Title level={2} style={{ margin: '8px 0 0 0', fontWeight: 800 }}>{managers.length}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
            <Text type="secondary">Đang hoạt động</Text>
            <Title level={2} style={{ margin: '8px 0 0 0', color: '#10b981', fontWeight: 800 }}>
              {activeCount}
            </Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
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
          columns={[
            {
              title: 'Nhân viên Manager',
              dataIndex: 'name',
              render: (name, record: Manager) => (
                <Space size={12}>
                  <Avatar style={{ backgroundColor: '#f59e0b' }} icon={<SafetyCertificateOutlined />} />
                  <div>
                    <Text strong style={{ display: 'block' }}>{name}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
                  </div>
                </Space>
              )
            },
            {
              title: 'Số điện thoại',
              dataIndex: 'phone',
            },
            {
              title: 'Ngày tham gia',
              dataIndex: 'joinedDate',
              render: (date: string) => date || 'N/A',
            },
            {
              title: 'Trạng thái',
              dataIndex: 'status',
              render: (status: string) => (
                <Tag color={status === 'Đang hoạt động' ? 'green' : 'red'}>
                  {status}
                </Tag>
              )
            },
            {
              title: 'Hành động Admin',
              render: (_, record: Manager) => (
                <Space>
                  <Button
                    size="small"
                    type={record.status === 'Đang hoạt động' ? 'default' : 'primary'}
                    danger={record.status === 'Đang hoạt động'}
                    onClick={() => toggleStatus(record.id, record.status)}
                  >
                    {record.status === 'Đang hoạt động' ? 'Khóa tài khoản' : 'Kích hoạt lại'}
                  </Button>
                </Space>
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
