import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser } from '../../../../auth/utils';
import { fetchCurrentUserDetails } from '../../../../access-and-permissions/users/utils';
import type { User } from '../../../../access-and-permissions/users/models';

export interface UseProfileUserResult {
  currentUser: User | null;
  refetch: (updatedUser?: User) => Promise<void>;
}

export function useProfileUser(): UseProfileUserResult {
  const [currentUser, setCurrentUserState] = useState<User | null>(() => getCurrentUser());

  const refetch = useCallback((updatedUser?: User) => {
    if (updatedUser != null) {
      setCurrentUserState(updatedUser);
      return Promise.resolve();
    }
    const initial = getCurrentUser();
    if (!initial?.id) return Promise.resolve();
    return new Promise<void>((resolve) => {
      fetchCurrentUserDetails(
        (user) => {
          setCurrentUserState(user);
          resolve();
        },
        () => resolve(),
      );
    });
  }, []);

  useEffect(() => {
    const initial = getCurrentUser();
    if (!initial?.id) return;
    let canceled = false;
    fetchCurrentUserDetails(
      (user) => {
        if (!canceled) setCurrentUserState(user);
      },
      () => {},
    );
    return () => {
      canceled = true;
    };
  }, []);

  return { currentUser, refetch };
}
