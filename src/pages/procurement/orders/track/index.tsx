import {
  BellOutlined,
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import {
  App,
  Button,
  Descriptions,
  Drawer,
  Space,
  Tag,
  Timeline,
  Typography,
} from 'antd';
import React, { useState } from 'react';

const { Text } = Typography;

interface TrackItem {
  id: string;
  orderId: string;
  supplier: string;
  logisticsCompany: string;
  trackingNo: string;
  domain: string;
  branch: string;
  sendTime: string;
  estimatedArrival: string;
  actualArrival: string | null;
  status: string;
  statusName: string;
  itemDesc: string;
  sendQty: number;
  contactPhone: string;
  nodes: Array<{ time: string; location: string; event: string }>;
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  sent: { color: 'blue', icon: <CarOutlined /> },
  in_transit: { color: 'processing', icon: <CarOutlined /> },
  arrived: { color: 'green', icon: <CheckCircleOutlined /> },
  exception: { color: 'red', icon: <WarningOutlined /> },
};

const ProcurementTrack: React.FC = () => {
  const { message } = App.useApp();
  const { initialState } = useModel('@@initialState');
  const currentDomain = initialState?.currentDomain || 'consumable';

  const [detailVisible, setDetailVisible] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<TrackItem | null>(null);

  const { run: urge } = useRequest(
    (id: string) => ({
      url: `/api/procurement/track/${id}/urge`,
      method: 'POST',
    }),
    {
      manual: true,
      onSuccess: () => message.success('催货消息已推送至供应商负责人'),
    },
  );

  const columns: ProColumns<TrackItem>[] = [
    {
      title: '发货单号',
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
      title: '物流公司',
      dataIndex: 'logisticsCompany',
      width: 150,
      search: false,
    },
    {
      title: '运单号',
      dataIndex: 'trackingNo',
      width: 160,
      search: false,
      render: (text) => <Text style={{ fontFamily: 'monospace' }}>{text}</Text>,
    },
    {
      title: '发货时间',
      dataIndex: 'sendTime',
      width: 160,
      search: false,
    },
    {
      title: '预计到货',
      dataIndex: 'estimatedArrival',
      width: 110,
      search: false,
    },
    {
      title: '实际到货',
      dataIndex: 'actualArrival',
      width: 160,
      search: false,
      render: (val) => val || <Text type="secondary">—</Text>,
    },
    {
      title: '运输状态',
      dataIndex: 'status',
      width: 110,
      valueEnum: {
        sent: { text: '已发货' },
        in_transit: { text: '运输中' },
        arrived: { text: '已到达' },
        exception: { text: '运输异常' },
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
      width: 130,
      render: (_, record) =>
        [
          <a
            key="view"
            onClick={() => {
              setCurrentTrack(record);
              setDetailVisible(true);
            }}
          >
            <EyeOutlined /> 物流轨迹
          </a>,
          record.status !== 'arrived' && (
            <a
              key="urge"
              style={{ color: '#fa8c16' }}
              onClick={() => urge(record.id)}
            >
              <BellOutlined /> 催货
            </a>
          ),
        ].filter(Boolean),
    },
  ];

  return (
    <PageContainer>
      <ProTable<TrackItem>
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
          const res = await fetch(`/api/procurement/track?${qs}`).then((r) =>
            r.json(),
          );
          return { data: res.data, total: res.total, success: true };
        }}
        search={{ labelWidth: 'auto' }}
        pagination={{ defaultPageSize: 10 }}
        scroll={{ x: 1400 }}
      />

      {/* 物流轨迹抽屉 */}
      <Drawer
        title={
          <Space>
            <CarOutlined />
            物流追踪 —— {currentTrack?.id}
          </Space>
        }
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        width={700}
        extra={
          currentTrack?.status !== 'arrived' && (
            <Button
              icon={<BellOutlined />}
              onClick={() => {
                if (currentTrack?.id) urge(currentTrack.id);
              }}
            >
              催货
            </Button>
          )
        }
      >
        {currentTrack && (
          <>
            <Descriptions
              bordered
              column={2}
              size="small"
              style={{ marginBottom: 24 }}
            >
              <Descriptions.Item label="发货单号">
                <Text style={{ fontFamily: 'monospace' }}>
                  {currentTrack.id}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="关联订单">
                <Text style={{ fontFamily: 'monospace' }} type="secondary">
                  {currentTrack.orderId}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="供应商" span={2}>
                {currentTrack.supplier}
              </Descriptions.Item>
              <Descriptions.Item label="物流公司">
                {currentTrack.logisticsCompany}
              </Descriptions.Item>
              <Descriptions.Item label="运单号">
                <Text style={{ fontFamily: 'monospace' }}>
                  {currentTrack.trackingNo}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="发货时间">
                {currentTrack.sendTime}
              </Descriptions.Item>
              <Descriptions.Item label="预计到货">
                {currentTrack.estimatedArrival}
              </Descriptions.Item>
              <Descriptions.Item label="货物描述" span={2}>
                {currentTrack.itemDesc}
              </Descriptions.Item>
              <Descriptions.Item label="运输状态">
                <Tag color={statusConfig[currentTrack.status]?.color}>
                  {currentTrack.statusName}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="供应商联系电话">
                {currentTrack.contactPhone}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ fontWeight: 600, marginBottom: 16, fontSize: 14 }}>
              <ClockCircleOutlined
                style={{ marginRight: 6, color: '#1677ff' }}
              />
              物流节点时间线
            </div>

            <Timeline
              mode="left"
              items={currentTrack.nodes.map((node, idx) => ({
                label: node.time,
                color: idx === currentTrack.nodes.length - 1 ? 'green' : 'blue',
                children: (
                  <div>
                    <div style={{ fontWeight: 500 }}>{node.location}</div>
                    <div style={{ color: '#8c8c8c', fontSize: 13 }}>
                      {node.event}
                    </div>
                  </div>
                ),
              }))}
            />
          </>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ProcurementTrack;
