import {
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
  AiOutlineAlert,
  AiOutlineSetting,
  AiOutlineSafetyCertificate,
} from 'react-icons/ai';
import { BsFillCpuFill, BsMemory, BsKey, BsIntersect } from 'react-icons/bs';
import { TbUserKey } from 'react-icons/tb';

export const Icons = {
  Home: AiOutlineHome,
  Role: TbUserKey,
  Grouper: AiOutlineCluster,
  Workload: AiOutlineAppstore,
  Application: BsIntersect,
  Insights: AiOutlineAlert,
  Bridge: AiOutlineApi,
  User: AiOutlineUser,
  Group: AiOutlineTeam,
  ProtectionPlans: AiOutlineSafetyCertificate,
  Settings: AiOutlineSetting,
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
