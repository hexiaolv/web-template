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

interface UdiItem {
  id: string;
  udiCode: string;
  diCode: string;
  batchNo: string;
  serialNo: string;
  productionDate: string;
  expiryDate: string;
  itemName: string;
  itemCode: string;
  spec: string;
  manufacturer: string;
  status: string;
  statusName: string;
  createTime: string;
}

const statusConfig: Record<string, { color: string }> = {
  registered: { color: 'green' },
  pending: { color: 'orange' },
  cancelled: { color: 'default' },
};

const CMaterialUdi: React.FC = () => {
  const { message } = App.useApp();
  const actionRef = useRef<any>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<UdiItem | null>(null);

  const columns: ProColumns<UdiItem>[] = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      hideInTable: true,
      fieldProps: { placeholder: 'UDI码 / 品名 / 品码' },
    },
    {
      title: 'UDI码',
      dataIndex: 'udiCode',
      width: 220,
      search: false,
      render: (text) => (
        <Text style={{ fontFamily: 'monospace', color: '#1677ff' }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'DI码',
      dataIndex: 'diCode',
      width: 160,
      search: false,
      render: (text) => (
        <Text style={{ fontFamily: 'monospace' }} type="secondary">
          {text}
        </Text>
      ),
    },
    {
      title: '品名',
      dataIndex: 'itemName',
      width: 180,
      ellipsis: true,
      search: false,
    },
    {
      title: '批号',
      dataIndex: 'batchNo',
      width: 120,
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
      title: '生产厂商',
      dataIndex: 'manufacturer',
      width: 200,
      search: false,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      valueEnum: {
        registered: { text: '已注册' },
        pending: { text: '待审核' },
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
      <ProTable<UdiItem>
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
          const res = await fetch(`/api/base/c-material/udi?${qs}`).then((r) =>
            r.json(),
          );
          return { data: res.data, total: res.total, success: true };
        }}
        toolBarRender={() => [
          <DrawerForm
            key="create"
            title="新增UDI"
            width={600}
            trigger={
              <Button type="primary" icon={<PlusOutlined />}>
                新增UDI
              </Button>
            }
            onFinish={async (values) => {
              await fetch('/api/base/c-material/udi', {
                method: 'POST',
                body: JSON.stringify(values),
                headers: { 'Content-Type': 'application/json' },
              });
              message.success('UDI记录创建成功');
              actionRef.current?.reload();
              return true;
            }}
          >
            <ProFormText
              name="udiCode"
              label="UDI码"
              rules={[{ required: true }]}
            />
            <ProFormText
              name="diCode"
              label="DI码"
              rules={[{ required: true }]}
            />
            <ProFormText
              name="batchNo"
              label="批号"
              rules={[{ required: true }]}
            />
            <ProFormText name="serialNo" label="序列号" />
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
            <ProFormText
              name="itemName"
              label="品名"
              rules={[{ required: true }]}
            />
            <ProFormText name="itemCode" label="品码" />
            <ProFormText name="spec" label="规格" />
            <ProFormText name="manufacturer" label="生产厂商" />
            <ProFormSelect
              name="status"
              label="状态"
              options={[
                { label: '已注册', value: 'registered' },
                { label: '待审核', value: 'pending' },
              ]}
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
            <ScanOutlined />
            UDI详情 —— {currentItem?.udiCode}
          </Space>
        }
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        styles={{ wrapper: { width: 700 } }}
      >
        {currentItem && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="UDI码" span={2}>
              <Text style={{ fontFamily: 'monospace' }}>
                {currentItem.udiCode}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="DI码">
              <Text style={{ fontFamily: 'monospace' }}>
                {currentItem.diCode}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusConfig[currentItem.status]?.color}>
                {currentItem.statusName}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="批号">
              <Text style={{ fontFamily: 'monospace' }}>
                {currentItem.batchNo}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="序列号">
              <Text style={{ fontFamily: 'monospace' }}>
                {currentItem.serialNo}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="生产日期">
              {currentItem.productionDate}
            </Descriptions.Item>
            <Descriptions.Item label="有效期至">
              {currentItem.expiryDate}
            </Descriptions.Item>
            <Descriptions.Item label="品名" span={2}>
              {currentItem.itemName}
            </Descriptions.Item>
            <Descriptions.Item label="品码">
              <Text style={{ fontFamily: 'monospace' }}>
                {currentItem.itemCode}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="规格">
              {currentItem.spec}
            </Descriptions.Item>
            <Descriptions.Item label="生产厂商" span={2}>
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

export default CMaterialUdi;
