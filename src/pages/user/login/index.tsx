import {
  ApartmentOutlined,
  GlobalOutlined,
  KeyOutlined,
  LockOutlined,
  LoginOutlined,
  MedicineBoxOutlined,
  SafetyCertificateOutlined,
  ScanOutlined,
  UserOutlined,
} from '@ant-design/icons';

const featuresData = [
  {
    icon: 'ScanOutlined',
    title: 'UDI 全程追溯',
    desc: '高值耗材一物一码，从采购到使用完整链路可追溯',
  },
  {
    icon: 'ApartmentOutlined',
    title: '多院区 · 多业务域',
    desc: '耗材与药品双域管理，院区数据独立隔离，集团统一管控',
  },
  {
    icon: 'SafetyCertificateOutlined',
    title: '三级等保 · SM2 加密',
    desc: '接口加解密，操作全审计，符合医疗行业数据安全规范',
  },
  {
    icon: 'GlobalOutlined',
    title: '供应商协同门户',
    desc: '在线对账、发货协同、证照管理，打通院内外信息流',
  },
];

import {
  LoginForm,
  ProFormCheckbox,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Helmet, SelectLang, useIntl, useModel } from '@umijs/max';
import { Alert, App, Form, Modal, Steps } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';

const mockUsers: Record<
  string,
  {
    branches: string[];
    domains: ('medicine' | 'consumable')[];
    depts: Record<string, string[]>;
    role: 'nurse' | 'head' | 'yangan' | 'admin';
    name: string;
    avatar?: string;
  }
> = {
  nurse_user: {
    branches: ['主院区'],
    domains: ['consumable'],
    depts: {
      主院区: ['ICU重症监护科'],
    },
    role: 'nurse',
    name: '李明华',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
  },
  head_user: {
    branches: ['主院区'],
    domains: ['consumable'],
    depts: {
      主院区: ['骨科手术室'],
    },
    role: 'head',
    name: '张伟',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
  },
  yangan_user: {
    branches: ['主院区'],
    domains: ['consumable'],
    depts: {
      主院区: ['ICU重症监护科', '外科病区', '妇产科病区', '全院汇总只读'],
    },
    role: 'yangan',
    name: '王红',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
  },
  admin: {
    branches: ['主院区', '东院区', '西院区'],
    domains: ['consumable', 'medicine'],
    depts: {
      主院区: ['全院'],
      东院区: ['全院'],
      西院区: ['全院'],
    },
    role: 'admin',
    name: '超级管理员(院长)',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
  },
};

import { login } from '@/services/ant-design-pro/api';
import Settings from '../../../../config/defaultSettings';

const useStyles = createStyles(({ token }) => {
  return {
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      top: 16,
      borderRadius: token.borderRadius,
      zIndex: 10,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background:
        '#f0f2f5 url(https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXqsndqijWuxCKE.svg)',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center 110px',
      backgroundSize: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: {
      display: 'flex',
      width: '1000px',
      height: '600px',
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      boxShadow: '0 16px 48px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      position: 'relative',
      zIndex: 1,
      '@media (max-width: 1024px)': {
        width: '90%',
        height: '600px',
      },
      '@media (max-width: 768px)': {
        width: '100%',
        height: '100%',
        borderRadius: 0,
      },
    },
    welcomePanel: {
      width: '440px',
      flexShrink: 0,
      background: 'linear-gradient(135deg, #25B7AA 0%, #153243 100%)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '48px 48px 36px 48px',
      '@media (max-width: 960px)': {
        display: 'none',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          'radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)',
        zIndex: 1,
      },
    },
    welcomeContent: {
      position: 'relative',
      zIndex: 2,
      color: '#ffffff',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    loginPanel: {
      flex: 1,
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
      position: 'relative',
      overflow: 'hidden',
      scrollbarWidth: 'none',
      '& .ant-pro-form-login-main': {
        width: '100% !important',
        minWidth: '100% !important',
        padding: '0 !important',
      },
      '& .ant-pro-form-login-container': {
        width: '100% !important',
        padding: '0 !important',
      },
      '& .ant-pro-form-login-page': {
        width: '100% !important',
      },
      '& .ant-form-item': {
        width: '100% !important',
      },
      '& .ant-pro-field': {
        width: '100% !important',
      },
      '&::-webkit-scrollbar': {
        display: 'none',
      },
      '& *::-webkit-scrollbar': {
        display: 'none',
      },
      '@media (max-width: 960px)': {
        padding: '32px 24px',
      },
    },
    privacyText: {
      fontSize: '12px',
      color: '#8c8c8c',
      textAlign: 'left',
      marginTop: '16px',
    },
    footerLinks: {
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
      marginTop: '40px',
      paddingTop: '0px',
      fontSize: '13px',
      color: '#8c8c8c',
      a: {
        color: '#8c8c8c',
        transition: 'color 0.3s',
        '&:hover': {
          color: '#25B7AA',
        },
      },
    },
    captchaWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px',
    },
    captchaContainer: {
      width: '120px',
      height: '40px',
      lineHeight: '40px',
      background: 'linear-gradient(135deg, #cbeeed 0%, #b2e3e0 100%)',
      color: '#157a71',
      fontWeight: 'bold',
      fontSize: '18px',
      letterSpacing: '4px',
      textAlign: 'center',
      borderRadius: '8px',
      cursor: 'pointer',
      userSelect: 'none',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
      display: 'inline-block',
      fontStyle: 'italic',
      textShadow: '1px 1px 1px rgba(255,255,255,0.8)',
    },
  };
});

const Lang = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.lang} data-lang style={{ display: 'none' }}>
      {SelectLang && <SelectLang />}
    </div>
  );
};

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 14,
      }}
      title={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const type = 'account';
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const { message } = App.useApp();
  const intl = useIntl();

  const [form] = Form.useForm();
  const [captchaText, setCaptchaText] = useState<string>('A3K7');

  // 多步流程状态
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [_usernameVal, setUsernameVal] = useState<string>('admin');
  const [matchedUser, setMatchedUser] = useState<any>(mockUsers.admin);
  const [selectedBranch, setSelectedBranch] = useState<string>('主院区');
  const [selectedDomain, setSelectedDomain] = useState<
    'medicine' | 'consumable'
  >('consumable');
  const [testAccountsVisible, setTestAccountsVisible] =
    useState<boolean>(false);
  const [helpModalVisible, setHelpModalVisible] = useState<boolean>(false);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let text = '';
    for (let i = 0; i < 4; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(text);
  };

  React.useEffect(() => {
    generateCaptcha();
  }, []);

  const getSafeRedirectUrl = (redirect: string | null): string => {
    if (!redirect?.startsWith('/')) return '/';
    if (redirect.startsWith('//')) return '/';

    try {
      const parsed = new URL(redirect, window.location.origin);
      if (parsed.origin !== window.location.origin) return '/';
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
      return '/';
    }
  };

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleFinalLogin = async (
    branch: string,
    domain: 'medicine' | 'consumable',
    dept: string,
    user: any,
  ) => {
    localStorage.setItem('currentBranch', branch);
    localStorage.setItem('currentDomain', domain);
    localStorage.setItem('currentDept', dept);
    localStorage.setItem('currentUserRole', user.role);

    const deptsOfUser = user.depts[branch] || [];
    localStorage.setItem('currentDeptList', JSON.stringify(deptsOfUser));

    const defaultCounts = {
      message: 3,
      alarm: 5,
      tasks: 7,
      warehouseAlarm: 2,
    };
    localStorage.setItem('unreadCounts', JSON.stringify(defaultCounts));

    const defaultLoginSuccessMessage = intl.formatMessage({
      id: 'pages.login.success',
      defaultMessage: '登录成功！',
    });
    message.success(defaultLoginSuccessMessage);

    await fetchUserInfo();
    flushSync(() => {
      setInitialState((s) => ({
        ...s,
        currentBranch: branch,
        currentDomain: domain,
        currentDept: dept,
        unreadCounts: defaultCounts,
      }));
    });

    const urlParams = new URL(window.location.href).searchParams;
    const redirectUrl = getSafeRedirectUrl(urlParams.get('redirect'));
    window.location.href = redirectUrl;
  };

  const handleSubmitStep = async () => {
    if (currentStep === 0) {
      try {
        const values = await form.validateFields([
          'username',
          'password',
          'captcha',
        ]);
        if (
          !values.captcha ||
          values.captcha.toLowerCase() !== captchaText.toLowerCase()
        ) {
          message.error('图形验证码输入错误，请重新输入！');
          generateCaptcha();
          return;
        }

        const userKey = values.username as keyof typeof mockUsers;
        const matched = mockUsers[userKey] || mockUsers.admin;
        setMatchedUser(matched);
        setUsernameVal(values.username);

        const msg = await login({
          username: values.username,
          password: values.password,
          type,
        });
        if (msg.status === 'ok') {
          // 判定关联院区数量
          if (matched.branches.length > 1) {
            setCurrentStep(1);
            setSelectedBranch(matched.branches[0]);
            form.setFieldsValue({ branch: matched.branches[0] });
          } else {
            const singleBranch = matched.branches[0];
            setSelectedBranch(singleBranch);

            // 判定关联业务域数量
            if (matched.domains.length > 1) {
              setCurrentStep(2);
              setSelectedDomain(matched.domains[0]);
              form.setFieldsValue({
                domain: matched.domains[0],
                dept: (matched.depts[singleBranch] || [])[0] || '全院',
              });
            } else {
              const singleDomain = matched.domains[0];
              const singleDept =
                (matched.depts[singleBranch] || [])[0] || '全院';
              handleFinalLogin(singleBranch, singleDomain, singleDept, matched);
            }
          }
        } else {
          setUserLoginState(msg);
          generateCaptcha();
        }
      } catch (_err) {
        // Validation error
      }
    } else if (currentStep === 1) {
      try {
        const values = await form.validateFields(['branch']);
        const branchVal = values.branch || selectedBranch;
        setSelectedBranch(branchVal);

        if (matchedUser.domains.length > 1) {
          setCurrentStep(2);
          setSelectedDomain(matchedUser.domains[0]);
          form.setFieldsValue({
            domain: matchedUser.domains[0],
            dept: (matchedUser.depts[branchVal] || [])[0] || '全院',
          });
        } else {
          const singleDomain = matchedUser.domains[0];
          const singleDept = (matchedUser.depts[branchVal] || [])[0] || '全院';
          handleFinalLogin(branchVal, singleDomain, singleDept, matchedUser);
        }
      } catch (_err) {}
    } else if (currentStep === 2) {
      try {
        const values = await form.validateFields(['domain', 'dept']);
        const domainVal = values.domain || selectedDomain;
        const deptVal =
          values.dept || (matchedUser.depts[selectedBranch] || [])[0] || '全院';
        handleFinalLogin(selectedBranch, domainVal, deptVal, matchedUser);
      } catch (_err) {}
    }
  };
  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: '登录页',
          })}
          {Settings.title && ` - ${Settings.title}`}
        </title>
      </Helmet>
      <Lang />
      <div className={styles.card}>
        {/* 左侧说明面板 */}
        <div className={styles.welcomePanel}>
          <div
            className={styles.welcomeContent}
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* 上部：宣传文案与胶囊标签 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '28px',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <MedicineBoxOutlined
                  style={{ fontSize: '22px', color: '#ffffff' }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}
              >
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#ffffff',
                    letterSpacing: '0.5px',
                  }}
                >
                  SPD 供应链管理平台
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.55)',
                    letterSpacing: '0.5px',
                  }}
                >
                  Medical Supply Chain Platform
                </span>
              </div>
            </div>

            <div
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: '1.35',
                marginBottom: '16px',
                letterSpacing: '1px',
              }}
            >
              <div>数字化供应链</div>
              <div>助力医院精细化管理</div>
            </div>

            <div
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.75)',
                lineHeight: '1.7',
                marginBottom: '28px',
              }}
            >
              <div>覆盖耗材采购·仓储·配送·消耗全链路</div>
              <div>多院区 SaaS 架构，满足集团化医院需求</div>
            </div>

            <div style={{ marginTop: '24px', marginBottom: '24px' }}>
              {featuresData.map((f) => {
                let IconComp = null;
                if (f.icon === 'ScanOutlined') {
                  IconComp = (
                    <ScanOutlined
                      style={{ fontSize: '18px', color: '#ffffff' }}
                    />
                  );
                } else if (f.icon === 'ApartmentOutlined') {
                  IconComp = (
                    <ApartmentOutlined
                      style={{ fontSize: '18px', color: '#ffffff' }}
                    />
                  );
                } else if (f.icon === 'SafetyCertificateOutlined') {
                  IconComp = (
                    <SafetyCertificateOutlined
                      style={{ fontSize: '18px', color: '#ffffff' }}
                    />
                  );
                } else if (f.icon === 'GlobalOutlined') {
                  IconComp = (
                    <GlobalOutlined
                      style={{ fontSize: '18px', color: '#ffffff' }}
                    />
                  );
                }

                return (
                  <div
                    key={f.title}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginBottom: '26px',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {IconComp}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '3px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#ffffff',
                        }}
                      >
                        {f.title}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.75)',
                          lineHeight: '1.4',
                        }}
                      >
                        {f.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 右侧登录表单面板 */}
        <div className={styles.loginPanel}>
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '10px',
                marginTop: '12px',
                marginBottom: '4px',
              }}
            >
              <img
                alt="logo"
                src="/images/logo2.png"
                style={{ height: '34px', objectFit: 'contain' }}
              />
              <span
                style={{
                  fontSize: '26px',
                  fontWeight: 700,
                  color: '#1a1a1a',
                  lineHeight: '34px',
                }}
              >
                欢迎登录
              </span>
            </div>
            <div
              style={{
                textAlign: 'left',
                fontSize: '13px',
                color: '#8c8c8c',
                marginBottom: '20px',
              }}
            >
              请输入您的账号密码进入工作台
            </div>
            <LoginForm
              form={form}
              contentStyle={{
                minWidth: '100%',
                maxWidth: '100%',
                width: '100%',
                marginTop: '0px',
              }}
              submitter={{
                searchConfig: {
                  submitText:
                    currentStep === 0
                      ? '验证账号'
                      : currentStep === 1
                        ? '下一步'
                        : '进入系统',
                },
                submitButtonProps: {
                  size: 'large',
                  style: {
                    width: '100%',
                    backgroundColor: '#25B7AA',
                    borderColor: '#25B7AA',
                    height: '42px',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  },
                  icon: currentStep === 2 ? <LoginOutlined /> : undefined,
                },
              }}
              initialValues={{
                autoLogin: true,
                username: 'admin',
                password: 'ant.design',
                domain: 'consumable',
              }}
              onFinish={async () => {
                await handleSubmitStep();
              }}
            >
              {status === 'error' && loginType === 'account' && (
                <LoginMessage
                  content={intl.formatMessage({
                    id: 'pages.login.accountLogin.errorMessage',
                    defaultMessage: '账户或密码错误(admin/ant.design)',
                  })}
                />
              )}

              {currentStep === 0 && (
                <>
                  <ProFormText
                    name="username"
                    formItemProps={{
                      style: { marginTop: 0, marginBottom: 20 },
                    }}
                    fieldProps={{
                      size: 'large',
                      prefix: <UserOutlined style={{ color: '#25B7AA' }} />,
                      style: { width: '100%' },
                    }}
                    placeholder="工号 / 手机号 / 邮箱"
                    rules={[
                      {
                        required: true,
                        message: '请输入用户名!',
                      },
                    ]}
                  />
                  <ProFormText.Password
                    name="password"
                    formItemProps={{
                      style: { marginBottom: 20 },
                    }}
                    fieldProps={{
                      size: 'large',
                      prefix: <LockOutlined style={{ color: '#25B7AA' }} />,
                      style: { width: '100%' },
                    }}
                    placeholder="请输入密码"
                    rules={[
                      {
                        required: true,
                        message: '请输入密码！',
                      },
                    ]}
                  />
                  {/* 验证码板块 */}
                  <div className={styles.captchaWrapper}>
                    <div style={{ flex: 1 }}>
                      <ProFormText
                        name="captcha"
                        noStyle
                        fieldProps={{
                          size: 'large',
                          prefix: <KeyOutlined style={{ color: '#25B7AA' }} />,
                          style: { width: '100%' },
                        }}
                        placeholder="请输入图形验证码"
                        rules={[
                          { required: true, message: '请输入图形验证码！' },
                        ]}
                      />
                    </div>
                    <div
                      className={styles.captchaContainer}
                      onClick={generateCaptcha}
                      title="点击刷新验证码"
                    >
                      {captchaText}
                    </div>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <ProFormCheckbox noStyle name="autoLogin">
                      <span style={{ fontSize: '13px', color: '#595959' }}>
                        记住账号
                      </span>
                    </ProFormCheckbox>
                    <a
                      style={{
                        float: 'right',
                        fontSize: '13px',
                        color: '#25B7AA',
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        message.info('请联系系统管理员或科室负责人重置密码');
                      }}
                    >
                      忘记密码？
                    </a>
                  </div>
                </>
              )}

              {currentStep === 1 && (
                <div style={{ paddingTop: '24px', paddingBottom: '36px' }}>
                  <ProFormSelect
                    name="branch"
                    label={
                      <span
                        style={{
                          fontSize: '13px',
                          color: '#595959',
                          fontWeight: 500,
                        }}
                      >
                        选择登录院区
                      </span>
                    }
                    formItemProps={{ style: { marginBottom: 16 } }}
                    options={matchedUser.branches.map((b: string) => ({
                      label: b,
                      value: b,
                    }))}
                    placeholder="请选择院区"
                    rules={[{ required: true, message: '请选择登录院区' }]}
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div style={{ paddingTop: '16px', paddingBottom: '24px' }}>
                  {matchedUser.domains.length > 1 && (
                    <ProFormRadio.Group
                      name="domain"
                      label={
                        <span
                          style={{
                            fontSize: '13px',
                            color: '#595959',
                            fontWeight: 500,
                          }}
                        >
                          选择所属业务域
                        </span>
                      }
                      radioType="button"
                      formItemProps={{ style: { marginBottom: 16 } }}
                      options={[
                        { label: '🩺 耗材业务域', value: 'consumable' },
                        { label: '💊 药品业务域', value: 'medicine' },
                      ]}
                      rules={[{ required: true, message: '请选择业务域' }]}
                    />
                  )}

                  {matchedUser.role !== 'admin' && (
                    <ProFormSelect
                      name="dept"
                      label={
                        <span
                          style={{
                            fontSize: '13px',
                            color: '#595959',
                            fontWeight: 500,
                          }}
                        >
                          归属工作科室
                        </span>
                      }
                      formItemProps={{ style: { marginBottom: 16 } }}
                      options={(matchedUser.depts[selectedBranch] || []).map(
                        (d: string) => ({
                          label: d,
                          value: d,
                        }),
                      )}
                      placeholder="请选择科室"
                      rules={[{ required: true, message: '请选择科室' }]}
                    />
                  )}

                  {matchedUser.role === 'admin' && (
                    <div
                      style={{
                        marginBottom: 20,
                        padding: '12px',
                        background: '#f5f5f5',
                        borderRadius: '8px',
                      }}
                    >
                      <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                        当前组织架构权限：
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#25B7AA',
                          marginTop: '4px',
                        }}
                      >
                        全院范围 (无需绑定特定科室)
                      </div>
                    </div>
                  )}
                </div>
              )}
            </LoginForm>

            <div className={styles.footerLinks}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setTestAccountsVisible(true);
                }}
              >
                获取测试账号
              </a>
              <span style={{ color: '#d9d9d9' }}>|</span>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setHelpModalVisible(true);
                }}
              >
                使用帮助
              </a>
              <span style={{ color: '#d9d9d9' }}>|</span>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  message.info('技术支持热线：400-888-9999');
                }}
              >
                联系我们
              </a>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="开发测试账号"
        open={testAccountsVisible}
        onOk={() => setTestAccountsVisible(false)}
        onCancel={() => setTestAccountsVisible(false)}
        okText="我知道了"
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{
          style: { backgroundColor: '#25B7AA', borderColor: '#25B7AA' },
        }}
      >
        <div style={{ padding: '12px 0' }}>
          <p style={{ color: '#8c8c8c', marginBottom: '16px' }}>
            系统提供以下不同角色的测试账号（密码统一为{' '}
            <strong>ant.design</strong>）：
          </p>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: '#f5f5f5',
                borderRadius: '6px',
              }}
            >
              <span style={{ fontWeight: 600 }}>医院院长 (超级管理员)</span>
              <code style={{ color: '#25B7AA', fontWeight: 600 }}>admin</code>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: '#f5f5f5',
                borderRadius: '6px',
              }}
            >
              <span style={{ fontWeight: 600 }}>普通护士</span>
              <code style={{ color: '#25B7AA', fontWeight: 600 }}>
                nurse_user
              </code>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: '#f5f5f5',
                borderRadius: '6px',
              }}
            >
              <span style={{ fontWeight: 600 }}>科主任</span>
              <code style={{ color: '#25B7AA', fontWeight: 600 }}>
                head_user
              </code>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: '#f5f5f5',
                borderRadius: '6px',
              }}
            >
              <span style={{ fontWeight: 600 }}>质控护士</span>
              <code style={{ color: '#25B7AA', fontWeight: 600 }}>
                yangan_user
              </code>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        title="使用帮助：系统登录流程"
        open={helpModalVisible}
        onOk={() => setHelpModalVisible(false)}
        onCancel={() => setHelpModalVisible(false)}
        okText="我知道了"
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{
          style: { backgroundColor: '#25B7AA', borderColor: '#25B7AA' },
        }}
        width={480}
      >
        <div style={{ padding: '12px 0' }}>
          <p
            style={{
              color: '#595959',
              fontSize: '13px',
              lineHeight: '1.6',
              marginBottom: '20px',
            }}
          >
            SPD
            供应链管理平台支持多院区、多业务域的集团化统筹管控。根据您的账户权限，系统将引导您完成以下登录步骤：
          </p>

          <Steps
            orientation="vertical"
            size="small"
            current={currentStep}
            items={[
              {
                title: '账号验证',
                content: '输入您的工号/手机号及密码进行身份验证',
              },
              {
                title: '选择院区',
                content: '若您的账号关联了多个院区，需选择本次登录的操作院区',
              },
              {
                title: '选择业务域及科室',
                content:
                  '选择所要进入的业务板块（耗材业务域或药品业务域）和工作科室',
              },
              {
                title: '进入工作台',
                content: '系统根据您的角色与科室加载专属菜单和管理看板',
              },
            ]}
            style={{ marginBottom: '24px' }}
          />

          <div
            style={{
              background: '#f6ffed',
              border: '1px solid #b7eb8f',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '12px',
              color: '#389e0d',
              lineHeight: '1.6',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>
              💡 智能跳过规则：
            </div>
            <div>• 仅关联 1 个院区时，系统将自动跳过步骤 ② 院区选择</div>
            <div>• 仅开通 1 个业务域时，系统将自动跳过步骤 ③ 业务选择</div>
          </div>
        </div>
      </Modal>

      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: '12px',
          color: 'rgba(0, 0, 0, 0.45)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <span>Copyright © 2026 国药控股广州有限公司</span>
        <span style={{ margin: '0 8px', color: 'rgba(0, 0, 0, 0.25)' }}>|</span>
        <span>版本号 4.0</span>
      </div>
    </div>
  );
};

export default Login;
