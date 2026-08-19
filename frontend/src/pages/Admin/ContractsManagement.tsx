import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Typography, Space, message } from 'antd';
import { FileProtectOutlined, DownloadOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { Contract } from '@/services/mockData';
import { StatusBadge } from '@/components/common/StatusBadge';

const { Title, Text } = Typography;

export const ContractsManagement: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.contracts.getAll().then(res => {
      setContracts(res);
      setLoading(false);
    });
  }, []);

  const columns = [
    {
      title: 'Mã hợp đồng',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Mã đơn thuê',
      dataIndex: 'bookingCode',
      key: 'bookingCode',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Phương tiện',
      dataIndex: 'vehicleName',
      key: 'vehicleName',
    },
    {
      title: 'Biển kiểm soát',
      dataIndex: 'licensePlate',
      key: 'licensePlate',
    },
    {
      title: 'Thời hạn thuê',
      key: 'dates',
      render: (_, record: Contract) => (
        <span>{record.startDate} - {record.endDate}</span>
      )
    },
    {
      title: 'Trạng thái ký',
      dataIndex: 'status',
      key: 'status',
      render: (status: any) => <StatusBadge status={status} />
    },
    {
      title: 'Tải xuống',
      key: 'actions',
      render: () => (
        <Button 
          type="text" 
          icon={<DownloadOutlined />} 
          style={{ color: '#1677ff' }}
          onClick={() => message.success('Đang khởi tạo tệp PDF hợp đồng...')}
        >
          PDF
        </Button>
      )
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Danh sách hợp đồng điện tử</Title>
        <Text type="secondary">Tra cứu, lưu trữ và theo dõi pháp lý các bản hợp đồng thuê xe tự lái.</Text>
      </div>

      <Card variant="borderless" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Table 
          loading={loading}
          dataSource={contracts} 
          columns={columns} 
          rowKey="id"
        />
      </Card>
    </div>
  );
};
