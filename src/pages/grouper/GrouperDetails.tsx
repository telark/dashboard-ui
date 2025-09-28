import React, { useState } from 'react';
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
import TimeAgo from '../../components/time/TimeAgo';

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

const TAB_KEYS = {
  GENERAL: 'general',
  RESOURCES: 'resources',
  HISTORY: 'history',
  SYNC: 'sync',
  MAINTENANCE: 'maintenance',
} as const;

type TabKey = typeof TAB_KEYS[keyof typeof TAB_KEYS];

const TabButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const background = active ? '#fff' : hovered ? 'rgba(32,201,151,0.08)' : 'transparent';
  const color = active ? '#0B1F33' : hovered ? DEFAULT_COLORS.SUCCESS : '#6b7280';
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        all: 'unset',
        cursor: 'pointer',
        padding: '10px 18px',
        borderRadius: 22,
        background,
        color,
        fontWeight: active ? 700 : 600,
        boxShadow: active ? '0 6px 18px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.2s ease',
      }}
    >
      {label}
    </button>
  );
};

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

  const [activeTab, setActiveTab] = useState<TabKey>(TAB_KEYS.GENERAL);

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
        minHeight: '100vh',
        marginTop: 60,
        padding: '24px',
        paddingBottom: 64,
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
            <div style={{ color: '#5B6B7C', fontSize: 12, marginTop: 4 }}>
              Last update was <TimeAgo date={grouperDetails.lastUpdateTime} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button size="middle" icon={<SyncOutlined />} onClick={handleGrouperSyncSave} loading={loadingSave} disabled={!hasChanges && isAutoSync}>
            Sync now
          </Button>
          <Button onClick={handleEnableMaintenanceClick}>Maintenance</Button>
        </div>
      </div>

      {/* Tabs header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          background: 'linear-gradient(180deg, rgba(239,244,250,0.6), rgba(239,244,250,0))',
          padding: '8px 0',
          borderRadius: 24,
          marginBottom: 16,
        }}
      >
        <TabButton label="General" active={activeTab === TAB_KEYS.GENERAL} onClick={() => setActiveTab(TAB_KEYS.GENERAL)} />
        <TabButton label={`Resources (${totalResources})`} active={activeTab === TAB_KEYS.RESOURCES} onClick={() => setActiveTab(TAB_KEYS.RESOURCES)} />
        <TabButton label="History" active={activeTab === TAB_KEYS.HISTORY} onClick={() => setActiveTab(TAB_KEYS.HISTORY)} />
        <TabButton label="Sync Mode" active={activeTab === TAB_KEYS.SYNC} onClick={() => setActiveTab(TAB_KEYS.SYNC)} />
        <TabButton label="Maintenance Mode" active={activeTab === TAB_KEYS.MAINTENANCE} onClick={() => setActiveTab(TAB_KEYS.MAINTENANCE)} />
      </div>

      {/* Active section */}
      {activeTab === TAB_KEYS.GENERAL && (
        <Card style={sectionCardStyle} bodyStyle={{ padding: 16 }}> 
          <GeneralInfo {...grouperDetails} totalResources={totalResources} />
        </Card>
      )}

      {activeTab === TAB_KEYS.RESOURCES && (
        <Card style={sectionCardStyle} bodyStyle={{ padding: 16 }}> 
          <div style={{ padding: 4 }}>
            <Resources name={grouperDetails.name} resources={[...grouperDetails.workloads, ...grouperDetails.bridges]} />
          </div>
        </Card>
      )}

      {activeTab === TAB_KEYS.HISTORY && (
        <Card style={sectionCardStyle} bodyStyle={{ padding: 16 }}> 
          <HistoryTimeLine Records={grouperDetails.history} />
        </Card>
      )}

      {activeTab === TAB_KEYS.SYNC && (
        <Card style={sectionCardStyle} bodyStyle={{ padding: 16 }}> 
          <SyncMode
            isAutoSync={isAutoSync}
            loadingSave={loadingSave}
            hasChanges={hasChanges}
            handleAutoSyncChange={handleAutoSyncChange}
            handleGrouperSyncSave={handleGrouperSyncSave}
          />
        </Card>
      )}

      {activeTab === TAB_KEYS.MAINTENANCE && (
        <Card style={{ ...sectionCardStyle, marginBottom: 24 }} bodyStyle={{ padding: 16 }}> 
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
      )}
    </div>
  );
};

export default GrouperDetails;
