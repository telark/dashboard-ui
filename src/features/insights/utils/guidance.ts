import { EMPTY_VALUE } from '../../../constants';
import {
  CHANGE_ROLLBACK_STEP,
  GENERIC_GUIDANCE,
  INSIGHT_GUIDANCE,
  KIND_FALLBACK_GUIDANCE,
  PROBE_FAILURE_CAUSE,
} from '../constants/guidance';
import { isInsightReason } from '../constants/insights';
import type { Insight, TriageAction } from '../models';

export const formatTemplate = (template: string, params: Record<string, string>): string =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => params[key] || EMPTY_VALUE);

export const isRecommendation = (insight: { category?: string }): boolean =>
  insight.category === 'recommendation';

export interface ResolvedGuidance {
  cause: string;
  steps: string[];
}

// Documents written before reasons existed keep their previous rendering: no guidance.
export const resolveInsightGuidance = (insight: Insight): ResolvedGuidance | null => {
  if (!insight.reason) return null;
  const base = isInsightReason(insight.reason)
    ? INSIGHT_GUIDANCE[insight.reason]
    : (KIND_FALLBACK_GUIDANCE[insight.kind] ?? GENERIC_GUIDANCE);
  const params: Record<string, string> = {
    ...insight.params,
    failureCause: PROBE_FAILURE_CAUSE[insight.params?.failure ?? ''] ?? PROBE_FAILURE_CAUSE.other,
  };
  const steps = base.steps.map((step) => formatTemplate(step, params));
  if (!isRecommendation(insight) && params.generation) {
    steps.push(formatTemplate(CHANGE_ROLLBACK_STEP, params));
  }
  return { cause: formatTemplate(base.cause, params), steps };
};

// Acknowledge fits every active card, Dismiss only recommendations; Reopen clears either.
export const triageActions = (
  insight: Pick<Insight, 'status' | 'triage'> & { category?: string },
): TriageAction[] => {
  if (insight.status === 'resolved') return [];
  if (insight.triage) return ['reopen'];
  return isRecommendation(insight) ? ['acknowledge', 'dismiss'] : ['acknowledge'];
};

// A `field.path: value` a step asks to set, e.g. securityContext.runAsNonRoot: true.
const FIELD_SETTING = /\b([a-z]+(?:[A-Z][a-zA-Z]*|\.[a-zA-Z]+)+): ([\w%/-]+)/;

export const copyableSetting = (step: string): string | null => {
  const match = FIELD_SETTING.exec(step);
  return match ? `${match[1]}: ${match[2]}` : null;
};
