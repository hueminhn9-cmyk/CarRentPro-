import React, { useEffect, useState } from 'react';
import { Modal, Button, Space, message, Spin, Alert, Tag, Divider, Typography } from 'antd';
import { DownloadOutlined, EditOutlined, FileTextOutlined, PrinterOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { SignaturePad } from './SignaturePad';

const { Text, Title } = Typography;

interface ContractModalProps {
  visible: boolean;
  onClose: () => void;
  bookingId?: string;
  contractId?: string;
  bookingCode?: string;
  isSigned?: boolean;
  onSignedSuccess?: () => void;
}

export const ContractModal: React.FC<ContractModalProps> = ({
  visible,
  onClose,
  bookingId,
  contractId,
  bookingCode,
  isSigned = false,
  onSignedSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [activeContractId, setActiveContractId] = useState<string>(contractId || '');
  const [signatureData, setSignatureData] = useState<string>('');
  const [signing, setSigning] = useState(false);
  const [signedState, setSignedState] = useState(isSigned);

  const fetchContractData = async () => {
    setLoading(true);
    try {
      let cid = contractId;
      if (!cid && bookingId) {
        const contract = await api.contracts.getByBookingId(bookingId);
        if (contract) {
          cid = contract.id.toString();
          setActiveContractId(cid);
          setSignedState(contract.status === 'SIGNED');
        }
      }

      if (cid) {
        const html = await api.contracts.getContractHTML(cid);
        setHtmlContent(html);
      }
    } catch (err: any) {
      console.error('Failed to load contract HTML', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchContractData();
    }
  }, [visible, bookingId, contractId]);

  const handleDownload = async () => {
    try {
      const cid = activeContractId || contractId || bookingId || 'HD-001';
      await api.contracts.downloadContract(cid, bookingCode);
      message.success('Đã khởi tạo bản tải xuống hợp đồng thành công!');
    } catch (err) {
      message.error('Không thể tải bản hợp đồng.');
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const handleSignConfirm = async () => {
    if (!signatureData) {
      message.warning('Vui lòng vẽ chữ ký trước khi xác nhận');
      return;
    }
    setSigning(true);
    try {
      await api.contracts.signContract({
        contractId: activeContractId || contractId,
        bookingCode,
        signatureData,
      });
      message.success('Ký hợp đồng điện tử thành công!');
      setSignedState(true);
      if (onSignedSuccess) onSignedSuccess();
      await fetchContractData();
    } catch (err: any) {
      message.error('Có lỗi khi ký hợp đồng. Vui lòng thử lại.');
    } finally {
      setSigning(false);
    }
  };

  return (
    <Modal
      title={
        <Space size={10}>
          <FileTextOutlined style={{ color: '#2563eb' }} />
          <span>Bản Hợp Đồng Điện Tử Cho Thuê Xe Tự Lái</span>
          {signedState ? (
            <Tag color="success">ĐÃ KÝ SỐ ✓</Tag>
          ) : (
            <Tag color="warning">CHỜ KÝ TÊN</Tag>
          )}
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
        <Button key="print" icon={<PrinterOutlined />} onClick={handlePrint}>
          In Hợp Đồng
        </Button>,
        <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={handleDownload} style={{ background: '#2563eb' }}>
          Tải Hợp Đồng (HTML/PDF)
        </Button>,
      ]}
      styles={{ body: { padding: '16px 24px', maxHeight: '78vh', overflowY: 'auto' } }}
    >
      <Spin spinning={loading}>
        {/* Render contract HTML in iframe/container */}
        {htmlContent ? (
          <div
            style={{
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '24px',
              background: '#ffffff',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
              maxHeight: '480px',
              overflowY: 'auto',
              marginBottom: '20px',
            }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ) : (
          <Alert message="Đang nạp hợp đồng điện tử từ hệ thống..." type="info" showIcon style={{ marginBottom: '20px' }} />
        )}

        {/* Signature Pad Section if not signed */}
        {!signedState ? (
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <Title level={5} style={{ margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <EditOutlined style={{ color: '#d97706' }} />
              <span>Chỗ Ký Tên Hợp Đồng Điện Tử (Bên B)</span>
            </Title>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '14px' }}>
              Bằng việc ký tên và bấm Xác nhận bên dưới, bạn cam kết tuân thủ đầy đủ điều khoản thuê xe của AutoRent Việt Nam.
            </Text>

            <SignaturePad onSave={setSignatureData} />

            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                loading={signing}
                disabled={!signatureData}
                onClick={handleSignConfirm}
                style={{ background: '#16a34a', borderColor: '#16a34a', borderRadius: '6px', fontWeight: 600 }}
              >
                Xác nhận Ký tên & Hoàn tất Hợp đồng
              </Button>
            </div>
          </div>
        ) : (
          <Alert
            message="Hợp đồng điện tử đã được xác thực ký số thành công!"
            description="Bản hợp đồng có giá trị pháp lý đã được ghi nhận và lưu trữ trong cơ sở dữ liệu AutoRent."
            type="success"
            showIcon
            style={{ borderRadius: '8px' }}
          />
        )}
      </Spin>
    </Modal>
  );
};
