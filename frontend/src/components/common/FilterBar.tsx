import React from 'react';
import { Input, Select, DatePicker, Button, Space } from 'antd';
import { SearchOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

export interface FilterOption {
  label: string;
  value: string | number;
}

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  statusOptions?: FilterOption[];
  statusValue?: string | number;
  onStatusChange?: (val: any) => void;
  showDateRange?: boolean;
  onDateRangeChange?: (dates: any) => void;
  extraFilters?: React.ReactNode;
  onReset?: () => void;
  style?: React.CSSProperties;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchPlaceholder = 'Tìm kiếm theo từ khóa...',
  searchValue,
  onSearchChange,
  statusOptions,
  statusValue,
  onStatusChange,
  showDateRange = false,
  onDateRangeChange,
  extraFilters,
  onReset,
  style
}) => {
  return (
    <div 
      style={{ 
        background: '#ffffff', 
        padding: '16px 20px', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...style 
      }}
    >
      <Space wrap size={12} style={{ flex: 1 }}>
        {onSearchChange && (
          <Input
            placeholder={searchPlaceholder}
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ width: '260px', borderRadius: '8px' }}
            allowClear
          />
        )}

        {statusOptions && onStatusChange && (
          <Select
            placeholder="Tất cả trạng thái"
            value={statusValue}
            onChange={onStatusChange}
            options={statusOptions}
            style={{ width: '180px' }}
            allowClear
          />
        )}

        {showDateRange && onDateRangeChange && (
          <RangePicker 
            onChange={onDateRangeChange}
            style={{ borderRadius: '8px' }}
            placeholder={['Từ ngày', 'Đến ngày']}
          />
        )}

        {extraFilters}
      </Space>

      {onReset && (
        <Button 
          icon={<ReloadOutlined />} 
          onClick={onReset}
          style={{ borderRadius: '8px' }}
        >
          Đặt lại
        </Button>
      )}
    </div>
  );
};
