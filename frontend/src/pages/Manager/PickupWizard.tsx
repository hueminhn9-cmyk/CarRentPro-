import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Checkbox, Input, Button, Upload, message, Divider, Space, Tag, Alert, Spin } from 'antd';
import {
  UserOutlined,
  FileDoneOutlined,
  CarOutlined,
  CameraOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  UploadOutlined,
  SafetyCertificateOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  CalendarOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { Stepper } from '@/components/common/Stepper';
import { api } from '@/services/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const PickupWizard: React.FC = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams<{ bookingId: string }>();
  const [currentStep, setCurrentStep] = useState(0);

  // Data states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [vehicle, setVehicle] = useState<any>(null);

  // Form states
  const [checklist, setChecklist] = useState({
    exterior: true,
    interior: true,
    tires: true,
    fuelOdo: true,
    keys: true,
    documents: true
  });

  const [notes, setNotes] = useState('');
  const [odometer, setOdometer] = useState('24580');
  const [fuelLevel, setFuelLevel] = useState('100%');
  const [licenseMatchChecked, setLicenseMatchChecked] = useState(true);
  const [photos, setPhotos] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchBookingData = async () => {
      if (!bookingId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const b = await api.bookings.getById(bookingId);
        if (b) {
          setBooking(b);
          if (b.customerId) {
            try {
              const c = await api.customers.getById(b.customerId);
              setCustomer(c);
            } catch (err) {
              console.error('Failed to load customer profile', err);
            }
          }
          if (b.vehicleId) {
            try {
              const v = await api.vehicles.getById(b.vehicleId);
              setVehicle(v);
            } catch (err) {
              console.error('Failed to load vehicle details', err);
            }
          }
        }
      } catch (err: any) {
        message.error(err.response?.data?.message || 'Không thể tìm thấy thông tin đơn đặt xe');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId]);

  const steps = [
    { title: 'Khách hàng', icon: <UserOutlined /> },
    { title: 'Giấy tờ & GPLX', icon: <FileDoneOutlined /> },
    { title: 'Checklist xe', icon: <CarOutlined /> },
    { title: 'Chụp ảnh 6 góc', icon: <CameraOutlined /> },
    { title: 'Xác nhận bàn giao', icon: <CheckCircleOutlined /> }
  ];

  const photoLabels = [
    'Mặt trước đầu xe',
    'Đuôi xe & Biển số',
    'Thân xe bên trái',
    'Thân xe bên phải',
    'Khoang lái & Taplo',
    'Đồng hồ Odometer'
  ];

  const handlePhotoUpload = (label: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotos((prev) => ({
        ...prev,
        [label]: e.target?.result as string
      }));
      message.success(`Đã chụp ảnh: ${label}`);
    };
    reader.readAsDataURL(file);
    return false; // prevent automatic upload
  };

  const handleComplete = async () => {
    if (!booking) return;
    setSubmitting(true);
    try {
      const parsedOdo = parseInt(odometer.replace(/[^0-9]/g, '')) || 25000;
      const parsedFuel = parseInt(fuelLevel.replace(/[^0-9]/g, '')) || 100;
      const photoUrls = Object.values(photos);

      await api.handover.create({
        booking_id: booking.id,
        record_type: 'PICKUP',
        mileage: parsedOdo,
        fuel_level: parsedFuel,
        vehicle_condition: 'GOOD',
        checklist,
        photos: photoUrls,
        note: notes || 'Hoàn tất kiểm tra và bàn giao xe cho khách hàng.'
      });

      message.success(`Đã hoàn tất bàn giao xe cho đơn #${booking.bookingCode}! Đơn chuyển sang ACTIVE và xe chuyển sang RENTED.`);
      navigate('/manager/operations/today');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Lỗi khi lưu biên bản bàn giao xe';
      message.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px', color: '#64748b' }}>Đang nạp dữ liệu đơn thuê và thông tin xe...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center' }}>
        <Alert
          type="error"
          message="Không tìm thấy đơn đặt xe"
          description={`Không tìm thấy mã đơn #${bookingId}. Vui lòng quay lại danh sách điều hành.`}
          showIcon
          action={
            <Button type="primary" onClick={() => navigate('/manager/operations/today')}>
              Về Lịch trình Vận hành
            </Button>
          }
        />
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const customerName = customer?.name || booking.customerName || 'N/A';
  const customerPhone = customer?.phone || booking.customerPhone || 'N/A';
  const customerEmail = customer?.email || booking.customerEmail || 'N/A';
  const customerCccd = customer?.idCard || 'Đã cập nhật hệ thống';
  const licenseFront = customer?.licenseFront || customer?.frontImage || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=60';
  const licenseBack = customer?.licenseBack || customer?.backImage || 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=500&auto=format&fit=crop&q=60';
  const vehicleName = vehicle?.name || booking.vehicleName || 'Xe AutoRent';
  const licensePlate = vehicle?.licensePlate || 'N/A';

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/manager/operations/today')}>
            Quay lại
          </Button>
          <div>
            <Title level={4} style={{ margin: 0, fontWeight: 800 }}>
              Quy trình Bàn giao xe (Pickup Wizard)
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Mã đơn: #{booking.bookingCode} • {vehicleName} ({licensePlate})
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
              <Col xs={24} md={12}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <Text type="secondary">Họ và tên khách hàng</Text>
                  <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>{customerName}</div>
                  
                  <Divider style={{ margin: '12px 0' }} />
                  
                  <Text type="secondary">Số điện thoại liên hệ</Text>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>
                    <PhoneOutlined style={{ marginRight: '6px', color: '#2563eb' }} />
                    {customerPhone}
                  </div>

                  <Divider style={{ margin: '12px 0' }} />

                  <Text type="secondary">Email</Text>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>
                    <MailOutlined style={{ marginRight: '6px', color: '#2563eb' }} />
                    {customerEmail}
                  </div>

                  <Divider style={{ margin: '12px 0' }} />

                  <Text type="secondary">Số CCCD / Hộ chiếu</Text>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>
                    <IdcardOutlined style={{ marginRight: '6px', color: '#2563eb' }} />
                    {customerCccd}
                  </div>
                </div>
              </Col>

              <Col xs={24} md={12}>
                <Alert
                  type={customer?.licenseStatus === 'Đã xác minh' ? 'success' : 'warning'}
                  showIcon
                  message={customer?.licenseStatus === 'Đã xác minh' ? 'Hồ sơ đã được phê duyệt hợp lệ' : `Trạng thái giấy tờ: ${customer?.licenseStatus || 'Chờ đối chiếu'}`}
                  description="Khách hàng đã ký hợp đồng điện tử và cam kết tuân thủ quy định vận hành xe."
                  style={{ borderRadius: '8px', marginBottom: '16px' }}
                />

                <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontWeight: 600, color: '#1e3a8a', marginBottom: '6px' }}>
                    <CalendarOutlined style={{ marginRight: '6px' }} />
                    Lịch trình thuê xe:
                  </div>
                  <div style={{ fontSize: '13px', color: '#1e3a8a' }}>
                    <strong>Bắt đầu:</strong> {dayjs(booking.startDate).format('DD/MM/YYYY')} ({booking.pickupLocation || 'Showroom AutoRent'})<br/>
                    <strong>Kết thúc:</strong> {dayjs(booking.endDate).format('DD/MM/YYYY')} ({booking.dropoffLocation || 'Showroom AutoRent'})<br/>
                    <strong>Tổng thời gian:</strong> {booking.totalDays} ngày
                  </div>
                  <Divider style={{ margin: '10px 0', borderColor: '#bfdbfe' }} />
                  <div style={{ fontSize: '13px', color: '#1e3a8a' }}>
                    <strong>Tổng giá trị đơn:</strong> {formatPrice(booking.totalAmount)}
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
              <Col xs={24} sm={12}>
                <Card size="small" title="GPLX Mặt trước" style={{ borderRadius: '8px', textAlign: 'center' }}>
                  <img 
                    src={licenseFront} 
                    alt="GPLX Front" 
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '6px' }} 
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card size="small" title="GPLX Mặt sau" style={{ borderRadius: '8px', textAlign: 'center' }}>
                  <img 
                    src={licenseBack} 
                    alt="GPLX Back" 
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '6px' }} 
                  />
                </Card>
              </Col>
            </Row>
            <div style={{ marginTop: '20px', background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <Checkbox 
                checked={licenseMatchChecked}
                onChange={e => setLicenseMatchChecked(e.target.checked)}
                style={{ fontWeight: 600, fontSize: '14px' }}
              >
                Nhân viên đã kiểm tra trực tiếp bản gốc GPLX, trùng khớp với thông tin và ảnh chụp trên hệ thống
              </Checkbox>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <Title level={5} style={{ marginBottom: '16px' }}>Bước 3: Checklist Tình trạng Xe trước khi Bàn giao</Title>
            <Row gutter={[20, 16]}>
              <Col xs={24} sm={12}>
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
              <Col xs={24} sm={12}>
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
              <Col xs={24} sm={12}>
                <Text strong>Số Odometer (Km hiện tại):</Text>
                <Input value={odometer} onChange={e => setOdometer(e.target.value)} style={{ marginTop: '6px' }} />
              </Col>
              <Col xs={24} sm={12}>
                <Text strong>Mức nhiên liệu / Dung lượng Pin:</Text>
                <Input value={fuelLevel} onChange={e => setFuelLevel(e.target.value)} style={{ marginTop: '6px' }} />
              </Col>
            </Row>

            <div style={{ marginTop: '16px' }}>
              <Text strong>Ghi chú biên bản bàn giao (nếu có):</Text>
              <TextArea 
                rows={2} 
                value={notes} 
                onChange={e => setNotes(e.target.value)} 
                placeholder="Nhập ghi chú hiện trạng bàn giao hoặc thỏa thuận đặc biệt..."
                style={{ marginTop: '6px' }} 
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <Title level={5} style={{ marginBottom: '16px' }}>Bước 4: Chụp & Tải lên ảnh Hiện trạng 6 góc</Title>
            <Row gutter={[16, 16]}>
              {photoLabels.map((label, idx) => {
                const photoSrc = photos[label];
                return (
                  <Col xs={24} sm={12} md={8} key={idx}>
                    <Card size="small" title={label} style={{ textAlign: 'center', borderRadius: '8px' }}>
                      <div style={{ height: '110px', background: '#f1f5f9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', overflow: 'hidden' }}>
                        {photoSrc ? (
                          <img src={photoSrc} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <CameraOutlined style={{ fontSize: '26px', color: '#94a3b8' }} />
                        )}
                      </div>
                      <Upload 
                        showUploadList={false} 
                        beforeUpload={(file) => handlePhotoUpload(label, file)}
                      >
                        <Button size="small" icon={<UploadOutlined />}>
                          {photoSrc ? 'Đổi ảnh' : 'Tải ảnh lên'}
                        </Button>
                      </Upload>
                    </Card>
                  </Col>
                );
              })}
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
              description="Sau khi hoàn tất, xe sẽ tự động chuyển sang trạng thái ĐANG THUÊ (ACTIVE). Hệ thống sẽ cập nhật trạng thái xe thành RENTED và kích hoạt hợp đồng thuê."
              style={{ marginBottom: '20px' }}
            />

            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <Text type="secondary">Khách hàng nhận:</Text>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{customerName}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{customerPhone}</div>
                </Col>
                <Col xs={24} sm={8}>
                  <Text type="secondary">Xe bàn giao:</Text>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{vehicleName}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Biển số: {licensePlate}</div>
                </Col>
                <Col xs={24} sm={8}>
                  <Text type="secondary">Odo ban đầu & Nhiên liệu:</Text>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{odometer} km</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Nhiên liệu: {fuelLevel}</div>
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
              loading={submitting}
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
