import { act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { APP_CONFIGS } from '../../constants';
import { renderAppHook } from '../../test';
import { mountContentPane } from '../../test/helpers/contentPane';
import { useScrollLock } from './useScrollLock';
import { useSlideOutPanelForm } from './useSlideOutPanelForm';

describe('useScrollLock', () => {
  let pane: HTMLElement;
  afterEach(() => pane.remove());

  it('holds the page still until the last panel closes', () => {
    pane = mountContentPane();

    const { unmount: closeFirst } = renderAppHook(() => useScrollLock(true));
    const { unmount: closeSecond } = renderAppHook(() => useScrollLock(true));
    expect(pane).toHaveStyle({ overflowY: 'hidden' });

    closeFirst();
    expect(pane).toHaveStyle({ overflowY: 'hidden' });

    closeSecond();
    expect(pane.style.overflowY).toBe(APP_CONFIGS.LAYOUT.CONTENT_OVERFLOW);
  });

  it('does nothing while closed', () => {
    pane = mountContentPane();

    renderAppHook(() => useScrollLock(false));

    expect(pane).toHaveStyle({ overflowY: '' });
  });
});

describe('useSlideOutPanelForm', () => {
  const setup = (
    extra: Pick<Parameters<typeof useSlideOutPanelForm>[0], 'initialValues' | 'skip'> = {},
  ) => {
    const options = {
      onSubmit: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
      onClose: vi.fn(),
      onCancel: vi.fn(),
    };
    const { result } = renderAppHook(() =>
      useSlideOutPanelForm({ open: true, ...extra, ...options }),
    );
    return { options, result };
  };

  it('closes after a successful submit', async () => {
    const { options, result } = setup();

    await act(() => result.current.handleFinish({ name: 'x' }));

    expect(options.onSubmit).toHaveBeenCalledWith({ name: 'x' });
    expect(options.onClose).toHaveBeenCalledOnce();
  });

  it('stays open when the submit fails', async () => {
    const { options, result } = setup();
    options.onSubmit.mockRejectedValue(new Error('refused'));

    await act(() => result.current.handleFinish({}));

    expect(options.onClose).not.toHaveBeenCalled();
  });

  it('cancels and closes', () => {
    const { options, result } = setup();

    act(() => result.current.handleCancel());

    expect(options.onCancel).toHaveBeenCalledOnce();
    expect(options.onClose).toHaveBeenCalledOnce();
  });

  it('applies the initial values on open, unless it is told to skip', () => {
    const initialValues = { name: 'seeded' };
    const { result: open } = setup({ initialValues });
    const { result: skipped } = setup({ initialValues, skip: true });

    expect(open.current.form.getFieldsValue(true)).toEqual(initialValues);
    expect(skipped.current.form.getFieldsValue(true)).toEqual({});
  });
});
