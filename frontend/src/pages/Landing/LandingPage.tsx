import React, { useState, useEffect } from 'react';
import { Typography, Button, Card, Space, Row, Col, Input, Select, Carousel, Tag, Avatar, Divider, Rate } from 'antd';
import {
  ArrowRightOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  StarFilled,
  CarOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  UsergroupAddOutlined,
  TrophyOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  CustomerServiceOutlined,
  SwapOutlined,
  FileDoneOutlined,
  HeartOutlined,
  HeartFilled,
  AimOutlined,
  CompassOutlined,
  SendOutlined,
  PhoneOutlined,
  MailOutlined,
  CrownOutlined,
  DashboardOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { Vehicle } from '@/services/mockData';
import { useLanguage } from '@/context/LanguageContext';

const { Title, Text, Paragraph } = Typography;

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const [searchLocation, setSearchLocation] = useState<string>('all');
  const [searchType, setSearchType] = useState<string>('all');

  useEffect(() => {
    api.vehicles.getAll().then(res => {
      setVehicles(res);
    });
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation && searchLocation !== 'all') params.set('location', searchLocation);
    if (searchType && searchType !== 'all') params.set('type', searchType);

    const queryString = params.toString();
    navigate(queryString ? `/vehicles?${queryString}` : '/vehicles');
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Ultra-realistic 4K Cinematic Automotive Carousel Slides
  const cinematicSlides = [
    {
      title: t('hero.title1'),
      subtitle: t('hero.subtitle1'),
      badge: t('hero.badge1'),
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1920&auto=format&fit=crop&q=90',
      carModel: t('hero.car1')
    },
    {
      title: t('hero.title2'),
      subtitle: t('hero.subtitle2'),
      badge: t('hero.badge2'),
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1920&auto=format&fit=crop&q=90',
      carModel: t('hero.car2')
    },
    {
      title: t('hero.title3'),
      subtitle: t('hero.subtitle3'),
      badge: t('hero.badge3'),
      image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1920&auto=format&fit=crop&q=90',
      carModel: t('hero.car3')
    },
    {
      title: t('hero.title4'),
      subtitle: t('hero.subtitle4'),
      badge: t('hero.badge4'),
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1920&auto=format&fit=crop&q=90',
      carModel: t('hero.car4')
    },
    {
      title: t('hero.title5'),
      subtitle: t('hero.subtitle5'),
      badge: t('hero.badge5'),
      image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1920&auto=format&fit=crop&q=90',
      carModel: t('hero.car5')
    }
  ];

  const vehicleCategories = [
    { title: 'SUV', desc: 'Gầm cao đa dụng (Fortuner, VF 8, CX-5)', icon: <CarOutlined style={{ fontSize: '28px', color: '#2563eb' }} />, count: 180 },
    { title: 'Sedan', desc: 'Thanh lịch & Doanh nhân (Camry, Civic, E-Class)', icon: <DashboardOutlined style={{ fontSize: '28px', color: '#2563eb' }} />, count: 140 },
    { title: 'Luxury', desc: 'Dòng xe hạng sang (Porsche, BMW 7, Mercedes)', icon: <CrownOutlined style={{ fontSize: '28px', color: '#2563eb' }} />, count: 65 },
    { title: 'Xe điện', desc: 'Công nghệ xanh (VinFast VF 5, VF 8, VF 9)', icon: <ThunderboltOutlined style={{ fontSize: '28px', color: '#2563eb' }} />, count: 95 },
    { title: 'MPV', desc: 'Xe gia đình rộng rãi (Carnival, Innova, Xpander)', icon: <RocketOutlined style={{ fontSize: '28px', color: '#2563eb' }} />, count: 80 },
    { title: 'Bán tải', desc: 'Mạnh mẽ vượt địa hình (Ranger, Hilux, Triton)', icon: <AppstoreOutlined style={{ fontSize: '28px', color: '#2563eb' }} />, count: 40 }
  ];

  const whyChooseUs = [
    { title: t('why.fastBooking'), desc: t('why.fastBookingDesc'), icon: <RocketOutlined /> },
    { title: t('why.verified'), desc: t('why.verifiedDesc'), icon: <SafetyCertificateOutlined /> },
    { title: t('why.support'), desc: t('why.supportDesc'), icon: <CustomerServiceOutlined /> },
    { title: t('why.insurance'), desc: t('why.insuranceDesc'), icon: <SafetyCertificateOutlined /> },
    { title: t('why.digitalContract'), desc: t('why.digitalContractDesc'), icon: <FileDoneOutlined /> },
    { title: t('why.gpsTracking'), desc: t('why.gpsTrackingDesc'), icon: <AimOutlined /> }
  ];

  const timelineSteps = [
    { step: '01', title: t('step1.title'), desc: t('step1.desc') },
    { step: '02', title: t('step2.title'), desc: t('step2.desc') },
    { step: '03', title: t('step3.title'), desc: t('step3.desc') },
    { step: '04', title: t('step4.title'), desc: t('step4.desc') },
    { step: '05', title: t('step5.title'), desc: t('step5.desc') }
  ];

  const testimonials = [
    {
      name: 'Michael Vance',
      role: 'VP of Operations, Global Logistics Corp',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      content: 'AutoRent transformed our corporate fleet management. The digital contract e-signing and seamless Manager handover saved our executive team dozens of hours monthly.',
      rating: 5,
      company: 'TECHLOG GLOBAL'
    },
    {
      name: 'Sarah Jenkins',
      role: 'Executive Director, Horizon Capital',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      content: 'The BMW X5 and Mercedes GLE models are kept in pristine 5-star condition. Home delivery in 30 minutes is a game-changer for business travelers.',
      rating: 5,
      company: 'HORIZON CAP'
    },
    {
      name: 'Nguyễn Bích Phương',
      role: 'Senior Partner, Apex Law Firm',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Phuong',
      content: 'Bảo hiểm vật chất 2 chiều rõ ràng, dịch vụ CSKH 24/7 phản hồi tức thì. Rất hài lòng với chất lượng xe điện VinFast VF 9 ADAS!',
      rating: 5,
      company: 'APEX LAW'
    }
  ];

  return (
    <div className="fade-in" style={{ backgroundColor: '#ffffff', color: '#0f172a', position: 'relative' }}>
      
      {/* SECTION 1: Cinematic Full-Width Auto-Playing Hero Carousel */}
      <section style={{ position: 'relative', overflow: 'hidden', height: '700px' }}>
        <Carousel autoplay autoplaySpeed={5000} effect="fade" style={{ height: '700px' }}>
          {cinematicSlides.map((slide, index) => (
            <div key={index}>
              <div style={{
                height: '700px',
                backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.65) 0%, rgba(15, 23, 42, 0.85) 100%), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                padding: '0 32px',
                position: 'relative'
              }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', paddingBottom: '70px' }}>
                  <Row align="middle">
                    <Col xs={24} lg={16}>
                      <Space direction="vertical" size={20}>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          <Tag style={{ padding: '6px 16px', borderRadius: '6px', fontWeight: 700, fontSize: '13px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none' }}>
                            {slide.badge}
                          </Tag>
                          <Tag style={{ padding: '6px 16px', borderRadius: '6px', fontWeight: 700, fontSize: '13px', backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', border: 'none' }}>
                            {slide.carModel}
                          </Tag>
                        </div>

                        <Title level={1} style={{ color: '#ffffff', margin: 0, fontSize: '50px', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-1px' }}>
                          {slide.title}
                        </Title>

                        <Paragraph style={{ color: '#e2e8f0', fontSize: '18px', margin: 0, lineHeight: 1.6, maxWidth: '680px', fontWeight: 400 }}>
                          {slide.subtitle}
                        </Paragraph>

                        <Space size={16} wrap style={{ marginTop: '12px' }}>
                          <Button 
                            type="primary" 
                            size="large" 
                            icon={<CarOutlined />}
                            onClick={() => navigate('/vehicles')}
                            style={{ 
                              height: '52px', 
                              padding: '0 32px', 
                              borderRadius: '8px', 
                              fontWeight: 700, 
                              fontSize: '15px', 
                              backgroundColor: '#2563eb', 
                              borderColor: '#2563eb',
                              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
                            }}
                            className="hover-lift"
                          >
                            {t('hero.btnRentNow')}
                          </Button>

                          <Button 
                            type="default" 
                            size="large"
                            onClick={() => navigate('/vehicles')}
                            style={{ 
                              height: '52px', 
                              padding: '0 28px', 
                              borderRadius: '8px', 
                              fontWeight: 600, 
                              fontSize: '15px', 
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                              color: '#ffffff'
                            }}
                          >
                            {t('hero.btnExploreFleet')}
                          </Button>
                        </Space>
                      </Space>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          ))}
        </Carousel>

        {/* Floating Search Bar */}
        <div style={{ 
          position: 'absolute', 
          bottom: '24px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          width: 'calc(100% - 48px)',
          maxWidth: '1280px',
          zIndex: 10
        }}>
          <Card style={{ 
            borderRadius: '16px', 
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            padding: '16px 20px'
          }}>
            <Row gutter={[16, 16]} align="bottom">
              <Col xs={24} sm={12} md={10}>
                <Space direction="vertical" size={6} style={{ width: '100%' }}>
                  <Text strong style={{ fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                    <EnvironmentOutlined style={{ color: '#2563eb', fontSize: '16px' }} /> {t('search.location')}
                  </Text>
                  <Select 
                    value={searchLocation} 
                    onChange={setSearchLocation}
                    style={{ width: '100%', height: '46px' }} 
                    options={[
                      { value: 'all', label: <span><EnvironmentOutlined style={{ color: '#2563eb', marginRight: 6 }} /> Tất cả các điểm tại Đà Nẵng</span> },
                      { value: 'Hải Châu', label: <span><EnvironmentOutlined style={{ color: '#2563eb', marginRight: 6 }} /> Showroom Trung Tâm (Hải Châu)</span> },
                      { value: 'Sân bay', label: <span><EnvironmentOutlined style={{ color: '#2563eb', marginRight: 6 }} /> Sân bay Quốc tế Đà Nẵng</span> },
                      { value: 'Sơn Trà', label: <span><EnvironmentOutlined style={{ color: '#2563eb', marginRight: 6 }} /> Chi nhánh Sơn Trà</span> },
                      { value: 'Thanh Khê', label: <span><EnvironmentOutlined style={{ color: '#2563eb', marginRight: 6 }} /> Chi nhánh Thanh Khê</span> },
                      { value: 'Ngũ Hành Sơn', label: <span><EnvironmentOutlined style={{ color: '#2563eb', marginRight: 6 }} /> Chi nhánh Ngũ Hành Sơn</span> }
                    ]}
                  />
                </Space>
              </Col>
              
              <Col xs={24} sm={12} md={9}>
                <Space direction="vertical" size={6} style={{ width: '100%' }}>
                  <Text strong style={{ fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                    <CarOutlined style={{ color: '#2563eb', fontSize: '16px' }} /> {t('search.type')}
                  </Text>
                  <Select 
                    value={searchType} 
                    onChange={setSearchType}
                    style={{ width: '100%', height: '46px' }} 
                    options={[
                      { value: 'all', label: t('search.allTypes') },
                      { value: 'SUV', label: <span><CarOutlined style={{ color: '#2563eb', marginRight: 6 }} /> SUV</span> },
                      { value: 'Sedan', label: <span><DashboardOutlined style={{ color: '#2563eb', marginRight: 6 }} /> Sedan</span> },
                      { value: 'Luxury', label: <span><CrownOutlined style={{ color: '#2563eb', marginRight: 6 }} /> Luxury</span> },
                      { value: 'Xe điện', label: <span><ThunderboltOutlined style={{ color: '#2563eb', marginRight: 6 }} /> Electric (Xe điện)</span> },
                      { value: 'Bán tải', label: <span><RocketOutlined style={{ color: '#2563eb', marginRight: 6 }} /> Bán tải</span> },
                      { value: 'Hatchback', label: <span><AppstoreOutlined style={{ color: '#2563eb', marginRight: 6 }} /> Hatchback</span> }
                    ]} 
                  />
                </Space>
              </Col>
              
              <Col xs={24} md={5}>
                <Button 
                  type="primary" 
                  icon={<SearchOutlined />} 
                  style={{ 
                    width: '100%', 
                    height: '46px', 
                    borderRadius: '8px', 
                    fontWeight: 700, 
                    fontSize: '15px',
                    backgroundColor: '#2563eb',
                    borderColor: '#2563eb',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.25)'
                  }}
                  onClick={handleSearch}
                  className="hover-lift"
                >
                  {t('search.btn')}
                </Button>
              </Col>
            </Row>
          </Card>
        </div>
      </section>

      {/* SECTION 3: Key Statistics Bar */}
      <section style={{ padding: '60px 24px 30px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <Row gutter={[24, 24]}>
            {[
              { num: '500+', label: t('stat.vehicles'), icon: <CarOutlined style={{ color: '#2563eb' }} /> },
              { num: '12,500+', label: t('stat.customers'), icon: <UsergroupAddOutlined style={{ color: '#2563eb' }} /> },
              { num: '99.2%', label: t('stat.satisfaction'), icon: <TrophyOutlined style={{ color: '#2563eb' }} /> },
              { num: '6 Showrooms', label: t('stat.branches'), icon: <EnvironmentOutlined style={{ color: '#2563eb' }} /> }
            ].map((stat, idx) => (
              <Col xs={12} sm={6} key={idx}>
                <div style={{ 
                  textAlign: 'center',
                  padding: '20px 16px',
                  borderRadius: '12px',
                  border: '1px solid #f1f5f9',
                  backgroundColor: '#f8fafc'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
                  <Title level={3} style={{ margin: 0, color: '#0f172a', fontWeight: 800, fontSize: '28px' }}>
                    {stat.num}
                  </Title>
                  <Text style={{ fontSize: '13px', color: '#64748b', display: 'block', marginTop: '4px' }}>{stat.label}</Text>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* SECTION 4: Vehicle Categories */}
      <section style={{ padding: '60px 24px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#0f172a', fontSize: '32px' }}>
              {t('cat.title')}
            </Title>
            <Text type="secondary" style={{ fontSize: '15px', marginTop: '6px', display: 'block' }}>{t('cat.subtitle')}</Text>
          </div>

          <Row gutter={[20, 20]}>
            {vehicleCategories.map((cat, idx) => (
              <Col xs={24} sm={12} lg={4} key={idx}>
                <Card 
                  hoverable 
                  className="hover-lift"
                  style={{ 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
                    textAlign: 'center',
                    backgroundColor: '#ffffff'
                  }}
                  styles={{ body: { padding: '20px 14px' } }}
                  onClick={() => navigate('/vehicles')}
                >
                  <div style={{ marginBottom: '10px' }}>{cat.icon}</div>
                  <Title level={4} style={{ margin: '4px 0 2px 0', fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                    {cat.title}
                  </Title>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                    {cat.count}+ xe sẵn sàng
                  </Text>
                  <Text type="secondary" style={{ fontSize: '11px', display: 'block', height: '32px', overflow: 'hidden', color: '#94a3b8' }}>
                    {cat.desc}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* SECTION 5: Featured Vehicles Showcase */}
      <section style={{ padding: '70px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#0f172a', fontSize: '32px' }}>
                {t('fleet.title')}
              </Title>
              <Text type="secondary" style={{ fontSize: '15px', marginTop: '4px', display: 'block' }}>Xe được kiểm định 160+ điểm kỹ thuật tiêu chuẩn</Text>
            </div>
            <Button 
              type="primary" 
              onClick={() => navigate('/vehicles')} 
              style={{ borderRadius: '8px', height: '42px', fontWeight: 700, backgroundColor: '#0f172a', borderColor: '#0f172a', padding: '0 20px' }}
            >
              {t('fleet.viewAll')} <ArrowRightOutlined />
            </Button>
          </div>
          
          <Row gutter={[24, 24]}>
            {vehicles.slice(0, 3).map(v => (
              <Col xs={24} sm={12} md={8} key={v.id}>
                <Card 
                  hoverable
                  className="hover-lift"
                  style={{ 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0', 
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(15,23,42,0.05)',
                    backgroundColor: '#ffffff'
                  }}
                  styles={{ body: { padding: '20px' } }}
                >
                  <div style={{ position: 'relative', marginBottom: '16px', overflow: 'hidden', borderRadius: '8px' }}>
                    <img 
                      alt={v.name} 
                      src={v.image} 
                      className="card-img-zoom"
                      style={{ 
                        width: '100%', 
                        height: '200px', 
                        objectFit: 'cover', 
                        borderRadius: '8px'
                      }}
                    />
                    <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                      <Tag style={{ borderRadius: '4px', padding: '2px 10px', fontWeight: 700, backgroundColor: '#0f172a', color: '#ffffff', border: 'none', fontSize: '12px' }}>{v.type}</Tag>
                    </div>

                    <div 
                      onClick={(e) => toggleFavorite(v.id, e)}
                      style={{ 
                        position: 'absolute', 
                        top: '10px', 
                        right: '10px', 
                        backgroundColor: '#ffffff', 
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                      }}
                    >
                      {favorites[v.id] ? <HeartFilled style={{ color: '#ef4444', fontSize: '16px' }} /> : <HeartOutlined style={{ color: '#64748b', fontSize: '16px' }} />}
                    </div>

                    <div style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: 'rgba(15,23,42,0.85)', padding: '3px 10px', borderRadius: '4px', color: '#f59e0b', fontWeight: 700, fontSize: '12px' }}>
                      <StarFilled /> {v.rating} ({v.reviewsCount})
                    </div>
                  </div>

                  <Title level={4} style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '18px' }}>{v.name}</Title>
                  <Text type="secondary" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px', marginTop: '4px' }}>
                    <EnvironmentOutlined style={{ color: '#2563eb' }} /> {v.location}
                  </Text>

                  <Space size={[6, 6]} wrap style={{ marginBottom: '16px' }}>
                    <Tag color="default" style={{ borderRadius: '4px', padding: '2px 8px', fontWeight: 500, fontSize: '12px' }}>{v.transmission}</Tag>
                    <Tag color="default" style={{ borderRadius: '4px', padding: '2px 8px', fontWeight: 500, fontSize: '12px' }}>{v.fuel}</Tag>
                    <Tag color="default" style={{ borderRadius: '4px', padding: '2px 8px', fontWeight: 500, fontSize: '12px' }}>{v.seats} {t('fleet.seats')}</Tag>
                  </Space>

                  <Divider style={{ margin: '12px 0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>{t('fleet.dailyRate')}</Text>
                      <Text strong style={{ fontSize: '20px', color: '#2563eb', fontWeight: 800 }}>
                        {formatPrice(v.pricePerDay)}
                      </Text>
                    </div>

                    <Button 
                      type="primary"
                      onClick={() => navigate(`/vehicles/${v.id}`)}
                      style={{ 
                        borderRadius: '6px', 
                        height: '38px', 
                        fontWeight: 700, 
                        backgroundColor: '#2563eb',
                        borderColor: '#2563eb',
                        padding: '0 18px'
                      }}
                    >
                      {t('fleet.bookNow')}
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* SECTION 6: Why Choose Us */}
      <section style={{ padding: '70px 24px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#0f172a', fontSize: '32px' }}>
              {t('why.title')}
            </Title>
            <Text type="secondary" style={{ fontSize: '15px', marginTop: '6px', display: 'block' }}>{t('why.subtitle')}</Text>
          </div>

          <Row gutter={[24, 24]}>
            {whyChooseUs.map((feat, idx) => (
              <Col xs={24} sm={12} lg={4} key={idx}>
                <div style={{ 
                  borderRadius: '12px', 
                  height: '100%', 
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  padding: '24px 16px',
                  textAlign: 'center'
                }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '10px', 
                    backgroundColor: '#eff6ff', 
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    margin: '0 auto 16px auto'
                  }}>
                    {feat.icon}
                  </div>
                  <Title level={4} style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                    {feat.title}
                  </Title>
                  <Paragraph style={{ color: '#64748b', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
                    {feat.desc}
                  </Paragraph>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* SECTION 7: How It Works */}
      <section style={{ padding: '80px 24px', backgroundColor: '#0f172a', color: '#ffffff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#ffffff', fontSize: '32px' }}>
              {t('step.title')}
            </Title>
            <Text style={{ color: '#94a3b8', fontSize: '15px', marginTop: '6px', display: 'block' }}>Quy trình thuê xe nhanh chóng, minh bạch và dễ dàng trong 5 bước</Text>
          </div>

          <Row gutter={[20, 24]}>
            {timelineSteps.map((st, idx) => (
              <Col xs={24} sm={12} lg={4.8 as any} key={idx}>
                <div style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.04)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px 18px',
                  height: '100%'
                }}>
                  <div style={{ fontSize: '36px', fontWeight: 800, color: '#38bdf8', lineHeight: 1, marginBottom: '14px' }}>
                    {st.step}
                  </div>
                  <Title level={4} style={{ color: '#ffffff', margin: '0 0 8px 0', fontSize: '16px', fontWeight: 700 }}>
                    {st.title}
                  </Title>
                  <Paragraph style={{ color: '#94a3b8', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>
                    {st.desc}
                  </Paragraph>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* SECTION 8: Customer Testimonials */}
      <section style={{ padding: '80px 24px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#0f172a', fontSize: '32px' }}>
              {t('testi.title')}
            </Title>
            <Text type="secondary" style={{ fontSize: '15px', marginTop: '6px', display: 'block' }}>Hơn 12,000 khách hàng doanh nghiệp và cá nhân đã tin tưởng sử dụng dịch vụ</Text>
          </div>

          <Row gutter={[24, 24]}>
            {testimonials.map((item, idx) => (
              <Col xs={24} md={8} key={idx}>
                <Card 
                  variant="borderless" 
                  style={{ 
                    borderRadius: '12px', 
                    height: '100%', 
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
                    padding: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <Rate disabled defaultValue={item.rating} style={{ color: '#f59e0b', fontSize: '14px' }} />
                    <Tag style={{ borderRadius: '4px', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1' }}>{item.company}</Tag>
                  </div>
                  <Paragraph style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '20px' }}>
                    "{item.content}"
                  </Paragraph>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar src={item.avatar} size={44} style={{ backgroundColor: '#2563eb' }} />
                    <div>
                      <Text strong style={{ display: 'block', color: '#0f172a', fontSize: '15px', fontWeight: 700 }}>{item.name}</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>{item.role}</Text>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* SECTION 9: Partner Brand Logos */}
      <section style={{ padding: '50px 24px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', display: 'block', marginBottom: '24px' }}>
            {t('partners.title')}
          </Text>
          <Row gutter={[16, 16]} justify="center" align="middle">
            {['VinFast', 'Toyota', 'Mercedes-Benz', 'BMW', 'Audi', 'Hyundai', 'Ford', 'Honda'].map((brand, bIdx) => (
              <Col xs={12} sm={6} md={3} key={bIdx}>
                <div style={{ 
                  padding: '12px 16px', 
                  borderRadius: '8px', 
                  backgroundColor: '#f8fafc', 
                  fontWeight: 800, 
                  color: '#334155',
                  fontSize: '15px',
                  border: '1px solid #e2e8f0'
                }}>
                  {brand}
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* SECTION 10: Enterprise Bottom CTA Banner */}
      <section style={{ padding: '80px 24px', backgroundColor: '#0f172a', color: '#ffffff', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Title level={2} style={{ color: '#ffffff', fontWeight: 800, fontSize: '36px', marginBottom: '16px' }}>
            {t('cta.title')}
          </Title>
          <Paragraph style={{ color: '#cbd5e1', fontSize: '16px', marginBottom: '32px', lineHeight: 1.6 }}>
            {t('cta.subtitle')}
          </Paragraph>
          <Space size={16} wrap style={{ justifyContent: 'center' }}>
            <Button 
              type="primary"
              size="large"
              icon={<CarOutlined />}
              onClick={() => navigate('/vehicles')}
              style={{ 
                height: '50px', 
                padding: '0 36px', 
                borderRadius: '8px', 
                fontWeight: 700, 
                fontSize: '15px',
                backgroundColor: '#2563eb',
                borderColor: '#2563eb',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
              }}
              className="hover-lift"
            >
              {t('hero.btnRentNow')}
            </Button>
            <Button 
              type="default"
              size="large"
              onClick={() => navigate('/auth/login')}
              style={{ 
                height: '50px', 
                padding: '0 28px', 
                borderRadius: '8px', 
                fontWeight: 600, 
                fontSize: '15px',
                backgroundColor: 'transparent',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: '#ffffff'
              }}
            >
              {t('cta.btnLogin')}
            </Button>
          </Space>
        </div>
      </section>
    </div>
  );
};
