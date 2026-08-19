import React from 'react';
import { Button, Typography } from 'antd';
import { InboxOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  style?: React.CSSProperties;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <InboxOutlined style={{ fontSize: '48px', color: '#94a3b8' }} />,
  title = 'Không có dữ liệu',
  description = 'Chưa có dữ liệu nào phù hợp với bộ lọc hoặc hệ thống chưa có mục nào.',
  actionText,
  onAction,
  style
}) => {
  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '48px 24px', 
        textAlign: 'center',
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px dashed #cbd5e1',
        margin: '16px 0',
        ...style 
      }}
    >
      <div style={{ marginBottom: '16px' }}>{icon}</div>
      <Title level={5} style={{ margin: '0 0 8px 0', color: '#0f172a', fontWeight: 600 }}>
        {title}
      </Title>
      <Text type="secondary" style={{ maxWidth: '420px', marginBottom: actionText ? '20px' : 0, fontSize: '13px' }}>
        {description}
      </Text>
      {actionText && onAction && (
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={onAction}
          style={{ 
            borderRadius: '8px', 
            background: '#0f172a', 
            borderColor: '#0f172a',
            fontWeight: 500,
            marginTop: '16px'
          }}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};
