import {
  BellOutlined,
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  PrinterOutlined,
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
  Modal,
  Space,
  Tag,
  Timeline,
  Typography,
} from 'antd';
import { exportToPdf, openPrintWindow, PrintPreview } from 'print-designer';
import React, { useState } from 'react';
import type { PrintTemplate } from '../../../analytics/reports/mockTemplates';
import { mockTemplates } from '../../../analytics/reports/mockTemplates';

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

// 获取发货单的 Mock 模版配置
const deliveryTemplate = mockTemplates.find(
  (t: PrintTemplate) => t.code === 'c_delivery_order',
) as PrintTemplate;

const ProcurementTrack: React.FC = () => {
  const { message } = App.useApp();
  const { initialState } = useModel('@@initialState');
  const currentDomain = initialState?.currentDomain || 'consumable';

  const [detailVisible, setDetailVisible] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<TrackItem | null>(null);

  // 打印相关状态
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [printData, setPrintData] = useState<any>(null);
  const [templateDesign, setTemplateDesign] = useState<{
    bands?: any[];
    pageSettings?: any;
  } | null>(null);

  // 触发发货单打印预览
  const handlePrintClick = (record: TrackItem) => {
    // 从统一的 LocalStorage 键名加载设计模板
    const saved = localStorage.getItem(
      `print_template_by_code_${deliveryTemplate.code}`,
    );
    let design: any = {};
    if (saved) {
      try {
        design = JSON.parse(saved);
      } catch (e) {
        console.error('解析发货单模板失败，将使用默认样式:', e);
      }
    }

    // 映射 products 明细列表：将模板自带的超长 products 与该订单基本数据合并
    // 这样可以让订单追踪列表中每行数据在打印时都有高拟真、多达24行的明细项目，形成完美的跨页效果！
    const detailProducts = [...deliveryTemplate.mockData.products];
    const fullPrintData = {
      ...record,
      products: detailProducts,
    };

    setTemplateDesign(design);
    setPrintData(fullPrintData);
    setPrintModalVisible(true);
  };

  // 调起系统打印
  const triggerBrowserPrint = () => {
    if (!printData) return;
    openPrintWindow({
      design: {
        bands: templateDesign?.bands || deliveryTemplate.fallbackBands,
        pageSettings:
          templateDesign?.pageSettings || deliveryTemplate.fallbackPageSettings,
      },
      data: printData,
      dataFields: deliveryTemplate.dataFields,
    });
  };

  // 导出 PDF 并下载
  const triggerPdfExport = async () => {
    if (!printData) return;
    message.open({
      type: 'loading',
      content: '正在生成发货单 PDF 报表文件...',
      duration: 0,
    });
    try {
      await exportToPdf({
        design: {
          bands: templateDesign?.bands || deliveryTemplate.fallbackBands,
          pageSettings:
            templateDesign?.pageSettings ||
            deliveryTemplate.fallbackPageSettings,
        },
        data: printData,
        dataFields: deliveryTemplate.dataFields,
        fileName: `发货单_${printData.id}`,
        download: true,
      });
      message.destroy();
      message.success('PDF 报表导出并下载成功！');
    } catch (error) {
      message.destroy();
      message.error('导出 PDF 报表失败，请检查模板配置！');
      console.error(error);
    }
  };

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
      width: 200,
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
          <a
            key="print"
            style={{ color: '#52c41a' }}
            onClick={() => handlePrintClick(record)}
          >
            <PrinterOutlined /> 打印单据
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
        scroll={{ x: 1450 }}
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
        styles={{ wrapper: { width: 700 } }}
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

      {/* 单据打印预览 Modal */}
      <Modal
        title={
          <Space>
            <PrinterOutlined style={{ color: '#1677ff' }} />
            <span>发货单打印预览</span>
            <Tag color="blue">自定义报表模版已加载</Tag>
          </Space>
        }
        open={printModalVisible}
        onCancel={() => setPrintModalVisible(false)}
        width={850}
        destroyOnClose
        footer={[
          <Button key="close" onClick={() => setPrintModalVisible(false)}>
            关闭
          </Button>,
          <Button
            key="pdf"
            icon={<DownloadOutlined />}
            style={{ borderColor: '#ff4d4f', color: '#ff4d4f' }}
            onClick={triggerPdfExport}
          >
            导出 PDF
          </Button>,
          <Button
            key="print"
            type="primary"
            icon={<PrinterOutlined />}
            onClick={triggerBrowserPrint}
          >
            打印单据
          </Button>,
        ]}
      >
        <div
          style={{
            padding: '24px 0',
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: '#f1f5f9',
            borderRadius: '8px',
            maxHeight: '60vh',
            overflowY: 'auto',
          }}
        >
          {printData && (
            <PrintPreview
              bands={templateDesign?.bands || deliveryTemplate.fallbackBands}
              data={printData}
              dataFields={deliveryTemplate.dataFields}
              pageSettings={
                templateDesign?.pageSettings ||
                deliveryTemplate.fallbackPageSettings
              }
              onClose={() => setPrintModalVisible(false)}
            />
          )}
        </div>
      </Modal>
    </PageContainer>
  );
};

export default ProcurementTrack;
