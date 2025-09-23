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
import { RootState, AppDispatch } from '../store';

export const GrouperDetailsHook = () => {
  const dispatch: AppDispatch = useDispatch();
  const { name } = useParams<{ name: string }>();
  const {
    details: grouperDetails,
    loading,
    error,
  } = useSelector((state: RootState) => state.grouper);

  const [isAutoSync, setIsAutoSync] = useState<boolean>(false);
  const [initialSyncMode, setInitialSyncMode] = useState<string>('');
  const [loadingSave, setLoadingSave] = useState<boolean>(false);

  const [isMaintenanceModalVisible, setIsMaintenanceModalVisible] = useState(false);
  const [isMaintenanceModeActive, setIsMaintenanceModeActive] = useState<boolean>(false);
  const [maintenaceUpdateAction, setMaintenanceUpdateAction] = useState(true);
  const [maintenaceDeleteAction, setMaintenanceDeleteAction] = useState(true);

  const [hasMaintenanceData, setHasMaintenanceData] = useState(false);

  // Ensure hasChanges is a boolean
  const hasChanges = Boolean(
    initialSyncMode && (isAutoSync ? 'auto' : 'manual') !== initialSyncMode,
  );

  useEffect(() => {
    const maintenance = grouperDetails?.maintenance;
    if (maintenance) {
      setHasMaintenanceData(true);
      setIsMaintenanceModeActive(maintenance.status === 'Active');
      setMaintenanceUpdateAction(
        maintenance.updateAction === 'allow' || maintenance.updateAction === true,
      );
      setMaintenanceDeleteAction(
        maintenance.deleteAction === 'allow' || maintenance.deleteAction === true,
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
      setIsAutoSync(grouperDetails.sync.mode === 'auto');
      setInitialSyncMode(grouperDetails.sync.mode);
    }

    if (grouperDetails?.maintenance?.status === 'Active') {
      setIsMaintenanceModeActive(true);
      setMaintenanceUpdateAction(
        grouperDetails.maintenance?.updateAction === 'allow' ||
          (grouperDetails.maintenance?.updateAction as any) === true,
      );
      setMaintenanceDeleteAction(
        grouperDetails.maintenance?.deleteAction === 'allow' ||
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
      const syncMode = isAutoSync ? 'auto' : 'manual';
      const response = await dispatch(updateGrouperSyncModeThunk({ name, syncMode })).unwrap();
      setIsAutoSync(response.sync.mode === 'auto');
      setInitialSyncMode(response.sync.mode);
      message.success('Sync Settings Updated Successfully!');
    } catch (error) {
      console.error('Error updating sync settings:', error);
      message.error('Failed to update settings');
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
        if (response.status === 200) {
          message.success('Maintenance mode updated successfully!');
        } else {
          throw new Error('Unexpected response status');
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

        if (response.status === 200) {
          message.success(response.message || 'Maintenance mode enabled successfully!');
        } else {
          throw new Error('Unexpected response status');
        }
      }

      // Re-fetch details and sync local switches with the latest server state
      const refreshed = await dispatch(fetchGrouperDetailsThunk(name!)).unwrap();
      if (refreshed?.maintenance) {
        setHasMaintenanceData(true);
        setIsMaintenanceModeActive(refreshed.maintenance.status === 'Active');
        setMaintenanceUpdateAction(
          refreshed.maintenance.updateAction === 'allow' ||
            (refreshed.maintenance.updateAction as any) === true,
        );
        setMaintenanceDeleteAction(
          refreshed.maintenance.deleteAction === 'allow' ||
            (refreshed.maintenance.deleteAction as any) === true,
        );
      }
      setIsMaintenanceModalVisible(false);
    } catch (error) {
      console.error('Failed to handle maintenance mode update', error);
      message.error('Failed to update maintenance mode');
    }
  };

  const handleRemoveMaintenanceMode = async () => {
    try {
      // Dispatch the action to disable maintenance mode
      const response = await dispatch(removeGrouperMaintenanceModeThunk(name!)).unwrap();

      // Handle the response and show a success message
      if (response.status === 200) {
        message.success('Maintenance mode removed successfully!');
        // Optionally update the UI state to reflect the change
        setIsMaintenanceModeActive(false);
        setMaintenanceUpdateAction(false);
        setMaintenanceDeleteAction(false);
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      console.error('Failed to remove maintenance mode', error);
      message.error('Failed to remove maintenance mode');
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
