import { AiOutlineSafety, AiOutlineTags, AiOutlineCluster, AiOutlineAppstore } from 'react-icons/ai';
import type { IconType } from 'react-icons';

export const ICONS = {
  ROLE: AiOutlineSafety,
  CATEGORY: AiOutlineTags,
  GROUPER: AiOutlineCluster,
  WORKLOAD: AiOutlineAppstore,
} as const;

export const getRoleIcon = (): IconType => ICONS.ROLE;
export const getCategoryIcon = (): IconType => ICONS.CATEGORY;
