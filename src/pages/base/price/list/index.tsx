import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DollarOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import {
  DrawerForm,
  PageContainer,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
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

interface PriceItem {
  id: string;
  itemCode: string;
  itemName: string;
  spec: string;
  supplierName: string;
  currentPrice: number;
  previousPrice: number;
  effectDate: string;
  expiryDate: string;
  priceType: string;
  priceTypeName: string;
  domain: string;
  status: string;
  statusName: string;
  createTime: string;
}

const statusConfig: Record<string, { color: string }> = {
  active: { color: 'green' },
  expired: { color: 'default' },
  pending: { color: 'orange' },
};

const PriceListPage: React.FC = () => {
  const { message } = App.useApp();
  const actionRef = useRef<any>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<PriceItem | null>(null);

  const columns: ProColumns<PriceItem>[] = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      hideInTable: true,
      fieldProps: { placeholder: '品名 / 供应商 / 编码' },
    },
    {
      title: '品码',
      dataIndex: 'itemCode',
      width: 130,
      search: false,
      render: (text) => (
        <Text style={{ fontFamily: 'monospace', color: '#1677ff' }}>
          {text}
        </Text>
      ),
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
      title: '当前价',
      dataIndex: 'currentPrice',
      width: 100,
      search: false,
      align: 'right',
      render: (val: any) => <Text strong>¥{val}</Text>,
    },
    {
      title: '变动',
      dataIndex: 'priceChange',
      width: 90,
      search: false,
      align: 'center',
      render: (_: any, record) => {
        const diff = record.currentPrice - record.previousPrice;
        if (diff === 0) return <Text type="secondary">—</Text>;
        const pct = ((diff / record.previousPrice) * 100).toFixed(1);
        return diff > 0 ? (
          <Text type="danger">
            <ArrowUpOutlined /> {pct}%
          </Text>
        ) : (
          <Text type="success">
            <ArrowDownOutlined /> {Math.abs(Number(pct))}%
          </Text>
        );
      },
    },
    {
      title: '价格类型',
      dataIndex: 'priceType',
      width: 100,
      valueType: 'select',
      valueEnum: {
        bid: { text: '中标价' },
        listed: { text: '挂网价' },
        agreement: { text: '协议价' },
      },
      render: (_, record) => <Tag>{record.priceTypeName}</Tag>,
    },
    {
      title: '生效日期',
      dataIndex: 'effectDate',
      width: 110,
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      valueEnum: {
        active: { text: '生效中' },
        expired: { text: '已过期' },
        pending: { text: '待生效' },
      },
      render: (_, record) => (
        <Tag color={statusConfig[record.status]?.color}>
          {record.statusName}
        </Tag>
      ),
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
      <ProTable<PriceItem>
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          const qs = new URLSearchParams({
            keyword: params.keyword || '',
            priceType: params.priceType || '',
            status: params.status || '',
            current: String(params.current || 1),
            pageSize: String(params.pageSize || 10),
          });
          const res = await fetch(`/api/base/price/list?${qs}`).then((r) =>
            r.json(),
          );
          return { data: res.data, total: res.total, success: true };
        }}
        toolBarRender={() => [
          <DrawerForm
            key="create"
            title="新增价格条目"
            width={600}
            trigger={
              <Button type="primary" icon={<PlusOutlined />}>
                新增价格
              </Button>
            }
            onFinish={async (values) => {
              await fetch('/api/base/price/list', {
                method: 'POST',
                body: JSON.stringify(values),
                headers: { 'Content-Type': 'application/json' },
              });
              message.success('价格条目创建成功');
              actionRef.current?.reload();
              return true;
            }}
          >
            <ProFormText
              name="itemCode"
              label="品码"
              rules={[{ required: true }]}
            />
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
              rules={[{ required: true }]}
            />
            <ProFormSelect
              name="priceType"
              label="价格类型"
              rules={[{ required: true }]}
              options={[
                { label: '中标价', value: 'bid' },
                { label: '挂网价', value: 'listed' },
                { label: '协议价', value: 'agreement' },
              ]}
            />
            <ProFormDatePicker
              name="effectDate"
              label="生效日期"
              rules={[{ required: true }]}
            />
            <ProFormDatePicker
              name="expiryDate"
              label="有效期至"
              rules={[{ required: true }]}
            />
          </DrawerForm>,
        ]}
        search={{ labelWidth: 'auto' }}
        pagination={{ defaultPageSize: 10 }}
        scroll={{ x: 1400 }}
      />

      <Drawer
        title={
          <Space>
            <DollarOutlined />
            价格详情 —— {currentItem?.itemName}
          </Space>
        }
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        styles={{ wrapper: { width: 640 } }}
      >
        {currentItem && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="品码">
              <Text style={{ fontFamily: 'monospace' }}>
                {currentItem.itemCode}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusConfig[currentItem.status]?.color}>
                {currentItem.statusName}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="品名" span={2}>
              {currentItem.itemName}
            </Descriptions.Item>
            <Descriptions.Item label="规格">
              {currentItem.spec}
            </Descriptions.Item>
            <Descriptions.Item label="价格类型">
              <Tag>{currentItem.priceTypeName}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="供应商" span={2}>
              {currentItem.supplierName}
            </Descriptions.Item>
            <Descriptions.Item label="当前价格">
              <Text strong style={{ fontSize: 16, color: '#1677ff' }}>
                ¥{currentItem.currentPrice}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="上次价格">
              <Text type="secondary">¥{currentItem.previousPrice}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="生效日期">
              {currentItem.effectDate}
            </Descriptions.Item>
            <Descriptions.Item label="有效期至">
              {currentItem.expiryDate}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间" span={2}>
              {currentItem.createTime}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default PriceListPage;
