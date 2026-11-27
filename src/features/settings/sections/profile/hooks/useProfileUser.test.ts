import { act, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Endpoints } from '../../../../../constants';
import { mockEndpoint, renderAppHook } from '../../../../../test';
import { signIn } from '../../../../../test/helpers/session';
import { useProfileUser } from './useProfileUser';

describe('useProfileUser', () => {
  it('reads the account from the server again on a bare refetch', async () => {
    const account = signIn({ username: 'release_lead' });
    const fetched = mockEndpoint('exporter', Endpoints.USERS.GET_BY_ID(account.id), {
      data: account as never,
    });
    const { result } = renderAppHook(() => useProfileUser());
    await waitFor(() => expect(fetched.calls).toHaveLength(1));
    mockEndpoint('exporter', Endpoints.USERS.GET_BY_ID(account.id), {
      data: { ...account, username: 'release_manager' } as never,
    });

    await act(() => result.current.refetch());

    expect(result.current.currentUser?.username).toBe('release_manager');
  });
});
