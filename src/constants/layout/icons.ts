import {
  AiOutlineSafety,
  AiOutlineCluster,
  AiOutlineAppstore,
  AiOutlineApi,
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineTeam,
  AiFillTag,
  AiOutlineFileText,
  AiOutlineCalendar,
  AiOutlineCheckCircle,
  AiOutlineContainer,
  AiOutlineFileProtect,
  AiOutlineAlert,
} from 'react-icons/ai';
import { BsFillCpuFill, BsMemory, BsKey, BsIntersect } from 'react-icons/bs';

export const Icons = {
  Home: AiOutlineHome,
  Role: AiOutlineSafety,
  Grouper: AiOutlineCluster,
  Workload: AiOutlineAppstore,
  Application: BsIntersect,
  Insights: AiOutlineAlert,
  Bridge: AiOutlineApi,
  User: AiOutlineUser,
  Group: AiOutlineTeam,
  ProtectionPlans: AiOutlineFileProtect,
  Passkey: BsKey,
  ViewFieldName: AiFillTag,
  ViewFieldDescription: AiOutlineFileText,
  ViewFieldDate: AiOutlineCalendar,
  Cpu: BsFillCpuFill,
  Memory: BsMemory,
  Qos: AiOutlineCheckCircle,
  Container: AiOutlineContainer,
  /** Restore / rollback to saved snapshot (backup-restore metaphor). */
} as const;
