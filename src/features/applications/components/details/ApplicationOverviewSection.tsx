import React, { memo, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { App as AntdApp, Button, Tooltip } from 'antd';
import { CopyOutlined, WarningOutlined } from '@ant-design/icons';
import {
  APP_ROUTES,
  DEFAULT_COLORS,
  EMPTY_VALUE,
  MONOSPACE_CLASS,
  ROW_ACTION_CLASS,
  ROW_ICON_BUTTON_SIZE,
  TRUNCATE_STYLE,
  UNSTYLED_BUTTON,
  SPACING,
  FONT_SIZE,
} from '../../../../constants';
import SettingsCard from '../../../settings/components/SettingsCard';
import { CardTagList } from '../../../../components/display/card';
import ApplicationChangeActivity from './ApplicationChangeActivity';
import KeyValueGrid, { type KeyValueGridRow } from './KeyValueGrid';
import MutedText from './MutedText';
import DateAndAge from './DateAndAge';
import LabelWithInfo from './LabelWithInfo';
import {
  APPLICATIONS_UI,
  APPLICATION_CARD,
  APPLICATION_COVERAGE_STATES,
  PLAN_LINK_STYLE,
} from '../../constants';
import {
  APPLICATION_SECTION_LAYOUT,
  APPLICATION_WORKLOAD_METRICS,
} from '../../constants/sectionLayout';
import { ColumnShell } from '../../pages/details/contentBlocks';
import type { Application, ApplicationWorkloadUsage } from '../../models';
import { parseCpuToMillicores, parseMemoryToBytes } from '../../utils/k8sQuantity';
import { useUsernamesByIds } from '../../../../hooks/useUsernamesByIds';
import { useApplicationCoverage } from '../../hooks/useApplicationCoverage';
import { useElementWidth } from '../../../../hooks/layout/useElementWidth';
import { getApplicationProtection } from '../../utils/coverage';
import ProtectionBadge from '../protection/ProtectionBadge';
import ProtectButton from '../protection/ProtectButton';
import ApplicationHealthIndicator from '../display/ApplicationHealthIndicator';

const O = APPLICATIONS_UI.SECTIONS.OVERVIEW;
const R = APPLICATIONS_UI.SECTIONS.RUNTIME;
const L = APPLICATION_SECTION_LAYOUT;
const MAX_IMAGES = 8;

const INLINE_ROW_STYLE: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: SPACING.SM,
};

const none = <MutedText value={R.NONE} />;

// The badge first, then each covering plan by name, in the cards' order.
const ProtectionValue: React.FC<{ application: Application }> = ({ application }) => {
  const coverage = useApplicationCoverage()(application);
  if (coverage.noAccess) return <MutedText value={APPLICATION_CARD.COVERAGE.NO_ACCESS} />;
  if (!coverage.known) return <MutedText value={EMPTY_VALUE} />;
  const protection = getApplicationProtection(coverage);
  return (
    <span style={INLINE_ROW_STYLE}>
      <ProtectionBadge protection={protection} />
      {APPLICATION_COVERAGE_STATES.flatMap((state) =>
        coverage[state].map((name) => (
          <Link
            key={name}
            to={APP_ROUTES.PROTECTION_PLAN_DETAILS.replace(':name', encodeURIComponent(name))}
            title={name}
            style={PLAN_LINK_STYLE}
          >
            {name}
          </Link>
        )),
      )}
      {protection === 'none' && <ProtectButton application={application} />}
    </span>
  );
};

const ActorName: React.FC<{ actor: string }> = ({ actor }) => {
  const ids = useMemo(() => [actor], [actor]);
  const usernamesById = useUsernamesByIds(ids, true);
  // The short name is the identity's last segment: hover and focus show the whole one.
  return (
    <Tooltip title={actor}>
      <span tabIndex={0} aria-label={actor}>
        {usernamesById[actor]}
      </span>
    </Tooltip>
  );
};

interface Pressure {
  resource: string;
  workload: string;
  percent: number;
}

// The fullest workload at or above the meters' danger share of its limit, like Resource usage shows.
function worstPressure(
  workloads: ApplicationWorkloadUsage[],
  resource: string,
  ratioOf: (workload: ApplicationWorkloadUsage) => number | null,
): Pressure | null {
  let worst: Pressure | null = null;
  for (const workload of workloads) {
    const ratio = workload.usage?.available ? ratioOf(workload) : null;
    const percent = ratio == null ? 0 : Math.round(ratio * 100);
    if (
      ratio != null &&
      ratio >= APPLICATION_WORKLOAD_METRICS.DANGER_RATIO &&
      percent > (worst?.percent ?? 0)
    ) {
      worst = { resource, workload: workload.resourceName, percent };
    }
  }
  return worst;
}

const usageRatio = (used: number | null, limit: number | null): number | null =>
  used != null && limit != null && limit > 0 ? used / limit : null;

function findPressures(application: Application): Pressure[] {
  const workloads = application.metrics?.workloads ?? [];
  return [
    worstPressure(workloads, O.PRESSURE_CPU, (w) =>
      usageRatio(
        parseCpuToMillicores(w.usage?.resources?.totalCpu),
        parseCpuToMillicores(w.baseline?.limits?.cpu),
      ),
    ),
    worstPressure(workloads, O.PRESSURE_MEMORY, (w) =>
      usageRatio(
        parseMemoryToBytes(w.usage?.resources?.totalMemory),
        parseMemoryToBytes(w.baseline?.limits?.memory),
      ),
    ),
  ].filter((pressure): pressure is Pressure => pressure != null);
}

const PressureValue: React.FC<{ pressure: Pressure }> = ({ pressure }) => (
  <Tooltip title={O.PRESSURE_TOOLTIP(pressure.workload, pressure.resource, pressure.percent)}>
    <span
      tabIndex={0}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: SPACING.S6,
        color: DEFAULT_COLORS.WARNING,
        whiteSpace: 'nowrap',
      }}
    >
      <WarningOutlined aria-hidden />
      {O.PRESSURE(pressure.resource, pressure.percent)}
    </span>
  </Tooltip>
);

const HealthValue: React.FC<{ application: Application }> = ({ application }) => (
  <span style={INLINE_ROW_STYLE}>
    <ApplicationHealthIndicator status={application.health?.status} />
    {application.health?.reason ? (
      <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>{application.health.reason}</span>
    ) : null}
    {findPressures(application).map((pressure) => (
      <PressureValue key={pressure.resource} pressure={pressure} />
    ))}
  </span>
);

// Quiet: the API compares with the first recorded state, not a desired one, so a change is history.
const DriftValue: React.FC<{ drifted: boolean }> = ({ drifted }) =>
  drifted ? (
    <Tooltip title={O.DRIFT_CHANGED_TOOLTIP}>
      <span tabIndex={0}>{O.DRIFT_CHANGED}</span>
    </Tooltip>
  ) : (
    <>{O.DRIFT_NONE}</>
  );

function buildStatusRows(application: Application): KeyValueGridRow[] {
  const ready = application.health?.readyReplicas ?? 0;
  const total = application.health?.totalReplicas ?? 0;
  return [
    {
      k: 'protection',
      label: APPLICATION_CARD.COVERAGE.LABEL,
      value: <ProtectionValue application={application} />,
    },
    {
      k: 'health',
      label: APPLICATIONS_UI.CARD.LABELS.HEALTH,
      value: <HealthValue application={application} />,
    },
    {
      k: 'drift',
      label: O.DRIFT,
      value: <DriftValue drifted={Boolean(application.history?.hasDrift)} />,
    },
    { k: 'replicas', label: O.REPLICAS, value: O.REPLICAS_READY(ready, total) },
  ];
}

function buildManagedRows(application: Application): KeyValueGridRow[] {
  const managedBy = O.MANAGED_BY_LABELS[application.managed?.by ?? ''];
  if (!managedBy) return [];
  const { chart, version } = application.managed;
  return [
    { k: 'managedBy', label: APPLICATIONS_UI.CARD.LABELS.MANAGED_BY, value: managedBy },
    ...(chart ? [{ k: 'chart', label: O.CHART, value: chart }] : []),
    ...(version ? [{ k: 'version', label: O.APP_VERSION, value: version }] : []),
  ];
}

function buildSourceRows(application: Application): KeyValueGridRow[] {
  const namespaces = (application.namespaces?.items ?? []).map((n) => n.name);
  return [
    ...(application.description
      ? [
          {
            k: 'description',
            label: APPLICATIONS_UI.EDIT_PAGE.DESCRIPTION_LABEL,
            value: application.description,
          },
        ]
      : []),
    {
      k: 'namespace',
      label: namespaces.length > 1 ? O.NAMESPACE.other : O.NAMESPACE.one,
      value:
        namespaces.length === 0 ? (
          none
        ) : (
          <span style={{ display: 'flex', flexWrap: 'wrap', gap: SPACING.XS }}>
            <CardTagList tags={namespaces} />
          </span>
        ),
    },
    ...buildManagedRows(application),
  ];
}

const LastChangeValue: React.FC<{ application: Application }> = ({ application }) => {
  const at = application.history?.lastModifiedAt;
  const by = application.history?.lastModifiedBy;
  if (!at) return <MutedText value={O.NO_CHANGE_RECORDED} />;
  return (
    <span>
      <DateAndAge date={at} />
      {by ? (
        <>
          {' '}
          {O.CHANGED_BY} <ActorName actor={by} />
        </>
      ) : null}
    </span>
  );
};

function buildTimelineRows(application: Application): KeyValueGridRow[] {
  const dated = (date: string | undefined) => (date ? <DateAndAge date={date} /> : none);
  return [
    { k: 'created', label: O.CREATED, value: dated(application.createdAt) },
    {
      k: 'newestResource',
      label: <LabelWithInfo label={O.NEWEST_RESOURCE} info={O.NEWEST_RESOURCE_TOOLTIP} />,
      value: dated(application.lastUpdated),
    },
    { k: 'lastChange', label: O.LAST_CHANGE, value: <LastChangeValue application={application} /> },
  ];
}

const ImageLine: React.FC<{ image: string }> = ({ image }) => {
  const { message } = AntdApp.useApp();
  const handleCopy = () => {
    navigator.clipboard.writeText(image).then(
      () => message.success(R.COPIED),
      () => message.error(R.COPY_FAILED),
    );
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.XXS, minWidth: 0 }}>
      <span
        className={MONOSPACE_CLASS}
        title={image}
        style={{ ...TRUNCATE_STYLE, fontSize: FONT_SIZE.SM }}
      >
        {image}
      </span>
      <Tooltip title={R.COPY_IMAGE_TOOLTIP}>
        <Button
          type="text"
          icon={<CopyOutlined />}
          aria-label={R.COPY_IMAGE_LABEL(image)}
          onClick={handleCopy}
          style={{
            width: ROW_ICON_BUTTON_SIZE,
            height: ROW_ICON_BUTTON_SIZE,
            flexShrink: 0,
            color: DEFAULT_COLORS.TEXT_MUTED,
          }}
        />
      </Tooltip>
    </div>
  );
};

const ImagesValue: React.FC<{ images: string[] }> = ({ images }) => {
  if (images.length === 0) return none;
  return (
    <div style={{ display: 'grid', minWidth: 0 }}>
      {images.slice(0, MAX_IMAGES).map((img) => (
        <ImageLine key={img} image={img} />
      ))}
      {images.length > MAX_IMAGES ? (
        <MutedText
          value={`${APPLICATIONS_UI.SECTIONS.RESOURCES.SHOWING_FIRST} ${MAX_IMAGES} of ${images.length}.`}
        />
      ) : null}
    </div>
  );
};

// Names only: the API sends no values, and names that look secret never reach it.
const EnvVarKeysValue: React.FC<{ keys: string[] }> = ({ keys }) => {
  const [expanded, setExpanded] = useState(false);
  if (keys.length === 0) return none;
  const hiddenCount = keys.length > L.ENV_MAX_VISIBLE ? keys.length - (L.ENV_MAX_VISIBLE - 1) : 0;
  const shownKeys = expanded || hiddenCount === 0 ? keys : keys.slice(0, L.ENV_MAX_VISIBLE - 1);
  return (
    <div style={{ display: 'grid', rowGap: SPACING.S6, minWidth: 0 }}>
      <span>
        {keys.length} {keys.length === 1 ? R.ENV_VAR_COUNT.one : R.ENV_VAR_COUNT.other}
      </span>
      <div style={{ display: 'grid', rowGap: SPACING.XXS, minWidth: 0 }}>
        {shownKeys.map((key) => (
          <span
            key={key}
            className={MONOSPACE_CLASS}
            title={key}
            style={{ ...TRUNCATE_STYLE, fontSize: FONT_SIZE.SM, color: DEFAULT_COLORS.TEXT_MUTED }}
          >
            {key}
          </span>
        ))}
        {hiddenCount > 0 ? (
          <button
            type="button"
            className={ROW_ACTION_CLASS}
            aria-expanded={expanded}
            aria-label={expanded ? undefined : R.ENV_SHOW_MORE_LABEL(hiddenCount)}
            onClick={() => setExpanded((prev) => !prev)}
            style={{
              ...PLAN_LINK_STYLE,
              ...UNSTYLED_BUTTON,
              justifySelf: 'start',
              fontSize: FONT_SIZE.SM,
            }}
          >
            {expanded ? R.ENV_SHOW_LESS : `+${hiddenCount}`}
          </button>
        ) : null}
      </div>
    </div>
  );
};

function buildRuntimeRows(application: Application): KeyValueGridRow[] {
  const ports = application.ports || [];
  return [
    { k: 'images', label: R.IMAGES, value: <ImagesValue images={application.images || []} /> },
    {
      k: 'ports',
      label: R.PORTS,
      value: ports.length === 0 ? none : ports.join(R.PORT_SEPARATOR),
    },
    {
      k: 'env',
      label: R.ENV_VAR_KEYS,
      value: <EnvVarKeysValue keys={application.envVarKeys || []} />,
    },
  ];
}

const SummaryBlock: React.FC<{ title: string; rows: KeyValueGridRow[]; stacked: boolean }> = ({
  title,
  rows,
  stacked,
}) => (
  <ColumnShell title={title}>
    {/* Narrower than a label beside its value: each label goes above its value instead. */}
    <KeyValueGrid compact={!stacked} plainLabels rows={rows} />
  </ColumnShell>
);

// A column after the first in its row starts with a divider, centered in the column gap.
const SummaryColumn: React.FC<{ divided: boolean; children: React.ReactNode }> = ({
  divided,
  children,
}) => (
  <div
    style={{
      minWidth: 0,
      display: 'grid',
      alignContent: 'start',
      rowGap: L.SUMMARY_ROW_GAP_PX,
      ...(divided && {
        borderLeft: `1px solid ${DEFAULT_COLORS.BORDER_DEFAULT}`,
        paddingLeft: L.SUMMARY_COLUMN_GAP_PX / 2,
      }),
    }}
  >
    {children}
  </div>
);

// Read from the card's measured width, since the sidebar changes it without the viewport.
const summaryColumns = (width: number): number => {
  const span = (columns: number) =>
    columns * L.SUMMARY_BLOCK_MIN_WIDTH_PX + (columns - 1) * L.SUMMARY_COLUMN_GAP_PX;
  if (width >= span(3)) return 3;
  if (width >= span(2)) return 2;
  return 1;
};

// Columns in reading order: Status (with the namespace and its manager) above Timeline, Runtime,
// then Change activity.
const ApplicationOverviewSection: React.FC<{ application: Application }> = memo(
  ({ application }) => {
    const { ref, width } = useElementWidth<HTMLDivElement>();
    const stacked = width > 0 && width < L.SUMMARY_BLOCK_MIN_WIDTH_PX;
    const columns = summaryColumns(width);
    const content = [
      <React.Fragment key="status">
        <SummaryBlock
          title={O.GROUP_STATUS}
          rows={[...buildStatusRows(application), ...buildSourceRows(application)]}
          stacked={stacked}
        />
        <SummaryBlock
          title={O.GROUP_TIMELINE}
          rows={buildTimelineRows(application)}
          stacked={stacked}
        />
      </React.Fragment>,
      <SummaryBlock
        key="runtime"
        title={O.GROUP_RUNTIME}
        rows={buildRuntimeRows(application)}
        stacked={stacked}
      />,
      <ApplicationChangeActivity key="activity" application={application} stacked={stacked} />,
    ];
    return (
      <SettingsCard title={O.TITLE}>
        <div
          ref={ref}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            columnGap: L.SUMMARY_COLUMN_GAP_PX / 2,
            rowGap: L.SUMMARY_ROW_GAP_PX,
          }}
        >
          {content.map((column, index) => (
            <SummaryColumn key={column.key} divided={index % columns !== 0}>
              {column}
            </SummaryColumn>
          ))}
        </div>
      </SettingsCard>
    );
  },
);

ApplicationOverviewSection.displayName = 'ApplicationOverviewSection';

export default ApplicationOverviewSection;
