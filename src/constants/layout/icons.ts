import { AiOutlineSafety } from 'react-icons/ai';
import type { IconType } from 'react-icons';

export const ICONS = {
  ROLE: AiOutlineSafety,
} as const;

export const getRoleIcon = (): IconType => ICONS.ROLE;

