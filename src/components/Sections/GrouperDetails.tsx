import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGrouperDetailsThunk, updateGrouperSyncThunk, clearDetails, enableMaintenanceModeThunk} from '../../store/grouperSlice';
import { RootState, AppDispatch } from '../../store';
import { useParams } from 'react-router-dom';

import { Card, Tabs, Switch, message, Collapse, Alert, Modal } from 'antd';
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  SyncOutlined,
  HistoryOutlined,
  AppstoreOutlined,
  WarningOutlined,
} from '@ant-design/icons';

import { DEFAULT_COLORS } from '../../config';
import PrimaryButton from '../Buttons/PrimaryButton';
import GeneralInfo from '../Display/GeneralInfo';
import HistoryTimeLine from '../Display/HistoryTimeLine';
import Resources from '../Display/Resources';
import PrimaryButtonWithOutLoading from '../Buttons/PrimayButtonWithOutLoading';

const GrouperDetails: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { name } = useParams<{ name: string }>();
  const { details: grouperDetails, loading, error } = useSelector((state: RootState) => state.grouper);

  // Non-null assertion
  const grouperName = name!;

  const [isAutoSync, setIsAutoSync] = useState<boolean>(false);
  const [initialSyncMode, setInitialSyncMode] = useState<string>(''); // To track the original mode
  const [loadingSave, setLoadingSave] = useState<boolean>(false);

  const hasChanges = initialSyncMode && (isAutoSync ? 'auto' : 'manual') !== initialSyncMode;

  // Fetch grouper details on mount or name change
  useEffect(() => {
    if (name) {
      dispatch(clearDetails()); // Clear state data
      dispatch(fetchGrouperDetailsThunk(name));
    }

    return () => {
      dispatch(clearDetails()); // Cleanup on unmount
    };
  }, [dispatch, name]);

  // Update local state when Redux state changes
  useEffect(() => {
    if (grouperDetails?.sync) {
      setIsAutoSync(grouperDetails.sync.mode === 'auto');
      setInitialSyncMode(grouperDetails.sync.mode); // Set initial mode for comparison
    }
  }, [grouperDetails]);

  const handleAutoSyncChange = (checked: boolean) => {
    setIsAutoSync(checked);
  };


  const handleMaintenanceMode = async () => {
    const scopeName = name || "default"; 
    const scopeType = grouperDetails?.kind;
  
    try {
      // Dispatch the thunk with the parameters
      const response = await dispatch(enableMaintenanceModeThunk({ scopeName, scopeType, allowUpdates })).unwrap();
      if (response?.status === 200) {
        message.success("Maintenance mode settings updated successfully!");
        setIsMaintenanceModalVisible(false);
      } else {
        throw new Error("Unexpected response status");
      }
      
    } catch (error) {
      console.error("Failed to update maintenance mode settings:", error);
    }
  };
  

  const handleSave = async () => {
    if (!name) return;
    setLoadingSave(true);
  
    try {
      const syncMode = isAutoSync ? 'auto' : 'manual';
      const response = await dispatch(updateGrouperSyncThunk({ name, syncMode })).unwrap();
  
      // Update Redux state and local state
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

  const [isMaintenanceModalVisible, setIsMaintenanceModalVisible] = useState(false); // Modal visibility state
  const [allowUpdates, setAllowUpdates] = useState(true);

  const handleEnableMaintenanceClick = () => {
    setIsMaintenanceModalVisible(true); // Show the modal
  };

  const handleCancelMaintenance = () => {
    setIsMaintenanceModalVisible(false); // Close the modal without saving
  };

  const handleAllowUpdatesChange = (checked: boolean) => {
    setAllowUpdates(checked); // Update state
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching grouper details: {error}</div>;
  }

  if (!grouperDetails) {
    return <div>No details available for this grouper.</div>;
  }

  // Calculate total resources (workloads + bridges)
  const totalResources = (grouperDetails.workloads?.length || 0) + (grouperDetails.bridges?.length || 0);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100vh',
        padding: '16px',
      }}
    >
      <Card
        style={{
          width: '90%',
          marginTop: '80px',
          borderRadius: '12px',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
          position: 'relative',
        }}
      >
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: (
                <span>
                  <InfoCircleOutlined style={{ marginRight: '8px' }} />
                  General
                </span>
              ),
              children: (
                <Collapse defaultActiveKey={['1', '2']} ghost>
                  <Collapse.Panel header="General Information" key="1">
                    <GeneralInfo 
                      {...grouperDetails}
                      totalResources={totalResources}
                    />
                  </Collapse.Panel>
                </Collapse>
              ),
            },
            {
              key: '2',
              label: (
                <span>
                  <AppstoreOutlined style={{ marginRight: '8px' }} />
                  {`Resources (${totalResources})`}
                </span>
              ),
              children: (
                <div style={{ padding: '5px' }}>
                 <Resources 
                      name={grouperName}
                      resources={[...grouperDetails.workloads, ...grouperDetails.bridges]}
                    />
                </div>
              ),
            },
            {
              key: '3',
              label: (
                <span>
                  <HistoryOutlined style={{ marginRight: '8px' }} />
                  History
                </span>
              ),
              children: <HistoryTimeLine Records={grouperDetails.history} />,
            },
            {
              key: '4',
              label: (
                <span>
                  <SyncOutlined style={{ marginRight: '8px' }} />
                  Sync Settings
                </span>
              ),
              children: (
                <div style={{ padding: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <strong>Auto Sync Mode:</strong>
                    <Switch
                      checked={isAutoSync}
                      onChange={handleAutoSyncChange}
                      checkedChildren="On"
                      unCheckedChildren="Off"
                      style={{
                        marginLeft: '10px',
                        backgroundColor: isAutoSync
                          ? DEFAULT_COLORS.SUCCESS
                          : DEFAULT_COLORS.SWITCH_OFF,
                      }}
                    />
                  </div>
                  <PrimaryButton
                    onClick={handleSave}
                    disabled={!hasChanges} // Disable button if no changes
                    loading={loadingSave}
                    loadingLabel="saving..."
                    action="Save Settings"
                    icon={<CheckCircleOutlined />}
                  />
                </div>
              ),
            },
            {
              key: '5',
              label: (
                <span>
                  <WarningOutlined style={{ marginRight: '8px' }} />
                  Maintenance
                </span>
              ),
              children: (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    padding: '20px',
                  }}
                >
                  <Alert
                    type="warning"
                    description="Maintenance Mode enhances stability for the selected scope by restricting interactions with new resources. This allows you to focus on developing or testing the current resources without the risk of interference from new resource rollouts."
                    showIcon
                    style={{
                      width: '100%',
                      maxWidth: '600px',
                      marginBottom: '20px',
                      textAlign: 'center',
                    }}
                  />
                  <PrimaryButtonWithOutLoading
                    onClick={handleEnableMaintenanceClick}
                    action="Enable"
                    icon={<CheckCircleOutlined />}
                  />
            
                  {/* Modal Definition */}
                  <Modal
                    open={isMaintenanceModalVisible}
                    onOk={handleMaintenanceMode}
                    onCancel={handleCancelMaintenance}
                    okText="Save"
                    cancelText="Cancel"
                    style={{
                      paddingTop: '30px', // Add padding at the top of the modal
                    }}
                    bodyStyle={{
                      paddingTop: '20px', // Adds more space between the top and content
                    }}
                    closeIcon={<span style={{ fontSize: '18px', padding: '0 20px' }}>×</span>} // Customized close icon
                  >
                    {/* Warning Section */}
                    <Alert
                      type="warning"
                      message="Maintenance Mode Settings"
                      description="Choose whether the current resources should receive updates during maintenance mode using the switch below."
                      showIcon
                      style={{
                        marginTop: '15px',
                      }}
                    />

                    {/* Switch Section */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                        Allow Current Resources Updates
                      </span>
                      <Switch
                        checked={allowUpdates}
                        onChange={handleAllowUpdatesChange}
                      />
                    </div>
                  </Modal>
                </div>
              ),
            }            
          ]}
        />
      </Card>
    </div>
  );
};

export default GrouperDetails;
