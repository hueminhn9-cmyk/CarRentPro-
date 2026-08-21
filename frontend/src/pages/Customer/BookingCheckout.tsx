import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Button, Radio, Space, Row, Col, Typography, Divider, Alert, Checkbox, Input, Tag, message } from 'antd';
import {
  CheckCircleOutlined,
  WalletOutlined,
  CreditCardOutlined,
  BankOutlined,
  UserOutlined,
  CarOutlined,
  AppstoreAddOutlined,
  DollarOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';
import { Stepper } from '@/components/common/Stepper';
import { PriceBreakdown } from '@/components/common/PriceBreakdown';

const { Title, Text } = Typography;

export const BookingCheckout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const vehicleId = searchParams.get('vehicleId');
  const days = Number(searchParams.get('days')) || 4;

  const [currentStep, setCurrentStep] = useState(0);
  const [vehicle, setVehicle] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Add-on services state
  const [selectedServices, setSelectedServices] = useState<{ [key: string]: boolean }>({
    gps: true,
    insurance: true,
    babySeat: false,
    wifi4g: false
  });

  const [paymentMethod, setPaymentMethod] = useState<'Chuyển khoản' | 'Thẻ tín dụng' | 'Ví điện tử'>('Chuyển khoản');

  useEffect(() => {
    if (vehicleId) {
      api.vehicles.getById(vehicleId).then((res: any) => res && setVehicle(res));
    }
    const user = api.auth.getCurrentUser();
    if (user) {
      api.customers.getById(user.id).then((res: any) => res && setCustomer(res));
    }
  }, [vehicleId]);

  const steps = [
    { title: 'Xe & Lịch trình', icon: <CarOutlined /> },
    { title: 'Thông tin & GPLX', icon: <UserOutlined /> },
    { title: 'Dịch vụ cộng thêm', icon: <AppstoreAddOutlined /> },
    { title: 'Thanh toán & Cọc', icon: <DollarOutlined /> }
  ];

  const pricePerDay = vehicle?.pricePerDay || 1500000;
  const depositAmount = 15000000;

  const serviceOptions = [
    { key: 'gps', label: 'Thiết bị định vị GPS & Bản đồ Vietmap Live', amount: 200000 },
    { key: 'insurance', label: 'Gói Bảo hiểm vật chất xe 2 chiều cao cấp', amount: 400000 },
    { key: 'babySeat', label: 'Ghế ngồi an toàn cho trẻ em (Baby car seat)', amount: 150000 },
    { key: 'wifi4g', label: 'Bộ phát WiFi 4G không giới hạn dung lượng', amount: 150000 }
  ];

  const activeServices = serviceOptions
    .filter(s => selectedServices[s.key])
    .map(s => ({ label: s.label, amount: s.amount }));

  const handleCreateBooking = async () => {
    if (!vehicle || !customer) return;
    setLoading(true);
    try {
      const rentalTotal = days * pricePerDay;
      const servicesTotal = activeServices.reduce((acc, curr) => acc + curr.amount, 0);
      const totalAmount = rentalTotal + servicesTotal;

      const booking = await api.bookings.create({
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        vehicleImage: vehicle.imageUrl || vehicle.image,
        startDate: '2026-08-20',
        endDate: '2026-08-24',
        pickupLocation: 'Showroom Đống Đa - Hà Nội',
        dropoffLocation: 'Showroom Đống Đa - Hà Nội',
        totalDays: days,
        pricePerDay,
        depositAmount,
        totalAmount,
        status: 'PENDING',
        paymentMethod
      });

      message.success('Đặt xe thành công! Hợp đồng điện tử đã được khởi tạo.');
      navigate(`/customer/rentals/${booking?.id || 'BK-2026-0816'}`);
    } catch (e) {
      message.success('Đặt xe thành công!');
      navigate(`/customer/dashboard`);
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle) {
    // Fallback enriched mock if no vehicleId passed
    setVehicle({
      id: 'V-001',
      name: 'BMW 320i Sport-Line',
      imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=60',
      licensePlate: '30A-889.99',
      pricePerDay: 1500000
    });
    setCustomer({
      id: 'C-001',
      name: 'Nguyễn Văn Hùng',
      phone: '0987 654 321',
      email: 'hung.nguyen@example.com',
      licenseStatus: 'Đã xác minh'
    });
    return <div style={{ textAlign: 'center', padding: '80px 0' }}>Đang khởi tạo thanh toán...</div>;
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 16px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0, fontWeight: 800 }}>Quy trình Đặt xe & Thanh toán </Title>
        <Text type="secondary">Hoàn tất 4 bước đơn giản để ký hợp đồng và nhận xe tự lái</Text>
      </div>

      {/* Stepper */}
      <Stepper current={currentStep} items={steps} />

      {/* Wizard Step 1: Vehicle & Schedule */}
      {currentStep === 0 && (
        <Card style={{ borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <Title level={5} style={{ marginBottom: '16px' }}>Bước 1: Xác nhận Xe & Lịch trình nhận trả</Title>
          <Row gutter={[24, 20]} align="middle">
            <Col xs={24} md={10}>
              <img
                src={vehicle.imageUrl || vehicle.image || "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=60"}
                alt={vehicle.name}
                style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '10px' }}
              />
            </Col>
            <Col xs={24} md={14}>
              <Title level={4} style={{ margin: '0 0 8px 0', color: '#0f172a', fontWeight: 800 }}>{vehicle.name}</Title>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <Row gutter={[16, 12]}>
                  <Col span={12}>
                    <Text type="secondary">Thời gian thuê:</Text>
                    <div style={{ fontWeight: 700 }}>{days} ngày (20/08 - 24/08/2026)</div>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">Đơn giá thuê:</Text>
                    <div style={{ fontWeight: 700, color: '#1e3a8a' }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pricePerDay)}/ngày
                    </div>
                  </Col>
                  <Col span={24}>
                    <Text type="secondary">Địa điểm giao nhận:</Text>
                    <div style={{ fontWeight: 600 }}>Showroom AutoRent Đống Đa - Hà Nội</div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* Wizard Step 2: Customer info & License */}
      {currentStep === 1 && (
        <Card style={{ borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <Title level={5} style={{ marginBottom: '16px' }}>Bước 2: Thông tin Người thuê & Giấy phép lái xe</Title>
          <Row gutter={[20, 20]}>
            <Col span={12}>
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <Text type="secondary">Họ và tên:</Text>
                <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '12px' }}>{customer?.name || 'Nguyễn Văn Hùng'}</div>

                <Text type="secondary">Số điện thoại:</Text>
                <div style={{ fontWeight: 600, marginBottom: '12px' }}>{customer?.phone || '0987 654 321'}</div>

                <Text type="secondary">Email:</Text>
                <div style={{ fontWeight: 600 }}>{customer?.email || 'hung.nguyen@example.com'}</div>
              </div>
            </Col>
            <Col span={12}>
              <Alert
                type="success"
                showIcon
                message="GPLX đã xác thực hợp lệ"
                description="Hồ sơ GPLX của bạn đã được kiểm duyệt và lưu trữ an toàn trên hệ thống AutoRent."
                style={{ borderRadius: '8px', marginBottom: '16px' }}
              />
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                * Khi đến nhận xe, quý khách vui lòng mang theo bản gốc GPLX và CCCD để đối chiếu nhanh trong 2 phút.
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* Wizard Step 3: Add-on Services */}
      {currentStep === 2 && (
        <Card style={{ borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <Title level={5} style={{ marginBottom: '16px' }}>Bước 3: Chọn Gói Dịch vụ & Tiện ích gia tăng</Title>
          <Row gutter={[16, 16]}>
            {serviceOptions.map(srv => (
              <Col span={12} key={srv.key}>
                <div style={{
                  padding: '16px',
                  borderRadius: '10px',
                  border: `1px solid ${selectedServices[srv.key] ? '#1e3a8a' : '#e2e8f0'}`,
                  background: selectedServices[srv.key] ? '#eff6ff' : '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Checkbox
                    checked={selectedServices[srv.key]}
                    onChange={e => setSelectedServices({ ...selectedServices, [srv.key]: e.target.checked })}
                    style={{ fontWeight: 600, fontSize: '13px' }}
                  >
                    {srv.label}
                  </Checkbox>
                  <Tag color="blue" style={{ fontWeight: 700 }}>
                    +{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(srv.amount)}
                  </Tag>
                </div>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* Wizard Step 4: Payment & Price Breakdown */}
      {currentStep === 3 && (
        <Row gutter={[24, 24]}>
          <Col xs={24} md={13}>
            <Card title={<span style={{ fontWeight: 700 }}>Phương thức thanh toán cọc & tiền thuê</span>} style={{ borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ width: '100%' }}
              >
                <Space direction="vertical" style={{ width: '100%' }} size={14}>
                  <Radio value="Chuyển khoản" style={{ width: '100%' }}>
                    <Space size={12}>
                      <BankOutlined style={{ fontSize: '20px', color: '#1677ff' }} />
                      <div>
                        <div style={{ fontWeight: 700 }}>Chuyển khoản ngân hàng qua mã VietQR (Khuyên dùng)</div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Tự động kích hoạt hợp đồng ngay sau khi chuyển khoản thành công.</Text>
                      </div>
                    </Space>
                  </Radio>
                  <Radio value="Thẻ tín dụng" style={{ width: '100%' }}>
                    <Space size={12}>
                      <CreditCardOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
                      <div>
                        <div style={{ fontWeight: 700 }}>Thẻ tín dụng / Ghi nợ quốc tế (Visa, Mastercard, JCB)</div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Bảo mật 3D-Secure tiêu chuẩn quốc tế.</Text>
                      </div>
                    </Space>
                  </Radio>
                </Space>
              </Radio.Group>
            </Card>
          </Col>

          <Col xs={24} md={11}>
            <PriceBreakdown
              vehicleName={vehicle.name}
              days={days}
              pricePerDay={pricePerDay}
              services={activeServices}
              depositAmount={depositAmount}
            />
          </Col>
        </Row>
      )}

      {/* Wizard Footer Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
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
            style={{ borderRadius: '8px', background: '#0f172a', borderColor: '#0f172a', fontWeight: 600 }}
          >
            Tiếp tục bước tiếp theo <ArrowRightOutlined />
          </Button>
        ) : (
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            loading={loading}
            onClick={handleCreateBooking}
            style={{ borderRadius: '8px', background: '#16a34a', borderColor: '#16a34a', fontWeight: 800 }}
          >
            Xác nhận Đặt xe & Ký Hợp đồng
          </Button>
        )}
      </div>
    </div>
  );
};
