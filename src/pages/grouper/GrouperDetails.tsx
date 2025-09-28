import React from 'react';
import { Card, Button, Tag } from 'antd';
import {
  InfoCircleOutlined,
  SyncOutlined,
  HistoryOutlined,
  AppstoreOutlined,
  WarningOutlined,
} from '@ant-design/icons';

import { GrouperDetailsHook } from '../../hooks/GrouperDetailsHook';
import GeneralInfo from '../../components/display/GeneralInfo';
import HistoryTimeLine from '../../components/display/HistoryTimeLine';
import MaintenanceMode from '../../components/tabs/MaintenanceMode';
import Resources from '../../components/display/Resources';
import SyncMode from '../../components/tabs/SyncMode';
import StatusButton from '../../components/buttons/StatusButton';
import { DEFAULT_COLORS } from '../../constants';

const sectionCardStyle: React.CSSProperties = {
  borderRadius: 16,
  boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
  border: 'none',
  marginBottom: 16,
};

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; caption?: string; extra?: React.ReactNode }> = ({ icon, title, caption, extra }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ color: DEFAULT_COLORS.SUCCESS, fontSize: 16, display: 'inline-flex' }}>{icon}</span>
      <span style={{ fontWeight: 700, color: '#0B1F33' }}>{title}</span>
      {caption && <span style={{ color: '#5B6B7C', fontSize: 12 }}>{caption}</span>}
    </div>
    {extra}
  </div>
);

const GrouperDetails: React.FC = () => {
  const {
    // Global Data
    grouperDetails,
    loading,
    error,

    // Sync Mode Data
    isAutoSync,
    loadingSave,
    hasChanges,
    handleAutoSyncChange,
    handleGrouperSyncSave,

    // Maintenance Mode Data
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
  } = GrouperDetailsHook();

  if (loading) {
    return <div style={{ marginTop: 60, padding: 24 }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ marginTop: 60, padding: 24 }}>Error fetching grouper details: {error}</div>;
  }

  if (!grouperDetails) {
    return <div style={{ marginTop: 60, padding: 24 }}>No details available for this grouper.</div>;
  }

  const totalResources = (grouperDetails.workloads?.length || 0) + (grouperDetails.bridges?.length || 0);

  return (
    <div
      style={{
        background: DEFAULT_COLORS.PAGE_BG,
        minHeight: 'calc(100vh - 60px)',
        marginTop: 60,
        padding: '24px',
      }}
    >
      {/* Header section */}
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 10px 24px rgba(0,0,0,0.06)',
          padding: 16,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(32,201,151,0.12)',
              boxShadow: 'inset 0 0 0 2px rgba(32,201,151,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: DEFAULT_COLORS.SUCCESS,
              fontSize: 20,
            }}
          >
            <AppstoreOutlined />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0B1F33' }}>{grouperDetails.name}</div>
              <StatusButton status={(grouperDetails.status as 'Active' | 'Inactive') || 'Inactive'} icon={<InfoCircleOutlined />} />
              {isMaintenanceModeActive && (
                <Tag color="orange" icon={<WarningOutlined />}>Maintenance</Tag>
              )}
            </div>
            <div style={{ color: '#5B6B7C', fontSize: 12, marginTop: 4 }}>Last update was {grouperDetails.lastUpdateTime || '-'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button size="middle" icon={<SyncOutlined />} onClick={handleGrouperSyncSave} loading={loadingSave} disabled={!hasChanges && isAutoSync}>
            Sync now
          </Button>
          <Button onClick={handleEnableMaintenanceClick}>Maintenance</Button>
        </div>
      </div>

      {/* Sections */}
      <Card style={sectionCardStyle} bodyStyle={{ padding: 16 }} title={<SectionHeader icon={<InfoCircleOutlined />} title="General" />}> 
        <GeneralInfo {...grouperDetails} totalResources={totalResources} />
      </Card>

      <Card
        style={sectionCardStyle}
        bodyStyle={{ padding: 16 }}
        title={<SectionHeader icon={<AppstoreOutlined />} title={`Resources`} caption={`(${totalResources})`} />}
      >
        <div style={{ padding: 4 }}>
          <Resources name={grouperDetails.name} resources={[...grouperDetails.workloads, ...grouperDetails.bridges]} />
        </div>
      </Card>

      <Card style={sectionCardStyle} bodyStyle={{ padding: 16 }} title={<SectionHeader icon={<HistoryOutlined />} title="History" />}> 
        <HistoryTimeLine Records={grouperDetails.history} />
      </Card>

      <Card style={sectionCardStyle} bodyStyle={{ padding: 16 }} title={<SectionHeader icon={<SyncOutlined />} title="Sync Mode" />}> 
        <SyncMode
          isAutoSync={isAutoSync}
          loadingSave={loadingSave}
          hasChanges={hasChanges}
          handleAutoSyncChange={handleAutoSyncChange}
          handleGrouperSyncSave={handleGrouperSyncSave}
        />
      </Card>

      <Card style={sectionCardStyle} bodyStyle={{ padding: 16 }} title={<SectionHeader icon={<WarningOutlined />} title="Maintenance Mode" />}> 
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
          hasMaintenanceData={hasMaintenanceData}
          handleRemoveMaintenanceMode={handleRemoveMaintenanceMode}
        />
      </Card>
    </div>
  );
};

export default GrouperDetails;
