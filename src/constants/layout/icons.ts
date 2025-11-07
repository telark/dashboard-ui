import {
  AiOutlineSafety,
  AiOutlineTags,
  AiOutlineCluster,
  AiOutlineAppstore,
  AiOutlineApi,
  AiOutlineDashboard,
} from 'react-icons/ai';
import type { IconType } from 'react-icons';

export const ICONS = {
  HOME: AiOutlineDashboard,
  ROLE: AiOutlineSafety,
  CATEGORY: AiOutlineTags,
  GROUPER: AiOutlineCluster,
  WORKLOAD: AiOutlineAppstore,
  BRIDGE: AiOutlineApi,
} as const;

export const getRoleIcon = (): IconType => ICONS.ROLE;
export const getCategoryIcon = (): IconType => ICONS.CATEGORY;
