import {
  DownloadOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { SelectLang as UmiSelectLang } from '@umijs/max';
import { Button, Divider, Modal, message, Space, Table } from 'antd';
import React, { useState } from 'react';

export type SiderTheme = 'light' | 'dark';

export const SelectLang: React.FC = () => {
  return (
    <UmiSelectLang
      style={{
        padding: 4,
      }}
    />
  );
};

export const Question: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<any>(null);

  const helpDocs = [
    {
      key: '1',
      title: '1. SPD系统操作手册_科室领用分册.pdf',
      type: 'PDF',
      size: '2.4 MB',
      category: '科室操作',
    },
    {
      key: '2',
      title: '2. SPD系统操作手册_供应商准入与配送分册.pdf',
      type: 'PDF',
      size: '3.1 MB',
      category: '供应商',
    },
    {
      key: '3',
      title: '3. 医疗高值耗材追溯(UDI)使用指南.pdf',
      type: 'PDF',
      size: '1.8 MB',
      category: 'UDI追溯',
    },
    {
      key: '4',
      title: '4. 药品业务域快捷上线指导手册.xlsx',
      type: 'Excel',
      size: '520 KB',
      category: '系统配置',
    },
  ];

  const handleDownload = (doc: any) => {
    const hide = message.loading(`正在下载 ${doc.title}...`, 1.5);
    setTimeout(() => {
      hide();
      const blob = new Blob([`Mock binary content for ${doc.title}`], {
        type: 'application/octet-stream',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      message.success(`${doc.title} 下载成功！`);
    }, 1500);
  };

  const handlePreview = (doc: any) => {
    setPreviewDoc(doc);
    setPreviewVisible(true);
  };

  // 生成大段 Mock 预览文档内容，增加专业逼格
  const renderPreviewContent = (doc: any) => {
    if (!doc) return null;
    if (doc.key === '1') {
      return (
        <div style={{ color: '#262626', fontSize: '13px', lineHeight: '1.8' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#25B7AA' }}>
            1. 引言及科室领用概述
          </h2>
          <p>
            本手册旨在指导临床科室护士及库房保管员，进行日常二级库耗材的请领、扫码消耗、科室退库以及移库操作。
          </p>
          <Divider style={{ margin: '12px 0' }} />
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#25B7AA' }}>
            2. 核心业务操作步骤
          </h2>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginTop: '8px' }}>
            步骤一：科室需求请领
          </h3>
          <p>
            登录SPD系统 ➔ 仓储管理 ➔ 领用申请 ➔ 新建请领单 ➔
            选择消耗模板或手动添加物料 ➔ 提交审批。
          </p>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginTop: '8px' }}>
            步骤二：出库确认与扫码消耗
          </h3>
          <p>
            一级库配货完成后，通过病区护士站扫描物料条码，进行科室扫码消耗。系统会实时核减对应二级科室库的虚拟库存，当库存低于警戒水位时，自动向一级库发起自动请领触发。
          </p>
          <Divider style={{ margin: '12px 0' }} />
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#25B7AA' }}>
            3. 常见异常与排查建议
          </h2>
          <p>
            若遇到“条码无法识别”，请核对该物料条码是否已经在主数据中关联
            UDI。若未关联，请联系主数据中心配置。
          </p>
        </div>
      );
    }
    if (doc.key === '2') {
      return (
        <div style={{ color: '#262626', fontSize: '13px', lineHeight: '1.8' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#25B7AA' }}>
            1. 供应商准入流程
          </h2>
          <p>
            规范供应商主数据及其三证（营业执照、生产许可证、经营许可证）合规校验是平台安全准入的核心防线。
          </p>
          <Divider style={{ margin: '12px 0' }} />
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#25B7AA' }}>
            2. 配送及发运单协同
          </h2>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginTop: '8px' }}>
            步骤一：合同与订单响应
          </h3>
          <p>
            医院采购中心发送采购订单 ➔ 供应商工作台接收订单 ➔ 确认价格与规格 ➔
            生成发运配送单。
          </p>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginTop: '8px' }}>
            步骤二：贴标与扫码发货
          </h3>
          <p>
            每一批配送物资必须在供应商端打印SPD系统生成的唯一防伪配送条码，并在发货时扫描条码关联配送车次。医院收货台会扫码一键确认验收。
          </p>
        </div>
      );
    }
    if (doc.key === '3') {
      return (
        <div style={{ color: '#262626', fontSize: '13px', lineHeight: '1.8' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#25B7AA' }}>
            1. 医疗高值耗材追溯 (UDI) 核心政策
          </h2>
          <p>
            全面贯彻国家药监局关于实施医疗器械唯一标识（UDI）的规定，实现医疗耗材从源头生产、中间流通至临床科室消耗的“一物一码”终身溯源管理。
          </p>
          <Divider style={{ margin: '12px 0' }} />
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#25B7AA' }}>
            2. 系统UDI解析逻辑
          </h2>
          <p>
            系统内置国家药监局数据库直连API，扫描标签条码（通常包含DI与PI）时，系统自动智能解析物料名称、生产批号、有效期及序列号，无需人工录入。
          </p>
          <Divider style={{ margin: '12px 0' }} />
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#25B7AA' }}>
            3. 临床双人核对制度
          </h2>
          <p>
            手术室高值耗材在使用给患者前，必须由巡回护士与器械护士共同在系统终端扫码核对，确认解析出的效期正常后方可计费。
          </p>
        </div>
      );
    }
    return (
      <div style={{ color: '#262626', fontSize: '13px', lineHeight: '1.8' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#25B7AA' }}>
          1. 药品业务域快速切换与主配置
        </h2>
        <p>
          药品与医用耗材在财务和流转上有不同的核算口径。系统支持通过顶栏上下文进行无感平滑切换。
        </p>
        <Divider style={{ margin: '12px 0' }} />
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#25B7AA' }}>
          2. 基础主数据配置指南
        </h2>
        <p>1. 导入药品大类（口服药、针剂、特管药、中药配方颗粒）。</p>
        <p>2. 设置各个科室药柜的基数配额库，配置低水位触发机制。</p>
        <p>3. 关联国家限价编码，保证计费合规。</p>
      </div>
    );
  };

  const columns = [
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: '100px',
      render: (val: string) => <span style={{ color: '#8c8c8c' }}>{val}</span>,
    },
    {
      title: '文档名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: '80px',
      render: (val: string) => <span style={{ color: '#8c8c8c' }}>{val}</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: '180px',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
            style={{ color: '#25B7AA', padding: 0 }}
          >
            预览
          </Button>
          <Button
            type="link"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record)}
            style={{ color: '#25B7AA', padding: 0 }}
          >
            下载
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button
        type="text"
        icon={
          <QuestionCircleOutlined
            style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.65)' }}
          />
        }
        onClick={() => setVisible(true)}
        title="帮助中心"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          color: 'inherit',
        }}
      />

      <Modal
        title="📖 SPD 系统帮助中心文档列表"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={720}
        bodyStyle={{ padding: '8px 24px 24px 24px' }}
      >
        <div
          style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '16px' }}
        >
          您可以在此预览或下载相关的系统操作指导说明手册，如有其它系统使用障碍请咨询
          SPD 现场工程师。
        </div>
        <Table
          dataSource={helpDocs}
          columns={columns}
          pagination={false}
          size="middle"
          bordered
        />
      </Modal>

      {/* 二级弹窗：预览 */}
      <Modal
        title={`👀 手册实时预览: ${previewDoc?.title}`}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            关闭预览
          </Button>,
          <Button
            key="download"
            type="primary"
            style={{ backgroundColor: '#25B7AA', borderColor: '#25B7AA' }}
            onClick={() => handleDownload(previewDoc)}
          >
            立即下载
          </Button>,
        ]}
        width={680}
        bodyStyle={{
          maxHeight: '420px',
          overflowY: 'auto',
          padding: '16px 20px',
        }}
      >
        {renderPreviewContent(previewDoc)}
      </Modal>
    </>
  );
};
