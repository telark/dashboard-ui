import { useEffect, useState } from 'react';
import logger from '../../../logging';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import {
  fetchGrouperDetailsThunk,
  clearDetails,
  updateGrouperSyncModeThunk,
  enableGrouperMaintenanceModeThunk,
  updateGrouperMaintenanceModeThunk,
  removeGrouperMaintenanceModeThunk,
} from '../../../store/groupers/slices/grouperSlice';
import type { AppDispatch } from '../../../store';
import { selectGrouperDetailsData } from '../../../store/groupers/selectors/grouperSelectors';
import {
  STORE_MESSAGES,
  HOOK_MESSAGES,
  HOOK_VALUES,
  HOOK_CONFIGS,
  MAINTENANCE_ACTIONS,
  SYNC_ACTIONS,
  HTTP_STATUS,
} from '../../../constants';

export const GrouperDetailsHook = () => {
  const dispatch: AppDispatch = useDispatch();
  const { name } = useParams<{ name: string }>();
  const { details: grouperDetails, loading, error } = useSelector(selectGrouperDetailsData);

  const [isAutoSync, setIsAutoSync] = useState<boolean>(HOOK_CONFIGS.DEFAULT_VALUES.AUTO_SYNC);
  const [initialSyncMode, setInitialSyncMode] = useState<string>(
    HOOK_CONFIGS.DEFAULT_VALUES.SYNC_MODE,
  );
  const [loadingSave, setLoadingSave] = useState<boolean>(HOOK_CONFIGS.DEFAULT_VALUES.LOADING_SAVE);

  const [isMaintenanceModalVisible, setIsMaintenanceModalVisible] = useState(
    HOOK_CONFIGS.DEFAULT_VALUES.MAINTENANCE_MODAL_VISIBLE,
  );
  const [isMaintenanceModeActive, setIsMaintenanceModeActive] = useState<boolean>(
    HOOK_CONFIGS.DEFAULT_VALUES.MAINTENANCE_MODE_ACTIVE,
  );
  const [maintenanceUpdateAction, setMaintenanceUpdateAction] = useState(
    HOOK_CONFIGS.DEFAULT_VALUES.MAINTENANCE_UPDATE_ACTION,
  );
  const [maintenanceDeleteAction, setMaintenanceDeleteAction] = useState(
    HOOK_CONFIGS.DEFAULT_VALUES.MAINTENANCE_DELETE_ACTION,
  );

  const [hasMaintenanceData, setHasMaintenanceData] = useState(
    HOOK_CONFIGS.DEFAULT_VALUES.HAS_MAINTENANCE_DATA,
  );

  // Ensure hasChanges is a boolean
  const hasChanges = Boolean(
    initialSyncMode && (isAutoSync ? SYNC_ACTIONS.AUTO : SYNC_ACTIONS.MANUAL) !== initialSyncMode,
  );

  useEffect(() => {
    const maintenance = grouperDetails?.maintenance;
    if (maintenance) {
      setHasMaintenanceData(true);
      setIsMaintenanceModeActive(maintenance.status === HOOK_VALUES.MAINTENANCE_STATUS.ACTIVE);
      setMaintenanceUpdateAction(
        maintenance.updateAction === MAINTENANCE_ACTIONS.ALLOW || maintenance.updateAction === true,
      );
      setMaintenanceDeleteAction(
        maintenance.deleteAction === MAINTENANCE_ACTIONS.ALLOW || maintenance.deleteAction === true,
      );
    } else {
      setHasMaintenanceData(false);
      setIsMaintenanceModeActive(false);
    }
  }, [grouperDetails]);

  useEffect(() => {
    if (name) {
      dispatch(clearDetails());
      dispatch(fetchGrouperDetailsThunk(name));
    }
    return () => {
      dispatch(clearDetails());
    };
  }, [dispatch, name]);

  useEffect(() => {
    if (grouperDetails?.sync) {
      setIsAutoSync(grouperDetails.sync.mode === SYNC_ACTIONS.AUTO);
      setInitialSyncMode(grouperDetails.sync.mode);
    }

    if (grouperDetails?.maintenance?.status === HOOK_VALUES.MAINTENANCE_STATUS.ACTIVE) {
      setIsMaintenanceModeActive(true);
      setMaintenanceUpdateAction(
        grouperDetails.maintenance?.updateAction === MAINTENANCE_ACTIONS.ALLOW ||
          (grouperDetails.maintenance?.updateAction as any) === true,
      );
      setMaintenanceDeleteAction(
        grouperDetails.maintenance?.deleteAction === MAINTENANCE_ACTIONS.ALLOW ||
          (grouperDetails.maintenance?.deleteAction as any) === true,
      );
    } else {
      setIsMaintenanceModeActive(false);
    }
  }, [grouperDetails]);

  const handleAutoSyncChange = (checked: boolean) => {
    setIsAutoSync(checked);
  };

  const handleGrouperSyncSave = async () => {
    if (!name) return;
    setLoadingSave(true);
    try {
      const syncMode = isAutoSync ? SYNC_ACTIONS.AUTO : SYNC_ACTIONS.MANUAL;
      const response = await dispatch(updateGrouperSyncModeThunk({ name, syncMode })).unwrap();

      // Update local state with the response data
      setIsAutoSync(response.sync.mode === SYNC_ACTIONS.AUTO);
      setInitialSyncMode(response.sync.mode);

      // Preserve existing maintenance data from current grouperDetails
      // This prevents the maintenance data from being lost during sync update
      if (grouperDetails?.maintenance) {
        setHasMaintenanceData(true);
        setIsMaintenanceModeActive(
          grouperDetails.maintenance.status === HOOK_VALUES.MAINTENANCE_STATUS.ACTIVE,
        );
        setMaintenanceUpdateAction(
          grouperDetails.maintenance.updateAction === MAINTENANCE_ACTIONS.ALLOW ||
            (grouperDetails.maintenance.updateAction as any) === true,
        );
        setMaintenanceDeleteAction(
          grouperDetails.maintenance.deleteAction === MAINTENANCE_ACTIONS.ALLOW ||
            (grouperDetails.maintenance.deleteAction as any) === true,
        );
      }

      message.success(HOOK_MESSAGES.SUCCESS.SYNC_SETTINGS_UPDATED);
    } catch (error) {
      logger.error(STORE_MESSAGES.ERROR_UPDATING_SYNC, error);
      message.error(HOOK_MESSAGES.ERROR.UPDATE_SETTINGS_FAILED);
    } finally {
      setLoadingSave(false);
    }
  };

  const handleEnableMaintenanceClick = () => {
    setIsMaintenanceModalVisible(true);
  };

  const handleCancelMaintenance = () => {
    setIsMaintenanceModalVisible(false);
  };

  const handleMaintenanceUpdateActionChange = (checked: boolean) => {
    setMaintenanceUpdateAction(checked);
  };

  const handleMaintenanceDeleteActionChange = (checked: boolean) => {
    setMaintenanceDeleteAction(checked);
  };

  const handleMaintenanceMode = async () => {
    if (!name) {
      return;
    }
    const resourceType = grouperDetails?.kind?.toLowerCase();
    try {
      let response;
      if (isMaintenanceModeActive) {
        response = await dispatch(
          updateGrouperMaintenanceModeThunk({
            grouperName: name,
            updateAction: maintenanceUpdateAction,
            deleteAction: maintenanceDeleteAction,
          }),
        ).unwrap();
        if (response.status === HTTP_STATUS.SUCCESS) {
          message.success(HOOK_MESSAGES.SUCCESS.MAINTENANCE_MODE_UPDATED);
        } else {
          throw new Error(HOOK_MESSAGES.ERROR.UNEXPECTED_RESPONSE);
        }
      } else {
        // Enable maintenance mode for the first time
        response = await dispatch(
          enableGrouperMaintenanceModeThunk({
            grouperName: name,
            resourceType,
            updateAction: maintenanceUpdateAction,
            deleteAction: maintenanceDeleteAction,
          }),
        ).unwrap();

        if (response.status === HTTP_STATUS.SUCCESS) {
          message.success(response.message || HOOK_MESSAGES.SUCCESS.MAINTENANCE_MODE_ENABLED);
        } else {
          throw new Error(HOOK_MESSAGES.ERROR.UNEXPECTED_RESPONSE);
        }
      }

      // Re-fetch details and sync local switches with the latest server state
      const refreshed = await dispatch(fetchGrouperDetailsThunk(name)).unwrap();
      if (refreshed?.maintenance) {
        setHasMaintenanceData(true);
        setIsMaintenanceModeActive(
          refreshed.maintenance.status === HOOK_VALUES.MAINTENANCE_STATUS.ACTIVE,
        );
        setMaintenanceUpdateAction(
          refreshed.maintenance.updateAction === MAINTENANCE_ACTIONS.ALLOW ||
            (refreshed.maintenance.updateAction as any) === true,
        );
        setMaintenanceDeleteAction(
          refreshed.maintenance.deleteAction === MAINTENANCE_ACTIONS.ALLOW ||
            (refreshed.maintenance.deleteAction as any) === true,
        );
      }
      setIsMaintenanceModalVisible(false);
    } catch (error) {
      logger.error(STORE_MESSAGES.ERROR_HANDLING_MAINTENANCE_UPDATE, error);
      message.error(HOOK_MESSAGES.ERROR.UPDATE_MAINTENANCE_FAILED);
    }
  };

  const handleRemoveMaintenanceMode = async () => {
    if (!name) {
      return;
    }

    try {
      const response = await dispatch(removeGrouperMaintenanceModeThunk(name)).unwrap();
      if (response.status === HTTP_STATUS.SUCCESS) {
        message.success(HOOK_MESSAGES.SUCCESS.MAINTENANCE_MODE_REMOVED);
        setIsMaintenanceModeActive(false);
        setMaintenanceUpdateAction(false);
        setMaintenanceDeleteAction(false);
      } else {
        throw new Error(HOOK_MESSAGES.ERROR.UNEXPECTED_RESPONSE);
      }
    } catch (error) {
      logger.error(STORE_MESSAGES.ERROR_REMOVING_MAINTENANCE, error);
      message.error(HOOK_MESSAGES.ERROR.REMOVE_MAINTENANCE_FAILED);
    }
  };

  return {
    grouperDetails,
    loading,
    error,
    isAutoSync,
    setIsAutoSync,
    loadingSave,
    hasChanges,
    handleAutoSyncChange,
    handleGrouperSyncSave,

    isMaintenanceModeActive,
    isMaintenanceModalVisible,
    maintenanceUpdateAction,
    maintenanceDeleteAction,
    handleEnableMaintenanceClick,
    handleCancelMaintenance,
    handleMaintenanceUpdateActionChange,
    handleMaintenanceDeleteActionChange,
    handleMaintenanceMode,
    hasMaintenanceData,
    handleRemoveMaintenanceMode,
  };
};
