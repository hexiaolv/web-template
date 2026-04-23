/**
 * 多页签栏组件
 * 路径: src/components/MultiTab/TabBar.tsx
 */
import {
  CloseOutlined,
  DownOutlined,
  LeftOutlined,
  PushpinFilled,
  PushpinOutlined,
  ReloadOutlined,
  RightOutlined,
} from '@ant-design/icons';
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import {
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useModel } from '@umijs/max';
import type { MenuProps } from 'antd';
import { Dropdown, Tooltip } from 'antd';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { TabItem } from '@/models/multiTab';
import styles from './TabBar.less';

const s = styles as Record<string, string>;

interface TabBarProps {
  children?: React.ReactNode;
}

import * as AntdIcons from '@ant-design/icons';

const renderIcon = (iconStr?: string) => {
  if (!iconStr) return null;
  const IconComponent = (AntdIcons as Record<string, any>)[iconStr];
  if (IconComponent) return <IconComponent className={s.tabIcon} />;
  return null;
};

// ─── 可拖拽的 Tab 项 ────────────────────────────────────────────────────────
const SortableTab = memo<{
  tab: TabItem;
  isActive: boolean;
  onSwitch: (path: string) => void;
  onClose: (path: string) => void;
  onContextMenu: (e: React.MouseEvent, path: string) => void;
  isHome?: boolean;
}>(({ tab, isActive, onSwitch, onClose, onContextMenu, isHome }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: tab.path,
    disabled: tab.fixed, // 禁止拖拽固定页签
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-path={tab.path}
      className={`${s.tabItem} ${isActive ? s.active : ''} ${isDragging ? s.dragging : ''}`}
      onClick={() => onSwitch(tab.path)}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(e, tab.path);
      }}
    >
      {renderIcon(tab.icon)}
      <span className={s.tabTitle}>
        {tab.fixed && !isHome && (
          <PushpinFilled
            style={{ fontSize: 10, marginRight: 4, color: '#1890ff' }}
          />
        )}
        {tab.title}
      </span>
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
  );
});

const TabBar: React.FC<TabBarProps> = ({ children }) => {
  const {
    tabs,
    activeKey,
    moveTab,
    switchTab,
    closeTab,
    reloadTab,
    toggleFixedTab,
    closeOtherTabs,
    closeRightTabs,
    closeAllTabs,
    homePath,
  } = useModel('multiTab');

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [ctxMenu, setCtxMenu] = useState<{
    path: string;
    x: number;
    y: number;
  } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  // 1. 缓存右键菜单项 [rerender-memo]
  const contextMenuItems = useMemo(() => {
    if (!ctxMenu) return [];

    const { path } = ctxMenu;
    const idx = tabs.findIndex((t: TabItem) => t.path === path);
    const nonFixed = tabs.filter((t: TabItem) => !t.fixed);
    const hasRight = tabs.slice(idx + 1).some((t: TabItem) => !t.fixed);

    return [
      {
        key: 'reload',
        icon: <ReloadOutlined />,
        label: '刷新当前页签',
        onClick: () => reloadTab(path),
      },
      {
        key: 'toggleFixed',
        disabled: path === homePath,
        icon: tabs.find((t: TabItem) => t.path === path)?.fixed ? (
          <PushpinFilled style={{ color: '#1890ff' }} />
        ) : (
          <PushpinOutlined />
        ),
        label: tabs.find((t: TabItem) => t.path === path)?.fixed
          ? '取消固定'
          : '固定页签',
        onClick: () => toggleFixedTab(path),
      },
      { type: 'divider' as const },
      {
        key: 'closeOther',
        label: '关闭其他页签',
        disabled: nonFixed.length <= 1,
        onClick: () => closeOtherTabs(path),
      },
      {
        key: 'closeRight',
        label: '关闭右侧页签',
        disabled: !hasRight,
        onClick: () => closeRightTabs(path),
      },
      {
        key: 'closeAll',
        label: '关闭全部页签',
        danger: true,
        disabled: nonFixed.length === 0,
        onClick: closeAllTabs,
      },
    ];
  }, [
    ctxMenu,
    tabs,
    activeKey,
    homePath,
    reloadTab,
    toggleFixedTab,
    closeOtherTabs,
    closeRightTabs,
    closeAllTabs,
  ]);

  // 2. 缓存快捷下拉列表 [rerender-memo]
  const dropdownItems: MenuProps['items'] = useMemo(() => {
    return [
      {
        type: 'group' as const,
        label: '已打开的页签',
        children: tabs.map((t: TabItem) => ({
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
      { type: 'divider' as const },
      {
        key: '__closeAll',
        label: '关闭全部页签',
        danger: true,
        onClick: closeAllTabs,
      },
    ];
  }, [tabs, activeKey, switchTab, closeAllTabs]);
  // 3. 自定义碰撞检测：如果鼠标垂直方向偏移过大，则不触发位移 [rendering-performance]
  const customCollisionDetection = useCallback((args: any) => {
    const { pointerCoordinates } = args;
    if (!pointerCoordinates || !scrollRef.current) return [];

    const rect = scrollRef.current.getBoundingClientRect();
    const threshold = 60; // 垂直偏移阈值

    if (
      pointerCoordinates.y < rect.top - threshold ||
      pointerCoordinates.y > rect.bottom + threshold
    ) {
      return [];
    }

    return closestCenter(args);
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      moveTab(active.id as string, over.id as string);
    }
  };

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

  const { initialState } = useModel('@@initialState');
  const settings = initialState?.settings || {};
  const {
    layout = 'side',
    fixedHeader = false,
    contentWidth = 'Fluid',
  } = settings;

  const isTop = layout === 'top';
  const isSticky = !isTop;
  const isFixed = contentWidth === 'Fixed';

  const wrapperClass = [
    s.wrapper,
    isSticky ? s.isSticky : s.isTop,
    layout === 'mix' || fixedHeader ? s.hasFixedHeader : '',
  ].join(' ');

  return (
    <div className={wrapperClass}>
      <div className={s.bar}>
        <div className={`${s.barInner} ${isFixed ? s.isFixed : ''}`}>
          <button
            type="button"
            className={`${s.scrollBtn} ${canLeft ? s.scrollBtnActive : ''}`}
            disabled={!canLeft}
            onClick={() => scrollBy(-1)}
          >
            <LeftOutlined />
          </button>

          <div className={s.scrollArea} ref={scrollRef}>
            <DndContext
              sensors={sensors}
              collisionDetection={customCollisionDetection}
              modifiers={[restrictToHorizontalAxis]}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={tabs.map((t: TabItem) => t.path)}
                strategy={horizontalListSortingStrategy}
              >
                {tabs.map((tab: TabItem) => (
                  <SortableTab
                    key={tab.path}
                    tab={tab}
                    isHome={tab.path === homePath}
                    isActive={tab.path === activeKey}
                    onSwitch={switchTab}
                    onClose={closeTab}
                    onContextMenu={(e, path) =>
                      setCtxMenu({ path, x: e.clientX, y: e.clientY })
                    }
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>

          <button
            type="button"
            className={`${s.scrollBtn} ${canRight ? s.scrollBtnActive : ''}`}
            disabled={!canRight}
            onClick={() => scrollBy(1)}
          >
            <RightOutlined />
          </button>

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
                items: contextMenuItems,
                onClick: () => setCtxMenu(null),
              }}
              trigger={[]}
            >
              <span />
            </Dropdown>
          </div>
        </>
      )}

      <div className={s.content}>{children}</div>
    </div>
  );
};

export default TabBar;
