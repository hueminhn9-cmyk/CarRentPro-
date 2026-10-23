import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Typography, Space, message } from 'antd';
import { FileProtectOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { Contract } from '@/services/mockData';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ContractModal } from '@/components/common/ContractModal';

const { Title, Text } = Typography;

export const ContractsManagement: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchContracts = () => {
    setLoading(true);
    api.contracts.getAll().then(res => {
      setContracts(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleDownload = async (record: Contract) => {
    try {
      await api.contracts.downloadContract(record.id, record.bookingCode);
      message.success(`Đã tải bản Hợp đồng ${record.bookingCode} thành công!`);
    } catch (err) {
      message.error('Lỗi khi tải bản hợp đồng');
    }
  };

  const columns = [
    {
      title: 'Mã hợp đồng',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <Text strong>#{text}</Text>
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
      title: 'Thao tác',
      key: 'actions',
      render: (_, record: Contract) => (
        <Space size={8}>
          <Button
            type="text"
            icon={<EyeOutlined />}
            style={{ color: '#2563eb' }}
            onClick={() => {
              setSelectedContract(record);
              setModalVisible(true);
            }}
          >
            Xem
          </Button>
          <Button 
            type="text" 
            icon={<DownloadOutlined />} 
            style={{ color: '#1677ff' }}
            onClick={() => handleDownload(record)}
          >
            PDF/HTML
          </Button>
        </Space>
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

      {selectedContract && (
        <ContractModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          contractId={selectedContract.id}
          bookingCode={selectedContract.bookingCode}
          isSigned={selectedContract.status === 'SIGNED' || selectedContract.status === 'Đã ký'}
          onSignedSuccess={() => fetchContracts()}
        />
      )}
    </div>
  );
};
