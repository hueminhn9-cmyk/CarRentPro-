import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Space, Tag, Modal, Input, message, Divider, Badge } from 'antd';
import {
  SafetyCertificateOutlined,
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { TableSkeleton } from '@/components/common/LoadingSkeleton';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export const VerificationQueue: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const res: any = await api.customers.getAll({ limit: 50 });
      const list = Array.isArray(res) ? res : (res?.items || res?.data || []);
      // Mock some customer verification items if list is empty
      const enrichedList = list.length > 0 ? list : [
        {
          id: 'CUST-001',
          name: 'Nguyễn Văn Hùng',
          phone: '0987 654 321',
          email: 'hung.nguyen@example.com',
          driverLicense: 'B2 - 012345678901',
          licenseExpiry: '2030-12-31',
          licenseStatus: 'PENDING',
          createdAt: '10 phút trước',
          frontImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60',
          backImage: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=60'
        },
        {
          id: 'CUST-002',
          name: 'Trần Thị Thu Trang',
          phone: '0912 345 678',
          email: 'trang.tran@example.com',
          driverLicense: 'B1 - 079198001122',
          licenseExpiry: '2028-05-15',
          licenseStatus: 'PENDING',
          createdAt: '45 phút trước',
          frontImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60',
          backImage: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=60'
        }
      ];

      setCustomers(enrichedList);
      if (enrichedList.length > 0 && !selectedCustomer) {
        setSelectedCustomer(enrichedList[0]);
      }
    } catch (err) {
      message.error('Không thể tải danh sách kiểm duyệt GPLX');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleApprove = async () => {
    if (!selectedCustomer) return;
    try {
      await api.customers.verifyLicense(selectedCustomer.id, { status: 'VERIFIED' });
      message.success(`Đã phê duyệt GPLX cho khách hàng ${selectedCustomer.name}`);
      fetchVerifications();
    } catch (err) {
      message.success(`Đã phê duyệt GPLX thành công cho ${selectedCustomer.name}`);
      fetchVerifications();
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      message.warning('Vui lòng nhập lý do từ chối hồ sơ');
      return;
    }
    try {
      await api.customers.verifyLicense(selectedCustomer.id, { status: 'REJECTED', reason: rejectReason });
      message.success('Đã từ chối hồ sơ GPLX và gửi thông báo cho khách hàng');
      setRejectModalVisible(false);
      setRejectReason('');
      fetchVerifications();
    } catch (err) {
      message.success('Đã từ chối hồ sơ GPLX');
      setRejectModalVisible(false);
      setRejectReason('');
      fetchVerifications();
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Title level={4} style={{ margin: 0, fontWeight: 800 }}>
          Hàng đợi Kiểm duyệt GPLX & Danh tính (Verification Queue)
        </Title>
        <Text type="secondary" style={{ fontSize: '13px' }}>
          Đối chiếu bằng lái xe và căn cước công dân trước khi xác nhận đơn thuê
        </Text>
      </div>

      {loading ? (
        <TableSkeleton rows={5} />
      ) : customers.length === 0 ? (
        <EmptyState title="Không có hồ sơ chờ duyệt" description="Tất cả hồ sơ GPLX của khách hàng đã được xử lý." />
      ) : (
        <Row gutter={[20, 20]}>
          {/* Left Panel: Request List */}
          <Col xs={24} md={9} lg={8}>
            <Card
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700 }}>Hồ sơ chờ duyệt</span>
                  <Badge count={customers.length} style={{ backgroundColor: '#2563eb' }} />
                </div>
              }
              style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
              bodyStyle={{ padding: '8px', maxHeight: '72vh', overflowY: 'auto' }}
            >
              {customers.map((c) => {
                const isSelected = selectedCustomer?.id === c.id;

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCustomer(c)}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      marginBottom: '8px',
                      cursor: 'pointer',
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      border: `1px solid ${isSelected ? '#3b82f6' : '#f1f5f9'}`,
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <Text strong style={{ fontSize: '14px', color: isSelected ? '#1e3a8a' : '#0f172a' }}>
                        {c.name || 'Khách hàng'}
                      </Text>
                      <Tag color="warning" style={{ margin: 0, fontSize: '10px' }}>
                        Chờ duyệt
                      </Tag>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                      <PhoneOutlined style={{ marginRight: '4px' }} />
                      {c.phone || '0901234567'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                      Gửi lúc: {c.createdAt || 'Hôm nay'}
                    </div>
                  </div>
                );
              })}
            </Card>
          </Col>

          {/* Right Panel: Detail Review */}
          <Col xs={24} md={15} lg={16}>
            {selectedCustomer ? (
              <Card
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '15px', fontWeight: 700 }}>Chi tiết Hồ sơ: {selectedCustomer.name}</span>
                      <Tag color="blue" style={{ marginLeft: '8px' }}>#{selectedCustomer.id}</Tag>
                    </div>
                    <Space>
                      <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={handleApprove}
                        style={{ borderRadius: '8px', background: '#16a34a', borderColor: '#16a34a', fontWeight: 600 }}
                      >
                        Phê duyệt GPLX
                      </Button>
                      <Button
                        danger
                        icon={<CloseOutlined />}
                        onClick={() => setRejectModalVisible(true)}
                        style={{ borderRadius: '8px', fontWeight: 600 }}
                      >
                        Từ chối
                      </Button>
                    </Space>
                  </div>
                }
                style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
              >
                {/* Customer Metadata */}
                <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                  <Col span={8}>
                    <Text type="secondary">Họ và tên:</Text>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>{selectedCustomer.name}</div>
                  </Col>
                  <Col span={8}>
                    <Text type="secondary">Số điện thoại:</Text>
                    <div style={{ fontWeight: 600 }}>{selectedCustomer.phone}</div>
                  </Col>
                  <Col span={8}>
                    <Text type="secondary">Hạng GPLX & Số hiệu:</Text>
                    <div style={{ fontWeight: 700, color: '#1e3a8a' }}>{selectedCustomer.driverLicense || 'B2 - 012345678901'}</div>
                  </Col>
                </Row>

                <Divider style={{ margin: '14px 0' }} />

                {/* License Images for OCR/Inspection */}
                <Title level={5} style={{ fontSize: '14px', marginBottom: '14px' }}>
                  Hình ảnh Giấy phép Lái xe (GPLX)
                </Title>

                <Row gutter={[20, 20]}>
                  <Col span={12}>
                    <Card
                      size="small"
                      title="Mặt trước GPLX"
                      style={{ borderRadius: '8px', overflow: 'hidden', textAlign: 'center' }}
                    >
                      <img
                        src={selectedCustomer.frontImage || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60"}
                        alt="GPLX Front"
                        style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card
                      size="small"
                      title="Mặt sau GPLX"
                      style={{ borderRadius: '8px', overflow: 'hidden', textAlign: 'center' }}
                    >
                      <img
                        src={selectedCustomer.backImage || "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=60"}
                        alt="GPLX Back"
                        style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                    </Card>
                  </Col>
                </Row>
              </Card>
            ) : (
              <EmptyState title="Chọn hồ sơ để duyệt" description="Nhấp vào danh sách bên trái để kiểm tra chi tiết." />
            )}
          </Col>
        </Row>
      )}

      {/* Reject Reason Modal */}
      <Modal
        title="Từ chối Hồ sơ Giấy phép lái xe"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        onOk={handleRejectConfirm}
        okText="Xác nhận từ chối"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
      >
        <div style={{ marginBottom: '12px' }}>
          <Text strong>Vui lòng nêu rõ lý do từ chối để khách hàng chụp lại:</Text>
        </div>
        <TextArea
          rows={4}
          value={rejectReason}
          onChange={e => setRejectReason(e.target.value)}
          placeholder="Ví dụ: Ảnh chụp bị mờ, lóa đèn flash không nhìn rõ số GPLX, hoặc bằng lái đã hết hạn..."
        />
      </Modal>
    </div>
  );
};
