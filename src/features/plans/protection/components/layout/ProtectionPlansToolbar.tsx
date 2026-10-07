import React, { useMemo } from 'react';
import { FlagOutlined, SearchOutlined, TagOutlined } from '@ant-design/icons';
import {
  DEFAULT_COLORS,
  Icons,
  LIST_TOOLBAR,
  STATUS_COLORS,
  TOOLBAR_CONTROL,
  getQuickFilterPillColors,
} from '../../../../../constants';
import { CompactQuickFilter, ListToolbar } from '../../../../../components/display/toolbar';
import { usePermission, ACTION_PERMISSIONS } from '../../../../auth/hooks';
import type { ToolbarConfig } from '../../../../../interfaces/layout/toolbar';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import type { PlanPhase, PlanPhaseQuickFilter, PlanViewMode } from '../../models';

interface ProtectionPlansToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCreatePlanClick: () => void;
  onOpenFilters: () => void;
  phaseQuickFilter: PlanPhaseQuickFilter;
  onPhaseQuickFilterChange: (next: PlanPhaseQuickFilter) => void;
  phaseCounts: Record<PlanPhaseQuickFilter, number>;
  totalCount: number;
  onViewModeChange: (mode: Exclude<PlanViewMode, 'plans'>) => void;
}

const PHASE_PILLS: { key: PlanPhaseQuickFilter; label: string }[] = [
  { key: 'all', label: PPC.LABELS.QUICK_FILTERS.ALL },
  { key: 'active', label: PPC.LABELS.PHASE_LABELS.active },
  { key: 'scheduled', label: PPC.LABELS.PHASE_LABELS.scheduled },
  { key: 'pending_approval', label: PPC.LABELS.PHASE_LABELS.pending_approval },
  { key: 'canceled', label: PPC.LABELS.PHASE_LABELS.canceled },
  { key: 'terminated', label: PPC.LABELS.PHASE_LABELS.terminated },
  { key: 'failed', label: PPC.LABELS.PHASE_LABELS.failed },
];

const getPillAccent = (key: PlanPhaseQuickFilter): string => {
  if (key === 'all') return DEFAULT_COLORS.TEXT_MUTED;
  return STATUS_COLORS.PLAN_PHASE[key as PlanPhase] ?? DEFAULT_COLORS.TEXT_MUTED;
};

interface PhasePillsProps {
  active: PlanPhaseQuickFilter;
  counts: Record<PlanPhaseQuickFilter, number>;
  onChange: (next: PlanPhaseQuickFilter) => void;
}

const PhasePills: React.FC<PhasePillsProps> = ({ active, counts, onChange }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: '100%' }}>
    {PHASE_PILLS.map((pill) => {
      const isActive = active === pill.key;
      const accent = getPillAccent(pill.key);
      const count = counts[pill.key] ?? 0;
      return (
        <button
          key={pill.key}
          type="button"
          onClick={() => onChange(pill.key)}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            height: TOOLBAR_CONTROL.HEIGHT,
            boxSizing: 'border-box',
            padding: TOOLBAR_CONTROL.PADDING,
            borderRadius: LIST_TOOLBAR.PILL_RADIUS_PX,
            ...getQuickFilterPillColors(accent, isActive),
            fontSize: 12,
            fontWeight: 700,
            lineHeight: TOOLBAR_CONTROL.LINE_HEIGHT,
            userSelect: 'none',
          }}
        >
          <span>{pill.label}</span>
          <span style={{ opacity: 0.85 }}>· {count}</span>
        </button>
      );
    })}
  </div>
);

const ProtectionPlansToolbar: React.FC<ProtectionPlansToolbarProps> = ({
  searchValue,
  onSearchChange,
  onCreatePlanClick,
  onOpenFilters,
  phaseQuickFilter,
  onPhaseQuickFilterChange,
  phaseCounts,
  totalCount,
  onViewModeChange,
}) => {
  const canCreate = usePermission(
    ACTION_PERMISSIONS.protectionPlans.create.scope,
    ACTION_PERMISSIONS.protectionPlans.create.level,
    ACTION_PERMISSIONS.protectionPlans.create.deny,
  );

  const toolbars: ToolbarConfig[] = useMemo(() => {
    const search: ToolbarConfig = {
      search: {
        placeholder: PPC.LABELS.TOOLBAR_SEARCH_PLACEHOLDER,
        value: searchValue,
        onChange: onSearchChange,
      },
      buttons: [
        {
          key: 'search',
          label: PPC.LABELS.TOOLBAR_SEARCH_BUTTON,
          icon: <SearchOutlined />,
          variant: 'ghost',
        },
        {
          key: 'organize',
          label: PPC.LABELS.TAXONOMY.BUTTON,
          icon: <TagOutlined />,
          variant: 'default',
          dropdown: {
            items: [
              { key: 'environments', label: PPC.LABELS.TAXONOMY.ENVIRONMENTS },
              { key: 'tags', label: PPC.LABELS.TAXONOMY.TAGS },
            ],
            onItemClick: (key) => onViewModeChange(key as Exclude<PlanViewMode, 'plans'>),
          },
        },
      ],
    };
    return [
      search,
      {
        buttons: [
          {
            key: 'create-plan',
            label: PPC.LABELS.CREATE_BUTTON,
            icon: <Icons.ProtectionPlans size={14} />,
            variant: 'primary',
            onClick: onCreatePlanClick,
            disabled: !canCreate,
            tooltip: canCreate ? undefined : PPC.LABELS.PERMISSION_DENIED.CREATE,
          },
        ],
      },
    ];
  }, [canCreate, onCreatePlanClick, onSearchChange, onViewModeChange, searchValue]);

  return (
    <ListToolbar
      totalCount={totalCount}
      countSuffix={PPC.LABELS.TOOLBAR_COUNT_SUFFIX}
      compactWidth={PPC.LABELS.LIST_TOOLBAR_COMPACT_WIDTH}
      onOpenFilters={onOpenFilters}
      quickFilter={(compact) =>
        compact ? (
          <CompactQuickFilter
            options={PHASE_PILLS.map((pill) => ({
              key: pill.key,
              label: `${pill.label} · ${phaseCounts[pill.key] ?? 0}`,
              accent: getPillAccent(pill.key),
            }))}
            active={phaseQuickFilter}
            title={PPC.LABELS.TOOLBAR_PHASE_FILTER}
            icon={<FlagOutlined />}
            onChange={onPhaseQuickFilterChange}
          />
        ) : (
          <PhasePills
            active={phaseQuickFilter}
            counts={phaseCounts}
            onChange={onPhaseQuickFilterChange}
          />
        )
      }
      toolbars={toolbars}
    />
  );
};

export default ProtectionPlansToolbar;
