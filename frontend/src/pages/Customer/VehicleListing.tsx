import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row, Col, Typography, Card, Input, Select, Slider, Space, Empty, Spin, Alert, Tag } from 'antd';
import { SearchOutlined, EnvironmentOutlined, DollarOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { Vehicle } from '@/services/mockData';
import { VehicleCard } from '@/components/vehicle/VehicleCard';

const { Title, Text } = Typography;

const getInitialPriceRange = (rangeParam: string | null): [number, number] => {
  if (rangeParam === 'under1m') return [400000, 1000000];
  if (rangeParam === '1m-2m') return [1000000, 2000000];
  if (rangeParam === '2m-4m') return [2000000, 4000000];
  if (rangeParam === 'above4m') return [4000000, 7000000];
  return [400000, 7000000];
};

export const VehicleListing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'all';
  const initialLocation = searchParams.get('location') || 'all';
  const priceRangeParam = searchParams.get('priceRange');

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search & Filter state
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [selectedLocation, setSelectedLocation] = useState<string>(initialLocation);
  const [selectedFuel, setSelectedFuel] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>(getInitialPriceRange(priceRangeParam));

  // Keep state in sync if URL query params change
  useEffect(() => {
    if (searchParams.get('type')) {
      setSelectedType(searchParams.get('type')!);
    }
    if (searchParams.get('location')) {
      setSelectedLocation(searchParams.get('location')!);
    }
    if (searchParams.get('priceRange')) {
      setPriceRange(getInitialPriceRange(searchParams.get('priceRange')));
    }
  }, [searchParams]);

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
      const targetType = selectedType.toLowerCase();
      result = result.filter(v => {
        const vType = v.type.toLowerCase();
        if (targetType === 'suv') return vType.includes('suv');
        if (targetType === 'sedan') return vType.includes('sedan');
        if (targetType === 'luxury') return vType.includes('luxury') || vType.includes('sang');
        if (targetType === 'xe điện' || targetType === 'electric') return vType.includes('điện') || v.fuel === 'Điện';
        if (targetType === 'bán tải' || targetType === 'van' || targetType === 'mpv') return vType.includes('bán tải') || vType.includes('van') || vType.includes('mpv');
        return vType === targetType;
      });
    }

    // Filter by location
    if (selectedLocation && selectedLocation !== 'all') {
      result = result.filter(v => v.location.toLowerCase().includes(selectedLocation.toLowerCase()));
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
            variant="borderless" 
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
                    { value: 'all', label: 'Tất cả các điểm tại Đà Nẵng' },
                    { value: 'Đà Nẵng', label: '📍 Đà Nẵng (Toàn thành phố)' },
                    { value: 'Hải Châu', label: '📍 Quận Hải Châu' },
                    { value: 'Sơn Trà', label: '📍 Quận Sơn Trà' },
                    { value: 'Thanh Khê', label: '📍 Quận Thanh Khê' }
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
                    { value: 'Luxury', label: 'Luxury (Xe sang)' },
                    { value: 'Xe điện', label: 'Xe điện' },
                    { value: 'Bán tải', label: 'Bán tải' },
                    { value: 'Hatchback', label: 'Hatchback' }
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
                  <DollarOutlined style={{ color: '#16a34a', marginRight: 4 }} /> Giá thuê / ngày
                </Text>
                <Slider 
                  range 
                  min={400000} 
                  max={7000000} 
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
          {(selectedLocation !== 'all' || selectedType !== 'all' || priceRangeParam) && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Text type="secondary" style={{ fontSize: '13px' }}>Đang lọc theo:</Text>
              {selectedLocation !== 'all' && (
                <Tag color="blue" icon={<EnvironmentOutlined />} closable onClose={() => setSelectedLocation('all')}>
                  Địa điểm: {selectedLocation}
                </Tag>
              )}
              {selectedType !== 'all' && (
                <Tag color="purple" closable onClose={() => setSelectedType('all')}>
                  Dòng xe: {selectedType}
                </Tag>
              )}
              {priceRangeParam && (
                <Tag color="green" icon={<DollarOutlined />}>
                  Giá: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </Tag>
              )}
            </div>
          )}
          {loading ? (
            <div className="text-center py-20">
              <Spin size="large" tip="Đang tải danh sách xe...">
                <div className="pt-8" />
              </Spin>
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
            <Card variant="borderless" className="rounded-lg text-center py-10 shadow-sm">
              <Empty description="Không tìm thấy chiếc xe nào phù hợp với bộ lọc." />
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};
