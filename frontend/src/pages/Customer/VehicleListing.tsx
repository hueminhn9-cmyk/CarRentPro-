import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Card, Input, Select, Slider, Space, Empty, Spin, Alert } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { Vehicle } from '@/services/mockData';
import { VehicleCard } from '@/components/vehicle/VehicleCard';

const { Title, Text } = Typography;

export const VehicleListing: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search & Filter state
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedFuel, setSelectedFuel] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([500000, 2000000]);

  useEffect(() => {
    setLoading(true);
    api.vehicles.getAll()
      .then(res => {
        setVehicles(res);
        setFilteredVehicles(res);
        setError(null);
      })
      .catch(err => {
        console.error('Failed to load vehicles:', err);
        setError('Không thể tải danh sách xe. Vui lòng thử lại sau.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = vehicles;

    // Search by name
    if (searchText) {
      result = result.filter(v => v.name.toLowerCase().includes(searchText.toLowerCase()));
    }

    // Filter by type
    if (selectedType && selectedType !== 'all') {
      result = result.filter(v => v.type === selectedType);
    }

    // Filter by location
    if (selectedLocation && selectedLocation !== 'all') {
      result = result.filter(v => v.location === selectedLocation);
    }

    // Filter by fuel
    if (selectedFuel && selectedFuel !== 'all') {
      result = result.filter(v => v.fuel === selectedFuel);
    }

    // Filter by price range
    result = result.filter(v => v.pricePerDay >= priceRange[0] && v.pricePerDay <= priceRange[1]);

    setFilteredVehicles(result);
  }, [searchText, selectedType, selectedLocation, selectedFuel, priceRange, vehicles]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Danh sách xe tự lái</Title>
        <Text type="secondary">Tìm kiếm chiếc xe phù hợp nhất cho chuyến đi của bạn.</Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Side: Filters */}
        <Col xs={24} md={6}>
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Bộ lọc tìm kiếm</Title>} 
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', position: 'sticky', top: '88px' }}
          >
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              {/* Search input */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>Tìm theo tên xe</Text>
                <Input 
                  placeholder="Nhập tên xe..." 
                  prefix={<SearchOutlined style={{ color: '#727786' }} />} 
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ borderRadius: '6px' }}
                />
              </div>

              {/* Location Select */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>Khu vực</Text>
                <Select
                  style={{ width: '100%' }}
                  value={selectedLocation}
                  onChange={setSelectedLocation}
                  options={[
                    { value: 'all', label: 'Tất cả các khu vực' },
                    { value: 'Hà Nội', label: 'Hà Nội' },
                    { value: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
                    { value: 'Đà Nẵng', label: 'Đà Nẵng' }
                  ]}
                />
              </div>

              {/* Vehicle Type Select */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>Dòng xe</Text>
                <Select
                  style={{ width: '100%' }}
                  value={selectedType}
                  onChange={setSelectedType}
                  options={[
                    { value: 'all', label: 'Tất cả dòng xe' },
                    { value: 'Sedan', label: 'Sedan' },
                    { value: 'SUV', label: 'SUV' },
                    { value: 'Bán tải', label: 'Bán tải' },
                    { value: 'Xe điện', label: 'Xe điện' }
                  ]}
                />
              </div>

              {/* Fuel Type */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>Nhiên liệu</Text>
                <Select
                  style={{ width: '100%' }}
                  value={selectedFuel}
                  onChange={setSelectedFuel}
                  options={[
                    { value: 'all', label: 'Tất cả nhiên liệu' },
                    { value: 'Xăng', label: 'Xăng' },
                    { value: 'Dầu', label: 'Dầu' },
                    { value: 'Điện', label: 'Điện' }
                  ]}
                />
              </div>

              {/* Price Range Slider */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>
                  Giá thuê / ngày
                </Text>
                <Slider 
                  range 
                  min={500000} 
                  max={2000000} 
                  step={100000}
                  value={priceRange} 
                  onChange={(val) => setPriceRange(val as [number, number])}
                  tooltip={{ formatter: (val) => formatPrice(val || 0) }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#414755' }}>
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Right Side: Vehicle Grid */}
        <Col xs={24} md={18}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <Spin size="large" tip="Đang tải danh sách xe..." />
            </div>
          ) : error ? (
            <Alert type="error" message={error} showIcon />
          ) : filteredVehicles.length > 0 ? (
            <Row gutter={[24, 24]}>
              {filteredVehicles.map(vehicle => (
                <Col xs={24} sm={12} lg={8} key={vehicle.id}>
                  <VehicleCard vehicle={vehicle} />
                </Col>
              ))}
            </Row>
          ) : (
            <Card bordered={false} style={{ borderRadius: '8px', textAlign: 'center', padding: '40px 0' }}>
              <Empty description="Không tìm thấy chiếc xe nào phù hợp với bộ lọc." />
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};
