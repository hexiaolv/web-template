import { EyeOutlined, PlusOutlined, TagOutlined } from '@ant-design/icons';
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

interface CategoryItem {
  id: string;
  code: string;
  name: string;
  parentName: string;
  level: number;
  sort: number;
  status: string;
  statusName: string;
  description: string;
  createTime: string;
}

const MMaterialCategory: React.FC = () => {
  const { message } = App.useApp();
  const actionRef = useRef<any>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<CategoryItem | null>(null);

  const columns: ProColumns<CategoryItem>[] = [
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
      title: '分类名称',
      dataIndex: 'name',
      width: 160,
      search: false,
    },
    {
      title: '上级分类',
      dataIndex: 'parentName',
      width: 120,
      search: false,
      render: (text) =>
        text === '—' ? <Text type="secondary">—</Text> : <Text>{text}</Text>,
    },
    {
      title: '级别',
      dataIndex: 'level',
      width: 80,
      valueType: 'select',
      valueEnum: {
        1: { text: '一级' },
        2: { text: '二级' },
        3: { text: '三级' },
      },
      render: (_, record) => <Tag color="blue">{record.level}级</Tag>,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 70,
      search: false,
      align: 'center',
    },
    {
      title: '说明',
      dataIndex: 'description',
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
      <ProTable<CategoryItem>
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          const qs = new URLSearchParams({
            keyword: params.keyword || '',
            level: params.level || '',
            status: params.status || '',
            current: String(params.current || 1),
            pageSize: String(params.pageSize || 10),
          });
          const res = await fetch(`/api/base/m-material/category?${qs}`).then(
            (r) => r.json(),
          );
          return { data: res.data, total: res.total, success: true };
        }}
        toolBarRender={() => [
          <DrawerForm
            key="create"
            title="新增药品分类"
            width={520}
            trigger={
              <Button type="primary" icon={<PlusOutlined />}>
                新增分类
              </Button>
            }
            onFinish={async (values) => {
              await fetch('/api/base/m-material/category', {
                method: 'POST',
                body: JSON.stringify(values),
                headers: { 'Content-Type': 'application/json' },
              });
              message.success('分类创建成功');
              actionRef.current?.reload();
              return true;
            }}
          >
            <ProFormText
              name="code"
              label="分类编码"
              rules={[{ required: true }]}
            />
            <ProFormText
              name="name"
              label="分类名称"
              rules={[{ required: true }]}
            />
            <ProFormSelect
              name="parentName"
              label="上级分类"
              options={[
                { label: '—（顶级分类）', value: '—' },
                { label: '抗微生物药', value: '抗微生物药' },
                { label: '麻醉药品', value: '麻醉药品' },
                { label: '精神药品', value: '精神药品' },
                { label: '心血管系统药', value: '心血管系统药' },
                { label: '消化系统药', value: '消化系统药' },
                { label: '内分泌系统药', value: '内分泌系统药' },
              ]}
            />
            <ProFormSelect
              name="level"
              label="级别"
              options={[
                { label: '一级', value: 1 },
                { label: '二级', value: 2 },
                { label: '三级', value: 3 },
              ]}
              rules={[{ required: true }]}
            />
            <ProFormDigit name="sort" label="排序号" min={1} />
            <ProFormSelect
              name="status"
              label="状态"
              options={[
                { label: '启用', value: 'active' },
                { label: '停用', value: 'disabled' },
              ]}
            />
            <ProFormTextArea name="description" label="说明" />
          </DrawerForm>,
        ]}
        search={{ labelWidth: 'auto' }}
        pagination={{ defaultPageSize: 10 }}
        scroll={{ x: 1000 }}
      />

      <Drawer
        title={
          <Space>
            <TagOutlined />
            分类详情 —— {currentItem?.name}
          </Space>
        }
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        styles={{ wrapper: { width: 560 } }}
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
            <Descriptions.Item label="上级分类">
              {currentItem.parentName}
            </Descriptions.Item>
            <Descriptions.Item label="级别">
              <Tag color="blue">{currentItem.level}级</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="排序号">
              {currentItem.sort}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag
                color={currentItem.status === 'active' ? 'green' : 'default'}
              >
                {currentItem.statusName}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="说明">
              {currentItem.description}
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

export default MMaterialCategory;
