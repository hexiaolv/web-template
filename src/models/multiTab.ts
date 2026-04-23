/**
 * 多页签全局状态模型
 * 路径: src/models/multiTab.ts
 * 使用 @umijs/max 的 useModel 驱动，自动注册为全局 model
 */

import { history } from '@umijs/max';
import { message } from 'antd';
import { useCallback, useState } from 'react';

export interface TabItem {
  /** 路由路径，作为唯一 key */
  path: string;
  /** 显示标题 */
  title: string;
  /** 菜单图标（antd icon name 或 ReactNode key） */
  icon?: string;
  /** 是否固定（不可关闭） */
  fixed?: boolean;
  /** 刷新 key，变化时强制重新挂载子组件 */
  reloadKey?: number;
}

const HOME_TAB: TabItem = {
  path: '/welcome',
  title: '工作台',
  icon: 'HomeOutlined',
  fixed: true,
};

const MAX_TABS = 15;

export default function useMultiTab() {
  const [tabs, setTabs] = useState<TabItem[]>([HOME_TAB]);
  const [activeKey, setActiveKey] = useState<string>(HOME_TAB.path);

  // ─── 打开 / 激活一个 Tab ───────────────────────────────────────────────────
  const openTab = useCallback(
    (tab: Omit<TabItem, 'reloadKey'>) => {
      const exists = tabs.find((t) => t.path === tab.path);

      if (!exists && tabs.length >= MAX_TABS) {
        message.warning(
          `最多只能打开 ${MAX_TABS} 个页签，请先关闭部分不用的页签`,
        );
        return;
      }

      setTabs((prev) => {
        if (prev.find((t) => t.path === tab.path)) return prev;
        if (prev.length >= MAX_TABS) return prev;
        return [...prev, { ...tab, reloadKey: 0 }];
      });

      setActiveKey(tab.path);
      if (history.location.pathname !== tab.path) {
        history.push(tab.path);
      }
    },
    [tabs],
  );

  // ─── 激活已有 Tab ──────────────────────────────────────────────────────────
  const switchTab = useCallback((path: string) => {
    setActiveKey(path);
    history.push(path);
  }, []);

  // ─── 关闭一个 Tab ──────────────────────────────────────────────────────────
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

  // ─── 刷新当前 Tab ──────────────────────────────────────────────────────────
  const reloadTab = useCallback((path: string) => {
    setTabs((prev) =>
      prev.map((t) =>
        t.path === path ? { ...t, reloadKey: (t.reloadKey ?? 0) + 1 } : t,
      ),
    );
  }, []);

  // ─── 关闭其他 Tab ─────────────────────────────────────────────────────────
  const closeOtherTabs = useCallback((path: string) => {
    setTabs((prev) => prev.filter((t) => t.fixed || t.path === path));
    setActiveKey(path);
    history.push(path);
  }, []);

  // ─── 关闭右侧 Tab ─────────────────────────────────────────────────────────
  const closeRightTabs = useCallback(
    (path: string) => {
      setTabs((prev) => {
        const idx = prev.findIndex((t) => t.path === path);
        return prev.filter((t, i) => i <= idx || t.fixed);
      });
      // 若当前激活在右侧，则跳回目标
      setTabs((prev) => {
        const paths = prev.map((t) => t.path);
        if (!paths.includes(activeKey)) {
          setActiveKey(path);
          history.push(path);
        }
        return prev;
      });
    },
    [activeKey],
  );

  // ─── 关闭全部（保留固定） ──────────────────────────────────────────────────
  const closeAllTabs = useCallback(() => {
    setTabs((prev) => {
      const fixed = prev.filter((t) => t.fixed);
      const firstFixed = fixed[0];
      if (firstFixed) {
        setActiveKey(firstFixed.path);
        history.push(firstFixed.path);
      }
      return fixed;
    });
  }, []);

  // ─── 路由同步：外部路由变化时自动激活对应 Tab ─────────────────────────────
  const syncRoute = useCallback(
    (pathname: string, routeTitle?: string) => {
      const exists = tabs.find((t) => t.path === pathname);

      if (!exists && routeTitle) {
        if (tabs.length >= MAX_TABS) {
          message.warning(
            `最多只能打开 ${MAX_TABS} 个页签，请先关闭部分不用的页签`,
          );
          // 撤回路由到上一个激活的页签
          if (activeKey && activeKey !== pathname) {
            history.push(activeKey);
          }
          return;
        }
      }

      setTabs((prev) => {
        if (prev.find((t) => t.path === pathname)) return prev;
        if (!routeTitle) return prev;
        if (prev.length >= MAX_TABS) return prev;
        return [...prev, { path: pathname, title: routeTitle, reloadKey: 0 }];
      });

      setActiveKey(pathname);
    },
    [tabs, activeKey],
  );

  return {
    tabs,
    activeKey,
    openTab,
    switchTab,
    closeTab,
    reloadTab,
    closeOtherTabs,
    closeRightTabs,
    closeAllTabs,
    syncRoute,
  };
}
