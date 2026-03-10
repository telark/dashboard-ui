import { useState, useEffect } from 'react';
import { getCurrentUser } from '../../../../auth/utils';
import { fetchCurrentUserDetails } from '../../../../access-and-permissions/users/utils';
import type { User } from '../../../../access-and-permissions/users/models';

export function useProfileUser(): User | null {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());

  useEffect(() => {
    const initial = getCurrentUser();
    if (initial?.id) {
      fetchCurrentUserDetails((user) => setCurrentUser(user));
    }
  }, []);

  return currentUser;
}
