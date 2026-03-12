import React, { useMemo } from 'react';
import type { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { PageLayoutConfig } from '../../../interfaces/layout/page';
import { DEFAULT_COLORS, Icons } from '../../../constants';
import { useAppearance } from '../../../features/settings/sections/appearance';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  PROTECTION_PLANS_LIFECYCLES,
  PROTECTION_PLANS_POLICY_KEYS,
} from '../constants/protectionPlans';
import type { ProtectionPlan } from '../models';

const ShieldIcon = Icons.Role;

interface UseProtectionPlansPageConfigOptions {
  plans: ProtectionPlan[];
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export const useProtectionPlansPageConfig = ({
  plans,
  searchValue,
  onSearchChange,
}: UseProtectionPlansPageConfigOptions): PageLayoutConfig<ProtectionPlan> => {
  const { rowHeight } = useAppearance();

  const filteredPlans = useMemo(() => {
    if (!searchValue) return plans;
    const lower = searchValue.toLowerCase();
    return plans.filter((plan) => {
      return (
        plan.name.toLowerCase().includes(lower) ||
        plan.typeLabel.toLowerCase().includes(lower) ||
        plan.scope.namespace.toLowerCase().includes(lower)
      );
    });
  }, [plans, searchValue]);

  const columns: ColumnType<ProtectionPlan>[] = useMemo(
    () => [
      {
        title: PPC.LABELS.COLUMNS.NAME,
        dataIndex: 'name',
        key: PPC.KEYS.NAME,
        width: PPC.SIZES.COLUMNS.NAME,
        render: (value: string) => (
          <span style={{ fontWeight: 500, color: DEFAULT_COLORS.TEXT_PRIMARY }}>{value}</span>
        ),
      },
      {
        title: PPC.LABELS.COLUMNS.TYPE,
        dataIndex: 'typeLabel',
        key: PPC.KEYS.TYPE,
        width: PPC.SIZES.COLUMNS.TYPE,
        render: (value: string) => (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 999,
              background: '#0ea5e930',
              color: '#0369a1',
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {value}
          </span>
        ),
      },
      {
        title: PPC.LABELS.COLUMNS.SCOPE,
        key: PPC.KEYS.SCOPE,
        width: PPC.SIZES.COLUMNS.SCOPE,
        render: (_, record) => {
          if (record.scope.type === 'namespace') {
            return (
              <span style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12 }}>
                Namespace • <strong>{record.scope.namespace}</strong>
                {record.scope.cluster ? ` @ ${record.scope.cluster}` : ''}
              </span>
            );
          }
          return (
            <span style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12 }}>
              Workload • <strong>{record.scope.name}</strong> ({record.scope.kind}) in{' '}
              {record.scope.namespace}
            </span>
          );
        },
      },
      {
        title: PPC.LABELS.COLUMNS.POLICIES,
        key: PPC.KEYS.POLICIES,
        width: PPC.SIZES.COLUMNS.POLICIES,
        render: (_, record) => {
          const enabledLabels = record.policies
            .filter((p) => p.enabled && PROTECTION_PLANS_POLICY_KEYS.includes(p.key))
            .map((p) => PPC.LABELS.POLICY_LABELS[p.key]);
          if (enabledLabels.length === 0) {
            return <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>No policies enabled</span>;
          }
          const [first, ...rest] = enabledLabels;
          return (
            <span style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12 }}>
              {first}
              {rest.length > 0 ? ` +${rest.length} more` : ''}
            </span>
          );
        },
      },
      {
        title: PPC.LABELS.COLUMNS.LIFECYCLE,
        dataIndex: 'lifecycle',
        key: PPC.KEYS.LIFECYCLE,
        width: PPC.SIZES.COLUMNS.LIFECYCLE,
        render: (value) => {
          const label = PPC.LABELS.LIFECYCLE_LABELS[value as typeof PROTECTION_PLANS_LIFECYCLES[number]];
          const isActive = value === 'active';
          const isScheduled = value === 'scheduled';
          const bg = isActive ? '#22c55e30' : isScheduled ? '#0ea5e930' : '#e5e7eb80';
          const color = isActive ? '#16a34a' : isScheduled ? '#0369a1' : '#4b5563';
          return (
            <span
              style={{
                padding: '2px 8px',
                borderRadius: 999,
                background: bg,
                color,
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {label}
            </span>
          );
        },
      },
      {
        title: PPC.LABELS.COLUMNS.WINDOW,
        key: PPC.KEYS.WINDOW,
        width: PPC.SIZES.COLUMNS.WINDOW,
        render: (_, record) => {
          const start = dayjs(record.schedule.startAt).format('MMM D, HH:mm');
          const end = dayjs(record.schedule.endAt).format('MMM D, HH:mm');
          return (
            <span style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12 }}>
              {start} → {end}
            </span>
          );
        },
      },
      {
        title: PPC.LABELS.COLUMNS.CREATED,
        dataIndex: 'createdAt',
        key: PPC.KEYS.CREATED,
        width: PPC.SIZES.COLUMNS.CREATED,
        render: (value: string) => (
          <span style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12 }}>
            {dayjs(value).format('MMM D, YYYY')}
          </span>
        ),
      },
      {
        title: PPC.LABELS.COLUMNS.CREATED_BY,
        dataIndex: 'createdBy',
        key: PPC.KEYS.CREATED_BY,
        width: PPC.SIZES.COLUMNS.CREATED_BY,
        render: (value: string) => (
          <span style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12 }}>{value}</span>
        ),
      },
      {
        title: PPC.LABELS.COLUMNS.LAST_UPDATE,
        dataIndex: 'lastUpdatedAt',
        key: PPC.KEYS.LAST_UPDATE,
        width: PPC.SIZES.COLUMNS.LAST_UPDATE,
        render: (value: string) => {
          const formatted = dayjs(value).format('MMM D, YYYY HH:mm');
          return (
            <span style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12 }}>{formatted}</span>
          );
        },
      },
      {
        title: PPC.LABELS.COLUMNS.PARTICIPANTS,
        key: PPC.KEYS.PARTICIPANTS,
        width: PPC.SIZES.COLUMNS.PARTICIPANTS,
        render: (_, record) => {
          if (!record.participants.length) {
            return <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>None</span>;
          }
          const primary = record.participants[0]?.displayName ?? '';
          const extra = record.participants.length - 1;
          return (
            <span style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12 }}>
              {primary}
              {extra > 0 ? ` +${extra}` : ''}
            </span>
          );
        },
      },
    ],
    [rowHeight],
  );

  const toolbar = useMemo(
    () => ({
      search: {
        value: searchValue,
        placeholder: 'Search plans by name, type, or scope...',
        onChange: onSearchChange,
      },
      primaryActions: [
        {
          key: 'create',
          label: PPC.LABELS.CREATE_BUTTON,
          type: 'primary' as const,
          onClick: () => {
            // For now, creation is not wired; this will be connected to a panel later.
          },
        },
      ],
    }),
    [onSearchChange, searchValue],
  );

  return useMemo(
    () => ({
      title: PPC.LABELS.HEADER_TITLE,
      subtitle: PPC.LABELS.HEADER_SUBTITLE,
      breadcrumbs: [],
      toolbar,
      columns,
      data: filteredPlans,
      rowKey: (record: ProtectionPlan) => record.id,
      containerStyle: { marginTop: '0', paddingBottom: '48px' },
      pagination: {
        currentPage: 1,
        pageSize: 20,
        total: filteredPlans.length,
        onPageChange: () => undefined,
        onPageSizeChange: () => undefined,
        pageSizeOptions: [10, 20, 50, 100],
        showRowsLabel: PPC.LABELS.PAGINATION.SHOW_ROWS,
      },
      rowSelection: undefined,
      onRowClick: undefined,
      rowHeight,
      empty: (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <ShieldIcon size={48} style={{ color: DEFAULT_COLORS.ICON_MUTED, marginBottom: 8 }} />
          <div style={{ fontSize: 14, color: DEFAULT_COLORS.TEXT_MUTED }}>No plans found</div>
        </div>
      ),
    }),
    [columns, filteredPlans, rowHeight, toolbar],
  );
};

