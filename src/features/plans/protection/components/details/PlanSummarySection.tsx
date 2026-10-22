import React, { memo, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Tag, Tooltip } from 'antd';
import { CloseOutlined, EyeOutlined } from '@ant-design/icons';
import {
  DEFAULT_COLORS,
  FONT_SIZE,
  MONOSPACE_CLASS,
  NONE_TEXT,
  SPACING,
  STATUS_COLORS,
  TAG_CLASS,
  TRUNCATE_STYLE,
} from '../../../../../constants';
import SettingsCard from '../../../../settings/components/SettingsCard';
import {
  ColumnShell,
  DateAndAge,
  MutedText,
  SummaryBlock,
  SummaryColumns,
  type KeyValueGridRow,
} from '../../../../../components/display/details';
import { getCurrentUser } from '../../../../auth/utils';
import type { RootState } from '../../../../../store';
import { useUsernamesByIds } from '../../../../../hooks/useUsernamesByIds';
import {
  POLICY_CHIP_LABEL,
  PROTECTION_PLANS_CONSTANTS as PPC,
} from '../../constants/protectionPlans';
import { usePlanTaxonomies } from '../../hooks/usePlanTaxonomies';
import type { PlanHealth, PlanMode, PlanPolicy, ProtectionPlan } from '../../models';
import { APPROVABLE_PHASES, getDecideBlockedTooltip, liveWindow } from '../../utils/phaseRules';
import { encodeResourceKey } from '../../utils/planFormValues';
import { formatRepeatRule } from '../../utils/repeatRule';
import { formatZonedWindowRange } from '../../utils/windowRange';
import PlanHealthStatus from '../shared/PlanHealthStatus';

const { CARD, DETAIL_PAGE, EXECUTION_LABELS, MODE_LABELS } = PPC.LABELS;
const { FIELDS, SECTIONS } = DETAIL_PAGE;
const { FORM, SEVERITY_OPTIONS } = PPC.CREATE_PAGE;

const none = <MutedText value={NONE_TEXT} />;

const TAG_ROW_STYLE: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: SPACING.XS };

interface TagItem {
  key: string;
  text: string;
}

const PILL_CLASS = `${TAG_CLASS.XSMALL} ${TAG_CLASS.AS_IS}`;

// Every chip, untruncated, at the Applications summary's tag size.
const tagsOrNone = (tags: TagItem[]) =>
  tags.length === 0 ? (
    none
  ) : (
    <span style={TAG_ROW_STYLE}>
      {tags.map((tag) => (
        <Tag key={tag.key} className={PILL_CLASS}>
          {tag.text}
        </Tag>
      ))}
    </span>
  );

const asTags = (names: string[]): TagItem[] => names.map((name) => ({ key: name, text: name }));

type NameOf = (id: string) => string | undefined;

const ACTOR_STYLE: React.CSSProperties = {
  ...TRUNCATE_STYLE,
  display: 'inline-block',
  maxWidth: '100%',
  verticalAlign: 'bottom',
};

// Like the Applications summary: nothing until the username arrives, never the raw id, which
// goes in the hover with the full name.
const Actor: React.FC<{ id: string; nameOf: NameOf }> = ({ id, nameOf }) => {
  const name = nameOf(id);
  const identity = name ? `${name}${CARD.META_SEPARATOR}${id}` : id;
  return (
    <Tooltip title={identity}>
      <span tabIndex={name ? 0 : undefined} aria-label={identity} style={ACTOR_STYLE}>
        {name}
      </span>
    </Tooltip>
  );
};

// "Oct 20, 14:02 · 2d ago by l3-admin2", or only who when the date is missing.
const Moment: React.FC<{ date?: string; actor?: string; nameOf: NameOf }> = ({
  date,
  actor,
  nameOf,
}) => {
  // "by" waits for the username, like the name itself.
  const named = actor !== undefined && nameOf(actor) !== undefined;
  if (!date && !named) return none;
  return (
    <span>
      {date && <DateAndAge date={date} />}
      {named && (
        <>
          {date && ' '}
          {CARD.CREATED_BY_PREFIX} <Actor id={actor} nameOf={nameOf} />
        </>
      )}
    </span>
  );
};

// Disabled buttons take no focus, so why the viewer can't decide is text here too.
const ExecutionValue: React.FC<{ plan: ProtectionPlan }> = ({ plan }) => {
  const blocked = APPROVABLE_PHASES.includes(plan.phase)
    ? getDecideBlockedTooltip(plan, getCurrentUser()?.id ?? '')
    : undefined;
  const label = EXECUTION_LABELS[plan.approvalMode ?? 'automatic'];
  if (!blocked) return <>{label}</>;
  return (
    <span style={{ display: 'grid', rowGap: SPACING.XXS }}>
      {label}
      <MutedText value={blocked} />
    </span>
  );
};

const scheduleText = (plan: ProtectionPlan): string => {
  if (plan.timeMode === 'repeating' && plan.repeat) return formatRepeatRule(plan.repeat);
  if (plan.timeMode === 'time_range' && plan.timeRange) {
    return formatZonedWindowRange(plan.timeRange);
  }
  return FIELDS.PERMANENT;
};

// A running series' open window, or the one it waits for; none opens before approval.
function seriesWindowRows(plan: ProtectionPlan): KeyValueGridRow[] {
  const live = liveWindow(plan);
  if (!live) return [];
  const range = formatZonedWindowRange(live);
  return [
    {
      k: 'window',
      label: plan.phase === 'active' ? CARD.CURRENT_WINDOW_LABEL : CARD.NEXT_WINDOW_LABEL,
      value:
        plan.phase === 'pending_approval'
          ? `${range}${CARD.META_SEPARATOR}${CARD.OPENS_ONCE_APPROVED}`
          : range,
    },
  ];
}

interface HealthArgs {
  health?: PlanHealth;
  notInForce: number;
  onJumpToHealth: () => void;
}

// What the plan does now: mode, health, execution and schedule, then why it stopped.
function stateRows(
  plan: ProtectionPlan,
  { health, notInForce, onJumpToHealth }: HealthArgs,
): KeyValueGridRow[] {
  const ended = plan.phase === 'failed' || plan.phase === 'canceled';
  return [
    { k: 'mode', label: FIELDS.MODE, value: MODE_LABELS[plan.mode] },
    ...(plan.phase === 'active' && health
      ? [
          {
            k: 'health',
            label: FIELDS.HEALTH,
            value: (
              <PlanHealthStatus health={health} notInForce={notInForce} onJump={onJumpToHealth} />
            ),
          },
        ]
      : []),
    { k: 'execution', label: FIELDS.EXECUTION, value: <ExecutionValue plan={plan} /> },
    { k: 'schedule', label: CARD.WINDOW_LABEL, value: scheduleText(plan) },
    ...seriesWindowRows(plan),
    ...(ended && plan.reason ? [{ k: 'reason', label: FIELDS.REASON, value: plan.reason }] : []),
  ];
}

type Taxonomies = ReturnType<typeof usePlanTaxonomies>;
type Category = Taxonomies['kinds'][number];

const categoryName = (id: string | undefined, categories: Category[]): React.ReactNode =>
  categories.find((c) => c.id === id)?.name ?? none;

// How the plan is described and filed.
function detailRows(plan: ProtectionPlan, taxonomies: Taxonomies): KeyValueGridRow[] {
  const tags = (plan.tagRefs ?? []).flatMap((id) => {
    const name = taxonomies.tags.find((c) => c.id === id)?.name;
    return name ? [{ key: id, text: name }] : [];
  });
  const severity = SEVERITY_OPTIONS.find((o) => o.value === plan.severity)?.label ?? plan.severity;
  return [
    { k: 'kind', label: FORM.KIND_LABEL, value: categoryName(plan.kindRef, taxonomies.kinds) },
    {
      k: 'environment',
      label: FORM.ENVIRONMENT_LABEL,
      value: categoryName(plan.environmentRef, taxonomies.environments),
    },
    { k: 'tags', label: FORM.TAGS_LABEL, value: tagsOrNone(tags) },
    { k: 'severity', label: FIELDS.SEVERITY, value: severity || none },
    { k: 'priority', label: FIELDS.PRIORITY, value: plan.priority ?? none },
    { k: 'description', label: FIELDS.DESCRIPTION, value: plan.description || none },
  ];
}

function approvalRows(plan: ProtectionPlan, nameOf: NameOf): KeyValueGridRow[] {
  const { approval } = plan;
  if (!approval) return [];
  const decided = approval.decidedBy
    ? [
        {
          k: 'decided',
          label: approval.state === 'rejected' ? FIELDS.REJECTED : FIELDS.APPROVED,
          value: <Moment date={approval.decidedAt} actor={approval.decidedBy} nameOf={nameOf} />,
        },
      ]
    : [];
  return [
    {
      k: 'requested',
      label: FIELDS.REQUESTED,
      value: <Moment date={approval.requestedAt} actor={approval.requestedBy} nameOf={nameOf} />,
    },
    ...decided,
    ...(approval.comment
      ? [{ k: 'comment', label: FIELDS.DECISION_COMMENT, value: approval.comment }]
      : []),
  ];
}

const Participants: React.FC<{ ids: string[]; nameOf: NameOf }> = ({ ids, nameOf }) =>
  ids.length === 0 ? (
    none
  ) : (
    <span style={{ display: 'grid', rowGap: SPACING.XXS }}>
      {ids.map((id) => (
        <Actor key={id} id={id} nameOf={nameOf} />
      ))}
    </span>
  );

// Who made and moved the plan, in order, then who takes part in it.
function timelineRows(plan: ProtectionPlan, nameOf: NameOf): KeyValueGridRow[] {
  const moment = (k: string, label: string, date?: string, actor?: string) => ({
    k,
    label,
    value: <Moment date={date} actor={actor} nameOf={nameOf} />,
  });
  return [
    moment('created', FIELDS.CREATED, plan.createdAt, plan.createdBy),
    ...(plan.startedAt ? [moment('started', FIELDS.STARTED, plan.startedAt, plan.startedBy)] : []),
    moment('updated', FIELDS.UPDATED, plan.lastUpdatedAt, plan.lastUpdatedBy),
    ...(plan.terminatedAt
      ? [moment('terminated', FIELDS.TERMINATED, plan.terminatedAt, plan.terminatedBy)]
      : []),
    ...approvalRows(plan, nameOf),
    {
      k: 'participants',
      label: FIELDS.PARTICIPANTS,
      value: <Participants ids={plan.participantRefs ?? []} nameOf={nameOf} />,
    },
  ];
}

// What the plan protects, then what it leaves out. Names stay as the API sends them.
function scopeRows(plan: ProtectionPlan): KeyValueGridRow[] {
  const byApplication = plan.scope.type === 'applications';
  const targets = (byApplication ? plan.scope.applicationRefs : plan.scope.namespaces) ?? [];
  const excludedKinds = plan.scope.exclusions?.kinds ?? [];
  const excludedResources = (plan.scope.exclusions?.resources ?? []).map((r) => ({
    key: encodeResourceKey(r),
    text: `${r.kind}${CARD.META_SEPARATOR}${r.namespace}/${r.name}`,
  }));
  return [
    {
      k: 'targets',
      label: byApplication ? FIELDS.APPLICATIONS : FIELDS.NAMESPACES,
      value: tagsOrNone(asTags(targets)),
    },
    ...(excludedKinds.length > 0
      ? [
          {
            k: 'excludedKinds',
            label: FIELDS.EXCLUDED_KINDS,
            value: tagsOrNone(asTags(excludedKinds)),
          },
        ]
      : []),
    ...(excludedResources.length > 0
      ? [
          {
            k: 'excludedResources',
            label: FIELDS.EXCLUDED_RESOURCES,
            value: tagsOrNone(excludedResources),
          },
        ]
      : []),
  ];
}

const POLICY_ROW_STYLE: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  columnGap: SPACING.SM,
  alignItems: 'baseline',
  fontSize: FONT_SIZE.MD,
  color: DEFAULT_COLORS.TEXT_PRIMARY,
};

// What the policy refuses, in the card's words, over its template id.
const PolicyItem: React.FC<{ policy: PlanPolicy; mode: PlanMode }> = ({ policy, mode }) => {
  const label = POLICY_CHIP_LABEL[policy.templateID];
  const params = Object.entries(policy.params ?? {});
  return (
    <div style={POLICY_ROW_STYLE}>
      <span aria-hidden style={{ color: STATUS_COLORS.PLAN_MODE[mode], fontSize: FONT_SIZE.XS }}>
        {mode === 'audit' ? <EyeOutlined /> : <CloseOutlined />}
      </span>
      <span style={{ display: 'grid', rowGap: SPACING.XXS, minWidth: 0 }}>
        <span>{label ?? policy.templateID}</span>
        {label && (
          <span
            className={MONOSPACE_CLASS}
            title={policy.templateID}
            style={{ ...TRUNCATE_STYLE, fontSize: FONT_SIZE.SM, color: DEFAULT_COLORS.TEXT_MUTED }}
          >
            {policy.templateID}
          </span>
        )}
        {params.length > 0 && (
          <span style={TAG_ROW_STYLE}>
            {params.map(([key, value]) => (
              <Tag key={key} className={PILL_CLASS}>
                {`${key}: ${Array.isArray(value) ? value.join(', ') : String(value)}`}
              </Tag>
            ))}
          </span>
        )}
      </span>
    </div>
  );
};

// Every policy the plan deploys, under what the plan does with a matching change.
const PoliciesColumn: React.FC<{ plan: ProtectionPlan }> = ({ plan }) => {
  const policies = plan.policies ?? [];
  const refusal =
    CARD.BLOCKED_LABEL[plan.mode][plan.timeMode === 'permanent' ? 'permanent' : 'window'];
  return (
    <ColumnShell title={SECTIONS.POLICIES_TITLE} aside={<MutedText value={refusal} />}>
      {policies.length === 0 ? (
        none
      ) : (
        <div style={{ display: 'grid', rowGap: SPACING.MD }}>
          {policies.map((policy, index) => (
            <PolicyItem key={`${policy.templateID}-${index}`} policy={policy} mode={plan.mode} />
          ))}
        </div>
      )}
    </ColumnShell>
  );
};

interface PlanSummarySectionProps extends HealthArgs {
  plan: ProtectionPlan;
}

// Columns in reading order, like the application summary: Status above Timeline, Scope above
// Details, then Policies.
const PlanSummarySection: React.FC<PlanSummarySectionProps> = memo(
  ({ plan, health, notInForce, onJumpToHealth }) => {
    const { kinds, environments, tags } = usePlanTaxonomies();
    const users = useSelector((s: RootState) => s.users.users);
    // Participants too: the users list is empty when the page is opened directly.
    const actorIds = useMemo(
      () =>
        [
          plan.createdBy,
          plan.startedBy,
          plan.lastUpdatedBy,
          plan.terminatedBy,
          plan.approval?.requestedBy,
          plan.approval?.decidedBy,
          ...(plan.participantRefs ?? []),
        ].filter((id): id is string => Boolean(id)),
      [plan],
    );
    const usernamesById = useUsernamesByIds(actorIds, true);
    const nameOf: NameOf = useCallback(
      (id) => users.find((u) => u.id === id)?.username ?? usernamesById[id],
      [users, usernamesById],
    );
    // Stable rows keep each KeyValueGrid's memo.
    const status = useMemo(
      () => stateRows(plan, { health, notInForce, onJumpToHealth }),
      [plan, health, notInForce, onJumpToHealth],
    );
    const timeline = useMemo(() => timelineRows(plan, nameOf), [plan, nameOf]);
    const scope = useMemo(() => scopeRows(plan), [plan]);
    const details = useMemo(
      () => detailRows(plan, { kinds, environments, tags }),
      [plan, kinds, environments, tags],
    );

    return (
      <SettingsCard title={SECTIONS.SUMMARY_TITLE}>
        <SummaryColumns
          renderColumns={(stacked) => [
            <React.Fragment key="status">
              <SummaryBlock title={SECTIONS.GROUP_STATUS} rows={status} stacked={stacked} />
              <SummaryBlock title={SECTIONS.GROUP_TIMELINE} rows={timeline} stacked={stacked} />
            </React.Fragment>,
            <React.Fragment key="scope">
              <SummaryBlock title={SECTIONS.SCOPE_TITLE} rows={scope} stacked={stacked} />
              <SummaryBlock title={SECTIONS.GROUP_DETAILS} rows={details} stacked={stacked} />
            </React.Fragment>,
            <PoliciesColumn key="policies" plan={plan} />,
          ]}
        />
      </SettingsCard>
    );
  },
);

PlanSummarySection.displayName = 'PlanSummarySection';

export default PlanSummarySection;
