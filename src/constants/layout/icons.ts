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
  AiOutlineFileProtect,
} from 'react-icons/ai';
import { BsFillCpuFill, BsMemory, BsKey } from 'react-icons/bs';
import { MdOutlineSettingsBackupRestore } from 'react-icons/md';

export const Icons = {
  Home: AiOutlineDashboard,
  Role: AiOutlineSafety,
  Grouper: AiOutlineCluster,
  Workload: AiOutlineAppstore,
  Application: AiOutlineAppstore,
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
  SnapshotRestore: MdOutlineSettingsBackupRestore,
} as const;
