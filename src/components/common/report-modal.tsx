import { Form, Input, Modal, Radio, Space } from 'antd';
import { Report, ReportType } from '@/types/report';

import { useForm } from 'antd/lib/form/Form';
import { useState } from 'react';

type ReportModalProps = {
  open: boolean;
  onCancel: () => void;
  onSubmit: (report: Pick<Report, 'type' | 'description'>) => void;
};

const reportTypeItems: Record<
  ReportType,
  {
    label: string;
    value: ReportType;
  }
> = {
  spam: {
    label: 'Spam',
    value: 'spam',
  },
  inappropriate: {
    label: 'Inappropriate Content',
    value: 'inappropriate',
  },
  other: {
    label: 'Other',
    value: 'other',
  },
};

const ReportModal: React.FC<ReportModalProps> = ({ open, onCancel, onSubmit }) => {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Report"
      width={390}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Report"
      okButtonProps={{
        danger: true,
      }}
      confirmLoading={loading}
    >
      <Form form={form}>
        <Form.Item
          initialValue={'spam'}
          name="type"
          rules={[
            {
              required: true,
              message: 'Please select a report type',
            },
          ]}
        >
          <Radio.Group>
            <Space direction="vertical">
              {Object.values(reportTypeItems).map(({ label, value }) => (
                <Radio key={value} value={value}>
                  {label}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="description"
          rules={[
            {
              required: true,
              message: 'Please enter a description',
            },
          ]}
        >
          <Input.TextArea placeholder="description" rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReportModal;
