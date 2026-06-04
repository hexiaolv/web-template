import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  EyeOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Descriptions, Drawer, Space, Tag, Typography } from 'antd';
import React, { useState } from 'react';

const { Text } = Typography;

interface HistoryItem {
  id: string;
  itemCode: string;
  itemName: string;
  spec: string;
  supplierName: string;
  price: number;
  previousPrice: number;
  changeAmount: number;
  changeRate: number;
  changeType: string;
  changeTypeName: string;
  changeDate: string;
  operator: string;
  remark: string;
}

const typeColorMap: Record<string, string> = {
  adjustment: 'blue',
  bid: 'green',
  listed: 'purple',
};

const PriceHistoryPage: React.FC = () => {
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<HistoryItem | null>(null);

  const columns: ProColumns<HistoryItem>[] = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      hideInTable: true,
      fieldProps: { placeholder: '品名 / 供应商 / 编码' },
    },
    {
      title: '变动日期',
      dataIndex: 'changeDate',
      width: 110,
      search: false,
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
      title: '原价',
      dataIndex: 'previousPrice',
      width: 90,
      search: false,
      align: 'right',
      render: (val: any) => <Text type="secondary">¥{val}</Text>,
    },
    {
      title: '新价',
      dataIndex: 'price',
      width: 90,
      search: false,
      align: 'right',
      render: (val: any) => <Text strong>¥{val}</Text>,
    },
    {
      title: '变动',
      dataIndex: 'changeRate',
      width: 110,
      search: false,
      align: 'center',
      render: (val: any, _record) =>
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
      title: '变动类型',
      dataIndex: 'changeType',
      width: 100,
      valueType: 'select',
      valueEnum: {
        adjustment: { text: '调价' },
        bid: { text: '中标' },
        listed: { text: '挂网' },
      },
      render: (_, record) => (
        <Tag color={typeColorMap[record.changeType]}>
          {record.changeTypeName}
        </Tag>
      ),
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      width: 100,
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
      <ProTable<HistoryItem>
        rowKey="id"
        columns={columns}
        request={async (params) => {
          const qs = new URLSearchParams({
            keyword: params.keyword || '',
            changeType: params.changeType || '',
            current: String(params.current || 1),
            pageSize: String(params.pageSize || 10),
          });
          const res = await fetch(`/api/base/price/history?${qs}`).then((r) =>
            r.json(),
          );
          return { data: res.data, total: res.total, success: true };
        }}
        search={{ labelWidth: 'auto' }}
        pagination={{ defaultPageSize: 10 }}
        scroll={{ x: 1400 }}
      />

      <Drawer
        title={
          <Space>
            <LineChartOutlined />
            价格变动详情 —— {currentItem?.itemName}
          </Space>
        }
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        styles={{ wrapper: { width: 640 } }}
      >
        {currentItem && (
          <Descriptions bordered column={2} size="small">
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
            <Descriptions.Item label="供应商" span={2}>
              {currentItem.supplierName}
            </Descriptions.Item>
            <Descriptions.Item label="原价">
              <Text type="secondary">¥{currentItem.previousPrice}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="新价">
              <Text strong style={{ color: '#1677ff' }}>
                ¥{currentItem.price}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="变动金额">
              <Text type={currentItem.changeAmount > 0 ? 'danger' : 'success'}>
                {currentItem.changeAmount > 0 ? '+' : ''}
                {currentItem.changeAmount}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="变动幅度">
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
            <Descriptions.Item label="变动类型">
              <Tag color={typeColorMap[currentItem.changeType]}>
                {currentItem.changeTypeName}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="变动日期">
              {currentItem.changeDate}
            </Descriptions.Item>
            <Descriptions.Item label="操作人">
              {currentItem.operator}
            </Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>
              {currentItem.remark || '—'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default PriceHistoryPage;
