import React, { useState } from 'react';
import { Card, Typography, Row, Col, Checkbox, Input, Button, Upload, message, Divider, Space, Tag, Alert } from 'antd';
import {
  UserOutlined,
  FileDoneOutlined,
  CarOutlined,
  CameraOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  UploadOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { Stepper } from '@/components/common/Stepper';

const { Title, Text, Paragraph } = Typography;

export const PickupWizard: React.FC = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [currentStep, setCurrentStep] = useState(0);

  // Form states
  const [checklist, setChecklist] = useState({
    exterior: false,
    interior: false,
    tires: false,
    fuelOdo: false,
    keys: false,
    documents: false
  });

  const [notes, setNotes] = useState('');
  const [odometer, setOdometer] = useState('24,580');
  const [fuelLevel, setFuelLevel] = useState('100%');

  const steps = [
    { title: 'Khách hàng', icon: <UserOutlined /> },
    { title: 'Giấy tờ & GPLX', icon: <FileDoneOutlined /> },
    { title: 'Checklist xe', icon: <CarOutlined /> },
    { title: 'Chụp ảnh 6 góc', icon: <CameraOutlined /> },
    { title: 'Xác nhận bàn giao', icon: <CheckCircleOutlined /> }
  ];

  const handleComplete = () => {
    message.success('Đã hoàn tất quy trình bàn giao xe thành công!');
    navigate('/manager/bookings');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/manager/bookings')}>
            Quay lại
          </Button>
          <div>
            <Title level={4} style={{ margin: 0, fontWeight: 800 }}>
              Quy trình Bàn giao xe (Pickup Wizard)
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Mã đơn: #{bookingId || 'BK-2026-081'} • VinFast VF8 Plus (30A-889.99)
            </Text>
          </div>
        </Space>

        <Tag color="processing" style={{ padding: '4px 10px', fontSize: '13px' }}>
          ĐANG BÀN GIAO
        </Tag>
      </div>

      {/* Stepper */}
      <Stepper current={currentStep} items={steps} />

      {/* Step Content */}
      <Card style={{ borderRadius: '14px', border: '1px solid #e2e8f0', minHeight: '400px' }}>
        {currentStep === 0 && (
          <div>
            <Title level={5} style={{ marginBottom: '16px' }}>Bước 1: Đối chiếu Thông tin Khách hàng</Title>
            <Row gutter={[20, 20]}>
              <Col span={12}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <Text type="secondary">Họ và tên khách hàng</Text>
                  <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>Nguyễn Văn Hùng</div>
                  
                  <Divider style={{ margin: '12px 0' }} />
                  
                  <Text type="secondary">Số điện thoại</Text>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>0987 654 321</div>

                  <Divider style={{ margin: '12px 0' }} />

                  <Text type="secondary">Số CCCD / Hộ chiếu</Text>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>001095012345</div>
                </div>
              </Col>
              <Col span={12}>
                <Alert
                  type="success"
                  showIcon
                  message="Khách hàng đã xác minh hợp lệ"
                  description="Khách hàng đã hoàn tất đặt cọc 15.000.000đ và ký hợp đồng điện tử."
                  style={{ borderRadius: '8px', marginBottom: '16px' }}
                />
                <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontWeight: 600, color: '#1e3a8a' }}>Thời gian thuê xe:</div>
                  <div style={{ fontSize: '13px', marginTop: '4px', color: '#1e3a8a' }}>
                    Từ: 09:00 ngày 20/08/2026<br/>
                    Đến: 17:00 ngày 24/08/2026 (4 ngày)
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <Title level={5} style={{ marginBottom: '16px' }}>Bước 2: Kiểm tra Giấy tờ & Giấy phép lái xe (GPLX)</Title>
            <Row gutter={[20, 20]}>
              <Col span={12}>
                <Card size="small" title="GPLX Mặt trước" style={{ borderRadius: '8px', textAlign: 'center' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=60" 
                    alt="GPLX Front" 
                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }} 
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="GPLX Mặt sau" style={{ borderRadius: '8px', textAlign: 'center' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=500&auto=format&fit=crop&q=60" 
                    alt="GPLX Back" 
                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }} 
                  />
                </Card>
              </Col>
            </Row>
            <div style={{ marginTop: '20px' }}>
              <Checkbox defaultChecked style={{ fontWeight: 600 }}>
                Đã kiểm tra bản gốc GPLX trùng khớp với ảnh chụp trên hệ thống
              </Checkbox>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <Title level={5} style={{ marginBottom: '16px' }}>Bước 3: Checklist Tình trạng Xe trước khi Bàn giao</Title>
            <Row gutter={[20, 16]}>
              <Col span={12}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <Checkbox 
                    checked={checklist.exterior} 
                    onChange={e => setChecklist({ ...checklist, exterior: e.target.checked })}
                    style={{ fontSize: '14px' }}
                  >
                    1. Ngoại thất xe (Sơn bóng, không vết móp méo mới)
                  </Checkbox>
                  <Checkbox 
                    checked={checklist.interior} 
                    onChange={e => setChecklist({ ...checklist, interior: e.target.checked })}
                    style={{ fontSize: '14px' }}
                  >
                    2. Nội thất sạch sẽ (Ghế da, thảm sàn, trần xe)
                  </Checkbox>
                  <Checkbox 
                    checked={checklist.tires} 
                    onChange={e => setChecklist({ ...checklist, tires: e.target.checked })}
                    style={{ fontSize: '14px' }}
                  >
                    3. Lốp xe & Lốp dự phòng đủ áp suất tiêu chuẩn
                  </Checkbox>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <Checkbox 
                    checked={checklist.fuelOdo} 
                    onChange={e => setChecklist({ ...checklist, fuelOdo: e.target.checked })}
                    style={{ fontSize: '14px' }}
                  >
                    4. Nhiên liệu / Pin: {fuelLevel} | Odo: {odometer} km
                  </Checkbox>
                  <Checkbox 
                    checked={checklist.keys} 
                    onChange={e => setChecklist({ ...checklist, keys: e.target.checked })}
                    style={{ fontSize: '14px' }}
                  >
                    5. Chìa khóa thông minh (Giao đủ 1 hoặc 2 chìa)
                  </Checkbox>
                  <Checkbox 
                    checked={checklist.documents} 
                    onChange={e => setChecklist({ ...checklist, documents: e.target.checked })}
                    style={{ fontSize: '14px' }}
                  >
                    6. Giấy tờ xe (Đăng kiểm, Bảo hiểm bắt buộc trong cốp)
                  </Checkbox>
                </div>
              </Col>
            </Row>

            <Divider style={{ margin: '20px 0' }} />

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>Số Odometer (Km hiện tại):</Text>
                <Input value={odometer} onChange={e => setOdometer(e.target.value)} style={{ marginTop: '6px' }} />
              </Col>
              <Col span={12}>
                <Text strong>Mức nhiên liệu / Dung lượng Pin:</Text>
                <Input value={fuelLevel} onChange={e => setFuelLevel(e.target.value)} style={{ marginTop: '6px' }} />
              </Col>
            </Row>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <Title level={5} style={{ marginBottom: '16px' }}>Bước 4: Chụp & Tải lên ảnh Hiện trạng 6 góc</Title>
            <Row gutter={[16, 16]}>
              {['Mặt trước đầu xe', 'Đuôi xe & Biển số', 'Thân xe bên trái', 'Thân xe bên phải', 'Khoang lái & Taplo', 'Đồng hồ Odometer'].map((label, idx) => (
                <Col span={8} key={idx}>
                  <Card size="small" title={label} style={{ textAlign: 'center', borderRadius: '8px' }}>
                    <div style={{ height: '100px', background: '#f1f5f9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                      <CameraOutlined style={{ fontSize: '24px', color: '#94a3b8' }} />
                    </div>
                    <Upload showUploadList={false}>
                      <Button size="small" icon={<UploadOutlined />}>Tải ảnh lên</Button>
                    </Upload>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <Title level={5} style={{ marginBottom: '16px' }}>Bước 5: Xác nhận & Hoàn tất Bàn giao xe</Title>
            <Alert
              type="info"
              showIcon
              message="Xác nhận bàn giao"
              description="Sau khi hoàn tất, xe sẽ tự động chuyển sang trạng thái ĐANG THUÊ (ACTIVE). Hệ thống sẽ gửi thông báo và biên bản bàn giao điện tử qua email cho khách hàng."
              style={{ marginBottom: '20px' }}
            />

            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Text type="secondary">Khách hàng nhận:</Text>
                  <div style={{ fontWeight: 700 }}>Nguyễn Văn Hùng</div>
                </Col>
                <Col span={8}>
                  <Text type="secondary">Xe bàn giao:</Text>
                  <div style={{ fontWeight: 700 }}>VinFast VF8 Plus (30A-889.99)</div>
                </Col>
                <Col span={8}>
                  <Text type="secondary">Odo ban đầu:</Text>
                  <div style={{ fontWeight: 700 }}>{odometer} km (Pin {fuelLevel})</div>
                </Col>
              </Row>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
          <Button 
            disabled={currentStep === 0} 
            onClick={() => setCurrentStep(currentStep - 1)}
            style={{ borderRadius: '8px' }}
          >
            Quay lại
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button 
              type="primary" 
              onClick={() => setCurrentStep(currentStep + 1)}
              style={{ borderRadius: '8px', background: '#0f172a', borderColor: '#0f172a' }}
            >
              Tiếp tục bước tiếp theo <ArrowRightOutlined />
            </Button>
          ) : (
            <Button 
              type="primary" 
              icon={<CheckCircleOutlined />} 
              onClick={handleComplete}
              style={{ borderRadius: '8px', background: '#16a34a', borderColor: '#16a34a', fontWeight: 700 }}
            >
              Hoàn tất Bàn giao xe
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
