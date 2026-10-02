import React, { memo, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, App as AntdApp, Button, Collapse, Tooltip } from 'antd';
import type { CollapseProps } from 'antd';
import {
  CheckOutlined,
  CopyOutlined,
  DownOutlined,
  EyeInvisibleOutlined,
  UndoOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { APP_ROUTES, DEFAULT_COLORS, ROW_ICON_BUTTON_SIZE } from '../../../constants';
import { AnimationWrapper, ExpandPanelButton } from '../../../components/display/panels/slide-out';
import { FancySpinner } from '../../../components/animation';
import RowTag from '../../../components/display/table/RowTag';
import TimeAgo from '../../../components/display/time/TimeAgo';
import { ACTION_PERMISSIONS, usePermission } from '../../auth/hooks/permissions/permissionEngine';
import { INSIGHTS_UI as T } from '../constants/texts';
import { AiOutlineQuestionCircle, AiOutlineTool } from 'react-icons/ai';
import { RESOLVES_ON_ITS_OWN } from '../constants/guidance';
import {
  CLUSTER_INSIGHTS,
  INSIGHT_CONFIDENCE_LABELS,
  INSIGHT_KIND_LABELS,
  INSIGHT_PARAM_LABELS,
  INSIGHT_ROW_STATE_LABELS,
  INSIGHT_SEVERITY_LABELS,
  INSIGHTS_STALE_MS,
  insightErrorMessage,
  RUNTIME_BANNER_TEXT,
  SEVERITY_COLORS,
} from '../constants/insights';
import { useApplicationInsights } from '../hooks/useApplicationInsights';
import { useEffectiveRun } from '../hooks/useEffectiveRun';
import {
  copyableSetting,
  isRecommendation,
  resolveInsightGuidance,
  triageActions,
} from '../utils/guidance';
import { byPriority } from '../utils/run';
import { insightRowState } from './InsightsTable';
import RunLine, { SetupReviewLine } from './RunLine';
import {
  cardStyle,
  Fact,
  FindingRow,
  InsightCard,
  labelStyle,
  mutedStyle,
  oneLine,
  Section,
  Steps,
  textStyle,
  tilesStyle,
} from './InsightPanelSections';
import type { Insight, InsightCategory, InsightRow, TriageAction } from '../models';

const P = T.PANEL;
const MESSAGE_PARAM = 'message';
const { analyze: ANALYZE_PERMISSION, triage: TRIAGE_PERMISSION } = ACTION_PERMISSIONS.insights;

// Compact disclosures: no ghost-panel padding and no gap between rows.
const collapseStyles = {
  header: { padding: '6px 0', alignItems: 'center', color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED },
  body: { padding: '4px 0 12px' },
};
const unsetButton: React.CSSProperties = { all: 'unset', cursor: 'pointer' };

// Shown in the context card, so Details does not repeat them.
const FACT_PARAMS = new Set(['message', 'namespace', 'workload', 'kind']);

const chip = (text: string, accent?: string) => (
  <RowTag key={text} text={text} accent={accent} capitalize={false} />
);

const CopyButton: React.FC<{ value: string }> = ({ value }) => {
  const { message } = AntdApp.useApp();
  return (
    <Tooltip title={`${P.COPY} ${value}`}>
      <button
        type="button"
        aria-label={`${P.COPY} ${value}`}
        style={{ ...unsetButton, color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED, marginLeft: 6 }}
        onClick={() => {
          globalThis.navigator.clipboard.writeText(value).then(
            () => void message.success(P.COPIED),
            () => undefined,
          );
        }}
      >
        <CopyOutlined />
      </button>
    </Tooltip>
  );
};

const Guidance: React.FC<{ insight: Insight }> = ({ insight }) => {
  const guidance = resolveInsightGuidance(insight);
  if (!guidance) return null;
  return (
    <>
      {guidance.cause ? (
        <Section icon={<AiOutlineQuestionCircle />} label={T.WHY}>
          <div style={textStyle}>{guidance.cause}</div>
        </Section>
      ) : null}
      <Section icon={<AiOutlineTool />} label={T.WHAT_TO_DO}>
        <Steps
          steps={guidance.steps.map((step) => {
            const setting = copyableSetting(step);
            return (
              <>
                {step}
                {setting ? <CopyButton value={setting} /> : null}
              </>
            );
          })}
          note={isRecommendation(insight) ? undefined : RESOLVES_ON_ITS_OWN}
        />
      </Section>
    </>
  );
};

const Details: React.FC<{ insight: Insight }> = ({ insight }) => {
  const params = insight.params ?? {};
  const rows: [string, string][] = Object.entries(params)
    .filter(([key]) => !FACT_PARAMS.has(key))
    .map(([key, value]) => [INSIGHT_PARAM_LABELS[key] ?? key, value]);
  rows.push(
    [T.CONFIDENCE, INSIGHT_CONFIDENCE_LABELS[insight.confidence]],
    [T.RUNS, String(insight.runs)],
  );
  const blockStyle: React.CSSProperties = {
    ...textStyle,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 12px',
    borderRadius: 8,
    background: DEFAULT_COLORS.CHIP_ON_SURFACE_BG,
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={tilesStyle}>
        {rows.map(([label, value]) => (
          <Fact key={label} label={label} hint={value}>
            {value}
          </Fact>
        ))}
      </div>
      {insight.evidence.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={labelStyle}>{T.EVIDENCE}</span>
          <div style={blockStyle}>
            {insight.evidence.map((e) => (
              <span key={e.ref} style={oneLine} title={e.ref}>
                {e.ref}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      {params[MESSAGE_PARAM] ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={labelStyle}>{T.MESSAGE}</span>
          <div style={{ ...blockStyle, whiteSpace: 'pre-wrap' }}>{params[MESSAGE_PARAM]}</div>
        </div>
      ) : null}
    </div>
  );
};

const TRIAGE_ACTION_LABELS: Record<TriageAction, string> = {
  acknowledge: T.ACKNOWLEDGE,
  dismiss: T.DISMISS,
  reopen: T.REOPEN,
};

// Like the snapshot row's view/rollback actions: borderless, muted, square.
const triageButtonStyle: React.CSSProperties = {
  width: ROW_ICON_BUTTON_SIZE,
  height: ROW_ICON_BUTTON_SIZE,
  color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
};

// The same icons as the bulk actions of the toolbar.
const TRIAGE_ACTION_ICONS: Record<TriageAction, React.ReactNode> = {
  acknowledge: <CheckOutlined />,
  dismiss: <EyeInvisibleOutlined />,
  reopen: <UndoOutlined />,
};

const TriageButtons: React.FC<{
  insight: Insight;
  onTriage: (id: string, action: TriageAction) => Promise<void>;
}> = ({ insight, onTriage }) => {
  const [pending, setPending] = useState<TriageAction | null>(null);
  const run = async (action: TriageAction): Promise<void> => {
    setPending(action);
    await onTriage(insight.id, action);
    setPending(null);
  };
  return (
    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
      {triageActions(insight).map((action) => (
        <Tooltip key={action} title={TRIAGE_ACTION_LABELS[action]}>
          <Button
            size="small"
            type="text"
            style={triageButtonStyle}
            aria-label={TRIAGE_ACTION_LABELS[action]}
            icon={TRIAGE_ACTION_ICONS[action]}
            loading={pending === action}
            disabled={pending !== null}
            onClick={() => void run(action)}
          />
        </Tooltip>
      ))}
    </div>
  );
};

// What the insight is and what happened, then where and when: all of it before the guidance.
const Summary: React.FC<{
  insight: Insight;
  namespace: string;
  app: string;
  rowStale?: boolean;
  actions: React.ReactNode;
}> = ({ insight, namespace, app, rowStale, actions }) => {
  const [now] = useState(Date.now);
  // The list row carries the server's stale window; only a deep link without a row estimates it.
  const stale =
    rowStale ??
    (insight.status !== 'resolved' && now - Date.parse(insight.lastSeenAt) > INSIGHTS_STALE_MS);
  const state = insightRowState({ stale, status: insight.status });
  const triaged = insight.triage;
  // An application can span namespaces; the card names the one its workload runs in.
  const where = insight.params?.namespace || namespace;
  const accent = SEVERITY_COLORS[insight.severity];
  return (
    <>
      <InsightCard
        title={insight.title}
        summary={insight.summary}
        actions={actions}
        chips={
          <>
            {chip(INSIGHT_SEVERITY_LABELS[insight.severity], accent)}
            {chip(INSIGHT_KIND_LABELS[insight.kind] ?? insight.kind)}
            {chip(INSIGHT_ROW_STATE_LABELS[state])}
            {triaged ? chip(triaged.state === 'dismissed' ? T.DISMISSED : T.ACKNOWLEDGED) : null}
          </>
        }
        facts={
          <>
            <Fact label={P.APPLICATION} hint={app}>
              <Link
                to={APP_ROUTES.APPLICATION_DETAILS.replace(':name', encodeURIComponent(app))}
                style={{ color: DEFAULT_COLORS.TEXT_ON_SURFACE, fontWeight: 700 }}
              >
                {app}
              </Link>
            </Fact>
            <Fact label={P.NAMESPACE} hint={where}>
              {where}
            </Fact>
            <Fact label={P.WORKLOAD} hint={insight.subject}>
              {insight.subject}
            </Fact>
          </>
        }
        milestones={[
          {
            label: T.FIRST_SEEN,
            value: <TimeAgo date={insight.firstSeenAt} />,
            reached: true,
            color: accent,
          },
          {
            label: T.LAST_SEEN,
            value: <TimeAgo date={insight.lastSeenAt} />,
            reached: true,
            color: accent,
          },
          {
            label: P.RESOLVED,
            value: insight.resolvedAt ? <TimeAgo date={insight.resolvedAt} /> : T.EMPTY_VALUE,
            reached: Boolean(insight.resolvedAt),
            color: DEFAULT_COLORS.SUCCESS,
          },
        ]}
      />
    </>
  );
};

// A triage the analyzer accepted, so the list can show it before its index refreshes.
export interface PanelTriage {
  id: string;
  action: TriageAction;
}

interface BodyProps {
  namespace: string;
  app: string;
  id: string;
  row?: InsightRow;
  onSelect: (id: string, namespace: string, app: string, category: InsightCategory) => void;
  onChanged: (triaged?: PanelTriage) => void;
}

// Keyed by application: switching apps starts from an empty document, never the previous one.
const PanelBody: React.FC<BodyProps> = ({ namespace, app, id, row, onSelect, onChanged }) => {
  const {
    insights: doc,
    runtime,
    isLoading,
    loadFailed,
    error,
    analyze,
    triage,
  } = useApplicationInsights(namespace, app);
  const analyzeAllowed = usePermission(
    ANALYZE_PERMISSION.scope,
    ANALYZE_PERMISSION.level,
    ANALYZE_PERMISSION.deny,
  );
  const canTriage = usePermission(
    TRIAGE_PERMISSION.scope,
    TRIAGE_PERMISSION.level,
    TRIAGE_PERMISSION.deny,
  );
  const [submitting, setSubmitting] = useState(false);
  const run = useEffectiveRun(doc?.lastRun);
  const insight = doc?.insights.find((i) => i.id === id);
  const others = useMemo(
    () => (doc?.insights ?? []).filter((i) => i.id !== id).sort(byPriority),
    [doc, id],
  );

  if (!doc && isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
        <FancySpinner size={20} />
      </div>
    );
  }

  const inProgress = run?.status === 'queued' || run?.status === 'running';
  // Fast mode analyzes with rules alone, so the runtime state does not gate it.
  const fastMode = runtime?.mode === 'fast';
  const canAnalyze =
    analyzeAllowed && (fastMode || runtime?.state === 'ready') && !inProgress && !submitting;
  const runError = run?.status === 'failed' ? insightErrorMessage(run.error) : null;

  const onAnalyze = async (): Promise<void> => {
    setSubmitting(true);
    await analyze();
    setSubmitting(false);
  };
  const onTriage = async (iid: string, action: TriageAction): Promise<void> => {
    const ok = await triage(iid, action);
    onChanged(ok ? { id: iid, action } : undefined);
  };

  // One stack of disclosures, no gap between them.
  const disclosures: CollapseProps['items'] = [
    ...(insight
      ? [
          {
            key: 'details',
            label: <span style={labelStyle}>{T.DETAILS}</span>,
            children: <Details insight={insight} />,
          },
        ]
      : []),
    {
      key: 'analysis',
      label: <span style={labelStyle}>{P.ANALYSIS}</span>,
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div
            style={{
              ...cardStyle,
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div
              style={{
                minHeight: CLUSTER_INSIGHTS.LINE_MIN_HEIGHT_PX,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <RunLine run={run} light />
              {/* A failed read without a document is unknown, not "never reviewed". */}
              {doc || !loadFailed ? (
                <SetupReviewLine at={doc?.lastReviewAt} style={mutedStyle} />
              ) : null}
            </div>
            {analyzeAllowed ? (
              <Button
                type="primary"
                loading={submitting}
                disabled={!canAnalyze}
                onClick={() => void onAnalyze()}
              >
                {T.ANALYZE_BUTTON}
              </Button>
            ) : null}
          </div>
          {runtime && runtime.state !== 'ready' ? (
            <Alert
              type="warning"
              showIcon
              title={fastMode ? T.RUNTIME_BANNER_RULES_ONLY : RUNTIME_BANNER_TEXT[runtime.state]}
            />
          ) : null}
        </div>
      ),
    },
    ...(others.length
      ? [
          {
            key: 'others',
            label: (
              <span style={labelStyle}>
                {P.OTHER_FINDINGS.replace('{count}', String(others.length))}
              </span>
            ),
            children: (
              <div style={{ ...cardStyle, padding: 4, display: 'flex', flexDirection: 'column' }}>
                {others.map((other) => (
                  <FindingRow
                    key={other.id}
                    severity={other.severity}
                    title={other.title}
                    trailing={
                      other.status === 'resolved' ? INSIGHT_ROW_STATE_LABELS.resolved : undefined
                    }
                    onClick={() => onSelect(other.id, namespace, app, other.category ?? 'incident')}
                  />
                ))}
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {insight ? (
        <>
          <Summary
            insight={insight}
            namespace={namespace}
            app={app}
            rowStale={row?.stale}
            actions={
              canTriage && triageActions(insight).length ? (
                <TriageButtons insight={insight} onTriage={onTriage} />
              ) : null
            }
          />
          <Guidance insight={insight} />
        </>
      ) : !doc && loadFailed ? (
        <Alert type="error" showIcon title={P.LOAD_FAILED} />
      ) : (
        <Alert type="info" showIcon title={row ? `${row.title}: ${P.NOT_FOUND}` : P.NOT_FOUND} />
      )}
      {/* Outside the disclosures: a failed triage must show even while they are folded. */}
      {error && error !== runError ? <Alert type="error" showIcon title={error} /> : null}
      <Collapse ghost styles={collapseStyles} items={disclosures} />
    </div>
  );
};

export interface InsightTarget {
  id: string;
  namespace: string;
  app: string;
  row?: InsightRow;
  // Set when the insight may belong to the other tab (opened from "Other findings").
  category?: InsightCategory;
}

interface Props {
  target: InsightTarget | null;
  // The tab's category, for a target that does not carry its own.
  category: InsightCategory;
  // Position in the list on screen; null when the insight is not on this page.
  position: { index: number; total: number } | null;
  onPrevious?: () => void;
  onNext?: () => void;
  onClose: () => void;
  onSelect: BodyProps['onSelect'];
  onChanged: BodyProps['onChanged'];
}

const KEY_ACTIONS: Partial<Record<string, 'close' | 'next' | 'previous'>> = {
  Escape: 'close',
  ArrowDown: 'next',
  j: 'next',
  ArrowUp: 'previous',
  k: 'previous',
};

const isTyping = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement &&
  Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));

const navButton = (label: string, icon: React.ReactNode, onClick?: () => void) => (
  <Tooltip title={label}>
    <button
      type="button"
      aria-label={label}
      disabled={!onClick}
      onClick={onClick}
      style={{
        ...unsetButton,
        cursor: onClick ? 'pointer' : 'not-allowed',
        color: onClick ? DEFAULT_COLORS.TEXT_ON_SURFACE : DEFAULT_COLORS.TEXT_ON_SURFACE_DISABLED,
        padding: 4,
      }}
    >
      {icon}
    </button>
  </Tooltip>
);

const InsightDetailsPanel: React.FC<Props> = memo(
  ({ target, category, position, onPrevious, onNext, onClose, onSelect, onChanged }) => {
    const [expanded, setExpanded] = useState(false);
    useEffect(() => {
      if (!target) return undefined;
      const onKey = (e: KeyboardEvent): void => {
        if (isTyping(e.target)) return;
        const name = KEY_ACTIONS[e.key];
        const action = name ? { close: onClose, next: onNext, previous: onPrevious }[name] : null;
        if (!action) return;
        e.preventDefault();
        action();
      };
      globalThis.addEventListener('keydown', onKey);
      return () => globalThis.removeEventListener('keydown', onKey);
    }, [target, onClose, onNext, onPrevious]);

    return (
      <AnimationWrapper
        open={target !== null}
        onClose={onClose}
        title={
          (target?.category ?? category) === 'recommendation'
            ? P.TITLE_RECOMMENDATION
            : P.TITLE_INCIDENT
        }
        width={expanded ? CLUSTER_INSIGHTS.PANEL_WIDTH_EXPANDED : CLUSTER_INSIGHTS.PANEL_WIDTH}
        headerExtra={
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {position ? (
              <span style={mutedStyle}>
                {P.POSITION.replace('{index}', String(position.index + 1)).replace(
                  '{total}',
                  String(position.total),
                )}
              </span>
            ) : null}
            {navButton(P.PREVIOUS, <UpOutlined />, onPrevious)}
            {navButton(P.NEXT, <DownOutlined />, onNext)}
            <ExpandPanelButton expanded={expanded} onToggle={() => setExpanded((e) => !e)} />
          </div>
        }
      >
        {target ? (
          <PanelBody
            key={`${target.namespace}/${target.app}`}
            namespace={target.namespace}
            app={target.app}
            id={target.id}
            row={target.row}
            onSelect={onSelect}
            onChanged={onChanged}
          />
        ) : null}
      </AnimationWrapper>
    );
  },
);
InsightDetailsPanel.displayName = 'InsightDetailsPanel';

export default InsightDetailsPanel;
