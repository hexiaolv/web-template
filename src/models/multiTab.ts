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
  const { initialState }: { initialState: any } = useModel('@@initialState');
  const { routes: allRoutes } = useAppData();

  const configHomePath: string = initialState?.settings?.homeTabPath || '/';

  // 1. 建立路由索引 Map，将查找复杂度从 O(n) 降至 O(1) [js-index-maps]
  const routesMap = useMemo(() => {
    return new Map(Object.values(allRoutes).map((r: any) => [r.path, r]));
  }, [allRoutes]);

  /**
   * 辅助：获取路由最终指向的物理信息
   */
  const getRouteInfo = useCallback(
    (path: string) => {
      // 递归处理重定向
      const findFinalPath = (p: string): string => {
        const r = routesMap.get(p);
        if (r?.redirect) return findFinalPath(r.redirect);
        return p;
      };

      const realPath = findFinalPath(path);
      const route = routesMap.get(realPath);

      return {
        path: realPath,
        file: route?.file || route?.component,
        name: route?.name,
      };
    },
    [routesMap],
  );

  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [activeKey, setActiveKey] = useState<string>('');

  // 1. 定义首页真实路径
  const homePath = getRouteInfo(configHomePath).path;

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

  // 1. 初始化首页页签
  useEffect(() => {
    const info = getRouteInfo(configHomePath);

    setTabs((prev) => {
      // 如果已经有相同文件或路径的页签，不重复添加
      if (prev.some((t) => t.file === info.file || t.path === info.path))
        return prev;

      const homeTab: TabItem = {
        path: info.path,
        file: info.file,
        title: resolveTitle(info.path, info.name),
        icon: 'HomeOutlined',
        fixed: true,
        reloadKey: 0,
      };
      return [homeTab, ...prev];
    });

    // 初始激活逻辑
    const currentPath = history.location.pathname;
    const currentInfo = getRouteInfo(currentPath);
    if (!activeKey || currentInfo.file === info.file) {
      setActiveKey(currentInfo.path);
    }
  }, [configHomePath, getRouteInfo, resolveTitle]);

  // 2. 核心：同步/开启路由
  const syncRoute = useCallback(
    (pathname: string, routeTitle?: string) => {
      const info = getRouteInfo(pathname);
      if (!info.path || info.path.startsWith('/user')) return;

      setTabs((prev) => {
        const existingIdx = prev.findIndex(
          (t) => (t.file && t.file === info.file) || t.path === info.path,
        );

        if (existingIdx > -1) {
          if (prev[existingIdx].path !== info.path) {
            const next = [...prev];
            next[existingIdx] = { ...next[existingIdx], path: info.path };
            return next;
          }
          return prev;
        }

        if (prev.length >= MAX_TABS) return prev;

        const title = routeTitle || resolveTitle(info.path, info.name);

        const newTab: TabItem = {
          path: info.path,
          file: info.file,
          title,
          reloadKey: 0,
          fixed: false, // 显式初始化 fixed 属性
        };
        // 保证添加新页签后，固定页签依然在前面
        const next = [...prev, newTab];
        return next.sort((a, b) => {
          const aFixed = !!a.fixed;
          const bFixed = !!b.fixed;
          return aFixed === bFixed ? 0 : aFixed ? -1 : 1;
        });
      });

      setActiveKey(info.path);
    },
    [getRouteInfo],
  );

  // 3. 基础操作
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
      // 保持固定页签在前的稳定排序
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
      // 切换后重新排序
      return next.sort((a, b) => {
        const aFixed = !!a.fixed;
        const bFixed = !!b.fixed;
        return aFixed === bFixed ? 0 : aFixed ? -1 : 1;
      });
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
    homePath,
  };
}
