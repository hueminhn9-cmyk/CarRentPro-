import React from 'react';
import { Skeleton, Card, Row, Col, Space } from 'antd';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5 }) => {
  return (
    <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Skeleton.Input active size="default" style={{ width: '220px' }} />
        <Space>
          <Skeleton.Button active size="default" style={{ width: '100px' }} />
          <Skeleton.Button active size="default" style={{ width: '120px' }} />
        </Space>
      </div>
      {Array.from({ length: rows }).map((_, index) => (
        <div 
          key={index} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '14px 0',
            borderBottom: index < rows - 1 ? '1px solid #f1f5f9' : 'none' 
          }}
        >
          <Skeleton.Avatar active size="small" shape="square" style={{ marginRight: '16px' }} />
          <Skeleton.Input active size="small" style={{ width: '25%', marginRight: '16px' }} />
          <Skeleton.Input active size="small" style={{ width: '20%', marginRight: '16px' }} />
          <Skeleton.Input active size="small" style={{ width: '15%', marginRight: '16px' }} />
          <Skeleton.Button active size="small" style={{ width: '80px' }} />
        </div>
      ))}
    </div>
  );
};

export const CardGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <Row gutter={[20, 20]}>
      {Array.from({ length: count }).map((_, index) => (
        <Col xs={24} sm={12} md={8} lg={8} key={index}>
          <Card 
            style={{ borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}
            cover={<Skeleton.Image active style={{ width: '100%', height: '180px' }} />}
          >
            <Skeleton active paragraph={{ rows: 3 }} />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export const StatCardsSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <Row gutter={[16, 16]}>
      {Array.from({ length: count }).map((_, index) => (
        <Col xs={24} sm={12} lg={6} key={index}>
          <Card style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <Skeleton active avatar paragraph={{ rows: 1 }} />
          </Card>
        </Col>
      ))}
    </Row>
  );
};
