import React from 'react';
import { Switch, Modal } from 'antd';
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import PrimaryButtonWithOutLoading from '../Buttons/PrimayButtonWithOutLoading';

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
}) => {
  return (
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
        {isMaintenanceModeActive && (
          <p style={{ color: '#faad14', fontWeight: 600 }}>Maintenance Mode is Active</p>
        )}
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
            action={isMaintenanceModeActive ? 'Update Settings' : 'Enable'}
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
              marginBottom: '12px',
            }}
          >
            <span style={{ fontWeight: 500, fontSize: '14px' }}>
              Allow Current Resources Updates
            </span>
            <Switch
              checked={maintenaceUpdateAction}
              onChange={handleMaintenanceUpdateActionChange}
              disabled={!isMaintenanceModeActive} // Disable the switch if not in maintenance mode
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
              disabled={!isMaintenanceModeActive} // Disable the switch if not in maintenance mode
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default MaintenanceMode;