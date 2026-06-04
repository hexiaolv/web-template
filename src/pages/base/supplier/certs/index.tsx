import {
  EyeOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  WarningOutlined,
} from '@ant-design/icons';
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

interface CertItem {
  id: string;
  supplierName: string;
  certType: string;
  certTypeName: string;
  certNo: string;
  certName: string;
  issueDate: string;
  expiryDate: string;
  issueOrg: string;
  status: string;
  statusName: string;
  createTime: string;
}

const statusConfig: Record<string, { color: string; icon?: React.ReactNode }> =
  {
    valid: { color: 'green' },
    expiring: { color: 'orange', icon: <WarningOutlined /> },
    expired: { color: 'red', icon: <WarningOutlined /> },
  };

const SupplierCerts: React.FC = () => {
  const { message } = App.useApp();
  const actionRef = useRef<any>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<CertItem | null>(null);

  const columns: ProColumns<CertItem>[] = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      hideInTable: true,
      fieldProps: { placeholder: '供应商 / 证照名 / 证照编号' },
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      width: 240,
      ellipsis: true,
      search: false,
    },
    {
      title: '证照类型',
      dataIndex: 'certType',
      width: 180,
      valueType: 'select',
      valueEnum: {
        business_license: { text: '营业执照' },
        medical_device_license: { text: '医疗器械许可' },
        gsp: { text: 'GSP证书' },
        gmp: { text: 'GMP证书' },
        narcotic_license: { text: '麻醉药品许可' },
      },
      render: (_, record) => <Tag>{record.certTypeName}</Tag>,
    },
    {
      title: '证照编号',
      dataIndex: 'certNo',
      width: 200,
      search: false,
      ellipsis: true,
      render: (text) => <Text style={{ fontFamily: 'monospace' }}>{text}</Text>,
    },
    {
      title: '发证日期',
      dataIndex: 'issueDate',
      width: 110,
      search: false,
    },
    {
      title: '有效期至',
      dataIndex: 'expiryDate',
      width: 110,
      search: false,
      render: (text, record) => (
        <Text
          type={
            record.status === 'expired'
              ? 'danger'
              : record.status === 'expiring'
                ? 'warning'
                : undefined
          }
        >
          {text}
        </Text>
      ),
    },
    {
      title: '发证机关',
      dataIndex: 'issueOrg',
      width: 180,
      search: false,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 110,
      valueEnum: {
        valid: { text: '有效' },
        expiring: { text: '即将过期' },
        expired: { text: '已过期' },
      },
      render: (_, record) => {
        const cfg = statusConfig[record.status] || { color: 'default' };
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
      <ProTable<CertItem>
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          const qs = new URLSearchParams({
            keyword: params.keyword || '',
            certType: params.certType || '',
            status: params.status || '',
            current: String(params.current || 1),
            pageSize: String(params.pageSize || 10),
          });
          const res = await fetch(`/api/base/supplier/certs?${qs}`).then((r) =>
            r.json(),
          );
          return { data: res.data, total: res.total, success: true };
        }}
        toolBarRender={() => [
          <DrawerForm
            key="create"
            title="新增证照"
            width={600}
            trigger={
              <Button type="primary" icon={<PlusOutlined />}>
                新增证照
              </Button>
            }
            onFinish={async (values) => {
              await fetch('/api/base/supplier/certs', {
                method: 'POST',
                body: JSON.stringify(values),
                headers: { 'Content-Type': 'application/json' },
              });
              message.success('证照创建成功');
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
              name="certType"
              label="证照类型"
              rules={[{ required: true }]}
              options={[
                { label: '营业执照', value: 'business_license' },
                {
                  label: '医疗器械生产许可证',
                  value: 'medical_device_license',
                },
                { label: 'GSP证书', value: 'gsp' },
                { label: 'GMP证书', value: 'gmp' },
                { label: '麻醉药品生产许可证', value: 'narcotic_license' },
              ]}
            />
            <ProFormText
              name="certNo"
              label="证照编号"
              rules={[{ required: true }]}
            />
            <ProFormText name="certName" label="证照名称" />
            <ProFormDatePicker
              name="issueDate"
              label="发证日期"
              rules={[{ required: true }]}
            />
            <ProFormDatePicker
              name="expiryDate"
              label="有效期至"
              rules={[{ required: true }]}
            />
            <ProFormText name="issueOrg" label="发证机关" />
          </DrawerForm>,
        ]}
        search={{ labelWidth: 'auto' }}
        pagination={{ defaultPageSize: 10 }}
        scroll={{ x: 1300 }}
      />

      <Drawer
        title={
          <Space>
            <SafetyCertificateOutlined />
            证照详情
          </Space>
        }
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        styles={{ wrapper: { width: 640 } }}
      >
        {currentItem && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="供应商">
              {currentItem.supplierName}
            </Descriptions.Item>
            <Descriptions.Item label="证照类型">
              <Tag>{currentItem.certTypeName}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="证照编号">
              <Text style={{ fontFamily: 'monospace' }}>
                {currentItem.certNo}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="证照名称">
              {currentItem.certName}
            </Descriptions.Item>
            <Descriptions.Item label="发证日期">
              {currentItem.issueDate}
            </Descriptions.Item>
            <Descriptions.Item label="有效期至">
              <Text
                type={
                  currentItem.status === 'expired'
                    ? 'danger'
                    : currentItem.status === 'expiring'
                      ? 'warning'
                      : undefined
                }
              >
                {currentItem.expiryDate}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="发证机关">
              {currentItem.issueOrg}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag
                icon={statusConfig[currentItem.status]?.icon}
                color={statusConfig[currentItem.status]?.color}
              >
                {currentItem.statusName}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default SupplierCerts;
