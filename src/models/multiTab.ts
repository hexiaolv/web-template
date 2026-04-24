import { arrayMove } from '@dnd-kit/sortable';
import { getIntl, history, useAppData, useModel } from '@umijs/max';
import { useCallback, useEffect, useMemo, useState } from 'react';

export interface TabItem {
  /** 路由路径，用于跳转 */
  path: string;
  /** 显示标题 */
  title: string;
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
   * 辅助：动态解析标题
   */
  const resolveTitle = useCallback((path: string, name?: string) => {
    const intl = getIntl();
    const i18nKey = name ? `menu.${name}` : `menu${path.replace(/\//g, '.')}`;
    if (i18nKey in intl.messages) {
      return intl.formatMessage({ id: i18nKey });
    }
    return name || '首页';
  }, []);

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
        title: getIntl().formatMessage({
          id: 'menu.home',
          defaultMessage: '首页',
        }),
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

        const title = routeTitle || resolveTitle(info.path, info.name);
        const newTab: TabItem = {
          path: targetPath,
          file: info.file,
          title,
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
      syncRoute(tab.path, tab.title);
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
