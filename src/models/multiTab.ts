import { arrayMove } from '@dnd-kit/sortable';
import { history, useAppData, useModel } from '@umijs/max';
import { useCallback, useEffect, useMemo, useState } from 'react';

export interface TabItem {
  /** 路由路径，用于跳转 */
  path: string;
  /** 显示标题（fallback，无对应 i18n key 时使用）*/
  title: string;
  /** i18n 主 key（路径拼接，如 menu.procurement.orders.plan）*/
  titleKey?: string;
  /** i18n 备用 key（单层 name，如 menu.plan）*/
  titleKeyFallback?: string;
  /** 关联的组件文件路径，用于物理去重 */
  file?: string;
  /** 菜单图标 */
  icon?: string;
  /** 是否固定 */
  fixed?: boolean;
  /** 刷新 key */
  reloadKey?: number;
}

const MAX_TABS = 15;

export interface MultiTabModel {
  tabs: TabItem[];
  activeKey: string;
  moveTab: (activeId: string, overId: string) => void;
  openTab: (tab: Omit<TabItem, 'reloadKey'>) => void;
  switchTab: (path: string) => void;
  closeTab: (path: string) => void;
  reloadTab: (path: string) => void;
  toggleFixedTab: (path: string) => void;
  closeOtherTabs: (path: string) => void;
  closeRightTabs: (path: string) => void;
  closeAllTabs: () => void;
  syncRoute: (pathname: string, routeTitle?: string) => void;
  homePath: string;
}

export default function useMultiTab(): MultiTabModel {
  const { initialState } = useModel('@@initialState');
  const { routes: allRoutes } = useAppData();

  const configHomePath = initialState?.settings?.homeTabPath || '/';

  /**
   * 核心：获取路由最终指向的物理信息（处理重定向）
   */
  const getCanonicalInfo = useCallback(
    (path: string) => {
      const routes = Object.values(allRoutes);

      const findRoute = (p: string, visited = new Set<string>()): any => {
        if (visited.has(p)) return null;
        visited.add(p);

        // 优先匹配绝对路径
        const route = routes.find((r: any) => r.path === p);
        if (route?.redirect) return findRoute(route.redirect, visited);
        return route;
      };

      const route = findRoute(path);
      return {
        path: route?.path || path,
        file: route?.file || route?.component,
        name: route?.name,
        // 如果路由配置了 layout: false，则不显示多页签
        hideInTabs: route?.layout === false || route?.hideInTabs === true,
      };
    },
    [allRoutes],
  );

  /**
   * 辅助：计算 i18n key，不做实际翻译（避免 getIntl 时序问题）
   */
  const resolveTitle = useCallback(
    (path: string, name?: string) => {
      const routes = Object.values(allRoutes);
      const matchedRoute = routes.find((r: any) => r.path === path);
      let fullKey: string | undefined;

      if (matchedRoute) {
        const names: string[] = [];
        let current: any = matchedRoute;
        while (current) {
          if (current.name) {
            names.unshift(current.name);
          }
          const parentId = current.parentId;
          if (
            !parentId ||
            parentId === 'ant-design-pro-layout' ||
            parentId === '@@/global-layout' ||
            parentId === 'root'
          ) {
            break;
          }
          current = allRoutes[parentId];
        }
        if (names.length > 0) {
          fullKey = `menu.${names.join('.')}`;
        }
      }

      // 优先用路由关联追溯拼出的完整 key，其次退回原有纯 path 替换，最次使用单层 name key
      const pathKey = fullKey || `menu${path.replace(/\//g, '.')}`;
      const nameKey = name ? `menu.${name}` : undefined;
      return {
        // title 仅作 fallback，真正显示标题由 TabBar 的 useIntl 处理
        title: name || path.split('/').pop() || '首页',
        titleKey: pathKey,
        titleKeyFallback: nameKey,
      };
    },
    [allRoutes],
  );

  // 1. 预计算首页信息
  const homeInfo = useMemo(
    () => getCanonicalInfo(configHomePath),
    [getCanonicalInfo, configHomePath],
  );

  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [activeKey, setActiveKey] = useState<string>('');

  // 2. 初始化首页页签
  useEffect(() => {
    setTabs((prev) => {
      if (
        prev.some(
          (t) =>
            (t.file && t.file === homeInfo.file) || t.path === homeInfo.path,
        )
      ) {
        return prev;
      }

      const homeTab: TabItem = {
        path: homeInfo.path,
        file: homeInfo.file,
        title: '首页',
        titleKey: 'menu.home',
        icon: 'HomeOutlined',
        fixed: true,
        reloadKey: 0,
      };
      return [homeTab, ...prev];
    });

    // 初始激活
    const currentPath = history.location.pathname;
    const currentInfo = getCanonicalInfo(currentPath);
    if (!activeKey || currentInfo.file === homeInfo.file) {
      setActiveKey(currentInfo.path);
    }
  }, [homeInfo, getCanonicalInfo, activeKey]);

  // 3. 核心：同步路由
  const syncRoute = useCallback(
    (pathname: string, routeTitle?: string) => {
      const info = getCanonicalInfo(pathname);
      if (!info.path || info.hideInTabs) return;

      // 如果当前路由指向物理文件与首页一致，则视为首页
      const isHome = info.file && info.file === homeInfo.file;
      const targetPath = isHome ? homeInfo.path : info.path;

      setTabs((prev) => {
        const existingIdx = prev.findIndex(
          (t) => (t.file && t.file === info.file) || t.path === targetPath,
        );

        if (existingIdx > -1) {
          if (prev[existingIdx].path !== targetPath) {
            const next = [...prev];
            next[existingIdx] = { ...next[existingIdx], path: targetPath };
            return next;
          }
          return prev;
        }

        if (prev.length >= MAX_TABS) return prev;

        const { title, titleKey, titleKeyFallback } = resolveTitle(
          info.path,
          info.name,
        );
        const resolvedTitle = routeTitle || title;
        const newTab: TabItem = {
          path: targetPath,
          file: info.file,
          title: resolvedTitle,
          titleKey,
          titleKeyFallback,
          reloadKey: 0,
          fixed: false,
        };

        const next = [...prev, newTab];
        return next.sort((a, b) =>
          !!a.fixed === !!b.fixed ? 0 : a.fixed ? -1 : 1,
        );
      });

      setActiveKey(targetPath);
    },
    [homeInfo, getCanonicalInfo, resolveTitle],
  );

  const openTab = useCallback(
    (tab: Omit<TabItem, 'reloadKey'>) => {
      // 不传 routeTitle，让 syncRoute 通过 resolveTitle 统一解析 i18n key
      syncRoute(tab.path);
      history.push(tab.path);
    },
    [syncRoute],
  );

  const switchTab = useCallback((path: string) => {
    setActiveKey(path);
    history.push(path);
  }, []);

  const moveTab = useCallback((activeId: string, overId: string) => {
    setTabs((prev) => {
      const oldIndex = prev.findIndex((t) => t.path === activeId);
      const newIndex = prev.findIndex((t) => t.path === overId);
      const next = arrayMove(prev, oldIndex, newIndex);
      return [...next].sort((a, b) => {
        if (a.fixed && !b.fixed) return -1;
        if (!a.fixed && b.fixed) return 1;
        return 0;
      });
    });
  }, []);

  const toggleFixedTab = useCallback((path: string) => {
    setTabs((prev) => {
      const next = prev.map((t) =>
        t.path === path ? { ...t, fixed: !t.fixed } : t,
      );
      return next.sort((a, b) =>
        !!a.fixed === !!b.fixed ? 0 : a.fixed ? -1 : 1,
      );
    });
  }, []);

  const closeTab = useCallback(
    (path: string) => {
      setTabs((prev) => {
        const idx = prev.findIndex((t) => t.path === path);
        const next = prev.filter((t) => t.path !== path);
        if (path === activeKey && next.length > 0) {
          const nextTab = next[Math.max(0, idx - 1)];
          setActiveKey(nextTab.path);
          history.push(nextTab.path);
        }
        return next;
      });
    },
    [activeKey],
  );

  const reloadTab = useCallback((path: string) => {
    setTabs((prev) =>
      prev.map((t) =>
        t.path === path ? { ...t, reloadKey: (t.reloadKey ?? 0) + 1 } : t,
      ),
    );
  }, []);

  const closeOtherTabs = useCallback((path: string) => {
    setTabs((prev) => prev.filter((t) => t.fixed || t.path === path));
    setActiveKey(path);
    history.push(path);
  }, []);

  const closeRightTabs = useCallback(
    (path: string) => {
      setTabs((prev) => {
        const idx = prev.findIndex((t) => t.path === path);
        const filtered = prev.filter((t, i) => i <= idx || t.fixed);
        if (!filtered.map((t) => t.path).includes(activeKey)) {
          setActiveKey(path);
          history.push(path);
        }
        return filtered;
      });
    },
    [activeKey],
  );

  const closeAllTabs = useCallback(() => {
    setTabs((prev) => {
      const fixed = prev.filter((t) => t.fixed);
      if (fixed[0]) {
        setActiveKey(fixed[0].path);
        history.push(fixed[0].path);
      }
      return fixed;
    });
  }, []);

  return {
    tabs,
    activeKey,
    moveTab,
    openTab,
    switchTab,
    closeTab,
    reloadTab,
    toggleFixedTab,
    closeOtherTabs,
    closeRightTabs,
    closeAllTabs,
    syncRoute,
    homePath: homeInfo.path,
  };
}
