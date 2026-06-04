import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  InboxOutlined,
  SafetyOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import {
  App,
  Badge,
  Button,
  Descriptions,
  Drawer,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import React, { useState } from 'react';

const { Text } = Typography;

interface ReceivingItem {
  id: string;
  orderId: string;
  sender: string | null;
  receiver: string | null;
  receiveTime: string | null;
  domain: string;
  branch: string;
  supplier: string;
  status: string;
  statusName: string;
  conclusion: string | null;
  qualifiedCount: number;
  unqualifiedCount: number;
  totalCount: number;
  udiVerified: boolean;
  remark: string;
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  pending: { color: 'default', icon: <ClockCircleOutlined /> },
  in_progress: { color: 'processing', icon: <SyncOutlined spin /> },
  completed: { color: 'green', icon: <CheckCircleOutlined /> },
  rejected: { color: 'red', icon: <InboxOutlined /> },
};

const conclusionMap: Record<string, { color: string; text: string }> = {
  qualified: { color: 'success', text: '全部合格' },
  partial: { color: 'warning', text: '部分合格' },
  unqualified: { color: 'error', text: '不合格' },
};

const ReceivingList: React.FC = () => {
  const { message } = App.useApp();
  const { initialState } = useModel('@@initialState');
  const currentDomain = initialState?.currentDomain || 'consumable';

  const [detailVisible, setDetailVisible] = useState(false);
  const [currentReceiving, setCurrentReceiving] =
    useState<ReceivingItem | null>(null);

  const {
    data: itemsData,
    loading: itemsLoading,
    run: fetchItems,
  } = useRequest(
    (id: string) => ({
      url: `/api/procurement/receiving/${id}/items`,
      method: 'GET',
    }),
    { manual: true },
  );

  const { run: confirmReceive } = useRequest(
    (id: string) => ({
      url: `/api/procurement/receiving/${id}/confirm`,
      method: 'POST',
    }),
    {
      manual: true,
      onSuccess: () => message.success('验收完成，已自动触发库存入库操作'),
    },
  );

  const handleViewDetail = (record: ReceivingItem) => {
    setCurrentReceiving(record);
    fetchItems(record.id);
    setDetailVisible(true);
  };

  const columns: ProColumns<ReceivingItem>[] = [
    {
      title: '验收单号',
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
      title: '院区',
      dataIndex: 'branch',
      width: 90,
      search: false,
    },
    {
      title: '品种总数',
      dataIndex: 'totalCount',
      width: 85,
      search: false,
      align: 'center',
    },
    {
      title: '合格品种',
      dataIndex: 'qualifiedCount',
      width: 85,
      search: false,
      align: 'center',
      render: (val: any) => <Text type="success">{val}</Text>,
    },
    {
      title: '不合格',
      dataIndex: 'unqualifiedCount',
      width: 80,
      search: false,
      align: 'center',
      render: (val: any) =>
        val > 0 ? (
          <Text type="danger">{val}</Text>
        ) : (
          <Text type="secondary">0</Text>
        ),
    },
    {
      title: 'UDI验证',
      dataIndex: 'udiVerified',
      width: 90,
      search: false,
      align: 'center',
      render: (val: any) =>
        val ? (
          <Badge status="success" text="已验证" />
        ) : (
          <Badge status="default" text="未验证" />
        ),
    },
    {
      title: '验收结论',
      dataIndex: 'conclusion',
      width: 110,
      search: false,
      render: (val: any) => {
        if (!val) return <Text type="secondary">—</Text>;
        const cfg = conclusionMap[val] || { color: 'default', text: val };
        return <Tag color={cfg.color}>{cfg.text}</Tag>;
      },
    },
    {
      title: '验收状态',
      dataIndex: 'status',
      width: 110,
      valueEnum: {
        pending: { text: '待验收' },
        in_progress: { text: '验收中' },
        completed: { text: '验收完成' },
        rejected: { text: '验收拒绝' },
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
      width: 160,
      render: (_, record) =>
        [
          <a key="view" onClick={() => handleViewDetail(record)}>
            <EyeOutlined /> 查看明细
          </a>,
          record.status === 'in_progress' && (
            <a
              key="confirm"
              style={{ color: '#52c41a' }}
              onClick={() => confirmReceive(record.id)}
            >
              <CheckCircleOutlined /> 完成验收
            </a>
          ),
        ].filter(Boolean),
    },
  ];

  const itemColumns = [
    { title: '物资编码', dataIndex: 'materialCode', width: 130 },
    { title: '品名', dataIndex: 'materialName', ellipsis: true },
    { title: '规格', dataIndex: 'spec', ellipsis: true },
    { title: '单位', dataIndex: 'unit', width: 55, align: 'center' as const },
    { title: '生产批号', dataIndex: 'batchNo', width: 110 },
    { title: '效期', dataIndex: 'expireDate', width: 110 },
    { title: '生产厂家', dataIndex: 'manufacturer', ellipsis: true },
    {
      title: '到货数量',
      dataIndex: 'arrivedQty',
      width: 90,
      align: 'right' as const,
    },
    {
      title: '合格数量',
      dataIndex: 'qualifiedQty',
      width: 90,
      align: 'right' as const,
      render: (val: number, rec: any) => (
        <Text type={val < rec.arrivedQty ? 'danger' : 'success'}>{val}</Text>
      ),
    },
    {
      title: 'UDI码',
      dataIndex: 'udiCode',
      width: 130,
      render: (val: string) => (
        <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>{val}</Text>
      ),
    },
    {
      title: '验收结果',
      dataIndex: 'result',
      width: 90,
      render: (val: string) => {
        const cfg = conclusionMap[val] || { color: 'default', text: val };
        return <Tag color={cfg.color}>{cfg.text}</Tag>;
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<ReceivingItem>
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
          const res = await fetch(`/api/procurement/receiving?${qs}`).then(
            (r) => r.json(),
          );
          return { data: res.data, total: res.total, success: true };
        }}
        search={{ labelWidth: 'auto' }}
        pagination={{ defaultPageSize: 10 }}
        scroll={{ x: 1400 }}
      />

      {/* 验收明细抽屉 */}
      <Drawer
        title={
          <Space>
            <SafetyOutlined />
            验收明细 —— {currentReceiving?.id}
          </Space>
        }
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        styles={{ wrapper: { width: 1000 } }}
        extra={
          currentReceiving?.status === 'in_progress' && (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => {
                confirmReceive(currentReceiving.id);
                setDetailVisible(false);
              }}
            >
              完成验收入库
            </Button>
          )
        }
      >
        {currentReceiving && (
          <>
            <Descriptions
              bordered
              column={3}
              size="small"
              style={{ marginBottom: 24 }}
            >
              <Descriptions.Item label="验收单号">
                <Text style={{ fontFamily: 'monospace' }}>
                  {currentReceiving.id}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="关联订单">
                <Text style={{ fontFamily: 'monospace' }} type="secondary">
                  {currentReceiving.orderId}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusConfig[currentReceiving.status]?.color}>
                  {currentReceiving.statusName}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="供应商" span={2}>
                {currentReceiving.supplier}
              </Descriptions.Item>
              <Descriptions.Item label="院区">
                {currentReceiving.branch}
              </Descriptions.Item>
              <Descriptions.Item label="送货人">
                {currentReceiving.sender || '—'}
              </Descriptions.Item>
              <Descriptions.Item label="验收人">
                {currentReceiving.receiver || '—'}
              </Descriptions.Item>
              <Descriptions.Item label="验收时间">
                {currentReceiving.receiveTime || '—'}
              </Descriptions.Item>
              <Descriptions.Item label="UDI验证">
                {currentReceiving.udiVerified ? (
                  <Badge status="success" text="已验证" />
                ) : (
                  <Badge status="default" text="未验证" />
                )}
              </Descriptions.Item>
              <Descriptions.Item label="验收结论">
                {currentReceiving.conclusion ? (
                  <Tag
                    color={conclusionMap[currentReceiving.conclusion]?.color}
                  >
                    {conclusionMap[currentReceiving.conclusion]?.text}
                  </Tag>
                ) : (
                  <Text type="secondary">验收中</Text>
                )}
              </Descriptions.Item>
              {currentReceiving.remark && (
                <Descriptions.Item label="备注" span={3}>
                  {currentReceiving.remark}
                </Descriptions.Item>
              )}
            </Descriptions>

            <Table
              rowKey="id"
              columns={itemColumns}
              dataSource={itemsData?.data || []}
              loading={itemsLoading}
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

export default ReceivingList;
