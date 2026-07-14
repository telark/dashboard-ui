import { useCallback, useEffect, useState } from 'react';
import { SIDEBAR_LAYOUT } from '../../constants';

const TRUE_VALUE = 'true';

interface SidebarState {
  collapsed: boolean;
  width: number;
}

const clampWidth = (width: number): number =>
  Math.min(Math.max(width, SIDEBAR_LAYOUT.WIDTH_MIN), SIDEBAR_LAYOUT.WIDTH_MAX);

const readStoredState = (): SidebarState => {
  const storedWidth = Number(localStorage.getItem(SIDEBAR_LAYOUT.WIDTH_STORAGE_KEY));
  return {
    collapsed: localStorage.getItem(SIDEBAR_LAYOUT.STORAGE_KEY) === TRUE_VALUE,
    width: storedWidth > 0 ? clampWidth(storedWidth) : SIDEBAR_LAYOUT.WIDTH_EXPANDED,
  };
};

const publishState = (next: SidebarState): void => {
  localStorage.setItem(SIDEBAR_LAYOUT.STORAGE_KEY, String(next.collapsed));
  localStorage.setItem(SIDEBAR_LAYOUT.WIDTH_STORAGE_KEY, String(next.width));
  globalThis.dispatchEvent(new CustomEvent(SIDEBAR_LAYOUT.COLLAPSED_EVENT, { detail: next }));
};

interface UseSidebarCollapseOptions {
  // Only the component owning the toggle registers the shortcut, otherwise every
  // listener would flip the state and the toggles would cancel each other out.
  withShortcut?: boolean;
}

export const useSidebarCollapse = ({ withShortcut = false }: UseSidebarCollapseOptions = {}) => {
  const [state, setState] = useState<SidebarState>(readStoredState);

  useEffect(() => {
    document.documentElement.style.setProperty(
      SIDEBAR_LAYOUT.CSS_VAR,
      `${state.collapsed ? SIDEBAR_LAYOUT.WIDTH_COLLAPSED : state.width}px`,
    );
  }, [state]);

  useEffect(() => {
    const handleStateChanged = (e: Event) => {
      setState((e as CustomEvent<SidebarState>).detail);
    };
    globalThis.addEventListener(SIDEBAR_LAYOUT.COLLAPSED_EVENT, handleStateChanged);
    return () => {
      globalThis.removeEventListener(SIDEBAR_LAYOUT.COLLAPSED_EVENT, handleStateChanged);
    };
  }, []);

  const toggle = useCallback(() => {
    const stored = readStoredState();
    publishState({ ...stored, collapsed: !stored.collapsed });
  }, []);

  // Width below the threshold snaps shut; anything above reopens the sidebar.
  const applyDraggedWidth = useCallback((draggedWidth: number) => {
    const stored = readStoredState();
    if (draggedWidth < SIDEBAR_LAYOUT.COLLAPSE_THRESHOLD) {
      publishState({ ...stored, collapsed: true });
      return;
    }
    publishState({ collapsed: false, width: clampWidth(draggedWidth) });
  }, []);

  useEffect(() => {
    if (!withShortcut) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.metaKey && !e.ctrlKey) return;
      if (e.key.toLowerCase() !== SIDEBAR_LAYOUT.TOGGLE.SHORTCUT_KEY) return;
      e.preventDefault();
      toggle();
    };
    globalThis.addEventListener('keydown', handleKeyDown);
    return () => {
      globalThis.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggle, withShortcut]);

  return { isCollapsed: state.collapsed, width: state.width, toggle, applyDraggedWidth };
};
