import React from 'react';
import { Layout, Menu, Button, Space, Typography, Divider, Input, Row, Col, Tag, Select } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { CarOutlined, RocketOutlined, PhoneOutlined, MailOutlined, SafetyCertificateOutlined, ArrowRightOutlined, SendOutlined, GlobalOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

const { Header, Content, Footer } = Layout;
const { Text, Title, Paragraph } = Typography;

export const PublicLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = api.auth.getCurrentUser();
  const { language, setLanguage, t } = useLanguage();

  const handleMenuClick = (e: { key: string }) => {
    if (e.key === 'home') {
      navigate('/');
    } else if (e.key === 'vehicles') {
      navigate('/vehicles');
    } else if (e.key === 'enterprise') {
      navigate('/customer/support');
    } else if (e.key === 'support') {
      navigate('/customer/support');
    }
  };

  const activeKey = location.pathname === '/' 
    ? 'home' 
    : location.pathname.includes('/vehicles') 
      ? 'vehicles' 
      : location.pathname.includes('/support') 
        ? 'support' 
        : '';

  const isHomePage = location.pathname === '/';

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Sticky Glassmorphism Header */}
      <Header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        padding: '0 32px',
        height: '72px',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
        lineHeight: 'normal'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('/')} 
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px',
            boxShadow: '0 4px 12px rgba(30, 58, 138, 0.25)'
          }}>
            <CarOutlined style={{ fontSize: '22px', color: '#fbbf24' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '19px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>AutoRent</span>
              <span style={{ 
                color: '#1e3a8a', 
                fontSize: '11px', 
                fontWeight: 800, 
                backgroundColor: '#f0f3ff', 
                border: '1px solid #c7d2fe', 
                padding: '1px 6px', 
                borderRadius: '6px',
                lineHeight: '1.4' 
              }}>PRO</span>
            </div>
            <Text type="secondary" style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.2, marginTop: '2px' }}>
              Enterprise Fleet Solutions
            </Text>
          </div>
        </div>

        {/* Center Navigation Menu */}
        <Menu
          mode="horizontal"
          selectedKeys={[activeKey]}
          onClick={handleMenuClick}
          style={{ 
            flex: 1, 
            borderBottom: 'none', 
            justifyContent: 'center', 
            minWidth: 0,
            fontSize: '15px',
            fontWeight: 600,
            backgroundColor: 'transparent',
            lineHeight: '70px'
          }}
          items={[
            { key: 'home', label: t('nav.home') },
            { key: 'vehicles', label: t('nav.vehicles') },
            { key: 'enterprise', label: t('nav.enterprise') },
            { key: 'pricing', label: t('nav.pricing') },
            { key: 'support', label: t('nav.support') },
            { key: 'contact', label: t('nav.contact') }
          ]}
        />

        {/* Right CTA Actions */}
        <Space size={12}>
          {/* Language Switcher */}
          <Select
            value={language}
            onChange={(val) => setLanguage(val as 'vi' | 'en')}
            className="w-[125px]"
            variant="borderless"
            styles={{ popup: { root: { borderRadius: '10px' } } }}
            options={[
              { value: 'vi', label: <span className="font-semibold">🇻🇳 Tiếng Việt</span> },
              { value: 'en', label: <span className="font-semibold">🇬🇧 English</span> }
            ]}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0f172a', fontWeight: 700, fontSize: '13px', padding: '0 6px' }}>
            <PhoneOutlined style={{ color: '#1e3a8a', fontSize: '15px' }} />
            <span>1900 6868</span>
          </div>

          {currentUser ? (
            <Button 
              type="primary" 
              style={{ 
                borderRadius: '10px', 
                backgroundColor: '#1e3a8a',
                height: '42px',
                fontWeight: 700,
                padding: '0 18px',
                boxShadow: '0 4px 14px rgba(30, 58, 138, 0.3)'
              }}
              onClick={() => {
                if (currentUser.role === 'admin') navigate('/admin/dashboard');
                else if (currentUser.role === 'manager') navigate('/manager/dashboard');
                else navigate('/customer/dashboard');
              }}
            >
              {t('nav.portal')} ({currentUser.role?.toUpperCase()})
            </Button>
          ) : (
            <>
              <Button 
                type="text" 
                onClick={() => navigate('/auth/login')}
                style={{ borderRadius: '8px', fontWeight: 600, color: '#475569', height: '40px' }}
              >
                {t('nav.login')}
              </Button>

              <Button 
                type="default" 
                onClick={() => navigate('/auth/register')}
                style={{ borderRadius: '8px', fontWeight: 600, color: '#1e3a8a', borderColor: '#1e3a8a', height: '40px' }}
              >
                {t('nav.register')}
              </Button>

              {/* Prominent Rent Now CTA Button (Red) */}
              <Button 
                type="primary" 
                icon={<RocketOutlined />}
                onClick={() => navigate('/vehicles')}
                style={{ 
                  borderRadius: '10px', 
                  backgroundColor: '#ef4444', 
                  borderColor: '#ef4444',
                  height: '42px',
                  padding: '0 20px',
                  fontWeight: 800,
                  fontSize: '14px',
                  boxShadow: '0 4px 16px rgba(239, 68, 68, 0.35)',
                  transition: 'all 0.3s ease'
                }}
                className="hover-lift"
              >
                {t('nav.rentNow')}
              </Button>
            </>
          )}
        </Space>
      </Header>

      <Content style={{ 
        minHeight: 'calc(100vh - 72px - 220px)',
        padding: isHomePage ? '0' : '32px 24px 60px 24px',
        backgroundColor: '#f8fafc'
      }}>
        <Outlet />
      </Content>

      {/* Modern Enterprise SaaS Footer */}
      <Footer style={{ 
        backgroundColor: '#0f172a', 
        color: '#94a3b8',
        padding: '60px 32px 30px 32px',
        borderTop: '1px solid #1e293b'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <Row gutter={[48, 32]}>
            {/* Column 1: Brand Info */}
            <Col xs={24} sm={12} lg={8}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <CarOutlined style={{ fontSize: '20px', color: '#ffffff' }} />
                </div>
                <Title level={4} style={{ margin: 0, color: '#ffffff', fontWeight: 800 }}>AutoRent Pro</Title>
              </div>
              <Paragraph style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
                Nền tảng Thuê xe Tự lái & Quản lý Hạm đội Xe Doanh nghiệp Hàng đầu Việt Nam. Chuẩn hóa quy trình vận hành khép kín cho Admin, Manager và Khách hàng.
              </Paragraph>
              <Space size={8}>
                <Tag color="#2563eb" style={{ borderRadius: '12px', padding: '2px 10px', fontWeight: 600 }}>✦ SaaS Enterprise</Tag>
                <Tag color="#facc15" style={{ borderRadius: '12px', padding: '2px 10px', fontWeight: 600, color: '#000' }}>★ ISO 9001:2026</Tag>
              </Space>
            </Col>
            
            {/* Column 2: Quick Links */}
            <Col xs={24} sm={12} lg={5}>
              <Title level={5} style={{ fontSize: '15px', color: '#ffffff', marginBottom: '20px', fontWeight: 700 }}>Dịch vụ chính</Title>
              <Space direction="vertical" size={12} style={{ display: 'flex' }}>
                <a href="/vehicles" style={{ color: '#cbd5e1', fontSize: '14px', transition: 'color 0.2s' }}>Thuê xe tự lái 4-7 chỗ</a>
                <a href="/vehicles" style={{ color: '#cbd5e1', fontSize: '14px' }}>Thuê xe điện VinFast ADAS</a>
                <a href="/vehicles" style={{ color: '#cbd5e1', fontSize: '14px' }}>Xe đưa đón doanh nghiệp</a>
                <a href="/customer/support" style={{ color: '#cbd5e1', fontSize: '14px' }}>Bảo hiểm vật chất 2 chiều</a>
              </Space>
            </Col>

            {/* Column 3: Contact Info */}
            <Col xs={24} sm={12} lg={5}>
              <Title level={5} style={{ fontSize: '15px', color: '#ffffff', marginBottom: '20px', fontWeight: 700 }}>Liên hệ & Hỗ trợ</Title>
              <Space direction="vertical" size={12} style={{ color: '#cbd5e1', fontSize: '14px' }}>
                <div><PhoneOutlined style={{ color: '#2563eb', marginRight: '8px' }} /> Hotline 24/7: <strong>1900 6868</strong></div>
                <div><MailOutlined style={{ color: '#facc15', marginRight: '8px' }} /> Email: contact@autorent.vn</div>
                <div><SafetyCertificateOutlined style={{ color: '#ef4444', marginRight: '8px' }} /> Trụ sở: Quận Hải Châu, Đà Nẵng</div>
              </Space>
            </Col>

            {/* Column 4: Newsletter */}
            <Col xs={24} sm={12} lg={6}>
              <Title level={5} style={{ fontSize: '15px', color: '#ffffff', marginBottom: '16px', fontWeight: 700 }}>Đăng ký Nhận Ưu Đãi</Title>
              <Text style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '12px' }}>
                Nhận ngay mã giảm giá 15% cho lần thuê đầu tiên và các ưu đãi chương trình doanh nghiệp.
              </Text>
              <Space.Compact style={{ width: '100%' }}>
                <Input placeholder="Email của bạn..." style={{ height: '40px', borderRadius: '8px 0 0 8px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff' }} />
                <Button type="primary" icon={<SendOutlined />} style={{ height: '40px', borderRadius: '0 8px 8px 0', backgroundColor: '#ef4444', borderColor: '#ef4444' }} />
              </Space.Compact>
            </Col>
          </Row>

          <Divider style={{ margin: '40px 0 24px 0', borderColor: '#1e293b' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <Text style={{ color: '#64748b', fontSize: '13px' }}>
              © {new Date().getFullYear()} AutoRent SaaS Enterprise. Bảo lưu mọi quyền.
            </Text>
            <Space size={24} style={{ fontSize: '13px', color: '#64748b' }}>
              <span>Điều khoản sử dụng</span>
              <span>Chính sách bảo mật</span>
              <span>Quy trình ký hợp đồng số</span>
            </Space>
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

