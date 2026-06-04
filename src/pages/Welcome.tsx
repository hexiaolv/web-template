import {
  ClockCircleOutlined,
  CompassOutlined,
  DatabaseOutlined,
  DollarOutlined,
  HomeOutlined,
  PartitionOutlined,
  SafetyOutlined,
  SlidersOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import { Card, Col, Progress, Row, Spin, Table, Tag } from 'antd';
import { createStyles } from 'antd-style';
import React from 'react';

const useStyles = createStyles(() => {
  return {
    contextCard: {
      background: 'linear-gradient(135deg, #f0faf9 0%, #e6f2f0 100%)',
      borderRadius: '12px',
      border: '1px solid rgba(37, 183, 170, 0.25)',
      marginBottom: '20px',
    },
    contextItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#595959',
    },
    contextValue: {
      fontWeight: 600,
      color: '#25B7AA',
    },
    metricCard: {
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
      border: '1px solid #f0f0f0',
      transition: 'all 0.3s',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.05)',
      },
    },
    metricTitle: {
      fontSize: '13px',
      color: '#8c8c8c',
      marginBottom: '8px',
    },
    metricValue: {
      fontSize: '28px',
      fontWeight: 700,
      color: '#262626',
      lineHeight: '1.2',
    },
    metricSub: {
      fontSize: '12px',
      color: '#52c41a',
      marginTop: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
  };
});

const Welcome: React.FC = () => {
  const { styles } = useStyles();
  const { initialState } = useModel('@@initialState');

  const currentBranch = initialState?.currentBranch || '主院区';
  const currentDomain = initialState?.currentDomain || 'consumable';
  const currentDept = initialState?.currentDept || '全院';

  // 根据当前的多维度上下文动态请求 Mock 指标数据
  const { data: overview, loading } = useRequest(
    {
      url: '/api/dashboard/overview',
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

  // 1. 获取拟真周转排行表格数据 (根据业务域隔离)
  const getInventoryTurnData = () => {
    if (currentDomain === 'medicine') {
      return [
        {
          key: '1',
          name: '葡萄糖注射液 500ml',
          cat: '大输液类',
          days: 4.2,
          status: '高效周转',
          rate: 92,
        },
        {
          key: '2',
          name: '阿莫西林胶囊 0.25g',
          cat: '口服抗生素',
          days: 12.8,
          status: '周转正常',
          rate: 78,
        },
        {
          key: '3',
          name: '注射用盐酸瑞芬太尼',
          cat: '特管麻醉药',
          days: 22.5,
          status: '限额监控',
          rate: 60,
        },
        {
          key: '4',
          name: '冷藏胰岛素注射液',
          cat: '温湿度冷链药',
          days: 8.4,
          status: '重点周转',
          rate: 85,
        },
      ];
    }
    // 耗材域
    return [
      {
        key: '1',
        name: '医用外科口罩 (挂耳式)',
        cat: '普通低值耗材',
        days: 3.5,
        status: '高效周转',
        rate: 95,
      },
      {
        key: '2',
        name: '一次性无菌手术衣(大)',
        cat: '定数包耗材',
        days: 9.8,
        status: '周转正常',
        rate: 82,
      },
      {
        key: '3',
        name: '钛合金锁定骨板 4孔',
        cat: '高值跟台耗材',
        days: 45.0,
        status: '备货充足',
        rate: 45,
      },
      {
        key: '4',
        name: 'ECMO体外膜肺氧合管路',
        cat: '重症高值介入',
        days: 28.2,
        status: '安全水位',
        rate: 58,
      },
    ];
  };

  // 2. 获取科室消耗分布 (根据科室隔离)
  const getDeptConsumeData = () => {
    if (currentDept === '全院' || currentDept === '全院汇总只读') {
      return [
        { dept: 'ICU重症监护科', val: '¥48.2万', count: 1420, timely: '99.2%' },
        { dept: '骨科手术室', val: '¥85.4万', count: 980, timely: '98.8%' },
        { dept: '外科病区', val: '¥32.1万', count: 2100, timely: '99.5%' },
        { dept: '妇产科病区', val: '¥22.8万', count: 850, timely: '97.6%' },
      ];
    }
    // 单科室视角
    return [{ dept: currentDept, val: '¥28.4万', count: 680, timely: '99.4%' }];
  };

  return (
    <PageContainer>
      <Spin spinning={loading}>
        {/* SPD 运行时状态看板 */}
        <Card className={styles.contextCard}>
          <Row gutter={24} align="middle">
            <Col xs={24} sm={8}>
              <div className={styles.contextItem}>
                <HomeOutlined style={{ color: '#25B7AA', fontSize: '16px' }} />
                <span>当前分析院区:</span>
                <span className={styles.contextValue}>{currentBranch}</span>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className={styles.contextItem}>
                <CompassOutlined
                  style={{ color: '#25B7AA', fontSize: '16px' }}
                />
                <span>监测业务域:</span>
                <span className={styles.contextValue}>
                  {currentDomain === 'consumable'
                    ? '🩺 医用耗材业务'
                    : '💊 药品/制剂业务'}
                </span>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className={styles.contextItem}>
                <PartitionOutlined
                  style={{ color: '#25B7AA', fontSize: '16px' }}
                />
                <span>统计科室范围:</span>
                <span className={styles.contextValue}>{currentDept}</span>
              </div>
            </Col>
          </Row>
        </Card>

        {/* 核心运营指标卡 */}
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col xs={24} sm={8}>
            <Card className={styles.metricCard}>
              <div className={styles.metricTitle}>
                <DollarOutlined style={{ marginRight: 6, color: '#1890ff' }} />
                本月物资领用总值
              </div>
              <div className={styles.metricValue}>
                {overview?.totalSpend || '¥0.00'}
              </div>
              <div className={styles.metricSub}>
                <span>较上月同期: +4.2%</span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className={styles.metricCard}>
              <div className={styles.metricTitle}>
                <ClockCircleOutlined
                  style={{ marginRight: 6, color: '#52c41a' }}
                />
                二级临床库房周转天数
              </div>
              <div className={styles.metricValue}>
                {overview?.turnDays || 0} 天
              </div>
              <div className={styles.metricSub} style={{ color: '#ff4d4f' }}>
                <span>周转率较上周加速：-0.8 天</span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className={styles.metricCard}>
              <div className={styles.metricTitle}>
                <SafetyOutlined style={{ marginRight: 6, color: '#fa8c16' }} />
                科室请领配发满意度
              </div>
              <div className={styles.metricValue}>
                {overview?.SatisfactionRate || 0}%
              </div>
              <div className={styles.metricSub}>
                <span>物流履约配送及时率保持极优</span>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 中间看板区域 */}
        <Row gutter={24}>
          <Col xs={24} md={14}>
            <Card
              title={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '15px',
                    fontWeight: 600,
                  }}
                >
                  <SlidersOutlined style={{ color: '#1890ff' }} />
                  <span>科室领用及配发实效监测</span>
                </div>
              }
              extra={<Tag color="processing">院内流转监控</Tag>}
              style={{ marginBottom: '24px', minHeight: '360px' }}
            >
              <div
                style={{ marginBottom: 12, fontSize: '13px', color: '#8c8c8c' }}
              >
                实时监测二级库房的领用总值与配送实效（根据您切换的科室权限进行隔离展示）：
              </div>
              <Table
                dataSource={getDeptConsumeData()}
                rowKey="dept"
                pagination={false}
                size="small"
                columns={[
                  { title: '临床病区科室', dataIndex: 'dept', key: 'dept' },
                  { title: '本月领用金额', dataIndex: 'val', key: 'val' },
                  { title: '消耗物资件数', dataIndex: 'count', key: 'count' },
                  {
                    title: '配送及时率',
                    dataIndex: 'timely',
                    key: 'timely',
                    render: (text) => (
                      <span style={{ fontWeight: 600, color: '#52c41a' }}>
                        {text}
                      </span>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>

          <Col xs={24} md={10}>
            <Card
              title={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '15px',
                    fontWeight: 600,
                  }}
                >
                  <DatabaseOutlined style={{ color: '#52c41a' }} />
                  <span>重点物资库存周转与周转率监测</span>
                </div>
              }
              extra={<Tag color="success">周转率分析</Tag>}
              style={{ marginBottom: '24px', minHeight: '360px' }}
            >
              <div
                style={{ marginBottom: 12, fontSize: '13px', color: '#8c8c8c' }}
              >
                展示当前业务域下常用物资的平均周转天数和库存健康度：
              </div>
              <Table
                dataSource={getInventoryTurnData()}
                rowKey="key"
                pagination={false}
                size="small"
                columns={[
                  {
                    title: '规格品名',
                    dataIndex: 'name',
                    key: 'name',
                    ellipsis: true,
                  },
                  {
                    title: '平均周转天数',
                    dataIndex: 'days',
                    key: 'days',
                    render: (val) => `${val} 天`,
                  },
                  {
                    title: '健康指数',
                    key: 'rate',
                    render: (_, record) => (
                      <div style={{ width: '80px' }}>
                        <Progress
                          percent={record.rate}
                          size="small"
                          strokeColor={record.rate > 80 ? '#52c41a' : '#fa8c16'}
                        />
                      </div>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>
      </Spin>
    </PageContainer>
  );
};

export default Welcome;
