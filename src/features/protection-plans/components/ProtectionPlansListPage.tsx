import React, { memo, useMemo } from 'react';
import { DEFAULT_COLORS } from '../../../constants';
import { PAGE_CONTENT_LAYOUT } from '../../../constants/shared/pages';
import type { ProtectionPlan } from '../models';
import { useAppearance } from '../../../features/settings/sections/appearance';
import ProtectionPlanCard from './ProtectionPlanCard';
import ProtectionPlansHeader from './ProtectionPlansHeader';
import ProtectionPlansToolbar from './ProtectionPlansToolbar';
import NoProtectionPlansState from './NoProtectionPlansState';

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
          <ProtectionPlansHeader />
          <ProtectionPlansToolbar
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            onCreatePlanClick={onCreatePlanClick}
          />

          {/* Content */}
          {!hasPlans ? (
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
