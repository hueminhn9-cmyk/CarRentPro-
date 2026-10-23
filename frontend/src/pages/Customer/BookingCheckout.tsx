import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Button, Radio, Space, Row, Col, Typography, Divider, Alert, Checkbox, Select, Tag, message, Spin, Result } from 'antd';
import {
  CheckCircleOutlined,
  CreditCardOutlined,
  BankOutlined,
  UserOutlined,
  CarOutlined,
  AppstoreAddOutlined,
  DollarOutlined,
  ArrowRightOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { api } from '@/services/api';
import { Stepper } from '@/components/common/Stepper';
import { PriceBreakdown } from '@/components/common/PriceBreakdown';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export const BookingCheckout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const vehicleId = searchParams.get('vehicleId');
  const days = Number(searchParams.get('days')) || 4;
  const initialPickup = searchParams.get('pickup') ? decodeURIComponent(searchParams.get('pickup')!) : '';
  const initialDropoff = searchParams.get('dropoff') ? decodeURIComponent(searchParams.get('dropoff')!) : '';

  const [currentStep, setCurrentStep] = useState(0);
  const [initLoading, setInitLoading] = useState(true);
  const [vehicle, setVehicle] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [pickupLocation, setPickupLocation] = useState(initialPickup || 'Showroom Sân Bay Đà Nẵng');
  const [dropoffLocation, setDropoffLocation] = useState(initialDropoff || initialPickup || 'Showroom Chi Nhánh Trung Tâm - Hải Châu');
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
    const initData = async () => {
      setInitLoading(true);
      try {
        // Load locations
        const locs = await api.locations.getAll();
        if (locs && locs.length > 0) {
          setLocations(locs);
          if (!initialPickup) setPickupLocation(locs[0].name);
          if (!initialDropoff) setDropoffLocation(locs[0].name);
        }

        // Load vehicle
        if (vehicleId) {
          const v = await api.vehicles.getById(vehicleId);
          setVehicle(v);
        }

        // Load customer
        const currentUser = api.auth.getCurrentUser();
        if (currentUser) {
          const c = await api.customers.getById(currentUser.id);
          setCustomer(c);
        }
      } catch (err: any) {
        console.error('Failed to initialize checkout data', err);
      } finally {
        setInitLoading(false);
      }
    };

    initData();
  }, [vehicleId]);

  const steps = [
    { title: 'Xe & Lịch trình', icon: <CarOutlined /> },
    { title: 'Thông tin & GPLX', icon: <UserOutlined /> },
    { title: 'Dịch vụ cộng thêm', icon: <AppstoreAddOutlined /> },
    { title: 'Thanh toán & Cọc', icon: <DollarOutlined /> }
  ];

  const pricePerDay = vehicle?.pricePerDay || 1500000;
  const depositAmount = vehicle?.depositAmount || (pricePerDay * 10);

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
    if (!vehicle) {
      message.error('Vui lòng chọn xe trước khi đặt.');
      return;
    }

    setLoading(true);
    try {
      const servicesPayload = activeServices.map(s => ({
        service_name: s.label,
        quantity: 1,
        unit_price: s.amount
      }));

      const startDateParam = searchParams.get('startDate');
      const startDayjs = startDateParam ? dayjs(startDateParam) : dayjs().add(1, 'day');
      const endDayjs = searchParams.get('endDate') ? dayjs(searchParams.get('endDate')) : startDayjs.add(days, 'day');

      const booking = await api.bookings.create({
        vehicleId: vehicle.id,
        startDate: startDayjs.toISOString(),
        endDate: endDayjs.toISOString(),
        pickupLocation,
        dropoffLocation,
        notes: `Phương thức thanh toán dự kiến: ${paymentMethod}`,
        services: servicesPayload
      });

      message.success('Đặt xe thành công! Hợp đồng điện tử đã được khởi tạo.');
      navigate(`/customer/rentals/${booking.id}`);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Không thể tạo đơn đặt xe. Vui lòng thử lại!';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (initLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px', color: '#64748b' }}>Đang nạp thông tin xe và hồ sơ khách hàng...</div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center' }}>
        <Result
          status="warning"
          title="Chưa chọn xe để đặt"
          subTitle="Vui lòng duyệt danh sách xe và chọn chiếc xe yêu thích trước khi tiến hành đặt xe."
          extra={
            <Button type="primary" onClick={() => navigate('/vehicles')} style={{ borderRadius: '8px' }}>
              Duyệt danh sách xe có sẵn
            </Button>
          }
        />
      </div>
    );
  }

  const locationOptions = locations.length > 0
    ? locations.map(loc => ({ value: loc.name, label: `${loc.name} (${loc.address || loc.district || 'Đà Nẵng'})` }))
    : [
        { value: 'Showroom Sân Bay Đà Nẵng', label: 'Showroom Sân Bay Đà Nẵng' },
        { value: 'Showroom Chi Nhánh Trung Tâm - Hải Châu', label: 'Showroom Chi Nhánh Trung Tâm - Hải Châu' },
        { value: 'Showroom Chi Nhánh Sơn Trà - Biển Mỹ Khê', label: 'Showroom Chi Nhánh Sơn Trà - Biển Mỹ Khê' },
        { value: 'Showroom Chi Nhánh Thanh Khê', label: 'Showroom Chi Nhánh Thanh Khê' }
      ];

  const isLicenseVerified = customer?.licenseStatus === 'Đã xác minh';

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 16px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0, fontWeight: 800 }}>Quy trình Đặt xe & Thanh toán</Title>
        <Text type="secondary">Hoàn tất các bước đơn giản để khởi tạo hợp đồng điện tử và nhận xe tự lái</Text>
      </div>

      {/* Stepper */}
      <Stepper current={currentStep} items={steps} />

      {/* Wizard Step 1: Vehicle & Schedule */}
      {currentStep === 0 && (
        <Card style={{ borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <Title level={5} style={{ marginBottom: '16px' }}>Bước 1: Xác nhận Xe & Lịch trình nhận/trả xe</Title>
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
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                <Row gutter={[16, 12]}>
                  <Col span={12}>
                    <Text type="secondary">Thời gian thuê:</Text>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>{days} ngày</div>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">Đơn giá thuê xe:</Text>
                    <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '15px' }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pricePerDay)}/ngày
                    </div>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">Tiền cọc thế chấp:</Text>
                    <div style={{ fontWeight: 700, color: '#d97706', fontSize: '15px' }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(depositAmount)}
                    </div>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">Biển số dự kiến:</Text>
                    <div style={{ fontWeight: 600 }}>{vehicle.licensePlate}</div>
                  </Col>
                </Row>
              </div>

              <Row gutter={[12, 12]}>
                <Col xs={24} sm={12}>
                  <Text strong style={{ fontSize: '12px' }}>Chi nhánh Showroom nhận xe:</Text>
                  <Select
                    value={pickupLocation}
                    onChange={setPickupLocation}
                    options={locationOptions}
                    style={{ width: '100%', marginTop: '4px' }}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <Text strong style={{ fontSize: '12px' }}>Chi nhánh Showroom trả xe:</Text>
                  <Select
                    value={dropoffLocation}
                    onChange={setDropoffLocation}
                    options={locationOptions}
                    style={{ width: '100%', marginTop: '4px' }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      )}

      {/* Wizard Step 2: Customer info & License verification check */}
      {currentStep === 1 && (
        <Card style={{ borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <Title level={5} style={{ marginBottom: '16px' }}>Bước 2: Thông tin Người thuê & Giấy phép lái xe (GPLX)</Title>
          <Row gutter={[20, 20]}>
            <Col xs={24} md={12}>
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <Text type="secondary">Họ và tên khách hàng:</Text>
                <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '12px', color: '#0f172a' }}>
                  {customer?.name || 'Khách hàng'}
                </div>

                <Text type="secondary">Số điện thoại liên hệ:</Text>
                <div style={{ fontWeight: 600, marginBottom: '12px' }}>{customer?.phone || 'Chưa cập nhật SĐT'}</div>

                <Text type="secondary">Email tài khoản:</Text>
                <div style={{ fontWeight: 600, marginBottom: '12px' }}>{customer?.email || 'N/A'}</div>

                <Text type="secondary">Số hiệu GPLX:</Text>
                <div style={{ fontWeight: 600, color: '#1e3a8a' }}>{customer?.driverLicense || 'Chưa cung cấp'}</div>
              </div>
            </Col>

            <Col xs={24} md={12}>
              {isLicenseVerified ? (
                <Alert
                  type="success"
                  showIcon
                  icon={<SafetyCertificateOutlined />}
                  message="GPLX đã được xác thực hợp lệ"
                  description="Hồ sơ GPLX của bạn đã được đối chiếu và phê duyệt. Bạn hoàn toàn đủ điều kiện nhận xe ngay khi tới Showroom."
                  style={{ borderRadius: '8px', marginBottom: '16px' }}
                />
              ) : (
                <Alert
                  type="warning"
                  showIcon
                  icon={<WarningOutlined />}
                  message="Lưu ý điều kiện Giấy phép lái xe"
                  description={
                    <div>
                      <div>Trạng thái GPLX hiện tại: <strong>{customer?.licenseStatus || 'Chưa xác minh'}</strong>.</div>
                      <div style={{ marginTop: '4px' }}>
                        Để nhận xe tại Showroom, quý khách cần có GPLX ô tô còn hạn và được phê duyệt. Quý khách có thể tải lên bổ sung giấy tờ trước giờ nhận xe.
                      </div>
                      <Button
                        size="small"
                        type="link"
                        onClick={() => navigate('/customer/documents')}
                        style={{ paddingLeft: 0, marginTop: '6px', fontWeight: 600 }}
                      >
                        Quản lý giấy tờ & GPLX của bạn &rarr;
                      </Button>
                    </div>
                  }
                  style={{ borderRadius: '8px', marginBottom: '16px' }}
                />
              )}

              <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '13px', color: '#1e3a8a' }}>
                <strong>Quy trình bàn giao:</strong> Khi đến nhận xe, quý khách vui lòng mang theo bản gốc GPLX và CCCD để đối chiếu nhanh với nhân viên vận hành trong 2 phút.
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
              <Col xs={24} sm={12} key={srv.key}>
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
                        <Text type="secondary" style={{ fontSize: '12px' }}>Tự động đối soát và kích hoạt hợp đồng ngay sau khi chuyển khoản.</Text>
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
            Xác nhận Đặt xe & Khởi tạo Hợp đồng
          </Button>
        )}
      </div>
    </div>
  );
};
