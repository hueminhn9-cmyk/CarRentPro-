import React, { useState } from 'react';
import { Card, Typography, Row, Col, Input, Button, InputNumber, Divider, Space, Tag, Alert, message } from 'antd';
import {
  CarOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CalculatorOutlined,
  FileDoneOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { Stepper } from '@/components/common/Stepper';
import { PriceBreakdown } from '@/components/common/PriceBreakdown';

const { Title, Text } = Typography;

export const ReturnWizard: React.FC = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [currentStep, setCurrentStep] = useState(0);

  // Return inspection states
  const [startOdo] = useState(24580);
  const [endOdo, setEndOdo] = useState(24950);
  const [fuelDiff, setFuelDiff] = useState(0); // in VND
  const [lateHours, setLateHours] = useState(0);
  const [cleaningFee, setCleaningFee] = useState(0);
  const [damageFee, setDamageFee] = useState(0);
  const [depositAmount] = useState(15000000);

  const steps = [
    { title: 'Thông tin hoàn trả', icon: <CarOutlined /> },
    { title: 'Kiểm tra Odo & Nhiên liệu', icon: <CalculatorOutlined /> },
    { title: 'Tính toán phụ phí', icon: <DollarOutlined /> },
    { title: 'Tổng kết & Hoàn cọc', icon: <FileDoneOutlined /> },
    { title: 'Xác nhận hoàn tất', icon: <CheckCircleOutlined /> }
  ];

  const extraKm = Math.max(0, (endOdo - startOdo) - 300); // 300km limit
  const kmFee = extraKm * 5000; // 5k/km
  const lateFee = lateHours * 100000; // 100k/hour
  const totalSurcharges = kmFee + lateFee + fuelDiff + cleaningFee + damageFee;
  const refundDeposit = depositAmount - totalSurcharges;

  const handleComplete = () => {
    message.success('Đã hoàn tất thủ tục nhận xe và quyết toán hợp đồng!');
    navigate('/manager/bookings');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
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
              Quy trình Nhận xe trả & Quyết toán (Return Wizard)
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Mã đơn: #{bookingId || 'BK-2026-081'} • BMW 320i Sport (30A-889.99)
            </Text>
          </div>
        </Space>

        <Tag color="purple" style={{ padding: '4px 10px', fontSize: '13px' }}>
          ĐANG TIẾP NHẬN TRẢ XE
        </Tag>
      </div>

      {/* Stepper */}
      <Stepper current={currentStep} items={steps} />

      {/* Content */}
      <Card style={{ borderRadius: '14px', border: '1px solid #e2e8f0', minHeight: '400px' }}>
        {currentStep === 0 && (
          <div>
            <Title level={5} style={{ marginBottom: '16px' }}>Bước 1: Đối chiếu Hợp đồng & Khách hàng trả xe</Title>
            <Row gutter={[20, 20]}>
              <Col span={12}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <Text type="secondary">Khách hàng thuê xe</Text>
                  <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>Nguyễn Văn Hùng</div>
                  
                  <Divider style={{ margin: '12px 0' }} />
                  
                  <Text type="secondary">Tiền cọc thế chấp ban đầu</Text>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#d97706', marginTop: '4px' }}>
                    {formatCurrency(depositAmount)}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <Text type="secondary">Xe bàn giao</Text>
                  <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>BMW 320i Sport (30A-889.99)</div>
                  
                  <Divider style={{ margin: '12px 0' }} />
                  
                  <Text type="secondary">Odo khi bàn giao</Text>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>{startOdo.toLocaleString()} km</div>
                </div>
              </Col>
            </Row>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <Title level={5} style={{ marginBottom: '16px' }}>Bước 2: Ghi nhận Chỉ số Odometer & Nhiên liệu thực tế</Title>
            <Row gutter={[20, 20]}>
              <Col span={12}>
                <Card size="small" title="Chỉ số Kilomet (Odometer)" style={{ borderRadius: '8px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <Text type="secondary">Odo khi nhận xe: </Text>
                    <Text strong>{startOdo.toLocaleString()} km</Text>
                  </div>
                  <div>
                    <Text strong>Odo khi trả xe (Nhập số thực tế):</Text>
                    <InputNumber 
                      value={endOdo} 
                      onChange={val => setEndOdo(val || startOdo)}
                      style={{ width: '100%', marginTop: '6px' }} 
                    />
                  </div>
                  <div style={{ marginTop: '12px', fontSize: '13px', color: extraKm > 0 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
                    Đã chạy: {endOdo - startOdo} km {extraKm > 0 ? `(Vượt hạn mức ${extraKm} km)` : '(Trong hạn mức)'}
                  </div>
                </Card>
              </Col>

              <Col span={12}>
                <Card size="small" title="Nhiên liệu / Pin" style={{ borderRadius: '8px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <Text type="secondary">Mức khi giao xe: </Text>
                    <Text strong>100% (Đầy bình)</Text>
                  </div>
                  <div>
                    <Text strong>Tiền bù thiếu hụt xăng/pin (nếu có):</Text>
                    <InputNumber
                      value={fuelDiff}
                      onChange={val => setFuelDiff(val || 0)}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value!.replace(/\$\s?|(,*)/g, '') as any}
                      style={{ width: '100%', marginTop: '6px' }}
                      addonAfter="VND"
                    />
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <Title level={5} style={{ marginBottom: '16px' }}>Bước 3: Chi tiết các Khoản Phụ phí phát sinh</Title>
            <Row gutter={[20, 16]}>
              <Col span={12}>
                <div style={{ marginBottom: '14px' }}>
                  <Text strong>Phụ phí trễ giờ (Số giờ trễ):</Text>
                  <InputNumber 
                    value={lateHours} 
                    onChange={val => setLateHours(val || 0)} 
                    style={{ width: '100%', marginTop: '4px' }} 
                    addonAfter="giờ" 
                  />
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Đơn giá: 100,000đ/giờ</div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <Text strong>Phí vệ sinh nội thất (nếu quá bẩn):</Text>
                  <InputNumber 
                    value={cleaningFee} 
                    onChange={val => setCleaningFee(val || 0)} 
                    style={{ width: '100%', marginTop: '4px' }} 
                    addonAfter="VND" 
                  />
                </div>
              </Col>

              <Col span={12}>
                <div style={{ marginBottom: '14px' }}>
                  <Text strong>Phí bồi thường hư hại ngoại thất/phụ kiện:</Text>
                  <InputNumber 
                    value={damageFee} 
                    onChange={val => setDamageFee(val || 0)} 
                    style={{ width: '100%', marginTop: '4px' }} 
                    addonAfter="VND" 
                  />
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Cần đính kèm biên bản nếu có</div>
                </div>

                <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '8px', border: '1px solid #fecaca' }}>
                  <div style={{ fontSize: '13px', color: '#991b1b', fontWeight: 600 }}>TỔNG PHỤ PHÍ PHÁT SINH:</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#dc2626' }}>
                    {formatCurrency(totalSurcharges)}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <Title level={5} style={{ marginBottom: '16px' }}>Bước 4: Bảng Quyết toán Hoàn trả Tiền cọc</Title>
            <Row gutter={[24, 20]}>
              <Col span={14}>
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <Text>Tiền cọc ban đầu của khách:</Text>
                    <Text strong>{formatCurrency(depositAmount)}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#dc2626' }}>
                    <Text>Trừ tổng phụ phí phát sinh:</Text>
                    <Text strong>-{formatCurrency(totalSurcharges)}</Text>
                  </div>
                  <Divider style={{ margin: '12px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong style={{ fontSize: '14px' }}>SỐ TIỀN HOÀN TRẢ KHÁCH HÀNG:</Text>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Chuyển khoản hoặc tiền mặt</div>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#16a34a' }}>
                      {formatCurrency(refundDeposit)}
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={10}>
                <Alert
                  type="success"
                  showIcon
                  message="Biên bản nghiệm thu"
                  description="Khách hàng và nhân viên vận hành đã đồng ý với bảng chiết tính phụ phí trên."
                />
              </Col>
            </Row>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <Title level={5} style={{ marginBottom: '16px' }}>Bước 5: Xác nhận Hoàn tất & Đóng đơn thuê</Title>
            <Alert
              type="info"
              showIcon
              message="Đóng đơn thuê xe"
              description="Xe sẽ được chuyển về trạng thái 'Bảo dưỡng' hoặc 'Có sẵn' để tiếp tục phục vụ khách hàng tiếp theo. Hợp đồng chuyển sang trạng thái HOÀN THÀNH."
            />
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
              style={{ borderRadius: '8px', background: '#9333ea', borderColor: '#9333ea', fontWeight: 700 }}
            >
              Quyết toán & Hoàn tất nhận xe
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
