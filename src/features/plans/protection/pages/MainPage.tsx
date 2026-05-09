import React, { useMemo, useState } from 'react';
import { useProtectionPlans } from '../hooks/useProtectionPlans';
import { usePlanPanelState } from '../hooks/usePlanPanelState';
import CreatePlanPanel from '../components/panels/CreatePlanPanel';
import ProtectionPlansEmptyPage from './ProtectionPlansEmptyPage';
import ProtectionPlansLoadingPage from './ProtectionPlansLoadingPage';
import ProtectionPlansErrorPage from './ProtectionPlansErrorPage';
import ProtectionPlansListPage from './ProtectionPlansListPage';

const MainPage: React.FC = () => {
  const { plans, loading, error } = useProtectionPlans();
  const [searchTerm, setSearchTerm] = useState('');
  const { createPanelOpen, createForm, openCreatePanel, closeCreatePanel } = usePlanPanelState();

  const isFetching = useMemo(() => plans.length === 0 && loading, [plans.length, loading]);

  const shouldShowEmpty = useMemo(
    () => Array.isArray(plans) && plans.length === 0 && !loading && !error,
    [plans, loading, error],
  );

  if (error) {
    return <ProtectionPlansErrorPage error={error} />;
  }

  if (shouldShowEmpty) {
    return (
      <>
        <ProtectionPlansEmptyPage onCreatePlanClick={openCreatePanel} />
        <CreatePlanPanel open={createPanelOpen} onClose={closeCreatePanel} form={createForm} />
      </>
    );
  }

  if (isFetching) {
    return <ProtectionPlansLoadingPage />;
  }

  return (
    <>
      <ProtectionPlansListPage
        plans={plans}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onCreatePlanClick={openCreatePanel}
      />
      <CreatePlanPanel open={createPanelOpen} onClose={closeCreatePanel} form={createForm} />
    </>
  );
};

export default MainPage;
