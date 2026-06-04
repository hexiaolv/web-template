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

interface MedicineItem {
  id: string;
  code: string;
  name: string;
  genericName: string;
  spec: string;
  dosageForm: string;
  dosageFormName: string;
  manufacturer: string;
  approvalNo: string;
  nationalCode: string;
  categoryName: string;
  unit: string;
  purchasePrice: number;
  sellPrice: number;
  shelfLifeDays: number;
  minStock: number;
  status: string;
  statusName: string;
  createTime: string;
}

const dosageFormOptions = [
  { label: '片剂', value: 'tablet' },
  { label: '胶囊剂', value: 'capsule' },
  { label: '注射剂', value: 'injection' },
  { label: '颗粒剂', value: 'granule' },
  { label: '口服液', value: 'oral_liquid' },
  { label: '软膏剂', value: 'ointment' },
];

const categoryOptions = [
  { label: '抗微生物药', value: '抗微生物药' },
  { label: '电解质补充药', value: '电解质补充药' },
  { label: '麻醉药品', value: '麻醉药品' },
  { label: '精神药品', value: '精神药品' },
  { label: '消化系统药', value: '消化系统药' },
  { label: '心血管系统药', value: '心血管系统药' },
  { label: '内分泌系统药', value: '内分泌系统药' },
  { label: '呼吸系统药', value: '呼吸系统药' },
  { label: '诊断用药', value: '诊断用药' },
];

const MMaterialItems: React.FC = () => {
  const { message } = App.useApp();
  const actionRef = useRef<any>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<MedicineItem | null>(null);

  const columns: ProColumns<MedicineItem>[] = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      hideInTable: true,
      fieldProps: { placeholder: '编码 / 名称 / 厂家' },
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
      title: '药品名称',
      dataIndex: 'name',
      width: 200,
      ellipsis: true,
      search: false,
    },
    {
      title: '通用名',
      dataIndex: 'genericName',
      width: 130,
      search: false,
      ellipsis: true,
    },
    {
      title: '规格',
      dataIndex: 'spec',
      width: 140,
      search: false,
      ellipsis: true,
    },
    {
      title: '剂型',
      dataIndex: 'dosageForm',
      width: 100,
      valueType: 'select',
      fieldProps: { options: dosageFormOptions },
      render: (_, record) => <Tag color="blue">{record.dosageFormName}</Tag>,
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 130,
      valueType: 'select',
      fieldProps: { options: categoryOptions },
      render: (_, record) => <Tag>{record.categoryName}</Tag>,
    },
    {
      title: '生产厂家',
      dataIndex: 'manufacturer',
      width: 200,
      search: false,
      ellipsis: true,
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
      <ProTable<MedicineItem>
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          const qs = new URLSearchParams({
            keyword: params.keyword || '',
            category: params.category || '',
            dosageForm: params.dosageForm || '',
            status: params.status || '',
            current: String(params.current || 1),
            pageSize: String(params.pageSize || 10),
          });
          const res = await fetch(`/api/base/m-material/items?${qs}`).then(
            (r) => r.json(),
          );
          return { data: res.data, total: res.total, success: true };
        }}
        toolBarRender={() => [
          <DrawerForm
            key="create"
            title="新增药品"
            width={640}
            trigger={
              <Button type="primary" icon={<PlusOutlined />}>
                新增药品
              </Button>
            }
            onFinish={async (values) => {
              await fetch('/api/base/m-material/items', {
                method: 'POST',
                body: JSON.stringify(values),
                headers: { 'Content-Type': 'application/json' },
              });
              message.success('药品创建成功');
              actionRef.current?.reload();
              return true;
            }}
          >
            <ProFormText
              name="code"
              label="药品编码"
              rules={[{ required: true }]}
            />
            <ProFormText
              name="name"
              label="药品名称"
              rules={[{ required: true }]}
            />
            <ProFormText
              name="genericName"
              label="通用名"
              rules={[{ required: true }]}
            />
            <ProFormText name="spec" label="规格" />
            <ProFormSelect
              name="dosageForm"
              label="剂型"
              options={dosageFormOptions}
              rules={[{ required: true }]}
            />
            <ProFormSelect
              name="categoryName"
              label="分类"
              options={categoryOptions}
              rules={[{ required: true }]}
            />
            <ProFormText name="manufacturer" label="生产厂家" />
            <ProFormText name="approvalNo" label="批准文号" />
            <ProFormText name="nationalCode" label="国家本位码" />
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
            <ProFormDigit name="shelfLifeDays" label="保质期（天）" min={1} />
            <ProFormDigit name="minStock" label="最低库存" min={0} />
            <ProFormTextArea name="remark" label="备注" />
          </DrawerForm>,
        ]}
        search={{ labelWidth: 'auto' }}
        pagination={{ defaultPageSize: 10 }}
        scroll={{ x: 1600 }}
      />

      <Drawer
        title={
          <Space>
            <EditOutlined />
            药品详情 —— {currentItem?.code}
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
              <Tag
                color={currentItem.status === 'active' ? 'green' : 'default'}
              >
                {currentItem.statusName}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="名称" span={2}>
              {currentItem.name}
            </Descriptions.Item>
            <Descriptions.Item label="通用名">
              {currentItem.genericName}
            </Descriptions.Item>
            <Descriptions.Item label="规格">
              {currentItem.spec}
            </Descriptions.Item>
            <Descriptions.Item label="剂型">
              <Tag color="blue">{currentItem.dosageFormName}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="分类">
              <Tag>{currentItem.categoryName}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="生产厂家" span={2}>
              {currentItem.manufacturer}
            </Descriptions.Item>
            <Descriptions.Item label="批准文号">
              <Text style={{ fontFamily: 'monospace' }}>
                {currentItem.approvalNo}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="国家本位码">
              <Text style={{ fontFamily: 'monospace' }}>
                {currentItem.nationalCode}
              </Text>
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

export default MMaterialItems;
