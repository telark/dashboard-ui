import type React from 'react';
import { act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DATA_VIEW_ERROR_CONSTANTS } from '../../components/shared/dataViewError.constants';
import { SIDEBAR_LAYOUT } from '../../constants';
import { renderAppHook, setLayoutWidth } from '../../test';
import { mountContentPane } from '../../test/helpers/contentPane';
import { useActionConfirmHandlers } from './useActionConfirmHandlers';
import { useDataViewState } from './useDataViewState';
import { useElementWidth } from './useElementWidth';
import { useLoadingTimeout } from './useLoadingTimeout';
import { useMediaQuery } from './useMediaQuery';
import { useOpenedOnce } from './useOpenedOnce';
import { useSidebarCollapse } from './useSidebarCollapse';

const matchMediaWith = (matches: boolean) => {
  const listeners = new Set<() => void>();
  vi.spyOn(globalThis, 'matchMedia').mockImplementation(
    (media) =>
      ({
        matches,
        media,
        addEventListener: (_: string, cb: () => void) => listeners.add(cb),
        removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
      }) as unknown as MediaQueryList,
  );
  return listeners;
};

describe('useMediaQuery', () => {
  it('reads the query and unsubscribes', () => {
    const listeners = matchMediaWith(true);

    const { result, unmount } = renderAppHook(() => useMediaQuery('(max-width: 1px)'));

    expect(result.current).toBe(true);
    expect(listeners.size).toBe(1);
    unmount();
    expect(listeners.size).toBe(0);
  });
});

describe('useOpenedOnce', () => {
  it('stays true after the first open', () => {
    const { result, rerender } = renderAppHook((open: boolean) => useOpenedOnce(open), {
      initialProps: false,
    });
    expect(result.current).toBe(false);

    rerender(true);
    expect(result.current).toBe(true);

    rerender(false);
    expect(result.current).toBe(true);
  });
});

describe('useElementWidth', () => {
  it('measures the element it is attached to, and skips a hidden one', () => {
    const { result } = renderAppHook(() => useElementWidth<HTMLDivElement>());
    setLayoutWidth(0);
    act(() => {
      result.current.ref(document.createElement('div'));
    });
    expect(result.current.width).toBe(0);

    setLayoutWidth(640);
    act(() => {
      result.current.ref(document.createElement('div'));
      result.current.ref(null);
    });
    expect(result.current.width).toBe(640);
  });
});

describe('useActionConfirmHandlers', () => {
  const event = () =>
    ({ stopPropagation: vi.fn(), preventDefault: vi.fn() }) as unknown as React.MouseEvent;

  it.each(['handleCloseIconClick', 'handleCancelClick', 'handleClose'] as const)(
    '%s closes without letting the click through',
    (handler) => {
      const onClose = vi.fn();
      const click = event();
      const { result } = renderAppHook(() =>
        useActionConfirmHandlers({ onClose, onConfirm: vi.fn() }),
      );

      act(() => result.current[handler](click));

      expect(onClose).toHaveBeenCalledWith(click);
      expect(click.stopPropagation).toHaveBeenCalled();
    },
  );

  it('confirms, then closes', async () => {
    const order: string[] = [];
    const onClose = () => order.push('close');
    const onConfirm = async () => {
      order.push('confirm');
    };
    const { result } = renderAppHook(() => useActionConfirmHandlers({ onClose, onConfirm }));

    await act(async () => {
      result.current.handleConfirmClick(event());
    });

    expect(order).toEqual(['confirm', 'close']);
  });

  it('defers the close of the modal backdrop past the click', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    const { result } = renderAppHook(() =>
      useActionConfirmHandlers({ onClose, onConfirm: vi.fn() }),
    );

    act(() => result.current.handleModalCancel());
    expect(onClose).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(10));
    expect(onClose).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });
});

describe('useLoadingTimeout and useDataViewState', () => {
  const { TIMEOUT_MS, LABELS } = DATA_VIEW_ERROR_CONSTANTS;
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('times out a load with no data', () => {
    const { result } = renderAppHook(() =>
      useLoadingTimeout({ isLoading: true, hasError: false, hasData: false, timeoutMs: 100 }),
    );
    expect(result.current).toBe(false);

    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe(true);
  });

  it.each([
    [false, false, false],
    [true, true, false],
    [true, false, true],
  ])('never times out when loading=%j error=%j data=%j', (isLoading, hasError, hasData) => {
    const { result } = renderAppHook(() => useLoadingTimeout({ isLoading, hasError, hasData }));

    act(() => vi.advanceTimersByTime(TIMEOUT_MS * 2));

    expect(result.current).toBe(false);
  });

  it.each([
    [{ loading: true, error: null, hasData: false }, 'loading'],
    [{ loading: false, error: null, hasData: false }, 'empty'],
    [{ loading: false, error: null, hasData: true }, 'ready'],
    [{ loading: true, error: null, hasData: true }, 'ready'],
    [{ loading: false, error: 'boom', hasData: true }, 'error'],
  ])('reads %j as %s', (input, phase) => {
    expect(renderAppHook(() => useDataViewState(input)).result.current.phase).toBe(phase);
  });

  it('explains a timeout and a connectivity failure', () => {
    const { result: slow } = renderAppHook(() =>
      useDataViewState({ loading: true, error: null, hasData: false }),
    );
    act(() => vi.advanceTimersByTime(TIMEOUT_MS));
    expect(slow.current).toMatchObject({
      phase: 'error',
      timedOut: true,
      errorMessage: LABELS.TIMEOUT_MESSAGE,
    });

    const { result: offline } = renderAppHook(() =>
      useDataViewState({ loading: false, error: 'Network Error', hasData: false }),
    );
    expect(offline.current.connectivity).toEqual({ kind: 'network' });
  });
});

describe('useSidebarCollapse', () => {
  const stored = () => localStorage.getItem(SIDEBAR_LAYOUT.STORAGE_KEY);

  it('reads the stored width, clamped', () => {
    localStorage.setItem(SIDEBAR_LAYOUT.WIDTH_STORAGE_KEY, String(SIDEBAR_LAYOUT.WIDTH_MAX + 500));

    expect(renderAppHook(() => useSidebarCollapse()).result.current.width).toBe(
      SIDEBAR_LAYOUT.WIDTH_MAX,
    );
  });

  it('toggles, stores the choice and tells other listeners', () => {
    const { result: first } = renderAppHook(() => useSidebarCollapse());
    const { result: second } = renderAppHook(() => useSidebarCollapse());
    expect(first.current.isCollapsed).toBe(false);

    act(() => first.current.toggle());

    expect(stored()).toBe('true');
    expect(second.current.isCollapsed).toBe(true);
  });

  it('snaps shut below the threshold and reopens above it', () => {
    const { result } = renderAppHook(() => useSidebarCollapse());

    act(() => result.current.applyDraggedWidth(SIDEBAR_LAYOUT.COLLAPSE_THRESHOLD - 1));
    expect(result.current.isCollapsed).toBe(true);

    act(() => result.current.applyDraggedWidth(SIDEBAR_LAYOUT.WIDTH_MIN + 10));
    expect(result.current).toMatchObject({
      isCollapsed: false,
      width: SIDEBAR_LAYOUT.WIDTH_MIN + 10,
    });
  });

  it('stays collapsed on a narrow viewport and refuses to toggle', () => {
    matchMediaWith(true);
    const { result } = renderAppHook(() => useSidebarCollapse());

    expect(result.current).toMatchObject({ isCollapsed: true, canToggle: false });
    act(() => {
      result.current.toggle();
      result.current.applyDraggedWidth(SIDEBAR_LAYOUT.WIDTH_MIN);
    });
    expect(stored()).toBeNull();
  });

  it('toggles from the shortcut only for the owner, with the modifier key', () => {
    const press = (init: ConstructorParameters<typeof KeyboardEvent>[1]) =>
      act(() => {
        globalThis.dispatchEvent(new KeyboardEvent('keydown', init));
      });
    renderAppHook(() => useSidebarCollapse({ withShortcut: true }));
    const key = SIDEBAR_LAYOUT.TOGGLE.SHORTCUT_KEY;

    press({ key });
    press({ key: 'x', metaKey: true });
    expect(stored()).toBeNull();

    press({ key, ctrlKey: true });
    expect(stored()).toBe('true');
  });

  it('sets the content pane width for layout', () => {
    const pane = mountContentPane();

    const { result, unmount } = renderAppHook(() => useSidebarCollapse());

    expect(pane.style.getPropertyValue(SIDEBAR_LAYOUT.CSS_VAR)).toBe(`${result.current.width}px`);
    unmount();
    pane.remove();
  });
});
