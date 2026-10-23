import React, { useEffect, useState } from 'react';
import {
  Card, Table, Button, Typography, Space, Tag, Modal, Row, Col, Input,
  Avatar, Tooltip, Segmented, Dropdown, MenuProps, Image, message
} from 'antd';
import {
  EyeOutlined,
  UserOutlined,
  SearchOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserAddOutlined,
  CheckOutlined,
  CloseOutlined,
  MoreOutlined,
  PhoneOutlined,
  MailOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';
import { Customer } from '@/services/mockData';
import { StatusBadge } from '@/components/common/StatusBadge';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const CustomersManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusTab, setStatusTab] = useState<'ALL' | 'PENDING' | 'VERIFIED'>('ALL');
  
  // Inspection Modal state
  const [inspectModalVisible, setInspectModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

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

  const handlePromoteManager = async (customer: Customer) => {
    try {
      await api.customers.updateRole(customer.id, 'MANAGER');
      message.success(`Đã cấp quyền Manager thành công cho ${customer.name}!`);
      fetchCustomers();
    } catch (e: any) {
      message.error(e.message || 'Cấp quyền Manager thất bại!');
    }
  };

  const openInspectionModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setInspectModalVisible(true);
  };

  // Filter customers by search & status tab
  const filteredCustomers = customers.filter(c => {
    const q = searchText.toLowerCase();
    const matchSearch = !searchText || (
      (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q) ||
      (c.idCard || '').toLowerCase().includes(q) ||
      (c.driverLicense || '').toLowerCase().includes(q)
    );

    if (!matchSearch) return false;

    if (statusTab === 'PENDING') return c.licenseStatus === 'Chờ duyệt';
    if (statusTab === 'VERIFIED') return c.licenseStatus === 'Đã xác minh';
    
    return true;
  });

  const verifiedCount = customers.filter(c => c.licenseStatus === 'Đã xác minh').length;
  const pendingCount = customers.filter(c => c.licenseStatus === 'Chờ duyệt').length;

  const columns = [
    {
      title: <span style={{ fontWeight: 700, color: '#334155' }}>Khách hàng</span>,
      dataIndex: 'name',
      key: 'name',
      width: '22%',
      onHeaderCell: () => ({ style: { textAlign: 'center' as const } }),
      onCell: () => ({ style: { textAlign: 'left' as const } }),
      render: (name: string, record: Customer) => (
        <Space size={10} align="center">
          <Avatar 
            icon={<UserOutlined />} 
            style={{ backgroundColor: '#1e3a8a', flexShrink: 0 }} 
          />
          <div style={{ lineHeight: '1.3' }}>
            <Text strong style={{ color: '#0f172a', display: 'block', fontSize: '13px', whiteSpace: 'nowrap' }}>
              {name}
            </Text>
            <Text type="secondary" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
              Mã KH: #{record.id}
            </Text>
          </div>
        </Space>
      )
    },
    {
      title: <span style={{ fontWeight: 700, color: '#334155' }}>Thông tin liên hệ</span>,
      key: 'contact',
      width: '22%',
      onHeaderCell: () => ({ style: { textAlign: 'center' as const } }),
      onCell: () => ({ style: { textAlign: 'left' as const } }),
      render: (_, record: Customer) => (
        <div style={{ lineHeight: '1.4', fontSize: '12px' }}>
          <div style={{ color: '#0f172a', fontWeight: 600, whiteSpace: 'nowrap' }}>
            <PhoneOutlined style={{ marginRight: '6px', color: '#2563eb' }} />
            {record.phone}
          </div>
          <div style={{ color: '#64748b', whiteSpace: 'nowrap' }}>
            <MailOutlined style={{ marginRight: '6px', color: '#94a3b8' }} />
            {record.email}
          </div>
        </div>
      )
    },
    {
      title: <span style={{ fontWeight: 700, color: '#334155' }}>Trạng thái GPLX</span>,
      dataIndex: 'licenseStatus',
      key: 'licenseStatus',
      width: '16%',
      align: 'center' as const,
      render: (status: any, record: Customer) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <StatusBadge status={status} />
          {record.driverLicense && record.driverLicense !== 'N/A' && (
            <Text type="secondary" style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>
              {record.driverLicense}
            </Text>
          )}
        </div>
      )
    },
    {
      title: <span style={{ fontWeight: 700, color: '#334155' }}>Hạng & Điểm</span>,
      dataIndex: 'tier',
      key: 'tier',
      width: '14%',
      align: 'center' as const,
      render: (tier: string, record: Customer) => {
        let color = 'blue';
        if (tier === 'Vàng') color = 'gold';
        if (tier === 'Kim cương') color = 'purple';
        return (
          <Space direction="vertical" size={2} align="center">
            <Tag color={color} style={{ borderRadius: '6px', fontWeight: 700, margin: 0 }}>
              {tier || 'Bạc'}
            </Tag>
            <Text type="secondary" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
              {record.loyaltyPoints || 0} điểm
            </Text>
          </Space>
        );
      }
    },
    {
      title: <span style={{ fontWeight: 700, color: '#334155' }}>Lượt thuê</span>,
      dataIndex: 'bookingCount',
      key: 'bookingCount',
      width: '10%',
      align: 'center' as const,
      render: (count: number) => (
        <Tag color="cyan" style={{ borderRadius: '6px', fontWeight: 700, margin: 0, padding: '2px 8px' }}>
          {count || 0} chuyến
        </Tag>
      )
    },
    {
      title: <span style={{ fontWeight: 700, color: '#334155' }}>Thao tác quản trị</span>,
      key: 'actions',
      width: '16%',
      align: 'center' as const,
      render: (_, record: Customer) => {
        const isPending = record.licenseStatus === 'Chờ duyệt';

        const moreMenuItems: MenuProps['items'] = [
          {
            key: 'inspect',
            icon: <EyeOutlined style={{ color: '#2563eb' }} />,
            label: 'Xem ảnh GPLX & Hồ sơ KYC',
            onClick: () => openInspectionModal(record)
          },
          {
            key: 'promote',
            icon: <UserAddOutlined style={{ color: '#d97706' }} />,
            label: 'Chuyển thành tài khoản Manager',
            onClick: () => {
              Modal.confirm({
                title: `Cấp quyền Manager cho ${record.name}?`,
                content: `Sau khi chuyển đổi, tài khoản ${record.email} sẽ có quyền quản trị vận hành trên hệ thống AutoRent.`,
                okText: 'Xác nhận cấp quyền',
                okButtonProps: { style: { backgroundColor: '#d97706', borderColor: '#d97706' } },
                cancelText: 'Hủy',
                onOk: () => handlePromoteManager(record)
              });
            }
          }
        ];

        return (
          <Space size={6} style={{ justifyContent: 'center' }}>
            <Button 
              type="default" 
              size="small"
              icon={<EyeOutlined style={{ color: '#2563eb' }} />} 
              style={{ borderRadius: '6px', fontWeight: 600, fontSize: '12px' }}
              onClick={() => openInspectionModal(record)}
            >
              Hồ sơ KYC
            </Button>

            <Dropdown menu={{ items: moreMenuItems }} trigger={['click']}>
              <Button type="text" size="small" icon={<MoreOutlined />} style={{ borderRadius: '6px' }} />
            </Dropdown>
          </Space>
        );
      }
    }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>
            Quản lý Khách hàng & Hồ sơ Định danh
          </Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>
            Giám sát danh sách khách hàng, kiểm toán hồ sơ định danh và phân quyền nhân sự toàn hệ thống
          </Text>
        </div>

        <Input 
          placeholder="Tìm theo tên, SĐT, Email, GPLX, CCCD..." 
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          allowClear
          style={{ width: '320px', borderRadius: '8px' }}
        />
      </div>

      {/* Interactive KPI Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col xs={24} sm={8}>
          <Card 
            hoverable
            onClick={() => setStatusTab('ALL')}
            style={{ 
              borderRadius: '12px', 
              border: `1px solid ${statusTab === 'ALL' ? '#2563eb' : '#e2e8f0'}`,
              background: statusTab === 'ALL' ? '#eff6ff' : '#ffffff',
              cursor: 'pointer'
            }} 
            styles={{ body: { padding: '16px 20px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TeamOutlined style={{ fontSize: '20px', color: '#1e40af' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', fontWeight: 500 }}>Tổng số khách hàng</Text>
                <Title level={4} style={{ margin: 0, fontWeight: 800, color: '#1e3a8a' }}>{customers.length} Tài khoản</Title>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card 
            hoverable
            onClick={() => setStatusTab('PENDING')}
            style={{ 
              borderRadius: '12px', 
              border: `1px solid ${statusTab === 'PENDING' ? '#d97706' : '#e2e8f0'}`,
              background: statusTab === 'PENDING' ? '#fffbeb' : '#ffffff',
              cursor: 'pointer'
            }} 
            styles={{ body: { padding: '16px 20px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ClockCircleOutlined style={{ fontSize: '20px', color: '#d97706' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', fontWeight: 500 }}>Hồ sơ GPLX chờ duyệt</Text>
                <Title level={4} style={{ margin: 0, fontWeight: 800, color: '#92400e' }}>{pendingCount} Hồ sơ cần duyệt</Title>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card 
            hoverable
            onClick={() => setStatusTab('VERIFIED')}
            style={{ 
              borderRadius: '12px', 
              border: `1px solid ${statusTab === 'VERIFIED' ? '#16a34a' : '#e2e8f0'}`,
              background: statusTab === 'VERIFIED' ? '#f0fdf4' : '#ffffff',
              cursor: 'pointer'
            }} 
            styles={{ body: { padding: '16px 20px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircleOutlined style={{ fontSize: '20px', color: '#16a34a' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', fontWeight: 500 }}>GPLX Đã xác minh hợp lệ</Text>
                <Title level={4} style={{ margin: 0, fontWeight: 800, color: '#166534' }}>{verifiedCount} Khách hàng</Title>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filter tabs */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Segmented
          value={statusTab}
          onChange={(val) => setStatusTab(val as any)}
          options={[
            { label: `Tất cả (${customers.length})`, value: 'ALL' },
            { label: `Chờ duyệt GPLX (${pendingCount})`, value: 'PENDING' },
            { label: `Đã xác minh (${verifiedCount})`, value: 'VERIFIED' }
          ]}
          style={{ background: '#e2e8f0', padding: '3px', borderRadius: '8px' }}
        />
      </div>

      {/* Main Table Card */}
      <Card 
        style={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)' }} 
        styles={{ body: { padding: 0 } }}
      >
        <Table 
          loading={loading}
          dataSource={filteredCustomers} 
          columns={columns} 
          rowKey="id"
          tableLayout="fixed"
          pagination={{ pageSize: 10, showTotal: (total) => `Hiển thị ${total} khách hàng` }}
        />
      </Card>

      {/* Full GPLX Verification & Inspection Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SafetyCertificateOutlined style={{ color: '#2563eb', fontSize: '20px' }} />
            <span>Đối chiếu Giấy phép Lái xe (GPLX) & Định danh KYC</span>
          </div>
        }
        open={inspectModalVisible}
        onCancel={() => setInspectModalVisible(false)}
        width={720}
        footer={
          selectedCustomer ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <StatusBadge status={selectedCustomer.licenseStatus} />
              <Button type="primary" onClick={() => setInspectModalVisible(false)} style={{ borderRadius: '6px' }}>
                Đóng hồ sơ
              </Button>
            </div>
          ) : null
        }
      >
        {selectedCustomer && (
          <div style={{ padding: '8px 0' }}>
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              padding: '10px 14px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '12px',
              color: '#166534'
            }}>
              <strong>Quy trình phân quyền:</strong> Việc kiểm tra, đối chiếu và phê duyệt GPLX thực địa trước giờ giao xe thuộc trách nhiệm của Quản lý Chi nhánh (Manager Verification Queue). Admin theo dõi và kiểm toán tính minh bạch của hồ sơ.
            </div>

            {/* Customer Metadata Card */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <Row gutter={[16, 12]}>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: '11px' }}>HỌ VÀ TÊN KHÁCH HÀNG</Text>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>{selectedCustomer.name}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: '11px' }}>MÃ SỐ GPLX KÊ KHAI</Text>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: '#1e3a8a' }}>{selectedCustomer.driverLicense || 'B2 - 012345678901'}</div>
                </Col>
                <Col span={8}>
                  <Text type="secondary" style={{ fontSize: '11px' }}>SỐ ĐIỆN THOẠI</Text>
                  <div style={{ fontWeight: 600, color: '#334155' }}>{selectedCustomer.phone}</div>
                </Col>
                <Col span={8}>
                  <Text type="secondary" style={{ fontSize: '11px' }}>EMAIL</Text>
                  <div style={{ fontWeight: 600, color: '#334155' }}>{selectedCustomer.email}</div>
                </Col>
                <Col span={8}>
                  <Text type="secondary" style={{ fontSize: '11px' }}>SỐ CCCD / CMND</Text>
                  <div style={{ fontWeight: 600, color: '#334155' }}>{selectedCustomer.idCard || '001095012345'}</div>
                </Col>
              </Row>
            </div>

            {/* Photos Section */}
            <Title level={5} style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700 }}>
              Hình ảnh Giấy phép Lái xe được tải lên (Nhấp ảnh để phóng to)
            </Title>

            <Image.PreviewGroup>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card 
                    size="small" 
                    title={<span style={{ fontSize: '12px', fontWeight: 600 }}>Mặt trước GPLX</span>}
                    style={{ borderRadius: '8px', overflow: 'hidden', textAlign: 'center' }}
                  >
                    <Image
                      src={selectedCustomer.frontImage || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60"}
                      alt="GPLX Front"
                      style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                  </Card>
                </Col>

                <Col span={12}>
                  <Card 
                    size="small" 
                    title={<span style={{ fontSize: '12px', fontWeight: 600 }}>Mặt sau GPLX</span>}
                    style={{ borderRadius: '8px', overflow: 'hidden', textAlign: 'center' }}
                  >
                    <Image
                      src={selectedCustomer.backImage || "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=60"}
                      alt="GPLX Back"
                      style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                  </Card>
                </Col>
              </Row>
            </Image.PreviewGroup>
          </div>
        )}
      </Modal>
    </div>
  );
};



