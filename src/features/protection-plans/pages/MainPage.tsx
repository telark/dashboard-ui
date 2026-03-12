import React, { useMemo, useState } from 'react';
import { useProtectionPlans } from '../hooks/useProtectionPlans';
import ProtectionPlansEmptyPage from './ProtectionPlansEmptyPage';
import ProtectionPlansLoadingPage from './ProtectionPlansLoadingPage';
import ProtectionPlansErrorPage from './ProtectionPlansErrorPage';
import ProtectionPlansListPage from './ProtectionPlansListPage';

const MainPage: React.FC = () => {
  const { plans, loading, error } = useProtectionPlans();
  const [searchTerm, setSearchTerm] = useState('');

  const isFetching = useMemo(() => plans.length === 0 && loading, [plans.length, loading]);

  const shouldShowEmpty = useMemo(
    () => Array.isArray(plans) && plans.length === 0 && !loading && !error,
    [plans, loading, error],
  );

  if (error) {
    return <ProtectionPlansErrorPage error={error} />;
  }

  if (shouldShowEmpty) {
    return <ProtectionPlansEmptyPage onCreatePlanClick={() => undefined} />;
  }

  if (isFetching) {
    return <ProtectionPlansLoadingPage />;
  }

  return (
    <ProtectionPlansListPage
      plans={plans}
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      onCreatePlanClick={() => undefined}
    />
  );
};

export default MainPage;
