import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Input, Button, InputNumber, Divider, Space, Tag, Alert, Spin, Select, message } from 'antd';
import {
  CarOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CalculatorOutlined,
  FileDoneOutlined,
  UserOutlined,
  PhoneOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { Stepper } from '@/components/common/Stepper';
import { api } from '@/services/api';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export const ReturnWizard: React.FC = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams<{ bookingId: string }>();
  const [currentStep, setCurrentStep] = useState(0);

  // Data states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [vehicle, setVehicle] = useState<any>(null);

  // Return inspection states
  const [startOdo, setStartOdo] = useState(24580);
  const [endOdo, setEndOdo] = useState(24950);
  const [fuelDiff, setFuelDiff] = useState(0); // in VND
  const [fuelLevel, setFuelLevel] = useState(100);
  const [lateHours, setLateHours] = useState(0);
  const [cleaningFee, setCleaningFee] = useState(0);
  const [damageFee, setDamageFee] = useState(0);
  const [damageDescription, setDamageDescription] = useState('');
  const [vehicleCondition, setVehicleCondition] = useState<'EXCELLENT' | 'GOOD' | 'NORMAL' | 'DAMAGED'>('GOOD');
  const [notes, setNotes] = useState('');

  const depositAmount = booking?.depositAmount || (booking?.pricePerDay ? booking.pricePerDay * 10 : 15000000);

  useEffect(() => {
    const fetchReturnData = async () => {
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
              console.error('Failed to fetch customer in return wizard', err);
            }
          }
          if (b.vehicleId) {
            try {
              const v = await api.vehicles.getById(b.vehicleId);
              setVehicle(v);
            } catch (err) {
              console.error('Failed to fetch vehicle in return wizard', err);
            }
          }

          // Fetch original pickup handover record to get accurate startOdo
          try {
            const handovers = await api.handover.getByBookingId(bookingId);
            const pickupRecord = handovers.find((h: any) => h.record_type === 'PICKUP');
            if (pickupRecord) {
              const odo = Number(pickupRecord.mileage) || 24580;
              setStartOdo(odo);
              setEndOdo(odo + 150);
            } else if ((b as any)?.vehicle?.current_mileage) {
              setStartOdo((b as any).vehicle.current_mileage);
              setEndOdo((b as any).vehicle.current_mileage + 150);
            }
          } catch (err) {
            console.error('Failed to load handover records', err);
          }
        }
      } catch (err: any) {
        message.error(err.response?.data?.message || 'Không thể tìm thấy thông tin đơn trả xe');
      } finally {
        setLoading(false);
      }
    };

    fetchReturnData();
  }, [bookingId]);

  const steps = [
    { title: 'Thông tin hoàn trả', icon: <CarOutlined /> },
    { title: 'Kiểm tra Odo & Nhiên liệu', icon: <CalculatorOutlined /> },
    { title: 'Tính toán phụ phí', icon: <DollarOutlined /> },
    { title: 'Tổng kết & Quyết toán', icon: <FileDoneOutlined /> },
    { title: 'Xác nhận hoàn tất', icon: <CheckCircleOutlined /> }
  ];

  // Fee calculation rules
  const extraKm = Math.max(0, (endOdo - startOdo) - 300); // 300km limit per trip allowance
  const kmFee = extraKm * 5000; // 5k VND per km extra
  const lateFee = lateHours * 100000; // 100k VND per late hour
  const totalSurcharges = kmFee + lateFee + fuelDiff + cleaningFee + damageFee;
  const refundDeposit = Math.max(0, depositAmount - totalSurcharges);
  const customerOwing = totalSurcharges > depositAmount ? totalSurcharges - depositAmount : 0;

  // Auto set vehicle condition if damage fee is assessed
  useEffect(() => {
    if (damageFee > 0 && vehicleCondition !== 'DAMAGED') {
      setVehicleCondition('DAMAGED');
    }
  }, [damageFee]);

  const handleComplete = async () => {
    if (!booking) return;
    setSubmitting(true);
    try {
      await api.handover.create({
        booking_id: booking.id,
        record_type: 'RETURN',
        mileage: endOdo,
        fuel_level: fuelLevel,
        vehicle_condition: vehicleCondition,
        damage_description: damageDescription || (damageFee > 0 ? 'Phát hiện trầy xước/hư hại khi trả xe' : null),
        late_fee: lateFee,
        extra_km_fee: kmFee,
        fuel_fee: fuelDiff,
        cleaning_fee: cleaningFee,
        damage_fee: damageFee,
        refundable_deposit: refundDeposit,
        note: notes || `Hoàn tất nhận xe trả. Tổng phụ phí: ${totalSurcharges.toLocaleString()}đ`
      });

      message.success(`Đã hoàn tất thủ tục nhận xe trả và quyết toán hợp đồng #${booking.bookingCode}!`);
      navigate('/manager/operations/today');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Lỗi khi hoàn tất thủ tục trả xe';
      message.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px', color: '#64748b' }}>Đang nạp dữ liệu đơn thuê và biên bản bàn giao...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center' }}>
        <Alert
          type="error"
          message="Không tìm thấy đơn đặt xe"
          description={`Không tìm thấy mã đơn #${bookingId}. Vui lòng quay lại.`}
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

  const customerName = customer?.name || booking.customerName || 'N/A';
  const customerPhone = customer?.phone || booking.customerPhone || 'N/A';
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
              Quy trình Nhận xe trả & Quyết toán (Return Wizard)
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Mã đơn: #{booking.bookingCode} • {vehicleName} ({licensePlate})
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
              <Col xs={24} md={12}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <Text type="secondary">Khách hàng thuê xe</Text>
                  <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>
                    <UserOutlined style={{ marginRight: '6px', color: '#2563eb' }} />
                    {customerName}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                    <PhoneOutlined style={{ marginRight: '6px' }} />
                    {customerPhone}
                  </div>
                  
                  <Divider style={{ margin: '12px 0' }} />
                  
                  <Text type="secondary">Tiền cọc thế chấp ban đầu</Text>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
                    {formatCurrency(depositAmount)}
                  </div>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <Text type="secondary">Xe bàn giao hoàn trả</Text>
                  <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>
                    <CarOutlined style={{ marginRight: '6px', color: '#2563eb' }} />
                    {vehicleName} ({licensePlate})
                  </div>
                  
                  <Divider style={{ margin: '12px 0' }} />
                  
                  <Text type="secondary">Chỉ số Odometer khi bàn giao lúc nhận:</Text>
                  <div style={{ fontSize: '15px', fontWeight: 700, marginTop: '4px', color: '#1e3a8a' }}>
                    {startOdo.toLocaleString()} km
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <Title level={5} style={{ marginBottom: '16px' }}>Bước 2: Ghi nhận Chỉ số Odometer & Nhiên liệu thực tế</Title>
            <Row gutter={[20, 20]}>
              <Col xs={24} sm={12}>
                <Card size="small" title="Chỉ số Kilomet (Odometer)" style={{ borderRadius: '8px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <Text type="secondary">Odo khi nhận xe: </Text>
                    <Text strong>{startOdo.toLocaleString()} km</Text>
                  </div>
                  <div>
                    <Text strong>Odo khi trả xe (Nhập số thực tế):</Text>
                    <InputNumber 
                      value={endOdo} 
                      min={startOdo}
                      onChange={val => setEndOdo(val || startOdo)}
                      style={{ width: '100%', marginTop: '6px' }} 
                    />
                  </div>
                  <div style={{ marginTop: '12px', fontSize: '13px', color: extraKm > 0 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
                    Đã chạy: {endOdo - startOdo} km {extraKm > 0 ? `(Vượt hạn mức ${extraKm} km • Phụ phí: ${formatCurrency(kmFee)})` : '(Trong hạn mức 300km/chuyến)'}
                  </div>
                </Card>
              </Col>

              <Col xs={24} sm={12}>
                <Card size="small" title="Nhiên liệu / Dung lượng Pin" style={{ borderRadius: '8px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <Text type="secondary">Mức khi nhận xe: </Text>
                    <Text strong>100% (Đầy bình/pin)</Text>
                  </div>
                  <div>
                    <Text strong>Mức nhiên liệu hiện tại (%):</Text>
                    <InputNumber
                      min={0}
                      max={100}
                      value={fuelLevel}
                      onChange={val => {
                        const level = val || 0;
                        setFuelLevel(level);
                        if (level < 100) {
                          setFuelDiff((100 - level) * 5000); // 5k VND per 1% deficient
                        } else {
                          setFuelDiff(0);
                        }
                      }}
                      style={{ width: '100%', marginTop: '6px' }}
                      addonAfter="%"
                    />
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <Text type="secondary">Tiền bù thiếu hụt xăng/pin:</Text>
                    <InputNumber
                      value={fuelDiff}
                      onChange={val => setFuelDiff(val || 0)}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value!.replace(/\$\s?|(,*)/g, '') as any}
                      style={{ width: '100%', marginTop: '4px' }}
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
            <Title level={5} style={{ marginBottom: '16px' }}>Bước 3: Chi tiết các Khoản Phụ phí & Tình trạng xe</Title>
            <Row gutter={[20, 16]}>
              <Col xs={24} md={12}>
                <div style={{ marginBottom: '14px' }}>
                  <Text strong>Phụ phí trễ giờ (Số giờ trả muộn):</Text>
                  <InputNumber 
                    value={lateHours} 
                    min={0}
                    onChange={val => setLateHours(val || 0)} 
                    style={{ width: '100%', marginTop: '4px' }} 
                    addonAfter="giờ" 
                  />
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Đơn giá quy định: 100,000đ/giờ trễ</div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <Text strong>Phí vệ sinh nội thất (nếu quá bẩn hoặc có mùi thuốc lá):</Text>
                  <InputNumber 
                    value={cleaningFee} 
                    min={0}
                    onChange={val => setCleaningFee(val || 0)} 
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value!.replace(/\$\s?|(,*)/g, '') as any}
                    style={{ width: '100%', marginTop: '4px' }} 
                    addonAfter="VND" 
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <Text strong>Đánh giá tình trạng hoàn trả của xe:</Text>
                  <Select 
                    value={vehicleCondition} 
                    onChange={setVehicleCondition}
                    style={{ width: '100%', marginTop: '4px' }}
                  >
                    <Option value="EXCELLENT">Rất tốt (EXCELLENT) - Xe như mới</Option>
                    <Option value="GOOD">Tốt (GOOD) - Đúng chuẩn bàn giao</Option>
                    <Option value="NORMAL">Bình thường (NORMAL) - Bụi bẩn nhẹ</Option>
                    <Option value="DAMAGED">Có hư hại (DAMAGED) - Cần bảo dưỡng</Option>
                  </Select>
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div style={{ marginBottom: '14px' }}>
                  <Text strong>Phí bồi thường hư hại ngoại thất/phụ kiện:</Text>
                  <InputNumber 
                    value={damageFee} 
                    min={0}
                    onChange={val => setDamageFee(val || 0)} 
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value!.replace(/\$\s?|(,*)/g, '') as any}
                    style={{ width: '100%', marginTop: '4px' }} 
                    addonAfter="VND" 
                  />
                  {damageFee > 0 && (
                    <Input 
                      placeholder="Mô tả chi tiết vết hư hại/móp méo..." 
                      value={damageDescription} 
                      onChange={e => setDamageDescription(e.target.value)} 
                      style={{ marginTop: '6px' }} 
                    />
                  )}
                </div>

                <div style={{ background: '#fef2f2', padding: '16px', borderRadius: '8px', border: '1px solid #fecaca' }}>
                  <div style={{ fontSize: '13px', color: '#991b1b', fontWeight: 600 }}>TỔNG PHỤ PHÍ PHÁT SINH:</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>
                    {formatCurrency(totalSurcharges)}
                  </div>
                  <div style={{ fontSize: '11px', color: '#b91c1c', marginTop: '4px' }}>
                    (Km: {formatCurrency(kmFee)} • Trễ giờ: {formatCurrency(lateFee)} • Xăng: {formatCurrency(fuelDiff)} • Vệ sinh: {formatCurrency(cleaningFee)} • Hư hại: {formatCurrency(damageFee)})
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
              <Col xs={24} md={14}>
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
                  {customerOwing > 0 ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <Text strong style={{ fontSize: '14px', color: '#dc2626' }}>KHÁCH HÀNG CẦN NỘP THÊM:</Text>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Phụ phí vượt mức tiền cọc</div>
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#dc2626' }}>
                        {formatCurrency(customerOwing)}
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <Text strong style={{ fontSize: '14px', color: '#16a34a' }}>SỐ TIỀN HOÀN TRẢ KHÁCH HÀNG:</Text>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Hoàn cọc qua chuyển khoản hoặc tiền mặt</div>
                      </div>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: '#16a34a' }}>
                        {formatCurrency(refundDeposit)}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '16px' }}>
                  <Text strong>Ghi chú quyết toán:</Text>
                  <TextArea 
                    rows={2} 
                    value={notes} 
                    onChange={e => setNotes(e.target.value)} 
                    placeholder="Ghi chú thêm về phương thức hoàn cọc hoặc thỏa thuận..."
                    style={{ marginTop: '6px' }} 
                  />
                </div>
              </Col>

              <Col xs={24} md={10}>
                <Alert
                  type="success"
                  showIcon
                  message="Biên bản nghiệm thu hợp lệ"
                  description="Khách hàng và nhân viên showroom xác nhận đồng ý với bảng chiết tính phụ phí và chỉ số hoàn trả trên."
                  style={{ marginBottom: '16px' }}
                />

                {vehicleCondition === 'DAMAGED' && (
                  <Alert
                    type="warning"
                    showIcon
                    icon={<WarningOutlined />}
                    message="Xe sẽ chuyển sang BẢO DƯỠNG (MAINTENANCE)"
                    description="Do phát hiện hư hại, sau khi quyết toán xe sẽ được chuyển về trạng thái Bảo dưỡng để kỹ thuật viên kiểm tra xử lý."
                  />
                )}
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
              message="Đóng đơn thuê xe & Hoàn tất quyết toán"
              description={`Hợp đồng #${booking.bookingCode} sẽ chuyển sang trạng thái HOÀN THÀNH (COMPLETED). Trạng thái xe sẽ cập nhật về ${vehicleCondition === 'DAMAGED' ? 'BẢO DƯỠNG (MAINTENANCE)' : 'CÓ SẴN (AVAILABLE)'} và lưu chỉ số Odo mới (${endOdo.toLocaleString()} km).`}
              style={{ marginBottom: '20px' }}
            />

            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <Text type="secondary">Khách hàng:</Text>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>{customerName}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{customerPhone}</div>
                </Col>
                <Col xs={24} sm={8}>
                  <Text type="secondary">Xe bàn giao:</Text>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>{vehicleName}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Odo cuối: {endOdo.toLocaleString()} km</div>
                </Col>
                <Col xs={24} sm={8}>
                  <Text type="secondary">Quyết toán cọc:</Text>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: refundDeposit > 0 ? '#16a34a' : '#dc2626' }}>
                    {customerOwing > 0 ? `Thu thêm ${formatCurrency(customerOwing)}` : `Hoàn lại ${formatCurrency(refundDeposit)}`}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Tổng phụ phí: {formatCurrency(totalSurcharges)}</div>
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
