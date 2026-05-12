import type dayjs from 'dayjs';
import type { ScopeType } from '../../models';

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
  applicationIds?: string[];
  namespaces?: string[];
  timeMode: string;
  startAt?: dayjs.Dayjs;
  endAt?: dayjs.Dayjs;
  participantsIDs?: string[];
}

export const FORM_ITEM_CLASS = 'form-item-compact no-asterisk';
