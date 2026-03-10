import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser } from '../../../../auth/utils';
import { fetchCurrentUserDetails } from '../../../../access-and-permissions/users/utils';
import type { User } from '../../../../access-and-permissions/users/models';

export interface UseProfileUserResult {
  currentUser: User | null;
  refetch: () => Promise<void>;
}

export function useProfileUser(): UseProfileUserResult {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());

  const refetch = useCallback(() => {
    const initial = getCurrentUser();
    if (!initial?.id) return Promise.resolve();
    return new Promise<void>((resolve) => {
      fetchCurrentUserDetails(
        (user) => {
          setCurrentUser(user);
          resolve();
        },
        () => resolve(),
      );
    });
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { currentUser, refetch };
}
