import React, { memo, useEffect, useCallback, useRef, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, message } from 'antd';
import type { RootState, AppDispatch } from '../../../../../store';
import { loadApplications, loadApplicationsSilent } from '../../utils/management/state';
import { createRetryHandler, cancelRetry, RetryCallbacks } from '../../../../../utils/shared/retry';
import { APPLICATIONS_CONSTANTS } from '../../constants';
import { CONNECTIVITY_CONSTANTS } from '../../../../../constants/pages/connectivity';
import LoadingView from '../../../../../components/display/views/LoadingView';
import ReachabilityErrorView from '../../../../../components/display/views/ReachabilityErrorView';
import ApplicationsMainEmpty from './Empty';
import ApplicationsSuccess from './Success';
import { filterApplications, useApplications } from '../../hooks';
import type { Application } from '../../models';
import { EditApplicationPanel } from '../../components/panels';

const ApplicationsGlobalView: React.FC = memo(() => {
  const dispatch: AppDispatch = useDispatch();
  const { applications, loading, error } = useSelector((s: RootState) => s.applications);
  const hasTriggeredInitialLoad = useRef(false);

  const { searchValue, onSearchChange } = useApplications();
  const [editForm] = Form.useForm();
  const [editTarget, setEditTarget] = useState<Application | null>(null);

  const openEditPanel = useCallback(
    (app: Application) => {
      editForm.setFieldsValue({
        name: app.name,
        displayName: app.displayName,
        description: app.description ?? '',
      });
      setEditTarget(app);
    },
    [editForm],
  );

  const closeEditPanel = useCallback(() => {
    editForm.resetFields();
    setEditTarget(null);
  }, [editForm]);

  const filteredApplications = useMemo(
    () => filterApplications(applications, searchValue),
    [applications, searchValue],
  );

  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [nextRetryIn, setNextRetryIn] = useState(0);
  const [isInCooldown, setIsInCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const timeoutRefs = useRef<{ current: ReturnType<typeof setTimeout> | null }[]>([]);

  const handleLoadApplications = useCallback(async () => {
    await loadApplications(dispatch);
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      if (hasTriggeredInitialLoad.current) return;
      hasTriggeredInitialLoad.current = true;
      await handleLoadApplications();
    })();
  }, [handleLoadApplications]);

  const retryCallbacks: RetryCallbacks = useMemo(
    () => ({
      setRetrying: setIsRetrying,
      setRetryCount: setRetryCount,
      setNextRetryIn: setNextRetryIn,
      setInCooldown: setIsInCooldown,
      setCooldownTime: setCooldownTime,
      onSuccess: () => message.success(APPLICATIONS_CONSTANTS.MESSAGES.SUCCESS),
      onError: () => message.error(CONNECTIVITY_CONSTANTS.MESSAGES.ERROR_RETRYING_COOLDOWN),
    }),
    [],
  );

  const handleRetry = useCallback(async () => {
    if (isRetrying || isInCooldown) return;
    const retryHandler = createRetryHandler(
      () => loadApplicationsSilent(dispatch),
      retryCallbacks,
    );
    await retryHandler();
  }, [dispatch, isRetrying, isInCooldown, retryCallbacks]);

  const handleCancelRetry = useCallback(() => {
    cancelRetry(timeoutRefs.current, retryCallbacks);
  }, [retryCallbacks]);

  useEffect(() => {
    if (error) {
      message.error(error);
      if (!isRetrying) {
        void handleRetry();
      }
    }
  }, [error, isRetrying, handleRetry]);

  if (loading) {
    return <LoadingView label={APPLICATIONS_CONSTANTS.MESSAGES.LOADING} />;
  }

  if (error) {
    return (
      <ReachabilityErrorView
        isInCooldown={isInCooldown}
        cooldownTime={cooldownTime}
        retryCount={retryCount}
        nextRetryIn={nextRetryIn}
        onCancel={handleCancelRetry}
      />
    );
  }

  if (!loading && applications.length === 0) {
    return <ApplicationsMainEmpty onRefresh={handleLoadApplications} />;
  }

  return (
    <>
      <ApplicationsSuccess
        applications={filteredApplications}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        onEditApplication={openEditPanel}
      />
      <EditApplicationPanel
        open={editTarget != null}
        onClose={closeEditPanel}
        application={editTarget}
        form={editForm}
      />
    </>
  );
});

ApplicationsGlobalView.displayName = 'ApplicationsGlobalView';

export default ApplicationsGlobalView;

