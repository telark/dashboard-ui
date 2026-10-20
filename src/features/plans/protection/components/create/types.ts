import type dayjs from 'dayjs';
import type { PlanApprovalMode, PlanRepeatDay, ScopeType } from '../../models';

export interface PolicyEntry {
  templateID: string;
  params: Record<string, string[]>;
}

// The repeating rule's fields, shared by the plan form and Duplicate.
export interface RepeatFormValues {
  repeatDays?: PlanRepeatDay[];
  repeatStart?: dayjs.Dayjs;
  repeatEnd?: dayjs.Dayjs;
  repeatTimeZone?: string;
}

export interface FormValues extends RepeatFormValues {
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
  kindRef?: string;
  environmentRef?: string;
  tagRefs?: string[];
  approvalMode?: PlanApprovalMode;
}

export const FORM_ITEM_CLASS = 'form-item-compact no-asterisk';
