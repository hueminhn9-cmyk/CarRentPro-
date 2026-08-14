import React from 'react';
import { Tag } from 'antd';

export type StatusType = 
  | 'Có sẵn' 
  | 'Đang thuê' 
  | 'Bảo dưỡng' 
  | 'Chờ xác nhận' 
  | 'Hoàn thành' 
  | 'Đã hủy'
  | 'Đã ký'
  | 'Chờ ký'
  | 'Quá hạn'
  | 'Đã xác minh'
  | 'Chờ duyệt'
  | 'Chưa cập nhật'
  | 'Đã thanh toán'
  | 'Chờ thanh toán'
  | 'Hoàn tiền';

interface StatusBadgeProps {
  status: StatusType;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let color = 'default';
  
  switch (status) {
    // Vehicle status
    case 'Có sẵn':
      color = 'success';
      break;
    case 'Đang thuê':
      color = 'processing';
      break;
    case 'Bảo dưỡng':
      color = 'warning';
      break;

    // Booking status
    case 'Chờ xác nhận':
      color = 'warning';
      break;
    case 'Hoàn thành':
      color = 'success';
      break;
    case 'Đã hủy':
      color = 'error';
      break;

    // Contract status
    case 'Đã ký':
      color = 'success';
      break;
    case 'Chờ ký':
      color = 'warning';
      break;
    case 'Quá hạn':
      color = 'error';
      break;

    // Customer license verification status
    case 'Đã xác minh':
      color = 'success';
      break;
    case 'Chờ duyệt':
      color = 'warning';
      break;
    case 'Chưa cập nhật':
      color = 'default';
      break;

    // Payment status
    case 'Đã thanh toán':
      color = 'success';
      break;
    case 'Chờ thanh toán':
      color = 'warning';
      break;
    case 'Hoàn tiền':
      color = 'error';
      break;

    default:
      color = 'default';
  }

  return (
    <Tag color={color} style={{ borderRadius: '12px', padding: '2px 10px', fontWeight: 500 }}>
      {status}
    </Tag>
  );
};
