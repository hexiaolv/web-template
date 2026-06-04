import {
  AuditOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import {
  DrawerForm,
  PageContainer,
  ProDescriptions,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import { App, Button, Drawer, Space, Statistic, Tag, Typography } from 'antd';
import React, { useState } from 'react';

const { Text } = Typography;

interface PlanItem {
  id: string;
  name: string;
  type: string;
  typeName: string;
  domain: string;
  branch: string;
  creator: string;
  createTime: string;
  approver: string | null;
  approveTime: string | null;
  status: string;
  statusName: string;
  itemCount: number;
  totalAmount: number;
  remark: string;
}

// 状态标签配置
const statusMap: Record<string, { color: string; icon: React.ReactNode }> = {
  draft: { color: 'default', icon: <FileTextOutlined /> },
  pending: { color: 'orange', icon: <ExclamationCircleOutlined /> },
  approved: { color: 'blue', icon: <CheckCircleOutlined /> },
  purchased: { color: 'green', icon: <CheckOutlined /> },
  closed: { color: 'default', icon: <CloseCircleOutlined /> },
};

const typeColorMap: Record<string, string> = {
  regular: 'blue',
  urgent: 'red',
  temp: 'orange',
};

const ProcurementPlan: React.FC = () => {
  const { message } = App.useApp();
  const { initialState } = useModel('@@initialState');
  const currentDomain = initialState?.currentDomain || 'consumable';

  const [detailVisible, setDetailVisible] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PlanItem | null>(null);

  // 查看明细
  const {
    data: itemsData,
    loading: itemsLoading,
    run: fetchItems,
  } = useRequest(
    (id: string) => ({
      url: `/api/procurement/plan/${id}/items`,
      method: 'GET',
    }),
    { manual: true },
  );

  // 审批操作
  const { run: approvePlan } = useRequest(
    (id: string, action: string) => ({
      url: `/api/procurement/plan/${id}/approve`,
      method: 'PUT',
      data: { action },
    }),
    { manual: true, onSuccess: () => message.success('审批操作成功') },
  );

  // 转化订单
  const { run: convertToOrder } = useRequest(
    (id: string) => ({
      url: `/api/procurement/plan/${id}/convert`,
      method: 'PUT',
    }),
    {
      manual: true,
      onSuccess: (res: any) =>
        message.success(`已转化为采购订单 ${res.data?.orderId}`),
    },
  );

  const handleViewDetail = (record: PlanItem) => {
    setCurrentPlan(record);
    fetchItems(record.id);
    setDetailVisible(true);
  };

  const columns: ProColumns<PlanItem>[] = [
    {
      title: '计划编号',
      dataIndex: 'id',
      width: 160,
      render: (text) => (
        <Text style={{ fontFamily: 'monospace', color: '#1677ff' }}>
          {text}
        </Text>
      ),
    },
    {
      title: '计划名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      valueEnum: {
        regular: { text: '常规计划' },
        urgent: { text: '紧急计划' },
        temp: { text: '临时补货' },
      },
      render: (_, record) => (
        <Tag color={typeColorMap[record.type]}>{record.typeName}</Tag>
      ),
    },
    {
      title: '院区',
      dataIndex: 'branch',
      width: 90,
      search: false,
    },
    {
      title: '品种数',
      dataIndex: 'itemCount',
      width: 80,
      search: false,
      align: 'center',
    },
    {
      title: '预估金额',
      dataIndex: 'totalAmount',
      width: 120,
      search: false,
      align: 'right',
      render: (val: any) => (
        <Text strong style={{ color: '#1677ff' }}>
          ¥{Number(val).toLocaleString()}
        </Text>
      ),
    },
    {
      title: '制单人',
      dataIndex: 'creator',
      width: 90,
      search: false,
    },
    {
      title: '制单时间',
      dataIndex: 'createTime',
      width: 160,
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueEnum: {
        draft: { text: '草稿' },
        pending: { text: '待审批' },
        approved: { text: '已审批' },
        purchased: { text: '已采购' },
        closed: { text: '已关闭' },
      },
      render: (_, record) => {
        const cfg = statusMap[record.status] || {
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
      width: 160,
      render: (_, record) =>
        [
          <a key="view" onClick={() => handleViewDetail(record)}>
            查看明细
          </a>,
          record.status === 'pending' && (
            <a
              key="approve"
              style={{ color: '#52c41a' }}
              onClick={() => approvePlan(record.id, 'pass')}
            >
              审批通过
            </a>
          ),
          record.status === 'approved' && (
            <a
              key="convert"
              style={{ color: '#1677ff' }}
              onClick={() => convertToOrder(record.id)}
            >
              转化订单
            </a>
          ),
        ].filter(Boolean),
    },
  ];

  const itemColumns: ProColumns[] = [
    { title: '物资编码', dataIndex: 'materialCode', width: 140 },
    { title: '品名', dataIndex: 'materialName', ellipsis: true },
    { title: '规格', dataIndex: 'spec', ellipsis: true, search: false },
    { title: '单位', dataIndex: 'unit', width: 60, search: false },
    { title: '品牌', dataIndex: 'brand', width: 100, search: false },
    {
      title: '当前库存',
      dataIndex: 'currentStock',
      width: 90,
      search: false,
      align: 'center',
      render: (val: any, record: any) => (
        <Text type={val < record.safeStock ? 'danger' : undefined}>{val}</Text>
      ),
    },
    {
      title: '安全库存',
      dataIndex: 'safeStock',
      width: 90,
      search: false,
      align: 'center',
    },
    {
      title: '建议采购量',
      dataIndex: 'suggestQty',
      width: 100,
      search: false,
      align: 'center',
      render: (val: any) => <Text strong>{val}</Text>,
    },
    {
      title: '单价(元)',
      dataIndex: 'unitPrice',
      width: 90,
      search: false,
      align: 'right',
    },
    {
      title: '小计(元)',
      dataIndex: 'totalAmount',
      width: 110,
      search: false,
      align: 'right',
      render: (val: any) => `¥${Number(val).toLocaleString()}`,
    },
    {
      title: '建议供应商',
      dataIndex: 'supplier',
      ellipsis: true,
      search: false,
    },
  ];

  return (
    <PageContainer>
      <ProTable<PlanItem>
        rowKey="id"
        columns={columns}
        request={async (params) => {
          const res = await fetch(
            `/api/procurement/plan?domain=${currentDomain}&status=${params.status || ''}&type=${params.type || ''}&keyword=${params.id || params.name || ''}&current=${params.current}&pageSize=${params.pageSize}`,
          ).then((r) => r.json());
          return { data: res.data, total: res.total, success: true };
        }}
        toolBarRender={() => [
          <DrawerForm
            key="create"
            title="新建采购计划"
            width={700}
            trigger={
              <Button type="primary" icon={<PlusOutlined />}>
                新建采购计划
              </Button>
            }
            onFinish={async (values) => {
              await fetch('/api/procurement/plan', {
                method: 'POST',
                body: JSON.stringify(values),
                headers: { 'Content-Type': 'application/json' },
              });
              message.success('采购计划创建成功');
              return true;
            }}
          >
            <ProFormText
              name="name"
              label="计划名称"
              placeholder="例：2025年6月耗材常规采购计划"
              rules={[{ required: true }]}
            />
            <ProFormSelect
              name="type"
              label="计划类型"
              options={[
                { label: '常规计划', value: 'regular' },
                { label: '紧急计划', value: 'urgent' },
                { label: '临时补货', value: 'temp' },
              ]}
              rules={[{ required: true }]}
            />
            <ProFormSelect
              name="branch"
              label="院区"
              options={[
                { label: '主院区', value: '主院区' },
                { label: '东院区', value: '东院区' },
                { label: '西院区', value: '西院区' },
              ]}
              rules={[{ required: true }]}
            />
            <ProFormDatePicker
              name="requireDate"
              label="要求完成采购日期"
              rules={[{ required: true }]}
            />
            <ProFormTextArea
              name="remark"
              label="备注说明"
              placeholder="填写计划背景或特殊要求"
            />
          </DrawerForm>,
        ]}
        search={{
          labelWidth: 'auto',
        }}
        pagination={{ defaultPageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      {/* 计划明细抽屉 */}
      <Drawer
        title={
          <Space>
            <AuditOutlined />
            采购计划明细 —— {currentPlan?.id}
          </Space>
        }
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        styles={{ wrapper: { width: 900 } }}
        extra={
          currentPlan?.status === 'pending' && (
            <Space>
              <Button
                icon={<CheckOutlined />}
                type="primary"
                onClick={() => {
                  approvePlan(currentPlan.id, 'pass');
                  setDetailVisible(false);
                }}
              >
                审批通过
              </Button>
              <Button
                icon={<CloseOutlined />}
                danger
                onClick={() => {
                  approvePlan(currentPlan.id, 'reject');
                  setDetailVisible(false);
                }}
              >
                退回
              </Button>
            </Space>
          )
        }
      >
        {currentPlan && (
          <>
            <ProDescriptions column={3} style={{ marginBottom: 24 }}>
              <ProDescriptions.Item label="计划编号">
                <Text style={{ fontFamily: 'monospace' }}>
                  {currentPlan.id}
                </Text>
              </ProDescriptions.Item>
              <ProDescriptions.Item label="计划名称">
                {currentPlan.name}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="状态">
                <Tag color={statusMap[currentPlan.status]?.color}>
                  {currentPlan.statusName}
                </Tag>
              </ProDescriptions.Item>
              <ProDescriptions.Item label="类型">
                <Tag color={typeColorMap[currentPlan.type]}>
                  {currentPlan.typeName}
                </Tag>
              </ProDescriptions.Item>
              <ProDescriptions.Item label="院区">
                {currentPlan.branch}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="业务域">
                {currentPlan.domain === 'consumable' ? '耗材域' : '药品域'}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="制单人">
                {currentPlan.creator}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="制单时间">
                {currentPlan.createTime}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="审批人">
                {currentPlan.approver || <Text type="secondary">待审批</Text>}
              </ProDescriptions.Item>
            </ProDescriptions>

            <Space size={32} style={{ marginBottom: 16 }}>
              <Statistic
                title="计划品种数"
                value={currentPlan.itemCount}
                suffix="种"
              />
              <Statistic
                title="预估总金额"
                value={currentPlan.totalAmount}
                prefix="¥"
                precision={0}
                styles={{ content: { color: '#1677ff' } }}
              />
            </Space>

            {currentPlan.remark && (
              <div
                style={{
                  marginBottom: 16,
                  padding: '8px 12px',
                  background: '#fafafa',
                  borderRadius: 6,
                  fontSize: 13,
                }}
              >
                <Text type="secondary">备注：</Text>
                {currentPlan.remark}
              </div>
            )}

            <ProTable
              rowKey="id"
              columns={itemColumns}
              dataSource={itemsData?.data || []}
              loading={itemsLoading}
              search={false}
              pagination={false}
              scroll={{ x: 1100 }}
              size="small"
            />
          </>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ProcurementPlan;
