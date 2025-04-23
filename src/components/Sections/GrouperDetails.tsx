import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGrouperDetailsThunk, updateGrouperSyncThunk, clearDetails, enableMaintenanceModeThunk} from '../../store/grouperSlice';
import { RootState, AppDispatch } from '../../store';
import { useParams } from 'react-router-dom';

import { Card, Tabs, Switch, message, Collapse, Modal } from 'antd';
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

  useEffect(() => {
    console.log("Message should appear now");
    message.success('Hello World!');
  }, []);
  


  const handleMaintenanceMode = async () => {
    const grouperName = `${name}-grouper`;
    const resourceType = grouperDetails?.kind?.toLowerCase();
    message.success('Success!', 3, () => {
      console.log('Message has been displayed');
    });
  
    try {
      // Dispatch the thunk with the parameters
      const response = await dispatch(enableMaintenanceModeThunk({
        grouperName,
        resourceType,
        updateAction: maintenaceUpdateAction,
        deleteAction: maintenaceDeleteAction,
      })).unwrap();
      console.log("Thunk response:", response);
      if (response.status === 200) {
        message.success(response.message || "Maintenance mode Enabled successfully!");
        setIsMaintenanceModalVisible(false);
      } else {
        throw new Error("Unexpected response status");
      }
      
    } catch (error) {
      console.error("Failed to handle maintenance mode update", error);
    }
  };
  

  const handleGrouperSyncSave = async () => {
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
  const [maintenaceUpdateAction, setMaintenanceUpdateAction] = useState(true);
  const [maintenaceDeleteAction, setMaintenanceDeleteAction] = useState(true);

  const handleEnableMaintenanceClick = () => {
    setIsMaintenanceModalVisible(true); // Show the modal
  };

  const handleCancelMaintenance = () => {
    setIsMaintenanceModalVisible(false); // Close the modal without saving
  };

  const handleMaintenanceUpdateActionChange = (checked: boolean) => {
    setMaintenanceUpdateAction(checked);
  };

  const handleMaintenanceDeleteActionChange = (checked: boolean) => {
    setMaintenanceDeleteAction(checked);
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
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '24px',
                  }}
                >
                  <div
                    style={{
                      padding: '32px',
                      background: '#fff',
                      border: '1px solid #e1e4e8',
                      borderRadius: '10px',
                      maxWidth: '900px',
                      width: '100%',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <div
                        style={{
                          flexShrink: 0,
                          marginRight: '16px',
                          marginTop: '4px',
                          background: '#f0f9ff',
                          borderRadius: '6px',
                          padding: '10px',
                        }}
                      >
                        <SyncOutlined style={{ fontSize: '22px', color: '#1890ff' }} />
                      </div>
            
                      <div style={{ flexGrow: 1 }}>
                        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
                          Configure Sync Mode
                        </h2>
                        <p style={{ marginTop: '10px', fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
                          Manage the synchronization behavior of your resources within this namespace. When enabled, Auto Sync ensures that your system periodically fetches the latest updates, keeping everything in sync automatically. In Manual Mode, updates are only applied when you explicitly trigger them, giving you more control over when changes are made.
                        </p>
            
                        <ul style={{ marginTop: '14px', paddingLeft: '20px', color: '#444', fontSize: '14px' }}>
                          <li>
                            <strong>Auto Sync</strong> will periodically fetch updates and automatically reconcile the state of your resources.
                          </li>
                          <li>
                            <strong>Manual Mode</strong> provides more control by requiring manual intervention to synchronize resources.
                          </li>
                        </ul>
                      </div>
                    </div>
            
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center', // Ensures vertical alignment of text and switch
                        marginTop: '32px',
                      }}
                    >
                      <span style={{ fontSize: '14px', fontWeight: 500, marginRight: '8px' }}>Auto Sync Mode:</span>
                      <Switch
                        checked={isAutoSync}
                        onChange={handleAutoSyncChange}
                        checkedChildren="On"
                        unCheckedChildren="Off"
                        style={{
                          marginLeft: '8px', // Small gap between the text and the switch
                          backgroundColor: isAutoSync ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.SWITCH_OFF,
                        }}
                      />
                    </div>
            
                    <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'center' }}>
                      <PrimaryButton
                        onClick={handleGrouperSyncSave}
                        disabled={!hasChanges}
                        loading={loadingSave}
                        loadingLabel="Saving..."
                        action={`Save Settings ${hasChanges ? `(${isAutoSync ? 'Auto Sync' : 'Manual Mode'})` : ''}`}
                        icon={<CheckCircleOutlined />}
                      />
                    </div>
                  </div>
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
                    justifyContent: 'center',
                    padding: '24px',
                  }}
                >
                  <div
                    style={{
                      padding: '32px',
                      background: '#fff',
                      border: '1px solid #e1e4e8',
                      borderRadius: '10px',
                      maxWidth: '900px',
                      width: '100%',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <div
                        style={{
                          flexShrink: 0,
                          marginRight: '16px',
                          marginTop: '4px',
                          background: '#fef4e5',
                          borderRadius: '6px',
                          padding: '10px',
                        }}
                      >
                        <WarningOutlined style={{ fontSize: '22px', color: '#faad14' }} />
                      </div>
            
                      <div style={{ flexGrow: 1 }}>
                        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
                          Enable Maintenance Mode
                        </h2>
                        <p style={{ marginTop: '10px', fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
                          This mode helps you test and stabilize existing deployments and services within this namespace without worrying about unintended resource creation. 
                          By temporarily disabling new additions, your testing process becomes more controlled and less prone to disruption.
                        </p>
            
                        <ul style={{ marginTop: '14px', paddingLeft: '20px', color: '#444', fontSize: '14px' }}>
                          <li>
                            <strong>Creation of new resources</strong> is restricted by default to avoid accidental rollouts.
                          </li>
                          <li>
                            <strong>Updates and deletions</strong> are allowed to give you control over existing instances during the lifecycle.
                          </li>
                        </ul>
                      </div>
                    </div>
            
                    <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
                      <PrimaryButtonWithOutLoading
                        onClick={handleEnableMaintenanceClick}
                        action="Enable"
                        icon={<CheckCircleOutlined />}
                      />
                    </div>
            
                    {/* Modal for settings */}
                    <Modal
                      open={isMaintenanceModalVisible}
                      onOk={handleMaintenanceMode}
                      onCancel={handleCancelMaintenance}
                      okText="Save"
                      cancelText="Cancel"
                      centered
                      closeIcon={<span style={{ fontSize: '18px', padding: '0 20px' }}>×</span>}
                      bodyStyle={{
                        padding: '24px',
                      }}
                    >
                      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
                        Maintenance Mode Settings
                      </h3>
                      <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                        Choose whether the current resources should continue to receive updates during maintenance.
                      </p>
            
                      {/* Allow Updates */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: '#f5f5f5',
                          border: '1px solid #e0e0e0',
                          borderRadius: '6px',
                          padding: '12px 16px',
                          marginBottom: '12px',  // Space between the switches
                        }}
                      >
                        <span style={{ fontWeight: 500, fontSize: '14px' }}>
                          Allow Current Resources Updates
                        </span>
                        <Switch
                          checked={maintenaceUpdateAction}
                          onChange={handleMaintenanceUpdateActionChange}
                        />
                      </div>

                      {/* Allow Deletion */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: '#f5f5f5',
                          border: '1px solid #e0e0e0',
                          borderRadius: '6px',
                          padding: '12px 16px',
                        }}
                      >
                        <span style={{ fontWeight: 500, fontSize: '14px' }}>
                          Allow Current Resources Deletion
                        </span>
                        <Switch
                          checked={maintenaceDeleteAction}
                          onChange={handleMaintenanceDeleteActionChange}
                        />
                      </div>
                    </Modal>
                  </div>
                </div>
              )
            }
                        
          ]}
        />
      </Card>
    </div>
  );
};

export default GrouperDetails;