import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Statistic, Table, Space, Spin, Tag } from 'antd';
import { DollarOutlined, RiseOutlined, ShoppingCartOutlined, CarOutlined, LineChartOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { RevenueChart, TypeBarChart } from '@/components/charts/ReportChart';

const { Title, Text } = Typography;

export const RevenueReports: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.stats.getAdminStats()
      .then(res => setStats(res))
      .catch(err => console.error('Failed to load stats', err))
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price || 0);
  };

  if (loading) return (
    <div className="text-center py-24">
      <Spin size="large" tip="Đang tải báo cáo doanh thu...">
        <div className="pt-8" />
      </Spin>
    </div>
  );

  if (!stats) return (
    <div className="text-center py-24 text-red-500 font-medium">
      Không thể tải dữ liệu. Vui lòng thử lại.
    </div>
  );

  // Pre-format monthly data: ensure month string is clean, bookings is a number
  const monthlyData = (stats.revenue?.monthly || []).map((item: any) => {
    let monthStr = String(item.month || '');
    if (monthStr.startsWith('Tháng háng')) {
      monthStr = monthStr.replace('Tháng háng', 'Tháng');
    } else if (monthStr.startsWith('T') && !monthStr.startsWith('Tháng')) {
      const monthNum = monthStr.slice(1);
      monthStr = `Tháng ${monthNum}`;
    }
    return {
      month: monthStr,
      revenue: Number(item.revenue || 0),
      bookings: Number(item.bookings ?? item._count ?? 0)
    };
  });

  // Pre-format category/type data for TypeBarChart with backend response keys { category, count, revenue }
  const typeData = (stats.revenue?.types || []).map((item: any) => ({
    category: item.category || item.type || 'Khác',
    type: item.type || item.category || 'Khác',
    count: Number(item.count ?? item.value ?? 0),
    revenue: Number(item.revenue || 0)
  }));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Báo cáo doanh thu & Phân tích</Title>
        <Text type="secondary">Phân tích chuyên sâu về nguồn thu, hiệu suất dòng xe và hoạt động kinh doanh.</Text>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card variant="borderless" style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #1e3a8a' }}>
            <Statistic
              title="Tổng doanh thu thực tế"
              value={stats.revenue?.total || 0}
              formatter={(value) => formatPrice(Number(value))}
              prefix={<DollarOutlined style={{ color: '#1e3a8a', marginRight: '8px' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant="borderless" style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #10b981' }}>
            <Statistic
              title="Tổng số lượt đặt xe"
              value={stats.bookings?.total || 0}
              prefix={<ShoppingCartOutlined style={{ color: '#10b981', marginRight: '8px' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant="borderless" style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #d97706' }}>
            <Statistic
              title="Doanh thu hôm nay"
              value={stats.revenue?.today || 0}
              formatter={(value) => formatPrice(Number(value))}
              prefix={<LineChartOutlined style={{ color: '#d97706', marginRight: '8px' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Xu hướng doanh thu theo tháng</Title>} 
            variant="borderless" 
            style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            <RevenueChart data={monthlyData} />
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Doanh thu theo loại phương tiện</Title>} 
            variant="borderless" 
            style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            <TypeBarChart data={typeData} />
          </Card>
        </Col>
      </Row>

      <Card 
        title={<Title level={5} style={{ margin: 0 }}>Bảng phân tích dòng tiền chi tiết theo tháng</Title>} 
        variant="borderless" 
        style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
      >
        <Table
          dataSource={monthlyData}
          rowKey="month"
          pagination={false}
          columns={[
            {
              title: 'Tháng',
              dataIndex: 'month',
              key: 'month',
              width: 120,
              render: (text: string) => {
                let monthLabel = String(text || '');
                if (monthLabel.startsWith('Tháng háng')) {
                  monthLabel = monthLabel.replace('Tháng háng', 'Tháng');
                } else if (monthLabel.startsWith('T') && !monthLabel.startsWith('Tháng')) {
                  const monthNum = monthLabel.slice(1);
                  monthLabel = `Tháng ${monthNum}`;
                }
                return <Text strong>{monthLabel}</Text>;
              }
            },
            {
              title: 'Lượt đặt xe',
              dataIndex: 'bookings',
              key: 'bookings',
              width: 140,
              render: (val: number) => (
                <Space>
                  <Tag color={val > 0 ? 'blue' : 'default'}>{val} đơn hàng</Tag>
                </Space>
              )
            },
            {
              title: 'Doanh thu thuần',
              dataIndex: 'revenue',
              key: 'revenue',
              render: (revenue: number) => (
                <Text strong style={{ color: revenue > 0 ? '#1e3a8a' : '#94a3b8' }}>
                  {formatPrice(revenue)}
                </Text>
              )
            }
          ]}
        />
      </Card>
    </div>
  );
};
