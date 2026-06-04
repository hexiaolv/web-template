import { HomeOutlined, SmileOutlined } from '@ant-design/icons';
import { history, useLocation } from '@umijs/max';
import { Button, Card, Result } from 'antd';
import React from 'react';

const EmptyPage: React.FC = () => {
  const location = useLocation();

  // 简易从路径中提取页面标识或做映射，但最好能获取当前路由的名字。
  // 我们直接显示一个高大上的“功能页面建设中”卡片
  return (
    <div
      style={{
        padding: '24px',
        height: '100%',
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 600,
          borderRadius: 16,
          boxShadow: '0 8px 24px rgba(37, 183, 170, 0.08)',
          border: '1px solid rgba(37, 183, 170, 0.15)',
          background: 'linear-gradient(135deg, #ffffff 0%, #f4fbfb 100%)',
          textAlign: 'center',
        }}
      >
        <Result
          icon={<SmileOutlined style={{ color: '#25B7AA', fontSize: 64 }} />}
          title={
            <span style={{ fontSize: 24, fontWeight: 600, color: '#1f1f1f' }}>
              功能正在规划建设中
            </span>
          }
          subTitle={
            <div style={{ fontSize: 14, color: '#8c8c8c', marginTop: 8 }}>
              当前访问路径：
              <code
                style={{
                  background: '#f5f5f5',
                  padding: '2px 6px',
                  borderRadius: 4,
                  color: '#25B7AA',
                  fontFamily: 'monospace',
                }}
              >
                {location.pathname}
              </code>
              <br />
              SPD供应链管理平台正为您构建专业高效的院内医用物资精细化物流闭环。
            </div>
          }
          extra={[
            <Button
              type="primary"
              key="back"
              icon={<HomeOutlined />}
              onClick={() => history.push('/dashboard/welcome')}
              style={{
                backgroundColor: '#25B7AA',
                borderColor: '#25B7AA',
                borderRadius: 8,
                height: 40,
                padding: '0 24px',
              }}
            >
              返回工作台
            </Button>,
          ]}
        />
      </Card>
    </div>
  );
};

export default EmptyPage;
