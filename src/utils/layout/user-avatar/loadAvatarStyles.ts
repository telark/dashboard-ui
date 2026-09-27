import type { Style } from '@dicebear/core';

type AvatarStyle = Style<object>;
type AvatarStyleLoader = () => Promise<unknown>;

const AVATAR_STYLE_LOADERS: Record<string, AvatarStyleLoader> = {
  avataaars: () => import('@dicebear/avataaars'),
  adventurer: () => import('@dicebear/adventurer'),
  'big-smile': () => import('@dicebear/big-smile'),
  bottts: () => import('@dicebear/bottts'),
  'fun-emoji': () => import('@dicebear/fun-emoji'),
  identicon: () => import('@dicebear/identicon'),
  lorelei: () => import('@dicebear/lorelei'),
  micah: () => import('@dicebear/micah'),
  miniavs: () => import('@dicebear/miniavs'),
  'open-peeps': () => import('@dicebear/open-peeps'),
  personas: () => import('@dicebear/personas'),
  'pixel-art': () => import('@dicebear/pixel-art'),
};

export const loadAvatarStyle = async (styleName: string): Promise<AvatarStyle | null> => {
  const loader = AVATAR_STYLE_LOADERS[styleName];
  if (!loader) return null;

  const module = await loader();
  const style = (module as { default?: AvatarStyle }).default ?? (module as AvatarStyle);

  return style ?? null;
};
