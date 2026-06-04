import { EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import {
  DrawerForm,
  PageContainer,
  ProFormDigit,
  ProFormSelect,
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

interface MaterialItem {
  id: string;
  code: string;
  name: string;
  spec: string;
  model: string;
  udi: string;
  categoryName: string;
  unit: string;
  purchasePrice: number;
  sellPrice: number;
  supplierName: string;
  registrationNo: string;
  origin: string;
  shelfLifeDays: number;
  minStock: number;
  status: string;
  statusName: string;
  createTime: string;
}

const statusConfig: Record<string, { color: string }> = {
  active: { color: 'green' },
  disabled: { color: 'default' },
};

const CMaterialItems: React.FC = () => {
  const { message } = App.useApp();
  const actionRef = useRef<any>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<MaterialItem | null>(null);

  const columns: ProColumns<MaterialItem>[] = [
    {
      title: '编码',
      dataIndex: 'keyword',
      hideInTable: true,
    },
    {
      title: '编码',
      dataIndex: 'code',
      width: 130,
      search: false,
      render: (text) => (
        <Text style={{ fontFamily: 'monospace', color: '#1677ff' }}>
          {text}
        </Text>
      ),
    },
    {
      title: '耗材名称',
      dataIndex: 'name',
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
      title: '型号',
      dataIndex: 'model',
      width: 130,
      search: false,
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 120,
      valueType: 'select',
      valueEnum: {
        防护类: { text: '防护类' },
        注射类: { text: '注射类' },
        输液类: { text: '输液类' },
        监护类: { text: '监护类' },
        骨科植入类: { text: '骨科植入类' },
        导管类: { text: '导管类' },
        敷料类: { text: '敷料类' },
        手术器械类: { text: '手术器械类' },
        透析类: { text: '透析类' },
      },
      render: (_, record) => <Tag>{record.categoryName}</Tag>,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      width: 60,
      search: false,
      align: 'center',
    },
    {
      title: '采购价',
      dataIndex: 'purchasePrice',
      width: 90,
      search: false,
      align: 'right',
      render: (val: any) => `¥${val}`,
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      width: 200,
      search: false,
      ellipsis: true,
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
        <Tag color={statusConfig[record.status]?.color}>
          {record.statusName}
        </Tag>
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
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
      <ProTable<MaterialItem>
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          const qs = new URLSearchParams({
            keyword: params.keyword || '',
            category: params.category || '',
            status: params.status || '',
            current: String(params.current || 1),
            pageSize: String(params.pageSize || 10),
          });
          const res = await fetch(`/api/base/c-material/items?${qs}`).then(
            (r) => r.json(),
          );
          return { data: res.data, total: res.total, success: true };
        }}
        toolBarRender={() => [
          <DrawerForm
            key="create"
            title="新增耗材"
            width={640}
            trigger={
              <Button type="primary" icon={<PlusOutlined />}>
                新增耗材
              </Button>
            }
            onFinish={async (values) => {
              await fetch('/api/base/c-material/items', {
                method: 'POST',
                body: JSON.stringify(values),
                headers: { 'Content-Type': 'application/json' },
              });
              message.success('耗材创建成功');
              actionRef.current?.reload();
              return true;
            }}
          >
            <ProFormText
              name="code"
              label="耗材编码"
              rules={[{ required: true }]}
              placeholder="如 HC20250011"
            />
            <ProFormText
              name="name"
              label="耗材名称"
              rules={[{ required: true }]}
            />
            <ProFormText name="spec" label="规格" />
            <ProFormText name="model" label="型号" />
            <ProFormSelect
              name="categoryName"
              label="分类"
              options={[
                { label: '防护类', value: '防护类' },
                { label: '注射类', value: '注射类' },
                { label: '输液类', value: '输液类' },
                { label: '监护类', value: '监护类' },
                { label: '骨科植入类', value: '骨科植入类' },
                { label: '导管类', value: '导管类' },
                { label: '敷料类', value: '敷料类' },
                { label: '手术器械类', value: '手术器械类' },
                { label: '透析类', value: '透析类' },
              ]}
              rules={[{ required: true }]}
            />
            <ProFormText
              name="unit"
              label="计量单位"
              rules={[{ required: true }]}
            />
            <ProFormDigit
              name="purchasePrice"
              label="采购价"
              min={0}
              fieldProps={{ precision: 2 }}
            />
            <ProFormDigit
              name="sellPrice"
              label="销售价"
              min={0}
              fieldProps={{ precision: 2 }}
            />
            <ProFormText name="supplierName" label="供应商" />
            <ProFormText name="registrationNo" label="注册证号" />
            <ProFormText name="origin" label="产地" />
            <ProFormDigit name="shelfLifeDays" label="保质期（天）" min={1} />
            <ProFormDigit name="minStock" label="最低库存" min={0} />
            <ProFormTextArea name="remark" label="备注" />
          </DrawerForm>,
        ]}
        search={{ labelWidth: 'auto' }}
        pagination={{ defaultPageSize: 10 }}
        scroll={{ x: 1400 }}
      />

      <Drawer
        title={
          <Space>
            <EditOutlined />
            耗材详情 —— {currentItem?.code}
          </Space>
        }
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        styles={{ wrapper: { width: 720 } }}
      >
        {currentItem && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="编码">
              <Text style={{ fontFamily: 'monospace' }}>
                {currentItem.code}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusConfig[currentItem.status]?.color}>
                {currentItem.statusName}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="名称" span={2}>
              {currentItem.name}
            </Descriptions.Item>
            <Descriptions.Item label="规格">
              {currentItem.spec}
            </Descriptions.Item>
            <Descriptions.Item label="型号">
              {currentItem.model}
            </Descriptions.Item>
            <Descriptions.Item label="UDI码">
              <Text style={{ fontFamily: 'monospace' }}>{currentItem.udi}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="分类">
              <Tag>{currentItem.categoryName}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="计量单位">
              {currentItem.unit}
            </Descriptions.Item>
            <Descriptions.Item label="采购价">
              ¥{currentItem.purchasePrice}
            </Descriptions.Item>
            <Descriptions.Item label="销售价">
              ¥{currentItem.sellPrice}
            </Descriptions.Item>
            <Descriptions.Item label="供应商" span={2}>
              {currentItem.supplierName}
            </Descriptions.Item>
            <Descriptions.Item label="注册证号">
              <Text style={{ fontFamily: 'monospace' }}>
                {currentItem.registrationNo}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="产地">
              {currentItem.origin}
            </Descriptions.Item>
            <Descriptions.Item label="保质期">
              {currentItem.shelfLifeDays} 天
            </Descriptions.Item>
            <Descriptions.Item label="最低库存">
              {currentItem.minStock}
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

export default CMaterialItems;
