import React from 'react';
import { Steps } from 'antd';

export interface StepItem {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

interface StepperProps {
  current: number;
  items: StepItem[];
  onChange?: (current: number) => void;
  direction?: 'horizontal' | 'vertical';
  style?: React.CSSProperties;
}

export const Stepper: React.FC<StepperProps> = ({
  current,
  items,
  onChange,
  direction = 'horizontal',
  style
}) => {
  return (
    <div 
      style={{ 
        background: '#ffffff', 
        padding: '20px 24px', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
        ...style 
      }}
    >
      <Steps
        current={current}
        onChange={onChange}
        direction={direction}
        responsive
        items={items.map((item, index) => ({
          title: <span style={{ fontWeight: current === index ? 700 : 500, fontSize: '13px' }}>{item.title}</span>,
          description: item.description ? <span style={{ fontSize: '11px' }}>{item.description}</span> : undefined,
          icon: item.icon
        }))}
      />
    </div>
  );
};
