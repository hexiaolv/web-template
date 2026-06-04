import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  RollbackOutlined,
  SyncOutlined,
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
import { useModel } from '@umijs/max';
import {
  App,
  Button,
  Descriptions,
  Drawer,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { useState } from 'react';

const { Text } = Typography;

interface ReturnItem {
  id: string;
  orderId: string;
  receiveId: string | null;
  reason: string;
  reasonName: string;
  domain: string;
  branch: string;
  supplier: string;
  applier: string;
  applyTime: string;
  approver: string | null;
  approveTime: string | null;
  status: string;
  statusName: string;
  itemCount: number;
  totalQty: number;
  totalAmount: number;
  logistics: string | null;
  remark: string;
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  pending: { color: 'orange', icon: <ClockCircleOutlined /> },
  approved: { color: 'blue', icon: <CheckCircleOutlined /> },
  waiting_return: { color: 'processing', icon: <SyncOutlined spin /> },
  returned: { color: 'green', icon: <RollbackOutlined /> },
  settled: { color: 'default', icon: <ExclamationCircleOutlined /> },
};

const reasonColorMap: Record<string, string> = {
  quality: 'red',
  expire: 'orange',
  qty_diff: 'blue',
  other: 'default',
};

const ReturnList: React.FC = () => {
  const { message } = App.useApp();
  const { initialState } = useModel('@@initialState');
  const currentDomain = initialState?.currentDomain || 'consumable';

  const [detailVisible, setDetailVisible] = useState(false);
  const [currentReturn, setCurrentReturn] = useState<ReturnItem | null>(null);

  const columns: ProColumns<ReturnItem>[] = [
    {
      title: '退货单号',
      dataIndex: 'id',
      width: 170,
      render: (text) => (
        <Text style={{ fontFamily: 'monospace', color: '#1677ff' }}>
          {text}
        </Text>
      ),
    },
    {
      title: '关联订单',
      dataIndex: 'orderId',
      width: 170,
      search: false,
      render: (text) => (
        <Text style={{ fontFamily: 'monospace' }} type="secondary">
          {text}
        </Text>
      ),
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
      ellipsis: true,
    },
    {
      title: '退货原因',
      dataIndex: 'reason',
      width: 120,
      valueEnum: {
        quality: { text: '质量不合格' },
        expire: { text: '近效期退换' },
        qty_diff: { text: '数量差异' },
        other: { text: '其他' },
      },
      render: (_, record) => (
        <Tag color={reasonColorMap[record.reason]}>{record.reasonName}</Tag>
      ),
    },
    {
      title: '退货数量',
      dataIndex: 'totalQty',
      width: 90,
      search: false,
      align: 'center',
    },
    {
      title: '退货金额',
      dataIndex: 'totalAmount',
      width: 110,
      search: false,
      align: 'right',
      render: (val: any) => `¥${Number(val).toLocaleString()}`,
    },
    {
      title: '申请人',
      dataIndex: 'applier',
      width: 90,
      search: false,
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      width: 160,
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueEnum: {
        pending: { text: '待审批' },
        approved: { text: '已审批' },
        waiting_return: { text: '待退回' },
        returned: { text: '已退回' },
        settled: { text: '已结清' },
      },
      render: (_, record) => {
        const cfg = statusConfig[record.status] || {
          color: 'default',
          icon: null,
        };
        return (
          <Tag icon={cfg.icon} color={cfg.color}>
            {record.statusName}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 80,
      render: (_, record) => [
        <a
          key="view"
          onClick={() => {
            setCurrentReturn(record);
            setDetailVisible(true);
          }}
        >
          查看
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<ReturnItem>
        rowKey="id"
        columns={columns}
        request={async (params) => {
          const qs = new URLSearchParams({
            domain: currentDomain,
            status: params.status || '',
            keyword: params.id || params.supplier || '',
            current: String(params.current || 1),
            pageSize: String(params.pageSize || 10),
          });
          const res = await fetch(`/api/procurement/returns?${qs}`).then((r) =>
            r.json(),
          );
          return { data: res.data, total: res.total, success: true };
        }}
        toolBarRender={() => [
          <DrawerForm
            key="create"
            title="新建退货申请"
            width={640}
            trigger={
              <Button type="primary" icon={<PlusOutlined />}>
                新建退货申请
              </Button>
            }
            onFinish={async (values) => {
              await fetch('/api/procurement/returns', {
                method: 'POST',
                body: JSON.stringify(values),
                headers: { 'Content-Type': 'application/json' },
              });
              message.success('退货申请提交成功，等待审批');
              return true;
            }}
          >
            <ProFormText
              name="orderId"
              label="关联采购订单号"
              placeholder="如 PO-20250602-001"
              rules={[{ required: true }]}
            />
            <ProFormText
              name="supplier"
              label="供应商"
              rules={[{ required: true }]}
            />
            <ProFormSelect
              name="reason"
              label="退货原因"
              options={[
                { label: '质量不合格', value: 'quality' },
                { label: '近效期退换', value: 'expire' },
                { label: '数量差异', value: 'qty_diff' },
                { label: '其他原因', value: 'other' },
              ]}
              rules={[{ required: true }]}
            />
            <ProFormTextArea
              name="remark"
              label="退货说明"
              placeholder="请详细描述退货原因及具体品项情况"
              rules={[{ required: true }]}
            />
          </DrawerForm>,
        ]}
        search={{ labelWidth: 'auto' }}
        pagination={{ defaultPageSize: 10 }}
        scroll={{ x: 1300 }}
      />

      {/* 详情抽屉 */}
      <Drawer
        title={
          <Space>
            <RollbackOutlined />
            退货单详情 —— {currentReturn?.id}
          </Space>
        }
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        width={600}
      >
        {currentReturn && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="退货单号">
              <Text style={{ fontFamily: 'monospace' }}>
                {currentReturn.id}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusConfig[currentReturn.status]?.color}>
                {currentReturn.statusName}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="关联订单">
              <Text style={{ fontFamily: 'monospace' }} type="secondary">
                {currentReturn.orderId}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="关联验收单">
              {currentReturn.receiveId ? (
                <Text style={{ fontFamily: 'monospace' }} type="secondary">
                  {currentReturn.receiveId}
                </Text>
              ) : (
                <Text type="secondary">—</Text>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="供应商" span={2}>
              {currentReturn.supplier}
            </Descriptions.Item>
            <Descriptions.Item label="退货原因">
              <Tag color={reasonColorMap[currentReturn.reason]}>
                {currentReturn.reasonName}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="业务域">
              {currentReturn.domain === 'consumable' ? '耗材域' : '药品域'}
            </Descriptions.Item>
            <Descriptions.Item label="退货品种数">
              {currentReturn.itemCount} 种
            </Descriptions.Item>
            <Descriptions.Item label="退货总数量">
              {currentReturn.totalQty}
            </Descriptions.Item>
            <Descriptions.Item label="退货金额">
              <Text strong>
                ¥{Number(currentReturn.totalAmount).toLocaleString()}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="申请人">
              {currentReturn.applier}
            </Descriptions.Item>
            <Descriptions.Item label="申请时间">
              {currentReturn.applyTime}
            </Descriptions.Item>
            <Descriptions.Item label="审批人">
              {currentReturn.approver || <Text type="secondary">待审批</Text>}
            </Descriptions.Item>
            <Descriptions.Item label="审批时间">
              {currentReturn.approveTime || <Text type="secondary">—</Text>}
            </Descriptions.Item>
            {currentReturn.logistics && (
              <Descriptions.Item label="退货物流" span={2}>
                {currentReturn.logistics}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="退货说明" span={2}>
              {currentReturn.remark}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ReturnList;
