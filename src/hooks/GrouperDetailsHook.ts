import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import {
  fetchGrouperDetailsThunk,
  clearDetails,
  updateGrouperSyncModeThunk,
  enableGrouperMaintenanceModeThunk,
} from '../store/grouperSlice';
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

  // Ensure hasChanges is a boolean
  const hasChanges = Boolean(
    initialSyncMode && (isAutoSync ? 'auto' : 'manual') !== initialSyncMode
  );

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
      setMaintenanceUpdateAction(grouperDetails.maintenance?.updateAction === 'allow');
      setMaintenanceDeleteAction(grouperDetails.maintenance?.deleteAction === 'allow');
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
      const response = await dispatch(
        enableGrouperMaintenanceModeThunk({
          grouperName: name!,
          resourceType,
          updateAction: maintenaceUpdateAction,
          deleteAction: maintenaceDeleteAction,
        })
      ).unwrap();

      if (response.status === 200) {
        message.success(response.message || 'Maintenance mode settings updated successfully!');
        setIsMaintenanceModalVisible(false);
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      console.error('Failed to handle maintenance mode update', error);
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
  };
};
