import React, { useEffect, useState } from 'react';
import { Card, Typography, Space, Button, Upload, Alert, message, Divider, Row, Col, Input, Tag, Image } from 'antd';
import { UploadOutlined, FileProtectOutlined, ClockCircleOutlined, CheckCircleOutlined, IdcardOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { StatusBadge } from '@/components/common/StatusBadge';

const { Title, Text } = Typography;

export const CustomerDocuments: React.FC = () => {
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [citizenId, setCitizenId] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');

  const fetchCustomerProfile = async () => {
    const user = api.auth.getCurrentUser();
    if (user) {
      const res: any = await api.customers.getById(user.id);
      if (res) {
        setCustomer(res);
        setCitizenId(res.idCard !== 'N/A' ? res.idCard : '');
        setDriverLicense(res.driverLicense !== 'N/A' ? res.driverLicense : '');
        setLicenseExpiry(res.licenseExpiry || '');
      }
    }
  };

  useEffect(() => {
    fetchCustomerProfile();
  }, []);

  const handleFileUpload = async (category: string, file: File) => {
    setLoading(true);
    try {
      await api.customers.uploadDocument(category, file, {
        citizen_id: citizenId,
        driver_license_number: driverLicense,
        driver_license_expiry: licenseExpiry,
      });
      message.success('Đã tải lên giấy tờ thành công! Hồ sơ đã được gửi đến quản trị viên để duyệt.');
      await fetchCustomerProfile();
    } catch (e: any) {
      message.error(e.message || 'Không thể tải tệp tin lên server');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInfo = async () => {
    if (!citizenId || !driverLicense) {
      message.warning('Vui lòng nhập Số CCCD và Số GPLX');
      return;
    }
    setLoading(true);
    try {
      await api.customers.updateProfile({
        citizen_id: citizenId,
        driver_license_number: driverLicense,
        driver_license_expiry: licenseExpiry,
      });
      message.success('Cập nhật thông tin giấy tờ thành công');
      await fetchCustomerProfile();
    } catch (e: any) {
      message.error('Lỗi khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  if (!customer) return <div style={{ textAlign: 'center', padding: '100px 0' }}>Đang nạp hồ sơ cá nhân...</div>;

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Giấy tờ cá nhân & GPLX</Title>
        <Text type="secondary">Quản lý, xem và tải lên CCCD, Bằng lái xe để Quản lý Chi nhánh (Manager) đối chiếu phê duyệt.</Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={15}>
          {/* Status Alert */}
          <Card style={{ borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Space>
                <SafetyCertificateOutlined style={{ fontSize: '20px', color: '#2563eb' }} />
                <span style={{ fontWeight: 700, fontSize: '15px' }}>Trạng thái duyệt hồ sơ:</span>
              </Space>
              <StatusBadge status={customer.licenseStatus} />
            </div>

            {customer.licenseStatus === 'Chưa cập nhật' && (
              <Alert
                message="Chưa hoàn tất tải hồ sơ"
                description="Bạn cần nhập thông tin và chụp ảnh mặt trước/mặt sau của CCCD và GPLX để được duyệt thuê xe."
                type="info"
                showIcon
                style={{ borderRadius: '8px' }}
              />
            )}

            {customer.licenseStatus === 'Chờ duyệt' && (
              <Alert
                message="Hồ sơ đang chờ Quản lý Chi nhánh (Manager) phê duyệt"
                description="Hệ thống đã nhận tài liệu của bạn. Quản lý chi nhánh sẽ kiểm tra và xác nhận hồ sơ của bạn trong vòng 10 - 15 phút."
                type="warning"
                showIcon
                style={{ borderRadius: '8px' }}
              />
            )}

            {customer.licenseStatus === 'Đã xác minh' && (
              <Alert
                message="Xác minh danh tính thành công"
                description="Giấy tờ và bằng lái xe của bạn hợp lệ. Bạn đủ điều kiện ký hợp đồng điện tử và nhận bất kỳ xe tự lái nào."
                type="success"
                showIcon
                style={{ borderRadius: '8px' }}
              />
            )}

            {customer.licenseStatus === 'Từ chối' && (
              <Alert
                message="Hồ sơ bị từ chối phê duyệt"
                description="Quản trị viên yêu cầu cập nhật lại hình ảnh rõ nét hơn. Vui lòng chụp và tải lên lại bên dưới."
                type="error"
                showIcon
                style={{ borderRadius: '8px' }}
              />
            )}
          </Card>

          {/* Info inputs */}
          <Card title={<span style={{ fontWeight: 700 }}>Thông tin định danh</span>} style={{ borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong style={{ fontSize: '12px' }}>Số CCCD / Hộ chiếu:</Text>
                <Input
                  prefix={<IdcardOutlined />}
                  value={citizenId}
                  onChange={e => setCitizenId(e.target.value)}
                  placeholder="Ví dụ: 048099001234"
                  style={{ marginTop: '4px', borderRadius: '6px' }}
                />
              </Col>
              <Col span={12}>
                <Text strong style={{ fontSize: '12px' }}>Số Bằng Lái Xe (GPLX):</Text>
                <Input
                  prefix={<FileProtectOutlined />}
                  value={driverLicense}
                  onChange={e => setDriverLicense(e.target.value)}
                  placeholder="Ví dụ: B2 - 012345678901"
                  style={{ marginTop: '4px', borderRadius: '6px' }}
                />
              </Col>
            </Row>
            <div style={{ marginTop: '14px', textAlign: 'right' }}>
              <Button type="primary" onClick={handleSaveInfo} loading={loading} style={{ background: '#0f172a', borderColor: '#0f172a', borderRadius: '6px' }}>
                Lưu thông tin số liệu
              </Button>
            </div>
          </Card>

          {/* Documents Upload & Viewing */}
          <Card title={<span style={{ fontWeight: 700 }}>Hình ảnh Giấy tờ đã Upload</span>} style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <Row gutter={[16, 20]}>
              {/* GPLX Front */}
              <Col span={12}>
                <div style={{ textAlign: 'center', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <Text strong style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>GPLX - Mặt Trước</Text>
                  <Image
                    src={customer.licenseFront || customer.frontImage}
                    alt="GPLX Front"
                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }}
                  />
                  <Upload
                    showUploadList={false}
                    beforeUpload={(file) => {
                      handleFileUpload('LICENSE_FRONT', file);
                      return false;
                    }}
                  >
                    <Button icon={<UploadOutlined />} size="small" loading={loading} style={{ borderRadius: '6px' }}>
                      Tải lên mặt trước GPLX
                    </Button>
                  </Upload>
                </div>
              </Col>

              {/* GPLX Back */}
              <Col span={12}>
                <div style={{ textAlign: 'center', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <Text strong style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>GPLX - Mặt Sau</Text>
                  <Image
                    src={customer.licenseBack || customer.backImage}
                    alt="GPLX Back"
                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }}
                  />
                  <Upload
                    showUploadList={false}
                    beforeUpload={(file) => {
                      handleFileUpload('LICENSE_BACK', file);
                      return false;
                    }}
                  >
                    <Button icon={<UploadOutlined />} size="small" loading={loading} style={{ borderRadius: '6px' }}>
                      Tải lên mặt sau GPLX
                    </Button>
                  </Upload>
                </div>
              </Col>

              {/* CCCD Front */}
              <Col span={12}>
                <div style={{ textAlign: 'center', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <Text strong style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>CCCD - Mặt Trước</Text>
                  <Image
                    src={customer.citizenFront || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60"}
                    alt="CCCD Front"
                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }}
                  />
                  <Upload
                    showUploadList={false}
                    beforeUpload={(file) => {
                      handleFileUpload('CITIZEN_FRONT', file);
                      return false;
                    }}
                  >
                    <Button icon={<UploadOutlined />} size="small" loading={loading} style={{ borderRadius: '6px' }}>
                      Tải lên mặt trước CCCD
                    </Button>
                  </Upload>
                </div>
              </Col>

              {/* CCCD Back */}
              <Col span={12}>
                <div style={{ textAlign: 'center', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <Text strong style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>CCCD - Mặt Sau</Text>
                  <Image
                    src={customer.citizenBack || "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=60"}
                    alt="CCCD Back"
                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }}
                  />
                  <Upload
                    showUploadList={false}
                    beforeUpload={(file) => {
                      handleFileUpload('CITIZEN_BACK', file);
                      return false;
                    }}
                  >
                    <Button icon={<UploadOutlined />} size="small" loading={loading} style={{ borderRadius: '6px' }}>
                      Tải lên mặt sau CCCD
                    </Button>
                  </Upload>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} md={9}>
          <Card
            title={<span style={{ fontSize: '14px', fontWeight: 700 }}>Yêu cầu hồ sơ hợp lệ</span>}
            style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
          >
            <Space direction="vertical" size={14} style={{ fontSize: '13px', color: '#475569' }}>
              <div>• <strong>GPLX:</strong> Còn thời hạn sử dụng tối thiểu 3 tháng, hạng B1/B2 trở lên.</div>
              <div>• <strong>CCCD:</strong> Chụp đủ 4 góc, không lóa đèn flash, hình ảnh rõ nét.</div>
              <div>• <strong>Liên kết Admin:</strong> Khi bạn bấm tải lên, hình ảnh sẽ lập tức đồng bộ đến màn hình <strong>Verification Queue</strong> của Admin/Manager để kiểm duyệt.</div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
