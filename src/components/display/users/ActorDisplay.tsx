import React, { memo } from 'react';
import UserDisplay from './UserDisplay';
import type { User } from '../../../features/access-and-permissions/users/models';

interface ActorDisplayProps {
  actor: string | undefined;
  /** The full record, when the viewer can list users. */
  user: User | null | undefined;
  usernamesById: Record<string, string>;
  size?: 'small' | 'medium' | 'large';
  showBorder?: boolean;
}

// An actor still being looked up renders nothing, so "—" only ever means no actor.
const ActorDisplay: React.FC<ActorDisplayProps> = memo(
  ({ actor, user, usernamesById, size, showBorder }) => {
    const username = actor ? (user?.username ?? usernamesById[actor]) : undefined;
    if (actor && !username) return null;
    return (
      <UserDisplay
        user={user ?? (username ? { username } : null)}
        title={actor}
        size={size}
        showBorder={showBorder}
      />
    );
  },
);

ActorDisplay.displayName = 'ActorDisplay';

export default ActorDisplay;
