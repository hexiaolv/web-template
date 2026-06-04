import {
  AuditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CompassOutlined,
  HomeOutlined,
  InboxOutlined,
  PartitionOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  Empty,
  Modal,
  message,
  Row,
  Space,
  Spin,
  Tag,
} from 'antd';
import { createStyles } from 'antd-style';
import React from 'react';

const useStyles = createStyles(() => {
  return {
    tasksCard: {
      borderRadius: '12px',
      border: '1px solid #f0f0f0',
      minHeight: '480px',
    },
    listItem: {
      padding: '20px 24px',
      borderBottom: '1px solid #f0f0f0',
      transition: 'background-color 0.2s',
      '&:hover': {
        background: '#fcfcfc',
      },
    },
    taskTitle: {
      fontSize: '15px',
      fontWeight: 600,
      color: '#262626',
    },
    taskDesc: {
      fontSize: '13px',
      color: '#8c8c8c',
      margin: '8px 0',
      lineHeight: '1.6',
      background: '#f9f9f9',
      padding: '8px 12px',
      borderRadius: '6px',
    },
    metaTime: {
      fontSize: '12px',
      color: '#bfbfbf',
    },
  };
});

const TasksCenter: React.FC = () => {
  const { styles } = useStyles();
  const { initialState, setInitialState } = useModel('@@initialState');

  const currentBranch = initialState?.currentBranch || '主院区';
  const currentDomain = initialState?.currentDomain || 'consumable';
  const currentDept = initialState?.currentDept || '全院';
  const userRole = localStorage.getItem('currentUserRole') || 'admin';

  // 请求经过隔离的待办任务数据
  const {
    data: tasks = [],
    loading,
    run: refreshTasks,
  } = useRequest(
    {
      url: '/api/dashboard/tasks',
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

  // 处理待办动作 (同意/拒绝/签收)
  const handleTaskAction = (
    task: any,
    actionType: 'approve' | 'reject' | 'confirm',
  ) => {
    const actionText =
      actionType === 'approve'
        ? '审批通过'
        : actionType === 'reject'
          ? '驳回'
          : '确认签收';

    Modal.confirm({
      title: '确认进行此操作？',
      content: `您将对待办任务 [${task.id}] 执行 "${actionText}" 操作，确认后将流转至下一步。`,
      okText: '确认',
      cancelText: '取消',
      okButtonProps: {
        style: { backgroundColor: '#25B7AA', borderColor: '#25B7AA' },
      },
      onOk: async () => {
        try {
          const res = await fetch('/api/dashboard/tasks/action', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: task.id, action: actionType }),
          }).then((r) => r.json());

          if (res.success) {
            message.success(`${actionText} 处理成功！`);

            // 联动扣减全局未读计数，使侧边栏 Badge 动态减少
            if (initialState?.unreadCounts) {
              const currentCounts = { ...initialState.unreadCounts };

              // 根据处理的待办类型，动态扣减
              currentCounts.tasks = Math.max(0, currentCounts.tasks - 1);

              // 模拟消息通知一并扣减
              if (task.id === 'TSK-2026-002') {
                currentCounts.message = Math.max(0, currentCounts.message - 1);
              }
              if (task.id === 'TSK-2026-003' || task.id === 'TSK-2026-004') {
                currentCounts.alarm = Math.max(0, currentCounts.alarm - 1);
              }

              localStorage.setItem(
                'unreadCounts',
                JSON.stringify(currentCounts),
              );

              setInitialState((s: any) => ({
                ...s,
                unreadCounts: currentCounts,
              }));
            }

            // 重新请求更新列表
            refreshTasks();
          } else {
            message.error(res.message || '操作失败');
          }
        } catch (_err) {
          message.error('系统通信异常');
        }
      },
    });
  };

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
              业务过滤范围:{' '}
              <strong>
                {currentDomain === 'consumable' ? '耗材域' : '药品域'}
              </strong>
            </span>
          </Col>
          <Col span={8}>
            <span style={{ fontSize: '13px', color: '#8c8c8c' }}>
              <PartitionOutlined style={{ marginRight: 6 }} />
              归属科室: <strong>{currentDept}</strong>
            </span>
          </Col>
        </Row>
      </Card>

      <Card
        className={styles.tasksCard}
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
            <AuditOutlined style={{ color: '#25B7AA' }} />
            <span>日常待办协同任务</span>
          </div>
        }
      >
        <Spin spinning={loading}>
          {tasks.length === 0 ? (
            <div style={{ padding: '80px 0' }}>
              <Empty description="当前科室及业务域下暂无需要您处理的待办事项" />
            </div>
          ) : (
            <>
              {tasks.map((item: any) => (
                <div key={item.id} className={styles.listItem}>
                  <Row gutter={16} align="middle">
                    <Col span={18}>
                      <Space size="middle" style={{ marginBottom: 4 }}>
                        <Tag color={item.type === '审批' ? 'blue' : 'orange'}>
                          {item.type}任务
                        </Tag>
                        <span className={styles.taskTitle}>{item.title}</span>
                      </Space>
                      <div className={styles.taskDesc}>{item.desc}</div>
                      <div
                        style={{
                          display: 'flex',
                          gap: '16px',
                          fontSize: '12px',
                          color: '#8c8c8c',
                        }}
                      >
                        <span>提交人: {item.creator}</span>
                        <span>时间: {item.time}</span>
                      </div>
                    </Col>
                    <Col span={6} style={{ textAlign: 'right' }}>
                      {item.type === '审批' ? (
                        <Space>
                          <Button
                            danger
                            size="small"
                            icon={<CloseCircleOutlined />}
                            onClick={() => handleTaskAction(item, 'reject')}
                          >
                            驳回
                          </Button>
                          <Button
                            type="primary"
                            size="small"
                            icon={<CheckCircleOutlined />}
                            style={{
                              backgroundColor: '#25B7AA',
                              borderColor: '#25B7AA',
                            }}
                            onClick={() => handleTaskAction(item, 'approve')}
                          >
                            同意
                          </Button>
                        </Space>
                      ) : (
                        <Button
                          type="primary"
                          size="small"
                          icon={<InboxOutlined />}
                          style={{
                            backgroundColor: '#25B7AA',
                            borderColor: '#25B7AA',
                          }}
                          onClick={() => handleTaskAction(item, 'confirm')}
                        >
                          确认签收
                        </Button>
                      )}
                    </Col>
                  </Row>
                </div>
              ))}
            </>
          )}
        </Spin>
      </Card>
    </PageContainer>
  );
};

export default TasksCenter;
