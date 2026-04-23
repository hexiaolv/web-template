/**
 * 多页签栏组件
 * 路径: src/components/MultiTab/TabBar.tsx
 *
 * 功能：
 *  - 标签滚动（溢出自动出现左右箭头，激活 tab 自动滚入视野）
 *  - 右键上下文菜单（刷新 / 关闭其他 / 关闭右侧 / 关闭全部）
 *  - 下拉列表快速切换
 *  - 固定 Tab（钉住，不可关闭）
 *  - 与 ProLayout layout 模式无关，纯 CSS 适配
 */
import {
  CloseOutlined,
  DownOutlined,
  LeftOutlined,
  ReloadOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import type { MenuProps } from 'antd';
import { Dropdown, Tooltip } from 'antd';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import type { TabItem } from '@/models/multiTab';
import styles from './TabBar.less';

// 临时解决 CSS Modules 类型同步延迟导致的 TS 报错
const s = styles as Record<string, string>;

interface TabBarProps {
  /** 注入 ProLayout 的 children，作为内容区 */
  children?: React.ReactNode;
}

import * as AntdIcons from '@ant-design/icons';

// ─── 动态渲染 Icon ────────────────────────────────────────────────────────
const renderIcon = (iconStr?: string) => {
  if (!iconStr) return null;
  const IconComponent = (AntdIcons as Record<string, any>)[iconStr];
  if (IconComponent) return <IconComponent className={s.tabIcon} />;
  return null;
};

// ─── 单个 Tab 项 ──────────────────────────────────────────────────────────────
const TabNode = memo<{
  tab: TabItem;
  isActive: boolean;
  onSwitch: (path: string) => void;
  onClose: (path: string) => void;
  onContextMenu: (e: React.MouseEvent, path: string) => void;
}>(({ tab, isActive, onSwitch, onClose, onContextMenu }) => (
  <div
    data-path={tab.path}
    className={`${s.tabItem} ${isActive ? s.active : ''}`}
    onClick={() => onSwitch(tab.path)}
    onContextMenu={(e) => {
      e.preventDefault();
      onContextMenu(e, tab.path);
    }}
  >
    {renderIcon(tab.icon)}
    <span className={s.tabTitle}>{tab.title}</span>
    {!tab.fixed && (
      <span
        className={s.closeBtn}
        onClick={(e) => {
          e.stopPropagation();
          onClose(tab.path);
        }}
      >
        <CloseOutlined style={{ fontSize: 10 }} />
      </span>
    )}
  </div>
));

// ─── 主组件 ───────────────────────────────────────────────────────────────────
const TabBar: React.FC<TabBarProps> = ({ children }) => {
  const {
    tabs,
    activeKey,
    switchTab,
    closeTab,
    reloadTab,
    closeOtherTabs,
    closeRightTabs,
    closeAllTabs,
  } = useModel('multiTab');

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [ctxMenu, setCtxMenu] = useState<{
    path: string;
    x: number;
    y: number;
  } | null>(null);

  // ─── 滚动状态检查 ────────────────────────────────────────────────────────
  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 1);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      ro.disconnect();
    };
  }, [tabs, checkScroll]);

  // ─── 激活 Tab 自动滚入视野 ───────────────────────────────────────────────
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const node = el.querySelector<HTMLElement>(`[data-path="${activeKey}"]`);
    if (!node) return;
    const { offsetLeft, offsetWidth } = node;
    const { scrollLeft, clientWidth } = el;
    if (offsetLeft < scrollLeft) {
      el.scrollTo({ left: offsetLeft - 8, behavior: 'smooth' });
    } else if (offsetLeft + offsetWidth > scrollLeft + clientWidth) {
      el.scrollTo({
        left: offsetLeft + offsetWidth - clientWidth + 8,
        behavior: 'smooth',
      });
    }
  }, [activeKey]);

  const scrollBy = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 160, behavior: 'smooth' });
  };

  // ─── 右键菜单构建 ────────────────────────────────────────────────────────
  const buildCtxItems = (path: string): MenuProps['items'] => {
    const idx = tabs.findIndex((t) => t.path === path);
    const nonFixed = tabs.filter((t) => !t.fixed);
    const hasRight = tabs.slice(idx + 1).some((t) => !t.fixed);

    return [
      {
        key: 'reload',
        icon: <ReloadOutlined />,
        label: '刷新当前标签页',
        onClick: () => reloadTab(path),
      },
      { type: 'divider' },
      {
        key: 'closeOther',
        label: '关闭其他标签页',
        disabled: nonFixed.length <= 1,
        onClick: () => closeOtherTabs(path),
      },
      {
        key: 'closeRight',
        label: '关闭右侧标签页',
        disabled: !hasRight,
        onClick: () => closeRightTabs(path),
      },
      {
        key: 'closeAll',
        label: '关闭全部标签页',
        danger: true,
        disabled: nonFixed.length === 0,
        onClick: closeAllTabs,
      },
    ];
  };

  // ─── 下拉列表 items ───────────────────────────────────────────────────────
  const dropdownItems: MenuProps['items'] = [
    {
      type: 'group',
      label: '已打开的标签页',
      children: tabs.map((t) => ({
        key: t.path,
        label: t.title,
        icon:
          t.path === activeKey ? (
            <span style={{ color: '#1677ff', fontSize: 6 }}>●</span>
          ) : undefined,
        onClick: () => switchTab(t.path),
        style:
          t.path === activeKey
            ? { color: '#1677ff', fontWeight: 500 }
            : undefined,
      })),
    },
    { type: 'divider' },
    {
      key: '__closeAll',
      label: '关闭全部标签页',
      danger: true,
      onClick: closeAllTabs,
    },
  ];

  // ─── 布局适配逻辑 ────────────────────────────────────────────────────────
  const { initialState } = useModel('@@initialState');
  const settings = initialState?.settings || {};
  const {
    layout = 'side',
    fixedHeader = false,
    contentWidth = 'Fluid',
  } = settings;

  // 根据用户需求：top 模式随页面滚动，其他（side/mix）模式吸附不滚动
  const isTop = layout === 'top';
  const isSticky = !isTop;
  const isFixed = contentWidth === 'Fixed';

  const wrapperClass = [
    s.wrapper,
    isSticky ? s.isSticky : s.isTop,
    // Mix 模式通常需要偏移避开顶部导航，Side 模式则视 fixedHeader 配置而定
    layout === 'mix' || fixedHeader ? s.hasFixedHeader : '',
  ].join(' ');

  return (
    <div className={wrapperClass}>
      {/* ── Tab 条 ─────────────────────────────────────────────────────── */}
      <div className={s.bar}>
        <div className={`${s.barInner} ${isFixed ? s.isFixed : ''}`}>
          {/* 左滚 */}
          <button
            type="button"
            className={`${s.scrollBtn} ${canLeft ? s.scrollBtnActive : ''}`}
            disabled={!canLeft}
            onClick={() => scrollBy(-1)}
          >
            <LeftOutlined />
          </button>

          {/* Tab 滚动区 */}
          <div className={s.scrollArea} ref={scrollRef}>
            {tabs.map((tab) => (
              <TabNode
                key={tab.path}
                tab={tab}
                isActive={tab.path === activeKey}
                onSwitch={switchTab}
                onClose={closeTab}
                onContextMenu={(e, path) =>
                  setCtxMenu({ path, x: e.clientX, y: e.clientY })
                }
              />
            ))}
          </div>

          {/* 右滚 */}
          <button
            type="button"
            className={`${s.scrollBtn} ${canRight ? s.scrollBtnActive : ''}`}
            disabled={!canRight}
            onClick={() => scrollBy(1)}
          >
            <RightOutlined />
          </button>

          {/* 操作区 */}
          <div className={s.actions}>
            <Tooltip title="刷新当前页">
              <button
                type="button"
                className={s.actionBtn}
                onClick={() => reloadTab(activeKey)}
              >
                <ReloadOutlined />
              </button>
            </Tooltip>

            <Dropdown
              menu={{ items: dropdownItems }}
              trigger={['click']}
              placement="bottomRight"
            >
              <button type="button" className={s.actionBtn}>
                <DownOutlined />
              </button>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* ── 右键菜单 ────────────────────────────────────────────────────── */}
      {ctxMenu && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 999 }}
            onClick={() => setCtxMenu(null)}
          />
          <div
            style={{
              position: 'fixed',
              left: ctxMenu.x,
              top: ctxMenu.y,
              zIndex: 1000,
            }}
          >
            <Dropdown
              open
              menu={{
                items: buildCtxItems(ctxMenu.path),
                onClick: () => setCtxMenu(null),
              }}
              trigger={[]}
            >
              <span />
            </Dropdown>
          </div>
        </>
      )}

      {/* ── 内容区（keep-alive 模拟：全部渲染，仅 display 切换）─────────── */}
      <div className={s.content}>{children}</div>
    </div>
  );
};

export default TabBar;
