import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import {
  fetchAppWorkloadDetailsThunk,
  clearWorkloadDetails,
  updateAppWorkloadSyncModeThunk,
} from '../store/workloads/slices/workloadSlice';
import { AppDispatch } from '../store';
import { selectWorkloadDetailsData } from '../store/workloads/selectors/workloadSelectors';
import { STORE_MESSAGES, HOOK_MESSAGES, HOOK_CONFIGS, SYNC_ACTIONS } from '../constants';

export const AppWorkloadDetailsHook = () => {
  const dispatch: AppDispatch = useDispatch();
  const { name } = useParams<{ name: string }>();
  const { details: workloadDetails, loading, error } = useSelector(selectWorkloadDetailsData);

  const [isAutoSync, setIsAutoSync] = useState<boolean>(HOOK_CONFIGS.DEFAULT_VALUES.AUTO_SYNC);
  const [initialSyncMode, setInitialSyncMode] = useState<string>(
    HOOK_CONFIGS.DEFAULT_VALUES.SYNC_MODE,
  );
  const [loadingSave, setLoadingSave] = useState<boolean>(HOOK_CONFIGS.DEFAULT_VALUES.LOADING_SAVE);

  // Ensure hasChanges is a boolean
  const hasChanges = Boolean(
    initialSyncMode && (isAutoSync ? SYNC_ACTIONS.AUTO : SYNC_ACTIONS.MANUAL) !== initialSyncMode,
  );

  useEffect(() => {
    if (name) {
      dispatch(clearWorkloadDetails());
      dispatch(fetchAppWorkloadDetailsThunk(name));
    }
    return () => {
      dispatch(clearWorkloadDetails());
    };
  }, [dispatch, name]);

  useEffect(() => {
    if (workloadDetails?.config?.sync) {
      setIsAutoSync(workloadDetails.config.sync.mode === SYNC_ACTIONS.AUTO);
      setInitialSyncMode(workloadDetails.config.sync.mode);
    }
  }, [workloadDetails]);

  const handleAutoSyncChange = (checked: boolean) => {
    setIsAutoSync(checked);
  };

  const handleWorkloadSyncSave = async () => {
    if (!name) return;
    setLoadingSave(true);
    try {
      const syncMode = isAutoSync ? SYNC_ACTIONS.AUTO : SYNC_ACTIONS.MANUAL;
      const response = await dispatch(updateAppWorkloadSyncModeThunk({ name, syncMode })).unwrap();
      setIsAutoSync(response.config?.sync?.mode === SYNC_ACTIONS.AUTO);
      setInitialSyncMode(response.config?.sync?.mode);
      message.success(HOOK_MESSAGES.SUCCESS.SYNC_SETTINGS_UPDATED);
    } catch (error) {
      console.error(STORE_MESSAGES.ERROR_UPDATING_SYNC, error);
      message.error(HOOK_MESSAGES.ERROR.UPDATE_SETTINGS_FAILED);
    } finally {
      setLoadingSave(false);
    }
  };

  return {
    workloadDetails,
    loading,
    error,
    isAutoSync,
    setIsAutoSync,
    loadingSave,
    hasChanges,
    handleAutoSyncChange,
    handleWorkloadSyncSave,
  };
};
