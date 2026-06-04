import {
  AlertOutlined,
  CompassOutlined,
  ContainerOutlined,
  FieldTimeOutlined,
  HomeOutlined,
  PartitionOutlined,
  SafetyCertificateOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  Empty,
  message,
  Row,
  Space,
  Spin,
  Table,
  Tag,
} from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';

const useStyles = createStyles(() => {
  return {
    alarmCard: {
      borderRadius: '12px',
      border: '1px solid #f0f0f0',
      minHeight: '460px',
    },
    tableContainer: {
      padding: '0 24px 24px 24px',
    },
  };
});

const AlarmCenter: React.FC = () => {
  const { styles } = useStyles();
  const { initialState } = useModel('@@initialState');
  const [activeTab, setActiveTab] = useState<string>('all');

  const currentBranch = initialState?.currentBranch || '主院区';
  const currentDomain = initialState?.currentDomain || 'consumable';
  const currentDept = initialState?.currentDept || '全院';

  // 请求经过隔离的预警数据
  const {
    data: alarms = [],
    loading,
    refresh,
  } = useRequest(
    {
      url: '/api/dashboard/alarms',
      method: 'GET',
      params: {
        branch: currentBranch,
        domain: currentDomain,
        dept: currentDept,
      },
    },
    {
      refreshDeps: [currentBranch, currentDomain, currentDept],
    },
  );

  // 1. 根据分类筛选预警
  const getFilteredAlarms = () => {
    if (activeTab === 'all') return alarms;
    return alarms.filter((a: any) => a.category === activeTab);
  };

  const currentAlarms = getFilteredAlarms();

  // 2. 模拟处理预警动作
  const handleProcessAlarm = (record: any) => {
    const hide = message.loading(`正在为 ${record.title} 匹配处置建议...`, 1);
    setTimeout(() => {
      hide();
      if (record.category === 'stock') {
        message.success(
          '已自动向采购科/SPD总库发起补货请领指令，采购单生成中！',
        );
      } else if (record.category === 'date') {
        message.success(
          '已登记近效期预处置。已自动向全院其它活跃科室发起物资库存跨科室调拨建议！',
        );
      } else if (record.category === 'device') {
        message.success(
          '温湿度排除指令已发送！已通知设备工程科值班人员李伟前往现场核验冰箱温度。',
        );
      } else {
        message.success(
          '预警处置完毕！已向该供应商的 SCP 协同门户发送通知邮件。',
        );
      }
      refresh();
    }, 1000);
  };

  // 3. 渲染预警分类徽标
  const renderCategoryTag = (cat: string) => {
    switch (cat) {
      case 'stock':
        return <Tag color="blue">低库存水位</Tag>;
      case 'date':
        return <Tag color="orange">近效期警报</Tag>;
      case 'device':
        return <Tag color="red">冷链异常</Tag>;
      default:
        return <Tag color="purple">资质临期</Tag>;
    }
  };

  const columns = [
    {
      title: '警报类别',
      dataIndex: 'category',
      key: 'category',
      width: '120px',
      render: (cat: string) => renderCategoryTag(cat),
    },
    {
      title: '预警内容',
      dataIndex: 'title',
      key: 'title',
      fontWeight: 600,
    },
    {
      title: '详细描述',
      dataIndex: 'desc',
      key: 'desc',
      ellipsis: true,
    },
    {
      title: '级别',
      dataIndex: 'type',
      key: 'type',
      width: '90px',
      render: (val: string) => {
        if (val === 'level-1') return <Tag color="error">严重红色</Tag>;
        if (val === 'level-2') return <Tag color="warning">中度橙色</Tag>;
        return <Tag color="default">轻度黄色</Tag>;
      },
    },
    {
      title: '产生时间',
      dataIndex: 'time',
      key: 'time',
      width: '110px',
    },
    {
      title: '处置操作',
      key: 'action',
      width: '120px',
      render: (_: any, record: any) => (
        <Button
          type="primary"
          ghost
          size="small"
          style={{ borderColor: '#25B7AA', color: '#25B7AA' }}
          onClick={() => handleProcessAlarm(record)}
        >
          立即处置
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      {/* 顶栏上下文状态显示 */}
      <Card
        size="small"
        style={{
          background: 'linear-gradient(135deg, #f4fbfb 0%, #e8f7f6 100%)',
          borderRadius: '12px',
          border: '1px solid rgba(37, 183, 170, 0.2)',
          marginBottom: '20px',
        }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <span style={{ fontSize: '13px', color: '#8c8c8c' }}>
              <HomeOutlined style={{ marginRight: 6 }} />
              当前过滤院区: <strong>{currentBranch}</strong>
            </span>
          </Col>
          <Col span={8}>
            <span style={{ fontSize: '13px', color: '#8c8c8c' }}>
              <CompassOutlined style={{ marginRight: 6 }} />
              监测业务域:{' '}
              <strong>
                {currentDomain === 'consumable' ? '耗材域' : '药品域'}
              </strong>
            </span>
          </Col>
          <Col span={8}>
            <span style={{ fontSize: '13px', color: '#8c8c8c' }}>
              <PartitionOutlined style={{ marginRight: 6 }} />
              隔离科室: <strong>{currentDept}</strong>
            </span>
          </Col>
        </Row>
      </Card>

      <Card
        className={styles.alarmCard}
        styles={{ body: { padding: 0 } }}
        title={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 24px 0 24px',
            }}
          >
            <WarningOutlined style={{ color: '#ff4d4f' }} />
            <span>实时预警处置中心</span>
          </div>
        }
      >
        <div
          style={{
            padding: '0 24px',
            borderBottom: '1px solid #f0f0f0',
            marginTop: 12,
          }}
        >
          <Space size="large" style={{ marginBottom: 12 }}>
            <span
              onClick={() => setActiveTab('all')}
              style={{
                cursor: 'pointer',
                fontWeight: activeTab === 'all' ? 600 : 400,
                color: activeTab === 'all' ? '#25B7AA' : '#595959',
                borderBottom:
                  activeTab === 'all' ? '2px solid #25B7AA' : 'none',
                paddingBottom: 8,
                display: 'inline-block',
              }}
            >
              <AlertOutlined style={{ marginRight: 4 }} />
              全部预警 ({alarms.length})
            </span>
            <span
              onClick={() => setActiveTab('stock')}
              style={{
                cursor: 'pointer',
                fontWeight: activeTab === 'stock' ? 600 : 400,
                color: activeTab === 'stock' ? '#25B7AA' : '#595959',
                borderBottom:
                  activeTab === 'stock' ? '2px solid #25B7AA' : 'none',
                paddingBottom: 8,
                display: 'inline-block',
              }}
            >
              <ContainerOutlined style={{ marginRight: 4 }} />
              库存水位 (
              {alarms.filter((a: any) => a.category === 'stock').length})
            </span>
            <span
              onClick={() => setActiveTab('date')}
              style={{
                cursor: 'pointer',
                fontWeight: activeTab === 'date' ? 600 : 400,
                color: activeTab === 'date' ? '#25B7AA' : '#595959',
                borderBottom:
                  activeTab === 'date' ? '2px solid #25B7AA' : 'none',
                paddingBottom: 8,
                display: 'inline-block',
              }}
            >
              <FieldTimeOutlined style={{ marginRight: 4 }} />
              近效期 ({alarms.filter((a: any) => a.category === 'date').length})
            </span>
            <span
              onClick={() => setActiveTab('device')}
              style={{
                cursor: 'pointer',
                fontWeight: activeTab === 'device' ? 600 : 400,
                color: activeTab === 'device' ? '#25B7AA' : '#595959',
                borderBottom:
                  activeTab === 'device' ? '2px solid #25B7AA' : 'none',
                paddingBottom: 8,
                display: 'inline-block',
              }}
            >
              <WarningOutlined style={{ marginRight: 4 }} />
              冷链设备 (
              {alarms.filter((a: any) => a.category === 'device').length})
            </span>
            <span
              onClick={() => setActiveTab('cert')}
              style={{
                cursor: 'pointer',
                fontWeight: activeTab === 'cert' ? 600 : 400,
                color: activeTab === 'cert' ? '#25B7AA' : '#595959',
                borderBottom:
                  activeTab === 'cert' ? '2px solid #25B7AA' : 'none',
                paddingBottom: 8,
                display: 'inline-block',
              }}
            >
              <SafetyCertificateOutlined style={{ marginRight: 4 }} />
              资质超期 (
              {alarms.filter((a: any) => a.category === 'cert').length})
            </span>
          </Space>
        </div>

        <Spin spinning={loading}>
          <div className={styles.tableContainer}>
            {currentAlarms.length === 0 ? (
              <div style={{ padding: '60px 0' }}>
                <Empty description="当前院区和业务域下暂无对应异常警报" />
              </div>
            ) : (
              <Table
                dataSource={currentAlarms}
                columns={columns}
                pagination={false}
                rowKey="id"
                size="middle"
              />
            )}
          </div>
        </Spin>
      </Card>
    </PageContainer>
  );
};

export default AlarmCenter;
