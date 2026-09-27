import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { SIDEBAR_LAYOUT } from '../../constants';
import { useMediaQuery } from './useMediaQuery';

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

const NARROW_QUERY = `(max-width: ${SIDEBAR_LAYOUT.FORCE_COLLAPSE_BELOW - 1}px)`;

export const useSidebarCollapse = ({ withShortcut = false }: UseSidebarCollapseOptions = {}) => {
  const [state, setState] = useState<SidebarState>(readStoredState);
  const isNarrow = useMediaQuery(NARROW_QUERY);

  // A narrow viewport wins over the stored preference, which is left untouched so
  // the sidebar returns to it once there is room again.
  const collapsed = state.collapsed || isNarrow;

  // Before paint, or the content first renders at the stylesheet default and slides over.
  useLayoutEffect(() => {
    document.documentElement.style.setProperty(
      SIDEBAR_LAYOUT.CSS_VAR,
      `${collapsed ? SIDEBAR_LAYOUT.WIDTH_COLLAPSED : state.width}px`,
    );
  }, [collapsed, state.width]);

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
    if (isNarrow) return;
    const stored = readStoredState();
    publishState({ ...stored, collapsed: !stored.collapsed });
  }, [isNarrow]);

  // Width below the threshold snaps shut; anything above reopens the sidebar.
  const applyDraggedWidth = useCallback(
    (draggedWidth: number) => {
      if (isNarrow) return;
      const stored = readStoredState();
      if (draggedWidth < SIDEBAR_LAYOUT.COLLAPSE_THRESHOLD) {
        publishState({ ...stored, collapsed: true });
        return;
      }
      publishState({ collapsed: false, width: clampWidth(draggedWidth) });
    },
    [isNarrow],
  );

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

  return {
    isCollapsed: collapsed,
    width: state.width,
    toggle,
    applyDraggedWidth,
    canToggle: !isNarrow,
  };
};
