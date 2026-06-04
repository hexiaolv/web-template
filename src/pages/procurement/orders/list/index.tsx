import {
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  InboxOutlined,
  PlusOutlined,
  SendOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import {
  DrawerForm,
  PageContainer,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import {
  App,
  Button,
  Descriptions,
  Divider,
  Drawer,
  Space,
  Statistic,
  Steps,
  Table,
  Tag,
  Typography,
} from 'antd';
import React, { useState } from 'react';

const { Text } = Typography;

interface OrderItem {
  id: string;
  planId: string | null;
  contractNo: string;
  supplier: string;
  supplierContact: string;
  supplierPhone: string;
  domain: string;
  branch: string;
  creator: string;
  createTime: string;
  requireDate: string;
  actualArriveDate: string | null;
  status: string;
  statusName: string;
  itemCount: number;
  totalAmount: number;
  receivedAmount: number;
  pendingAmount: number;
  remark: string | null;
}

const statusConfig: Record<
  string,
  { color: string; icon: React.ReactNode; step: number }
> = {
  pending: { color: 'default', icon: <ClockCircleOutlined />, step: 0 },
  confirmed: { color: 'blue', icon: <CheckCircleOutlined />, step: 1 },
  delivering: { color: 'processing', icon: <SendOutlined />, step: 2 },
  partial: { color: 'orange', icon: <SyncOutlined spin />, step: 3 },
  received: { color: 'green', icon: <InboxOutlined />, step: 4 },
  closed: { color: 'default', icon: <ExclamationCircleOutlined />, step: 5 },
};

const ProcurementOrderList: React.FC = () => {
  const { message } = App.useApp();
  const { initialState } = useModel('@@initialState');
  const currentDomain = initialState?.currentDomain || 'consumable';

  const [detailVisible, setDetailVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<OrderItem | null>(null);

  const {
    data: itemsData,
    loading: itemsLoading,
    run: fetchItems,
  } = useRequest(
    (id: string) => ({
      url: `/api/procurement/orders/${id}/items`,
      method: 'GET',
    }),
    { manual: true },
  );

  const { run: urgeOrder } = useRequest(
    (id: string) => ({
      url: `/api/procurement/orders/${id}/urge`,
      method: 'POST',
    }),
    {
      manual: true,
      onSuccess: () => message.success('催货通知已发送至供应商'),
    },
  );

  const { run: createReceive } = useRequest(
    (id: string) => ({
      url: `/api/procurement/orders/${id}/receive`,
      method: 'POST',
    }),
    {
      manual: true,
      onSuccess: (res: any) =>
        message.success(`已生成收货验收单 ${res.data?.receiveId}`),
    },
  );

  const handleViewDetail = (record: OrderItem) => {
    setCurrentOrder(record);
    fetchItems(record.id);
    setDetailVisible(true);
  };

  const columns: ProColumns<OrderItem>[] = [
    {
      title: '订单编号',
      dataIndex: 'id',
      width: 170,
      render: (text) => (
        <Text style={{ fontFamily: 'monospace', color: '#1677ff' }}>
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
      title: '合同编号',
      dataIndex: 'contractNo',
      width: 130,
      search: false,
      render: (text) => (
        <Text type="secondary" style={{ fontFamily: 'monospace' }}>
          {text}
        </Text>
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
      title: '订单金额',
      dataIndex: 'totalAmount',
      width: 120,
      search: false,
      align: 'right',
      render: (val: any) => <Text strong>¥{Number(val).toLocaleString()}</Text>,
    },
    {
      title: '已收货金额',
      dataIndex: 'receivedAmount',
      width: 120,
      search: false,
      align: 'right',
      render: (val: any) => (
        <Text type={val > 0 ? 'success' : 'secondary'}>
          ¥{Number(val).toLocaleString()}
        </Text>
      ),
    },
    {
      title: '要求到货日',
      dataIndex: 'requireDate',
      width: 110,
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 130,
      valueEnum: {
        pending: { text: '待确认' },
        confirmed: { text: '供应商已确认' },
        delivering: { text: '已发货' },
        partial: { text: '部分收货' },
        received: { text: '全部收货' },
        closed: { text: '已关闭' },
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
      width: 170,
      render: (_, record) =>
        [
          <a key="view" onClick={() => handleViewDetail(record)}>
            <EyeOutlined /> 查看
          </a>,
          (record.status === 'delivering' ||
            record.status === 'partial' ||
            record.status === 'confirmed') && (
            <a
              key="urge"
              style={{ color: '#fa8c16' }}
              onClick={() => urgeOrder(record.id)}
            >
              <BellOutlined /> 催货
            </a>
          ),
          (record.status === 'delivering' || record.status === 'partial') && (
            <a
              key="receive"
              style={{ color: '#52c41a' }}
              onClick={() => createReceive(record.id)}
            >
              <InboxOutlined /> 生成验收单
            </a>
          ),
        ].filter(Boolean),
    },
  ];

  const itemColumns = [
    { title: '物资编码', dataIndex: 'materialCode', width: 140 },
    { title: '品名', dataIndex: 'materialName', ellipsis: true },
    { title: '规格', dataIndex: 'spec', ellipsis: true },
    { title: '单位', dataIndex: 'unit', width: 60, align: 'center' as const },
    { title: '品牌', dataIndex: 'brand', width: 100 },
    {
      title: '订购数量',
      dataIndex: 'orderedQty',
      width: 90,
      align: 'right' as const,
    },
    {
      title: '已收数量',
      dataIndex: 'receivedQty',
      width: 90,
      align: 'right' as const,
      render: (val: number, record: any) => (
        <Text type={val < record.orderedQty ? 'warning' : 'success'}>
          {val}
        </Text>
      ),
    },
    {
      title: '单价(元)',
      dataIndex: 'unitPrice',
      width: 90,
      align: 'right' as const,
    },
    {
      title: '小计(元)',
      dataIndex: 'totalAmount',
      width: 110,
      align: 'right' as const,
      render: (val: number) => `¥${Number(val).toLocaleString()}`,
    },
  ];

  const getCurrentStep = (status: string) => statusConfig[status]?.step ?? 0;

  return (
    <PageContainer>
      <ProTable<OrderItem>
        rowKey="id"
        columns={columns}
        request={async (params) => {
          const qs = new URLSearchParams({
            domain: currentDomain,
            status: params.status || '',
            supplier: params.supplier || '',
            keyword: params.id || '',
            current: String(params.current || 1),
            pageSize: String(params.pageSize || 10),
          });
          const res = await fetch(`/api/procurement/orders?${qs}`).then((r) =>
            r.json(),
          );
          return { data: res.data, total: res.total, success: true };
        }}
        toolBarRender={() => [
          <DrawerForm
            key="create"
            title="新建采购订单"
            width={700}
            trigger={
              <Button type="primary" icon={<PlusOutlined />}>
                新建采购订单
              </Button>
            }
            onFinish={async (values) => {
              await fetch('/api/procurement/orders', {
                method: 'POST',
                body: JSON.stringify(values),
                headers: { 'Content-Type': 'application/json' },
              });
              message.success('采购订单创建成功');
              return true;
            }}
          >
            <ProFormSelect
              name="supplier"
              label="供应商"
              options={[
                {
                  label: '北京中科医疗器械有限公司',
                  value: '北京中科医疗器械有限公司',
                },
                {
                  label: '浙江振德医疗用品有限公司',
                  value: '浙江振德医疗用品有限公司',
                },
                {
                  label: '国药控股广州有限公司',
                  value: '国药控股广州有限公司',
                },
                {
                  label: '强生（上海）医疗器材有限公司',
                  value: '强生（上海）医疗器材有限公司',
                },
                {
                  label: '百特（中国）投资有限公司',
                  value: '百特（中国）投资有限公司',
                },
              ]}
              rules={[{ required: true }]}
            />
            <ProFormText
              name="contractNo"
              label="合同编号"
              placeholder="如 CT-2025-018"
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
              label="要求到货日期"
              rules={[{ required: true }]}
            />
            <ProFormTextArea name="remark" label="备注" />
          </DrawerForm>,
        ]}
        search={{ labelWidth: 'auto' }}
        pagination={{ defaultPageSize: 10 }}
        scroll={{ x: 1300 }}
      />

      {/* 订单详情抽屉 */}
      <Drawer
        title={
          <Space>
            <InboxOutlined />
            采购订单详情 —— {currentOrder?.id}
          </Space>
        }
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        styles={{ wrapper: { width: 960 } }}
        extra={
          currentOrder &&
          (currentOrder.status === 'delivering' ||
            currentOrder.status === 'partial') && (
            <Space>
              <Button
                icon={<BellOutlined />}
                onClick={() => {
                  urgeOrder(currentOrder.id);
                }}
              >
                催货
              </Button>
              <Button
                type="primary"
                icon={<InboxOutlined />}
                onClick={() => {
                  createReceive(currentOrder.id);
                  setDetailVisible(false);
                }}
              >
                生成验收单
              </Button>
            </Space>
          )
        }
      >
        {currentOrder && (
          <>
            {/* 履约进度条 */}
            <Steps
              current={getCurrentStep(currentOrder.status)}
              size="small"
              style={{ marginBottom: 24 }}
              items={[
                { title: '待确认' },
                { title: '已确认' },
                { title: '已发货' },
                { title: '部分收货' },
                { title: '全部收货' },
              ]}
            />

            <Descriptions
              bordered
              column={3}
              size="small"
              style={{ marginBottom: 24 }}
            >
              <Descriptions.Item label="订单编号" span={1}>
                <Text style={{ fontFamily: 'monospace' }}>
                  {currentOrder.id}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="合同编号">
                {currentOrder.contractNo}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusConfig[currentOrder.status]?.color}>
                  {currentOrder.statusName}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="供应商" span={2}>
                {currentOrder.supplier}
              </Descriptions.Item>
              <Descriptions.Item label="供应商联系人">
                {currentOrder.supplierContact} {currentOrder.supplierPhone}
              </Descriptions.Item>
              <Descriptions.Item label="院区">
                {currentOrder.branch}
              </Descriptions.Item>
              <Descriptions.Item label="制单人">
                {currentOrder.creator}
              </Descriptions.Item>
              <Descriptions.Item label="制单时间">
                {currentOrder.createTime}
              </Descriptions.Item>
              <Descriptions.Item label="要求到货日">
                {currentOrder.requireDate}
              </Descriptions.Item>
              <Descriptions.Item label="实际到货日">
                {currentOrder.actualArriveDate || (
                  <Text type="secondary">未到货</Text>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="业务域">
                {currentOrder.domain === 'consumable' ? '耗材域' : '药品域'}
              </Descriptions.Item>
            </Descriptions>

            <Space size={40} style={{ marginBottom: 16 }}>
              <Statistic
                title="订单总金额"
                value={currentOrder.totalAmount}
                prefix="¥"
                precision={0}
              />
              <Statistic
                title="已收货金额"
                value={currentOrder.receivedAmount}
                prefix="¥"
                precision={0}
                styles={{
                  content: {
                    color:
                      currentOrder.receivedAmount > 0 ? '#52c41a' : undefined,
                  },
                }}
              />
              <Statistic
                title="待收货金额"
                value={currentOrder.pendingAmount}
                prefix="¥"
                precision={0}
                styles={{
                  content: {
                    color:
                      currentOrder.pendingAmount > 0 ? '#fa8c16' : undefined,
                  },
                }}
              />
            </Space>

            {currentOrder.remark && (
              <div
                style={{
                  marginBottom: 16,
                  padding: '8px 12px',
                  background: '#fff7e6',
                  borderRadius: 6,
                  fontSize: 13,
                  borderLeft: '3px solid #fa8c16',
                }}
              >
                <Text type="warning">备注：</Text>
                {currentOrder.remark}
              </div>
            )}

            <Divider>订单明细</Divider>
            <Table
              rowKey="id"
              columns={itemColumns}
              dataSource={itemsData?.data || []}
              loading={itemsLoading}
              pagination={false}
              scroll={{ x: 900 }}
              size="small"
            />
          </>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ProcurementOrderList;
