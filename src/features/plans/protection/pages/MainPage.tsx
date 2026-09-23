import React, { useState } from 'react';
import { useProtectionPlans } from '../hooks/useProtectionPlans';
import { usePlanPanelState } from '../hooks/usePlanPanelState';
import CreatePlanPanel from '../components/panels/CreatePlanPanel';
import { CATEGORIES_CONSTANTS as CC } from '../../../access-and-permissions/categories/constants';
import type { PlanViewMode } from '../models';
import ProtectionPlansListPage from './ProtectionPlansListPage';
import PlanTaxonomyPage from './PlanTaxonomyPage';

const MainPage: React.FC = () => {
  const { plans, loading, error, refetch } = useProtectionPlans();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<PlanViewMode>('plans');
  const { createPanelOpen, createForm, openCreatePanel, closeCreatePanel } = usePlanPanelState();

  return (
    <>
      {viewMode !== 'plans' ? (
        <PlanTaxonomyPage
          scope={viewMode === 'environments' ? CC.SCOPES.PLAN_ENVIRONMENTS : CC.SCOPES.PLAN_TAGS}
          onBack={() => setViewMode('plans')}
        />
      ) : (
        <ProtectionPlansListPage
          plans={plans}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onCreatePlanClick={openCreatePanel}
          loading={loading}
          error={error}
          onRetry={refetch}
          onViewModeChange={setViewMode}
        />
      )}
      <CreatePlanPanel open={createPanelOpen} onClose={closeCreatePanel} form={createForm} />
    </>
  );
};

export default MainPage;
