import React, { useState } from 'react';
import { Switch, Modal, Button, Checkbox } from 'antd';
import {
  CheckCircleOutlined,
  MinusCircleOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import PrimaryButtonWithOutLoading from '../buttons/PrimayButtonWithOutLoading';
import { DEFAULT_COLORS } from '../../constants';
import { MAINTENANCE_MODE } from '../../constants/layout/modes';

interface MaintenanceModeProps {
  isMaintenanceModeActive: boolean;
  maintenaceUpdateAction: boolean;
  maintenaceDeleteAction: boolean;
  isMaintenanceModalVisible: boolean;
  handleEnableMaintenanceClick: () => void;
  handleCancelMaintenance: () => void;
  handleMaintenanceUpdateActionChange: (checked: boolean) => void;
  handleMaintenanceDeleteActionChange: (checked: boolean) => void;
  handleMaintenanceMode: () => void;
  hasMaintenanceData: boolean;
  handleRemoveMaintenanceMode: () => void;
}

const MaintenanceMode: React.FC<MaintenanceModeProps> = ({
  isMaintenanceModeActive,
  maintenaceUpdateAction,
  maintenaceDeleteAction,
  isMaintenanceModalVisible,
  handleEnableMaintenanceClick,
  handleCancelMaintenance,
  handleMaintenanceUpdateActionChange,
  handleMaintenanceDeleteActionChange,
  handleMaintenanceMode,
  hasMaintenanceData,
  handleRemoveMaintenanceMode,
}) => {
  // State for toggling advanced options (Workloads / Services)
  const [isAdvancedOptionsVisible, setAdvancedOptionsVisible] = useState(false);

  // State for checkboxes in the advanced options
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Toggle Advanced Options
  const toggleAdvancedOptions = () => {
    setAdvancedOptionsVisible(!isAdvancedOptionsVisible);
  };

  // Note: option change handler is currently inlined where needed

  return (
    <div style={{ padding: '8px 4px 24px' }}>
      {isMaintenanceModeActive && (
        <p style={{ color: '#faad14', fontWeight: 600, marginTop: 0 }}>
          {MAINTENANCE_MODE.maintenanceActive}
        </p>
      )}

      {/* Description only (title & icon are handled by the section header) */}
      <p style={{ marginTop: 0, fontSize: '13px', color: '#5B6B7C', lineHeight: 1.6 }}>
        {MAINTENANCE_MODE.description}
      </p>
      <ul style={{ marginTop: 10, paddingLeft: 18, color: '#4a5568', fontSize: 13 }}>
        {MAINTENANCE_MODE.list.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <div
        style={{
          marginTop: 20,
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <PrimaryButtonWithOutLoading
          onClick={handleEnableMaintenanceClick}
          action={
            isMaintenanceModeActive
              ? MAINTENANCE_MODE.updateButtonLabel
              : MAINTENANCE_MODE.enableButtonLabel
          }
          icon={<CheckCircleOutlined />}
        />
        {isMaintenanceModeActive && (
          <PrimaryButtonWithOutLoading
            onClick={handleRemoveMaintenanceMode}
            action={MAINTENANCE_MODE.removeButtonLabel}
            color={DEFAULT_COLORS.DANGER}
            icon={<MinusCircleOutlined />}
          />
        )}
      </div>

      {/* Modal for settings */}
      <Modal
        open={isMaintenanceModalVisible}
        onOk={handleMaintenanceMode}
        onCancel={handleCancelMaintenance}
        okText="Save"
        cancelText="Cancel"
        centered
        closeIcon={<span style={{ fontSize: 18, padding: '0 20px' }}>×</span>}
        styles={{ body: { padding: 24 } }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
          {MAINTENANCE_MODE.modalTitle}
        </h3>
        <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
          {MAINTENANCE_MODE.modalDescription}
        </p>

        {/* Allow Updates */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            border: '1px solid #e0e0e0',
            borderRadius: 6,
            padding: '12px 16px',
            marginBottom: 12,
          }}
        >
          <span style={{ fontWeight: 500, fontSize: 14 }}>
            {MAINTENANCE_MODE.updateActionLabel}
          </span>
          <Switch
            checked={maintenaceUpdateAction}
            onChange={handleMaintenanceUpdateActionChange}
            disabled={hasMaintenanceData && !isMaintenanceModeActive}
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
            borderRadius: 6,
            padding: '12px 16px',
          }}
        >
          <span style={{ fontWeight: 500, fontSize: 14 }}>
            {MAINTENANCE_MODE.deleteActionLabel}
          </span>
          <Switch
            checked={maintenaceDeleteAction}
            onChange={handleMaintenanceDeleteActionChange}
            disabled={hasMaintenanceData && !isMaintenanceModeActive}
          />
        </div>

        {/* Advanced Options */}
        <div style={{ marginTop: 16 }}>
          <Button
            onClick={toggleAdvancedOptions}
            icon={isAdvancedOptionsVisible ? <UpOutlined /> : <DownOutlined />}
            style={{ width: '100%', textAlign: 'left', border: 0 }}
          >
            {MAINTENANCE_MODE.advancedOptionsLabel}
          </Button>

          {isAdvancedOptionsVisible && (
            <div style={{ marginTop: 12, paddingLeft: 20 }}>
              <div style={{ marginBottom: 12 }}>
                <Checkbox
                  value="workload"
                  checked={selectedOptions.includes('workload')}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelectedOptions((prev) =>
                      checked ? [...prev, 'workload'] : prev.filter((item) => item !== 'workload'),
                    );
                  }}
                >
                  {MAINTENANCE_MODE.advancedOptionWorkloadLabel}
                </Checkbox>
              </div>
              <div>
                <Checkbox
                  value="service"
                  checked={selectedOptions.includes('service')}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelectedOptions((prev) =>
                      checked ? [...prev, 'service'] : prev.filter((item) => item !== 'service'),
                    );
                  }}
                >
                  {MAINTENANCE_MODE.advancedOptionServiceLabel}
                </Checkbox>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default MaintenanceMode;
