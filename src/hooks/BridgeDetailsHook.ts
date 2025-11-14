import { useEffect, useState } from 'react';
import logger from '../logging';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import {
  fetchBridgeDetailsThunk,
  clearDetails,
  updateBridgeSyncModeThunk,
} from '../store/bridges/slices/bridgeSlice';
import { AppDispatch } from '../store';
import { selectBridgeDetailsData } from '../store/bridges/selectors/bridgeSelectors';
import { STORE_MESSAGES, HOOK_MESSAGES, HOOK_CONFIGS, SYNC_ACTIONS } from '../constants';

export const BridgeDetailsHook = () => {
  const dispatch: AppDispatch = useDispatch();
  const { name } = useParams<{ name: string }>();
  const { details: bridgeDetails, loading, error } = useSelector(selectBridgeDetailsData);

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
      dispatch(clearDetails());
      dispatch(fetchBridgeDetailsThunk(name));
    }
    return () => {
      dispatch(clearDetails());
    };
  }, [dispatch, name]);

  useEffect(() => {
    if (bridgeDetails?.sync) {
      setIsAutoSync(bridgeDetails.sync.mode === SYNC_ACTIONS.AUTO);
      setInitialSyncMode(bridgeDetails.sync.mode);
    }
  }, [bridgeDetails]);

  const handleAutoSyncChange = (checked: boolean) => {
    setIsAutoSync(checked);
  };

  const handleBridgeSyncSave = async () => {
    if (!name) return;
    setLoadingSave(true);
    try {
      const syncMode = isAutoSync ? SYNC_ACTIONS.AUTO : SYNC_ACTIONS.MANUAL;
      const response = await dispatch(updateBridgeSyncModeThunk({ name, syncMode })).unwrap();

      // Update local state with the response data
      setIsAutoSync(response.sync.mode === SYNC_ACTIONS.AUTO);
      setInitialSyncMode(response.sync.mode);

      message.success(HOOK_MESSAGES.SUCCESS.SYNC_SETTINGS_UPDATED);
    } catch (error) {
      logger.error(STORE_MESSAGES.ERROR_UPDATING_APP_SYNC, error);
      message.error(HOOK_MESSAGES.ERROR.UPDATE_SETTINGS_FAILED);
    } finally {
      setLoadingSave(false);
    }
  };

  return {
    bridgeDetails,
    loading,
    error,
    isAutoSync,
    setIsAutoSync,
    loadingSave,
    hasChanges,
    handleAutoSyncChange,
    handleBridgeSyncSave,
  };
};
