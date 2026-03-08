import { createAvatar } from '@dicebear/core';
import type { User } from '../../../features/access-and-permissions/users/models';
import { loadAvatarStyle } from './loadAvatarStyles';
import { logger } from '../../../logging';

interface BuildAvatarSourcesParams {
  groupUsers: User[];
  createdByUser: User | null;
  lastUpdatedByUser: User | null;
}

const GROUP_USER_AVATAR_SIZE = 32;
const META_USER_AVATAR_SIZE = 16;

const generateAvatarForUser = async (user: User, size: number, sources: Record<string, string>) => {
  if (!user.avatar?.style || !user.avatar?.seed) return;

  try {
    const style = await loadAvatarStyle(user.avatar.style);
    if (!style) return;

    const generated = createAvatar(
      style as never,
      {
        seed: user.avatar.seed,
        size: size * 2,
      } as never,
    );
    sources[user.id] = generated.toDataUri();
  } catch (error) {
    logger.error('Failed to load avatar style:', error);
  }
};

export const buildAvatarSources = async ({
  groupUsers,
  createdByUser,
  lastUpdatedByUser,
}: BuildAvatarSourcesParams): Promise<Record<string, string>> => {
  const sources: Record<string, string> = {};

  await Promise.all(
    groupUsers.map((user) => generateAvatarForUser(user, GROUP_USER_AVATAR_SIZE, sources)),
  );

  if (createdByUser) {
    await generateAvatarForUser(createdByUser, META_USER_AVATAR_SIZE, sources);
  }

  if (lastUpdatedByUser) {
    await generateAvatarForUser(lastUpdatedByUser, META_USER_AVATAR_SIZE, sources);
  }

  return sources;
};
