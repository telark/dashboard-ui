import { AiOutlineSafety, AiOutlineTags, AiOutlineCluster } from 'react-icons/ai';
import type { IconType } from 'react-icons';

export const ICONS = {
  ROLE: AiOutlineSafety,
  CATEGORY: AiOutlineTags,
  GROUPER: AiOutlineCluster,
} as const;

export const getRoleIcon = (): IconType => ICONS.ROLE;
export const getCategoryIcon = (): IconType => ICONS.CATEGORY;
