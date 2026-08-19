import React from 'react';
import { Tag } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  CarOutlined,
  ToolOutlined,
  ExclamationCircleOutlined,
  FileDoneOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';

export type StatusType = 
  // Vehicle status
  | 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'INCIDENT' | 'INACTIVE' | 'RESERVED'
  | 'Có sẵn' | 'Đang thuê' | 'Bảo dưỡng' | 'Sự cố' | 'Ngừng hoạt động' | 'Đã đặt'
  // Booking status
  | 'PENDING' | 'CONFIRMED' | 'READY_FOR_PICKUP' | 'ACTIVE' | 'WAITING_FOR_RETURN' | 'COMPLETED' | 'CANCELLED' | 'REJECTED' | 'OVERDUE'
  | 'Chờ xác nhận' | 'Chờ duyệt' | 'Đã xác nhận' | 'Sẵn sàng giao' | 'Đang diễn ra' | 'Chờ trả xe' | 'Hoàn thành' | 'Đã hủy' | 'Từ chối' | 'Quá hạn'
  // Contract status
  | 'DRAFT' | 'PENDING_SIGN' | 'SIGNED' | 'TERMINATED'
  | 'Bản nháp' | 'Chờ ký' | 'Đã ký' | 'Đã chấm dứt'
  // Customer license verification status
  | 'VERIFIED' | 'REJECTED' | 'UNVERIFIED'
  | 'Đã xác minh' | 'Chưa cập nhật' | 'Chưa xác minh'
  // Payment status
  | 'PAID' | 'REFUNDED' | 'FAILED'
  | 'Đã thanh toán' | 'Chờ thanh toán' | 'Hoàn tiền' | 'Thất bại'
  | string;

interface StatusBadgeProps {
  status: StatusType;
  showIcon?: boolean;
  style?: React.CSSProperties;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showIcon = true, style }) => {
  let color = 'default';
  let icon: React.ReactNode = null;
  let text = status;

  const normalized = (status || '').toUpperCase().replace(/\s+/g, '_');

  switch (normalized) {
    // Green - Success
    case 'AVAILABLE':
    case 'CÓ_SẴN':
    case 'CO_SAN':
      color = 'success';
      icon = <CarOutlined />;
      text = 'Có sẵn';
      break;
    case 'COMPLETED':
    case 'HOÀN_THÀNH':
    case 'HOAN_THANH':
      color = 'success';
      icon = <CheckCircleOutlined />;
      text = 'Hoàn thành';
      break;
    case 'SIGNED':
    case 'ĐÃ_KÝ':
    case 'DA_KY':
      color = 'success';
      icon = <FileDoneOutlined />;
      text = 'Đã ký';
      break;
    case 'VERIFIED':
    case 'ĐÃ_XÁC_MINH':
    case 'DA_XAC_MINH':
      color = 'success';
      icon = <SafetyCertificateOutlined />;
      text = 'Đã xác minh';
      break;
    case 'PAID':
    case 'ĐÃ_THANH_TOÁN':
    case 'DA_THANH_TOAN':
      color = 'success';
      icon = <CheckCircleOutlined />;
      text = 'Đã thanh toán';
      break;

    // Blue - Processing / Active
    case 'ACTIVE':
    case 'RENTED':
    case 'ĐANG_THUÊ':
    case 'DANG_THUE':
    case 'ĐANG_DIỄN_RA':
      color = 'processing';
      icon = <SyncOutlined spin />;
      text = normalized.includes('RENT') || normalized.includes('THUÊ') ? 'Đang thuê' : 'Đang diễn ra';
      break;
    case 'CONFIRMED':
    case 'ĐÃ_XÁC_NHẬN':
    case 'DA_XAC_NHAN':
      color = 'processing';
      icon = <CheckCircleOutlined />;
      text = 'Đã xác nhận';
      break;
    case 'READY_FOR_PICKUP':
    case 'SẴN_SÀNG_GIAO':
      color = 'cyan';
      icon = <CarOutlined />;
      text = 'Sẵn sàng giao';
      break;
    case 'WAITING_FOR_RETURN':
    case 'CHỜ_TRẢ_XE':
      color = 'purple';
      icon = <ClockCircleOutlined />;
      text = 'Chờ trả xe';
      break;

    // Amber / Orange - Warning / Pending
    case 'PENDING':
    case 'CHỜ_XÁC_NHẬN':
    case 'CHO_XAC_NHAN':
    case 'CHỜ_DUYỆT':
    case 'CHO_DUYET':
      color = 'warning';
      icon = <ClockCircleOutlined />;
      text = 'Chờ duyệt';
      break;
    case 'PENDING_SIGN':
    case 'CHỜ_KÝ':
    case 'CHO_KY':
      color = 'warning';
      icon = <ClockCircleOutlined />;
      text = 'Chờ ký';
      break;
    case 'CHỜ_THANH_TOÁN':
    case 'CHO_THANH_TOAN':
      color = 'warning';
      icon = <ClockCircleOutlined />;
      text = 'Chờ thanh toán';
      break;
    case 'MAINTENANCE':
    case 'BẢO_DƯỠNG':
    case 'BAO_DUONG':
      color = 'gold';
      icon = <ToolOutlined />;
      text = 'Bảo dưỡng';
      break;
    case 'RESERVED':
    case 'ĐÃ_ĐẶT':
    case 'DA_DAT':
      color = 'geekblue';
      icon = <ClockCircleOutlined />;
      text = 'Đã đặt';
      break;

    // Red - Error / Alert / Cancelled
    case 'CANCELLED':
    case 'ĐÃ_HỦY':
    case 'DA_HUY':
      color = 'default';
      icon = <CloseCircleOutlined />;
      text = 'Đã hủy';
      break;
    case 'REJECTED':
    case 'TỪ_CHỐI':
    case 'TU_CHOI':
      color = 'error';
      icon = <CloseCircleOutlined />;
      text = 'Từ chối';
      break;
    case 'OVERDUE':
    case 'QUÁ_HẠN':
    case 'QUA_HAN':
      color = 'error';
      icon = <ExclamationCircleOutlined />;
      text = 'Quá hạn';
      break;
    case 'INCIDENT':
    case 'SỰ_CỐ':
    case 'SU_CO':
      color = 'error';
      icon = <ExclamationCircleOutlined />;
      text = 'Sự cố';
      break;
    case 'REFUNDED':
    case 'HOÀN_TIỀN':
    case 'HOAN_TIEN':
      color = 'magenta';
      icon = <SyncOutlined />;
      text = 'Hoàn tiền';
      break;
    case 'FAILED':
    case 'THẤT_BẠI':
    case 'THAT_BAI':
      color = 'error';
      icon = <CloseCircleOutlined />;
      text = 'Thất bại';
      break;

    // Neutral / Inactive
    case 'INACTIVE':
    case 'NGỪNG_HOẠT_ĐỘNG':
    case 'CHƯA_CẬP_NHẬT':
    case 'UNVERIFIED':
    case 'DRAFT':
    case 'BẢN_NHÁP':
      color = 'default';
      icon = <ClockCircleOutlined />;
      text = status;
      break;

    default:
      color = 'default';
      text = status;
  }

  return (
    <Tag 
      color={color} 
      icon={showIcon ? icon : undefined}
      style={{ 
        borderRadius: '6px', 
        padding: '2px 8px', 
        fontSize: '12px',
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        ...style 
      }}
    >
      {text}
    </Tag>
  );
};
