import {
  AuditOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  StopOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Descriptions, Drawer, Progress, Space, Tag, Typography } from 'antd';
import React, { useState } from 'react';

const { Text } = Typography;

interface ContractItem {
  id: string;
  name: string;
  type: string;
  typeName: string;
  supplier: string;
  supplierCode: string;
  domain: string;
  signDate: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  executedAmount: number;
  status: string;
  statusName: string;
  contactPerson: string;
  contactPhone: string;
  remark: string;
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  active: { color: 'green', icon: <AuditOutlined /> },
  expiring_soon: { color: 'orange', icon: <WarningOutlined /> },
  expired: { color: 'default', icon: <ClockCircleOutlined /> },
  terminated: { color: 'red', icon: <StopOutlined /> },
};

// 判断合同是否即将到期（90天内）
const isExpiringSoon = (endDate: string) => {
  const end = new Date(endDate);
  const now = new Date();
  const diffDays = Math.ceil(
    (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diffDays > 0 && diffDays <= 90;
};

const ContractList: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentDomain = initialState?.currentDomain || 'consumable';

  const [detailVisible, setDetailVisible] = useState(false);
  const [currentContract, setCurrentContract] = useState<ContractItem | null>(
    null,
  );

  const columns: ProColumns<ContractItem>[] = [
    {
      title: '合同编号',
      dataIndex: 'id',
      width: 140,
      render: (text) => (
        <Text style={{ fontFamily: 'monospace', color: '#1677ff' }}>
          {text}
        </Text>
      ),
    },
    {
      title: '合同名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '合同类型',
      dataIndex: 'type',
      width: 110,
      valueEnum: {
        annual: { text: '年度框架' },
        single: { text: '单次采购' },
      },
      render: (_, record) => (
        <Tag color={record.type === 'annual' ? 'blue' : 'cyan'}>
          {record.typeName}
        </Tag>
      ),
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
      ellipsis: true,
    },
    {
      title: '合同金额',
      dataIndex: 'totalAmount',
      width: 130,
      search: false,
      align: 'right',
      render: (val: any) => <Text strong>¥{Number(val).toLocaleString()}</Text>,
    },
    {
      title: '已执行',
      dataIndex: 'executedAmount',
      width: 100,
      search: false,
      align: 'right',
      render: (val: any) => (
        <Text type="success">¥{Number(val).toLocaleString()}</Text>
      ),
    },
    {
      title: '执行进度',
      width: 130,
      search: false,
      render: (_, record) => {
        const pct = Math.round(
          (record.executedAmount / record.totalAmount) * 100,
        );
        return (
          <Progress
            percent={pct}
            size="small"
            strokeColor={pct > 80 ? '#ff4d4f' : '#52c41a'}
          />
        );
      },
    },
    {
      title: '起止日期',
      width: 220,
      search: false,
      render: (_, record) => `${record.startDate} ~ ${record.endDate}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      valueEnum: {
        active: { text: '生效中' },
        expired: { text: '已到期' },
        terminated: { text: '已终止' },
      },
      render: (_, record) => {
        // 动态判断即将到期
        const effectiveStatus =
          record.status === 'active' && isExpiringSoon(record.endDate)
            ? 'expiring_soon'
            : record.status;
        const effectiveName =
          effectiveStatus === 'expiring_soon' ? '即将到期' : record.statusName;
        const cfg = statusConfig[effectiveStatus] || {
          color: 'default',
          icon: null,
        };
        return (
          <Tag icon={cfg.icon} color={cfg.color}>
            {effectiveName}
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
            setCurrentContract(record);
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
      <ProTable<ContractItem>
        rowKey="id"
        columns={columns}
        request={async (params) => {
          const qs = new URLSearchParams({
            domain: currentDomain,
            status: params.status || '',
            keyword: params.id || params.name || params.supplier || '',
            current: String(params.current || 1),
            pageSize: String(params.pageSize || 10),
          });
          const res = await fetch(`/api/procurement/contracts?${qs}`).then(
            (r) => r.json(),
          );
          return { data: res.data, total: res.total, success: true };
        }}
        search={{ labelWidth: 'auto' }}
        pagination={{ defaultPageSize: 10 }}
        scroll={{ x: 1400 }}
      />

      {/* 合同详情抽屉 */}
      <Drawer
        title={
          <Space>
            <AuditOutlined />
            合同详情 —— {currentContract?.id}
          </Space>
        }
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        width={700}
      >
        {currentContract && (
          <>
            <Descriptions
              bordered
              column={2}
              size="small"
              style={{ marginBottom: 24 }}
            >
              <Descriptions.Item label="合同编号">
                <Text style={{ fontFamily: 'monospace' }}>
                  {currentContract.id}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="合同类型">
                <Tag
                  color={currentContract.type === 'annual' ? 'blue' : 'cyan'}
                >
                  {currentContract.typeName}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="合同名称" span={2}>
                {currentContract.name}
              </Descriptions.Item>
              <Descriptions.Item label="供应商" span={2}>
                {currentContract.supplier}
              </Descriptions.Item>
              <Descriptions.Item label="供应商编码">
                {currentContract.supplierCode}
              </Descriptions.Item>
              <Descriptions.Item label="业务域">
                {currentContract.domain === 'consumable' ? '耗材域' : '药品域'}
              </Descriptions.Item>
              <Descriptions.Item label="联系人">
                {currentContract.contactPerson}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">
                {currentContract.contactPhone}
              </Descriptions.Item>
              <Descriptions.Item label="签订日期">
                {currentContract.signDate}
              </Descriptions.Item>
              <Descriptions.Item label="合同起止">
                {currentContract.startDate} ~ {currentContract.endDate}
              </Descriptions.Item>
              <Descriptions.Item label="合同金额">
                <Text strong>
                  ¥{Number(currentContract.totalAmount).toLocaleString()}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="已执行金额">
                <Text type="success">
                  ¥{Number(currentContract.executedAmount).toLocaleString()}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="执行进度" span={2}>
                <Progress
                  percent={Math.round(
                    (currentContract.executedAmount /
                      currentContract.totalAmount) *
                      100,
                  )}
                  strokeColor={
                    currentContract.executedAmount /
                      currentContract.totalAmount >
                    0.8
                      ? '#ff4d4f'
                      : '#52c41a'
                  }
                />
              </Descriptions.Item>
              {currentContract.remark && (
                <Descriptions.Item label="备注说明" span={2}>
                  {currentContract.remark}
                </Descriptions.Item>
              )}
            </Descriptions>

            {isExpiringSoon(currentContract.endDate) &&
              currentContract.status === 'active' && (
                <div
                  style={{
                    padding: '12px 16px',
                    background: '#fff7e6',
                    borderRadius: 8,
                    borderLeft: '4px solid #fa8c16',
                    marginTop: 16,
                  }}
                >
                  <WarningOutlined
                    style={{ color: '#fa8c16', marginRight: 8 }}
                  />
                  <Text type="warning">
                    该合同将于 {currentContract.endDate}{' '}
                    到期，请提前联系供应商洽谈续签事宜。
                  </Text>
                </div>
              )}
          </>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ContractList;
