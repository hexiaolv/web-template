import {
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  PrinterOutlined,
  RotateLeftOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  App,
  Button,
  Card,
  Drawer,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
} from 'antd';
import {
  BandBoundaryDesigner,
  exportToPdf,
  openPrintWindow,
  PrintPreview,
} from 'print-designer';
import React, { useState } from 'react';
import { mockTemplates, type PrintTemplate } from './mockTemplates';

const CustomReportManager: React.FC = () => {
  const { message } = App.useApp();

  // 列表状态控制，用于强制刷新表格
  const [, setRefreshKey] = useState(0);

  // 设计器与预览相关状态
  const [designerOpen, setDesignerOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<PrintTemplate | null>(
    null,
  );

  // 获取当前正在生效的模板设计配置
  const getActiveDesign = (template: PrintTemplate) => {
    const saved = localStorage.getItem(
      `print_template_by_code_${template.code}`,
    );
    if (saved) {
      try {
        const design = JSON.parse(saved);
        // 自检：如果包含 detail 明细带区，但 objects 长度为 0，说明被历史脏缓存污染，自动清除
        const detailBand = design.bands?.find((b: any) => b.id === 'detail');
        if (
          detailBand &&
          (!detailBand.objects || detailBand.objects.length === 0)
        ) {
          console.warn(
            `检测到模板 ${template.name} 包含空的明细带区，自动清除受污染的历史本地缓存`,
          );
          localStorage.removeItem(`print_template_by_code_${template.code}`);
        } else {
          return design;
        }
      } catch (e) {
        console.error('加载缓存模板配置失败:', e);
      }
    }
    return {
      bands: template.fallbackBands,
      pageSettings: template.fallbackPageSettings,
    };
  };

  // 保存设计
  const handleSaveDesign = (design: any) => {
    if (!activeTemplate) return;
    localStorage.setItem(
      `print_template_by_code_${activeTemplate.code}`,
      JSON.stringify(design),
    );
    message.success(`${activeTemplate.name} 打印模板配置保存成功！`);
    setRefreshKey((prev) => prev + 1);
  };

  // 重置单个模板
  const handleReset = (template: PrintTemplate) => {
    localStorage.removeItem(`print_template_by_code_${template.code}`);
    message.success(`${template.name} 已成功恢复为系统出厂配置！`);
    setRefreshKey((prev) => prev + 1);
  };

  // 一键重置所有模板配置
  const handleResetAll = () => {
    mockTemplates.forEach((t) => {
      localStorage.removeItem(`print_template_by_code_${t.code}`);
    });
    message.success(
      '已成功清除所有历史自定义配置，全部恢复为最新系统出厂模板！',
    );
    setRefreshKey((prev) => prev + 1);
  };

  // 直接打印当前预览的单据
  const handleTriggerPrint = () => {
    if (!activeTemplate) return;
    const design = getActiveDesign(activeTemplate);
    openPrintWindow({
      design,
      data: activeTemplate.mockData,
      dataFields: activeTemplate.dataFields,
    });
  };

  // 直接导出当前预览的 PDF
  const handleTriggerPdf = async () => {
    if (!activeTemplate) return;
    const design = getActiveDesign(activeTemplate);
    message.open({
      type: 'loading',
      content: '正在生成 PDF 文件，请稍候...',
      duration: 0,
    });
    try {
      await exportToPdf({
        design,
        data: activeTemplate.mockData,
        dataFields: activeTemplate.dataFields,
        fileName: `${activeTemplate.name}_预览`,
        download: true,
      });
      message.destroy();
      message.success('PDF 报表文件下载成功！');
    } catch (e) {
      message.destroy();
      message.error('导出 PDF 失败，请检查配置！');
      console.error(e);
    }
  };

  const columns = [
    {
      title: '单据/报表名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string) => (
        <strong style={{ color: '#1f2937' }}>{text}</strong>
      ),
    },
    {
      title: '模板标识 (code)',
      dataIndex: 'code',
      key: 'code',
      width: 180,
      render: (text: string) => (
        <span style={{ fontFamily: 'monospace', color: '#4b5563' }}>
          {text}
        </span>
      ),
    },
    {
      title: '单据描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      key: 'status',
      width: 120,
      render: (_: any, record: PrintTemplate) => {
        const hasCustom = localStorage.getItem(
          `print_template_by_code_${record.code}`,
        );
        return hasCustom ? (
          <Tag color="orange">已自定义</Tag>
        ) : (
          <Tag color="green">系统默认</Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 240,
      render: (_: any, record: PrintTemplate) => {
        const hasCustom = localStorage.getItem(
          `print_template_by_code_${record.code}`,
        );
        return (
          <Space size="middle">
            <a
              onClick={() => {
                setActiveTemplate(record);
                setPreviewOpen(true);
              }}
            >
              <EyeOutlined /> 预览效果
            </a>
            <a
              style={{ color: '#1677ff' }}
              onClick={() => {
                setActiveTemplate(record);
                setDesignerOpen(true);
              }}
            >
              <EditOutlined /> 设计模板
            </a>
            {hasCustom && (
              <Popconfirm
                title="重置模板"
                description="您确定要放弃所有自定义拖拽排版，重置为最初始的模板布局吗？"
                onConfirm={() => handleReset(record)}
                okText="确认重置"
                cancelText="取消"
                okButtonProps={{ danger: true }}
              >
                <a style={{ color: '#ff4d4f' }}>
                  <RotateLeftOutlined /> 重置
                </a>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer
      title="打印单据与自定义报表管理"
      subTitle="统一配置管理各类随货发货单、采购合同、科室领用及财务结算账单的打印模板"
      extra={[
        <Popconfirm
          key="reset-all"
          title="重置所有模板"
          description="您确定要放弃所有单据模板的自定义拖拽排版，全部恢复为最初始的系统出厂配置吗？"
          onConfirm={handleResetAll}
          okText="确认重置"
          cancelText="取消"
          okButtonProps={{ danger: true }}
        >
          <Button icon={<RotateLeftOutlined />} danger>
            重置所有模板到默认
          </Button>
        </Popconfirm>,
      ]}
    >
      <Card bordered={false} styles={{ body: { padding: '24px' } }}>
        <Table
          dataSource={mockTemplates}
          columns={columns}
          pagination={false}
          rowKey="key"
          bordered
        />
      </Card>

      {/* 全屏所见即所得设计器抽屉 */}
      <Drawer
        title={
          <Space>
            <EditOutlined style={{ color: '#1677ff' }} />
            <span>模板设计器 —— {activeTemplate?.name}</span>
            <Tag color="blue">可视化拖拽</Tag>
          </Space>
        }
        width="100%"
        open={designerOpen}
        onClose={() => setDesignerOpen(false)}
        styles={{ body: { padding: 0 } }}
        destroyOnClose
      >
        {activeTemplate &&
          (() => {
            const currentDesign = getActiveDesign(activeTemplate);
            return (
              <div style={{ height: 'calc(100vh - 55px)' }}>
                <BandBoundaryDesigner
                  dataFields={activeTemplate.dataFields}
                  data={activeTemplate.mockData}
                  initialDesign={currentDesign.bands}
                  initialPageSettings={currentDesign.pageSettings}
                  onSave={handleSaveDesign}
                />
              </div>
            );
          })()}
      </Drawer>

      {/* 打印效果预览 Modal */}
      <Modal
        title={
          <Space>
            <PrinterOutlined style={{ color: '#1677ff' }} />
            <span>打印效果预览 —— {activeTemplate?.name}</span>
          </Space>
        }
        open={previewOpen}
        onCancel={() => setPreviewOpen(false)}
        width={850}
        destroyOnClose
        footer={[
          <Button key="close" onClick={() => setPreviewOpen(false)}>
            关闭
          </Button>,
          <Button
            key="pdf"
            icon={<DownloadOutlined />}
            style={{ borderColor: '#ff4d4f', color: '#ff4d4f' }}
            onClick={handleTriggerPdf}
          >
            导出 PDF
          </Button>,
          <Button
            key="print"
            type="primary"
            icon={<PrinterOutlined />}
            onClick={handleTriggerPrint}
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
            maxHeight: '65vh',
            overflowY: 'auto',
          }}
        >
          {activeTemplate &&
            (() => {
              const currentDesign = getActiveDesign(activeTemplate);
              return (
                <PrintPreview
                  bands={currentDesign.bands}
                  data={activeTemplate.mockData}
                  dataFields={activeTemplate.dataFields}
                  pageSettings={currentDesign.pageSettings}
                  onClose={() => setPreviewOpen(false)}
                />
              );
            })()}
        </div>
      </Modal>
    </PageContainer>
  );
};

export default CustomReportManager;
