import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  SafetyOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Descriptions, Drawer, Space, Tag, Typography } from 'antd';
import React, { useState } from 'react';

const { Text } = Typography;

interface QaItem {
  id: string;
  receiveId: string | null;
  type: string;
  typeName: string;
  domain: string;
  branch: string;
  inspector: string;
  inspectDate: string;
  itemCount: number;
  status: string;
  statusName: string;
  result: string | null;
  passCount: number;
  failCount: number;
  pendingCount: number;
  remark: string;
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  in_progress: { color: 'processing', icon: <SyncOutlined spin /> },
  qualified: { color: 'green', icon: <CheckCircleOutlined /> },
  unqualified: { color: 'red', icon: <CloseCircleOutlined /> },
  recheck: { color: 'orange', icon: <SafetyOutlined /> },
};

const typeColorMap: Record<string, string> = {
  routine: 'blue',
  incoming: 'purple',
  special: 'red',
};

const QaList: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentDomain = initialState?.currentDomain || 'consumable';

  const [detailVisible, setDetailVisible] = useState(false);
  const [currentQa, setCurrentQa] = useState<QaItem | null>(null);

  const columns: ProColumns<QaItem>[] = [
    {
      title: '质检单号',
      dataIndex: 'id',
      width: 170,
      render: (text) => (
        <Text style={{ fontFamily: 'monospace', color: '#1677ff' }}>
          {text}
        </Text>
      ),
    },
    {
      title: '关联验收单',
      dataIndex: 'receiveId',
      width: 170,
      search: false,
      render: (text) =>
        text ? (
          <Text style={{ fontFamily: 'monospace' }} type="secondary">
            {text}
          </Text>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: '质检类型',
      dataIndex: 'type',
      width: 110,
      valueEnum: {
        routine: { text: '常规抽检' },
        incoming: { text: '进货检验' },
        special: { text: '专项检查' },
      },
      render: (_, record) => (
        <Tag color={typeColorMap[record.type]}>{record.typeName}</Tag>
      ),
    },
    {
      title: '质检员',
      dataIndex: 'inspector',
      ellipsis: true,
      search: false,
    },
    {
      title: '质检日期',
      dataIndex: 'inspectDate',
      width: 110,
      search: false,
    },
    {
      title: '品种数',
      dataIndex: 'itemCount',
      width: 75,
      search: false,
      align: 'center',
    },
    {
      title: '合格',
      dataIndex: 'passCount',
      width: 65,
      search: false,
      align: 'center',
      render: (val: any) => <Text type="success">{val}</Text>,
    },
    {
      title: '不合格',
      dataIndex: 'failCount',
      width: 75,
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
      title: '待检',
      dataIndex: 'pendingCount',
      width: 65,
      search: false,
      align: 'center',
      render: (val: any) =>
        val > 0 ? (
          <Text type="warning">{val}</Text>
        ) : (
          <Text type="secondary">0</Text>
        ),
    },
    {
      title: '质检结果',
      dataIndex: 'status',
      width: 120,
      valueEnum: {
        in_progress: { text: '检验中' },
        qualified: { text: '检验合格' },
        unqualified: { text: '发现不合格' },
        recheck: { text: '待复检' },
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
            setCurrentQa(record);
            setDetailVisible(true);
          }}
        >
          <EyeOutlined /> 查看
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<QaItem>
        rowKey="id"
        columns={columns}
        request={async (params) => {
          const qs = new URLSearchParams({
            domain: currentDomain,
            status: params.status || '',
            type: params.type || '',
            keyword: params.id || params.inspector || '',
            current: String(params.current || 1),
            pageSize: String(params.pageSize || 10),
          });
          const res = await fetch(`/api/procurement/qa?${qs}`).then((r) =>
            r.json(),
          );
          return { data: res.data, total: res.total, success: true };
        }}
        search={{ labelWidth: 'auto' }}
        pagination={{ defaultPageSize: 10 }}
        scroll={{ x: 1300 }}
      />

      {/* 质检详情抽屉 */}
      <Drawer
        title={
          <Space>
            <SafetyOutlined />
            质检记录详情 —— {currentQa?.id}
          </Space>
        }
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        styles={{ wrapper: { width: 640 } }}
      >
        {currentQa && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="质检单号">
              <Text style={{ fontFamily: 'monospace' }}>{currentQa.id}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="质检结果">
              <Tag color={statusConfig[currentQa.status]?.color}>
                {currentQa.statusName}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="关联验收单">
              {currentQa.receiveId ? (
                <Text style={{ fontFamily: 'monospace' }} type="secondary">
                  {currentQa.receiveId}
                </Text>
              ) : (
                <Text type="secondary">—</Text>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="质检类型">
              <Tag color={typeColorMap[currentQa.type]}>
                {currentQa.typeName}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="质检员" span={2}>
              {currentQa.inspector}
            </Descriptions.Item>
            <Descriptions.Item label="质检日期">
              {currentQa.inspectDate}
            </Descriptions.Item>
            <Descriptions.Item label="业务域">
              {currentQa.domain === 'consumable' ? '耗材域' : '药品域'}
            </Descriptions.Item>
            <Descriptions.Item label="院区">
              {currentQa.branch}
            </Descriptions.Item>
            <Descriptions.Item label="质检品种总数">
              {currentQa.itemCount} 种
            </Descriptions.Item>
            <Descriptions.Item label="合格品种">
              <Text type="success">{currentQa.passCount}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="不合格品种">
              {currentQa.failCount > 0 ? (
                <Text type="danger">{currentQa.failCount}</Text>
              ) : (
                <Text type="secondary">0</Text>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="待检品种">
              {currentQa.pendingCount > 0 ? (
                <Text type="warning">{currentQa.pendingCount}</Text>
              ) : (
                <Text type="secondary">0</Text>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="备注说明" span={2}>
              {currentQa.remark}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default QaList;
