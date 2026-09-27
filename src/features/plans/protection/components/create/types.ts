import type dayjs from 'dayjs';
import type { PlanApprovalMode, ScopeType } from '../../models';

export interface PolicyEntry {
  templateID: string;
  params: Record<string, string[]>;
}

export interface FormValues {
  name: string;
  description?: string;
  severity?: string;
  priority?: number;
  mode: string;
  scopeType: ScopeType;
  applicationRefs?: string[];
  namespaces?: string[];
  excludedKinds?: string[];
  excludedResources?: string[];
  timeMode: string;
  startAt?: dayjs.Dayjs;
  endAt?: dayjs.Dayjs;
  participantRefs?: string[];
  environmentRef?: string;
  tagRefs?: string[];
  approvalMode?: PlanApprovalMode;
}

export const FORM_ITEM_CLASS = 'form-item-compact no-asterisk';
