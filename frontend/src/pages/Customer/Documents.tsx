import React, { useEffect, useState } from 'react';
import { Card, Typography, Space, Button, Upload, Alert, message, Divider, Row, Col } from 'antd';
import { UploadOutlined, FileProtectOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { Customer } from '@/services/mockData';
import { StatusBadge } from '@/components/common/StatusBadge';

const { Title, Text } = Typography;

export const CustomerDocuments: React.FC = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = api.auth.getCurrentUser();
    if (user) {
      api.customers.getById(user.id).then(res => res && setCustomer(res));
    }
  }, []);

  const handleMockUpload = async () => {
    if (!customer) return;
    setLoading(true);
    try {
      // Simulate verification upload
      await api.customers.updateLicense(customer.id, 'Chờ duyệt', 'GPLX_UPLOADED_2026.png');
      message.success('Đã tải lên GPLX thành công! Đang chờ quản trị viên xác minh.');
      // Refresh
      api.customers.getById(customer.id).then(res => res && setCustomer(res));
    } catch (e) {
      message.error('Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  if (!customer) return <div style={{ textAlign: 'center', padding: '100px 0' }}>Đang tải...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Giấy tờ cá nhân</Title>
        <Text type="secondary">Xác minh danh tính và bằng lái xe tự lái để nhận xe đúng lịch trình.</Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <Card 
            title={
              <Space>
                <FileProtectOutlined />
                <span>Giấy phép lái xe (GPLX) hạng B1/B2</span>
              </Space>
            } 
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">Trạng thái xác minh:</Text>
                <StatusBadge status={customer.licenseStatus} />
              </div>

              {customer.licenseStatus === 'Chưa cập nhật' && (
                <Alert
                  message="Chưa cập nhật GPLX"
                  description="Bạn cần tải lên hình ảnh mặt trước và mặt sau của GPLX để đủ điều kiện thuê xe tự lái."
                  type="info"
                  showIcon
                  style={{ borderRadius: '6px' }}
                />
              )}

              {customer.licenseStatus === 'Chờ duyệt' && (
                <Alert
                  message="GPLX đang được xác minh"
                  description="Hệ thống đã nhận tài liệu của bạn. Quá trình kiểm tra thông tin sẽ mất từ 10 - 15 phút. Chúng tôi sẽ gửi thông báo ngay khi hoàn tất."
                  type="warning"
                  showIcon
                  style={{ borderRadius: '6px' }}
                />
              )}

              {customer.licenseStatus === 'Đã xác minh' && (
                <Alert
                  message="Xác minh thành công"
                  description="Hồ sơ lái xe của bạn đã hợp lệ. Bạn đã đủ điều kiện nhận bàn giao bất kỳ xe tự lái nào tại showroom AutoRent."
                  type="success"
                  showIcon
                  style={{ borderRadius: '6px' }}
                />
              )}

              <Divider style={{ margin: '8px 0' }} />

              <div style={{ border: '2px dashed #c1c6d7', borderRadius: '8px', padding: '32px', textAlign: 'center', backgroundColor: '#fcf9f8' }}>
                <ClockCircleOutlined style={{ fontSize: '36px', color: '#727786', marginBottom: '16px' }} />
                <div style={{ fontWeight: 600, marginBottom: '8px' }}>Tải lên ảnh GPLX</div>
                <div style={{ fontSize: '12px', color: '#414755', marginBottom: '20px' }}>Hỗ trợ định dạng JPG, PNG, PDF tối đa 5MB.</div>
                
                <Button 
                  type="primary" 
                  icon={<UploadOutlined />} 
                  onClick={handleMockUpload} 
                  loading={loading}
                  disabled={customer.licenseStatus === 'Đã xác minh'}
                  style={{ borderRadius: '6px' }}
                >
                  Chọn và gửi tài liệu
                </Button>
              </div>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card 
            title={<Title level={5} style={{ margin: 0, fontSize: '14px' }}>Yêu cầu hồ sơ lái xe</Title>} 
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            <Space direction="vertical" size={12} style={{ fontSize: '13px', color: '#414755' }}>
              <div>• GPLX phải còn hạn sử dụng ít nhất 3 tháng.</div>
              <div>• Hình ảnh chụp rõ nét, không bị lóa sáng hay mất góc.</div>
              <div>• Thông tin họ tên và số GPLX trùng khớp hoàn toàn với thông tin khai báo trong hồ sơ cá nhân.</div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
