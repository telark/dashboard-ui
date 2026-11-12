import { waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ACTORS, Endpoints } from '../constants';
import { mockEndpoint, mockNetworkError, renderAppHook } from '../test';
import { useUsernamesByIds } from './useUsernamesByIds';

const namesEndpoint = (ids: string[]) => Endpoints.USERS.GET_NAMES(ids);

describe('useUsernamesByIds', () => {
  it('shows the last segment of an actor that is not a user id', () => {
    const ids = ['system:serviceaccount:telark:operator', 'plain'];

    const { result } = renderAppHook(() => useUsernamesByIds(ids, true));

    expect(result.current).toEqual({
      'system:serviceaccount:telark:operator': 'operator',
      plain: 'plain',
    });
  });

  it('looks user ids up once and names the unknown ones', async () => {
    const ids = ['u-1', 'u-2', 'u-1'];
    const mock = mockEndpoint('exporter', namesEndpoint(['u-1', 'u-2']), {
      data: { 'u-1': 'release_lead' },
    });

    const { result } = renderAppHook(() => useUsernamesByIds(ids, true));

    await waitFor(() =>
      expect(result.current).toEqual({ 'u-1': 'release_lead', 'u-2': ACTORS.UNKNOWN_USER }),
    );
    expect(mock.calls).toHaveLength(1);
    expect(mock.calls[0].url.search).toContain('u-1');
  });

  it('asks nothing while disabled', () => {
    const ids = ['u-1'];
    const mock = mockEndpoint('exporter', namesEndpoint(ids), { data: {} });

    const { result } = renderAppHook(() => useUsernamesByIds(ids, false));

    expect(result.current).toEqual({});
    expect(mock.calls).toHaveLength(0);
  });

  it('leaves a name out after a failed lookup, and asks again later', async () => {
    const ids = ['u-1'];
    const failed = mockNetworkError('exporter', namesEndpoint(ids));
    const { result, rerender } = renderAppHook(
      (current: string[]) => useUsernamesByIds(current, true),
      {
        initialProps: ids,
      },
    );
    await waitFor(() => expect(failed.calls).toHaveLength(1));

    mockEndpoint('exporter', namesEndpoint(ids), { data: { 'u-1': 'release_lead' } });
    rerender([...ids]);

    await waitFor(() => expect(result.current).toEqual({ 'u-1': 'release_lead' }));
  });
});
