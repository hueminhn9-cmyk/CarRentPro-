import React from 'react';
import { Card, Space, Button, Divider, Typography } from 'antd';
import { StarFilled, EnvironmentOutlined, DashboardOutlined, CarOutlined } from '@ant-design/icons';
import { Vehicle } from '@/services/mockData';
import { StatusBadge } from '../common/StatusBadge';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <Card
      hoverable
      className="hover-lift"
      cover={
        <div style={{ position: 'relative', height: '200px', overflow: 'hidden', backgroundColor: '#f0eded' }}>
          <img
            alt={vehicle.name}
            src={vehicle.image}
            className="card-img-zoom"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
            <StatusBadge status={vehicle.status} />
          </div>
        </div>
      }
      styles={{ body: { padding: '16px' } }}
      style={{ borderRadius: '8px', overflow: 'hidden' }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={4}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>{vehicle.type}</Text>
          <Space size={4}>
            <StarFilled style={{ color: '#faad14' }} />
            <Text strong style={{ fontSize: '13px' }}>{vehicle.rating}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>({vehicle.reviewsCount})</Text>
          </Space>
        </div>

        <Title level={5} style={{ margin: '4px 0', fontSize: '16px' }}>{vehicle.name}</Title>

        <Space size={12} style={{ fontSize: '13px', color: '#414755', margin: '8px 0' }}>
          <span><CarOutlined /> {vehicle.seats} chỗ</span>
          <span><DashboardOutlined /> {vehicle.transmission}</span>
          <span><EnvironmentOutlined /> {vehicle.location}</span>
        </Space>

        <Divider style={{ margin: '12px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#414755' }}>Giá thuê</div>
            <Text strong style={{ fontSize: '18px', color: '#0053d0' }}>
              {formatPrice(vehicle.pricePerDay)}
              <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#414755' }}>/ngày</span>
            </Text>
          </div>
          <Button
            type="primary"
            onClick={() => navigate(`/vehicles/${vehicle.id}`)}
            style={{ borderRadius: '6px' }}
          >
            Chi tiết
          </Button>
        </div>
      </Space>
    </Card>
  );
};
