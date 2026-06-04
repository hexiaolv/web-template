import {
  EyeOutlined,
  IdcardOutlined,
  PlusOutlined,
  StarFilled,
} from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import {
  DrawerForm,
  PageContainer,
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

interface SupplierProfile {
  id: string;
  code: string;
  name: string;
  shortName: string;
  legalPerson: string;
  registeredCapital: string;
  contactPerson: string;
  contactPhone: string;
  email: string;
  address: string;
  businessScope: string;
  cooperationStatus: string;
  cooperationStatusName: string;
  rating: string;
  cooperationStartDate: string;
  cooperationEndDate: string;
  createTime: string;
}

const statusConfig: Record<string, { color: string }> = {
  active: { color: 'green' },
  terminated: { color: 'default' },
  pending: { color: 'orange' },
};

const ratingColors: Record<string, string> = {
  A: '#52c41a',
  B: '#1677ff',
  C: '#faad14',
  D: '#ff4d4f',
};

const SupplierProfilePage: React.FC = () => {
  const { message } = App.useApp();
  const actionRef = useRef<any>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<SupplierProfile | null>(null);

  const columns: ProColumns<SupplierProfile>[] = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      hideInTable: true,
      fieldProps: { placeholder: '编码 / 名称 / 简称' },
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
      title: '供应商名称',
      dataIndex: 'name',
      width: 260,
      ellipsis: true,
      search: false,
    },
    {
      title: '简称',
      dataIndex: 'shortName',
      width: 100,
      search: false,
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      width: 90,
      search: false,
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      width: 140,
      search: false,
    },
    {
      title: '合作状态',
      dataIndex: 'cooperationStatus',
      width: 100,
      valueEnum: {
        active: { text: '合作中' },
        terminated: { text: '已终止' },
        pending: { text: '待审核' },
      },
      render: (_, record) => (
        <Tag color={statusConfig[record.cooperationStatus]?.color}>
          {record.cooperationStatusName}
        </Tag>
      ),
    },
    {
      title: '评级',
      dataIndex: 'rating',
      width: 80,
      valueType: 'select',
      valueEnum: {
        A: { text: 'A' },
        B: { text: 'B' },
        C: { text: 'C' },
        D: { text: 'D' },
      },
      render: (_, record) => (
        <Space size={2}>
          <StarFilled
            style={{ color: ratingColors[record.rating] || '#d9d9d9' }}
          />
          <Text strong style={{ color: ratingColors[record.rating] }}>
            {record.rating}
          </Text>
        </Space>
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
      <ProTable<SupplierProfile>
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          const qs = new URLSearchParams({
            keyword: params.keyword || '',
            cooperationStatus: params.cooperationStatus || '',
            rating: params.rating || '',
            current: String(params.current || 1),
            pageSize: String(params.pageSize || 10),
          });
          const res = await fetch(`/api/base/supplier/profile?${qs}`).then(
            (r) => r.json(),
          );
          return { data: res.data, total: res.total, success: true };
        }}
        toolBarRender={() => [
          <DrawerForm
            key="create"
            title="新增供应商"
            width={640}
            trigger={
              <Button type="primary" icon={<PlusOutlined />}>
                新增供应商
              </Button>
            }
            onFinish={async (values) => {
              await fetch('/api/base/supplier/profile', {
                method: 'POST',
                body: JSON.stringify(values),
                headers: { 'Content-Type': 'application/json' },
              });
              message.success('供应商档案创建成功');
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
              label="供应商名称"
              rules={[{ required: true }]}
            />
            <ProFormText name="shortName" label="简称" />
            <ProFormText name="legalPerson" label="法定代表人" />
            <ProFormText name="registeredCapital" label="注册资本" />
            <ProFormText
              name="contactPerson"
              label="联系人"
              rules={[{ required: true }]}
            />
            <ProFormText
              name="contactPhone"
              label="联系电话"
              rules={[{ required: true }]}
            />
            <ProFormText name="email" label="邮箱" />
            <ProFormTextArea name="address" label="地址" />
            <ProFormTextArea name="businessScope" label="经营范围" />
            <ProFormSelect
              name="cooperationStatus"
              label="合作状态"
              options={[
                { label: '合作中', value: 'active' },
                { label: '待审核', value: 'pending' },
              ]}
            />
            <ProFormSelect
              name="rating"
              label="评级"
              options={[
                { label: 'A', value: 'A' },
                { label: 'B', value: 'B' },
                { label: 'C', value: 'C' },
                { label: 'D', value: 'D' },
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
            <IdcardOutlined />
            供应商档案 —— {currentItem?.shortName}
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
            <Descriptions.Item label="合作状态">
              <Tag color={statusConfig[currentItem.cooperationStatus]?.color}>
                {currentItem.cooperationStatusName}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="名称" span={2}>
              {currentItem.name}
            </Descriptions.Item>
            <Descriptions.Item label="简称">
              {currentItem.shortName}
            </Descriptions.Item>
            <Descriptions.Item label="评级">
              <Space size={2}>
                <StarFilled
                  style={{ color: ratingColors[currentItem.rating] }}
                />
                <Text
                  strong
                  style={{ color: ratingColors[currentItem.rating] }}
                >
                  {currentItem.rating}
                </Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="法定代表人">
              {currentItem.legalPerson}
            </Descriptions.Item>
            <Descriptions.Item label="注册资本">
              {currentItem.registeredCapital}
            </Descriptions.Item>
            <Descriptions.Item label="联系人">
              {currentItem.contactPerson}
            </Descriptions.Item>
            <Descriptions.Item label="联系电话">
              {currentItem.contactPhone}
            </Descriptions.Item>
            <Descriptions.Item label="邮箱" span={2}>
              {currentItem.email}
            </Descriptions.Item>
            <Descriptions.Item label="地址" span={2}>
              {currentItem.address}
            </Descriptions.Item>
            <Descriptions.Item label="经营范围" span={2}>
              {currentItem.businessScope}
            </Descriptions.Item>
            <Descriptions.Item label="合作起始">
              {currentItem.cooperationStartDate || '—'}
            </Descriptions.Item>
            <Descriptions.Item label="合作截止">
              {currentItem.cooperationEndDate || '—'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default SupplierProfilePage;
