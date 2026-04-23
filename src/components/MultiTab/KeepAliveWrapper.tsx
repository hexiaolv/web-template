/**
 * Keep-Alive 内容容器
 * 路径: src/components/MultiTab/KeepAliveWrapper.tsx
 *
 * 原理：
 *   所有 Tab 对应的页面同时挂载在 DOM 中，
 *   通过 display: block/none 切换可见性，以保留页面内部状态。
 *   当 reloadKey 变化时，卸载并重新挂载对应页面（实现刷新）。
 *
 * 使用：在 src/app.tsx 的 childrenRender 中替代默认 children。
 */
import { useModel, useOutlet } from '@umijs/max';
import { useRef } from 'react';

interface Props {
  /** 当前激活路径（来自 useLocation） */
  currentPath: string;
  /** 真正的路由组件内容（由 app.tsx 的 childrenRender 传入） */
  children: React.ReactNode;
}

/**
 * 简化版 keep-alive：
 *  - 首次进入某路径时缓存传入的 children
 *  - reloadKey 变化时清除缓存，下次渲染时重新取新 children
 */
const KeepAliveWrapper: React.FC<Props> = ({ currentPath, children }) => {
  const { tabs } = useModel('multiTab');
  const outlet = useOutlet();
  // 优先使用传入的 children，因为它是 childrenRender 中最实时的内容
  const actualElement = children || outlet;

  /**
   * 缓存结构: { [path]: { element: ReactNode, reloadKey: number } }
   */
  const cacheRef = useRef<
    Record<string, { element: React.ReactNode; reloadKey: number }>
  >({});

  // 找当前 tab 的 reloadKey
  const currentTab = tabs.find((t) => t.path === currentPath);
  const currentReloadKey = currentTab?.reloadKey ?? 0;

  // 这里的逻辑保持：如果是当前路径且内容存在，则更新/同步缓存
  const cached = cacheRef.current[currentPath];
  if (actualElement && (!cached || cached.reloadKey !== currentReloadKey)) {
    cacheRef.current[currentPath] = {
      element: actualElement,
      reloadKey: currentReloadKey,
    };
  }

  // 关键修复：判断当前路径是否在页签列表中
  const isTab = tabs.some((t) => t.path === currentPath);

  // 如果当前路径不在页签内（如正在重定向的 '/' 路径，或 404 页面）
  // 则直接渲染，不走缓存容器，确保基础路由（如 Redirect）正常工作
  if (!isTab) {
    return <>{actualElement}</>;
  }

  return (
    <>
      {tabs.map((tab) => {
        const entry = cacheRef.current[tab.path];
        const isCurrent = tab.path === currentPath;

        // 如果是当前活跃路径，优先用 live 的 actualElement
        const displayElement = isCurrent ? actualElement : entry?.element;

        if (!displayElement) return null;

        return (
          <div
            key={`${tab.path}-${entry?.reloadKey || 0}`}
            style={{
              display: isCurrent ? 'block' : 'none',
              height: '100%',
            }}
          >
            {displayElement}
          </div>
        );
      })}
    </>
  );
};

export default KeepAliveWrapper;
