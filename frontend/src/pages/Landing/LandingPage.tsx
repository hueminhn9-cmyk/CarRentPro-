import React, { useState, useEffect } from 'react';
import { Typography, Button, Card, Space, Row, Col, Input, DatePicker, Select, Carousel, Tag, Avatar, Divider, Rate } from 'antd';
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
  CalendarOutlined,
  CustomerServiceOutlined,
  SwapOutlined,
  FileDoneOutlined,
  HeartOutlined,
  HeartFilled,
  AimOutlined,
  CompassOutlined,
  SendOutlined,
  PhoneOutlined,
  MailOutlined
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

  useEffect(() => {
    api.vehicles.getAll().then(res => {
      setVehicles(res);
    });
  }, []);

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
    { title: 'SUV', desc: 'Sports Utility Vehicles (Fortuner, GLE, X5)', icon: '🚘', count: 180, color: '#2563eb', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=60' },
    { title: 'Sedan', desc: 'Executive & Business (Camry, Civic RS, E-Class)', icon: '🏎️', count: 140, color: '#fbbf24', img: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=600&auto=format&fit=crop&q=60' },
    { title: 'Luxury', desc: 'Ultra-Premium Fleet (Porsche, Maybach, BMW 7)', icon: '👑', count: 65, color: '#ef4444', img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&auto=format&fit=crop&q=60' },
    { title: 'Electric', desc: 'Smart EV (VinFast VF8/VF9, Tesla Model X)', icon: '⚡', count: 95, color: '#10b981', img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=60' },
    { title: 'MPV', desc: 'Family & Executive Shuttle (Carnival, Alphard)', icon: '🚐', count: 80, color: '#8b5cf6', img: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=600&auto=format&fit=crop&q=60' },
    { title: 'Van', desc: 'Corporate Group Transit (Ford Transit, Solati)', icon: '🚌', count: 40, color: '#06b6d4', img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&auto=format&fit=crop&q=60' }
  ];

  const whyChooseUs = [
    { title: t('why.fastBooking'), desc: t('why.fastBookingDesc'), icon: <RocketOutlined />, color: '#ef4444' },
    { title: t('why.verified'), desc: t('why.verifiedDesc'), icon: <SafetyCertificateOutlined />, color: '#2563eb' },
    { title: t('why.support'), desc: t('why.supportDesc'), icon: <CustomerServiceOutlined />, color: '#fbbf24' },
    { title: t('why.insurance'), desc: t('why.insuranceDesc'), icon: <SafetyCertificateOutlined />, color: '#10b981' },
    { title: t('why.digitalContract'), desc: t('why.digitalContractDesc'), icon: <FileDoneOutlined />, color: '#8b5cf6' },
    { title: t('why.gpsTracking'), desc: t('why.gpsTrackingDesc'), icon: <AimOutlined />, color: '#06b6d4' }
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
    <div className="fade-in" style={{ backgroundColor: '#f8fafc', color: '#0f172a', position: 'relative', overflow: 'hidden' }}>
      
      {/* Ambient Glowing Background Circle Effects */}
      <div style={{
        position: 'absolute',
        top: '100px',
        left: '-150px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, rgba(248,250,252,0) 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        top: '900px',
        right: '-150px',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(251,191,36,0.06) 0%, rgba(248,250,252,0) 70%)',
        pointerEvents: 'none'
      }} />

      {/* SECTION 1: Cinematic Full-Width Auto-Playing Hero Carousel */}
      <section style={{ position: 'relative', overflow: 'hidden', height: '780px' }}>
        <Carousel autoplay autoplaySpeed={5000} effect="fade" style={{ height: '780px' }}>
          {cinematicSlides.map((slide, index) => (
            <div key={index}>
              <div style={{
                height: '780px',
                backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.70) 0%, rgba(15, 23, 42, 0.88) 100%), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                padding: '0 32px',
                position: 'relative'
              }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', paddingBottom: '90px' }}>
                  <Row align="middle">
                    <Col xs={24} lg={16}>
                      <Space direction="vertical" size={24}>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          <Tag color="#2563eb" style={{ padding: '6px 16px', borderRadius: '20px', fontWeight: 800, fontSize: '13px', border: 'none', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
                            {slide.badge}
                          </Tag>
                          <Tag color="#fbbf24" style={{ padding: '6px 16px', borderRadius: '20px', fontWeight: 800, fontSize: '13px', color: '#000', border: 'none' }}>
                            {slide.carModel}
                          </Tag>
                        </div>

                        <Title level={1} style={{ color: '#ffffff', margin: 0, fontSize: '54px', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-1.5px' }}>
                          {slide.title}
                        </Title>

                        <Paragraph style={{ color: '#cbd5e1', fontSize: '19px', margin: 0, lineHeight: 1.6, maxWidth: '680px', fontWeight: 500 }}>
                          {slide.subtitle}
                        </Paragraph>

                        <Space size={18} wrap style={{ marginTop: '16px' }}>
                          {/* Primary Prominent Red CTA Button */}
                          <Button 
                            type="primary" 
                            size="large" 
                            icon={<RocketOutlined />}
                            onClick={() => navigate('/vehicles')}
                            style={{ 
                              height: '56px', 
                              padding: '0 36px', 
                              borderRadius: '14px', 
                              fontWeight: 800, 
                              fontSize: '16px', 
                              backgroundColor: '#ef4444', 
                              borderColor: '#ef4444',
                              boxShadow: '0 8px 24px rgba(239, 68, 68, 0.45)',
                              transition: 'all 0.3s ease'
                            }}
                            className="hover-lift"
                          >
                            {t('hero.btnRentNow')}
                          </Button>

                          {/* Glassmorphism Secondary CTA */}
                          <Button 
                            type="default" 
                            size="large"
                            icon={<CarOutlined />}
                            onClick={() => navigate('/vehicles')}
                            style={{ 
                              height: '56px', 
                              padding: '0 32px', 
                              borderRadius: '14px', 
                              fontWeight: 700, 
                              fontSize: '16px', 
                              backgroundColor: 'rgba(255, 255, 255, 0.12)',
                              borderColor: 'rgba(255, 255, 255, 0.25)',
                              color: '#ffffff',
                              backdropFilter: 'blur(12px)',
                              WebkitBackdropFilter: 'blur(12px)'
                            }}
                            className="hover-lift"
                          >
                            {t('hero.btnExplore')}
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
      </section>

      {/* SECTION 2: Floating Glassmorphism Search Panel Overlapping Hero */}
      <section style={{ marginTop: '-85px', padding: '0 24px', position: 'relative', zIndex: 20 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <Card style={{ 
            borderRadius: '24px', 
            boxShadow: '0 25px 50px rgba(15, 23, 42, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '16px 20px'
          }}>
            <Row gutter={[16, 16]} align="bottom">
              <Col xs={24} sm={12} md={5}>
                <Space direction="vertical" size={6} style={{ width: '100%' }}>
                  <Text strong style={{ fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                    <EnvironmentOutlined style={{ color: '#2563eb', fontSize: '16px' }} /> {t('search.location')}
                  </Text>
                  <Select 
                    defaultValue="hanoi" 
                    style={{ width: '100%', height: '46px' }} 
                    options={[
                      { value: 'hanoi', label: '📍 Hà Nội (Cầu Giấy / Đống Đa / Sân bay)' },
                      { value: 'hcm', label: '📍 TP. HCM (Quận 1 / Quận 3 / Tân Sơn Nhất)' },
                      { value: 'danang', label: '📍 Đà Nẵng (Hải Châu / Sân bay Đà Nẵng)' }
                    ]}
                  />
                </Space>
              </Col>
              
              <Col xs={24} sm={12} md={5}>
                <Space direction="vertical" size={6} style={{ width: '100%' }}>
                  <Text strong style={{ fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                    <CalendarOutlined style={{ color: '#fbbf24', fontSize: '16px' }} /> {t('search.pickupDate')}
                  </Text>
                  <DatePicker showTime style={{ width: '100%', height: '46px', borderRadius: '10px' }} />
                </Space>
              </Col>
              
              <Col xs={24} sm={12} md={5}>
                <Space direction="vertical" size={6} style={{ width: '100%' }}>
                  <Text strong style={{ fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                    <CalendarOutlined style={{ color: '#ef4444', fontSize: '16px' }} /> {t('search.returnDate')}
                  </Text>
                  <DatePicker showTime style={{ width: '100%', height: '46px', borderRadius: '10px' }} />
                </Space>
              </Col>
              
              <Col xs={24} sm={12} md={4}>
                <Space direction="vertical" size={6} style={{ width: '100%' }}>
                  <Text strong style={{ fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                    <CarOutlined style={{ color: '#2563eb', fontSize: '16px' }} /> {t('search.type')}
                  </Text>
                  <Select defaultValue="all" style={{ width: '100%', height: '46px' }} options={[
                    { value: 'all', label: t('search.allTypes') },
                    { value: 'suv', label: '🚘 SUV' },
                    { value: 'sedan', label: '🏎️ Sedan' },
                    { value: 'luxury', label: '👑 Luxury' },
                    { value: 'electric', label: '⚡ Electric' },
                    { value: 'mpv', label: '🚐 MPV' },
                    { value: 'van', label: '🚌 Van' }
                  ]} />
                </Space>
              </Col>
              
              <Col xs={24} md={5}>
                <Button 
                  type="primary" 
                  icon={<SearchOutlined />} 
                  style={{ 
                    width: '100%', 
                    height: '46px', 
                    borderRadius: '12px', 
                    fontWeight: 800, 
                    fontSize: '15px',
                    backgroundColor: '#2563eb',
                    borderColor: '#2563eb',
                    boxShadow: '0 6px 18px rgba(37,99,235,0.4)'
                  }}
                  onClick={() => navigate('/vehicles')}
                  className="hover-lift"
                >
                  {t('search.btn')}
                </Button>
              </Col>
            </Row>
          </Card>
        </div>
      </section>

      {/* SECTION 3: Animated Metric Statistics Grid */}
      <section style={{ padding: '70px 24px 40px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <Row gutter={[24, 24]}>
            {[
              { num: '520+', label: t('stats.vehicles'), color: '#2563eb', icon: <CarOutlined /> },
              { num: '12,000+', label: t('stats.customers'), color: '#10b981', icon: <UsergroupAddOutlined /> },
              { num: '450+', label: t('stats.companies'), color: '#fbbf24', icon: <TrophyOutlined /> },
              { num: '4.9★', label: t('stats.rating'), color: '#ef4444', icon: <StarFilled /> }
            ].map((stat, idx) => (
              <Col xs={12} sm={6} key={idx}>
                <Card 
                  variant="borderless" 
                  className="hover-lift"
                  style={{ 
                    textAlign: 'center', 
                    borderRadius: '20px', 
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 6px 20px rgba(15,23,42,0.04)',
                    padding: '12px 16px'
                  }}
                >
                  <div style={{ 
                    width: '54px', 
                    height: '54px', 
                    borderRadius: '16px', 
                    backgroundColor: stat.color + '15', 
                    color: stat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto',
                    fontSize: '24px'
                  }}>
                    {stat.icon}
                  </div>
                  <Title level={2} style={{ margin: 0, color: '#0f172a', fontWeight: 900, fontSize: '32px', letterSpacing: '-0.5px' }}>
                    {stat.num}
                  </Title>
                  <Text strong style={{ fontSize: '14px', color: '#1e293b', display: 'block', marginTop: '4px' }}>{stat.label}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* SECTION 4: Vehicle Categories (Rounded 20px Cards with Gradient Borders) */}
      <section style={{ padding: '50px 24px 70px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <Tag color="#2563eb" style={{ borderRadius: '12px', padding: '4px 16px', fontWeight: 800, fontSize: '12px' }}>
              {t('cat.tag')}
            </Tag>
            <Title level={2} style={{ margin: '10px 0 0 0', fontWeight: 900, color: '#0f172a', fontSize: '36px', letterSpacing: '-0.5px' }}>
              {t('cat.title')}
            </Title>
            <Text type="secondary" style={{ fontSize: '16px' }}>{t('cat.subtitle')}</Text>
          </div>

          <Row gutter={[24, 24]}>
            {vehicleCategories.map((cat, idx) => (
              <Col xs={24} sm={12} lg={4} key={idx}>
                <Card 
                  hoverable 
                  className="hover-lift"
                  style={{ 
                    borderRadius: '20px', 
                    overflow: 'hidden',
                    border: `1px solid ${cat.color}30`,
                    boxShadow: '0 6px 18px rgba(15,23,42,0.05)',
                    textAlign: 'center'
                  }}
                  styles={{ body: { padding: '20px 16px' } }}
                  onClick={() => navigate('/vehicles')}
                >
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>{cat.icon}</div>
                  <Tag color={cat.color} style={{ borderRadius: '10px', fontWeight: 800, marginBottom: '8px' }}>
                    {cat.count}+ xe
                  </Tag>
                  <Title level={4} style={{ margin: '6px 0 4px 0', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                    {cat.title}
                  </Title>
                  <Text type="secondary" style={{ fontSize: '11px', display: 'block', height: '32px', overflow: 'hidden' }}>
                    {cat.desc}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* SECTION 5: Featured Vehicles Showcase (Zoom Hover & Spec Badges) */}
      <section style={{ padding: '70px 24px', backgroundColor: '#f1f5f9' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <Tag color="#ef4444" style={{ borderRadius: '12px', padding: '4px 16px', fontWeight: 800, fontSize: '12px' }}>
                {t('fleet.tag')}
              </Tag>
              <Title level={2} style={{ margin: '8px 0 0 0', fontWeight: 900, color: '#0f172a', fontSize: '36px', letterSpacing: '-0.5px' }}>
                {t('fleet.title')}
              </Title>
            </div>
            <Button 
              type="primary" 
              onClick={() => navigate('/vehicles')} 
              style={{ borderRadius: '12px', height: '44px', fontWeight: 800, backgroundColor: '#2563eb', padding: '0 24px' }}
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
                    borderRadius: '20px', 
                    border: '1px solid #e2e8f0', 
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(15,23,42,0.06)',
                    backgroundColor: '#ffffff'
                  }}
                  styles={{ body: { padding: '22px' } }}
                >
                  <div style={{ position: 'relative', marginBottom: '18px', overflow: 'hidden', borderRadius: '14px' }}>
                    <img 
                      alt={v.name} 
                      src={v.image} 
                      className="card-img-zoom"
                      style={{ 
                        width: '100%', 
                        height: '210px', 
                        objectFit: 'cover', 
                        borderRadius: '14px',
                        transition: 'transform 0.5s ease'
                      }}
                    />
                    <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                      <Tag color="#2563eb" style={{ borderRadius: '12px', padding: '4px 14px', fontWeight: 800, border: 'none' }}>{v.type}</Tag>
                    </div>

                    {/* Favorite Heart Button */}
                    <div 
                      onClick={(e) => toggleFavorite(v.id, e)}
                      style={{ 
                        position: 'absolute', 
                        top: '12px', 
                        right: '12px', 
                        backgroundColor: 'rgba(255,255,255,0.9)', 
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                    >
                      {favorites[v.id] ? <HeartFilled style={{ color: '#ef4444', fontSize: '18px' }} /> : <HeartOutlined style={{ color: '#64748b', fontSize: '18px' }} />}
                    </div>

                    <div style={{ position: 'absolute', bottom: '12px', right: '12px', backgroundColor: 'rgba(15,23,42,0.85)', padding: '4px 12px', borderRadius: '12px', color: '#fbbf24', fontWeight: 800, fontSize: '12px' }}>
                      <StarFilled /> {v.rating} ({v.reviewsCount})
                    </div>
                  </div>

                  <Title level={4} style={{ margin: 0, fontWeight: 900, color: '#0f172a', fontSize: '20px' }}>{v.name}</Title>
                  <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '14px' }}>📍 {v.location} • BKS {v.licensePlate}</Text>

                  <Space size={[8, 8]} wrap style={{ marginBottom: '18px' }}>
                    <Tag color="default" style={{ borderRadius: '8px', padding: '4px 10px', fontWeight: 600 }}>{v.transmission}</Tag>
                    <Tag color="default" style={{ borderRadius: '8px', padding: '4px 10px', fontWeight: 600 }}>{v.fuel}</Tag>
                    <Tag color="default" style={{ borderRadius: '8px', padding: '4px 10px', fontWeight: 600 }}>{v.seats} {t('fleet.seats')}</Tag>
                  </Space>

                  <Divider style={{ margin: '14px 0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>{t('fleet.dailyRate')}</Text>
                      <Text strong style={{ fontSize: '22px', color: '#ef4444', fontWeight: 900 }}>
                        {formatPrice(v.pricePerDay)}
                      </Text>
                    </div>

                    <Button 
                      type="primary"
                      onClick={() => navigate(`/vehicles/${v.id}`)}
                      style={{ 
                        borderRadius: '10px', 
                        height: '42px', 
                        fontWeight: 800, 
                        backgroundColor: '#ef4444',
                        borderColor: '#ef4444',
                        boxShadow: '0 4px 14px rgba(239,68,68,0.35)',
                        padding: '0 20px'
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

      {/* SECTION 6: Why Choose Us (Luxury Icon Cards) */}
      <section style={{ padding: '90px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <Tag color="#10b981" style={{ borderRadius: '12px', padding: '4px 16px', fontWeight: 800, fontSize: '12px' }}>
              {t('why.tag')}
            </Tag>
            <Title level={2} style={{ margin: '10px 0 0 0', fontWeight: 900, color: '#0f172a', fontSize: '36px', letterSpacing: '-0.5px' }}>
              {t('why.title')}
            </Title>
            <Text type="secondary" style={{ fontSize: '16px' }}>{t('why.subtitle')}</Text>
          </div>

          <Row gutter={[24, 24]}>
            {whyChooseUs.map((feat, idx) => (
              <Col xs={24} sm={12} lg={4} key={idx}>
                <Card 
                  variant="borderless" 
                  className="hover-lift"
                  style={{ 
                    borderRadius: '20px', 
                    height: '100%', 
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 6px 20px rgba(15,23,42,0.04)',
                    padding: '8px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: '16px', 
                    backgroundColor: feat.color + '15', 
                    color: feat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px',
                    margin: '0 auto 18px auto'
                  }}>
                    {feat.icon}
                  </div>
                  <Title level={4} style={{ margin: '0 0 10px 0', fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                    {feat.title}
                  </Title>
                  <Paragraph style={{ color: '#64748b', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                    {feat.desc}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* SECTION 7: How It Works (Horizontal Step Timeline) */}
      <section style={{ padding: '90px 24px', backgroundColor: '#0f172a', color: '#ffffff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <Tag color="#ef4444" style={{ borderRadius: '12px', padding: '4px 16px', fontWeight: 800, fontSize: '12px' }}>
              {t('step.tag')}
            </Tag>
            <Title level={2} style={{ margin: '10px 0 0 0', fontWeight: 900, color: '#ffffff', fontSize: '36px' }}>
              {t('step.title')}
            </Title>
          </div>

          <Row gutter={[20, 24]}>
            {timelineSteps.map((st, idx) => (
              <Col xs={24} sm={12} lg={4.8 as any} key={idx}>
                <div style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '24px 18px',
                  height: '100%',
                  position: 'relative'
                }}>
                  <div style={{ fontSize: '42px', fontWeight: 900, color: '#fbbf24', opacity: 0.9, lineHeight: 1, marginBottom: '16px' }}>
                    {st.step}
                  </div>
                  <Title level={4} style={{ color: '#ffffff', margin: '0 0 10px 0', fontSize: '17px', fontWeight: 800 }}>
                    {st.title}
                  </Title>
                  <Paragraph style={{ color: '#94a3b8', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
                    {st.desc}
                  </Paragraph>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* SECTION 8: Customer Testimonials */}
      <section style={{ padding: '90px 24px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <Tag color="#fbbf24" style={{ borderRadius: '12px', padding: '4px 16px', fontWeight: 800, fontSize: '12px', color: '#000' }}>
              {t('testi.tag')}
            </Tag>
            <Title level={2} style={{ margin: '10px 0 0 0', fontWeight: 900, color: '#0f172a', fontSize: '36px' }}>
              {t('testi.title')}
            </Title>
          </div>

          <Row gutter={[24, 24]}>
            {testimonials.map((item, idx) => (
              <Col xs={24} md={8} key={idx}>
                <Card 
                  variant="borderless" 
                  style={{ 
                    borderRadius: '20px', 
                    height: '100%', 
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 8px 24px rgba(15,23,42,0.05)',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Rate disabled defaultValue={item.rating} style={{ color: '#fbbf24', fontSize: '16px' }} />
                    <Tag color="#2563eb" style={{ borderRadius: '8px', fontWeight: 700 }}>{item.company}</Tag>
                  </div>
                  <Paragraph style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '24px' }}>
                    "{item.content}"
                  </Paragraph>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <Avatar src={item.avatar} size={50} style={{ backgroundColor: '#2563eb' }} />
                    <div>
                      <Text strong style={{ display: 'block', color: '#0f172a', fontSize: '16px', fontWeight: 800 }}>{item.name}</Text>
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
      <section style={{ padding: '50px 24px 70px 24px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '30px' }}>
            {t('partners.title')}
          </Text>
          <Row gutter={[24, 16]} justify="center" align="middle">
            {['VinFast', 'Toyota', 'Mercedes-Benz', 'BMW', 'Audi', 'Hyundai', 'Ford', 'Honda'].map((brand, bIdx) => (
              <Col xs={12} sm={6} md={3} key={bIdx}>
                <div style={{ 
                  padding: '14px 18px', 
                  borderRadius: '14px', 
                  backgroundColor: '#f1f5f9', 
                  fontWeight: 900, 
                  color: '#334155',
                  fontSize: '16px',
                  letterSpacing: '-0.3px',
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
      <section style={{ padding: '90px 24px', background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', color: '#ffffff', textAlign: 'center' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <Tag color="#ef4444" style={{ borderRadius: '12px', padding: '4px 16px', fontWeight: 800, fontSize: '13px', marginBottom: '16px' }}>
            {t('cta.tag')}
          </Tag>
          <Title level={1} style={{ color: '#ffffff', fontWeight: 900, fontSize: '42px', marginBottom: '20px', letterSpacing: '-0.5px' }}>
            {t('cta.title')}
          </Title>
          <Paragraph style={{ color: '#cbd5e1', fontSize: '18px', marginBottom: '36px', lineHeight: 1.6, fontWeight: 500 }}>
            {t('cta.subtitle')}
          </Paragraph>
          <Space size={18} wrap style={{ justifyContent: 'center' }}>
            <Button 
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              onClick={() => navigate('/customer/vehicles')}
              style={{ 
                height: '56px', 
                padding: '0 40px', 
                borderRadius: '14px', 
                fontWeight: 800, 
                fontSize: '16px',
                backgroundColor: '#ef4444',
                borderColor: '#ef4444',
                boxShadow: '0 8px 24px rgba(239, 68, 68, 0.45)'
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
                height: '56px', 
                padding: '0 32px', 
                borderRadius: '14px', 
                fontWeight: 700, 
                fontSize: '16px',
                backgroundColor: 'transparent',
                borderColor: '#ffffff',
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
