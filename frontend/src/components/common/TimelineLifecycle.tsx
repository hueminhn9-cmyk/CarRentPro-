import React from 'react';
import { Timeline, Typography, Tag, Space } from 'antd';
import {
  CheckCircleFilled,
  ClockCircleFilled,
  SyncOutlined,
  CloseCircleFilled,
  CarFilled,
  DollarCircleFilled,
  FileDoneOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;

export interface LifecycleEvent {
  title: string;
  timestamp?: string;
  description?: string;
  status: 'completed' | 'in_progress' | 'pending' | 'cancelled';
  tag?: string;
}

interface TimelineLifecycleProps {
  events: LifecycleEvent[];
  style?: React.CSSProperties;
}

export const TimelineLifecycle: React.FC<TimelineLifecycleProps> = ({ events, style }) => {
  const getDotIcon = (status: LifecycleEvent['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleFilled style={{ fontSize: '18px', color: '#16a34a' }} />;
      case 'in_progress':
        return <SyncOutlined spin style={{ fontSize: '18px', color: '#2563eb' }} />;
      case 'cancelled':
        return <CloseCircleFilled style={{ fontSize: '18px', color: '#dc2626' }} />;
      case 'pending':
      default:
        return <ClockCircleFilled style={{ fontSize: '16px', color: '#94a3b8' }} />;
    }
  };

  const getTimelineColor = (status: LifecycleEvent['status']) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'in_progress':
        return 'blue';
      case 'cancelled':
        return 'red';
      case 'pending':
      default:
        return 'gray';
    }
  };

  return (
    <div 
      style={{ 
        background: '#ffffff', 
        padding: '24px', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0',
        ...style 
      }}
    >
      <Title level={5} style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
        Vòng đời & Tiến trình xử lý
      </Title>
      
      <Timeline
        items={events.map((event) => ({
          color: getTimelineColor(event.status),
          dot: getDotIcon(event.status),
          children: (
            <div style={{ paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <Space>
                  <Text strong style={{ 
                    fontSize: '14px', 
                    color: event.status === 'pending' ? '#64748b' : '#0f172a',
                    fontWeight: event.status === 'in_progress' ? 700 : 600
                  }}>
                    {event.title}
                  </Text>
                  {event.tag && (
                    <Tag color={event.status === 'completed' ? 'success' : event.status === 'in_progress' ? 'processing' : 'default'} style={{ fontSize: '11px' }}>
                      {event.tag}
                    </Tag>
                  )}
                </Space>
                {event.timestamp && (
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {event.timestamp}
                  </Text>
                )}
              </div>
              {event.description && (
                <div style={{ marginTop: '4px' }}>
                  <Text type="secondary" style={{ fontSize: '13px', color: '#475569' }}>
                    {event.description}
                  </Text>
                </div>
              )}
            </div>
          )
        }))}
      />
    </div>
  );
};
