import React from 'react';
import { Button, Typography } from 'antd';
import { WarningOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  style?: React.CSSProperties;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Đã xảy ra lỗi khi tải dữ liệu',
  message = 'Không thể kết nối với máy chủ hoặc phiên làm việc đã hết hạn. Vui lòng thử lại.',
  onRetry,
  style
}) => {
  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '40px 24px', 
        textAlign: 'center',
        background: '#fef2f2',
        borderRadius: '12px',
        border: '1px solid #fecaca',
        margin: '16px 0',
        ...style 
      }}
    >
      <div style={{ 
        width: '56px', 
        height: '56px', 
        borderRadius: '50%', 
        background: '#fee2e2', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '16px' 
      }}>
        <WarningOutlined style={{ fontSize: '28px', color: '#dc2626' }} />
      </div>
      <Title level={5} style={{ margin: '0 0 8px 0', color: '#991b1b', fontWeight: 600 }}>
        {title}
      </Title>
      <Text style={{ maxWidth: '460px', color: '#b91c1c', marginBottom: onRetry ? '20px' : 0, fontSize: '13px' }}>
        {message}
      </Text>
      {onRetry && (
        <Button 
          type="primary" 
          danger
          icon={<ReloadOutlined />} 
          onClick={onRetry}
          style={{ 
            borderRadius: '8px', 
            fontWeight: 500,
            marginTop: '16px'
          }}
        >
          Tải lại dữ liệu
        </Button>
      )}
    </div>
  );
};
