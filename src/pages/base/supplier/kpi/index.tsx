import { EyeOutlined, PlusOutlined, StarOutlined } from '@ant-design/icons';
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
  Progress,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { useRef, useState } from 'react';

const { Text } = Typography;

interface KpiItem {
  id: string;
  supplierName: string;
  evalPeriod: string;
  deliveryRate: number;
  qualityRate: number;
  serviceScore: number;
  overallScore: number;
  rank: number;
  level: string;
  levelName: string;
  remark: string;
  createTime: string;
}

const levelConfig: Record<string, { color: string }> = {
  excellent: { color: 'green' },
  good: { color: 'blue' },
  qualified: { color: 'orange' },
  unqualified: { color: 'red' },
};

const SupplierKpi: React.FC = () => {
  const { message } = App.useApp();
  const actionRef = useRef<any>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<KpiItem | null>(null);

  const columns: ProColumns<KpiItem>[] = [
    {
      title: '供应商名称',
      dataIndex: 'keyword',
      hideInTable: true,
    },
    {
      title: '排名',
      dataIndex: 'rank',
      width: 70,
      search: false,
      align: 'center',
      render: (val: any) => (
        <Text strong style={{ color: val <= 3 ? '#f5222d' : undefined }}>
          #{val}
        </Text>
      ),
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      width: 260,
      ellipsis: true,
      search: false,
    },
    {
      title: '评估周期',
      dataIndex: 'evalPeriod',
      width: 110,
      valueType: 'select',
      valueEnum: {
        '2025-Q1': { text: '2025-Q1' },
        '2024-Q4': { text: '2024-Q4' },
        '2024-Q3': { text: '2024-Q3' },
      },
    },
    {
      title: '交货率',
      dataIndex: 'deliveryRate',
      width: 120,
      search: false,
      render: (val: any) => (
        <Progress
          percent={val}
          size="small"
          strokeColor={
            val >= 95 ? '#52c41a' : val >= 85 ? '#1677ff' : '#faad14'
          }
          format={(p) => `${p}%`}
        />
      ),
    },
    {
      title: '质量率',
      dataIndex: 'qualityRate',
      width: 120,
      search: false,
      render: (val: any) => (
        <Progress
          percent={val}
          size="small"
          strokeColor={
            val >= 98 ? '#52c41a' : val >= 90 ? '#1677ff' : '#ff4d4f'
          }
          format={(p) => `${p}%`}
        />
      ),
    },
    {
      title: '服务分',
      dataIndex: 'serviceScore',
      width: 80,
      search: false,
      align: 'center',
    },
    {
      title: '综合分',
      dataIndex: 'overallScore',
      width: 90,
      search: false,
      align: 'center',
      render: (val: any) => (
        <Text strong style={{ fontSize: 15 }}>
          {val}
        </Text>
      ),
    },
    {
      title: '评级',
      dataIndex: 'level',
      width: 90,
      valueType: 'select',
      valueEnum: {
        excellent: { text: '优秀' },
        good: { text: '良好' },
        qualified: { text: '合格' },
        unqualified: { text: '不合格' },
      },
      render: (_, record) => (
        <Tag color={levelConfig[record.level]?.color}>{record.levelName}</Tag>
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
      <ProTable<KpiItem>
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          const qs = new URLSearchParams({
            keyword: params.keyword || '',
            evalPeriod: params.evalPeriod || '',
            level: params.level || '',
            current: String(params.current || 1),
            pageSize: String(params.pageSize || 10),
          });
          const res = await fetch(`/api/base/supplier/kpi?${qs}`).then((r) =>
            r.json(),
          );
          return { data: res.data, total: res.total, success: true };
        }}
        toolBarRender={() => [
          <DrawerForm
            key="create"
            title="新增绩效评估"
            width={560}
            trigger={
              <Button type="primary" icon={<PlusOutlined />}>
                新增评估
              </Button>
            }
            onFinish={async (values) => {
              await fetch('/api/base/supplier/kpi', {
                method: 'POST',
                body: JSON.stringify(values),
                headers: { 'Content-Type': 'application/json' },
              });
              message.success('绩效评估创建成功');
              actionRef.current?.reload();
              return true;
            }}
          >
            <ProFormText
              name="supplierName"
              label="供应商"
              rules={[{ required: true }]}
            />
            <ProFormSelect
              name="evalPeriod"
              label="评估周期"
              rules={[{ required: true }]}
              options={[
                { label: '2025-Q2', value: '2025-Q2' },
                { label: '2025-Q1', value: '2025-Q1' },
                { label: '2024-Q4', value: '2024-Q4' },
              ]}
            />
            <ProFormDigit
              name="deliveryRate"
              label="交货率(%)"
              min={0}
              max={100}
              fieldProps={{ precision: 1 }}
            />
            <ProFormDigit
              name="qualityRate"
              label="质量率(%)"
              min={0}
              max={100}
              fieldProps={{ precision: 1 }}
            />
            <ProFormDigit
              name="serviceScore"
              label="服务评分"
              min={0}
              max={100}
            />
            <ProFormDigit
              name="overallScore"
              label="综合评分"
              min={0}
              max={100}
              fieldProps={{ precision: 1 }}
            />
            <ProFormSelect
              name="level"
              label="评级"
              options={[
                { label: '优秀', value: 'excellent' },
                { label: '良好', value: 'good' },
                { label: '合格', value: 'qualified' },
                { label: '不合格', value: 'unqualified' },
              ]}
            />
            <ProFormTextArea name="remark" label="评语" />
          </DrawerForm>,
        ]}
        search={{ labelWidth: 'auto' }}
        pagination={{ defaultPageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <Drawer
        title={
          <Space>
            <StarOutlined />
            绩效详情 —— {currentItem?.supplierName}
          </Space>
        }
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        styles={{ wrapper: { width: 600 } }}
      >
        {currentItem && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="供应商">
              {currentItem.supplierName}
            </Descriptions.Item>
            <Descriptions.Item label="评估周期">
              {currentItem.evalPeriod}
            </Descriptions.Item>
            <Descriptions.Item label="排名">
              #{currentItem.rank}
            </Descriptions.Item>
            <Descriptions.Item label="评级">
              <Tag color={levelConfig[currentItem.level]?.color}>
                {currentItem.levelName}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="交货率">
              <Progress percent={currentItem.deliveryRate} size="small" />
            </Descriptions.Item>
            <Descriptions.Item label="质量率">
              <Progress percent={currentItem.qualityRate} size="small" />
            </Descriptions.Item>
            <Descriptions.Item label="服务评分">
              {currentItem.serviceScore}
            </Descriptions.Item>
            <Descriptions.Item label="综合评分">
              <Text strong style={{ fontSize: 18 }}>
                {currentItem.overallScore}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="评语">
              {currentItem.remark}
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

export default SupplierKpi;
