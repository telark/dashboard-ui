import React from 'react';
import { Card, Tabs, Collapse } from 'antd';
import {
  InfoCircleOutlined,
  SyncOutlined,
  HistoryOutlined,
  AppstoreOutlined,
  WarningOutlined,
} from '@ant-design/icons';

import { GrouperDetailsHook } from '../../hooks/GrouperDetailsHook';
import GeneralInfo from '../Display/GeneralInfo';
import HistoryTimeLine from '../Display/HistoryTimeLine';
import MaintenanceMode from '../Tabs/MaintenanceMode';
import Resources from '../Display/Resources';
import SyncMode from '../Tabs/SyncMode';

const GrouperDetails: React.FC = () => {
  const {
    // Global Data
    grouperDetails,
    loading,
    error,

    // Sync Data
    isAutoSync,
    loadingSave,
    hasChanges,
    handleAutoSyncChange,
    handleGrouperSyncSave,

    // Maintenance Data
    isMaintenanceModeActive,
    isMaintenanceModalVisible,
    maintenaceUpdateAction,
    maintenaceDeleteAction,
    handleEnableMaintenanceClick,
    handleCancelMaintenance,
    handleMaintenanceUpdateActionChange,
    handleMaintenanceDeleteActionChange,
    handleMaintenanceMode,
  } = GrouperDetailsHook();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching grouper details: {error}</div>;
  }

  if (!grouperDetails) {
    return <div>No details available for this grouper.</div>;
  }

  const totalResources =
    (grouperDetails.workloads?.length || 0) + (grouperDetails.bridges?.length || 0);

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
                    <GeneralInfo {...grouperDetails} totalResources={totalResources} />
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
                    name={grouperDetails.name}
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
                <SyncMode
                  isAutoSync={isAutoSync}
                  loadingSave={loadingSave}
                  hasChanges={hasChanges}
                  handleAutoSyncChange={handleAutoSyncChange}
                  handleGrouperSyncSave={handleGrouperSyncSave}
                />
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
                <MaintenanceMode
                  isMaintenanceModeActive={isMaintenanceModeActive}
                  maintenaceUpdateAction={maintenaceUpdateAction}
                  maintenaceDeleteAction={maintenaceDeleteAction}
                  isMaintenanceModalVisible={isMaintenanceModalVisible}
                  handleEnableMaintenanceClick={handleEnableMaintenanceClick}
                  handleCancelMaintenance={handleCancelMaintenance}
                  handleMaintenanceUpdateActionChange={handleMaintenanceUpdateActionChange}
                  handleMaintenanceDeleteActionChange={handleMaintenanceDeleteActionChange}
                  handleMaintenanceMode={handleMaintenanceMode}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default GrouperDetails;
