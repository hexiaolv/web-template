import * as Icons from '@ant-design/icons';
import {
  AppstoreOutlined,
  BellOutlined,
  DownOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  HomeOutlined,
  MedicineBoxOutlined,
  PartitionOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { getIntl, history, Link, useLocation, useModel } from '@umijs/max';
import { Badge, Button, Dropdown, Popover, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import { KeepAliveWrapper, RouteListener, TabBar } from '@/components/MultiTab';
import { Question, SelectLang } from '@/components/RightContent';
import { AvatarDropdown } from '@/components/RightContent/AvatarDropdown';
import { currentUser as queryCurrentUser } from '@/services/ant-design-pro/api';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import AiAssistant from '@/components/AiAssistant';

const isDev = process.env.NODE_ENV === 'development';
const isDevOrTest = isDev || process.env.CI;
const loginPath = '/user/login';

// 独立预警中心按钮 (Popover)
const WarningButton: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const count = initialState?.unreadCounts?.alarm ?? 5;

  const content = (
    <div style={{ width: '280px', padding: '4px 0' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '14px', color: '#262626' }}>
          <WarningOutlined style={{ color: '#d46b08', marginRight: '6px' }} />
          预警信息
        </span>
        <span
          style={{
            fontSize: '12px',
            color: '#fa8c16',
            background: '#fff7e6',
            padding: '2px 8px',
            borderRadius: '10px',
          }}
        >
          {count} 条未处理
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div
          style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}
        >
          <span
            style={{
              fontSize: '11px',
              color: '#d46b08',
              background: '#fff7e6',
              padding: '1px 6px',
              borderRadius: '4px',
              fontWeight: 500,
            }}
          >
            低库存预警
          </span>
          <div
            style={{
              fontSize: '13px',
              color: '#262626',
              marginTop: '6px',
              lineHeight: '1.5',
            }}
          >
            一次性无菌手术衣库存不足，当前 12 套，低于安全线 50 套。
          </div>
          <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '4px' }}>
            5分钟前
          </div>
        </div>

        <div
          style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}
        >
          <span
            style={{
              fontSize: '11px',
              color: '#c41d7f',
              background: '#fff0f6',
              padding: '1px 6px',
              borderRadius: '4px',
              fontWeight: 500,
            }}
          >
            证照到期预警
          </span>
          <div
            style={{
              fontSize: '13px',
              color: '#262626',
              marginTop: '6px',
              lineHeight: '1.5',
            }}
          >
            北京医疗器械有限公司经营许可证 7 天后到期。
          </div>
          <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '4px' }}>
            1小时前
          </div>
        </div>

        <div style={{ paddingBottom: '4px' }}>
          <span
            style={{
              fontSize: '11px',
              color: '#389e0d',
              background: '#f6ffed',
              padding: '1px 6px',
              borderRadius: '4px',
              fontWeight: 500,
            }}
          >
            近效期预警
          </span>
          <div
            style={{
              fontSize: '13px',
              color: '#262626',
              marginTop: '6px',
              lineHeight: '1.5',
            }}
          >
            医用手套（批号 2024A012） 15 天后到期，库存 800 双。
          </div>
          <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '4px' }}>
            2小时前
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid #f0f0f0',
          paddingTop: '8px',
          marginTop: '8px',
          textAlign: 'center',
        }}
      >
        <a
          onClick={() => history.push('/dashboard/alarm')}
          style={{
            fontSize: '13px',
            color: '#25B7AA',
            fontWeight: 500,
            display: 'block',
          }}
        >
          查看全部预警
        </a>
      </div>
    </div>
  );

  return (
    <Popover content={content} trigger="click" placement="bottomRight">
      <Button
        type="text"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          color: 'inherit',
        }}
        title="预警中心"
      >
        <Badge
          dot={count > 0}
          offset={[2, -2]}
          style={{ display: 'inline-flex' }}
        >
          <WarningOutlined
            style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.65)' }}
          />
        </Badge>
      </Button>
    </Popover>
  );
};

// 独立消息中心按钮 (Popover)
const MessageButton: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const count = initialState?.unreadCounts?.message ?? 3;

  const content = (
    <div style={{ width: '280px', padding: '4px 0' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '14px', color: '#262626' }}>
          <BellOutlined style={{ color: '#1890ff', marginRight: '6px' }} />
          消息通知
        </span>
        <span
          style={{
            fontSize: '12px',
            color: '#1890ff',
            background: '#e6f7ff',
            padding: '2px 8px',
            borderRadius: '10px',
          }}
        >
          {count} 条未读
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div
          style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}
        >
          <span
            style={{
              fontSize: '11px',
              color: '#096dd9',
              background: '#e6f7ff',
              padding: '1px 6px',
              borderRadius: '4px',
              fontWeight: 500,
            }}
          >
            系统通知
          </span>
          <div
            style={{
              fontSize: '13px',
              color: '#262626',
              marginTop: '6px',
              lineHeight: '1.5',
            }}
          >
            您提交的“主院区 - 骨科手术室”消耗请领单已通过审批，请及时备货。
          </div>
          <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '4px' }}>
            10分钟前
          </div>
        </div>

        <div style={{ paddingBottom: '4px' }}>
          <span
            style={{
              fontSize: '11px',
              color: '#531dab',
              background: '#f9f0ff',
              padding: '1px 6px',
              borderRadius: '4px',
              fontWeight: 500,
            }}
          >
            通知公告
          </span>
          <div
            style={{
              fontSize: '13px',
              color: '#262626',
              marginTop: '6px',
              lineHeight: '1.5',
            }}
          >
            关于SPD平台2.0版本上线及数据库维护的通知（今晚 24:00~02:00）。
          </div>
          <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '4px' }}>
            1小时前
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid #f0f0f0',
          paddingTop: '8px',
          marginTop: '8px',
          textAlign: 'center',
        }}
      >
        <a
          onClick={() => history.push('/dashboard/message')}
          style={{
            fontSize: '13px',
            color: '#25B7AA',
            fontWeight: 500,
            display: 'block',
          }}
        >
          查看全部消息
        </a>
      </div>
    </div>
  );

  return (
    <Popover content={content} trigger="click" placement="bottomRight">
      <Button
        type="text"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          color: 'inherit',
        }}
        title="消息中心"
      >
        <Badge dot offset={[2, -2]} style={{ display: 'inline-flex' }}>
          <BellOutlined
            style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.65)' }}
          />
        </Badge>
      </Button>
    </Popover>
  );
};

// 独立全屏按钮
const FullscreenButton: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <Button
      type="text"
      icon={
        isFullscreen ? (
          <FullscreenExitOutlined
            style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.65)' }}
          />
        ) : (
          <FullscreenOutlined
            style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.65)' }}
          />
        )
      }
      onClick={toggleFullscreen}
      title={isFullscreen ? '退出全屏' : '全屏'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        color: 'inherit',
      }}
    />
  );
};

/**
 * @see https://umijs.org/docs/api/runtime-config#getinitialstate
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings> & {
    tabsLayout?: boolean;
    homeTabPath?: string;
  };
  currentUser?: API.CurrentUser;
  currentBranch?: string;
  currentDomain?: 'medicine' | 'consumable';
  currentDept?: string;
  unreadCounts?: {
    message: number;
    alarm: number;
    tasks: number;
    warehouseAlarm: number;
  };
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  collapsed?: boolean;
}> {
  const fetchUserInfo = async () => {
    try {
      if (!localStorage.getItem('currentUserRole')) {
        throw new Error('No active login session');
      }
      const msg = await queryCurrentUser({
        skipErrorHandler: true,
      });
      // 根据登录时存储的角色，重构用户信息，实现多角色模拟！
      const userRole = localStorage.getItem('currentUserRole') || 'admin';
      const customName = localStorage.getItem('customUserName');
      if (msg.data) {
        if (customName) {
          msg.data.name = customName;
        } else {
          if (userRole === 'nurse') {
            msg.data.name = '李明华 (护士)';
            msg.data.access = 'nurse';
          } else if (userRole === 'yangan') {
            msg.data.name = '王红 (质控护士)';
            msg.data.access = 'yangan';
          } else if (userRole === 'head') {
            msg.data.name = '张伟 (科主任)';
            msg.data.access = 'head';
          } else {
            msg.data.name = '超级管理员(院长)';
            msg.data.access = 'admin';
          }
        }
      }
      return msg.data;
    } catch (_error) {
      history.push(loginPath);
    }
    return undefined;
  };

  const savedBranch = localStorage.getItem('currentBranch') || '主院区';
  const savedDomain = (localStorage.getItem('currentDomain') || 'consumable') as
    | 'medicine'
    | 'consumable';
  const savedDept = localStorage.getItem('currentDept') || '全院';

  const savedCountsStr =
    typeof window !== 'undefined' ? localStorage.getItem('unreadCounts') : null;
  const unreadCounts = savedCountsStr
    ? JSON.parse(savedCountsStr)
    : {
        message: 3,
        alarm: 5,
        tasks: 7,
        warehouseAlarm: 2,
      };

  // 如果不是登录页面，执行
  const { location } = history;
  if (
    ![loginPath, '/user/register', '/user/register-result'].includes(
      location.pathname,
    )
  ) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      currentBranch: savedBranch,
      currentDomain: savedDomain,
      currentDept: savedDept,
      unreadCounts,
      settings: defaultSettings as Partial<LayoutSettings>,
      collapsed: false,
    };
  }
  return {
    fetchUserInfo,
    currentBranch: savedBranch,
    currentDomain: savedDomain,
    currentDept: savedDept,
    unreadCounts,
    settings: defaultSettings as Partial<LayoutSettings>,
    collapsed: false,
  };
}

// 提取到外部，避免在 childrenRender 中每次重新定义导致组件被卸载
const TabWithKeepAlive: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  return (
    <RouteListener>
      <TabBar>
        <KeepAliveWrapper currentPath={location.pathname}>
          {children}
        </KeepAliveWrapper>
      </TabBar>
    </RouteListener>
  );
};

export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  return {
    collapsed: initialState?.collapsed,
    headerContentRender: () => {
      const currentBranch = initialState?.currentBranch || '主院区';
      const currentDomain = initialState?.currentDomain || 'consumable';
      const currentDept = initialState?.currentDept || '全院';

      const userRole = localStorage.getItem('currentUserRole') || 'admin';

      // 联动科室主数据定义 (根据院区和业务域动态更新)
      const getDeptsForBranch = (_branch: string) => {
        if (userRole === 'admin') return ['全院'];
        if (userRole === 'nurse') return ['ICU重症监护科'];
        if (userRole === 'head') return ['骨科手术室'];
        if (userRole === 'yangan') {
          return ['ICU重症监护科', '外科病区', '妇产科病区', '全院汇总只读'];
        }
        return ['全院'];
      };

      const branchList =
        userRole === 'admin' ? ['主院区', '东院区', '西院区'] : [currentBranch];

      const depts = getDeptsForBranch(currentBranch);

      const handleBranchChange = ({ key }: { key: string }) => {
        localStorage.setItem('currentBranch', key);
        const newDepts = getDeptsForBranch(key);
        const defaultDept = newDepts[0] || '全院';
        localStorage.setItem('currentDept', defaultDept);
        localStorage.setItem('currentDeptList', JSON.stringify(newDepts));
        setInitialState((s) => ({
          ...s,
          currentBranch: key,
          currentDept: defaultDept,
        }));
      };

      const handleDomainChange = (domain: 'medicine' | 'consumable') => {
        localStorage.setItem('currentDomain', domain);
        setInitialState((s) => ({
          ...s,
          currentDomain: domain,
        }));
      };

      const handleDeptClick = ({ key }: { key: string }) => {
        localStorage.setItem('currentDept', key);
        setInitialState((s) => ({
          ...s,
          currentDept: key,
        }));
      };

      const branchMenuItems = branchList.map((b) => ({ key: b, label: b }));
      const deptMenuItems = depts.map((d) => ({ key: d, label: d }));

      return (
        <Space
          size={12}
          style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}
        >
          <span
            className="header-separator"
            style={{
              color: 'rgba(0, 0, 0, 0.15)',
              userSelect: 'none',
              padding: '0 4px',
              fontSize: '14px',
            }}
          >
            |
          </span>

          {/* 1. 院区上下文 */}
          {branchList.length > 1 ? (
            <Dropdown
              menu={{ items: branchMenuItems, onClick: handleBranchChange }}
              trigger={['click']}
            >
              <Tag
                className="header-branch-tag"
                style={{
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  borderRadius: '8px',
                  padding: '5px 12px',
                  fontWeight: 600,
                  fontSize: '13px',
                  background: '#e6f7f6',
                  border: 'none',
                  color: '#25B7AA',
                }}
              >
                <HomeOutlined style={{ color: '#25B7AA' }} />
                <span className="tag-text">{currentBranch}</span>
                <DownOutlined
                  className="tag-arrow"
                  style={{ fontSize: '10px', color: '#25B7AA' }}
                />
              </Tag>
            </Dropdown>
          ) : (
            <Tag
              className="header-branch-tag"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                borderRadius: '8px',
                padding: '5px 12px',
                fontWeight: 500,
                fontSize: '13px',
                background: '#f5f5f5',
                color: '#8c8c8c',
                border: 'none',
              }}
            >
              <HomeOutlined style={{ color: '#8c8c8c' }} />
              <span className="tag-text">{currentBranch}</span>
            </Tag>
          )}

          <span
            className="header-separator"
            style={{
              color: 'rgba(0, 0, 0, 0.15)',
              userSelect: 'none',
              padding: '0 4px',
              fontSize: '14px',
            }}
          >
            |
          </span>

          {/* 2. 业务域上下文 */}
          {userRole === 'admin' ? (
            <Dropdown
              menu={{
                items: [
                  { key: 'consumable', label: '耗材域' },
                  { key: 'medicine', label: '药品域' },
                ],
                onClick: ({ key }) =>
                  handleDomainChange(key as 'medicine' | 'consumable'),
              }}
              trigger={['click']}
            >
              <Tag
                className="header-domain-tag"
                style={{
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  borderRadius: '8px',
                  padding: '5px 12px',
                  fontWeight: 600,
                  fontSize: '13px',
                  background: '#e6f7f6',
                  border: 'none',
                  color: '#25B7AA',
                }}
              >
                {currentDomain === 'consumable' ? (
                  <AppstoreOutlined style={{ color: '#25B7AA' }} />
                ) : (
                  <MedicineBoxOutlined style={{ color: '#25B7AA' }} />
                )}
                <span className="tag-text">
                  {currentDomain === 'consumable' ? '耗材域' : '药品域'}
                </span>
                <DownOutlined
                  className="tag-arrow"
                  style={{ fontSize: '10px', color: '#25B7AA' }}
                />
              </Tag>
            </Dropdown>
          ) : (
            <Tag
              className="header-domain-tag"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                borderRadius: '8px',
                padding: '5px 12px',
                fontWeight: 500,
                fontSize: '13px',
                background: '#f5f5f5',
                color: '#8c8c8c',
                border: 'none',
              }}
            >
              {currentDomain === 'consumable' ? (
                <AppstoreOutlined style={{ color: '#8c8c8c' }} />
              ) : (
                <MedicineBoxOutlined style={{ color: '#8c8c8c' }} />
              )}
              <span className="tag-text">
                {currentDomain === 'consumable' ? '耗材域' : '药品域'}
              </span>
            </Tag>
          )}

          <span
            className="header-separator"
            style={{
              color: 'rgba(0, 0, 0, 0.15)',
              userSelect: 'none',
              padding: '0 4px',
              fontSize: '14px',
            }}
          >
            |
          </span>

          {/* 3. 科室上下文 */}
          {userRole === 'admin' ? (
            <Tag
              className="header-dept-tag"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                borderRadius: '8px',
                padding: '5px 12px',
                fontWeight: 500,
                fontSize: '13px',
                background: '#f5f5f5',
                color: '#8c8c8c',
                border: 'none',
              }}
            >
              <PartitionOutlined style={{ color: '#8c8c8c' }} />
              <span className="tag-text">全院范围</span>
            </Tag>
          ) : userRole === 'yangan' ? (
            <Dropdown
              menu={{ items: deptMenuItems, onClick: handleDeptClick }}
              trigger={['click']}
            >
              <Tag
                className="header-dept-tag"
                style={{
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  borderRadius: '8px',
                  padding: '5px 12px',
                  fontWeight: 600,
                  fontSize: '13px',
                  background: '#e6f7f6',
                  border: 'none',
                  color: '#25B7AA',
                }}
              >
                <PartitionOutlined style={{ color: '#25B7AA' }} />
                <span className="tag-text">{currentDept}</span>
                <DownOutlined
                  className="tag-arrow"
                  style={{ fontSize: '10px', color: '#25B7AA' }}
                />
              </Tag>
            </Dropdown>
          ) : (
            <Tag
              className="header-dept-tag"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                borderRadius: '8px',
                padding: '5px 12px',
                fontWeight: 500,
                fontSize: '13px',
                background: '#f5f5f5',
                color: '#8c8c8c',
                border: 'none',
              }}
            >
              <PartitionOutlined style={{ color: '#8c8c8c' }} />
              <span className="tag-text">{currentDept}</span>
            </Tag>
          )}
        </Space>
      );
    },
    actionsRender: () => [
      <WarningButton key="warning" />,
      <MessageButton key="message" />,
      <Question key="help" />,
      <FullscreenButton key="fullscreen" />,
      <SelectLang key="SelectLang" />,
      <span
        key="divider"
        style={{
          color: 'rgba(0, 0, 0, 0.15)',
          userSelect: 'none',
          margin: '0 2px',
          fontSize: '14px',
        }}
      >
        |
      </span>,
    ],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: initialState?.currentUser?.name,
      render: () => {
        const avatarUrl =
          initialState?.currentUser?.avatar ||
          'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
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

        return (
          <AvatarDropdown menu={true}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                height: '48px',
                padding: '0 2px',
              }}
            >
              <img
                src={avatarUrl}
                alt="avatar"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div
                className="header-user-info"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  lineHeight: '1.2',
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    color: 'rgba(0, 0, 0, 0.85)',
                    fontWeight: 500,
                  }}
                >
                  {displayName}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    color: 'rgba(0, 0, 0, 0.45)',
                  }}
                >
                  {displayRole}
                </span>
              </div>
            </div>
          </AvatarDropdown>
        );
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    menuItemRender: (item, dom) => {
      const { path } = item;
      if (!path) return dom;

      const displayName = item.locale
        ? getIntl().formatMessage({ id: item.locale })
        : item.name;

      let iconDom = null;
      if (item.icon) {
        if (typeof item.icon === 'string') {
          const IconComponent = (Icons as any)[item.icon];
          if (IconComponent) {
            iconDom = React.createElement(IconComponent);
          }
        } else {
          iconDom = item.icon;
        }
      }

      const isSidebarItem =
        item.pro_layout_parentKeys && item.pro_layout_parentKeys.length > 0;

      // 菜单徽标待办数定义
      const badgeMap: Record<string, number> = {
        '/dashboard/message': initialState?.unreadCounts?.message ?? 3,
        '/dashboard/alarm': initialState?.unreadCounts?.alarm ?? 5,
        '/dashboard/tasks': initialState?.unreadCounts?.tasks ?? 7,
        '/warehousing/query/alarm':
          initialState?.unreadCounts?.warehouseAlarm ?? 2,
      };

      const badgeCount = badgeMap[path];

      // 自定义不同菜单的气泡红圈色调 (参考截图风格)
      const getBadgeBgColor = (p: string) => {
        if (p === '/dashboard/tasks') return '#f5f5f5'; // 待办任务使用浅灰底
        if (p === '/dashboard/message') return '#fff1f0'; // 消息通知使用浅红底
        if (p === '/dashboard/alarm' || p === '/warehousing/query/alarm')
          return '#fff7e6'; // 预警使用浅橙底
        return '#ff4d4f';
      };

      const getBadgeTextColor = (p: string) => {
        if (p === '/dashboard/tasks') return '#595959'; // 灰色字
        if (p === '/dashboard/message') return '#ff4d4f'; // 红色字
        if (p === '/dashboard/alarm' || p === '/warehousing/query/alarm')
          return '#fa8c16'; // 橙色字
        return '#ffffff';
      };

      const badgeDom = badgeCount ? (
        <span
          style={{
            marginLeft: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: getBadgeBgColor(path),
            color: getBadgeTextColor(path),
            fontSize: '11px',
            fontWeight: 600,
            height: '16px',
            minWidth: '16px',
            padding: '0 4px',
            borderRadius: '8px',
            lineHeight: '16px',
          }}
        >
          {badgeCount}
        </span>
      ) : null;

      const finalDom = initialState?.collapsed ? (
        iconDom ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              fontSize: '16px',
            }}
          >
            {iconDom}
          </span>
        ) : (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <span className="menu-item-title-text" style={{ display: 'none' }}>
              {displayName}
            </span>
          </span>
        )
      ) : isSidebarItem && iconDom ? (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <span
            className="menu-item-icon-wrapper"
            style={{
              marginRight: 8,
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '14px',
            }}
          >
            {iconDom}
          </span>
          <span className="menu-item-title-text" style={{ flex: 1 }}>
            {displayName}
          </span>
          {badgeDom}
        </span>
      ) : (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <span className="menu-item-title-text" style={{ flex: 1 }}>
            {displayName}
          </span>
          {badgeDom}
        </span>
      );

      const handleCollapsedClick = () => {
        if (initialState?.collapsed) {
          const btn = document.querySelector('.ant-pro-sider-collapsed-button');
          if (btn) {
            (btn as HTMLElement).click();
          }
        }
      };

      if (!initialState?.settings?.tabsLayout) {
        return (
          <Link
            to={path}
            onClick={handleCollapsedClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {finalDom}
          </Link>
        );
      }

      const MenuItemWithTab = () => {
        const { openTab } = useModel('multiTab');
        return (
          <span
            onClick={() => {
              handleCollapsedClick();
              openTab({
                path: path,
                title: item.name ?? path,
                icon: typeof item.icon === 'string' ? item.icon : undefined,
              });
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              width: '100%',
              cursor: 'pointer',
            }}
          >
            {finalDom}
          </span>
        );
      };

      return <MenuItemWithTab />;
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    contentStyle: {
      padding: 0,
      margin: 0,
    },
    bgLayoutImgList: [
      {
        src: '/web-template/images/layout/bg1.webp',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: '/web-template/images/layout/bg2.webp',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: '/web-template/images/layout/bg3.webp',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: [],
    menuHeaderRender: undefined,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      const isLogin = props.location?.pathname === loginPath;
      const isTabsDisabled = !initialState?.settings?.tabsLayout;

      if (!initialState?.currentUser && !isLogin) {
        history.push(loginPath);
        return null;
      }

      const content =
        isLogin || isTabsDisabled ? (
          children
        ) : (
          <TabWithKeepAlive>{children}</TabWithKeepAlive>
        );

      return (
        <>
          {content}
          <AiAssistant />
          {isDevOrTest && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
    layout: 'mix',
    postMenuData: (menuData) => {
      if (initialState?.collapsed) {
        return (menuData || []).map((item) => ({
          ...item,
          children: undefined,
        }));
      }
      return menuData || [];
    },
    onCollapse: (collapsed: boolean) => {
      setInitialState((s) => ({ ...s, collapsed }));
    },
    menuFooterRender: (_props) => {
      if (initialState?.collapsed) {
        return (
          <div
            onClick={() => setInitialState((s) => ({ ...s, collapsed: false }))}
            style={{
              textAlign: 'center',
              padding: '16px 0',
              cursor: 'pointer',
              color: 'rgba(0, 0, 0, 0.45)',
              fontSize: '16px',
            }}
          >
            <Icons.MenuUnfoldOutlined />
          </div>
        );
      }
      return (
        <div
          onClick={() => setInitialState((s) => ({ ...s, collapsed: true }))}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 0',
            cursor: 'pointer',
            color: 'rgba(0, 0, 0, 0.45)',
            fontSize: '14px',
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
            gap: '8px',
          }}
        >
          <Icons.MenuFoldOutlined />
          <span>收起菜单</span>
        </div>
      );
    },
    menu: {
      type: 'group',
    },
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  baseURL: '',
  ...errorConfig,
};

export const locale = {
  onError: (err: any) => {
    // 过滤 i18n 翻译缺失警告，避免控制台报错噪音
    const errMsg = String(err);
    if (
      err?.code === 'MISSING_TRANSLATION' ||
      errMsg.includes('Missing message') ||
      errMsg.includes('MISSING_TRANSLATION')
    ) {
      return;
    }
    console.error(err);
  },
};
