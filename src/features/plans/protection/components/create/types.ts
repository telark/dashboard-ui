import type { CSSProperties } from 'react';
import type dayjs from 'dayjs';
import { SPACING } from '../../../../../constants';
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

// Two fields side by side in equal columns that never grow past half the row.
export const FORM_FIELD_PAIR_STYLE: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: SPACING.MD,
};
