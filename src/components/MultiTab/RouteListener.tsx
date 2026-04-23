/**
 * 路由监听组件
 * 路径: src/components/MultiTab/RouteListener.tsx
 *
 * 职责：监听 umi 路由变化，自动将当前路由同步到 multiTab model。
 * 在 childrenRender 中包裹 children 时使用。
 */

import { useAppData, useIntl, useLocation, useModel } from '@umijs/max';
import { useEffect } from 'react';

interface Route {
  path?: string;
  name?: string;
  children?: Route[];
}

/**
 * 从 clientRoutes 树中按 path 查找路由名称
 */
function findRouteName(routes: Route[], pathname: string): string | undefined {
  for (const r of routes) {
    if (r.path === pathname && r.name) return r.name;
    if (r.children) {
      const found = findRouteName(r.children, pathname);
      if (found) return found;
    }
  }
  return undefined;
}

const RouteListener: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const { clientRoutes } = useAppData();
  const { syncRoute } = useModel('multiTab');

  const intl = useIntl();

  useEffect(() => {
    const { pathname } = location;
    // 跳过登录等不需要 tab 的页面
    if (pathname.startsWith('/user') || pathname === '/') return;

    const rawName = findRouteName(clientRoutes, pathname);

    // 构造国际化 ID
    const pathKey = `menu${pathname.replace(/\//g, '.')}`;
    const nameKey = rawName ? `menu.${rawName}` : '';

    // 检查 Key 是否存在于当前语言包中，避免 console 报警告
    const hasPathKey = pathKey in intl.messages;
    const hasNameKey = nameKey && nameKey in intl.messages;

    let translatedName = rawName || pathname;

    if (hasPathKey) {
      translatedName = intl.formatMessage({ id: pathKey });
    } else if (hasNameKey) {
      translatedName = intl.formatMessage({ id: nameKey });
    }

    syncRoute(pathname, translatedName);
  }, [location.pathname, clientRoutes, intl, syncRoute]);

  return <>{children}</>;
};

export default RouteListener;
