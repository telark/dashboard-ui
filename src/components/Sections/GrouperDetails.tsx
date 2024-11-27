import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGrouperDetailsThunk, updateGrouperSyncThunk, clearDetails } from '../../store/grouperSlice';
import { RootState, AppDispatch } from '../../store';
import { useParams } from 'react-router-dom';

import { Card, Tabs, Switch, message, Collapse } from 'antd';
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  HistoryOutlined,
} from '@ant-design/icons';

import { DEFAULT_COLORS } from '../../config';
import PrimaryButton from '../Buttons/PrimaryButton';
import GeneralInfo from '../Display/GeneralInfo';
import HistoryTimeLine from '../Display/HistoryTimeLine';
import Resources from '../Display/Resources';

const GrouperDetails: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { name } = useParams<{ name: string }>();
  const { details: grouperDetails, loading, error } = useSelector((state: RootState) => state.grouper);

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
                  <Collapse.Panel header="Resources" key="2">
                    <Resources resources={[...grouperDetails.workloads, ...grouperDetails.bridges]} />
                  </Collapse.Panel>
                </Collapse>
              ),
            },
            {
              key: '2',
              label: (
                <span>
                  <HistoryOutlined style={{ marginRight: '8px' }} />
                  History
                </span>
              ),
              children: <HistoryTimeLine Records={grouperDetails.history} />,
            },
            {
              key: '3',
              label: (
                <span>
                  <SettingOutlined style={{ marginRight: '8px' }} />
                  Settings
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
          ]}
        />
      </Card>
    </div>
  );
};

export default GrouperDetails;
