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
    // 仅传递路径，由 Model 层解析元数据决定是否显示及如何显示
    syncRoute(pathname);
  }, [location.pathname, syncRoute]);

  return <>{children}</>;
};

export default RouteListener;
