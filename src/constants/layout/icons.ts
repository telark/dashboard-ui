import {
  AiOutlineSafety,
  AiOutlineTags,
  AiOutlineCluster,
  AiOutlineAppstore,
  AiOutlineApi,
  AiOutlineDashboard,
  AiOutlineUser,
  AiOutlineTeam,
  AiFillTag,
  AiOutlineFileText,
  AiOutlineCalendar,
} from 'react-icons/ai';

export const ICONS = {
  HOME: AiOutlineDashboard,
  ROLE: AiOutlineSafety,
  CATEGORY: AiOutlineTags,
  GROUPER: AiOutlineCluster,
  WORKLOAD: AiOutlineAppstore,
  BRIDGE: AiOutlineApi,
  USER: AiOutlineUser,
  GROUP: AiOutlineTeam,
  VIEW_FIELD_NAME: AiFillTag,
  VIEW_FIELD_DESCRIPTION: AiOutlineFileText,
  VIEW_FIELD_DATE: AiOutlineCalendar,
} as const;
