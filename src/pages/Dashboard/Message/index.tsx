import {
  BellOutlined,
  CalendarOutlined,
  CompassOutlined,
  HomeOutlined,
  NotificationOutlined,
  PartitionOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import { Badge, Card, Col, Empty, List, Row, Space, Spin, Tabs } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';

const useStyles = createStyles(() => {
  return {
    msgCard: {
      borderRadius: '12px',
      border: '1px solid #f0f0f0',
      minHeight: '480px',
    },
    listItem: {
      padding: '16px 24px',
      borderBottom: '1px solid #f0f0f0',
      transition: 'background-color 0.2s',
      cursor: 'pointer',
      '&:hover': {
        background: '#f9f9f9',
      },
    },
    metaTitle: {
      fontSize: '14px',
      fontWeight: 600,
      color: '#262626',
    },
    metaTime: {
      fontSize: '12px',
      color: '#bfbfbf',
    },
    metaContent: {
      fontSize: '13px',
      color: '#595959',
      marginTop: '8px',
      lineHeight: '1.6',
    },
  };
});

const MessageCenter: React.FC = () => {
  const { styles } = useStyles();
  const { initialState } = useModel('@@initialState');
  const [activeTab, setActiveTab] = useState<string>('all');

  const currentBranch = initialState?.currentBranch || '主院区';
  const currentDomain = initialState?.currentDomain || 'consumable';
  const currentDept = initialState?.currentDept || '全院';
  const userRole = localStorage.getItem('currentUserRole') || 'admin';

  // 请求经过隔离的消息数据
  const { data: messages = [], loading } = useRequest(
    {
      url: '/api/dashboard/messages',
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

  // 1. 过滤消息分类
  const getFilteredMessages = () => {
    if (activeTab === 'all') return messages;
    return messages.filter((m: any) => m.category === activeTab);
  };

  const currentList = getFilteredMessages();

  // 2. 渲染消息的状态图标
  const renderMessageIcon = (category: string) => {
    if (category === 'system') {
      return (
        <span
          style={{
            background: '#f9f0ff',
            color: '#722ed1',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <NotificationOutlined style={{ fontSize: '18px' }} />
        </span>
      );
    }
    return (
      <span
        style={{
          background: '#e6f7ff',
          color: '#1890ff',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <BellOutlined style={{ fontSize: '18px' }} />
      </span>
    );
  };

  return (
    <PageContainer>
      {/* 顶层上下文状态隔离提示 */}
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
              消息隔离院区: <strong>{currentBranch}</strong>
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
              接收科室: <strong>{currentDept}</strong>
            </span>
          </Col>
        </Row>
      </Card>

      <Card className={styles.msgCard} bodyStyle={{ padding: 0 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarStyle={{
            padding: '0 24px',
            margin: 0,
            borderBottom: '1px solid #f0f0f0',
          }}
          items={[
            {
              key: 'all',
              label: (
                <Space size={4}>
                  <span>全部消息</span>
                  <Badge
                    count={currentList.length}
                    showZero
                    overflowCount={9}
                    style={{ backgroundColor: '#1890ff' }}
                  />
                </Space>
              ),
            },
            {
              key: 'system',
              label: (
                <Space size={4}>
                  <span>系统公告</span>
                  <Badge
                    count={
                      messages.filter((m: any) => m.category === 'system')
                        .length
                    }
                    showZero
                    style={{ backgroundColor: '#722ed1' }}
                  />
                </Space>
              ),
            },
            {
              key: 'biz',
              label: (
                <Space size={4}>
                  <span>业务协同</span>
                  <Badge
                    count={
                      messages.filter((m: any) => m.category === 'biz').length
                    }
                    showZero
                    style={{ backgroundColor: '#25B7AA' }}
                  />
                </Space>
              ),
            },
          ]}
        />

        <Spin spinning={loading}>
          {currentList.length === 0 ? (
            <div style={{ padding: '80px 0' }}>
              <Empty description="暂无符合当前权限隔离口径的公告或通知" />
            </div>
          ) : (
            <List
              dataSource={currentList}
              renderItem={(item: any) => (
                <div className={styles.listItem}>
                  <Row gutter={16} align="middle">
                    <Col span={2}>{renderMessageIcon(item.category)}</Col>
                    <Col span={22}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span className={styles.metaTitle}>{item.title}</span>
                        <span className={styles.metaTime}>
                          <CalendarOutlined style={{ marginRight: 4 }} />
                          {item.time}
                        </span>
                      </div>
                      <div className={styles.metaContent}>{item.content}</div>
                    </Col>
                  </Row>
                </div>
              )}
            />
          )}
        </Spin>
      </Card>
    </PageContainer>
  );
};

export default MessageCenter;
