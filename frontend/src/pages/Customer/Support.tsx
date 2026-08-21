import React from 'react';
import { Card, Collapse, Input, Typography, Button, Space, Row, Col } from 'antd';
import { SearchOutlined, QuestionCircleOutlined, PhoneOutlined, MailOutlined, HomeOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export const CustomerSupport: React.FC = () => {
  const faqs = [
    {
      key: '1',
      label: 'Tôi cần chuẩn bị những giấy tờ gì khi đến nhận xe tự lái?',
      children: 'Quý khách vui lòng chuẩn bị: Bản gốc căn cước công dân (CCCD) gắn chip, bản gốc Giấy phép lái xe (GPLX) hạng B1 hoặc B2 trở lên trùng khớp thông tin đã tải lên hệ thống. Tùy thuộc gói dịch vụ, quý khách có thể cần mang theo tài sản đặt cọc thế chấp (như xe máy chính chủ hoặc tiền mặt tương ứng 15,000,000đ).'
    },
    {
      key: '2',
      label: 'Chính sách hủy đơn đặt xe tại AutoRent thế nào?',
      children: 'Quý khách có thể hủy đơn miễn phí trước 24 giờ so với giờ nhận xe dự kiến. Hủy đơn trong vòng 24 giờ trước thời gian nhận xe sẽ chịu mức phí phạt hủy ngang tương ứng 30% giá trị cọc thuê xe.'
    },
    {
      key: '3',
      label: 'Bảo hiểm vật chất xe tự lái hoạt động ra sao khi xảy ra va chạm?',
      children: 'Tất cả xe của AutoRent đều được trang bị bảo hiểm vật chất xe cơ giới tự nguyện 2 chiều. Khi xảy ra va chạm hoặc tai nạn, quý khách vui lòng giữ nguyên hiện trường và liên hệ ngay hotline khẩn cấp của bảo hiểm (được in trên giấy chứng nhận để trong cốp xe) hoặc hotline AutoRent 1900 6868 để nhận hỗ trợ xử lý. Quý khách chỉ chịu trách nhiệm thanh toán mức phí khấu trừ bảo hiểm (thường là 2,000,000đ/vụ) nếu lỗi thuộc về nguyên nhân bất khả kháng.'
    },
    {
      key: '4',
      label: 'Cách thức xử lý khi xe bị hỏng hóc hoặc gặp sự cố dọc đường?',
      children: 'AutoRent cung cấp dịch vụ cứu hộ khẩn cấp 24/7. Nếu xe gặp sự cố động cơ, lốp hoặc hệ thống điện dọc đường, vui lòng dừng xe an toàn, bật đèn cảnh báo nguy hiểm và gọi ngay số hotline 1900 6868. Chúng tôi sẽ điều xe cứu hộ chuyên dụng gần nhất đến hỗ trợ sửa chữa hoặc đổi xe tương đương cho quý khách tiếp tục hành trình.'
    }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <Title level={2} style={{ fontWeight: 700, margin: '0 0 12px 0' }}>Trung tâm hỗ trợ khách hàng</Title>
        <Text type="secondary" style={{ fontSize: '15px' }}>Giải đáp các thắc mắc thường gặp và hỗ trợ kỹ thuật trên hành trình.</Text>
        <div style={{ maxWidth: '600px', margin: '24px auto 0 auto' }}>
          <Input 
            placeholder="Tìm kiếm câu hỏi giải đáp..." 
            prefix={<SearchOutlined style={{ color: '#727786' }} />} 
            style={{ height: '46px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}
          />
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Side: FAQs */}
        <Col xs={24} md={16}>
          <Card 
            title={
              <Space>
                <QuestionCircleOutlined style={{ color: '#1677ff' }} />
                <span>Câu hỏi thường gặp</span>
              </Space>
            } 
            variant="borderless" 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            <Collapse 
              accordion 
              items={faqs}
              style={{ backgroundColor: '#ffffff', border: 'none' }}
            />
          </Card>
        </Col>

        {/* Right Side: Contact Box */}
        <Col xs={24} md={8}>
          <Card 
            title={<Title level={5} style={{ margin: 0, fontSize: '15px' }}>Liên hệ khẩn cấp</Title>} 
            variant="borderless" 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', backgroundColor: '#001529', color: '#ffffff' }}
            headStyle={{ borderBottom: '1px solid #002c54' }}
          >
            <Space direction="vertical" size={20} style={{ width: '100%', color: '#dbe1ff' }}>
              <div>
                <Space>
                  <PhoneOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
                  <strong style={{ color: '#ffffff' }}>Hotline 24/7:</strong>
                </Space>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>1900 6868</div>
              </div>

              <div>
                <Space>
                  <MailOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
                  <strong style={{ color: '#ffffff' }}>Email hỗ trợ:</strong>
                </Space>
                <div style={{ color: '#ffffff', marginTop: '4px' }}>support@autorent.vn</div>
              </div>

              <div>
                <Space>
                  <HomeOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
                  <strong style={{ color: '#ffffff' }}>Showroom chính:</strong>
                </Space>
                <div style={{ fontSize: '13px', marginTop: '4px' }}>
                  Lô C15, Đường Nguyễn Văn Linh, Phường Nam Dương, Quận Hải Châu, Đà Nẵng
                </div>
              </div>

              <Button type="primary" block style={{ height: '40px', borderRadius: '6px', fontWeight: 600, border: 'none', backgroundColor: '#1890ff' }}>
                Gửi yêu cầu hỗ trợ (Ticket)
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
