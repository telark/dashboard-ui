import React, { useMemo, useState } from 'react';
import { useProtectionPlans } from '../hooks/useProtectionPlans';
import { usePlanPanelState } from '../hooks/usePlanPanelState';
import CreatePlanPanel from '../components/panels/CreatePlanPanel';
import ProtectionPlansEmptyPage from './ProtectionPlansEmptyPage';
import ProtectionPlansListPage from './ProtectionPlansListPage';

const MainPage: React.FC = () => {
  const { plans, loading, error, refetch } = useProtectionPlans();
  const [searchTerm, setSearchTerm] = useState('');
  const { createPanelOpen, createForm, openCreatePanel, closeCreatePanel } = usePlanPanelState();

  const shouldShowEmpty = useMemo(
    () => Array.isArray(plans) && plans.length === 0 && !loading && !error,
    [plans, loading, error],
  );

  if (shouldShowEmpty) {
    return (
      <>
        <ProtectionPlansEmptyPage onCreatePlanClick={openCreatePanel} />
        <CreatePlanPanel open={createPanelOpen} onClose={closeCreatePanel} form={createForm} />
      </>
    );
  }

  return (
    <>
      <ProtectionPlansListPage
        plans={plans}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onCreatePlanClick={openCreatePanel}
        loading={loading}
        error={error}
        onRetry={refetch}
      />
      <CreatePlanPanel open={createPanelOpen} onClose={closeCreatePanel} form={createForm} />
    </>
  );
};

export default MainPage;
