import React from 'react';
import { Typography, Divider, Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

export interface PriceItem {
  label: string;
  amount: number;
  isDiscount?: boolean;
  note?: string;
}

interface PriceBreakdownProps {
  vehicleName: string;
  days: number;
  pricePerDay: number;
  services?: PriceItem[];
  surcharges?: PriceItem[];
  depositAmount: number;
  discountAmount?: number;
  style?: React.CSSProperties;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  vehicleName,
  days,
  pricePerDay,
  services = [],
  surcharges = [],
  depositAmount,
  discountAmount = 0,
  style
}) => {
  const rentalTotal = days * pricePerDay;
  const servicesTotal = services.reduce((acc, curr) => acc + curr.amount, 0);
  const surchargesTotal = surcharges.reduce((acc, curr) => acc + curr.amount, 0);
  const grandTotal = rentalTotal + servicesTotal + surchargesTotal - discountAmount;
  const totalWithDeposit = grandTotal + depositAmount;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div 
      style={{ 
        background: '#ffffff', 
        padding: '24px', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0',
        ...style 
      }}
    >
      <Title level={5} style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
        Chi tiết bảng tính chi phí
      </Title>

      {/* Rental Price */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <Text strong style={{ fontSize: '13px' }}>{vehicleName}</Text>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            {days} ngày × {formatCurrency(pricePerDay)}/ngày
          </div>
        </div>
        <Text strong style={{ fontSize: '14px', color: '#0f172a' }}>
          {formatCurrency(rentalTotal)}
        </Text>
      </div>

      {/* Additional Services */}
      {services.map((item, index) => (
        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <Text style={{ fontSize: '13px', color: '#475569' }}>{item.label}</Text>
          <Text style={{ fontSize: '13px', color: '#0f172a' }}>{formatCurrency(item.amount)}</Text>
        </div>
      ))}

      {/* Surcharges (Phụ phí nếu có) */}
      {surcharges.map((item, index) => (
        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <Text style={{ fontSize: '13px', color: '#d97706' }}>{item.label}</Text>
          <Text strong style={{ fontSize: '13px', color: '#d97706' }}>+{formatCurrency(item.amount)}</Text>
        </div>
      ))}

      {/* Discount */}
      {discountAmount > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <Text style={{ fontSize: '13px', color: '#16a34a' }}>Ưu đãi giảm giá</Text>
          <Text strong style={{ fontSize: '13px', color: '#16a34a' }}>-{formatCurrency(discountAmount)}</Text>
        </div>
      )}

      <Divider style={{ margin: '14px 0' }} />

      {/* Rental Subtotal */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <Text strong style={{ fontSize: '14px', color: '#0f172a' }}>Tiền thuê xe & Dịch vụ</Text>
        <Text strong style={{ fontSize: '15px', color: '#1e3a8a' }}>{formatCurrency(grandTotal)}</Text>
      </div>

      {/* Deposit */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: '10px 12px', 
        background: '#f8fafc', 
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        marginBottom: '14px'
      }}>
        <div>
          <Text strong style={{ fontSize: '13px', color: '#0f172a' }}>Tiền thế chấp (Cọc xe)</Text>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Hoàn trả 100% khi thanh lý hợp đồng</div>
        </div>
        <Text strong style={{ fontSize: '14px', color: '#d97706' }}>{formatCurrency(depositAmount)}</Text>
      </div>

      {/* Total Payment */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '14px 16px', 
        background: '#0f172a', 
        borderRadius: '8px',
        color: '#ffffff'
      }}>
        <div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>TỔNG THANH TOÁN (GỒM CỌC)</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#fbbf24' }}>{formatCurrency(totalWithDeposit)}</div>
        </div>
      </div>
    </div>
  );
};
