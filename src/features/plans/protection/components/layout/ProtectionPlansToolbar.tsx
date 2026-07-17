import React, { useMemo } from 'react';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { CONTROL_HEIGHT, DEFAULT_COLORS, Icons } from '../../../../../constants';
import Toolbar from '../../../../../components/display/toolbar/Toolbar';
import { usePermission, ACTION_PERMISSIONS } from '../../../../auth/hooks';
import type { ToolbarConfig } from '../../../../../interfaces/layout/toolbar';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  PHASE_DOT_COLOR,
} from '../../constants/protectionPlans';
import type { PlanPhase, PlanPhaseQuickFilter } from '../../models';

interface ProtectionPlansToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCreatePlanClick: () => void;
  onOpenFilters: () => void;
  phaseQuickFilter: PlanPhaseQuickFilter;
  onPhaseQuickFilterChange: (next: PlanPhaseQuickFilter) => void;
  phaseCounts: Record<PlanPhaseQuickFilter, number>;
}

const PHASE_PILLS: { key: PlanPhaseQuickFilter; label: string }[] = [
  { key: 'all', label: PPC.LABELS.QUICK_FILTERS.ALL },
  { key: 'active', label: PPC.LABELS.PHASE_LABELS.active },
  { key: 'scheduled', label: PPC.LABELS.PHASE_LABELS.scheduled },
  { key: 'canceled', label: PPC.LABELS.PHASE_LABELS.canceled },
  { key: 'terminated', label: PPC.LABELS.PHASE_LABELS.terminated },
  { key: 'failed', label: PPC.LABELS.PHASE_LABELS.failed },
];

const getPillAccent = (key: PlanPhaseQuickFilter): string => {
  if (key === 'all') return DEFAULT_COLORS.TEXT_MUTED;
  return PHASE_DOT_COLOR[key as PlanPhase] ?? DEFAULT_COLORS.TEXT_MUTED;
};

const ProtectionPlansToolbar: React.FC<ProtectionPlansToolbarProps> = ({
  searchValue,
  onSearchChange,
  onCreatePlanClick,
  onOpenFilters,
  phaseQuickFilter,
  onPhaseQuickFilterChange,
  phaseCounts,
}) => {
  const canCreate = usePermission(
    ACTION_PERMISSIONS.protectionPlans.create.scope,
    ACTION_PERMISSIONS.protectionPlans.create.level,
    ACTION_PERMISSIONS.protectionPlans.create.deny,
  );

  const toolbarConfig: ToolbarConfig = useMemo(() => {
    const buttons: ToolbarConfig['buttons'] = [
      {
        key: 'search',
        label: 'Search',
        icon: <SearchOutlined />,
        variant: 'ghost',
      },
      {
        key: 'filter',
        label: 'Filter',
        icon: <FilterOutlined />,
        variant: 'ghost',
        onClick: onOpenFilters,
      },
    ];
    if (canCreate) {
      buttons.push({
        key: 'create-plan',
        label: PPC.LABELS.CREATE_BUTTON,
        icon: <Icons.ProtectionPlans size={14} />,
        variant: 'primary',
        onClick: onCreatePlanClick,
      });
    }
    return {
      search: {
        placeholder: 'Search plans by name, type, or scope...',
        value: searchValue,
        onChange: onSearchChange,
      },
      buttons,
    };
  }, [canCreate, onCreatePlanClick, onOpenFilters, onSearchChange, searchValue]);

  const pillsNode = useMemo(() => {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        {PHASE_PILLS.map((pill) => {
          const active = phaseQuickFilter === pill.key;
          const accent = getPillAccent(pill.key);
          const background = active ? `${accent}18` : DEFAULT_COLORS.CHIP_CUSTOM_BG;
          const borderColor = active ? accent : 'transparent';
          const color = active ? accent : DEFAULT_COLORS.TEXT_MUTED;
          const count = phaseCounts[pill.key] ?? 0;
          return (
            <button
              key={pill.key}
              type="button"
              onClick={() => onPhaseQuickFilterChange(pill.key)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                height: CONTROL_HEIGHT,
                padding: '0 10px',
                borderRadius: 999,
                background,
                border: `1px solid ${borderColor}`,
                color,
                fontSize: 12,
                fontWeight: 700,
                lineHeight: 1,
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
  }, [phaseQuickFilter, phaseCounts, onPhaseQuickFilterChange]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        width: '100%',
      }}
    >
      {pillsNode}
      <Toolbar config={toolbarConfig} />
    </div>
  );
};

export default ProtectionPlansToolbar;
