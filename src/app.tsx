import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history, Link, useLocation, useModel } from '@umijs/max';
import React from 'react';
import Footer from '@/components/Footer';
import { KeepAliveWrapper, RouteListener, TabBar } from '@/components/MultiTab';
import { Question, SelectLang } from '@/components/RightContent';
import {
  AvatarDropdown,
  AvatarName,
} from '@/components/RightContent/AvatarDropdown';
import { currentUser as queryCurrentUser } from '@/services/ant-design-pro/api';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';

const isDev = process.env.NODE_ENV === 'development';
const isDevOrTest = isDev || process.env.CI;
const loginPath = '/user/login';

/**
 * @see https://umijs.org/docs/api/runtime-config#getinitialstate
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings> & {
    tabsLayout?: boolean;
    homeTabPath?: string;
  };
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser({
        skipErrorHandler: true,
      });
      return msg.data;
    } catch (_error) {
      history.push(loginPath);
    }
    return undefined;
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
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
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
    actionsRender: () => [
      <Question key="doc" />,
      <SelectLang key="SelectLang" />,
    ],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    menuItemRender: (item, dom) => {
      const { path } = item;
      // 如果没有路径，直接返回 dom
      if (!path) return dom;

      // 如果禁用了多页签，返回标准的 Link 跳转
      if (!initialState?.settings?.tabsLayout) {
        return <Link to={path}>{dom}</Link>;
      }

      const MenuItemWithTab = () => {
        const { openTab } = useModel('multiTab');
        return (
          <span
            onClick={() => {
              openTab({
                path: path,
                title: item.name ?? path,
                icon: typeof item.icon === 'string' ? item.icon : undefined,
              });
            }}
            style={{ display: 'block', width: '100%', cursor: 'pointer' }}
          >
            {dom}
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
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      const isLogin = props.location?.pathname === loginPath;
      const isTabsDisabled = !initialState?.settings?.tabsLayout;

      const content =
        isLogin || isTabsDisabled ? (
          children
        ) : (
          <TabWithKeepAlive>{children}</TabWithKeepAlive>
        );

      return (
        <>
          {content}
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
