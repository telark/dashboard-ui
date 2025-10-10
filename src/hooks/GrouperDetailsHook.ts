import { useEffect, useState } from 'react';
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
} from '../store/slices/grouperSlice';
import { AppDispatch } from '../store';
import { selectGrouperDetailsData } from '../store/selectors/grouperSelectors';
import {
  STORE_MESSAGES,
  HOOK_MESSAGES,
  HOOK_VALUES,
  HOOK_CONFIGS,
  MAINTENANCE_ACTIONS,
  SYNC_ACTIONS,
  HTTP_STATUS,
} from '../constants';

export const GrouperDetailsHook = () => {
  const dispatch: AppDispatch = useDispatch();
  const { name } = useParams<{ name: string }>();
  const {
    details: grouperDetails,
    loading,
    error,
  } = useSelector(selectGrouperDetailsData);

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
  const [maintenaceUpdateAction, setMaintenanceUpdateAction] = useState(
    HOOK_CONFIGS.DEFAULT_VALUES.MAINTENANCE_UPDATE_ACTION,
  );
  const [maintenaceDeleteAction, setMaintenanceDeleteAction] = useState(
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
      setIsAutoSync(response.sync.mode === SYNC_ACTIONS.AUTO);
      setInitialSyncMode(response.sync.mode);
      message.success(HOOK_MESSAGES.SUCCESS.SYNC_SETTINGS_UPDATED);
    } catch (error) {
      console.error(STORE_MESSAGES.ERROR_UPDATING_SYNC, error);
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
    const resourceType = grouperDetails?.kind?.toLowerCase();
    try {
      let response;
      if (isMaintenanceModeActive) {
        // Update existing maintenance mode
        response = await dispatch(
          updateGrouperMaintenanceModeThunk({
            grouperName: name!,
            updateAction: maintenaceUpdateAction,
            deleteAction: maintenaceDeleteAction,
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
            grouperName: name!,
            resourceType,
            updateAction: maintenaceUpdateAction,
            deleteAction: maintenaceDeleteAction,
          }),
        ).unwrap();

        if (response.status === HTTP_STATUS.SUCCESS) {
          message.success(response.message || HOOK_MESSAGES.SUCCESS.MAINTENANCE_MODE_ENABLED);
        } else {
          throw new Error(HOOK_MESSAGES.ERROR.UNEXPECTED_RESPONSE);
        }
      }

      // Re-fetch details and sync local switches with the latest server state
      const refreshed = await dispatch(fetchGrouperDetailsThunk(name!)).unwrap();
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
      console.error(STORE_MESSAGES.ERROR_HANDLING_MAINTENANCE_UPDATE, error);
      message.error(HOOK_MESSAGES.ERROR.UPDATE_MAINTENANCE_FAILED);
    }
  };

  const handleRemoveMaintenanceMode = async () => {
    try {
      // Dispatch the action to disable maintenance mode
      const response = await dispatch(removeGrouperMaintenanceModeThunk(name!)).unwrap();

      // Handle the response and show a success message
      if (response.status === HTTP_STATUS.SUCCESS) {
        message.success(HOOK_MESSAGES.SUCCESS.MAINTENANCE_MODE_REMOVED);
        // Optionally update the UI state to reflect the change
        setIsMaintenanceModeActive(false);
        setMaintenanceUpdateAction(false);
        setMaintenanceDeleteAction(false);
      } else {
        throw new Error(HOOK_MESSAGES.ERROR.UNEXPECTED_RESPONSE);
      }
    } catch (error) {
      console.error(STORE_MESSAGES.ERROR_REMOVING_MAINTENANCE, error);
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
    maintenaceUpdateAction,
    maintenaceDeleteAction,
    handleEnableMaintenanceClick,
    handleCancelMaintenance,
    handleMaintenanceUpdateActionChange,
    handleMaintenanceDeleteActionChange,
    handleMaintenanceMode,
    hasMaintenanceData,
    handleRemoveMaintenanceMode,
  };
};
