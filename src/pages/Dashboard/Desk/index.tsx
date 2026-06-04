import {
  AuditOutlined,
  CalendarOutlined,
  FileTextOutlined,
  HistoryOutlined,
  InboxOutlined,
  ScanOutlined,
  ShoppingCartOutlined,
  SlidersOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, useModel, useRequest } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  Divider,
  Progress,
  Row,
  Spin,
  Statistic,
} from 'antd';
import { createStyles } from 'antd-style';
import React from 'react';

const useStyles = createStyles(() => {
  return {
    welcomeBanner: {
      background: 'linear-gradient(135deg, #25B7AA 0%, #1d9388 100%)',
      borderRadius: '12px',
      padding: '24px',
      color: '#ffffff',
      marginBottom: '20px',
    },
    actionCard: {
      borderRadius: '12px',
      border: '1px solid #f0f0f0',
      marginBottom: '20px',
    },
    actionItem: {
      textAlign: 'center',
      padding: '16px 8px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      background: '#fafafa',
      border: '1px solid #f0f0f0',
      '&:hover': {
        background: '#e6f7f6',
        borderColor: '#25B7AA',
        transform: 'translateY(-2px)',
      },
    },
    actionIcon: {
      fontSize: '24px',
      color: '#25B7AA',
      marginBottom: '8px',
      display: 'block',
    },
    actionText: {
      fontSize: '13px',
      color: '#595959',
      fontWeight: 500,
    },
  };
});

const Desk: React.FC = () => {
  const { styles } = useStyles();
  const { initialState } = useModel('@@initialState');

  const currentBranch = initialState?.currentBranch || '主院区';
  const currentDomain = initialState?.currentDomain || 'consumable';
  const currentDept = initialState?.currentDept || '全院';

  const userRole = localStorage.getItem('currentUserRole') || 'admin';
  const userName = initialState?.currentUser?.name || '用户';

  // 请求工作台的差异化指标
  const { data: deskData, loading } = useRequest(
    {
      url: '/api/dashboard/desk',
      method: 'GET',
      params: {
        branch: currentBranch,
        domain: currentDomain,
        dept: currentDept,
        role: userRole,
      },
    },
    {
      refreshDeps: [currentBranch, currentDomain, currentDept, userRole],
    },
  );

  // 1. 获取对应角色的专属快捷操作入口
  const getQuickActions = () => {
    switch (userRole) {
      case 'nurse':
        return [
          {
            icon: <ScanOutlined />,
            text: '病区扫码消耗',
            path: '/trace/dept-store/record',
          },
          {
            icon: <ShoppingCartOutlined />,
            text: '新建领用请领',
            path: '/distribution/deliver/request',
          },
          {
            icon: <InboxOutlined />,
            text: '在途配送签收',
            path: '/distribution/deliver/tasks',
          },
          {
            icon: <HistoryOutlined />,
            text: '科室消耗流水',
            path: '/trace/dept-store/record',
          },
        ];
      case 'head':
        return [
          {
            icon: <AuditOutlined />,
            text: '领用申请审批',
            path: '/dashboard/tasks',
          },
          {
            icon: <SlidersOutlined />,
            text: '超额限额审批',
            path: '/dashboard/tasks',
          },
          {
            icon: <FileTextOutlined />,
            text: '科室消耗分析',
            path: '/finance/analysis-c/ratio',
          },
          {
            icon: <CalendarOutlined />,
            text: '报损计划审核',
            path: '/dashboard/tasks',
          },
        ];
      case 'yangan':
        return [
          {
            icon: <WarningOutlined />,
            text: '效期预处理',
            path: '/dashboard/alarm',
          },
          {
            icon: <SlidersOutlined />,
            text: '温湿度冷链点检',
            path: '/warehousing/setup/temp',
          },
          {
            icon: <HistoryOutlined />,
            text: '不合理消耗质控',
            path: '/trace/dept-store/record',
          },
          {
            icon: <AuditOutlined />,
            text: '召回发起',
            path: '/dashboard/tasks',
          },
        ];
      default:
        // admin
        return [
          {
            icon: <ShoppingCartOutlined />,
            text: '全院采购统筹',
            path: '/procurement/orders/list',
          },
          {
            icon: <AuditOutlined />,
            text: '结算异议核对',
            path: '/finance/reconcile/statement',
          },
          {
            icon: <FileTextOutlined />,
            text: '供应商资质准入',
            path: '/base/supplier/certs',
          },
          {
            icon: <SlidersOutlined />,
            text: '仓储温湿预警',
            path: '/dashboard/alarm',
          },
        ];
    }
  };

  // 2. 获取当前角色关联的核心待办提纲
  const getDeskTasks = () => {
    if (userRole === 'nurse') {
      return [
        {
          id: '1',
          title: '科室配送单 DEL-0603-041 待签收',
          time: '10分钟前',
          type: '签收',
        },
        {
          id: '2',
          title: 'ICU重症监护科 呼吸机管路 低库存预警',
          time: '5分钟前',
          type: '补货',
        },
      ];
    }
    if (userRole === 'head') {
      return [
        {
          id: '1',
          title: '护士张美玲提交的 骨科请领单 REQ-0603-018 待审批',
          time: '14:20',
          type: '审批',
        },
        {
          id: '2',
          title: '耗材报损单 LD-0527-003 待审批',
          time: '11:15',
          type: '审批',
        },
      ];
    }
    if (userRole === 'yangan') {
      return [
        {
          id: '1',
          title: '特管麻醉药品超额领用申请 REQ-0603-022 待复核',
          time: '15:25',
          type: '复核',
        },
        {
          id: '2',
          title: '外科病区2号医用冰箱 HMD-012 温度异常待排除',
          time: '15:30',
          type: '排查',
        },
      ];
    }
    // admin
    return [
      {
        id: '1',
        title: '结算对账单 5月份结算异议 待审确认',
        time: '昨日',
        type: '对账',
      },
      {
        id: '2',
        title: '有 12 笔在途配送发货单 待主库验收',
        time: '今日',
        type: '验收',
      },
    ];
  };

  return (
    <PageContainer>
      <Spin spinning={loading}>
        {/* Banner 问候 */}
        <div className={styles.welcomeBanner}>
          <h2
            style={{
              color: '#ffffff',
              margin: 0,
              fontSize: '20px',
              fontWeight: 600,
            }}
          >
            工作台，您好：{userName}
          </h2>
          <p style={{ margin: '8px 0 0 0', opacity: 0.85, fontSize: '13px' }}>
            系统检测到您当前登录的是 {currentBranch} - {currentDept} (
            {currentDomain === 'consumable' ? '耗材域' : '药品域'}
            )。欢迎进入您的专属业务协同工作面板。
          </p>
        </div>

        {/* 核心指标值 */}
        <Card
          className={styles.actionCard}
          title="业务指标总览"
          size="small"
          style={{ marginBottom: '20px' }}
        >
          <Row gutter={24}>
            {(deskData?.metrics?.items || []).map((it: any) => (
              <Col xs={12} sm={6} key={it.label}>
                <Statistic title={it.label} value={it.value} />
              </Col>
            ))}
          </Row>
        </Card>

        {/* 快捷操作入口 */}
        <Card
          className={styles.actionCard}
          title="日常核心业务快捷通道"
          size="small"
        >
          <Row gutter={16}>
            {getQuickActions().map((act) => (
              <Col xs={12} sm={6} key={act.text}>
                <div
                  className={styles.actionItem}
                  onClick={() => history.push(act.path)}
                >
                  <span className={styles.actionIcon}>{act.icon}</span>
                  <span className={styles.actionText}>{act.text}</span>
                </div>
              </Col>
            ))}
          </Row>
        </Card>

        {/* 两列布局：待办摘要与统计看板 */}
        <Row gutter={24}>
          <Col xs={24} md={14}>
            <Card
              title="当前核心待处理事项摘要"
              size="small"
              extra={
                <Button
                  type="link"
                  onClick={() => history.push('/dashboard/tasks')}
                  style={{ color: '#25B7AA' }}
                >
                  进入待办中心
                </Button>
              }
              style={{ minHeight: '300px', marginBottom: '20px' }}
            >
              {getDeskTasks().map((item) => (
                <div
                  key={item.title}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500 }}>{item.title}</div>
                    <div
                      style={{
                        color: '#8c8c8c',
                        fontSize: '12px',
                        marginTop: 4,
                      }}
                    >
                      发起时间: {item.time}
                    </div>
                  </div>
                  <Button
                    type="primary"
                    ghost
                    size="small"
                    style={{ borderColor: '#25B7AA', color: '#25B7AA' }}
                    onClick={() => history.push('/dashboard/tasks')}
                  >
                    去{item.type}
                  </Button>
                </div>
              ))}
            </Card>
          </Col>

          <Col xs={24} md={10}>
            <Card
              title="科室资源消耗及配额控制"
              size="small"
              style={{ minHeight: '300px', marginBottom: '20px' }}
            >
              {userRole === 'head' || userRole === 'nurse' ? (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        fontSize: '13px',
                      }}
                    >
                      <span>本月消耗预算额进度</span>
                      <span style={{ fontWeight: 600, color: '#ff4d4f' }}>
                        ¥14.8万 / ¥18.0万
                      </span>
                    </div>
                    <Progress percent={82} strokeColor="#ff4d4f" />
                  </div>
                  <Divider style={{ margin: '16px 0' }} />
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#8c8c8c',
                      lineHeight: 1.6,
                    }}
                  >
                    <strong>预算控制预警说明：</strong>
                    <br />
                    当前科室本月消耗已达本月度软控制限额的 82%，当达到 95%
                    时，后续的非急救急需请领单在提交时将强制触发特批会签审批流。
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        fontSize: '13px',
                      }}
                    >
                      <span>全院一级库储备健康水位</span>
                      <span style={{ fontWeight: 600, color: '#52c41a' }}>
                        92% 绿区
                      </span>
                    </div>
                    <Progress percent={92} strokeColor="#52c41a" />
                  </div>
                  <Divider style={{ margin: '16px 0' }} />
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#8c8c8c',
                      lineHeight: 1.6,
                    }}
                  >
                    <strong>全院主库房健康度说明：</strong>
                    <br />
                    当前全院药品与耗材周转指数运行平稳，无严重呆滞及断供风险。供应商准时供货率（OTIF）维持在
                    98.4% 的高水平区间。
                  </div>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Spin>
    </PageContainer>
  );
};

export default Desk;
