import React from 'react';
import { Card, Typography, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number; // e.g. 12.5% (positive or negative)
  trendLabel?: string; // e.g. "so với tháng trước"
  badgeColor?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendLabel = 'so với tháng trước',
  badgeColor = '#eff6ff',
  onClick,
  style
}) => {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      style={{
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
      bodyStyle={{ padding: '20px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <Text type="secondary" style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
          {title}
        </Text>
        {icon && (
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: badgeColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            {icon}
          </div>
        )}
      </div>

      <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '8px', lineHeight: 1.2 }}>
        {value}
      </div>

      {trend !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <span style={{ 
            color: isPositive ? '#16a34a' : '#dc2626', 
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          }}>
            {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            {Math.abs(trend)}%
          </span>
          <Text type="secondary" style={{ fontSize: '11px', color: '#94a3b8' }}>
            {trendLabel}
          </Text>
        </div>
      )}
    </Card>
  );
};
