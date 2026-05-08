import React, { memo, useMemo } from 'react';
import { DEFAULT_COLORS } from '../../../../constants';
import { PAGE_CONTENT_LAYOUT } from '../../../../constants/shared/pages';
import type { ProtectionPlan } from '../models';
import { useAppearance } from '../../../settings/sections/appearance';
import {
  ProtectionPlanCard,
  ProtectionPlansHeader,
  ProtectionPlansToolbar,
  NoProtectionPlansState,
} from '../components';

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
        const scope =
          plan.scope.type === 'applications'
            ? (plan.scope.applicationIds?.join(' ') ?? '')
            : (plan.scope.namespaces?.join(' ') ?? '');
        return (
          plan.name.toLowerCase().includes(lower) ||
          plan.phase.toLowerCase().includes(lower) ||
          scope.toLowerCase().includes(lower)
        );
      });
    }, [plans, searchValue]);

    return (
      <div
        style={{
          minHeight: '100vh',
          background: DEFAULT_COLORS.BACKGROUND_WHITE,
          padding: PAGE_CONTENT_LAYOUT.PADDING,
          marginTop: 0,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: contentGap }}>
          <ProtectionPlansHeader />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'flex-end',
              gap: 16,
              minHeight: '60px',
              width: '100%',
            }}
          >
            <div style={{ minHeight: '60px' }} />
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                minHeight: '60px',
              }}
            >
              <ProtectionPlansToolbar
                searchValue={searchValue}
                onSearchChange={onSearchChange}
                onCreatePlanClick={onCreatePlanClick}
              />
            </div>
          </div>

          {filteredPlans.length === 0 ? (
            <NoProtectionPlansState />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filteredPlans.map((plan) => (
                <ProtectionPlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
);

ProtectionPlansListPage.displayName = 'ProtectionPlansListPage';

export default ProtectionPlansListPage;
