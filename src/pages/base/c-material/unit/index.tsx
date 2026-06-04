import {
  CalculatorOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import {
  DrawerForm,
  PageContainer,
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

interface UnitItem {
  id: string;
  code: string;
  name: string;
  type: string;
  typeName: string;
  conversionFactor: number;
  baseUnitName: string;
  status: string;
  statusName: string;
  createTime: string;
}

const CMaterialUnit: React.FC = () => {
  const { message } = App.useApp();
  const actionRef = useRef<any>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<UnitItem | null>(null);

  const columns: ProColumns<UnitItem>[] = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      hideInTable: true,
      fieldProps: { placeholder: '编码 / 名称' },
    },
    {
      title: '编码',
      dataIndex: 'code',
      width: 100,
      search: false,
      render: (text) => (
        <Text style={{ fontFamily: 'monospace', color: '#1677ff' }}>
          {text}
        </Text>
      ),
    },
    {
      title: '单位名称',
      dataIndex: 'name',
      width: 120,
      search: false,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 120,
      valueType: 'select',
      valueEnum: {
        base: { text: '基本单位' },
        convert: { text: '换算单位' },
      },
      render: (_, record) => (
        <Tag color={record.type === 'base' ? 'blue' : 'purple'}>
          {record.typeName}
        </Tag>
      ),
    },
    {
      title: '换算系数',
      dataIndex: 'conversionFactor',
      width: 110,
      search: false,
      align: 'right',
      render: (val: any) => (
        <Text style={{ fontFamily: 'monospace' }}>{val}</Text>
      ),
    },
    {
      title: '基本单位',
      dataIndex: 'baseUnitName',
      width: 100,
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      valueEnum: {
        active: { text: '启用' },
        disabled: { text: '停用' },
      },
      render: (_, record) => (
        <Tag color={record.status === 'active' ? 'green' : 'default'}>
          {record.statusName}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 170,
      search: false,
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
      <ProTable<UnitItem>
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          const qs = new URLSearchParams({
            keyword: params.keyword || '',
            type: params.type || '',
            status: params.status || '',
            current: String(params.current || 1),
            pageSize: String(params.pageSize || 10),
          });
          const res = await fetch(`/api/base/c-material/unit?${qs}`).then((r) =>
            r.json(),
          );
          return { data: res.data, total: res.total, success: true };
        }}
        toolBarRender={() => [
          <DrawerForm
            key="create"
            title="新增计量单位"
            width={480}
            trigger={
              <Button type="primary" icon={<PlusOutlined />}>
                新增单位
              </Button>
            }
            onFinish={async (values) => {
              await fetch('/api/base/c-material/unit', {
                method: 'POST',
                body: JSON.stringify(values),
                headers: { 'Content-Type': 'application/json' },
              });
              message.success('计量单位创建成功');
              actionRef.current?.reload();
              return true;
            }}
          >
            <ProFormText
              name="code"
              label="编码"
              rules={[{ required: true }]}
            />
            <ProFormText
              name="name"
              label="单位名称"
              rules={[{ required: true }]}
            />
            <ProFormSelect
              name="type"
              label="类型"
              options={[
                { label: '基本单位', value: 'base' },
                { label: '换算单位', value: 'convert' },
              ]}
              rules={[{ required: true }]}
            />
            <ProFormDigit
              name="conversionFactor"
              label="换算系数"
              min={0}
              fieldProps={{ precision: 4 }}
            />
            <ProFormSelect
              name="baseUnitName"
              label="对应基本单位"
              options={[
                { label: '只', value: '只' },
                { label: '支', value: '支' },
                { label: '双', value: '双' },
                { label: '套', value: '套' },
                { label: '片', value: '片' },
                { label: '块', value: '块' },
                { label: '根', value: '根' },
              ]}
            />
            <ProFormSelect
              name="status"
              label="状态"
              options={[
                { label: '启用', value: 'active' },
                { label: '停用', value: 'disabled' },
              ]}
            />
          </DrawerForm>,
        ]}
        search={{ labelWidth: 'auto' }}
        pagination={{ defaultPageSize: 10 }}
        scroll={{ x: 900 }}
      />

      <Drawer
        title={
          <Space>
            <CalculatorOutlined />
            单位详情 —— {currentItem?.name}
          </Space>
        }
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        styles={{ wrapper: { width: 500 } }}
      >
        {currentItem && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="编码">
              <Text style={{ fontFamily: 'monospace' }}>
                {currentItem.code}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="名称">
              {currentItem.name}
            </Descriptions.Item>
            <Descriptions.Item label="类型">
              <Tag color={currentItem.type === 'base' ? 'blue' : 'purple'}>
                {currentItem.typeName}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="换算系数">
              <Text style={{ fontFamily: 'monospace' }}>
                {currentItem.conversionFactor}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="基本单位">
              {currentItem.baseUnitName}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag
                color={currentItem.status === 'active' ? 'green' : 'default'}
              >
                {currentItem.statusName}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {currentItem.createTime}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default CMaterialUnit;
