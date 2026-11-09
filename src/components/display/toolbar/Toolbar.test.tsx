import { describe, expect, it, vi } from 'vitest';
import { clickButton, renderApp } from '../../../test';
import Toolbar from './Toolbar';

describe('Toolbar buttons', () => {
  it.each([
    ['idle', {}, 1],
    ['with its action in flight', { loading: true }, 0],
  ])('a button %s fires its action %i time(s)', async (_state, flags, calls) => {
    const onClick = vi.fn();
    const buttons = [{ key: 'sync', label: 'Sync', onClick, ...flags }];
    const { user } = renderApp(<Toolbar config={{ buttons }} />);

    await clickButton(user, 'Sync');

    expect(onClick).toHaveBeenCalledTimes(calls);
  });
});
