import React, { memo, useMemo } from 'react';
import { Tag } from 'antd';
import dayjs from 'dayjs';
import { SearchOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS, Icons } from '../../../constants';
import { PAGE_CONTENT_LAYOUT } from '../../../constants/shared/pages';
import SettingsCard from '../../settings/components/SettingsCard';
import Toolbar from '../../../components/display/toolbar/Toolbar';
import type { ToolbarConfig } from '../../../interfaces/layout/toolbar';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  PROTECTION_PLANS_POLICY_KEYS,
} from '../constants/protectionPlans';
import type { ProtectionPlan } from '../models';
import { useAppearance } from '../../../features/settings/sections/appearance';

interface ProtectionPlansListPageProps {
  plans: ProtectionPlan[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCreatePlanClick: () => void;
}

const ProtectionPlansListPage: React.FC<ProtectionPlansListPageProps> = memo(
  ({ plans, searchValue, onSearchChange, onCreatePlanClick }) => {
    const { contentGap } = useAppearance();
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

    const hasPlans = filteredPlans.length > 0;

    const toolbarConfig: ToolbarConfig = useMemo(
      () => ({
        search: {
          placeholder: 'Search plans by name, type, or scope...',
          value: searchValue,
          onChange: onSearchChange,
        },
        buttons: [
          {
            key: 'search',
            label: 'Search',
            icon: <SearchOutlined />,
            variant: 'ghost',
          },
          {
            key: 'create-plan',
            label: PPC.LABELS.CREATE_BUTTON,
            icon: <Icons.ProtectionPlans size={14} />,
            variant: 'primary',
            onClick: onCreatePlanClick,
          },
        ],
      }),
      [onCreatePlanClick, onSearchChange, searchValue],
    );

    return (
      <div
        style={{
          minHeight: '100vh',
          background: DEFAULT_COLORS.BACKGROUND_WHITE,
          padding: PAGE_CONTENT_LAYOUT.PADDING,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: contentGap }}>
          {/* Header - match PageLayout styles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: DEFAULT_COLORS.TEXT_PRIMARY,
                margin: 0,
                padding: 0,
                lineHeight: 1.2,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {PPC.LABELS.HEADER_TITLE}
            </h1>
            <p
              style={{
                margin: 0,
                marginTop: 0,
                fontSize: 14,
                fontWeight: 400,
                color: DEFAULT_COLORS.TEXT_MUTED,
                padding: 0,
                lineHeight: 1.2,
                fontFamily: "'Roboto Condensed', sans-serif",
                maxWidth: 560,
              }}
            >
              {PPC.LABELS.HEADER_SUBTITLE}
            </p>
          </div>

          {/* Toolbar row (reuses shared toolbar styles) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: 0,
            }}
          >
            <Toolbar config={toolbarConfig} />
          </div>

          {/* Content */}
          {!hasPlans ? (
            <div
              style={{
                minHeight: '50vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'rgba(32,201,151,0.12)',
                  boxShadow: 'inset 0 0 0 2px rgba(32,201,151,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                  color: '#20C997',
                  fontSize: 24,
                }}
              >
                <Icons.ProtectionPlans />
              </div>
              <h3
                style={{
                  margin: 0,
                  marginBottom: 8,
                  fontSize: 18,
                  fontWeight: 600,
                  color: DEFAULT_COLORS.TEXT_PRIMARY,
                }}
              >
                No plans found
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: DEFAULT_COLORS.TEXT_MUTED,
                  maxWidth: 480,
                }}
              >
                Try adjusting your search or create a new Protection Plan to guard critical
                workloads.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filteredPlans.map((plan) => {
                const enabledPolicies = plan.policies
                  .filter((p) => p.enabled && PROTECTION_PLANS_POLICY_KEYS.includes(p.key))
                  .map((p) => PPC.LABELS.POLICY_LABELS[p.key]);

                const lifecycleLabel = PPC.LABELS.LIFECYCLE_LABELS[plan.lifecycle];
                const isActive = plan.lifecycle === 'active';
                const isScheduled = plan.lifecycle === 'scheduled';
                const lifecycleBg = isActive
                  ? '#22c55e30'
                  : isScheduled
                    ? '#0ea5e930'
                    : '#e5e7eb80';
                const lifecycleColor = isActive ? '#16a34a' : isScheduled ? '#0369a1' : '#4b5563';

                const windowText = `${dayjs(plan.schedule.startAt).format(
                  'MMM D, HH:mm',
                )} → ${dayjs(plan.schedule.endAt).format('MMM D, HH:mm')}`;

                const primaryParticipant = plan.participants[0]?.displayName ?? 'Unassigned';
                const extraParticipants = plan.participants.length - 1;

                return (
                  <SettingsCard
                    key={plan.id}
                    title={plan.name}
                    description={plan.description}
                    headerAction={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Tag
                          style={{
                            borderRadius: 999,
                            border: 'none',
                            background: lifecycleBg,
                            color: lifecycleColor,
                            fontWeight: 500,
                          }}
                        >
                          {lifecycleLabel}
                        </Tag>
                        <Tag
                          style={{
                            borderRadius: 999,
                            border: 'none',
                            background: '#0ea5e930',
                            color: '#0369a1',
                            fontWeight: 500,
                          }}
                        >
                          {plan.typeLabel}
                        </Tag>
                      </div>
                    }
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: 16,
                        fontSize: 13,
                      }}
                    >
                      <div>
                        <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, marginBottom: 4 }}>
                          {PPC.LABELS.COLUMNS.SCOPE}
                        </div>
                        <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY }}>
                          {plan.scope.type === 'namespace' ? (
                            <>
                              Namespace <strong>{plan.scope.namespace}</strong>
                              {plan.scope.cluster ? ` · ${plan.scope.cluster}` : ''}
                            </>
                          ) : (
                            <>
                              {plan.scope.kind} <strong>{plan.scope.name}</strong> ·{' '}
                              {plan.scope.namespace}
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, marginBottom: 4 }}>
                          {PPC.LABELS.COLUMNS.WINDOW}
                        </div>
                        <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY }}>{windowText}</div>
                      </div>
                      <div>
                        <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, marginBottom: 4 }}>
                          {PPC.LABELS.COLUMNS.POLICIES}
                        </div>
                        {enabledPolicies.length === 0 ? (
                          <div style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>
                            No policies enabled
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {enabledPolicies.slice(0, 3).map((label) => (
                              <Tag
                                key={label}
                                style={{
                                  borderRadius: 999,
                                  border: 'none',
                                  background: '#f1f5f9',
                                  color: '#0f172a',
                                }}
                              >
                                {label}
                              </Tag>
                            ))}
                            {enabledPolicies.length > 3 && (
                              <span style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12 }}>
                                +{enabledPolicies.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, marginBottom: 4 }}>
                          {PPC.LABELS.COLUMNS.PARTICIPANTS}
                        </div>
                        <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY }}>
                          {primaryParticipant}
                          {extraParticipants > 0 ? ` +${extraParticipants}` : ''}
                        </div>
                      </div>
                    </div>
                  </SettingsCard>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  },
);

ProtectionPlansListPage.displayName = 'ProtectionPlansListPage';

export default ProtectionPlansListPage;
