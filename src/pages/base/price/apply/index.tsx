import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import {
  DrawerForm,
  PageContainer,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import {
  App,
  Button,
  Descriptions,
  Drawer,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { useRef, useState } from 'react';

const { Text } = Typography;

interface ApplyItem {
  id: string;
  itemCode: string;
  itemName: string;
  spec: string;
  supplierName: string;
  currentPrice: number;
  newPrice: number;
  changeRate: number;
  changeReason: string;
  applicant: string;
  applyDate: string;
  status: string;
  statusName: string;
  approver: string;
  approveDate: string;
  remark: string;
  createTime: string;
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  pending: { color: 'orange', icon: <ClockCircleOutlined /> },
  approved: { color: 'green', icon: <CheckCircleOutlined /> },
  rejected: { color: 'red', icon: <CloseCircleOutlined /> },
};

const PriceApplyPage: React.FC = () => {
  const { message } = App.useApp();
  const actionRef = useRef<any>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<ApplyItem | null>(null);

  const columns: ProColumns<ApplyItem>[] = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      hideInTable: true,
      fieldProps: { placeholder: '品名 / 编码' },
    },
    {
      title: '品名',
      dataIndex: 'itemName',
      width: 200,
      ellipsis: true,
      search: false,
    },
    {
      title: '规格',
      dataIndex: 'spec',
      width: 140,
      search: false,
      ellipsis: true,
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      width: 200,
      search: false,
      ellipsis: true,
    },
    {
      title: '现价',
      dataIndex: 'currentPrice',
      width: 90,
      search: false,
      align: 'right',
      render: (val: any) => <Text type="secondary">¥{val}</Text>,
    },
    {
      title: '调价',
      dataIndex: 'newPrice',
      width: 90,
      search: false,
      align: 'right',
      render: (val: any) => <Text strong>¥{val}</Text>,
    },
    {
      title: '幅度',
      dataIndex: 'changeRate',
      width: 90,
      search: false,
      align: 'center',
      render: (val: any) =>
        val > 0 ? (
          <Text type="danger">
            <ArrowUpOutlined /> {val}%
          </Text>
        ) : (
          <Text type="success">
            <ArrowDownOutlined /> {Math.abs(val)}%
          </Text>
        ),
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      width: 90,
      valueType: 'text',
      search: false,
    },
    {
      title: '申请日期',
      dataIndex: 'applyDate',
      width: 110,
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 110,
      valueEnum: {
        pending: { text: '待审批' },
        approved: { text: '已通过' },
        rejected: { text: '已驳回' },
      },
      render: (_, record) => {
        const cfg = statusConfig[record.status] || {
          color: 'default',
          icon: null,
        };
        return (
          <Tag icon={cfg.icon} color={cfg.color}>
            {record.statusName}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 80,
      render: (_, record) => [
        <a
          key="view"
          onClick={() => {
            setCurrentItem(record);
            setDetailVisible(true);
          }}
        >
          <EyeOutlined /> 详情
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<ApplyItem>
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          const qs = new URLSearchParams({
            keyword: params.keyword || '',
            status: params.status || '',
            applicant: params.applicant || '',
            current: String(params.current || 1),
            pageSize: String(params.pageSize || 10),
          });
          const res = await fetch(`/api/base/price/apply?${qs}`).then((r) =>
            r.json(),
          );
          return { data: res.data, total: res.total, success: true };
        }}
        toolBarRender={() => [
          <DrawerForm
            key="create"
            title="新增调价申请"
            width={600}
            trigger={
              <Button type="primary" icon={<PlusOutlined />}>
                新增申请
              </Button>
            }
            onFinish={async (values) => {
              await fetch('/api/base/price/apply', {
                method: 'POST',
                body: JSON.stringify(values),
                headers: { 'Content-Type': 'application/json' },
              });
              message.success('调价申请已提交');
              actionRef.current?.reload();
              return true;
            }}
          >
            <ProFormText
              name="itemName"
              label="品名"
              rules={[{ required: true }]}
            />
            <ProFormText name="spec" label="规格" />
            <ProFormText
              name="supplierName"
              label="供应商"
              rules={[{ required: true }]}
            />
            <ProFormDigit
              name="currentPrice"
              label="当前价格"
              min={0}
              fieldProps={{ precision: 2 }}
            />
            <ProFormDigit
              name="newPrice"
              label="调整价格"
              min={0}
              fieldProps={{ precision: 2 }}
              rules={[{ required: true }]}
            />
            <ProFormTextArea
              name="changeReason"
              label="调价原因"
              rules={[{ required: true }]}
            />
            <ProFormText
              name="applicant"
              label="申请人"
              rules={[{ required: true }]}
            />
          </DrawerForm>,
        ]}
        search={{ labelWidth: 'auto' }}
        pagination={{ defaultPageSize: 10 }}
        scroll={{ x: 1400 }}
      />

      <Drawer
        title={<Space>调价申请详情 —— {currentItem?.id}</Space>}
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        styles={{ wrapper: { width: 680 } }}
      >
        {currentItem && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="品名" span={2}>
              {currentItem.itemName}
            </Descriptions.Item>
            <Descriptions.Item label="规格">
              {currentItem.spec}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag
                icon={statusConfig[currentItem.status]?.icon}
                color={statusConfig[currentItem.status]?.color}
              >
                {currentItem.statusName}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="供应商" span={2}>
              {currentItem.supplierName}
            </Descriptions.Item>
            <Descriptions.Item label="当前价格">
              <Text type="secondary">¥{currentItem.currentPrice}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="调整价格">
              <Text strong style={{ color: '#1677ff' }}>
                ¥{currentItem.newPrice}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="变动幅度" span={2}>
              {currentItem.changeRate > 0 ? (
                <Text type="danger">
                  <ArrowUpOutlined /> {currentItem.changeRate}%
                </Text>
              ) : (
                <Text type="success">
                  <ArrowDownOutlined /> {Math.abs(currentItem.changeRate)}%
                </Text>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="调价原因" span={2}>
              {currentItem.changeReason}
            </Descriptions.Item>
            <Descriptions.Item label="申请人">
              {currentItem.applicant}
            </Descriptions.Item>
            <Descriptions.Item label="申请日期">
              {currentItem.applyDate}
            </Descriptions.Item>
            <Descriptions.Item label="审批人">
              {currentItem.approver || '—'}
            </Descriptions.Item>
            <Descriptions.Item label="审批日期">
              {currentItem.approveDate || '—'}
            </Descriptions.Item>
            <Descriptions.Item label="审批意见" span={2}>
              {currentItem.remark || '—'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default PriceApplyPage;
