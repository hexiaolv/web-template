import { EyeOutlined, PlusOutlined, ScanOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import {
  DrawerForm,
  PageContainer,
  ProFormDatePicker,
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

interface TraceCodeItem {
  id: string;
  traceCode: string;
  drugCode: string;
  drugName: string;
  batchNo: string;
  productionDate: string;
  expiryDate: string;
  manufacturer: string;
  spec: string;
  status: string;
  statusName: string;
  createTime: string;
}

const statusConfig: Record<string, { color: string }> = {
  activated: { color: 'green' },
  used: { color: 'blue' },
  cancelled: { color: 'default' },
};

const MMaterialCode: React.FC = () => {
  const { message } = App.useApp();
  const actionRef = useRef<any>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<TraceCodeItem | null>(null);

  const columns: ProColumns<TraceCodeItem>[] = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      hideInTable: true,
      fieldProps: { placeholder: '追溯码 / 药品名 / 药品编码' },
    },
    {
      title: '追溯码',
      dataIndex: 'traceCode',
      width: 220,
      search: false,
      render: (text) => (
        <Text style={{ fontFamily: 'monospace', color: '#1677ff' }}>
          {text}
        </Text>
      ),
    },
    {
      title: '药品编码',
      dataIndex: 'drugCode',
      width: 130,
      search: false,
      render: (text) => (
        <Text style={{ fontFamily: 'monospace' }} type="secondary">
          {text}
        </Text>
      ),
    },
    {
      title: '药品名称',
      dataIndex: 'drugName',
      width: 200,
      ellipsis: true,
      search: false,
    },
    {
      title: '批号',
      dataIndex: 'batchNo',
      width: 110,
      search: false,
      render: (text) => <Text style={{ fontFamily: 'monospace' }}>{text}</Text>,
    },
    {
      title: '生产日期',
      dataIndex: 'productionDate',
      width: 110,
      search: false,
    },
    {
      title: '有效期至',
      dataIndex: 'expiryDate',
      width: 110,
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      valueEnum: {
        activated: { text: '已激活' },
        used: { text: '已使用' },
        cancelled: { text: '已注销' },
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
      <ProTable<TraceCodeItem>
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          const qs = new URLSearchParams({
            keyword: params.keyword || '',
            status: params.status || '',
            current: String(params.current || 1),
            pageSize: String(params.pageSize || 10),
          });
          const res = await fetch(`/api/base/m-material/code?${qs}`).then((r) =>
            r.json(),
          );
          return { data: res.data, total: res.total, success: true };
        }}
        toolBarRender={() => [
          <DrawerForm
            key="create"
            title="新增追溯码"
            width={600}
            trigger={
              <Button type="primary" icon={<PlusOutlined />}>
                新增追溯码
              </Button>
            }
            onFinish={async (values) => {
              await fetch('/api/base/m-material/code', {
                method: 'POST',
                body: JSON.stringify(values),
                headers: { 'Content-Type': 'application/json' },
              });
              message.success('追溯码创建成功');
              actionRef.current?.reload();
              return true;
            }}
          >
            <ProFormText
              name="traceCode"
              label="追溯码"
              rules={[{ required: true }]}
            />
            <ProFormText
              name="drugCode"
              label="药品编码"
              rules={[{ required: true }]}
            />
            <ProFormText
              name="drugName"
              label="药品名称"
              rules={[{ required: true }]}
            />
            <ProFormText
              name="batchNo"
              label="批号"
              rules={[{ required: true }]}
            />
            <ProFormDatePicker
              name="productionDate"
              label="生产日期"
              rules={[{ required: true }]}
            />
            <ProFormDatePicker
              name="expiryDate"
              label="有效期至"
              rules={[{ required: true }]}
            />
            <ProFormText name="manufacturer" label="生产厂家" />
            <ProFormText name="spec" label="规格" />
            <ProFormSelect
              name="status"
              label="状态"
              options={[
                { label: '已激活', value: 'activated' },
                { label: '已使用', value: 'used' },
              ]}
            />
          </DrawerForm>,
        ]}
        search={{ labelWidth: 'auto' }}
        pagination={{ defaultPageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <Drawer
        title={
          <Space>
            <ScanOutlined />
            追溯码详情
          </Space>
        }
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        styles={{ wrapper: { width: 700 } }}
      >
        {currentItem && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="追溯码" span={2}>
              <Text style={{ fontFamily: 'monospace' }}>
                {currentItem.traceCode}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="药品编码">
              <Text style={{ fontFamily: 'monospace' }}>
                {currentItem.drugCode}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusConfig[currentItem.status]?.color}>
                {currentItem.statusName}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="药品名称" span={2}>
              {currentItem.drugName}
            </Descriptions.Item>
            <Descriptions.Item label="批号">
              <Text style={{ fontFamily: 'monospace' }}>
                {currentItem.batchNo}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="规格">
              {currentItem.spec}
            </Descriptions.Item>
            <Descriptions.Item label="生产日期">
              {currentItem.productionDate}
            </Descriptions.Item>
            <Descriptions.Item label="有效期至">
              {currentItem.expiryDate}
            </Descriptions.Item>
            <Descriptions.Item label="生产厂家" span={2}>
              {currentItem.manufacturer}
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

export default MMaterialCode;
