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

export const Icons = {
  Home: AiOutlineDashboard,
  Role: AiOutlineSafety,
  Grouper: AiOutlineCluster,
  Workload: AiOutlineAppstore,
  Bridge: AiOutlineApi,
  User: AiOutlineUser,
  Group: AiOutlineTeam,
  Passkey: BsKey,
  ViewFieldName: AiFillTag,
  ViewFieldDescription: AiOutlineFileText,
  ViewFieldDate: AiOutlineCalendar,
  Cpu: BsFillCpuFill,
  Memory: BsMemory,
  Qos: AiOutlineCheckCircle,
  Container: AiOutlineContainer,
} as const;
