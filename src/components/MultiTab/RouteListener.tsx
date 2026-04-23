/**
 * 路由监听组件
 * 路径: src/components/MultiTab/RouteListener.tsx
 *
 * 职责：监听 umi 路由变化，自动将当前路由同步到 multiTab model。
 * 优化：将复杂的标题解析逻辑移至 Model 层，实现轻量化监听。
 */

import { useLocation, useModel } from '@umijs/max';
import { useEffect } from 'react';

const RouteListener: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const { syncRoute } = useModel('multiTab');

  useEffect(() => {
    const { pathname } = location;
    // 跳过登录等不需要 tab 的页面
    if (pathname.startsWith('/user')) return;

    // 仅传递路径，由 Model 层通过索引 Map 高效解析物理文件及标题
    syncRoute(pathname);
  }, [location.pathname, syncRoute]);

  return <>{children}</>;
};

export default RouteListener;
