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
import { DATA_VIEW_ERROR_CONSTANTS as DVE, DataViewError } from '../../../../components/shared';
import { FancySpinner } from '../../../../components/animation';
import { useLoadingTimeout } from '../../../../hooks/layout/useLoadingTimeout';
import { userFacingMessage } from '../../../../api';

interface ProtectionPlansListPageProps {
  plans: ProtectionPlan[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCreatePlanClick: () => void;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const buildErrorMessage = (error: string | null, timedOut: boolean): string => {
  if (timedOut) return DVE.LABELS.TIMEOUT_MESSAGE;
  if (!error) return DVE.LABELS.GENERIC_MESSAGE;
  try {
    return userFacingMessage(new Error(error));
  } catch {
    return DVE.LABELS.GENERIC_MESSAGE;
  }
};

const ProtectionPlansListPage: React.FC<ProtectionPlansListPageProps> = memo(
  ({ plans, searchValue, onSearchChange, onCreatePlanClick, loading, error, onRetry }) => {
    const { contentGap } = useAppearance();
    const hasData = plans.length > 0;
    const timedOut = useLoadingTimeout({ isLoading: loading, hasError: Boolean(error), hasData });

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

    let dataRegion: React.ReactNode;
    if (error || timedOut) {
      dataRegion = (
        <DataViewError
          variant="card"
          message={buildErrorMessage(error, timedOut)}
          onRetry={onRetry}
        />
      );
    } else if (loading && !hasData) {
      dataRegion = (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 240,
          }}
        >
          <FancySpinner size={40} showLabel />
        </div>
      );
    } else if (filteredPlans.length === 0) {
      dataRegion = <NoProtectionPlansState />;
    } else {
      dataRegion = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredPlans.map((plan) => (
            <ProtectionPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      );
    }

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

          {dataRegion}
        </div>
      </div>
    );
  },
);

ProtectionPlansListPage.displayName = 'ProtectionPlansListPage';

export default ProtectionPlansListPage;
