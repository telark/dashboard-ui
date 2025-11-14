import {
  AiOutlineSafety,
  AiOutlineCluster,
  AiOutlineAppstore,
  AiOutlineApi,
  AiOutlineDashboard,
  AiOutlineUser,
  AiOutlineTeam,
  AiFillTag,
  AiOutlineFileText,
  AiOutlineCalendar,
  AiOutlineCheckCircle,
  AiOutlineContainer,
} from 'react-icons/ai';
import { BsFillCpuFill, BsMemory, BsKey } from 'react-icons/bs';

export const ICONS = {
  HOME: AiOutlineDashboard,
  ROLE: AiOutlineSafety,
  GROUPER: AiOutlineCluster,
  WORKLOAD: AiOutlineAppstore,
  BRIDGE: AiOutlineApi,
  USER: AiOutlineUser,
  GROUP: AiOutlineTeam,
  PASSKEY: BsKey,
  VIEW_FIELD_NAME: AiFillTag,
  VIEW_FIELD_DESCRIPTION: AiOutlineFileText,
  VIEW_FIELD_DATE: AiOutlineCalendar,
  CPU: BsFillCpuFill,
  MEMORY: BsMemory,
  QOS: AiOutlineCheckCircle,
  CONTAINER: AiOutlineContainer,
} as const;
