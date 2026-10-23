import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Space, Tag, Modal, Input, message, Divider, Badge, Segmented, Spin } from 'antd';
import {
  SafetyCertificateOutlined,
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';
import { EmptyState } from '@/components/common/EmptyState';
import { TableSkeleton } from '@/components/common/LoadingSkeleton';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const VerificationQueue: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [allCustomers, setAllCustomers] = useState<any[]>([]);
  const [filterTab, setFilterTab] = useState<'PENDING' | 'VERIFIED' | 'ALL'>('PENDING');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const res: any = await api.customers.getAll({ limit: 100 });
      const list = Array.isArray(res) ? res : (res?.items || res?.data || []);
      
      setAllCustomers(list);

      // Select first item that matches current filter or list[0]
      const filtered = list.filter((c: any) => {
        if (filterTab === 'PENDING') return c.licenseStatus === 'Chờ duyệt' || c.licenseStatus === 'PENDING';
        if (filterTab === 'VERIFIED') return c.licenseStatus === 'Đã xác minh' || c.licenseStatus === 'VERIFIED';
        return true;
      });

      if (filtered.length > 0) {
        setSelectedCustomer((prev: any) => {
          const stillExists = filtered.find((x: any) => x.id === prev?.id);
          return stillExists || filtered[0];
        });
      } else {
        setSelectedCustomer(null);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Không thể tải danh sách kiểm duyệt GPLX';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const displayedCustomers = allCustomers.filter((c: any) => {
    if (filterTab === 'PENDING') return c.licenseStatus === 'Chờ duyệt' || c.licenseStatus === 'PENDING';
    if (filterTab === 'VERIFIED') return c.licenseStatus === 'Đã xác minh' || c.licenseStatus === 'VERIFIED';
    return true;
  });

  const pendingCount = allCustomers.filter(c => c.licenseStatus === 'Chờ duyệt' || c.licenseStatus === 'PENDING').length;

  const handleApprove = async () => {
    if (!selectedCustomer) return;
    setActionLoading(true);
    try {
      await api.customers.verifyLicense(selectedCustomer.id, { status: 'VERIFIED' });
      message.success(`Đã phê duyệt GPLX thành công cho khách hàng ${selectedCustomer.name}`);
      await fetchVerifications();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Lỗi khi phê duyệt hồ sơ';
      message.error(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      message.warning('Vui lòng nhập lý do từ chối hồ sơ');
      return;
    }
    if (!selectedCustomer) return;
    setActionLoading(true);
    try {
      await api.customers.verifyLicense(selectedCustomer.id, { status: 'REJECTED', reason: rejectReason });
      message.success(`Đã từ chối hồ sơ GPLX của ${selectedCustomer.name} và gửi lý do cho khách hàng`);
      setRejectModalVisible(false);
      setRejectReason('');
      await fetchVerifications();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Lỗi khi từ chối hồ sơ';
      message.error(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Title level={4} style={{ margin: 0, fontWeight: 800 }}>
            Hàng đợi Kiểm duyệt GPLX & Danh tính
          </Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>
            Đối chiếu bằng lái xe và căn cước công dân trước khi xác nhận đơn thuê
          </Text>
        </div>

        <Space size={12}>
          <Segmented
            value={filterTab}
            onChange={(val) => {
              setFilterTab(val as any);
              const filtered = allCustomers.filter((c: any) => {
                if (val === 'PENDING') return c.licenseStatus === 'Chờ duyệt' || c.licenseStatus === 'PENDING';
                if (val === 'VERIFIED') return c.licenseStatus === 'Đã xác minh' || c.licenseStatus === 'VERIFIED';
                return true;
              });
              setSelectedCustomer(filtered.length > 0 ? filtered[0] : null);
            }}
            options={[
              { label: `Chờ duyệt (${pendingCount})`, value: 'PENDING' },
              { label: 'Đã duyệt', value: 'VERIFIED' },
              { label: `Tất cả (${allCustomers.length})`, value: 'ALL' }
            ]}
          />
          <Button icon={<ReloadOutlined />} onClick={fetchVerifications} size="small" style={{ borderRadius: '6px' }}>
            Làm mới
          </Button>
        </Space>
      </div>

      {loading ? (
        <TableSkeleton rows={5} />
      ) : displayedCustomers.length === 0 ? (
        <EmptyState 
          title={filterTab === 'PENDING' ? 'Không có hồ sơ chờ duyệt' : 'Danh sách hồ sơ trống'} 
          description={filterTab === 'PENDING' ? 'Tất cả hồ sơ GPLX của khách hàng đã được xử lý hoặc chưa có yêu cầu mới.' : 'Không tìm thấy hồ sơ khách hàng phù hợp với bộ lọc hiện tại.'} 
        />
      ) : (
        <Row gutter={[20, 20]}>
          {/* Left Panel: Request List */}
          <Col xs={24} md={9} lg={8}>
            <Card
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700 }}>Danh sách hồ sơ</span>
                  <Badge count={displayedCustomers.length} style={{ backgroundColor: '#2563eb' }} />
                </div>
              }
              style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
              styles={{ body: { padding: '8px', maxHeight: '72vh', overflowY: 'auto' } }}
            >
              {displayedCustomers.map((c) => {
                const isSelected = selectedCustomer?.id === c.id;
                const isPending = c.licenseStatus === 'Chờ duyệt' || c.licenseStatus === 'PENDING';
                const isVerified = c.licenseStatus === 'Đã xác minh' || c.licenseStatus === 'VERIFIED';

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
                      <Tag color={isPending ? 'warning' : (isVerified ? 'success' : 'default')} style={{ margin: 0, fontSize: '10px' }}>
                        {c.licenseStatus || 'Chưa duyệt'}
                      </Tag>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                      <PhoneOutlined style={{ marginRight: '4px' }} />
                      {c.phone || 'Chưa cập nhật SĐT'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                      GPLX: {c.driverLicense || 'Chưa có'}
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: '15px', fontWeight: 700 }}>Chi tiết Hồ sơ: {selectedCustomer.name}</span>
                      <Tag color="blue" style={{ marginLeft: '8px' }}>#{selectedCustomer.id}</Tag>
                    </div>
                    <Space>
                      <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        loading={actionLoading}
                        onClick={handleApprove}
                        style={{ borderRadius: '8px', background: '#16a34a', borderColor: '#16a34a', fontWeight: 600 }}
                      >
                        Phê duyệt GPLX
                      </Button>
                      <Button
                        danger
                        icon={<CloseOutlined />}
                        loading={actionLoading}
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
                  <Col xs={12} sm={6}>
                    <Text type="secondary">Họ và tên:</Text>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{selectedCustomer.name}</div>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Text type="secondary">Số điện thoại:</Text>
                    <div style={{ fontWeight: 600 }}>{selectedCustomer.phone || 'Chưa có'}</div>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Text type="secondary">Số CCCD / Hộ chiếu:</Text>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{selectedCustomer.idCard || 'Chưa có'}</div>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Text type="secondary">Số hiệu GPLX:</Text>
                    <div style={{ fontWeight: 700, color: '#1e3a8a' }}>{selectedCustomer.driverLicense || 'Chưa có'}</div>
                  </Col>
                </Row>

                <Divider style={{ margin: '14px 0' }} />

                {/* Document Images for OCR/Inspection */}
                <Title level={5} style={{ fontSize: '14px', marginBottom: '14px' }}>
                  Hình ảnh Căn cước công dân & Giấy phép lái xe (GPLX)
                </Title>

                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Card size="small" title="Mặt trước GPLX" style={{ borderRadius: '8px', textAlign: 'center' }}>
                      <img
                        src={selectedCustomer.licenseFront || selectedCustomer.frontImage || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60'}
                        alt="GPLX Front"
                        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Card size="small" title="Mặt sau GPLX" style={{ borderRadius: '8px', textAlign: 'center' }}>
                      <img
                        src={selectedCustomer.licenseBack || selectedCustomer.backImage || 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=60'}
                        alt="GPLX Back"
                        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Card size="small" title="Mặt trước CCCD" style={{ borderRadius: '8px', textAlign: 'center' }}>
                      <img
                        src={selectedCustomer.citizenFront || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60'}
                        alt="CCCD Front"
                        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Card size="small" title="Mặt sau CCCD" style={{ borderRadius: '8px', textAlign: 'center' }}>
                      <img
                        src={selectedCustomer.citizenBack || 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=60'}
                        alt="CCCD Back"
                        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }}
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
        confirmLoading={actionLoading}
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
