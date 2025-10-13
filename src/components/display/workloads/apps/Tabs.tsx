import React, { useState } from 'react';
import { DEFAULT_COLORS } from '../../../../constants';

const TAB_KEYS = {
  GENERAL: 'general',
  INSTANCES: 'instances',
  BRIDGES: 'bridges',
  HISTORY: 'history',
  SYNC: 'sync',
} as const;

type TabKey = (typeof TAB_KEYS)[keyof typeof TAB_KEYS];

interface WorkloadTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const TabButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({
  label,
  active,
  onClick,
}) => {
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

const WorkloadTabs: React.FC<WorkloadTabsProps> = ({ activeTab, onTabChange }) => {
  return (
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
      <TabButton
        label="General"
        active={activeTab === TAB_KEYS.GENERAL}
        onClick={() => onTabChange(TAB_KEYS.GENERAL)}
      />
      <TabButton
        label="Instances"
        active={activeTab === TAB_KEYS.INSTANCES}
        onClick={() => onTabChange(TAB_KEYS.INSTANCES)}
      />
      <TabButton
        label="Bridges"
        active={activeTab === TAB_KEYS.BRIDGES}
        onClick={() => onTabChange(TAB_KEYS.BRIDGES)}
      />
      <TabButton
        label="History"
        active={activeTab === TAB_KEYS.HISTORY}
        onClick={() => onTabChange(TAB_KEYS.HISTORY)}
      />
      <TabButton
        label="Sync Mode"
        active={activeTab === TAB_KEYS.SYNC}
        onClick={() => onTabChange(TAB_KEYS.SYNC)}
      />
    </div>
  );
};

export default WorkloadTabs;
export { TAB_KEYS };
export type { TabKey };
