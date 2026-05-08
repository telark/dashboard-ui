import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../../../constants';
import { useProtectionPlans } from '../hooks/useProtectionPlans';
import ProtectionPlansEmptyPage from './ProtectionPlansEmptyPage';
import ProtectionPlansLoadingPage from './ProtectionPlansLoadingPage';
import ProtectionPlansErrorPage from './ProtectionPlansErrorPage';
import ProtectionPlansListPage from './ProtectionPlansListPage';

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const { plans, loading, error } = useProtectionPlans();
  const [searchTerm, setSearchTerm] = useState('');

  const onCreatePlanClick = useCallback(() => {
    navigate(APP_ROUTES.PROTECTION_PLANS_CREATE);
  }, [navigate]);

  const isFetching = useMemo(() => plans.length === 0 && loading, [plans.length, loading]);

  const shouldShowEmpty = useMemo(
    () => Array.isArray(plans) && plans.length === 0 && !loading && !error,
    [plans, loading, error],
  );

  if (error) {
    return <ProtectionPlansErrorPage error={error} />;
  }

  if (shouldShowEmpty) {
    return <ProtectionPlansEmptyPage onCreatePlanClick={onCreatePlanClick} />;
  }

  if (isFetching) {
    return <ProtectionPlansLoadingPage />;
  }

  return (
    <ProtectionPlansListPage
      plans={plans}
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      onCreatePlanClick={onCreatePlanClick}
    />
  );
};

export default MainPage;
