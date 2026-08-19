import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Typography, Space, message, Tag, Modal } from 'antd';
import { SafetyCertificateOutlined, CheckCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { Customer } from '@/services/mockData';
import { StatusBadge } from '@/components/common/StatusBadge';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export const CustomersManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = () => {
    setLoading(true);
    api.customers.getAll().then(res => {
      setCustomers(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleVerifyLicense = async (id: string) => {
    try {
      await api.customers.updateLicense(id, 'Đã xác minh');
      message.success('Đã xác minh GPLX của khách hàng thành công!');
      fetchCustomers();
    } catch (e) {
      message.error('Phê duyệt GPLX thất bại!');
    }
  };

  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Tài liệu GPLX',
      dataIndex: 'licenseStatus',
      key: 'licenseStatus',
      render: (status: any) => <StatusBadge status={status} />
    },
    {
      title: 'Hạng',
      dataIndex: 'tier',
      key: 'tier',
      render: (tier: string) => {
        let color = 'blue';
        if (tier === 'Vàng') color = 'gold';
        if (tier === 'Kim cương') color = 'purple';
        return <Tag color={color}>{tier}</Tag>;
      }
    },
    {
      title: 'Lượt thuê',
      dataIndex: 'bookingCount',
      key: 'bookingCount',
      render: (count: number) => <Text>{count} chuyến</Text>
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record: Customer) => (
        <Space size={12}>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => {
              Modal.info({
                title: `Hồ sơ khách hàng: ${record.name}`,
                content: (
                  <Space direction="vertical" size={10} style={{ marginTop: '12px' }}>
                    <div><strong>Địa chỉ:</strong> {record.address}</div>
                    <div><strong>Số CCCD:</strong> {record.idCard}</div>
                    <div><strong>Mã GPLX lưu trữ:</strong> {record.driverLicense || 'N/A'}</div>
                    <div><strong>Điểm tích lũy:</strong> {record.loyaltyPoints}</div>
                    <div><strong>Ngày gia nhập:</strong> {dayjs(record.createdAt).format('DD/MM/YYYY')}</div>
                  </Space>
                )
              });
            }}
          >
            Hồ sơ
          </Button>

          {record.licenseStatus === 'Chờ duyệt' && (
            <Button 
              type="text" 
              icon={<SafetyCertificateOutlined style={{ color: '#52c41a' }} />} 
              onClick={() => handleVerifyLicense(record.id)}
            >
              Duyệt GPLX
            </Button>
          )}

          <Button 
            type="primary" 
            size="small"
            style={{ backgroundColor: '#f59e0b', borderColor: '#f59e0b', borderRadius: '6px', fontWeight: 600 }}
            onClick={async () => {
              try {
                await api.customers.updateRole(record.id, 'MANAGER');
                message.success(`Đã cấp quyền Manager thành công cho ${record.name}! (${record.email})`);
                fetchCustomers();
              } catch (e: any) {
                message.error(e.message || 'Cấp quyền Manager thất bại!');
              }
            }}
          >
            Cấp quyền Manager
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Quản lý khách hàng</Title>
        <Text type="secondary">Quản lý hồ sơ cá nhân, phê duyệt giấy phép lái xe (GPLX) và phân hạng thành viên.</Text>
      </div>

      <Card variant="borderless" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Table 
          loading={loading}
          dataSource={customers} 
          columns={columns} 
          rowKey="id"
        />
      </Card>
    </div>
  );
};
