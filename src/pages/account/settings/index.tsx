import { SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import {
  Avatar,
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Switch,
  Tabs,
} from 'antd';
import React, { useState } from 'react';

const SettingsPage: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [loading, setLoading] = useState(false);

  const rawName = initialState?.currentUser?.name || '';
  const customName = localStorage.getItem('customUserName');
  let displayName = customName || rawName;
  let displayRole = '管理员';
  const userRole = localStorage.getItem('currentUserRole') || 'admin';
  if (userRole === 'nurse') {
    displayRole = '护士';
    if (!customName && rawName.includes('李明华')) displayName = '李明华';
  } else if (userRole === 'yangan') {
    displayRole = '质控护士';
    if (!customName && rawName.includes('王红')) displayName = '王红';
  } else if (userRole === 'head') {
    displayRole = '科主任';
    if (!customName && rawName.includes('张伟')) displayName = '张伟';
  } else {
    displayRole = '院长';
    if (!customName && (rawName.includes('超级管理员') || rawName === ''))
      displayName = '超级管理员';
  }

  const [form] = Form.useForm();

  const handleSave = async (values: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (values.name) {
        localStorage.setItem('customUserName', values.name);
        setInitialState((s) => {
          if (s?.currentUser) {
            return {
              ...s,
              currentUser: {
                ...s.currentUser,
                name: values.name,
              },
            };
          }
          return s;
        });
      }
      message.success('保存个人设置成功！');
    }, 800);
  };

  const handleTabsLayoutChange = (checked: boolean) => {
    setInitialState((s) => {
      if (s) {
        return {
          ...s,
          settings: {
            ...s.settings,
            tabsLayout: checked,
          },
        };
      }
      return s;
    });
    message.success(checked ? '已开启多页签布局模式' : '已关闭多页签布局模式');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#1f1f1f',
            margin: 0,
          }}
        >
          个人设置
        </h2>
        <span style={{ fontSize: '12px', color: '#8c8c8c' }}>
          管理您的账户基础资料和系统布局偏好
        </span>
      </div>

      <Card
        bordered={false}
        style={{
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <Tabs
          defaultActiveKey="basic"
          items={[
            {
              key: 'basic',
              label: (
                <span>
                  <UserOutlined />
                  基本设置
                </span>
              ),
              children: (
                <div
                  style={{
                    display: 'flex',
                    gap: '48px',
                    flexWrap: 'wrap',
                    paddingTop: '16px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <Form
                      form={form}
                      layout="vertical"
                      initialValues={{
                        name: displayName,
                        role: displayRole,
                        branch: initialState?.currentBranch || '主院区',
                        dept: initialState?.currentDept || '全院',
                      }}
                      onFinish={handleSave}
                    >
                      <Form.Item
                        name="name"
                        label="用户名称"
                        rules={[{ required: true, message: '请输入用户名称' }]}
                      >
                        <Input
                          placeholder="输入您的真实姓名"
                          style={{ borderRadius: '6px' }}
                        />
                      </Form.Item>
                      <Form.Item name="role" label="当前岗位/职位">
                        <Input
                          disabled
                          style={{ borderRadius: '6px', background: '#f5f5f5' }}
                        />
                      </Form.Item>
                      <Form.Item name="branch" label="关联院区">
                        <Input
                          disabled
                          style={{ borderRadius: '6px', background: '#f5f5f5' }}
                        />
                      </Form.Item>
                      <Form.Item name="dept" label="所属科室">
                        <Input
                          disabled
                          style={{ borderRadius: '6px', background: '#f5f5f5' }}
                        />
                      </Form.Item>
                      <Form.Item style={{ marginTop: '24px' }}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={loading}
                          style={{
                            borderRadius: '8px',
                            background: '#25B7AA',
                            borderColor: '#25B7AA',
                            height: '36px',
                            padding: '0 24px',
                            fontWeight: 500,
                          }}
                        >
                          保存更改
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>

                  <Divider
                    type="vertical"
                    style={{ height: 'auto', minHeight: '300px' }}
                  />

                  <div
                    style={{
                      width: '220px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Avatar
                      size={96}
                      src={initialState?.currentUser?.avatar}
                      icon={<UserOutlined />}
                      style={{
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        border: '3px solid #fff',
                        marginBottom: '16px',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#262626',
                      }}
                    >
                      {displayName}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        color: '#8c8c8c',
                        marginTop: '4px',
                      }}
                    >
                      {displayRole}
                    </span>
                  </div>
                </div>
              ),
            },
            {
              key: 'preference',
              label: (
                <span>
                  <SettingOutlined />
                  系统偏好
                </span>
              ),
              children: (
                <div style={{ paddingTop: '16px', maxWidth: '600px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 0',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#262626' }}>
                        多页签导航布局
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#8c8c8c',
                          marginTop: '2px',
                        }}
                      >
                        开启后页面顶部将显示多页签，支持快速切换打开过的模块
                      </div>
                    </div>
                    <Switch
                      checked={initialState?.settings?.tabsLayout}
                      onChange={handleTabsLayoutChange}
                      checkedChildren="开"
                      unCheckedChildren="关"
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 0',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#262626' }}>
                        固定顶栏 (Fixed Header)
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#8c8c8c',
                          marginTop: '2px',
                        }}
                      >
                        固定系统头部导航栏，方便快速切换各维度上下文
                      </div>
                    </div>
                    <Switch
                      checked={initialState?.settings?.fixedHeader}
                      onChange={(checked) => {
                        setInitialState(
                          (s) =>
                            s && {
                              ...s,
                              settings: { ...s.settings, fixedHeader: checked },
                            },
                        );
                      }}
                      checkedChildren="开"
                      unCheckedChildren="关"
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 0',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#262626' }}>
                        侧边栏固定 (Fixed Sidebar)
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#8c8c8c',
                          marginTop: '2px',
                        }}
                      >
                        固定侧边导航菜单，确保大列表滚动时导航不丢失
                      </div>
                    </div>
                    <Switch
                      checked={initialState?.settings?.fixSiderbar}
                      onChange={(checked) => {
                        setInitialState(
                          (s) =>
                            s && {
                              ...s,
                              settings: { ...s.settings, fixSiderbar: checked },
                            },
                        );
                      }}
                      checkedChildren="开"
                      unCheckedChildren="关"
                    />
                  </div>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default SettingsPage;
