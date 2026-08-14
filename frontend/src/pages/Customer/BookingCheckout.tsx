import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Button, Radio, Space, Row, Col, Typography, Divider, Alert, message } from 'antd';
import { CheckCircleOutlined, WalletOutlined, CreditCardOutlined, BankOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { Vehicle, Customer } from '@/services/mockData';

const { Title, Text } = Typography;

export const BookingCheckout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const vehicleId = searchParams.get('vehicleId');
  const pickup = searchParams.get('pickup') || '';
  const dropoff = searchParams.get('dropoff') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const days = Number(searchParams.get('days')) || 1;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Chuyển khoản' | 'Thẻ tín dụng' | 'Ví điện tử'>('Chuyển khoản');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vehicleId) {
      api.vehicles.getById(vehicleId).then(res => res && setVehicle(res));
    }
    const user = api.auth.getCurrentUser();
    if (user) {
      api.customers.getById(user.id).then(res => res && setCustomer(res));
    }
  }, [vehicleId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getPriceBreakdown = () => {
    if (!vehicle) return { subtotal: 0, insurance: 0, serviceFee: 0, total: 0 };
    const subtotal = vehicle.pricePerDay * days;
    const insurance = 100000 * days;
    const serviceFee = 100000;
    const total = subtotal + insurance + serviceFee;
    return { subtotal, insurance, serviceFee, total };
  };

  const handleBook = async () => {
    if (!vehicle || !customer) return;
    setLoading(true);
    try {
      const { subtotal, insurance, serviceFee, total } = getPriceBreakdown();
      const booking = await api.bookings.create({
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        vehicleImage: vehicle.image,
        startDate,
        endDate,
        pickupLocation: pickup,
        dropoffLocation: dropoff,
        totalDays: days,
        pricePerDay: vehicle.pricePerDay,
        subtotal,
        insuranceFee: insurance,
        serviceFee,
        totalAmount: total,
        status: 'Chờ xác nhận',
        paymentMethod
      });
      message.success('Đặt xe thành công!');
      navigate(`/customer/booking/receipt/${booking.id}`);
    } catch (e) {
      message.error('Có lỗi xảy ra khi tạo đơn hàng!');
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle || !customer) return <div style={{ textAlign: 'center', padding: '100px 0' }}>Đang tải...</div>;

  const { subtotal, insurance, serviceFee, total } = getPriceBreakdown();

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Xác nhận & Thanh toán</Title>
        <Text type="secondary">Vui lòng kiểm tra lại thông tin chuyến đi và chọn phương thức thanh toán.</Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Side: Summary and warnings */}
        <Col xs={24} md={14}>
          {customer.licenseStatus !== 'Đã xác minh' && (
            <Alert
              message="Yêu cầu bổ sung GPLX"
              description="Hồ sơ lái xe của bạn chưa được xác minh. Để nhận được xe tự lái tại showroom, bạn cần tải ảnh GPLX tại mục hồ sơ cá nhân để quản trị viên phê duyệt."
              type="warning"
              showIcon
              style={{ marginBottom: '24px', borderRadius: '6px' }}
              action={
                <Button size="small" type="primary" onClick={() => navigate('/customer/documents')}>
                  Cập nhật ngay
                </Button>
              }
            />
          )}

          {/* Details Card */}
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Thông tin chuyến đi</Title>} 
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '24px' }}
          >
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Xe đã chọn:</Text>
                <Text strong>{vehicle.name}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Địa điểm nhận:</Text>
                <Text strong>{pickup}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Địa điểm trả:</Text>
                <Text strong>{dropoff}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Ngày nhận xe:</Text>
                <Text strong>{startDate}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Ngày trả xe:</Text>
                <Text strong>{endDate}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Thời gian thuê:</Text>
                <Text strong>{days} ngày</Text>
              </div>
            </Space>
          </Card>

          {/* Payment Method */}
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Phương thức thanh toán</Title>} 
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            <Radio.Group 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size={16}>
                <Radio value="Chuyển khoản" style={{ width: '100%' }}>
                  <Space size={12}>
                    <BankOutlined style={{ fontSize: '20px', color: '#1677ff' }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>Chuyển khoản ngân hàng (Khuyên dùng)</div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Chuyển qua ứng dụng ngân hàng bằng mã QR nhanh chóng.</Text>
                    </div>
                  </Space>
                </Radio>
                <Radio value="Thẻ tín dụng" style={{ width: '100%' }}>
                  <Space size={12}>
                    <CreditCardOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>Thẻ tín dụng / Thẻ ghi nợ</div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Hỗ trợ Visa, Mastercard, JCB, Napas.</Text>
                    </div>
                  </Space>
                </Radio>
                <Radio value="Ví điện tử" style={{ width: '100%' }}>
                  <Space size={12}>
                    <WalletOutlined style={{ fontSize: '20px', color: '#faad14' }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>Ví điện tử (Momo / ZaloPay)</div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Thanh toán qua ví điện tử liên kết.</Text>
                    </div>
                  </Space>
                </Radio>
              </Space>
            </Radio.Group>
          </Card>
        </Col>

        {/* Right Side: Price breakdown card */}
        <Col xs={24} md={10}>
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Chi tiết chi phí</Title>} 
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
          >
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Giá thuê ({days} ngày):</Text>
                <Text>{formatPrice(subtotal)}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Phí bảo hiểm vật chất:</Text>
                <Text>{formatPrice(insurance)}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Phí dịch vụ:</Text>
                <Text>{formatPrice(serviceFee)}</Text>
              </div>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong style={{ fontSize: '15px' }}>Tổng thanh toán:</Text>
                <Text strong style={{ fontSize: '22px', color: '#0053d0' }}>{formatPrice(total)}</Text>
              </div>

              <Button 
                type="primary" 
                size="large" 
                block 
                onClick={handleBook}
                loading={loading}
                style={{ height: '48px', borderRadius: '8px', fontWeight: 600, marginTop: '16px' }}
              >
                Xác nhận đặt xe & Thanh toán
              </Button>

              <div style={{ textAlign: 'center', fontSize: '11px', color: '#727786', marginTop: '8px' }}>
                Bằng việc nhấn đặt xe, bạn đồng ý tuân thủ các quy chế cho thuê xe tự lái và hợp đồng điện tử của AutoRent.
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
